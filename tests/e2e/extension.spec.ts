import AxeBuilder from '@axe-core/playwright';
import { chromium, expect, test } from '@playwright/test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

test('@claim:click-recording extension records a labeled click as an ordered step', async ({ browserName }, testInfo) => {
  test.skip(browserName !== 'chromium' || testInfo.project.name !== 'desktop-chromium');
  const userData = await mkdtemp(join(tmpdir(), 'afr-extension-'));
  const extensionPath = resolve('dist/extension');
  const context = await chromium.launchPersistentContext(userData, {
    headless: true,
    channel: 'chromium',
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
  });
  try {
    let worker = context.serviceWorkers()[0];
    if (!worker) worker = await context.waitForEvent('serviceworker');
    await expect.poll(() => worker.evaluate(async () => (await (globalThis as any).chrome.storage.local.get('app-flow-reader:state'))['app-flow-reader:state'])).toBeTruthy();
    await worker.evaluate(async () => {
      const now = new Date().toISOString();
      await (globalThis as any).chrome.storage.local.set({ 'app-flow-reader:state': { active: true, flow: { id: 'test', title: 'Test flow', createdAt: now, updatedAt: now, steps: [] } } });
    });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4173/demo');
    await page.getByRole('button', { name: /Edit note for Invite teammate/ }).click();
    await page.evaluate(() => { history.pushState({}, '', '/demo?step=next'); document.body.append(document.createElement('span')); });
    await expect.poll(async () => worker.evaluate(async () => {
      const stored = await (globalThis as any).chrome.storage.local.get('app-flow-reader:state');
      return stored['app-flow-reader:state']?.flow?.steps?.map((step: { kind: string; label: string }) => `${step.kind}:${step.label}`);
    })).toEqual(expect.arrayContaining(['click:Edit note for Invite teammate', 'navigate:Demo — App Flow Reader']));
  } finally {
    await context.close();
    await rm(userData, { recursive: true, force: true });
  }
});

test('@claim:private-capture typed field values and privileged pages are excluded', async ({ browserName }, testInfo) => {
  test.skip(browserName !== 'chromium' || testInfo.project.name !== 'desktop-chromium');
  const userData = await mkdtemp(join(tmpdir(), 'afr-fields-'));
  const extensionPath = resolve('dist/extension');
  const context = await chromium.launchPersistentContext(userData, {
    headless: true,
    channel: 'chromium',
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
  });
  try {
    let worker = context.serviceWorkers()[0];
    if (!worker) worker = await context.waitForEvent('serviceworker');
    await expect.poll(() => worker.evaluate(async () => (await (globalThis as any).chrome.storage.local.get('app-flow-reader:state'))['app-flow-reader:state'])).toBeTruthy();
    await worker.evaluate(async () => {
      const now = new Date().toISOString();
      await (globalThis as any).chrome.storage.local.set({ 'app-flow-reader:state': { active: true, flow: { id: 'fields', title: 'Field test', createdAt: now, updatedAt: now, steps: [] } } });
    });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4173/demo');
    await page.evaluate(() => document.querySelector('main')?.insertAdjacentHTML('afterbegin', '<label for="private-field">Account email</label><input id="private-field">'));
    await page.locator('#private-field').fill('private-person@example.test');
    await page.locator('#private-field').click();
    await expect.poll(async () => worker.evaluate(async () => (await (globalThis as any).chrome.storage.local.get('app-flow-reader:state'))['app-flow-reader:state'])).toMatchObject({ active: true });
    const snapshot = await worker.evaluate(async () => (await (globalThis as any).chrome.storage.local.get('app-flow-reader:state'))['app-flow-reader:state']);
    expect(JSON.stringify(snapshot)).not.toContain('private-person@example.test');
    expect(snapshot.flow.steps[0].label).toBe('Account email');
    const manifest = JSON.parse(await (await import('node:fs/promises')).readFile('dist/extension/manifest.json', 'utf8'));
    expect(manifest.content_scripts[0].matches).toEqual(['http://*/*', 'https://*/*']);
    expect(manifest.permissions).not.toEqual(expect.arrayContaining(['desktopCapture', 'tabCapture']));
  } finally {
    await context.close();
    await rm(userData, { recursive: true, force: true });
  }
});

