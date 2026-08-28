import AxeBuilder from '@axe-core/playwright';
import { chromium, expect, test, type BrowserContext, type Page, type Worker } from '@playwright/test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

type ExtensionHarness = { context: BrowserContext; worker: Worker; popup: Page; page: Page; userData: string };

async function launchExtension(): Promise<ExtensionHarness> {
  const userData = await mkdtemp(join(tmpdir(), 'afr-extension-'));
  const context = await chromium.launchPersistentContext(userData, {
    headless: true,
    channel: 'chromium',
    args: [`--disable-extensions-except=${resolve('dist/extension')}`, `--load-extension=${resolve('dist/extension')}`],
  });
  let worker = context.serviceWorkers()[0];
  if (!worker) worker = await context.waitForEvent('serviceworker');
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/demo');
  const popup = await context.newPage();
  await popup.goto(`chrome-extension://${new URL(worker.url()).host}/popup.html`);
  return { context, worker, popup, page, userData };
}

async function closeExtension(harness: ExtensionHarness) {
  await harness.context.close();
  await rm(harness.userData, { recursive: true, force: true });
}

async function state(worker: Worker) {
  return worker.evaluate(async () => (await (globalThis as any).chrome.storage.local.get('app-flow-reader:state'))['app-flow-reader:state']);
}

async function start(popup: Page, name: string) {
  await popup.getByLabel('Route name').fill(name);
  await popup.getByRole('button', { name: 'Start recording' }).click();
}

test('@claim:guided-route keeps multiple named routes, caps burst input, and follows with Back and Next', async ({ browserName }, testInfo) => {
  test.skip(browserName !== 'chromium' || testInfo.project.name !== 'desktop-chromium');
  const harness = await launchExtension();
  try {
    await start(harness.popup, 'Submit monthly expenses');
    await harness.page.bringToFront();
    await harness.page.evaluate(() => {
      const host = document.createElement('div');
      document.querySelector('main')!.prepend(host);
      for (let index = 1; index <= 13; index += 1) {
        const button = document.createElement('button');
        button.textContent = `Boundary step ${index}`;
        host.append(button);
        button.click();
      }
    });
    await expect.poll(async () => (await state(harness.worker)).flow.steps.length).toBe(10);
    const first = await state(harness.worker);
    expect(first.flow.steps.slice(1).map((step: { label: string }) => step.label)).toEqual(Array.from({ length: 9 }, (_, index) => `Boundary step ${index + 1}`));
    expect(first.active).toBe(false);

    await harness.popup.bringToFront();
    await start(harness.popup, 'Approve weekly timesheet');
    await harness.page.bringToFront();
    await harness.page.getByRole('button', { name: /Edit note for Choose New report/ }).click();
    await harness.page.keyboard.press('Escape');
    await harness.page.getByRole('button', { name: /Edit note for Select Monthly expenses/ }).click();
    await harness.page.keyboard.press('Escape');
    await expect.poll(async () => (await state(harness.worker)).routes.length).toBe(2);

    const saved = await state(harness.worker);
    await harness.page.bringToFront();
    const tabId = await harness.worker.evaluate(async () => (await (globalThis as any).chrome.tabs.query({ active: true, currentWindow: true }))[0]?.id);
    await harness.popup.evaluate(async ({ id, tabId }) => (globalThis as any).chrome.runtime.sendMessage({ type: 'afr:follow', id, tabId }), { id: saved.flow.id, tabId });
    const reader = harness.page.getByRole('complementary', { name: 'App Flow Reader controls' });
    await expect(reader).toContainText('Step 1 of 3');
    await reader.getByRole('button', { name: 'Next' }).click();
    await expect(reader).toContainText('Step 2 of 3');
    await expect(reader.getByRole('button', { name: 'Back' })).toBeEnabled();
  } finally { await closeExtension(harness); }
});

test('@claim:private-capture uses accessible names and ignores password controls completely', async ({ browserName }, testInfo) => {
  test.skip(browserName !== 'chromium' || testInfo.project.name !== 'desktop-chromium');
  const harness = await launchExtension();
  try {
    await start(harness.popup, 'Accessible route');
    await harness.page.bringToFront();
    await harness.page.evaluate(() => {
      document.querySelector('main')!.insertAdjacentHTML('afterbegin', '<span id="save-name">Save report</span><button id="named" aria-labelledby="save-name"><img alt="disk icon"></button><label for="work-password">Work password</label><input id="work-password" type="password">');
      (document.querySelector('#named') as HTMLButtonElement).click();
      (document.querySelector('#work-password') as HTMLInputElement).click();
    });
    await expect.poll(async () => (await state(harness.worker)).flow.steps.length).toBe(2);
    const serialized = JSON.stringify(await state(harness.worker));
    expect(serialized).toContain('Save report');
    expect(serialized).not.toContain('Work password');
    expect(serialized).not.toContain('disk icon');
  } finally { await closeExtension(harness); }
});

