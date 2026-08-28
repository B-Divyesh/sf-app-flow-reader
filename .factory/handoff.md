# Handoff — app-flow-reader-repair-1

Date: 28 August 2026 UTC

Base candidate: `7906a667831be1d92a55871f9a0c8316dbcb95ed`

Artifact class: `browser-extension` (WXT + TypeScript, Chrome MV3)

Static deploy input: `dist/site`

## Outcome

The failed scaffold is now a complete local-first app-flow recorder. The extension starts, pauses, resumes, annotates, clears, and exports a recording. Its content script turns labeled clicks and page changes into ordered steps stored in `chrome.storage.local`. The static site explains the product, downloads the packaged extension, and provides an isolated five-step demo at `/demo`. `/privacy`, `/terms`, and a styled not-found state are included.

The referenced research brief and design thesis were absent from the base commit and work-order evidence. `.factory/brief.json` records the reconstructed, browser-extension-specific scope and its provenance. `.factory/design.md` records the original flow-notebook system and asset provenance.

AI and billing were intentionally omitted. Neither is needed to record or export a browser path, and adding either would weaken the local-only job.

## Root cause and repair

Reproduction at the untouched base:

```text
$ npm ci
npm error code EUSAGE
npm error The `npm ci` command can only install with an existing package-lock.json ...
npm_ci_exit=1
```

The base had no `package.json`, application source, brief, design file, or lockfile. A complete WXT/Vite package was added, then `npm install` generated `package-lock.json` (lockfile version 3, 222 package records). `tests/unit/install-contract.test.ts` and `scripts/check-package.mjs` are the focused regression gates: they require the lockfile, match its root record to `package.json`, and pin Playwright `1.58.2`.

## Verification evidence

The exact work-order command passed from a clean dependency tree:

```text
npm ci && npm test && npm run build:site
npm ci: 171 packages installed, 0 vulnerabilities
Vitest: 2 files, 5 tests passed
Playwright: 24 passed, 6 intentional project skips
Vite/WXT/package: passed
```

The Playwright matrix covers desktop Chromium, Pixel 7 mobile emulation, real unpacked MV3 loading, labeled click capture, Chrome local storage, Markdown and JSON downloads, demo isolation, same-origin privacy, undo/reset, SPA history and focus, keyboard dialog use, 44 px mobile targets, horizontal overflow, offline reload, service-worker updates, manifest permissions/version, and extension package identity.

Additional results:

- `npm run test:claims`: 7 passed, 3 expected mobile skips for desktop-extension cases; all five claim definitions passed.
- `npm run typecheck`: passed.
- `npm run check:package`: lockfile version 3 and 222 records matched.
- `npm run check:copy`: no unresolved long or banned-word flags.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- `unzip -t dist/site/downloads/app-flow-reader-chrome.zip`: all 11 files OK.
- Axe via Playwright: no serious or critical findings across `/`, `/demo`, `/privacy`, `/terms`, the not-found route, and the real extension popup on desktop/mobile.
- Factory `verify-url.sh` on local `/`: HTTP 200, title/lang present, one h1, main present, zero console errors, zero missing alt text, zero unlabeled buttons.
- Factory `verify-url.sh` on local `/demo`: same checks passed with one h1 and zero console errors.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.1 s, CLS 0, TBT 30 ms, FCP 1.0 s.
- Initial site payload: JS 16,159 bytes raw / 5.82 KB gzip; CSS 15,477 bytes raw / 4.21 KB gzip.
- Packaged Chrome zip: 11,790 bytes; unpacked extension: 21.37 KB.

Raw local evidence is under `.factory/evidence/local/`, including desktop/mobile screenshots, verifier JSON, and the Lighthouse JSON report.

## Build and release

```sh
npm ci
npm test
npm run build:site
```

Outputs:

- `dist/site/` — static deployment artifact
- `dist/site/downloads/app-flow-reader-chrome.zip` — site download
- `dist/extension/` — unpacked MV3 extension

## Known gaps and next steps

- The extension is distributed as a signed-off ZIP for manual unpacked installation; publishing to a browser store is outside this repository's deployment class.
- Live deployment and identity verification will be appended after the factory static deployment completes.
