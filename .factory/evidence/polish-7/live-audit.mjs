import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const origin = 'https://app-flow-reader.sociobot.in';
const evidenceDir = new URL('./', import.meta.url);
await mkdir(evidenceDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const report = {
  checkedAt: new Date().toISOString(),
  origin,
  consoleErrors: [],
  requestFailures: [],
  routes: {},
  axe: {},
};

const desktop = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  colorScheme: 'light',
});
const page = await desktop.newPage();
page.on('console', (message) => {
  if (message.type() === 'error') report.consoleErrors.push(message.text());
});
page.on('requestfailed', (request) => {
  report.requestFailures.push(`${request.method()} ${request.url()}: ${request.failure()?.errorText}`);
});

for (const route of ['/', '/demo', '/privacy', '/terms', '/definitely-missing']) {
  const response = await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
  const key = route === '/' ? 'home' : route.slice(1);
  report.routes[key] = await page.evaluate(() => ({
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content,
    canonical: document.querySelector('link[rel="canonical"]')?.href,
    ogTitle: document.querySelector('meta[property="og:title"]')?.content,
    twitterTitle: document.querySelector('meta[name="twitter:title"]')?.content,
    h1: [...document.querySelectorAll('h1')].map((heading) => heading.textContent?.trim()),
    mains: document.querySelectorAll('main').length,
    header: Boolean(document.querySelector('header nav')),
    footer: Boolean(document.querySelector('footer')),
    focused: document.activeElement?.tagName,
  }));
  report.routes[key].status = response?.status();
  const axe = await new AxeBuilder({ page }).analyze();
  report.axe[key] = axe.violations
    .filter(({ impact }) => impact === 'serious' || impact === 'critical')
    .map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.length }));
}

await page.goto(`${origin}/`, { waitUntil: 'networkidle' });
await page.screenshot({ path: new URL('live-home-desktop.png', evidenceDir).pathname, fullPage: true });
await page.goto(`${origin}/?demo=1`, { waitUntil: 'networkidle' });
await page.screenshot({ path: new URL('live-demo-desktop.png', evidenceDir).pathname, fullPage: true });

report.demo = await page.evaluate(() => ({
  banner: document.querySelector('.demo-banner')?.textContent?.replace(/\s+/g, ' ').trim(),
  reset: document.querySelector('#demo-reset')?.textContent?.trim(),
  startForReal: document.querySelector('#demo-leave')?.textContent?.trim(),
  steps: document.querySelectorAll('.step-row').length,
  nextLabel: document.querySelector('#demo-next')?.textContent?.trim(),
  backDisabled: document.querySelector('#demo-back')?.hasAttribute('disabled'),
}));

await page.getByRole('button', { name: /edit note/i }).first().click();
await page.getByLabel(/note/i).fill('Temporary live-audit note');
await page.getByRole('button', { name: /save note/i }).click();
await page.getByRole('link', { name: 'Start for real' }).click();
await page.goto(`${origin}/?demo=1`, { waitUntil: 'networkidle' });
report.demoIsolation = await page.evaluate(async () => ({
  temporaryNoteVisible: document.body.textContent?.includes('Temporary live-audit note'),
  localStorageKeys: Object.keys(localStorage),
  sessionStorageKeys: Object.keys(sessionStorage),
  indexedDatabases: 'databases' in indexedDB ? (await indexedDB.databases()).map(({ name }) => name) : [],
}));

await desktop.setOffline(true);
await page.reload({ waitUntil: 'domcontentloaded' });
await page.getByRole('button', { name: 'Next step' }).click();
report.offline = {
  url: page.url(),
  nextStep: await page.locator('.reader-count').textContent(),
  heading: await page.locator('h1').textContent(),
};
await desktop.setOffline(false);

