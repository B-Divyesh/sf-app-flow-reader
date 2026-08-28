import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('landing page names the low-vision job and keeps the product skeleton', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  await expect(page).toHaveTitle('App Flow Reader — Follow saved browser routes');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Follow saved routes through busy web apps');
  await expect(page.locator('.lede')).toContainText('progressive low vision');
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Download extension', exact: true })).toHaveAttribute('href', '/downloads/app-flow-reader-chrome.zip');
  expect(errors).toEqual([]);
});

test('@claim:no-account completes a guided route action without account setup', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.locator('.demo-step')).toHaveCount(5);
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.locator('#reader-position')).toHaveText('Step 2 of 5');
  await expect(page.locator('input[type="email"], input[type="password"]')).toHaveCount(0);
});

test('@claim:export-files exports the complete sample as Markdown and JSON', async ({ page }) => {
  await page.goto('/demo');
  const markdownEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export Markdown' }).click();
  const markdown = await markdownEvent;
  expect(markdown.suggestedFilename()).toBe('submit-a-monthly-expense-report.md');
  const markdownText = await (await import('node:fs/promises')).readFile(await markdown.path() as string, 'utf8');
  expect(markdownText).toContain('# Submit a monthly expense report');
  expect(markdownText).toContain('5. **Page change:** Choose Send to manager');
  const jsonEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  const json = await jsonEvent;
  expect(JSON.parse(await (await import('node:fs/promises')).readFile(await json.path() as string, 'utf8')).steps).toHaveLength(5);
});

test('@claim:demo-isolated changes the sample in memory with no cross-origin request or durable storage', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (request) => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') external.push(request.url()); });
  await page.goto('/demo');
  await page.getByRole('button', { name: /Edit note for Choose New report/ }).click();
  await page.getByRole('textbox', { name: 'Note' }).fill('Use the second control in the toolbar.');
  await page.getByRole('button', { name: 'Save note' }).click();
  await expect(page.getByText('Use the second control in the toolbar.')).toBeVisible();
  expect(await page.evaluate(async () => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage), databases: await indexedDB.databases() }))).toEqual({ local: [], session: [], databases: [] });
  expect(external).toEqual([]);
});

test('@claim:no-tracking loads public pages without analytics, external fonts, or third-party scripts', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (request) => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') external.push(request.url()); });
  for (const route of ['/', '/privacy', '/terms']) await page.goto(route);
  expect(external).toEqual([]);
  expect(await page.locator('script[src^="http"], link[href^="http"][rel="stylesheet"]').count()).toBe(0);
});

test('demo editing is bounded, reversible, and resettable', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: /Edit note for Choose New report/ }).click();
  await page.getByRole('textbox', { name: 'Note' }).fill('x'.repeat(280));
  await page.getByRole('button', { name: 'Save note' }).click();
  await expect(page.locator('.demo-step').filter({ hasText: 'Choose New report' }).locator('.note')).toHaveText('x'.repeat(280));
  await page.getByRole('button', { name: 'Remove Choose New report' }).evaluate((element: HTMLButtonElement) => element.click());
  await expect(page.locator('.demo-step')).toHaveCount(4);
  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(page.locator('.demo-step')).toHaveCount(5);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('#reader-position')).toHaveText('Step 1 of 5');
});

test('@claim:supporter-license stores, verifies, restores, and applies the optional license', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/app-flow-reader/verify?license=test-token', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{"valid":true,"reason":"ok","expires_at":null}' }));
  await page.goto('/?license=test-token');
  await expect(page).toHaveURL('http://127.0.0.1:4173/');
  await expect(page.getByRole('status').filter({ hasText: 'Supporter styles are active' })).toBeVisible();
  await page.getByRole('button', { name: 'Graphite' }).click();
  expect(await page.evaluate(() => ({ token: localStorage.getItem('sb_license:app-flow-reader'), cover: localStorage.getItem('app-flow-reader:cover'), mode: document.documentElement.dataset.cover }))).toEqual({ token: 'test-token', cover: 'graphite', mode: 'graphite' });
  await expect(page.getByRole('link', { name: 'Buy supporter license' })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/app-flow-reader/checkout');
  await page.route('https://api.sociobot.in/api/v1/products/app-flow-reader/verify?license=revoked-token', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{"valid":false,"reason":"revoked","expires_at":null}' }));
  await page.getByLabel('Have a license? Paste it here').fill('revoked-token');
  await page.getByRole('button', { name: 'Restore license' }).click();
  await expect(page.getByText('This license is no longer active.')).toBeVisible();
  await expect(page.locator('#supporter-styles')).toBeHidden();
});

test('keyboard navigation manages route focus and the note dialog', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium');
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  await page.goto('/demo');
  const noteButton = page.getByRole('button', { name: /Edit note for Choose New report/ });
  await noteButton.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('textbox', { name: 'Note' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#note-dialog')).not.toBeVisible();
  await expect(noteButton).toBeFocused();
});

test('routes update title, history, heading focus, and deployment policy has a real 404 catch-all', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Privacy', exact: true }).first().click();
  await expect(page).toHaveTitle('Privacy — App Flow Reader');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await page.goBack();
  await expect(page).toHaveTitle('App Flow Reader — Follow saved browser routes');
  await page.goto('/missing-path');
  await expect(page).toHaveTitle('Page not found — App Flow Reader');
  const config = JSON.parse(await (await import('node:fs/promises')).readFile('public/site/staticwebapp.config.json', 'utf8'));
  expect(config.routes).toEqual(expect.arrayContaining([
    { route: '/demo', rewrite: '/index.html' },
    { route: '/privacy', rewrite: '/index.html' },
    { route: '/terms', rewrite: '/index.html' },
  ]));
  expect(config.responseOverrides).toEqual({ '404': { rewrite: '/index.html' } });
  expect(config.globalHeaders['Content-Security-Policy']).toContain("connect-src 'self' https://api.sociobot.in");
});

test('@a11y every route passes axe in light, dark, and reduced-motion modes', async ({ page }) => {
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
    for (const route of ['/', '/demo', '/privacy', '/terms', '/missing-path']) {
      await page.goto(route);
      const results = await new AxeBuilder({ page }).analyze();
      const severe = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''));
      expect(severe, `${colorScheme} ${route}: ${severe.map((item) => `${item.id} (${item.nodes.length})`).join(', ')}`).toEqual([]);
    }
  }
});

test('390px layout has 44px targets and no horizontal overflow on home and demo', async ({ page, isMobile }) => {
  test.skip(!isMobile);
  for (const route of ['/', '/demo']) {
    await page.goto(route);
    if (route === '/') await page.getByRole('button', { name: 'Open navigation' }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const smallTargets = await page.locator('a:visible, button:visible, input:visible').evaluateAll((elements) => elements.filter((element) => {
      const box = element.getBoundingClientRect();
      return box.width < 44 || box.height < 44;
    }).map((element) => `${element.tagName}:${element.textContent?.trim()}`));
    expect(smallTargets).toEqual([]);
  }
});

test('@claim:offline-reload site and demo work offline after the first visit', async ({ page, context }) => {
  await page.goto('/demo');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Follow the monthly expense route');
  await expect(page.locator('.demo-step')).toHaveCount(5);
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.locator('#reader-position')).toHaveText('Step 2 of 5');
  await context.setOffline(false);
});