test('@claim:local-storage starts and records a route locally without external requests', async ({ browserName }, testInfo) => {
  test.skip(browserName !== 'chromium' || testInfo.project.name !== 'desktop-chromium');
  const harness = await launchExtension();
  const external: string[] = [];
  harness.context.on('request', (request) => {
    if (!request.url().startsWith('http://127.0.0.1:4173') && !request.url().startsWith('chrome-extension://')) external.push(request.url());
  });
  try {
    await start(harness.popup, 'Local route');
    await harness.page.bringToFront();
    await harness.page.getByRole('button', { name: /Edit note for Choose New report/ }).click();
    await harness.page.keyboard.press('Escape');
    await expect.poll(async () => (await state(harness.worker)).flow.steps.length).toBe(2);
    expect((await state(harness.worker)).flow.title).toBe('Local route');
    expect(external).toEqual([]);
  } finally { await closeExtension(harness); }
});

test('@claim:route-controls supports pause, resume, notes, exports, and confirmed deletion', async ({ browserName }, testInfo) => {
  test.skip(browserName !== 'chromium' || testInfo.project.name !== 'desktop-chromium');
  const harness = await launchExtension();
  try {
    await start(harness.popup, 'Route controls');
    await harness.popup.getByRole('button', { name: 'Pause' }).click();
    await expect.poll(async () => (await state(harness.worker)).active).toBe(false);
    await harness.popup.getByRole('button', { name: 'Resume' }).click();
    harness.popup.once('dialog', (dialog) => dialog.accept('Remember this landmark'));
    await harness.popup.getByRole('button', { name: 'Add note' }).first().click();
    expect((await state(harness.worker)).flow.steps[0].note).toBe('Remember this landmark');
    for (const name of ['Export Markdown', 'Export JSON']) {
      const event = harness.popup.waitForEvent('download');
      await harness.popup.getByRole('button', { name }).click();
      expect((await event).suggestedFilename()).toMatch(/route-controls\.(md|json)/);
    }
    harness.popup.once('dialog', (dialog) => dialog.dismiss());
    await harness.popup.getByRole('button', { name: 'Clear flow' }).click();
    expect((await state(harness.worker)).flow).not.toBeNull();
    harness.popup.once('dialog', (dialog) => dialog.accept());
    await harness.popup.getByRole('button', { name: 'Clear flow' }).click();
    expect((await state(harness.worker)).flow).toBeNull();
  } finally { await closeExtension(harness); }
});

test('extension manifest stays MV3, local-only, and versioned for updates', async ({ browserName }, testInfo) => {
  test.skip(browserName !== 'chromium' || testInfo.project.name !== 'desktop-chromium');
  const manifest = JSON.parse(await (await import('node:fs/promises')).readFile('dist/extension/manifest.json', 'utf8'));
  expect(manifest.manifest_version).toBe(3);
  expect(manifest.version).toBe('1.1.0');
  expect(manifest.permissions.sort()).toEqual(['activeTab', 'storage'].sort());
  expect(manifest.host_permissions ?? []).toEqual([]);
  expect(JSON.stringify(manifest)).not.toMatch(/https?:\/\/(?!\*\/\*)/);
});

test('@a11y extension popup passes axe in light and dark themes with keyboard focus', async ({ browserName }, testInfo) => {
  test.skip(browserName !== 'chromium' || testInfo.project.name !== 'desktop-chromium');
  const harness = await launchExtension();
  try {
    await expect(harness.popup.locator('h1')).toHaveCount(1);
    await harness.popup.keyboard.press('Tab');
    await expect(harness.popup.getByRole('link', { name: 'Skip to routes' })).toBeFocused();
    for (const colorScheme of ['light', 'dark'] as const) {
      await harness.popup.emulateMedia({ colorScheme });
      const results = await new AxeBuilder({ page: harness.popup }).analyze();
      expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
    }
  } finally { await closeExtension(harness); }
});
