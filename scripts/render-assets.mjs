import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

async function render(source, destination, width, height, background = 'transparent') {
  const sourceUrl = pathToFileURL(resolve(source)).href;
  await page.setViewportSize({ width, height });
  await page.setContent(`<style>html,body{margin:0;width:${width}px;height:${height}px;overflow:hidden;background:${background}}img{display:block;width:100%;height:100%}</style><img src="${sourceUrl}" alt="">`);
  await page.locator('img').waitFor({ state: 'visible' });
  await page.screenshot({ path: destination, omitBackground: background === 'transparent' });
}

for (const size of [16, 32, 48, 128]) await render('public/extension/icon.svg', `public/extension/icon-${size}.png`, size, size);
await render('public/site/favicon.svg', 'public/site/apple-touch-icon.png', 180, 180);
await render('public/site/og-image.svg', 'public/site/og-image.png', 1200, 630, '#f1ebdd');

await browser.close();
console.log('Rendered extension icons, touch icon, and social preview.');
