# Independent verification 6 — PASS

Date: 29 August 2026 UTC
Candidate: `4b19b85c8f88176b9b55bf38dc164c8d40e6befd` (`main`)
Live URL: <https://app-flow-reader.sociobot.in>

## Verdict

**PASS — release candidate accepted.**

Fresh evidence does not reproduce a deployment-only failure. The live site,
service worker, and downloadable Manifest V3 extension are byte-identical to
the candidate's production build. The live checkout works, all 15 declared
claims pass, and no Critical, High, Medium, or Low product defect remains.
No product code was changed during verification.

## Mandatory first read and one-click demo

A cold live read at desktop and a real 390 × 844 Playwright viewport answers
the three required questions in the first screen:

- **What it does:** “Follow saved routes through dense workplace apps.”
- **For whom:** “For people with progressive low vision who need one reliable
  path through dense workplace apps.”
- **What to click first:** **Try it with sample data**, immediately explained
  as “Follow a five-step expense route.”

The action opens `/?demo=1` in one click. The first demo view already contains
five realistic monthly-expense steps and the current instruction. Its persistent
banner says “Demo — Sample data. Nothing is saved” and provides **Reset demo**
and **Start for real**. At 390 px the complete first-screen copy and facts fit,
the page width is exactly 390 px, and no horizontal overflow occurs.

## Claims gate

`.factory/claims.json` exists and contains 15 claims. After the clean lockfile
install, every exact `test` command was invoked individually through its demo
or packaged-extension entry point. All passed with zero claim failures.

| Claim ID | Result | Retained output |
| --- | --- | --- |
| `guided-route` | PASS | [claims.log](evidence/verification-6/claims.log) |
| `private-capture` | PASS | [claims.log](evidence/verification-6/claims.log) |
| `local-storage` | PASS | [claims.log](evidence/verification-6/claims.log) |
| `extension-network` | PASS | [claims.log](evidence/verification-6/claims.log) |
| `route-controls` | PASS | [claims.log](evidence/verification-6/claims.log) |
| `export-files` | PASS | [claims.log](evidence/verification-6/claims.log) |
| `no-account` | PASS | [claims.log](evidence/verification-6/claims.log) |
| `demo-isolated` | PASS | [claims.log](evidence/verification-6/claims.log) |
| `offline-reload` | PASS | [claims.log](evidence/verification-6/claims.log) |
| `no-tracking` | PASS | [claims.log](evidence/verification-6/claims.log) |
| `supporter-license` | PASS | [claims.log](evidence/verification-6/claims.log) |
| `supporter-checkout` | PASS | [claims.log](evidence/verification-6/claims.log) |
| `browser-page-boundaries` | PASS | [claims.log](evidence/verification-6/claims.log) |
| `mv3-package` | PASS | [claims.log](evidence/verification-6/claims.log) |
| `license-return` | PASS | [claims.log](evidence/verification-6/claims.log) |

Extension-only cases have one expected mobile-project skip because Chromium
extensions are tested in a desktop browser profile; their desktop case passes.
The landing page and README were cross-checked against the inventory. No
unlisted user-facing product claim was found.

Independent live/demo observations are in
[live-browser-contract.json](evidence/verification-6/live-browser-contract.json),
and the downloaded-extension checks are in
[extension-live-smoke.json](evidence/verification-6/extension-live-smoke.json).

## Clean local gates and exact build

- `npm ci`: PASS; 171 packages installed and 0 vulnerabilities reported.
- `npm test`: PASS; 6 Vitest unit tests and 34 Playwright browser tests passed,
  with 10 expected extension/mobile skips.
- `npm run typecheck`, `npm run lint`, `npm run check:package`, and
  `npm run check:copy`: PASS.
- `npm audit --audit-level=high`: PASS; 0 vulnerabilities.
- `npm run test:a11y`: PASS; 3 tests passed and the extension/mobile project
  produced its one expected skip.
- `npm run build`: PASS; it produced `dist/site`, `dist/extension`, and
  `dist/site/downloads/app-flow-reader-chrome.zip`.
- `unzip -t dist/site/downloads/app-flow-reader-chrome.zip`: PASS for all 11
  packaged files.

## End-to-end behavior and recovery

- The live demo advanced from step 1 to step 2 and announced “Step 2 of 5.
  Choose New report.” Exactly one step had `aria-current="step"`.
- The demo accepted a 280-character note, cleared whitespace-only input,
  removed and restored a step with Undo, reset to five steps, and exported all
  five steps in Markdown and JSON. **Start for real** discarded demo state and
  focused the real extension download section.
- The byte-identical live ZIP was installed into a fresh Chromium profile. An
  independent smoke recorded two named routes at the minimum and maximum
  boundaries (3 and 10 steps). A 12-click burst stopped cleanly at 10.
- Accessible-name capture stored “Save report”; a labeled password field, its
  typed value, and screenshots were absent from extension storage.
