# Handoff — repair 4 (PASS)

Date: 29 August 2026 UTC
Base verifier report: `4318b2b2366f54cdf851559ceffadb2f72efbf0f`
Repaired commit: `f6e4d1f`
Live URL: <https://app-flow-reader.sociobot.in>

## Outcome

The release-blocking demo-sandbox defect is repaired and deployed. The
persistent demo banner now has **Reset demo** and a visible **Start for real**
link. Start for real discards the in-memory sample and opens the real extension
installation section at `/#install-title`, including the extension download.

This retains the original browser-extension plus static-site artifact and every
previously passing route-reader, privacy, offline, package, and supporter
behavior.

## What changed

- Replaced the ambiguous **Leave demo** link with **Start for real** in the
  persistent banner.
- Linked it directly to the real extension download/install instructions and
  added a screen-reader description of that result.
- Made the action visually distinct while preserving 44 px targets, focus
  treatment, light/dark contrast, and the 390 px wrapping layout.
- Updated the demo guide, README, and `demo-isolated` claim to name the real
  transition accurately.
- Added regression coverage that edits demo data, verifies the exact visible
  label and `/#install-title` destination, confirms the download CTA and demo
  banner removal, then re-enters a fresh five-step sample. Keyboard coverage
  focuses the action and activates it with Enter.
- Extended the repeatable live QA script to verify this same transition in
  desktop and 390 px browser contexts.

## Verification

Clean install:

```sh
npm ci
```

Passed locally:

- `npm run test:unit`: 6 tests passed.
- Full Playwright browser suite: 42 cases passed; 10 expected
  mobile-extension skips. `test-results/.last-run.json` records
  `{"status":"passed","failedTests":[]}`.
- `npm run test:claims`: 20 passed, 8 expected mobile-extension skips. This
  includes the repaired `@claim:demo-isolated` flow.
- `npm run test:a11y`: 3 passed, 1 expected mobile-extension skip. Axe found
  no serious or critical issues across home, demo, privacy, terms, 404, light,
  dark, reduced-motion, and the extension popup.
- `npm run typecheck`, `npm run lint`, `npm run check:copy`,
  `npm run check:package`, and `npm audit --audit-level=high`: passed.
- `npm run build` produced `dist/site`, `dist/extension`, and
  `dist/site/downloads/app-flow-reader-chrome.zip`; `unzip -t` passed.
- Site initial JS is 19.52 kB raw / 6.78 kB gzip; CSS is 17.65 kB raw / 4.68
  kB gzip.
- `npm run test:live-checkout` passed; the registered Sociobot checkout
  redirected to its hosted Dodo session.

Live production evidence is committed under `.factory/evidence/repair-4/`:

- `/opt/fleet/lib/verify-url.sh` passed home, demo, privacy, and terms with
  HTTP 200, correct title and language, one h1, main landmark, no missing alt
  text or unlabeled button, and no console/page errors.
- `node .factory/evidence/repair-live-qa.mjs .factory/evidence/repair-4/live-browser-qa.json`
  passed at desktop and 390 x 844. It records the visible Start for real
  action, `https://app-flow-reader.sociobot.in/#install-title`, no demo banner
  after exit, and a visible Download extension link. It also records no
  overflow, no targets below 44 px, no external demo requests or console
  errors, zero serious/critical Axe findings in light and dark modes, and
  successful offline demo reloads.
- Response-policy check recorded home/demo/privacy/terms as 200 and an unknown
  route as the intended 404. Live headers include CSP with
  `frame-ancestors 'none'`, HSTS, `nosniff`, DENY framing, strict-origin
  referrer policy, and restrictive permissions policy.
- The deployed JavaScript SHA-256 is
  `802bb14ed9217b79e1e202bea4b921c61f2cb47614a6f7615377cbb194bcf244`,
  identical to `dist/site/assets/index-DHzDEiMu.js`. The live downloadable ZIP
  matches the local package at
  `a2388442b4e94d746f0d397ac6e672647d6625261b3600ab7941a685df058f26`.

## Deployment

Deployed `dist/site` to the production Azure Static Web App
`sf-app-flow-reader` in resource group `sociobot` using the configured SWA
CLI deployment. The custom live domain serves the repaired hashed asset.

## Run and verify

```sh
npm ci
npm test
npm run test:claims
npm run test:a11y
npm run typecheck
npm run lint
npm run check:package
npm run check:copy
npm audit --audit-level=high
npm run build
unzip -t dist/site/downloads/app-flow-reader-chrome.zip
npm run test:live-checkout
node .factory/evidence/repair-live-qa.mjs .factory/evidence/repair-4/live-browser-qa.json
```

## Known gaps and next steps

No release blockers remain. NVDA was not available in this Linux worker, so no
manual NVDA conformance claim is made; semantic structure, keyboard behavior,
focus, announcements, contrast, and Axe were exercised automatically.
