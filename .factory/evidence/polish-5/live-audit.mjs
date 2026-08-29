import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const origin = 'https://app-flow-reader.sociobot.in';
const browser = await chromium.launch({ headless: true });
const results = {};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function hash(contents) {
  return createHash('sha256').update(contents).digest('hex');
}

async function routeMetadata(page, path) {
  const response = await page.goto(`${origin}${path}`, { waitUntil: 'networkidle' });
  return {
    status: response?.status(),
    title: await page.title(),
    description: await page.locator('meta[name="description"]').getAttribute('content'),
    canonical: await page.locator('link[rel="canonical"]').getAttribute('href'),
    ogTitle: await page.locator('meta[property="og:title"]').getAttribute('content'),
    ogDescription: await page.locator('meta[property="og:description"]').getAttribute('content'),
    ogUrl: await page.locator('meta[property="og:url"]').getAttribute('content'),
    twitterTitle: await page.locator('meta[name="twitter:title"]').getAttribute('content'),
    h1: await page.locator('h1').count(),
    main: await page.locator('main').count(),
  };
}

const mobileContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});
const mobile = await mobileContext.newPage();
const mobileErrors = [];
const mobileRequests = [];
mobile.on('console', (message) => { if (message.type() === 'error') mobileErrors.push(message.text()); });
mobile.on('pageerror', (error) => mobileErrors.push(error.message));
mobile.on('request', (request) => mobileRequests.push(request.url()));

await mobile.goto(origin, { waitUntil: 'networkidle' });
const action = mobile.getByRole('link', { name: 'Try it with sample data' });
const actionBox = await action.boundingBox();
const factsBox = await mobile.locator('.plain-facts').boundingBox();
const firstScreen = {
  kicker: (await mobile.locator('.hero .kicker').textContent()).trim(),
  rejectedSloganCount: await mobile.getByText('A steady path through dense workplace apps').count(),
  heading: await mobile.locator('h1').innerText(),
  audience: await mobile.locator('.lede').innerText(),
  action: await action.innerText(),
  facts: await mobile.locator('.plain-facts').innerText(),
  actionBottom: actionBox.y + actionBox.height,
  factsBottom: factsBox.y + factsBox.height,
  overflow: await mobile.evaluate(() => document.documentElement.scrollWidth > innerWidth),
};
assert(firstScreen.kicker === 'Browser extension for progressive low vision', 'F-5-1 literal kicker is missing');
assert(firstScreen.rejectedSloganCount === 0, 'F-5-1 rejected slogan remains');
assert(firstScreen.heading === 'Follow saved routes through dense workplace apps', 'Cold headline is wrong');
assert(firstScreen.audience.includes('progressive low vision'), 'Cold audience is missing');
assert(firstScreen.actionBottom <= 844 && firstScreen.factsBottom <= 844, 'Primary action or facts fall below the first screen');
for (const fact of ['private', 'offline', 'free', '$12']) {
  assert(firstScreen.facts.toLowerCase().includes(fact), `Missing first-screen fact: ${fact}`);
}
assert(!firstScreen.overflow, 'Home has horizontal overflow at 390 px');
await mobile.screenshot({ path: '.factory/evidence/polish-5/live-home-mobile.png' });

await action.click();
assert(mobile.url() === `${origin}/?demo=1`, 'One-click demo did not use ?demo=1');
const demo = {
  banner: await mobile.locator('.demo-banner').innerText(),
  steps: await mobile.locator('.demo-step').count(),
  current: await mobile.locator('#reader-position').innerText(),
  smallTargets: await mobile.locator('a:visible,button:visible,input:visible').evaluateAll((elements) => elements.filter((element) => {
    const box = element.getBoundingClientRect();
    return box.width < 44 || box.height < 44;
  }).map((element) => `${element.tagName}:${element.textContent?.trim()}`)),
};
assert(demo.banner.includes('Sample data. Nothing is saved.') && demo.banner.includes('Reset demo') && demo.banner.includes('Leave demo'), 'Demo banner is incomplete');
assert(demo.steps === 5 && demo.current.toLowerCase() === 'step 1 of 5', 'Demo is not immediately usable');
assert(demo.smallTargets.length === 0, 'Demo has a target below 44 px');
await mobile.screenshot({ path: '.factory/evidence/polish-5/live-demo-mobile.png' });

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
assert(isolation.editedNoteCount === 0, 'Leaving the demo retained an edit');
assert(JSON.stringify(isolation.storage) === JSON.stringify({ local: [], session: [], databases: [] }), 'Demo wrote durable storage');
await mobile.getByRole('button', { name: 'Next' }).click();
await mobile.getByRole('button', { name: 'Reset demo' }).click();
assert((await mobile.locator('#reader-position').innerText()).toLowerCase() === 'step 1 of 5', 'Reset demo did not restore Step 1');
results.mobileColdDemo = {
  firstScreen,
  demo,
  isolation,
  errors: mobileErrors,
  crossOrigin: [...new Set(mobileRequests.filter((url) => new URL(url).origin !== origin))],
};
assert(mobileErrors.length === 0 && results.mobileColdDemo.crossOrigin.length === 0, 'Cold home/demo emitted an error or cross-origin request');
await mobileContext.close();

