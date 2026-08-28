import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('clean-install regression', () => {
  it('commits a lockfile whose root record matches package.json', () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
    expect(lock.lockfileVersion).toBeGreaterThanOrEqual(3);
    expect(lock.name).toBe(pkg.name);
    expect(lock.version).toBe(pkg.version);
    expect(lock.packages[''].devDependencies).toEqual(pkg.devDependencies);
  });

  it('pins the preinstalled Playwright release', () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    expect(pkg.devDependencies['@playwright/test']).toBe('1.58.2');
  });
});
