# Polish round 1 — App Flow Reader

Date: 28 August 2026 UTC

Candidate repaired: `a3e06c2ff2c4e1f8fb0d3c24aa13ae5e29718d2d`

## Finding closure

| Finding ID | Change made | Evidence |
| --- | --- | --- |
| F-1-1 / earlier M3 | Added extension-native supporter license restore, one-day verification cache, invalid/revoked lockout, persistent Blueprint/Graphite/Sunrise popup covers, and automatic product-return handoff through the installed content script. | `@claim:supporter-license`; `@claim:license-return`; packaged `dist/extension/`; `evidence/polish-1/home-desktop.png` |
| F-1-2 | `?demo=1` and `/demo` now reset sample memory on entry and on leaving. The banner calls the result **Leave demo**. | `@claim:demo-isolated`; `evidence/polish-1/demo-mobile.png` |
| F-1-3 / earlier H4 | Expanded claims inventory to 13 atomic, observable claims; strengthened reader, demo, privacy, packaging, page-boundary, return, and supporter tests. Removed untestable refund language. | Every command in `.factory/claims.json` run individually after `npm ci`; `npm run test:claims` passes |
| F-1-4 | Replaced ambiguous hero facts with literal Private, Offline, and Free/$12 facts. | landing test; `evidence/polish-1/home-desktop.png` |
| F-1-5 | Renamed **Start for real** to **Leave demo** and made it discard the sandbox before returning home. | `@claim:demo-isolated`; `evidence/polish-1/demo-mobile.png` |
| F-1-6 | Standardized visitor copy on “dense workplace apps.” | `npm run check:copy`; `.factory/copy-audit.md` |
| F-1-7 | Rewrote the README opening and install browser wording; reserved Manifest V3 for development details. | `README.md`; `npm run check:copy` |
| F-1-8 | Replaced user-facing “Chrome local storage” with “on this device.” | `README.md`; `@claim:local-storage` |
| F-1-9 | Renamed README headings for an out-of-context heading list. | `README.md`; `npm run check:copy` |
| F-1-10 | `setMetadata` now updates OG and Twitter title, description, and URL for every SPA route; static 404 has matching route metadata. | route-metadata test; `evidence/polish-1/privacy-desktop.png` |
| F-1-11 | Changed visible demo action from **Note** to **Edit note** while preserving step-specific names. | demo editing test; `evidence/polish-1/demo-mobile.png` |
| Earlier C1 | Retained named 3–10-step routes, playback, announcements, visible target highlight, and large Back/Next reader; strengthened observable assertions. | `@claim:guided-route` |
| Earlier H1 | Retained serialized background mutations; burst recording assertion remains part of the guided-route claim. | `@claim:guided-route` |
| Earlier H2 | Retained accessible-name-first capture and password exclusion; added typed-value and screenshot assertions. | `@claim:private-capture` |
| Earlier H3 | Retained dark contrast repair and ran axe on all routes and popup in light/dark modes. | `npm run test:a11y` |
| Earlier M1 | Demo banner controls remain 44 px at 390 px. | mobile target test in `npm test`; `evidence/polish-1/demo-mobile.png` |
| Earlier M2 | Added a dedicated styled `404.html` and configured Static Web Apps to rewrite HTTP 404 responses to it. | route/deployment-policy test; `public/site/404.html` |
| Verification-2 H1 | Retained working registered checkout route. | `npm run test:live-checkout` |

## Local verification

- Clean dependency install: `npm ci` — pass, 0 reported vulnerabilities.
- Full suite: `npm test` — pass (6 unit tests; 33 browser tests; 7 expected extension/mobile skips).
- Every exact command in `.factory/claims.json` — pass when run one at a time.
- Accessibility: `npm run test:a11y` — pass (3 tests; 1 expected extension/mobile skip).
- Type, package, copy, security, build, and archive: `npm run typecheck`, `npm run lint`, `npm run check:package`, `npm run check:copy`, `npm audit --audit-level=high`, `npm run build`, and `unzip -t dist/site/downloads/app-flow-reader-chrome.zip` — pass.
- Checkout smoke: `npm run test:live-checkout` — pass; checkout redirects to the registered hosted session without submitting payment.

## Screenshots

- `evidence/polish-1/home-desktop.png`
- `evidence/polish-1/demo-mobile.png`
- `evidence/polish-1/privacy-desktop.png`

## Live re-check

Configured static deploy completed as Azure deployment `af5cf3d0-3c71-44e0-a430-1f77744f3a14` from repair commit `a50fa39b68724926b09774a6d926fc46e673bc2d`.

- `https://app-flow-reader.sociobot.in/`, `/?demo=1`, `/privacy`, and `/terms` cold-loaded with HTTP 200, one H1, `lang=en`, a main landmark, no missing image alt text, no unlabeled buttons, and no console/page errors. Evidence: `evidence/polish-1/live-{home,demo,privacy,terms}/verify.json`.
- Cold live axe via Playwright found zero serious/critical violations for those four routes in both light and dark mode.
- `https://app-flow-reader.sociobot.in/definitely-missing` returned HTTP 404 and served **Page not found — App Flow Reader**.
- The direct `?demo=1` route visibly exposes the banner, Reset demo, Leave demo, five-step sample, and the active reader in `evidence/polish-1/live-demo/screenshot-mobile.png`.
