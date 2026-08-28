import { access, readFile } from 'node:fs/promises';

const packageJson = JSON.parse(await readFile('package.json', 'utf8'));
const lock = JSON.parse(await readFile('package-lock.json', 'utf8'));
await access('package-lock.json');

if (lock.name !== packageJson.name || lock.version !== packageJson.version) throw new Error('package-lock metadata does not match package.json');
const root = lock.packages?.[''];
if (!root) throw new Error('package-lock is missing the root package record');
for (const group of ['dependencies', 'devDependencies']) {
  for (const [name, version] of Object.entries(packageJson[group] ?? {})) {
    if (root[group]?.[name] !== version) throw new Error(`${name} is not locked at package.json range ${version}`);
  }
}
console.log(`Install contract OK: lockfileVersion ${lock.lockfileVersion}, ${Object.keys(lock.packages).length} package records`);
