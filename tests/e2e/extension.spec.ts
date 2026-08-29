import AxeBuilder from '@axe-core/playwright';
import { chromium, expect, test, type BrowserContext, type Page, type Worker } from '@playwright/test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

type ExtensionHarness = { context: BrowserContext; worker: Worker; popup: Page; page: Page; userData: string };

async function launchExtension(prepareContext?: (context: BrowserContext) => Promise<void> | void): Promise<ExtensionHarness> {
  const userData = await mkdtemp(join(tmpdir(), 'afr-extension-'));
  const context = await chromium.launchPersistentContext(userData, {
    headless: true,
    channel: 'chromium',
    args: [`--disable-extensions-except=${resolve('dist/extension')}`, `--load-extension=${resolve('dist/extension')}`],
  });
  await prepareContext?.(context);
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

async function storage(worker: Worker) {
  return worker.evaluate(async () => (globalThis as any).chrome.storage.local.get());
}

async function start(popup: Page, name: string) {
  await popup.getByLabel('Route name').fill(name);
  await popup.getByRole('button', { name: 'Start recording' }).click();
}

test('@claim:guided-route keeps multiple named routes, caps burst input, announces and highlights each current step, and follows with large Back and Next controls', async ({ browserName }, testInfo) => {
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
    await harness.popup.evaluate(async ({ id, tabId }) => (globalThis as any).chrome.runtime.sendMessage({ type: 'afr:follow', id, tabId }), { id: saved.routes[0].id, tabId });
    const reader = harness.page.getByRole('complementary', { name: 'App Flow Reader controls' });
    await expect(reader).toContainText('Step 1 of 10');
    await reader.getByRole('button', { name: 'Next' }).click();
    await expect(reader.getByRole('status')).toContainText('Target highlighted.');
    await expect(harness.page.getByRole('button', { name: 'Boundary step 1', exact: true })).toHaveCSS('outline-width', '4px');
    for (const label of ['Back', 'Next']) {
      const box = await reader.getByRole('button', { name: label }).boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(48);
    }
    await reader.getByRole('button', { name: 'Next' }).click();
    await expect(reader).toContainText('Step 3 of 10');
    await expect(reader.getByRole('button', { name: 'Back' })).toBeEnabled();
  } finally { await closeExtension(harness); }
});

