# Handoff — polish round 1

Date: 28 August 2026 UTC

Repair commit: `a50fa39b68724926b09774a6d926fc46e673bc2d`

Live URL: <https://app-flow-reader.sociobot.in>

## Outcome

All findings in `review-1.md` and the retained earlier verification reports are closed. The release keeps the route-notebook visual identity while moving the supporter covers into the actual browser extension, isolating the direct `?demo=1` sandbox, completing the claims contract, and repairing copy, metadata, routing, legal links, and the real 404 response.

## What changed

- Supporter licenses now restore and verify in the packaged extension. Valid licenses reveal persistent Blueprint, Graphite, and Sunrise popup covers; revoked tokens hide them. The return page transfers a returned token to an installed extension and retains a copy/paste fallback.
- Demo mode is available from `?demo=1` and `/demo`, has Reset demo and Leave demo, never uses durable storage, and discards changed sample state when it is left or entered again.
- First-screen facts now state privacy, offline behavior, and the free/$12 price split. Visitor copy uses “dense workplace apps” consistently.
- Added claim coverage for browser-page boundaries, MV3 packaging, license return, typed-value/screenshot exclusion, actual reader announcement/highlight/control size, and demo leave/re-entry.
- Route-specific OG/Twitter metadata updates with every SPA route. Static Web Apps serves a designed, semantic `404.html` with HTTP 404.
- Updated README, catalog description, demo guide, copy audit, privacy/terms wording, mobile demo actions, and legal links.

## Verification

Clean install and local gates:

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
```

Results: all passed. `npm test` has 6 unit tests and 33 passing browser tests (7 expected extension/mobile skips). Every one of the 13 exact commands recorded in `.factory/claims.json` was also run individually after `npm ci` and passed. `npm run test:a11y` passed with 3 tests and 1 expected extension/mobile skip. The final site bundle is 19.22 kB raw / 6.67 kB gzip JS and 17.44 kB raw / 4.63 kB gzip CSS.

Deployment: `/opt/fleet/lib/deploy-static.sh app-flow-reader dist/site` completed with Azure deployment `af5cf3d0-3c71-44e0-a430-1f77744f3a14`.

Cold live re-checks:

- `verify-url.sh` passed `/`, `/?demo=1`, `/privacy`, and `/terms`; each returned 200 with no console errors and valid landmark/title/lang checks.
- Playwright axe found zero serious/critical violations in light and dark modes for all four live routes.
- `/definitely-missing` returned HTTP 404 with the designed static not-found page.
- `npm run test:live-checkout` passed without submitting a payment.

Evidence is under `.factory/evidence/polish-1/`, including desktop/mobile product screenshots and the live verifier reports.

## Run and deploy

Use `npm run dev` for the extension and `npm run dev:site` for the site. Build both artifacts with `npm run build`; deploy `dist/site/` as the static artifact. The extension ZIP is `dist/site/downloads/app-flow-reader-chrome.zip`.

## Known gaps

None. NVDA is not available in this Linux worker, and no NVDA conformance claim is made.
