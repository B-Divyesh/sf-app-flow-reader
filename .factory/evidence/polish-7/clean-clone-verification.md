# Clean-clone verification — polish 7

- Clone: `/tmp/app-flow-reader-polish7-clean.kEo0yr`
- Product revision: `8ca48be619d7e9f9e7dddf683b0856d567fab6c6`
- Install: `npm ci` — 171 packages installed; zero audit vulnerabilities
- Browser matrix: Playwright 1.58.2 with the worker's preinstalled Chromium

## Exact claim commands

Every `test` command in `.factory/claims.json` was executed separately after
`npm ci`. No command was replaced by a combined shortcut.

| Claim ID | Result |
| --- | --- |
| `guided-route` | PASS |
| `private-capture` | PASS |
| `local-storage` | PASS |
| `extension-network` | PASS |
| `route-controls` | PASS |
| `export-files` | PASS |
| `no-account` | PASS |
| `demo-isolated` | PASS |
| `offline-reload` | PASS |
| `no-tracking` | PASS |
| `supporter-license` | PASS |
| `supporter-checkout` | PASS |
| `browser-page-boundaries` | PASS |
| `mv3-package` | PASS |
| `license-return` | PASS |

## Full clean-clone gates

| Command | Result |
| --- | --- |
| `npm test` | PASS — 6 unit tests; 35 browser tests passed; 11 expected project skips |
| `npm run test:a11y` | PASS — 3 browser tests; 1 expected project skip |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run check:package` | PASS — lockfile v3; 222 package records |
| `npm run check:copy` | PASS |
| `npm audit --audit-level=high` | PASS — zero vulnerabilities |
| `npm run test:live-checkout` | PASS — HTTPS hosted-checkout redirect |
| `npm run build` | PASS — site and MV3 extension built |
| `unzip -t dist/site/downloads/app-flow-reader-chrome.zip` | PASS — no archive errors |

The build produced 19.57 kB raw / 6.79 kB gzip JavaScript, 17.70 kB raw /
4.68 kB gzip CSS, a 36.45 kB unpacked extension, and a 16.65 kB ZIP.
