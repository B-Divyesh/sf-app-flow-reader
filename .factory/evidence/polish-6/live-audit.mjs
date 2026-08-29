import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const origin = 'https://app-flow-reader.sociobot.in';
const outputDir = new URL('./', import.meta.url);
const output = new URL('./live-audit.json', import.meta.url);
const report = {};

await mkdir(outputDir, { recursive: true });

async function auditViewport(name, options) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext(options);
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  const requests = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('request', (request) => requests.push(request.url()));

  await page.goto(origin, { waitUntil: 'networkidle' });
  const firstScreen = {
    title: await page.title(),
    h1: await page.locator('h1').innerText(),
    audience: await page.locator('.lede').innerText(),
    action: await page.getByRole('link', { name: 'Try it with sample data' }).innerText(),
    facts: await page.locator('.plain-facts').innerText(),
    overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
    factsBottom: await page.locator('.plain-facts').evaluate((element) => {
      const box = element.getBoundingClientRect();
      return Math.ceil(box.bottom);
    }),
    viewportHeight: options.viewport.height,
  };
  await page.screenshot({ path: new URL(`./live-home-${name}.png`, outputDir).pathname, fullPage: false });

  await page.goto(`${origin}/?demo=1`, { waitUntil: 'networkidle' });
  const demo = {
    title: await page.title(),
    heading: await page.locator('h1').innerText(),
    banner: await page.locator('.demo-banner').innerText(),
    steps: await page.locator('.demo-step').count(),
    resetVisible: await page.getByRole('button', { name: 'Reset demo' }).isVisible(),
    startForRealVisible: await page.getByRole('link', { name: 'Start for real', exact: true }).isVisible(),
  };
  await page.screenshot({ path: new URL(`./live-demo-${name}.png`, outputDir).pathname, fullPage: false });
  await page.getByRole('button', { name: /Edit note for Choose New report/ }).click();
  await page.getByRole('textbox', { name: 'Note' }).fill('Temporary demo note');
  await page.getByRole('button', { name: 'Save note' }).click();
  await page.getByRole('link', { name: 'Start for real', exact: true }).click();
  await page.waitForURL(`${origin}/#install-title`);
  demo.exit = {
    url: page.url(),
    installVisible: await page.getByRole('heading', { name: 'Keep the route reader in your toolbar' }).isVisible(),
  };
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  demo.reentryHasTemporaryNote = await page.getByText('Temporary demo note').count() > 0;
  demo.storage = await page.evaluate(async () => ({
    local: Object.keys(localStorage),
    session: Object.keys(sessionStorage),
    indexedDb: await indexedDB.databases(),
  }));
  await page.evaluate(async () => navigator.serviceWorker.ready);
  await page.reload({ waitUntil: 'networkidle' });
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Next' }).click();
  demo.offline = { position: await page.locator('#reader-position').innerText() };
  await context.setOffline(false);

  await page.goto(origin, { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: 'Privacy', exact: true }).first().click();
  const focus = {
    privacyTitle: await page.title(),
    privacyHeadingFocused: await page.getByRole('heading', { level: 1 }).evaluate((element) => element === document.activeElement),
  };
  await page.goBack();
  focus.homeTitle = await page.title();

  const routeMetadata = {};
  for (const route of ['/', '/demo', '/privacy', '/terms']) {
    await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
    routeMetadata[route] = {
      title: await page.title(),
      h1: await page.locator('h1').count(),
      main: await page.locator('main').count(),
      canonical: await page.locator('link[rel="canonical"]').getAttribute('href'),
      ogTitle: await page.locator('meta[property="og:title"]').getAttribute('content'),
    };
  }

  const checkoutPage = await context.newPage();
  await checkoutPage.goto(origin, { waitUntil: 'networkidle' });
  const checkout = checkoutPage.getByRole('link', { name: 'Buy supporter license (opens secure checkout)' });
  const checkoutResponse = checkoutPage.waitForResponse((response) => response.url() === 'https://api.sociobot.in/api/v1/products/app-flow-reader/checkout' && response.status() === 303);
  await checkout.click();
  const response = await checkoutResponse;
  const checkoutDestination = response.headers().location;
  await checkoutPage.waitForURL(/^https:\/\/checkout\.dodopayments\.com\/session\/cks_[A-Za-z0-9]+/);

  report[name] = {
    firstScreen,
    demo,
    focus,
    routeMetadata,
    checkout: {
      label: await checkout.innerText().catch(() => 'Buy supporter license (opens secure checkout)'),
      status: response.status(),
      destination: checkoutDestination,
      finalUrl: checkoutPage.url(),
    },
    consoleErrors,
    pageErrors,
    publicRequests: [...new Set(requests.filter((url) => new URL(url).origin !== origin))],
  };
  await context.close();
  await browser.close();
}

await auditViewport('desktop', { viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
await auditViewport('mobile390', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: 'light' });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'dark', reducedMotion: 'reduce' });
const page = await context.newPage();
const accessibility = {};
for (const route of ['/', '/demo', '/privacy', '/terms', '/definitely-missing']) {
  const response = await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
  const results = await new AxeBuilder({ page }).analyze();
  accessibility[route] = {
    status: response?.status(),
    seriousOrCritical: results.violations
      .filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))
      .map((violation) => `${violation.id}:${violation.nodes.length}`),
  };
}
report.darkReducedAccessibility = accessibility;
await page.goto(`${origin}/definitely-missing`, { waitUntil: 'networkidle' });
report.notFound = {
  title: await page.title(),
  h1: await page.locator('h1').innerText(),
  main: await page.locator('main').count(),
  mainNavigation: await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link').allTextContents(),
  footerNavigation: await page.getByRole('navigation', { name: 'Footer navigation' }).getByRole('link').allTextContents(),
};
await context.close();
await browser.close();

await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
