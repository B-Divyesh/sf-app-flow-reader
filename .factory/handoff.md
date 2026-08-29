# Handoff — adversarial first-read review 6

Date: 29 August 2026 UTC
Reviewed revision: `5623dc05d54399bf47b77b171a9107d148c700b2`

## Outcome

**FAIL — one minor finding.** No product code was changed.

`F-6-1` in `review-6.md` records that **Buy supporter license** leaves the
site for checkout without disclosing that external navigation. The required
fix is a visible and accessible external-checkout disclosure plus a regression
test.

## Verification performed

- Cold live Chromium checks at 390 × 844 and 1440 × 900.
- One-click live demo, reset, Start for real, re-entry, storage, request, and
  offline behavior checks.
- Clean clone at `/tmp/app-flow-reader-review6.BRU4p9`: `npm ci`, then every
  one of the 14 exact claim commands in `.factory/claims.json`; all passed.
- `npm run test:a11y` passed (3 passed, 1 expected mobile-extension skip).
- Live route metadata, history/focus, HTTP status, link crawl, CSP/header,
  console, mobile-overflow, and Axe checks.

## How to reproduce the remaining issue

1. Open <https://app-flow-reader.sociobot.in>.
2. Scroll to **Optional supporter license**.
3. Inspect or follow **Buy supporter license**. It targets the Sociobot API
   endpoint and redirects to Dodo checkout, with no external-destination
   disclosure in its visible or accessible label.

## Known gaps

No other product defect was found. The native browser reports the expected
top-level HTTP 404 resource message when loading an unknown URL; application
scripts report no console error.
