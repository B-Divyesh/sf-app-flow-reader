# Handoff — release blocker repaired

Date: 28 August 2026 UTC

Work order: `app-flow-reader-repair-3`

Verifier report: `9e2c55519b3aaea98d7ac751a0015ed851ce89ba`

Repaired candidate: `a993c4795eb284174b0d265cde0c92b1daa11cec`

Live URL: <https://app-flow-reader.sociobot.in>

## Outcome

**PASS — the verifier's only release blocker is repaired.**

The free low-vision route reader was preserved. The advertised $12 one-time
supporter purchase now opens a real hosted checkout instead of returning 404.

## Root cause and repair

The verifier found that
`https://api.sociobot.in/api/v1/products/app-flow-reader/checkout` returned
HTTP 404 because `app-flow-reader` did not exist in the live Sociobot factory
product catalog. The site code and license client were already correct.

- Created the one-time **App Flow Reader Supporter** product in Dodo Live for
  USD 12.00 (`pdt_0NmNSXI2Fvn9n1Li2fk0A`).
- Enabled the corresponding immutable Sociobot factory product mapping with
  return URL `https://app-flow-reader.sociobot.in/`.
- Added `npm run test:live-checkout`. It checks the live catalog's name,
  amount, currency, return site, and checkout URL; requires the gateway to
  return HTTP 303; validates the hosted Dodo session URL; and requires the
  hosted checkout page to return HTTP 200.
- Documented the production smoke test in `README.md`.

The regression failed before registration with
`app-flow-reader must be enabled in the live product catalog` and passed after
the repair.

## Clean verification

- `npm ci`: PASS — 171 packages installed; 0 vulnerabilities.
- Every exact command in `.factory/claims.json`: PASS individually for all ten
  claims.
- `npm test`: PASS — 6 Vitest tests and 29 Playwright tests; 7 expected mobile
  skips for extension-only APIs.
- `npm run test:a11y`: PASS — 3 tests; 1 expected extension/mobile skip.
- `npm run typecheck`, `npm run lint`, `npm run check:package`, and
  `npm run check:copy`: PASS.
- `npm audit --audit-level=high`: PASS — 0 vulnerabilities.
- `npm run build`: PASS — produced `dist/site/`, `dist/extension/`, and the
  packaged Chrome MV3 ZIP.
- `unzip -t dist/site/downloads/app-flow-reader-chrome.zip`: PASS for all 11
  packaged files.
- Initial site bundle: 20.80 kB JavaScript / 7.22 kB gzip and 17.68 kB CSS /
  4.70 kB gzip. Extension: 31.03 kB unpacked / 15.04 kB ZIP.

## Browser, accessibility, privacy, and recovery

- Fresh live desktop (1440 × 900) and mobile (390 × 844) demo runs advanced
  to step 2 of 5, announced the new step, retained one current marker, had no
  overflow or targets below 44 px, and produced no console/page errors.
- Live axe checks in light and dark reduced-motion modes found no serious or
  critical findings. `/opt/fleet/lib/verify-url.sh` passed `/` and `/demo`:
  HTTP 200, correct title and `lang`, one h1, main landmark, complete image alt
  text, labeled buttons, and no browser errors.
- Keyboard smoke test passed: first Tab focused the skip link with a 3 px coral
  outline; Enter focused main; the note dialog focused its textbox; Escape
  closed it and returned focus to the invoking button.
- Demo traffic stayed same-origin, with no console errors. Service-worker
  update and offline reload passed on desktop and mobile with all five sample
  steps available.
- Known routes returned 200 and `/definitely-missing` returned the styled HTTP
  404. HSTS, CSP, `nosniff`, frame denial, strict-origin referrer policy, and
  camera/microphone/geolocation denial were present.
- A live invalid return token was stored, sent only to the Sociobot verify
  endpoint, removed from the address bar, rejected with `reason: invalid`, and
  surfaced as an inactive-license notice. The endpoint allowed only the
  product origin by CORS. A 40-request burst yielded 29 HTTP 200 and 11 HTTP
  429 responses with `Retry-After: 3`.
- Mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; FCP 0.8 s, LCP 0.8 s, TBT 30 ms, CLS 0.

Evidence is under `.factory/evidence/repair-3/live/`.

## Billing evidence

`npm run test:live-checkout` now passes:

1. The production catalog lists `app-flow-reader` at USD 12.00.
2. The product checkout returns HTTP 303 to
   `https://checkout.dodopayments.com/session/cks_…`.
3. The hosted checkout page returns HTTP 200.
4. Live invalid-token verification returns HTTP 200 with `valid: false` and
   the expected CORS policy.
5. The existing `@claim:supporter-license` test covers return-token storage,
   URL stripping, successful verification, daily verdict caching, style
   selection, restore, and revocation with a recorded gateway response.

No real-money payment was submitted during automated QA. The hosted checkout,
gateway return handling, verification behavior, and recorded success path were
all exercised without creating a charge.

## Deployment and identity

Azure Static Web Apps deployment `92b99746-d86e-4605-9836-a067b8d2c486`
completed successfully in `centralus`; the custom domain returned HTTP 200.

| Artifact | SHA-256 | Live match |
| --- | --- | --- |
| `index.html` | `38088a5c6e4e43c8cbaed3a7acfcbc734fc0119b833dcd4ce2974c38b477a786` | yes |
| `assets/index-Ckl653Wu.js` | `5f08ef781d9fafd1d517c0bc5d45979121a69c0836d8251351de66a39a59c645` | yes |
| `assets/index-GB3v4zpO.css` | `5bb660b578e88e506be2cf0a5a3659e72ce1fb5c3929f53b2c8a819e3a540b1c` | yes |
| `sw.js` | `ce3981be73c688b4208b60e42dd54e4065558d6ddd639c2cdf185d55928fb7a3` | yes |
| extension ZIP | `1a4ba4f9b98719dddbec20cda9c44f4d847446132efedf6ecc936b53ad8f2c21` | yes |

## Run it

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run test:a11y
npm run check:package
npm run check:copy
npm audit --audit-level=high
npm run build
unzip -t dist/site/downloads/app-flow-reader-chrome.zip
npm run test:live-checkout
```

## Known gaps

No release-blocking gaps remain. A real purchase was intentionally not charged
during QA; refund and successful payment webhooks remain owned by the shared
Sociobot billing service.
