import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { writeFile } from 'node:fs/promises';

const origin = 'https://app-flow-reader.sociobot.in';
const outputPath = process.argv[2];
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const page = await context.newPage();
const requests = [];
const consoleErrors = [];
const pageErrors = [];
page.on('request', (request) => requests.push(request.url()));
page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('pageerror', (error) => pageErrors.push(error.message));

await page.goto(origin, { waitUntil: 'networkidle' });
const cold = {
  title: await page.title(),
  h1: await page.locator('h1').innerText(),
  audience: await page.locator('.lede').innerText(),
  action: await page.getByRole('link', { name: 'Try it with sample data' }).innerText(),
  viewport: await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth })),
};
await page.screenshot({ path: '.factory/verification-evidence/playwright-mobile-home.png', fullPage: true });
await page.getByRole('link', { name: 'Try it with sample data' }).click();
await page.waitForURL(`${origin}/?demo=1`);
const oneClickDemo = {
  url: page.url(),
  banner: await page.locator('.demo-banner').innerText(),
  steps: await page.locator('.demo-step').count(),
  position: await page.locator('#reader-position').innerText(),
};

await page.getByRole('button', { name: /Edit note for Choose New report/ }).focus();
await page.keyboard.press('Enter');
const dialogFocus = await page.getByRole('textbox', { name: 'Note' }).evaluate((element) => document.activeElement === element);
await page.keyboard.press('Escape');
const dialogReturnFocus = await page.getByRole('button', { name: /Edit note for Choose New report/ }).evaluate((element) => document.activeElement === element);

const storage = await page.evaluate(async () => ({
  local: Object.keys(localStorage),
  session: Object.keys(sessionStorage),
  indexedDB: await indexedDB.databases(),
  cookies: document.cookie,
}));

await page.evaluate(async () => navigator.serviceWorker.ready);
const serviceWorker = await page.evaluate(async () => {
  const registration = await navigator.serviceWorker.ready;
  await registration.update();
  return { active: registration.active?.scriptURL, installing: registration.installing?.scriptURL ?? null, waiting: registration.waiting?.scriptURL ?? null };
});
await page.reload({ waitUntil: 'networkidle' });
await context.setOffline(true);
await page.reload({ waitUntil: 'domcontentloaded' });
await page.getByRole('button', { name: 'Next' }).click();
const offline = { heading: await page.locator('h1').innerText(), position: await page.locator('#reader-position').innerText(), steps: await page.locator('.demo-step').count() };
await context.setOffline(false);

await page.goto(origin);
await page.keyboard.press('Tab');
const skipFocus = await page.locator(':focus').evaluate((element) => {
  const style = getComputedStyle(element);
  return { text: element.textContent?.trim(), width: style.outlineWidth, style: style.outlineStyle, color: style.outlineColor };
});
await page.keyboard.press('Enter');
const skipTarget = await page.evaluate(() => document.activeElement?.id);

await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
const reducedMotion = await page.evaluate(() => {
  const style = getComputedStyle(document.querySelector('.button'));
  return { matches: matchMedia('(prefers-reduced-motion: reduce)').matches, transitionDuration: style.transitionDuration, animationDuration: style.animationDuration, scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior };
});

await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
const textResize = await page.evaluate(() => ({ viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth, actionVisible: Boolean(document.querySelector('.hero-actions')?.getBoundingClientRect().width) }));

const hrefs = new Set();
for (const route of ['/', '/demo', '/privacy', '/terms', '/404.html']) {
  await page.goto(`${origin}${route}`);
  for (const href of await page.locator('a[href]').evaluateAll((links) => links.map((link) => link.href))) hrefs.add(href);
}
const links = [];
for (const href of [...hrefs].sort()) {
  const url = new URL(href);
  if (url.protocol === 'mailto:') { links.push({ href, status: 'mailto' }); continue; }
  if (url.origin === 'https://api.sociobot.in') { links.push({ href, status: 'checkout-covered-separately' }); continue; }
  const response = await context.request.get(href, { maxRedirects: 5 });
  links.push({ href, status: response.status(), finalUrl: response.url() });
}

const axeSeriousCritical = {};
for (const scheme of ['light', 'dark']) {
  await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
  for (const route of ['/', '/demo', '/privacy', '/terms', '/definitely-missing']) {
    await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
    const analysis = await new AxeBuilder({ page }).analyze();
    axeSeriousCritical[`${scheme}:${route}`] = analysis.violations
      .filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))
      .map((item) => `${item.id}:${item.nodes.length}`);
  }
}

const result = {
  cold,
  oneClickDemo,
  keyboard: { dialogFocus, dialogReturnFocus, skipFocus, skipTarget },
  storage,
  serviceWorker,
  offline,
  reducedMotion,
  textResize,
  links,
  axeSeriousCritical,
  requests: [...new Set(requests)],
  crossOriginRequests: [...new Set(requests.filter((url) => new URL(url).origin !== origin))],
  consoleErrors,
  pageErrors,
};
await writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
await browser.close();
