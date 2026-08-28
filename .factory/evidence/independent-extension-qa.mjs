import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const extensionPath = resolve(process.argv[2] ?? 'dist/extension');
const userData = await mkdtemp(join(tmpdir(), 'afr-independent-'));
const context = await chromium.launchPersistentContext(userData, {
  headless: true,
  channel: 'chromium',
  args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
});

try {
  let worker = context.serviceWorkers()[0];
  if (!worker) worker = await context.waitForEvent('serviceworker');
  const extensionId = new URL(worker.url()).host;
  const popupUrl = `chrome-extension://${extensionId}/popup.html`;
  const state = async () => worker.evaluate(async () => (await globalThis.chrome.storage.local.get('app-flow-reader:state'))['app-flow-reader:state']);

  const page = await context.newPage();
  await page.goto('https://app-flow-reader.sociobot.in/demo', { waitUntil: 'networkidle' });
  const popup = await context.newPage();
  await popup.goto(popupUrl);
  await popup.getByRole('button', { name: 'Start recording' }).click();
  const afterStart = await state();

  await page.getByRole('button', { name: /Edit note for Invite teammate/ }).focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Escape');
  await page.evaluate(() => { history.pushState({}, '', '/demo?stage=confirm'); document.body.append(document.createElement('i')); });
  await popup.reload();
  const afterNormal = await state();

  await popup.getByRole('button', { name: 'Pause' }).click();
  const pausedCount = (await state()).flow.steps.length;
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 250));
  const afterPausedClick = (await state()).flow.steps.length;

  await popup.reload();
  await popup.getByRole('button', { name: 'Resume' }).click();
  await page.evaluate(() => {
    const main = document.querySelector('main');
    main.insertAdjacentHTML('afterbegin', `
      <span id="save-name">Save report</span>
      <button id="accessible-name" aria-labelledby="save-name"><img alt="Save report"></button>
      <label for="work-password">Work password</label><input id="work-password" type="password">
      <div id="many"></div>`);
    document.querySelector('#accessible-name').click();
    document.querySelector('#work-password').click();
    const many = document.querySelector('#many');
    for (let index = 1; index <= 11; index += 1) {
      const button = document.createElement('button');
      button.textContent = `Boundary step ${index}`;
      many.append(button);
      button.click();
    }
  });
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 750));
  const afterRapid = await state();

  await page.evaluate(() => document.querySelector('#accessible-name').click());
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 250));
  await page.evaluate(() => document.querySelector('#work-password').click());
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 250));
  for (let index = 1; index <= 11; index += 1) {
    await page.evaluate((step) => {
      const button = document.createElement('button');
      button.textContent = `Sequential step ${step}`;
      document.querySelector('#many').append(button);
      button.click();
    }, index);
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 150));
  }
  const afterBoundary = await state();

  await popup.reload();
  const popupActions = await popup.getByRole('button').allTextContents();
  const routeControls = await popup.getByRole('button', { name: /next|back|previous|play|follow/i }).count();
  const storedLabels = afterBoundary.flow.steps.map((step) => step.label);

  const addNote = popup.getByRole('button', { name: 'Add note' }).first();
  popup.once('dialog', (dialog) => dialog.accept('n'.repeat(500)));
  await addNote.click();
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 250));
  const noteLengths = (await state()).flow.steps.filter((step) => step.note).map((step) => step.note.length);

  const markdownEvent = popup.waitForEvent('download');
  await popup.getByRole('button', { name: 'Export Markdown' }).click();
  const markdown = await markdownEvent;
  const jsonEvent = popup.waitForEvent('download');
  await popup.getByRole('button', { name: 'Export JSON' }).click();
  const json = await jsonEvent;

  popup.once('dialog', (dialog) => dialog.dismiss());
  await popup.getByRole('button', { name: 'Clear flow' }).click();
  const afterCancelClear = await state();
  popup.once('dialog', (dialog) => dialog.accept());
  await popup.getByRole('button', { name: 'Clear flow' }).click();
  const afterConfirmClear = await state();

  const axePage = await context.newPage();
  await axePage.goto(popupUrl);
  const axeLight = await new AxeBuilder({ page: axePage }).analyze();
  await axePage.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  const axeDark = await new AxeBuilder({ page: axePage }).analyze();

  const result = {
    extensionPath,
    extensionId,
    afterStart: { active: afterStart.active, title: afterStart.flow.title, steps: afterStart.flow.steps.length },
    afterNormal: { active: afterNormal.active, steps: afterNormal.flow.steps.map((step) => `${step.kind}:${step.label}`) },
    pause: { before: pausedCount, afterClick: afterPausedClick },
    boundary: {
      rapidAttemptedClicks: 13,
      rapidRecordedSteps: afterRapid.flow.steps.length - afterNormal.flow.steps.length,
      totalSteps: afterBoundary.flow.steps.length,
      recordedAccessibleName: storedLabels.includes('Save report'),
      recordedFallbackButton: storedLabels.includes('button'),
      inspectedPasswordFieldLabel: storedLabels.includes('Work password'),
      lastLabels: storedLabels.slice(-13),
    },
    popupActions,
    routeControls,
    noteLengths,
    downloads: [markdown.suggestedFilename(), json.suggestedFilename()],
    clearRecovery: { cancelRetained: Boolean(afterCancelClear.flow), confirmCleared: afterConfirmClear.flow === null },
    axeSeriousCritical: {
      light: axeLight.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')).map((item) => `${item.id}:${item.nodes.length}`),
      dark: axeDark.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')).map((item) => `${item.id}:${item.nodes.length}`),
    },
  };
  const output = `${JSON.stringify(result, null, 2)}\n`;
  if (process.argv[3]) await writeFile(process.argv[3], output);
  console.log(output);
} finally {
  await context.close();
  await rm(userData, { recursive: true, force: true });
}
