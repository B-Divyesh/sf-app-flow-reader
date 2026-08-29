# Independent verification 4 — FAIL

Date: 29 August 2026 UTC
Candidate: `676e22f54a7b19b45c2158a35cc904a8e324353d` (`main`)
Live URL: <https://app-flow-reader.sociobot.in>

## Verdict

**FAIL — do not release this candidate unchanged.**

The reported deployment-only failure is not reproducible: the live site and
downloadable MV3 ZIP are byte-identical to the candidate build, and checkout
opens the hosted Sociobot/Dodo session. All automated gates and declared claims
pass. The candidate nevertheless misses a mandatory demo-sandbox control: its
persistent demo banner offers **Leave demo**, not the required explicit
**Start for real** action. This leaves the transition from isolated sample data
to the real extension ambiguous for the target user, and is a release-blocking
acceptance-contract defect.

## Mandatory first read

Cold-loading the live home at desktop answered all required questions in plain
words:

- Does: “Follow saved routes through dense workplace apps.”
- For: people with progressive low vision who need one reliable path through
  those apps.
- First action: **Try it with sample data**, with the immediate result “Follow
  a five-step expense route.”

That action opens the isolated five-step expense-route demo in one click. The
first-read gate therefore passes.

## Claims gate — PASS

`.factory/claims.json` exists. From this clean candidate after `npm ci`, I ran
each exact declared command separately via its demo or packaged-MV3 entry point.
All passed:

| Claim ID | Result |
| --- | --- |
| guided-route | PASS |
| private-capture | PASS |
| local-storage | PASS |
| extension-network | PASS |
| route-controls | PASS |
| export-files | PASS |
| no-account | PASS |
| demo-isolated | PASS |
| offline-reload | PASS |
| no-tracking | PASS |
| supporter-license | PASS |
| browser-page-boundaries | PASS |
| mv3-package | PASS |
| license-return | PASS |

## Local build and package checks — PASS

- `npm ci`: PASS; 171 packages installed and audit reported zero
  vulnerabilities.
- `npm test`: PASS — 6 unit tests and 32 browser tests passed; 10 expected
  mobile-extension project skips.
- `npm run typecheck`, `npm run lint`, `npm run check:package`, and
  `npm run check:copy`: PASS.
- `npm run build`: PASS. It created `dist/site`, `dist/extension`, and
  `dist/site/downloads/app-flow-reader-chrome.zip`.
- Initial site JavaScript: 19.34 kB raw / 6.72 kB gzip. CSS: 17.57 kB raw /
  4.65 kB gzip. Both are within the static-product budgets.
- The packaged extension is MV3. Its automated fresh-profile tests exercised
  named 3–10-step routes, accessible-name capture, password exclusion, no
  storage of typed values or screenshots, large next/back controls,
  pause/resume, notes, Markdown/JSON export, deletion confirmation, license
  states, and browser-page boundaries.

## Fresh live evidence — PASS except the defect below

- `verify-url.sh` passed both `/` and `/demo`: HTTP 200, correct title,
  `lang=en`, one h1, main landmark, no missing image alt text, no unlabeled
  buttons, and no console/page errors.
- Manual live demo flow: Next advanced to step 2 of 5; a 300-character note
  was bounded to 280 characters and saved; remove reduced five steps to four;
  Undo restored five; both demo storage namespaces and IndexedDB remained
  empty. After service-worker priming, `/demo` reloaded offline with five
  steps.
- Cold live `/demo` request logging recorded only same-origin HTML, JS, and
  CSS; no analytics, external fonts, third-party scripts, or demo external
  requests were observed. The only optional extension network path is the
  documented license verification endpoint.
- Live mobile (390 x 844) had no horizontal overflow and no rendered
  interactive target smaller than 44 px. First Tab reached the skip link with
  a 3 px coral focus ring; Enter moved focus to main. Reduced motion reported
  transition/animation durations of `0.00001s` and `scroll-behavior: auto`.
- Fresh Axe on the live mobile demo in dark/reduced-motion mode found zero
  serious or critical violations. The full local matrix additionally passed
  Axe on home, demo, privacy, terms, and 404 in light, dark, and reduced-motion
  modes, plus the extension popup.
- Live headers include HSTS, CSP, `nosniff`, `frame-ancestors 'none'`, DENY
  framing, strict-origin referrer policy, and restrictive permissions policy.
  HTML is `max-age=30, must-revalidate`; hashed JS is one-year immutable; the
  ZIP is one hour.
- `npm run test:live-checkout`: PASS; the checkout endpoint returned its
  expected redirect to a hosted Dodo session. A fresh 40-request concurrent
  invalid-license test yielded 30 HTTP 200 responses and 10 HTTP 429 responses
  with `Retry-After: 4`; observed allowance: 30 requests per burst. No sign-in
  is offered, so Entra tenant validation is not applicable.

## Deployment identity — PASS

The live deployment is this candidate, not an earlier artifact:

| Artifact | SHA-256 | Live match |
| --- | --- | --- |
| `assets/index-DJwPnYaB.js` | `d2fc4cf02ceb0c8beca8d4b5b8dad9aa3d8ee2fa8cd24a1a5a1fd30b10788c4c` | yes |
| `downloads/app-flow-reader-chrome.zip` | `a2388442b4e94d746f0d397ac6e672647d6625261b3600ab7941a685df058f26` | yes |

## Defects

### M1 — Required explicit exit from demo is absent (release-blocking)

**Evidence:** On live `/demo`, the persistent yellow banner reads “Demo —
Sample data. Nothing is saved.” and provides **Reset demo** and **Leave demo**.
It does not provide the required **Start for real** action. The same lifecycle
is documented in `.factory/demo.md` as “Leave demo.”

**Impact:** The demo-sandbox acceptance contract requires a persistent banner
with Reset demo and Start for real so a user can knowingly leave isolated sample
data for their real workflow. “Leave demo” is not that plain-language
transition and merely returns home.

**Required repair:** Add a visible **Start for real** control to the persistent
banner which exits the isolated demo and directs the visitor to the real
extension start/install flow. Add a browser assertion for its visible label and
result, then rerun the claims and live QA.

No other blocker, high, medium, or low defect was found. NVDA was unavailable
in this Linux environment; no conformance claim is made.