- Playback injected a visible reader, announced the current step, applied a
  4 px target outline, and exposed keyboard-focusable 112 × 48 px Back and Next
  controls. Keyboard focus showed a designed 3 px outline.
- Markdown and JSON exports contained the complete selected route. Canceling
  deletion retained it; confirming deletion removed it.
- Empty and invalid license input produced direct recovery text. The invalid
  live check contacted only the documented Sociobot verification endpoint;
  ordinary recording made no external request.

## Accessibility, responsive behavior, and privacy

- `/opt/fleet/lib/verify-url.sh` passed `/`, `/demo`, `/privacy`, and `/terms`:
  HTTP 200, route-appropriate title, `lang=en`, one `h1`, one `main`, no missing
  image alternatives, no unnamed buttons, and no supported-page browser errors.
- Fresh live Axe scans at 390 px found zero serious or critical findings on
  home, demo, privacy, terms, and the designed 404 in both light and dark
  reduced-motion modes. Desktop live light/dark checks and the packaged popup
  light/dark checks also found none.
- Keyboard-only smoke passed: the first Tab reaches the skip link with a 3 px
  orange outline, Enter focuses `main`, the note dialog receives focus, Escape
  closes it, and focus returns to the invoking button.
- Every visible interactive target tested at 390 px is at least 44 px. At 200%
  text size, the 390 px page retains its action and has no horizontal overflow.
  Reduced motion resolves transition and animation duration to `0.00001s` and
  scrolling to `auto`.
- The complete live demo flow made only same-origin requests and left cookies,
  localStorage, sessionStorage, and IndexedDB empty. Public pages load no
  analytics, external fonts, or third-party scripts.
- The extension requests only `storage`, `activeTab`, and the Sociobot license
  verification host. Route recording made no external request. Browser-internal
  pages are excluded by its `http://*/*` and `https://*/*` match patterns.
- Manual NVDA testing was unavailable in this Linux worker. The product makes
  no conformance claim; live regions, semantics, name/role/state, focus, and
  dialog behavior were exercised instead.

## Deployment, policy, links, and rate limit

- `npm run test:live-checkout`: PASS. The Sociobot product endpoint returned
  HTTP 303 to a hosted `checkout.dodopayments.com` session; no payment was made.
- The license verification endpoint enforces an observed allowance of **30
  requests per client burst**. A fresh sequential run returned 30 HTTP 200
  responses, then HTTP 429 from request 31 through 35, each with
  `Retry-After: 4`. CORS allowed the product origin.
- There is no sign-in flow, so Microsoft Entra authority validation is not
  applicable.
- All rendered internal links, the ZIP, and the Param Factory link returned
  200; mail links were identified without fetching. An unknown route returned
  the designed page with HTTP 404. The deliberate 404 navigation emits only
  the browser's expected failed-resource message, not an application error.
- Live headers include HSTS, CSP with `frame-ancestors 'none'`, `nosniff`,
  `X-Frame-Options: DENY`, strict-origin referrer policy, and restrictive
  camera/microphone/geolocation permissions.
- HTML caches for 30 seconds with revalidation, hashed JS/CSS for one year as
  immutable, the extension ZIP for one hour, and `sw.js` with `no-cache`.
- Service-worker `registration.update()` completed. After priming, `/demo`
  reloaded offline with five steps and Next advanced to step 2.

## Performance and deployment identity

The initial site bundle is 19,566 bytes JS (6.79 kB gzip) and 17,646 bytes CSS
(4.68 kB gzip), with no font payload. The unpacked extension is 36.20 kB and
the ZIP is 16,579 bytes. A clean live mobile Lighthouse run scored Performance
100, Accessibility 100, Best Practices 100, and SEO 100; FCP 0.8 s, LCP 0.9 s,
TBT 70 ms, Speed Index 0.8 s, and CLS 0.

Fresh SHA-256 and byte comparisons prove production matches the candidate:

| Artifact | SHA-256 | Match |
| --- | --- | --- |
| `index.html` | `1986c176189f2918f928147581d1fbf5c9727c7bfd75849ae04eb78110419137` | yes |
| `assets/index-Btwexh82.js` | `014382d2fb36875e4bb26159eb1c975d37aacd290f6b2c9b6533bc293f425eee` | yes |
| `assets/index-Bdr1bwPJ.css` | `fbb890d5e7b6ac149201b312cabb64d0cf4046ddbb670d76943e8b34c68b6be9` | yes |
| `sw.js` | `ce3981be73c688b4208b60e42dd54e4065558d6ddd639c2cdf185d55928fb7a3` | yes |
| extension ZIP | `ac0bea2ec1c83b56a0c4c7d2e85a79312768a3e8947f6d2a4935f3717183ef78` | yes |

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

Evidence and independent harnesses are retained under
`.factory/evidence/verification-6/`.
