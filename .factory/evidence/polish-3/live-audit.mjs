import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const origin = 'https://app-flow-reader.sociobot.in';
const output = new URL('./live-audit.json', import.meta.url);
const browser = await chromium.launch({ headless: true });
const results = {};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function metadata(page, path) {
  const response = await page.goto(`${origin}${path}`, { waitUntil: 'networkidle' });
  return {
    status: response?.status(),
    title: await page.title(),
    description: await page.locator('meta[name="description"]').getAttribute('content'),
    canonical: await page.locator('link[rel="canonical"]').getAttribute('href'),
    ogTitle: await page.locator('meta[property="og:title"]').getAttribute('content'),
    ogUrl: await page.locator('meta[property="og:url"]').getAttribute('content'),
    twitterTitle: await page.locator('meta[name="twitter:title"]').getAttribute('content'),
    h1: await page.locator('h1').count(),
    main: await page.locator('main').count(),
  };
}

const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const mobile = await mobileContext.newPage();
const mobileErrors = [];
const mobileRequests = [];
mobile.on('console', (message) => { if (message.type() === 'error') mobileErrors.push(message.text()); });
mobile.on('pageerror', (error) => mobileErrors.push(error.message));
mobile.on('request', (request) => mobileRequests.push(request.url()));
await mobile.goto(origin, { waitUntil: 'networkidle' });
const action = mobile.getByRole('link', { name: 'Try it with sample data' });
const facts = mobile.locator('.plain-facts');
const firstScreen = {
  heading: await mobile.locator('h1').innerText(),
  audience: await mobile.locator('.lede').innerText(),
  action: await action.innerText(),
  facts: await facts.innerText(),
  actionBottom: (await action.boundingBox())?.y + (await action.boundingBox())?.height,
  factsBottom: (await facts.boundingBox())?.y + (await facts.boundingBox())?.height,
};
assert(firstScreen.heading === 'Follow saved routes through dense workplace apps', 'Cold headline is wrong');
assert(firstScreen.audience.includes('progressive low vision'), 'Cold audience is missing');
assert(firstScreen.actionBottom <= 844 && firstScreen.factsBottom <= 844, 'First-screen action or facts fall below the mobile viewport');
for (const fact of ['private', 'offline', 'free', '$12']) assert(firstScreen.facts.toLowerCase().includes(fact), `Missing first-screen fact: ${fact}`);

await action.click();
assert(mobile.url() === `${origin}/?demo=1`, 'Hero demo action did not preserve the direct ?demo=1 entry point');
const demo = {
  banner: await mobile.locator('.demo-banner').innerText(),
  steps: await mobile.locator('.demo-step').count(),
  current: await mobile.locator('#reader-position').innerText(),
  overflow: await mobile.evaluate(() => document.documentElement.scrollWidth > innerWidth),
  smallTargets: await mobile.locator('a:visible,button:visible,input:visible').evaluateAll((elements) => elements.filter((element) => {
    const box = element.getBoundingClientRect();
    return box.width < 44 || box.height < 44;
  }).map((element) => element.textContent?.trim())),
};
assert(demo.banner.includes('Sample data. Nothing is saved.') && demo.banner.includes('Reset demo') && demo.banner.includes('Leave demo'), 'Demo banner is incomplete');
assert(demo.steps === 5 && demo.current.toLowerCase() === 'step 1 of 5', 'Demo did not open ready to use');
assert(!demo.overflow && demo.smallTargets.length === 0, 'Mobile demo overflows or has undersized targets');
await mobile.getByRole('button', { name: /Edit note for Choose New report/ }).click();
await mobile.getByRole('textbox', { name: 'Note' }).fill('Discard this demo edit.');
await mobile.getByRole('button', { name: 'Save note' }).click();
await mobile.getByRole('link', { name: 'Leave demo' }).click();
await mobile.getByRole('link', { name: 'Try it with sample data' }).click();
const isolation = {
  editedNoteCount: await mobile.getByText('Discard this demo edit.').count(),
  storage: await mobile.evaluate(async () => ({
    local: Object.keys(localStorage),
    session: Object.keys(sessionStorage),
    databases: await indexedDB.databases(),
  })),
};
assert(isolation.editedNoteCount === 0, 'Leave demo retained an edit');
assert(JSON.stringify(isolation.storage) === JSON.stringify({ local: [], session: [], databases: [] }), 'Demo wrote durable storage');
results.mobileColdDemo = { firstScreen, demo, isolation, errors: mobileErrors, crossOrigin: [...new Set(mobileRequests.filter((url) => new URL(url).origin !== origin))] };
assert(mobileErrors.length === 0 && results.mobileColdDemo.crossOrigin.length === 0, 'Cold home/demo emitted an error or cross-origin request');
await mobileContext.close();

