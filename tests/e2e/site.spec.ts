import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('landing page has the product identity and required structure', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  await page.goto('/');
  await expect(page).toHaveTitle('App Flow Reader — Record browser tasks as steps');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Record browser tasks as clear steps');
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Download extension', exact: true })).toHaveAttribute('href', '/downloads/app-flow-reader-chrome.zip');
  expect(consoleErrors).toEqual([]);
});

test('@claim:no-account opens the complete sample without account setup', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.locator('.demo-banner strong')).toHaveText('Demo');
  await expect(page.locator('.demo-step')).toHaveCount(5);
  await expect(page.locator('input[type="email"], input[type="password"]')).toHaveCount(0);
});

test('@claim:export-files exports the sample as readable Markdown and JSON', async ({ page }) => {
  await page.goto('/demo');
  const markdownEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export Markdown' }).click();
  const markdown = await markdownEvent;
  expect(markdown.suggestedFilename()).toBe('invite-a-teammate-to-northstar.md');
  const markdownText = await (await import('node:fs/promises')).readFile(await markdown.path() as string, 'utf8');
  expect(markdownText).toContain('# Invite a teammate to Northstar');
  expect(markdownText).toContain('5. **Page change:** Invitation sent');

  const jsonEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  const json = await jsonEvent;
  expect(json.suggestedFilename()).toBe('invite-a-teammate-to-northstar.json');
  const jsonData = JSON.parse(await (await import('node:fs/promises')).readFile(await json.path() as string, 'utf8'));
  expect(jsonData.steps).toHaveLength(5);
});

test('demo sends sample data only to the same origin and saves nothing', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.origin !== 'http://127.0.0.1:4173') external.push(request.url());
  });
  await page.goto('/demo');
  await page.getByRole('button', { name: /Edit note for Invite teammate/ }).click();
  await page.getByRole('textbox', { name: 'Note' }).fill('Mention the access review.');
  await page.getByRole('button', { name: 'Save note' }).click();
  await expect(page.getByText('Mention the access review.')).toBeVisible();
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
  expect(await page.evaluate(() => Object.keys(sessionStorage))).toEqual([]);
  expect(external).toEqual([]);
});

test('remove is reversible and reset restores the isolated sample', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Remove Invite teammate' }).click();
  await expect(page.locator('.demo-step')).toHaveCount(4);
  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(page.locator('.demo-step')).toHaveCount(5);
  await page.getByRole('button', { name: 'Remove Invite teammate' }).click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('.demo-step')).toHaveCount(5);
});

test('keyboard navigation opens the demo and manages dialog focus', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium');
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  await page.goto('/demo');
  const noteButton = page.getByRole('button', { name: /Edit note for Invite teammate/ });
  await noteButton.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('textbox', { name: 'Note' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#note-dialog')).not.toBeVisible();
});

test('routes update title, history, and heading focus', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Privacy', exact: true }).first().click();
  await expect(page).toHaveTitle('Privacy — App Flow Reader');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await page.goBack();
  await expect(page).toHaveTitle('App Flow Reader — Record browser tasks as steps');
  await page.goto('/missing-path');
  await expect(page).toHaveTitle('Page not found — App Flow Reader');
  await expect(page.getByRole('link', { name: 'Return home' })).toBeVisible();
});

test('@a11y pages have no serious or critical axe findings', async ({ page }) => {
  for (const route of ['/', '/demo', '/privacy', '/terms', '/missing-path']) {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    const severe = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''));
    expect(severe, `${route}: ${severe.map((item) => `${item.id} (${item.nodes.length})`).join(', ')}`).toEqual([]);
  }
});

test('mobile layout has 44px targets and no horizontal overflow', async ({ page, isMobile }) => {
  test.skip(!isMobile);
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  const smallTargets = await page.locator('a:visible, button:visible').evaluateAll((elements) => elements.filter((element) => {
    const box = element.getBoundingClientRect();
    return box.width < 44 || box.height < 44;
  }).map((element) => `${element.tagName}:${element.textContent?.trim()}`));
  expect(smallTargets).toEqual([]);
});

test('site shell and demo reload offline after the first visit', async ({ page, context }) => {
  await page.goto('/demo');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Read the teammate invite path');
  await expect(page.locator('.demo-step')).toHaveCount(5);
  await context.setOffline(false);
});
