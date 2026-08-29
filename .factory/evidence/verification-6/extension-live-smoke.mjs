import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const extensionPath = resolve(process.argv[2]);
const outputPath = process.argv[3];
const context = await chromium.launchPersistentContext('', {
  headless: true,
  channel: 'chromium',
  args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
});

try {
  let worker = context.serviceWorkers()[0];
  if (!worker) worker = await context.waitForEvent('serviceworker');
  const extensionId = new URL(worker.url()).host;
  const state = () => worker.evaluate(async () => (await globalThis.chrome.storage.local.get('app-flow-reader:state'))['app-flow-reader:state']);
  const pageErrors = [];
  const consoleErrors = [];
  const externalRequests = [];
  context.on('request', (request) => {
    const url = request.url();
    if (!url.startsWith('https://app-flow-reader.sociobot.in') && !url.startsWith('chrome-extension://')) externalRequests.push(url);
  });

  const page = await context.newPage();
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  await page.goto('https://app-flow-reader.sociobot.in/demo', { waitUntil: 'networkidle' });
  const popup = await context.newPage();
  popup.on('pageerror', (error) => pageErrors.push(error.message));
  popup.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  await popup.goto(`chrome-extension://${extensionId}/popup.html`);

  await popup.getByLabel('Route name').fill('Approve monthly expenses');
  await popup.getByRole('button', { name: 'Start recording' }).click();
  await page.bringToFront();
  await page.evaluate(() => {
    document.querySelector('main').insertAdjacentHTML('afterbegin', '<span id="qa-save-name">Save report</span><button id="qa-named" aria-labelledby="qa-save-name"><img alt="disk icon"></button><label for="qa-password">Work password</label><input id="qa-password" type="password"><div id="qa-boundary"></div>');
    document.querySelector('#qa-named').click();
    const password = document.querySelector('#qa-password');
    password.value = 'must-not-leave-this-field';
    password.click();
    const host = document.querySelector('#qa-boundary');
    for (let index = 1; index <= 12; index += 1) {
      const button = document.createElement('button');
      button.textContent = `Boundary step ${index}`;
      host.append(button);
      button.click();
    }
  });
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 900));
  const firstRoute = await state();

  await page.bringToFront();
  const tabId = await worker.evaluate(async () => (await globalThis.chrome.tabs.query({ active: true, currentWindow: true }))[0]?.id);
  await popup.evaluate(async ({ routeId, tabId }) => globalThis.chrome.runtime.sendMessage({ type: 'afr:follow', id: routeId, tabId }), { routeId: firstRoute.flow.id, tabId });
  const reader = page.getByRole('complementary', { name: 'App Flow Reader controls' });
  await reader.waitFor();
  await reader.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Save report' }).waitFor();
  const readerState = {
    text: await reader.innerText(),
    saveOutlineWidth: await page.getByRole('button', { name: 'Save report' }).evaluate((element) => getComputedStyle(element).outlineWidth),
    controls: await Promise.all(['Back', 'Next'].map(async (name) => {
      const box = await reader.getByRole('button', { name }).boundingBox();
      return { name, width: box?.width, height: box?.height };
    })),
  };
  await reader.getByRole('button', { name: 'Next' }).focus();
  readerState.focus = await reader.getByRole('button', { name: 'Next' }).evaluate((element) => {
    const style = getComputedStyle(element);
    return { outline: style.outline, boxShadow: style.boxShadow, border: style.border };
  });
  await page.keyboard.press('Shift+Tab');
  readerState.keyboardFocus = await reader.getByRole('button', { name: 'Back' }).evaluate((element) => {
    const style = getComputedStyle(element);
    return { focused: document.activeElement === element, outline: style.outline, boxShadow: style.boxShadow, border: style.border };
  });

  await popup.bringToFront();
  await popup.reload();
  await popup.getByLabel('Supporter license token').fill('');
  await popup.getByRole('button', { name: 'Restore license' }).click();
  const emptyLicenseRecovery = await popup.locator('#announcement').innerText();
  const recordingExternalRequests = [...new Set(externalRequests)];
  await popup.getByLabel('Supporter license token').fill(`independent-invalid-${Date.now()}`);
  await popup.getByRole('button', { name: 'Restore license' }).click();
  await popup.locator('#announcement').filter({ hasText: 'This license is not active.' }).waitFor();
  const invalidLicenseRecovery = await popup.locator('#announcement').innerText();

  await popup.getByLabel('Route name').fill('Approve weekly timesheet');
  await popup.getByRole('button', { name: 'Start recording' }).click();
  await page.bringToFront();
  await page.getByRole('button', { name: /Edit note for Choose New report/ }).click();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: /Edit note for Select Monthly expenses/ }).click();
  await page.keyboard.press('Escape');
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 400));
  const secondRoute = await state();

  await popup.bringToFront();
  await popup.reload();
  const markdownEvent = popup.waitForEvent('download');
  await popup.getByRole('button', { name: 'Export Markdown' }).click();
  const markdown = await markdownEvent;
  const jsonEvent = popup.waitForEvent('download');
  await popup.getByRole('button', { name: 'Export JSON' }).click();
  const json = await jsonEvent;
  const jsonData = JSON.parse(await readFile(await json.path(), 'utf8'));

  popup.once('dialog', (dialog) => dialog.dismiss());
  await popup.getByRole('button', { name: 'Clear flow' }).click();
  const cancelRetained = Boolean((await state()).flow);
  popup.once('dialog', (dialog) => dialog.accept());
  await popup.getByRole('button', { name: 'Clear flow' }).click();
  const confirmCleared = (await state()).flow === null;

  const lightAxe = await new AxeBuilder({ page: popup }).analyze();
  await popup.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  const darkAxe = await new AxeBuilder({ page: popup }).analyze();
  const severe = (analysis) => analysis.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')).map((item) => `${item.id}:${item.nodes.length}`);

  const result = {
    extensionId,
    manifest: JSON.parse(await readFile(resolve(extensionPath, 'manifest.json'), 'utf8')),
    firstRoute: {
      title: firstRoute.flow.title,
      stepCount: firstRoute.flow.steps.length,
      activeAfterCap: firstRoute.active,
      labels: firstRoute.flow.steps.map((step) => step.label),
      passwordLabelStored: JSON.stringify(firstRoute).includes('Work password'),
      typedPasswordStored: JSON.stringify(firstRoute).includes('must-not-leave-this-field'),
      screenshotFieldPresent: JSON.stringify(firstRoute).toLowerCase().includes('screenshot'),
    },
    readerState,
    emptyLicenseRecovery,
    invalidLicenseRecovery,
    secondRoute: { title: secondRoute.flow.title, stepCount: secondRoute.flow.steps.length, routeCount: secondRoute.routes.length },
    exports: { markdown: markdown.suggestedFilename(), json: json.suggestedFilename(), jsonSteps: jsonData.steps.length },
    deletionRecovery: { cancelRetained, confirmCleared },
    axeSeriousCritical: { light: severe(lightAxe), dark: severe(darkAxe) },
    recordingExternalRequests,
    externalRequests: [...new Set(externalRequests)],
    consoleErrors,
    pageErrors,
  };
  await writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
} finally {
  await context.close();
}
