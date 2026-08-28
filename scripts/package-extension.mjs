import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const outputRoot = join(root, '.output');
const distExtension = join(root, 'dist', 'extension');
const downloads = join(root, 'dist', 'site', 'downloads');
const entries = await readdir(outputRoot);
const unpacked = entries.find((entry) => entry === 'chrome-mv3');
const archive = entries.find((entry) => entry.endsWith('-chrome.zip'));

if (!unpacked || !archive) throw new Error(`WXT output is incomplete: ${entries.join(', ')}`);

await rm(distExtension, { recursive: true, force: true });
await mkdir(distExtension, { recursive: true });
await mkdir(downloads, { recursive: true });
await cp(join(outputRoot, unpacked), distExtension, { recursive: true });
await cp(join(outputRoot, archive), join(downloads, 'app-flow-reader-chrome.zip'));
console.log('Packaged extension: dist/extension and dist/site/downloads/app-flow-reader-chrome.zip');