test('@claim:private-capture uses accessible names, ignores password controls, and stores no typed values or screenshots', async ({ browserName }, testInfo) => {
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
    expect(serialized).not.toContain('correct horse battery staple');
    expect(await harness.page.evaluate(() => {
      const input = document.querySelector('#work-password') as HTMLInputElement;
      input.value = 'correct horse battery staple';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      return input.value;
    })).toBe('correct horse battery staple');
    expect(JSON.stringify(await storage(harness.worker))).not.toContain('correct horse battery staple');
    const background = await (await import('node:fs/promises')).readFile('entrypoints/background.ts', 'utf8');
    expect(background).not.toContain('captureVisibleTab');
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

test('@claim:extension-network waits for a restored supporter token, then contacts only the Sociobot verification endpoint', async ({ browserName }, testInfo) => {
  test.skip(browserName !== 'chromium' || testInfo.project.name !== 'desktop-chromium');
  const observed: Array<{ method: string; url: string }> = [];
  const harness = await launchExtension(async (context) => {
    context.on('request', (request) => {
      const url = request.url();
      if (!url.startsWith('http://127.0.0.1:4173') && !url.startsWith('chrome-extension://')) {
        observed.push({ method: request.method(), url });
      }
    });
    await context.route('https://api.sociobot.in/api/v1/products/app-flow-reader/verify?license=*', (route) => (
      route.fulfill({ contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok' }) })
    ));
  });
  try {
    expect(observed).toEqual([]);
    await start(harness.popup, 'Private network boundary');
    await harness.page.bringToFront();
    await harness.page.getByRole('button', { name: /Edit note for Choose New report/ }).click();
    await harness.page.keyboard.press('Escape');
    await expect.poll(async () => (await state(harness.worker)).flow.steps.length).toBe(2);
    expect(observed).toEqual([]);

    await harness.popup.bringToFront();
    await harness.popup.getByLabel('Supporter license token').fill('network-boundary-token');
    await harness.popup.getByRole('button', { name: 'Restore license' }).click();
    await expect(harness.popup.getByRole('status')).toContainText('Supporter styles are active in this extension.');
    expect(observed).toHaveLength(1);
    expect(observed[0]).toEqual({
      method: 'GET',
      url: 'https://api.sociobot.in/api/v1/products/app-flow-reader/verify?license=network-boundary-token',
    });
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

test('@claim:mv3-package builds a versioned Manifest V3 package for Chrome, Edge, Brave, and similar browsers with only the license verification host', async ({ browserName }, testInfo) => {
  test.skip(browserName !== 'chromium' || testInfo.project.name !== 'desktop-chromium');
  const manifest = JSON.parse(await (await import('node:fs/promises')).readFile('dist/extension/manifest.json', 'utf8'));
  expect(manifest.manifest_version).toBe(3);
  expect(manifest.version).toBe('1.1.1');
  expect(manifest.permissions.sort()).toEqual(['activeTab', 'storage'].sort());
  expect(manifest.host_permissions).toEqual(['https://api.sociobot.in/*']);
  expect(manifest.permissions.sort()).toEqual(['activeTab', 'storage'].sort());
});

test('@claim:browser-page-boundaries does not run on browser settings pages', async ({ browserName }, testInfo) => {
  test.skip(browserName !== 'chromium' || testInfo.project.name !== 'desktop-chromium');
  const manifest = JSON.parse(await (await import('node:fs/promises')).readFile('dist/extension/manifest.json', 'utf8'));
  expect(manifest.content_scripts[0].matches).toEqual(['http://*/*', 'https://*/*']);
  expect(manifest.content_scripts[0].matches.join(' ')).not.toContain('chrome://');
  expect(manifest.permissions).not.toContain('tabs');
});

test('@claim:supporter-license restores valid licenses in the packaged extension, applies all covers, rejects revoked licenses, and leaves the reader free', async ({ browserName }, testInfo) => {
  test.skip(browserName !== 'chromium' || testInfo.project.name !== 'desktop-chromium');
  const harness = await launchExtension();
  const verificationRequests: string[] = [];
  harness.context.on('request', (request) => {
    if (request.url().startsWith('https://api.sociobot.in/api/v1/products/app-flow-reader/verify?license=')) verificationRequests.push(request.url());
  });
  await harness.context.route('https://api.sociobot.in/api/v1/products/app-flow-reader/verify?license=*', async (route) => {
    const token = new URL(route.request().url()).searchParams.get('license');
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify(token === 'valid-token' ? { valid: true, reason: 'ok' } : { valid: false, reason: 'revoked' }) });
  });
  try {
    await expect(harness.popup.getByRole('link', { name: 'Buy supporter license — $12 (opens secure checkout in a new tab)' })).toBeVisible();
    await harness.popup.getByLabel('Supporter license token').fill('valid-token');
    await harness.popup.getByRole('button', { name: 'Restore license' }).click();
    await expect(harness.popup.getByRole('status')).toContainText('Supporter styles are active in this extension.');
    for (const [cover, label] of [['blueprint', 'Use Blueprint cover'], ['graphite', 'Use Graphite cover'], ['sunrise', 'Use Sunrise cover']] as const) {
      await harness.popup.getByRole('button', { name: label }).click();
      await expect.poll(async () => (await storage(harness.worker))['app-flow-reader:cover']).toBe(cover);
      await expect(harness.popup.locator('html')).toHaveAttribute('data-cover', cover);
    }
    expect(verificationRequests).toHaveLength(1);
    await harness.popup.reload();
    await expect(harness.popup.getByRole('status')).toContainText('Supporter styles are active in this extension.');
    expect(verificationRequests).toHaveLength(1);

    await harness.worker.evaluate(async () => (globalThis as any).chrome.storage.local.set({
      'app-flow-reader:license': { token: 'revoked-token', valid: true, checkedAt: 0 },
      'app-flow-reader:cover': 'blueprint',
    }));
    await harness.popup.reload();
    await expect(harness.popup.getByRole('status')).toContainText('This license is no longer active.');
    await expect(harness.popup.locator('#cover-styles')).toBeHidden();
    expect(verificationRequests).toHaveLength(2);
    await start(harness.popup, 'Still free after a revoked license');
    await expect.poll(async () => (await state(harness.worker)).flow.title).toBe('Still free after a revoked license');
  } finally { await closeExtension(harness); }
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