const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const routes = {};
for (const path of ['/', '/demo', '/privacy', '/terms']) routes[path] = await metadata(page, path);
for (const [path, data] of Object.entries(routes)) {
  assert(data.status === 200 && data.h1 === 1 && data.main === 1, `${path} route skeleton failed`);
  assert(data.title === data.ogTitle && data.title === data.twitterTitle, `${path} social title does not match`);
  assert(data.canonical === data.ogUrl, `${path} canonical and OG URL do not match`);
}
await page.goto(origin, { waitUntil: 'networkidle' });
await page.getByRole('link', { name: 'Privacy', exact: true }).first().click();
const privacyFocus = await page.locator('h1').evaluate((element) => element === document.activeElement);
const privacyCopy = await page.locator('main').innerText();
await page.goBack();
const homeFocusAfterBack = await page.locator('h1').evaluate((element) => element === document.activeElement);
assert(privacyFocus && homeFocusAfterBack, 'SPA route focus did not move to the h1');
assert(privacyCopy.includes('no background network request until you restore a supporter token') && privacyCopy.includes('only api.sociobot.in'), 'Live privacy network boundary copy is stale');

const missing = await metadata(page, '/definitely-missing');
missing.navigation = await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link').allTextContents();
missing.appleTouchIcon = await page.locator('link[rel="apple-touch-icon"]').getAttribute('href');
missing.twitterImage = await page.locator('meta[name="twitter:image"]').getAttribute('content');
missing.themeColors = await page.locator('meta[name="theme-color"]').count();
assert(missing.status === 404 && missing.title === 'Page not found — App Flow Reader', 'Missing route is not a designed HTTP 404');
for (const label of ['Demo', 'How it works', 'Privacy', 'Download']) assert(missing.navigation.includes(label), `404 navigation is missing ${label}`);
assert(missing.appleTouchIcon === '/apple-touch-icon.png' && missing.twitterImage?.endsWith('/og-image.png') && missing.themeColors === 2, '404 metadata is incomplete');

const axe = {};
for (const scheme of ['light', 'dark']) {
  await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
  axe[scheme] = {};
  for (const path of ['/', '/demo', '/privacy', '/terms', '/definitely-missing']) {
    await page.goto(`${origin}${path}`, { waitUntil: 'networkidle' });
    const report = await new AxeBuilder({ page }).analyze();
    axe[scheme][path] = report.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')).map((item) => item.id);
    assert(axe[scheme][path].length === 0, `${scheme} ${path} has serious or critical Axe findings`);
  }
}

await page.goto(`${origin}/demo`, { waitUntil: 'networkidle' });
await page.evaluate(async () => navigator.serviceWorker.ready);
await page.reload({ waitUntil: 'networkidle' });
await context.setOffline(true);
await page.reload({ waitUntil: 'domcontentloaded' });
const offline = { steps: await page.locator('.demo-step').count(), heading: await page.locator('h1').innerText() };
assert(offline.steps === 5, 'Offline demo did not retain its sample');
await context.setOffline(false);

const liveZip = Buffer.from(await (await fetch(`${origin}/downloads/app-flow-reader-chrome.zip`)).arrayBuffer());
const localZip = await readFile('dist/site/downloads/app-flow-reader-chrome.zip');
const hash = (contents) => createHash('sha256').update(contents).digest('hex');
const packageHashes = { live: hash(liveZip), local: hash(localZip) };
assert(packageHashes.live === packageHashes.local, 'Live extension ZIP does not match the tested build');
results.routesFocus404 = { routes, privacyFocus, homeFocusAfterBack, missing, axe, offline, packageHashes };

await context.close();
await browser.close();
await writeFile(output, `${JSON.stringify(results, null, 2)}\n`);
console.log(JSON.stringify(results, null, 2));
