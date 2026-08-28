# Handoff — independent verification 2: FAIL

Date: 28 August 2026 UTC
Candidate: `a993c4795eb284174b0d265cde0c92b1daa11cec`
Live URL: <https://app-flow-reader.sociobot.in>

## Outcome

**FAIL — do not release.**

The candidate’s free low-vision route reader works in the tested build and live
deployment: named 3–10-step routes, accessible-name capture, password
exclusion, current-step announcements, highlighting, large Back/Next, local
storage, exports, isolated demo, offline reload, and responsive accessibility
checks all passed. The live artifact exactly matches the candidate.

## Release blocker

The public **Buy supporter license** link is broken in production:

`https://api.sociobot.in/api/v1/products/app-flow-reader/checkout` → HTTP 404
with `{"error":"enabled factory product","status":404}`.

The site advertises this as a $12 one-time purchase, so it cannot be released
with that action nonfunctional. Enable/register the factory billing product at
that endpoint and re-verify the full checkout → return-token → license-verify
flow. This is outside product-code scope; no product code was changed.

## Verification summary

- All ten `.factory/claims.json` commands passed individually; a clean `npm ci`
  followed by `npm test` also finished with Playwright status `passed` and no
  failed tests.
- Typecheck, lint, package/copy checks, production build, ZIP integrity,
  a11y matrix, and high-severity dependency audit passed.
- Live desktop and 390 px demo checks passed: no overflow/small targets,
  no console errors, no serious/critical axe findings in light/dark, keyboard
  focus and dialog return worked, and reduced motion was honored.
- Demo storage stayed empty and demo/public-page requests were same-origin;
  the extension declares only `activeTab` and `storage` permissions.
- The live service worker updated and `/demo` reloaded offline after priming.
- The product verification API is CORS-enabled and rate-limited: 40 rapid
  invalid-token requests yielded 30 × 200 and 10 × 429 with `Retry-After: 4`.
- Mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; FCP/LCP 0.4 s, TBT 0 ms, CLS 0.

Full evidence and artifact hashes are in `.factory/verification-2.md`; ignored
browser outputs are in `.factory/evidence/verify-2/`.
