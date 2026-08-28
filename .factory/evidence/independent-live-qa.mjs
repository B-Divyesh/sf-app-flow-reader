import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { readFile, writeFile } from 'node:fs/promises';

const origin = 'https://app-flow-reader.sociobot.in';
const results = {};

async function checkSite(name, contextOptions) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  const crossOrigin = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.origin !== origin) crossOrigin.push(request.url());
  });

  await page.goto(origin, { waitUntil: 'networkidle' });
  const firstRead = {
    title: await page.title(),
    h1: await page.locator('h1').innerText(),
    audience: await page.locator('.lede').innerText(),
    primaryAction: await page.getByRole('link', { name: 'Try it with sample data' }).innerText(),
  };
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await page.waitForURL(`${origin}/demo`);
  const demoBanner = await page.locator('.demo-banner').innerText();
  const initialSteps = await page.locator('.demo-step').count();

  await page.getByRole('button', { name: /Edit note for Invite teammate/ }).evaluate((element) => element.click());
  await page.getByRole('textbox', { name: 'Note' }).fill('x'.repeat(280));
  await page.getByRole('button', { name: 'Save note' }).evaluate((element) => element.click());
  const inviteStep = page.locator('.demo-step').filter({ hasText: 'Invite teammate' });
  await inviteStep.locator('.note').waitFor();
  const boundaryNoteLength = (await inviteStep.locator('.note').innerText()).length;

  await page.getByRole('button', { name: /Edit note for Invite teammate/ }).evaluate((element) => element.click());
  await page.getByRole('textbox', { name: 'Note' }).fill('   ');
  await page.getByRole('button', { name: 'Save note' }).evaluate((element) => element.click());
  const blankNoteCount = await inviteStep.locator('.note').count();

  await page.getByRole('button', { name: 'Remove Invite teammate' }).evaluate((element) => element.click());
  const afterRemove = await page.locator('.demo-step').count();
  await page.getByRole('button', { name: 'Undo' }).evaluate((element) => element.click());
  const afterUndo = await page.locator('.demo-step').count();

  const markdownEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export Markdown' }).click();
  const markdown = await markdownEvent;
  const markdownText = await readFile(await markdown.path(), 'utf8');
  const jsonEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  const json = await jsonEvent;
  const jsonData = JSON.parse(await readFile(await json.path(), 'utf8'));

  const storage = await page.evaluate(async () => ({
    local: Object.keys(localStorage),
    session: Object.keys(sessionStorage),
    indexedDB: await indexedDB.databases(),
  }));

  const routeAxe = {};
  for (const route of ['/', '/demo', '/privacy', '/terms', '/missing-path']) {
    await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
    const analysis = await new AxeBuilder({ page }).analyze();
    routeAxe[route] = analysis.violations
      .filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))
      .map((item) => `${item.id}:${item.nodes.length}`);
  }

  await page.goto(`${origin}/demo`, { waitUntil: 'networkidle' });
  const layout = await page.evaluate(() => ({
    viewport: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    smallTargets: [...document.querySelectorAll('a,button')]
      .filter((element) => {
        const style = getComputedStyle(element);
        if (style.visibility === 'hidden' || style.display === 'none') return false;
        const box = element.getBoundingClientRect();
        if (box.width === 0 || box.height === 0) return false;
        return box.width < 44 || box.height < 44;
      })
      .map((element) => `${element.tagName}:${element.textContent?.trim()}`),
  }));

  await page.goto(origin);
  await page.keyboard.press('Tab');
  const focus = await page.locator(':focus').evaluate((element) => {
    const style = getComputedStyle(element);
    return { text: element.textContent?.trim(), outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth, outlineColor: style.outlineColor };
  });

  await page.goto(`${origin}/demo`, { waitUntil: 'networkidle' });
  await page.evaluate(async () => navigator.serviceWorker.ready);
  const serviceWorker = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
    return { active: registration.active?.scriptURL, updateViaCache: registration.updateViaCache };
  });
  await page.reload({ waitUntil: 'networkidle' });
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  const offline = { h1: await page.locator('h1').innerText(), steps: await page.locator('.demo-step').count() };
  await context.setOffline(false);

  results[name] = {
    firstRead,
    demoBanner,
    initialSteps,
    boundaryNoteLength,
    blankNoteCount,
    afterRemove,
    afterUndo,
    markdown: { filename: markdown.suggestedFilename(), hasFive: markdownText.includes('5. **Page change:** Invitation sent') },
    json: { filename: json.suggestedFilename(), steps: jsonData.steps.length },
    storage,
    axeSeriousCritical: routeAxe,
    layout,
    focus,
    serviceWorker,
    offline,
    consoleErrors,
    pageErrors,
    crossOrigin: [...new Set(crossOrigin)],
  };

  await browser.close();
}

await checkSite('desktop', { viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
await checkSite('mobile390', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: 'light' });

const darkBrowser = await chromium.launch({ headless: true });
const darkContext = await darkBrowser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark', reducedMotion: 'reduce' });
const darkPage = await darkContext.newPage();
const darkAxe = {};
for (const route of ['/', '/demo']) {
  await darkPage.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
  const analysis = await new AxeBuilder({ page: darkPage }).analyze();
  darkAxe[route] = analysis.violations
    .filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))
    .map((item) => `${item.id}:${item.nodes.length}`);
}
await darkPage.goto(origin);
const reducedMotion = await darkPage.evaluate(() => {
  const button = document.querySelector('.button');
  const style = getComputedStyle(button);
  return { matches: matchMedia('(prefers-reduced-motion: reduce)').matches, transitionDuration: style.transitionDuration, animationDuration: style.animationDuration, scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior };
});
results.darkReduced = { axeSeriousCritical: darkAxe, reducedMotion };
await darkBrowser.close();

const output = `${JSON.stringify(results, null, 2)}\n`;
if (process.argv[2]) await writeFile(process.argv[2], output);
console.log(output);
