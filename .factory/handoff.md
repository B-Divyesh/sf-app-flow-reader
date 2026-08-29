# Handoff — adversarial review 7

Date: 29 August 2026 UTC
Reviewed revision: `fd2b610983319c6446a401a927cb6d487a2be937`

## Outcome

**FAIL — one minor issue remains.**

The review made no product-code changes. It recorded F-7-1 in
`review-7.md`: on the 390 × 844 live demo, the disabled Back button is visible
but enabled Next begins below the initial viewport. This makes the first demo
interaction less immediately tryable for the intended phone/low-vision user.

## Verification performed

- Fresh desktop and 390 px live cold reads: job, audience, and primary action
  are clear; no console errors or cross-origin home-page requests.
- Live demo: one click enters a realistic five-step route; banner, reset,
  Start for real, note-discard on re-entry, empty durable web storage,
  same-origin request log, and offline reload/advance all pass.
- Clean clone at `/tmp/app-flow-reader-review7`: `npm ci`, every exact one of
  the 15 `.factory/claims.json` test commands, `npm test`, typecheck, copy and
  package checks, build, a11y tests, and live-checkout test pass.
- Live route crawl: metadata, one-h1/main structure, 404, headers, all links,
  and Axe serious/critical checks pass.
- Historical review, polish, and handoff findings were rechecked; no earlier
  finding regressed.

## Next step

At the mobile breakpoint, ensure `#demo-next` is entirely inside the first
390 × 844 demo viewport, then add a viewport-bound assertion and repeat the
cold demo check. No other product work is requested by this review.
