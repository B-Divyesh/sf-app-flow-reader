# Independent verification 5 — PASS

Date: 29 August 2026 UTC
Candidate: `ad09c0a40eb81aa4848e986ae92921a96774e553` (`main`)
Live URL: <https://app-flow-reader.sociobot.in>

## Verdict

**PASS — release candidate accepted.**

Fresh evidence does not reproduce the previous deployment-only failure. The
live page, service worker, and downloadable MV3 package are byte-identical to
this candidate build. The repaired demo has the explicit **Start for real**
transition, and production checkout returns a hosted Sociobot/Dodo session.
No product code was changed during this verification.

## Mandatory cold read and demo gate

In a fresh desktop browser, the first screen said:

- **What it does:** “Follow saved routes through dense workplace apps.”
- **For whom:** “For people with progressive low vision who need one reliable
  path through dense workplace apps.”
- **What to click first:** **Try it with sample data**, followed by “Follow a
  five-step expense route.”

This is plain language and passes the first-read gate. The one-click action
opened `/?demo=1`, showing the persistent “Demo — Sample data. Nothing is
saved” banner, **Reset demo**, and **Start for real**. Desktop and 390 × 844
mobile runs advanced the realistic five-step expense route from step 1 to 2
without overflow or errors. The 390 px Back/Next controls are 310 × 52 px;
Reset demo and Start for real are both 44 px high. The demo retained no
localStorage, sessionStorage, or IndexedDB data before or after advancing.

## Claims gate

`.factory/claims.json` exists and contains 14 claims. After fresh `npm ci`, I
ran every declared command separately, through its specified demo or packaged
MV3 entry point. All passed.

| Claim ID | Exact command | Result |
| --- | --- | --- |
| guided-route | `npm run test:e2e -- --grep @claim:guided-route` | PASS |
| private-capture | `npm run test:e2e -- --grep @claim:private-capture` | PASS |
| local-storage | `npm run test:e2e -- --grep @claim:local-storage` | PASS |
| extension-network | `npm run test:e2e -- --grep @claim:extension-network` | PASS |
| route-controls | `npm run test:e2e -- --grep @claim:route-controls` | PASS |
| export-files | `npm run test:e2e -- --grep @claim:export-files` | PASS |
| no-account | `npm run test:e2e -- --grep @claim:no-account` | PASS |
| demo-isolated | `npm run test:e2e -- --grep @claim:demo-isolated` | PASS |
| offline-reload | `npm run test:e2e -- --grep @claim:offline-reload` | PASS |
| no-tracking | `npm run test:e2e -- --grep @claim:no-tracking` | PASS |
| supporter-license | `npm run test:e2e -- --grep @claim:supporter-license` | PASS |
| browser-page-boundaries | `npm run test:e2e -- --grep @claim:browser-page-boundaries` | PASS |
| mv3-package | `npm run test:e2e -- --grep @claim:mv3-package` | PASS |
| license-return | `npm run test:e2e -- --grep @claim:license-return` | PASS |

## Local build and package checks

- `npm ci`: PASS; 171 packages installed and `npm audit --audit-level=high`
  reported 0 vulnerabilities.
- `npm test`: PASS — 6 unit tests and the complete Playwright matrix passed;
  `test-results/.last-run.json` is `{"status":"passed","failedTests":[]}`.
- `npm run typecheck`, `npm run lint`, `npm run check:package`, and
  `npm run check:copy`: PASS.
- `npm run test:a11y`: PASS. It covers the site routes in light, dark, and
  reduced-motion modes plus the extension popup; no serious or critical Axe
  findings occurred.
- `npm run build`: PASS, producing `dist/site`, `dist/extension`, and
  `dist/site/downloads/app-flow-reader-chrome.zip`.
- `unzip -t dist/site/downloads/app-flow-reader-chrome.zip`: PASS. The package
  is a Manifest V3 extension with only `storage`, `activeTab`, and the
  Sociobot verification host permission.
- Initial site JS is 19,518 bytes raw / 6,816 bytes gzip; CSS is 17,646 bytes
  raw / 4,673 bytes gzip. Both are well below the applicable budgets.

## Independent live QA

- Fresh desktop and 390 px browser runs had no page errors or console errors.
  Home and demo request logs contained only `app-flow-reader.sociobot.in`;
  there were no analytics, external fonts, third-party scripts, or demo
  cross-origin requests.
- Live Axe scans on home and demo at both viewports found no WCAG 2 A/AA
  violations. Keyboard-only tabbing starts at the skip link and shows a
  designed 3 px orange focus outline. The primary demo link is 350 × 52 px at
  390 px width. The packaged-popup accessibility test also passed in both
  themes.
- The service worker is served `Cache-Control: no-cache`; the declared
  offline-reload claim passed from a fresh context after priming the demo.
  Its versioned cache, `skipWaiting`, and `clients.claim` provide the expected
  update behavior.
- `/`, `/demo`, `/privacy`, `/terms`, and the extension ZIP all returned 200;
  an unknown route returned the intended 404. The checkout endpoint returned
  HTTP 303 to a hosted `checkout.dodopayments.com` session. `npm run
  test:live-checkout` also passed.
- Production headers include CSP with `frame-ancestors 'none'`, HSTS,
  `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, strict-origin
  referrer policy, and a restrictive permissions policy. Hashed assets are
  immutable for one year, downloads cache for one hour, and the service worker
  is no-cache.
- License verification is the only product-related external endpoint. A fresh
  sequential invalid-token probe observed 30 HTTP 200 responses, followed by
  10 HTTP 429 responses with `Retry-After: 3`; observed allowance: 30 requests
  per burst from one client. There is no product backend or sign-in flow, so
  Entra tenant validation is not applicable.

## Deployment identity

The following locally built and live files have the same SHA-256:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `5eaf2f78d408be8bc489a0c8bd62c43d1eead45e969a9d4120bdedad74bc794f` |
| `assets/index-DHzDEiMu.js` | `802bb14ed9217b79e1e202bea4b921c61f2cb47614a6f7615377cbb194bcf244` |
| `assets/index-Bdr1bwPJ.css` | `fbb890d5e7b6ac149201b312cabb64d0cf4046ddbb670d76943e8b34c68b6be9` |
| `sw.js` | `ce3981be73c688b4208b60e42dd54e4065558d6ddd639c2cdf185d55928fb7a3` |
| `downloads/app-flow-reader-chrome.zip` | `a2388442b4e94d746f0d397ac6e672647d6625261b3600ab7941a685df058f26` |

## Defects by severity

No Critical, High, Medium, or Low release defects found.

Manual NVDA testing was not possible in this Linux worker. The product makes
no NVDA-conformance claim; automated screen-reader-adjacent checks covered
semantic landmarks, focus, live announcements, native dialog handling,
keyboard operation, and Axe.
