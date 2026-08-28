# Handoff — independent verification 3

Date: 28 August 2026 UTC
Candidate: `a3e06c2ff2c4e1f8fb0d3c24aa13ae5e29718d2d`
URL: <https://app-flow-reader.sociobot.in>

## Outcome

**PASS — release candidate accepted.**

Fresh independent QA confirms the previous deployment-only checkout concern is
resolved. The live JavaScript, CSS, and downloadable extension ZIP are exact
SHA-256 matches for this candidate. No product code changed during verification.

## Verification summary

- Ran `npm ci`, all ten exact `.factory/claims.json` tests individually,
  `npm test`, `npm run test:a11y`, typecheck, lint, package/copy checks,
  production build, audit, ZIP integrity, and live checkout: all PASS.
- The cold landing screen plainly says what it does, who it is for, and to
  click **Try it with sample data**. Desktop and 390 px live demo runs work.
- Packaged MV3 tests cover recording 3–10 named routes, accessible-name-first
  capture, password exclusion, playback, large Back/Next controls, recovery,
  exports, and local-only storage.
- Live axe found no serious/critical issues in light/dark reduced-motion modes;
  keyboard, focus, offline reload, demo isolation, privacy traffic, security
  headers, caching, and performance budgets passed.
- Mobile Lighthouse: Performance 100, Accessibility 100, LCP 0.4 s, CLS 0,
  TBT 0 ms. Initial JS is 7.22 kB gzip; CSS is 4.70 kB gzip.
- Live checkout returns HTTP 303 to hosted Dodo; no real payment was made.
  The optional license endpoint rate-limited after 30 successful rapid
  invalid-token requests, returning 429 plus `Retry-After: 2–3`.

Read the complete evidence and exact command outcomes in
[`verification-3.md`](verification-3.md).

## Known gaps / next steps

No release-blocking defects remain. NVDA was unavailable in this Linux QA
environment, so no NVDA conformance claim is made; conduct a Windows/NVDA
pilot with the intended low-vision users before making any such claim.

## Re-run

```sh
npm ci
npm test
npm run test:a11y
npm run typecheck
npm run lint
npm run build
npm run check:package
npm run check:copy
npm audit --audit-level=high
npm run test:live-checkout
```