test('@claim:local-storage flow data stays in extension storage without external requests', async ({ browserName }, testInfo) => {
  test.skip(browserName !== 'chromium' || testInfo.project.name !== 'desktop-chromium');
  const userData = await mkdtemp(join(tmpdir(), 'afr-private-'));
  const extensionPath = resolve('dist/extension');
  const context = await chromium.launchPersistentContext(userData, {
    headless: true,
    channel: 'chromium',
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
  });
  const external: string[] = [];
  context.on('request', (request) => {
    const url = new URL(request.url());
    if (!['http://127.0.0.1:4173', 'chrome-extension://'].some((origin) => url.origin === origin || request.url().startsWith(origin))) external.push(request.url());
  });
  try {
    let worker = context.serviceWorkers()[0];
    if (!worker) worker = await context.waitForEvent('serviceworker');
    await expect.poll(() => worker.evaluate(async () => (await (globalThis as any).chrome.storage.local.get('app-flow-reader:state'))['app-flow-reader:state'])).toBeTruthy();
    await worker.evaluate(async () => {
      const now = new Date().toISOString();
      await (globalThis as any).chrome.storage.local.set({ 'app-flow-reader:state': { active: true, flow: { id: 'private', title: 'Private flow', createdAt: now, updatedAt: now, steps: [] } } });
    });
    const stored = await worker.evaluate(async () => (await (globalThis as any).chrome.storage.local.get('app-flow-reader:state'))['app-flow-reader:state']);
    expect(stored.flow.title).toBe('Private flow');
    expect(external).toEqual([]);
  } finally {
    await context.close();
    await rm(userData, { recursive: true, force: true });
  }
});

test('extension manifest stays MV3, local-only, and versioned for updates', async ({ browserName }, testInfo) => {
  test.skip(browserName !== 'chromium' || testInfo.project.name !== 'desktop-chromium');
  const manifest = JSON.parse(await (await import('node:fs/promises')).readFile('dist/extension/manifest.json', 'utf8'));
  expect(manifest.manifest_version).toBe(3);
  expect(manifest.version).toBe('1.0.0');
  expect(manifest.permissions.sort()).toEqual(['activeTab', 'storage'].sort());
  expect(manifest.host_permissions ?? []).toEqual([]);
  expect(JSON.stringify(manifest)).not.toMatch(/https?:\/\/(?!\*\/\*)/);
});

test('@a11y extension popup has landmarks, keyboard focus, and no serious axe findings', async ({ browserName }, testInfo) => {
  test.skip(browserName !== 'chromium' || testInfo.project.name !== 'desktop-chromium');
  const userData = await mkdtemp(join(tmpdir(), 'afr-popup-'));
  const context = await chromium.launchPersistentContext(userData, {
    headless: true,
    channel: 'chromium',
    args: [`--disable-extensions-except=${resolve('dist/extension')}`, `--load-extension=${resolve('dist/extension')}`],
  });
  try {
    let worker = context.serviceWorkers()[0];
    if (!worker) worker = await context.waitForEvent('serviceworker');
    const extensionId = new URL(worker.url()).host;
    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup.html`);
    await expect(popup.locator('html')).toHaveAttribute('lang', 'en');
    await expect(popup.locator('h1')).toHaveCount(1);
    await expect(popup.locator('main')).toHaveCount(1);
    await popup.keyboard.press('Tab');
    await expect(popup.getByRole('link', { name: 'Skip to flow' })).toBeFocused();
    const results = await new AxeBuilder({ page: popup }).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  } finally {
    await context.close();
    await rm(userData, { recursive: true, force: true });
  }
});
