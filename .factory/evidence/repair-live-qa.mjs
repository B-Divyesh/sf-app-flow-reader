import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { writeFile } from 'node:fs/promises';

const origin = 'https://app-flow-reader.sociobot.in';
const output = process.argv[2] ?? '.factory/evidence/repair-2/live/browser-qa.json';
const browser = await chromium.launch({ headless: true });
const results = {};

for (const [name, options] of Object.entries({
  desktop: { viewport: { width: 1440, height: 900 } },
  mobile390: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
})) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  const errors = [];
  const external = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => { if (new URL(request.url()).origin !== origin) external.push(request.url()); });

  await page.goto(`${origin}/demo`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Next' }).click();
  const demo = {
    title: await page.title(),
    heading: await page.locator('h1').innerText(),
    position: await page.locator('#reader-position').innerText(),
    liveAnnouncement: await page.locator('#demo-announcement').innerText(),
    currentMarkers: await page.locator('[aria-current="step"]').count(),
    steps: await page.locator('.demo-step').count(),
    overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
    smallTargets: await page.locator('a:visible,button:visible,input:visible').evaluateAll((elements) => elements.filter((element) => {
      const box = element.getBoundingClientRect();
      return box.width < 44 || box.height < 44;
    }).map((element) => element.textContent?.trim())),
  };
  const axe = {};
  for (const scheme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
    await page.goto(origin, { waitUntil: 'networkidle' });
    const analysis = await new AxeBuilder({ page }).analyze();
    axe[scheme] = analysis.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')).map((item) => item.id);
  }
  await page.goto(`${origin}/demo`, { waitUntil: 'networkidle' });
  await page.evaluate(async () => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  const offline = { heading: await page.locator('h1').innerText(), steps: await page.locator('.demo-step').count() };
  await context.setOffline(false);
  results[name] = { demo, axe, offline, external: [...new Set(external)], errors };
  await context.close();
}

const policyContext = await browser.newContext();
const policyPage = await policyContext.newPage();
const statuses = {};
for (const path of ['/', '/demo', '/privacy', '/terms', '/definitely-missing']) {
  statuses[path] = (await policyPage.goto(`${origin}${path}`))?.status();
}
const notFound = { title: await policyPage.title(), heading: await policyPage.locator('h1').innerText() };
const licenseRequests = [];
policyPage.on('request', (request) => { if (request.url().includes('/products/app-flow-reader/verify')) licenseRequests.push(request.url()); });
await policyPage.goto(`${origin}/?license=invalid-live-smoke`, { waitUntil: 'networkidle' });
results.policy = { statuses, notFound, licenseRequests, strippedLicense: !policyPage.url().includes('license=') };
await policyContext.close();
await browser.close();

await writeFile(output, `${JSON.stringify(results, null, 2)}\n`);
console.log(JSON.stringify(results, null, 2));