const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  colorScheme: 'light',
  reducedMotion: 'reduce',
});
const mobilePage = await mobile.newPage();
await mobilePage.goto(`${origin}/?demo=1`, { waitUntil: 'networkidle' });
const nextBox = await mobilePage.locator('#demo-next').boundingBox();
const backBox = await mobilePage.locator('#demo-back').boundingBox();
report.mobileDemo = await mobilePage.evaluate(() => ({
  viewport: { width: innerWidth, height: innerHeight },
  bodyScrollWidth: document.body.scrollWidth,
  nextEnabled: !document.querySelector('#demo-next')?.hasAttribute('disabled'),
  backDisabled: document.querySelector('#demo-back')?.hasAttribute('disabled'),
  banner: document.querySelector('.demo-banner')?.textContent?.replace(/\s+/g, ' ').trim(),
}));
report.mobileDemo.nextBox = nextBox;
report.mobileDemo.backBox = backBox;
report.mobileDemo.nextInsideFirstViewport = Boolean(nextBox && nextBox.y + nextBox.height <= 844);
report.mobileDemo.backInsideFirstViewport = Boolean(backBox && backBox.y + backBox.height <= 844);
await mobilePage.screenshot({
  path: new URL('live-demo-mobile390.png', evidenceDir).pathname,
  fullPage: false,
});

await mobilePage.goto(`${origin}/`, { waitUntil: 'networkidle' });
report.mobileHome = await mobilePage.evaluate(() => ({
  h1: document.querySelector('h1')?.textContent?.trim(),
  action: document.querySelector('.hero-actions a')?.textContent?.trim(),
  facts: [...document.querySelectorAll('.hero-facts strong')].map((node) => node.textContent?.trim()),
  bodyScrollWidth: document.body.scrollWidth,
}));
await mobilePage.screenshot({
  path: new URL('live-home-mobile390.png', evidenceDir).pathname,
  fullPage: false,
});

const checkout = await desktop.request.get(
  'https://api.sociobot.in/api/v1/products/app-flow-reader/checkout',
  { maxRedirects: 0 },
);
report.checkout = {
  status: checkout.status(),
  location: checkout.headers().location,
  httpsHostedCheckout: checkout.headers().location?.startsWith('https://checkout.dodopayments.com/'),
};

const liveZip = await desktop.request.get(`${origin}/downloads/app-flow-reader-chrome.zip`);
const liveZipBytes = await liveZip.body();
const localZipBytes = await readFile(new URL('../../../dist/site/downloads/app-flow-reader-chrome.zip', import.meta.url));
report.package = {
  status: liveZip.status(),
  liveSha256: createHash('sha256').update(liveZipBytes).digest('hex'),
  localSha256: createHash('sha256').update(localZipBytes).digest('hex'),
};
report.package.matchesLocal = report.package.liveSha256 === report.package.localSha256;

await desktop.close();
await mobile.close();
await browser.close();

const failures = [];
if (report.consoleErrors.length) failures.push('console errors');
if (report.requestFailures.length) failures.push('request failures');
if (Object.values(report.axe).some((violations) => violations.length)) failures.push('axe serious/critical violations');
if (report.routes['definitely-missing'].status !== 404) failures.push('missing route did not return 404');
if (!report.mobileDemo.nextInsideFirstViewport) failures.push('mobile Next action falls below the first viewport');
if (report.mobileDemo.bodyScrollWidth > 390 || report.mobileHome.bodyScrollWidth > 390) failures.push('horizontal overflow');
if (report.demoIsolation.temporaryNoteVisible) failures.push('demo note persisted after exit');
if (report.demoIsolation.localStorageKeys.length || report.demoIsolation.sessionStorageKeys.length || report.demoIsolation.indexedDatabases.length) failures.push('demo wrote durable browser storage');
if (report.offline.nextStep?.trim() !== 'Step 2 of 5') failures.push('offline demo did not advance');
if (!report.checkout.httpsHostedCheckout || report.checkout.status !== 303) failures.push('checkout redirect is wrong');
if (!report.package.matchesLocal) failures.push('live extension package differs from tested package');

report.result = failures.length ? { pass: false, failures } : { pass: true };
await writeFile(new URL('live-audit.json', evidenceDir), `${JSON.stringify(report, null, 2)}\n`);
if (failures.length) {
  throw new Error(`Live audit failed: ${failures.join(', ')}`);
}
console.log(JSON.stringify(report, null, 2));