const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const routes = {};
for (const path of ['/', '/demo', '/privacy', '/terms']) routes[path] = await routeMetadata(page, path);
for (const [path, data] of Object.entries(routes)) {
  assert(data.status === 200 && data.h1 === 1 && data.main === 1, `${path} route skeleton failed`);
  assert(data.title === data.ogTitle && data.title === data.twitterTitle, `${path} social title does not match`);
  assert(data.canonical === data.ogUrl, `${path} canonical and Open Graph URL do not match`);
  assert(data.description === data.ogDescription, `${path} descriptions do not match`);
}

const discoveredLinks = new Set();
for (const path of ['/', '/demo', '/privacy', '/terms', '/definitely-missing']) {
  await page.goto(`${origin}${path}`, { waitUntil: 'networkidle' });
  for (const href of await page.locator('a').evaluateAll((anchors) => anchors.map((anchor) => anchor.href))) discoveredLinks.add(href);
}
const links = {};
for (const href of [...discoveredLinks].sort()) {
  if (href.startsWith('mailto:') || href === `${origin}/definitely-missing#main`) continue;
  const response = await fetch(href, { redirect: 'manual', signal: AbortSignal.timeout(15_000) });
  links[href] = response.status;
  assert(response.status >= 200 && response.status < 400, `Dead link: ${href} returned ${response.status}`);
}
assert(links[`${origin}/privacy`] === 200 && links[`${origin}/terms`] === 200, 'Legal links are not healthy');

await page.goto(origin, { waitUntil: 'networkidle' });
await page.getByRole('link', { name: 'Privacy', exact: true }).first().click();
const privacyFocus = await page.locator('h1').evaluate((element) => element === document.activeElement);
const privacyCopy = await page.locator('main').innerText();
await page.goBack();
const homeFocusAfterBack = await page.locator('h1').evaluate((element) => element === document.activeElement);
assert(privacyFocus && homeFocusAfterBack, 'SPA navigation or browser Back did not focus the h1');
assert(privacyCopy.includes('no background network request until you restore a supporter token') && privacyCopy.includes('only api.sociobot.in'), 'Privacy network boundary copy is stale');

const missing = await routeMetadata(page, '/definitely-missing');
missing.navigation = await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link').allTextContents();
missing.appleTouchIcon = await page.locator('link[rel="apple-touch-icon"]').getAttribute('href');
missing.twitterImage = await page.locator('meta[name="twitter:image"]').getAttribute('content');
missing.themeColors = await page.locator('meta[name="theme-color"]').count();
assert(missing.status === 404 && missing.title === 'Page not found — App Flow Reader', 'Missing URL is not a designed HTTP 404');
for (const label of ['Demo', 'How it works', 'Privacy', 'Download']) assert(missing.navigation.includes(label), `404 navigation is missing ${label}`);
assert(missing.appleTouchIcon === '/apple-touch-icon.png' && missing.twitterImage.endsWith('/og-image.png') && missing.themeColors === 2, '404 metadata is incomplete');
await page.screenshot({ path: '.factory/evidence/polish-5/live-404-desktop.png', fullPage: true });

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
await page.getByRole('button', { name: 'Next' }).click();
const offline = {
  steps: await page.locator('.demo-step').count(),
  heading: await page.locator('h1').innerText(),
  current: await page.locator('#reader-position').innerText(),
};
assert(offline.steps === 5 && offline.current.toLowerCase() === 'step 2 of 5', 'Offline demo did not remain operable');
await context.setOffline(false);

const liveZip = Buffer.from(await (await fetch(`${origin}/downloads/app-flow-reader-chrome.zip`)).arrayBuffer());
const localZip = await readFile('dist/site/downloads/app-flow-reader-chrome.zip');
const packageHashes = { live: hash(liveZip), local: hash(localZip) };
assert(packageHashes.live === packageHashes.local, 'Live extension ZIP does not match the tested build');
results.routesFocus404 = { routes, links, privacyFocus, homeFocusAfterBack, missing, axe, offline, packageHashes };

await context.close();
await browser.close();
await writeFile('.factory/evidence/polish-5/live-audit.json', `${JSON.stringify(results, null, 2)}\n`);
console.log(JSON.stringify(results, null, 2));
