# Independent verification 3 — PASS

Date: 28 August 2026 UTC
Candidate: `a3e06c2ff2c4e1f8fb0d3c24aa13ae5e29718d2d` (`main`)
Live URL: <https://app-flow-reader.sociobot.in>

## Verdict

**PASS — release candidate accepted.**

The earlier deployment-only checkout failure is not present. Fresh evidence shows
that the live site and downloadable extension exactly match this candidate's
production build, and that checkout now opens the hosted Sociobot/Dodo flow.
No product code was changed for this verification.

## Mandatory cold read and demo

Cold live reads at desktop and 390 × 844 mobile both answered the required
questions in the first screen:

- **Does:** “Follow saved routes through busy web apps.”
- **For:** “For people with progressive low vision who need a reliable path
  through dense workplace software.”
- **First action:** **Try it with sample data**, immediately explained as
  “Follow a five-step expense route.”

The single action opened `/demo` on both viewports. The persistent banner said
“Demo — Sample data. Nothing is saved” and included **Reset demo** and
**Start for real**. The sample had five realistic expense-report steps;
Next advanced from step 1 to 2. Editing a note, undoing deletion, resetting,
both exports, and the boundary 3–10-step recorder flow are exercised by the
full packaged-extension suite below.

## Claims gate

`.factory/claims.json` exists and defines the required ten claims. After a
fresh `npm ci`, every exact command was invoked individually through the
product's demo/packaged-extension entry points. All passed.

| Claim | Exact command | Result |
| --- | --- | --- |
| guided-route | `npm run test:e2e -- --grep @claim:guided-route` | PASS |
| private-capture | `npm run test:e2e -- --grep @claim:private-capture` | PASS |
| local-storage | `npm run test:e2e -- --grep @claim:local-storage` | PASS |
| route-controls | `npm run test:e2e -- --grep @claim:route-controls` | PASS |
| export-files | `npm run test:e2e -- --grep @claim:export-files` | PASS |
| no-account | `npm run test:e2e -- --grep @claim:no-account` | PASS |
| demo-isolated | `npm run test:e2e -- --grep @claim:demo-isolated` | PASS |
| offline-reload | `npm run test:e2e -- --grep @claim:offline-reload` | PASS |
| no-tracking | `npm run test:e2e -- --grep @claim:no-tracking` | PASS |
| supporter-license | `npm run test:e2e -- --grep @claim:supporter-license` | PASS |

The subsequent complete suite also passed: 6 unit tests and the Playwright
matrix (the final `test-results/.last-run.json` is `status: passed`, with no
failed tests). Extension-only mobile cases are expected skips.

## Local build and package gates

- `npm ci`: PASS; 171 packages installed; `npm audit --audit-level=high` found
  0 vulnerabilities.
- `npm test`, `npm run test:a11y`, `npm run typecheck`, `npm run lint`,
  `npm run check:package`, and `npm run check:copy`: PASS.
- `npm run build`: PASS; generated `dist/site`, `dist/extension`, and
  `dist/site/downloads/app-flow-reader-chrome.zip`.
- ZIP integrity: PASS (`unzip -t`, 11 files).
- Initial site JavaScript is 20.80 kB raw / 7.22 kB gzip; CSS is 17.68 kB raw
  / 4.70 kB gzip. The extension is 31.03 kB unpacked / 15.04 kB ZIP. All are
  within the applicable budgets.

## Live functional, accessibility, privacy, and policy checks

- Packaged MV3 tests exercised named multi-route recording, ten-step cap,
  accessible-name capture, password exclusion, playback with large Back/Next,
  pause/resume, annotation, Markdown/JSON export, and confirmed deletion.
- Live desktop and 390 px mobile cold loads and demo flows had no console or
  page errors, no external requests, and no horizontal overflow. In demo,
  localStorage, sessionStorage, and IndexedDB remained empty after editing.
- The live service worker primed and then reloaded `/demo` offline with all
  five steps; it could advance to step 2. `sw.js` is served `no-cache`.
- Keyboard smoke: first Tab reaches the skip link with a designed 3 px coral
  focus outline; Enter moves to main; native dialog focus and Escape return
  focus to the note trigger. Dark/reduced-motion 390 px testing also had no
  overflow.
- `@axe-core/playwright` found zero serious/critical findings on `/`, `/demo`,
  `/privacy`, `/terms`, and a missing route in live light and dark
  reduced-motion modes. `verify-url.sh` passed `/`: HTTP 200, title,
  `lang=en`, one h1, main landmark, zero missing image alts, zero unlabeled
  buttons, and no browser errors.
- Mobile Lighthouse completed: Performance **100**, Accessibility **100**,
  LCP **0.4 s**, CLS **0**, TBT **0 ms**.
- Cold home, privacy, and terms traffic was same-origin only; there were no
  analytics, third-party scripts, or external fonts. The extension manifest
  is MV3 and requests only `activeTab` and `storage`; it has no host
  permissions. The only optional network path is license verification to
  `api.sociobot.in`, listed in CSP and privacy copy.
- Response policies are present: HSTS, CSP, `nosniff`, DENY framing,
  strict-origin referrer policy, and camera/microphone/geolocation denial.
  HTML is `max-age=30, must-revalidate`; hashed assets are one-year immutable;
  the ZIP is one hour.
- `npm run test:live-checkout`: PASS. The advertised checkout endpoint returned
  HTTP 303 to a hosted `checkout.dodopayments.com` session; no payment was
  submitted. A 40-request concurrent invalid-license burst yielded 30 HTTP
  200 responses and 10 HTTP 429 responses, with `Retry-After: 2–3`; observed
  threshold: request 31 of the burst. No sign-in is offered, so Entra tenant
  validation is not applicable.

## Deployment identity

Fresh SHA-256 comparisons prove the deployment matches this candidate build:

| Artifact | SHA-256 | Live match |
| --- | --- | --- |
| `assets/index-Ckl653Wu.js` | `5f08ef781d9fafd1d517c0bc5d45979121a69c0836d8251351de66a39a59c645` | yes |
| `assets/index-GB3v4zpO.css` | `5bb660b578e88e506be2cf0a5a3659e72ce1fb5c3929f53b2c8a819e3a540b1c` | yes |
| `downloads/app-flow-reader-chrome.zip` | `1a4ba4f9b98719dddbec20cda9c44f4d847446132efedf6ecc936b53ad8f2c21` | yes |

## Defects

None found at blocker, high, medium, or low severity. NVDA was not available
in this Linux verification environment; the report makes no conformance claim.
