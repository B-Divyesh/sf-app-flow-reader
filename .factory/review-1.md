# Adversarial first-read review 1 — App Flow Reader

Date: 28 August 2026 UTC

Candidate: `f349d76121f74572ec0b740447751d6d18c78fa3` (`main`)

Live URL: <https://app-flow-reader.sociobot.in>

Viewport checks: 390 × 844 and 1440 × 900, fresh Chromium contexts

## Verdict

**FAIL — 3 blocking, 2 medium, and 6 minor findings.**

The first screen is clear and the free route reader works in the tested flows.
The release still fails because the paid cover feature is implemented only on
the marketing site, leaving the demo through its own SPA does not discard demo
changes, and the claims contract leaves public promises unlisted or only
partially asserted.

## Findings

### F-1-1 — BLOCKING — The paid cover feature does not exist in the browser extension (earlier M3 is only half-fixed)

- **Exact copy/location:** landing page: “A supporter license adds three
  decorative cover styles.” README: “A $12 one-time supporter license adds
  Blueprint, Graphite, and Sunrise notebook covers.”
- **Evidence:** the live $12 checkout reaches a hosted Dodo checkout. A valid
  fixture token reveals three buttons on the website, where selecting one only
  sets `document.documentElement.dataset.cover` and changes website CSS
  variables. No license, token, Blueprint, Graphite, Sunrise, or cover-style
  code exists under `entrypoints/` or `lib/`, and the packaged extension has no
  way to receive or apply the purchase.
- **Why this misleads:** this is sold as a feature of a browser-extension
  product. A buyer can pay but cannot use the advertised covers in the actual
  extension.
- **Concrete fix:** add license return/restore inside the extension, persist the
  selected cover in `chrome.storage.local`, apply all three covers to the popup,
  and test the packaged extension with valid, invalid, and revoked fixture
  tokens. If the purchase intentionally changes only the website, rewrite the
  offer as “Change this website’s paper color” and reconsider whether it is a
  meaningful paid feature.

### F-1-2 — BLOCKING — “Start for real” does not discard demo changes

- **Exact copy/location:** demo banner: “Start for real.” `.factory/demo.md`:
  “Reloading or leaving discards every demo change.”
- **Evidence:** edit the note for “Choose New report,” select **Start for
  real**, then select **Try it with sample data** without reloading. The edited
  note is still present on both mobile and desktop. **Reset demo** does restore
  the original five steps. `localStorage`, `sessionStorage`, IndexedDB, cookies,
  cross-origin requests, and a seeded `chrome.storage.local` route remained
  unchanged.
- **Why this misleads:** the exit action appears to end the sandbox, but the
  next demo entry resumes modified state. This violates the required discard-on-
  leave lifecycle even though real data remains isolated.
- **Concrete fix:** restore `demoFlow`, `demoIndex`, and `undoFlow` when leaving
  `/demo` or on every transition into it. Add a test that edits, leaves through
  **Start for real**, re-enters, and sees the untouched five-step sample.

### F-1-3 — BLOCKING — Public claims remain unlisted or incompletely tested (earlier H4 regressed)

- **Exact unlisted claims:** landing: “Browser settings pages cannot be read,”
  “Sociobot and Dodo handle payment and refunds,” and “A refund deactivates the
  license.” README: “App Flow Reader is a Manifest V3 extension,” “never stores
  ... screenshots,” and “A license can be restored on the product site.” None
  is stated in a matching `.factory/claims.json` entry.
- **Incomplete listed tests:** `@claim:guided-route` never asserts the promised
  current-step announcement, visible target outline, or control dimensions.
  `@claim:supporter-license` asserts one website theme value but not all three
  covers in the packaged extension, the $12 display, or continued access to
  free features. `@claim:demo-isolated` never leaves and re-enters the demo, so
  it misses F-1-2.
- **Why this misleads:** all ten commands exit successfully, but their green
  status does not prove several statements a visitor may rely on, including the
  main assistive behavior and paid result.
- **Concrete fix:** add atomic claims and tagged tests for browser-page
  boundaries, screenshot exclusion, MV3 packaging, license restoration, and
  every testable payment statement. Strengthen the guided-route, supporter, and
  demo tests as described above. Remove refund wording if it cannot be verified
  in the sandbox.

### F-1-4 — MEDIUM — The first screen omits the required offline and price facts

- **Exact copy/location:** the three hero facts are “Guided,” “Local,” and
  “Open.” “Open” is explained only as “No account is needed.”
- **Why a first-time visitor loses information:** the required first-screen
  facts are privacy, offline use, and price. A phone visitor cannot see that the
  demo works offline or that the core reader is free while covers cost $12.
- **Concrete fix:** use three literal facts such as “Private — Routes stay on
  this device,” “Offline — The reader works after the first visit,” and “Free —
  Reader and exports are free; covers cost $12 once.”

### F-1-5 — MEDIUM — “Start for real” does not name its result

- **Exact copy/location:** demo-banner link “Start for real.” It returns to the
  top of the landing page; it does not install, download, or open the extension.
- **Why a first-time visitor is lost:** “real” does not say what will happen,
  and the destination does not start anything.
- **Concrete fix:** rename it **Leave demo** if it returns home, or **Download
  extension** and link directly to the ZIP/install section.

### F-1-6 — MINOR — The core situation uses three inconsistent terms

- **Exact copy/locations:** landing headline “busy web apps,” landing lede
  “dense workplace software,” and README summary “dense browser apps.”
- **Why this weakens clarity:** a first-time reader must decide whether these
  phrases describe one setting or different product limits.
- **Concrete fix:** use “dense workplace apps” in all three places, for example
  “Follow saved routes through dense workplace apps.”

### F-1-7 — MINOR — The README opens with unexplained platform jargon

- **Exact copy/location:** README introduction: “Manifest V3 extension”; install
  step: “Chrome or another Chromium browser.”
- **Why this slows a first read:** neither term helps the intended low-vision
  worker understand the job, and “Chromium” is not defined.
- **Concrete fix:** write “App Flow Reader is a browser extension for people
  with progressive low vision.” Put “Manifest V3” under development details,
  and say “Chrome, Edge, Brave, or another Chromium-based browser” in install
  instructions.

### F-1-8 — MINOR — “Chrome local storage” is implementation language in user copy

- **Exact copy/location:** README bullet “Keeps multiple named routes in Chrome
  local storage.”
- **Why this slows a first read:** the storage API name is less direct than the
  privacy result.
- **Concrete fix:** “Keeps multiple named routes on this device.” Keep the API
  name in the privacy or development section.

### F-1-9 — MINOR — Four README headings fail the out-of-context test

- **Exact copy/location:** README headings “What it does,” “Develop,” “Verify,”
  and “Deploy.”
- **Why this matters:** a screen-reader heading list does not identify what is
  being developed, verified, or deployed.
- **Concrete fix:** use “What App Flow Reader does,” “Develop locally,” “Run all
  checks,” and “Deploy the website.”

### F-1-10 — MINOR — Route-specific social metadata stays on the home-page copy

- **Exact location:** `/demo`, `/privacy`, `/terms`, and the designed 404 update
  `<title>`, description, and canonical, but retain `og:title="App Flow Reader —
  Follow saved browser routes"`, the home description, and `og:url=".../"`.
- **Why this is misleading:** a shared privacy, terms, demo, or missing URL is
  previewed as the home page rather than the linked route.
- **Concrete fix:** update Open Graph and Twitter title, description, and URL in
  `setMetadata`, then test every route.

### F-1-11 — MINOR — The visible note action is a noun, not a result

- **Exact copy/location:** every sample step on `/demo` shows a button labelled
  “Note”; only its screen-reader name says “Edit note for ...”.
- **Why this slows a first read:** the visible label does not tell a low-vision
  visitor whether the button adds, views, or edits a note.
- **Concrete fix:** change the visible label to **Edit note** and retain the
  step-specific accessible name.

## Cold first screen

Before scrolling, both fresh contexts answer all three questions:

| Question | 390 px answer | Desktop answer |
| --- | --- | --- |
| What does it do? | “Follow saved routes through busy web apps.” | Same |
| For whom? | “For people with progressive low vision ...” | Same |
| What should I click first? | **Try it with sample data**, followed by “Follow a five-step expense route.” | Same |

This gate passes. The mobile viewport also shows all three current fact rows
without scrolling. The first demo viewport contains the persistent yellow demo
banner, sample-route heading, export controls, and the beginning of the active
reader with realistic expense data.

## Copy audit

Word counts treat hyphenated terms and numbers such as “five-step” and “3–10”
as one word. No sentence exceeds 22 words and no banned marketing word appears.
The flags below are findings above; unflagged rows pass.

### Landing-page sentences and sentence-like headings

| Copy | Words | Flag |
| --- | ---: | --- |
| A steady path through busy software | 6 | F-1-6 |
| Follow saved routes through busy web apps | 7 | F-1-6 |
| For people with progressive low vision who need a reliable path through dense workplace software. | 15 | F-1-6 |
| Follow a five-step expense route. | 5 | — |
| Large Back and Next controls mark each step. | 8 | — |
| Saved routes stay in browser storage. | 6 | — |
| No account is needed. | 4 | — |
| Hear the current step and find its control | 8 | — |
| The reader announces one instruction, outlines the matching page control, and waits for you. | 14 | F-1-3 |
| Submit monthly expenses | 3 | — |
| Record once, then follow at your pace | 7 | — |
| Save a route | 3 | — |
| Name the task, then record between three and ten steps. | 10 | — |
| Choose the route | 3 | — |
| Your named routes stay together in the extension. | 8 | — |
| Follow each step | 3 | — |
| Use large Back and Next controls while the page target stays outlined. | 12 | F-1-3 |
| It reads the route, not your private fields | 8 | — |
| Password controls are ignored completely. | 5 | — |
| No screenshots or typed field values are stored. | 8 | F-1-3 |
| Browser settings pages cannot be read. | 6 | F-1-3 |
| Add notebook cover styles for $12 once | 7 | F-1-1, F-1-3 |
| The route reader, exports, and every accessibility feature remain free. | 10 | F-1-3 |
| A supporter license adds three decorative cover styles. | 8 | F-1-1, F-1-3 |
| Sociobot and Dodo handle payment and refunds. | 7 | F-1-3 |
| A refund deactivates the license. | 5 | F-1-3 |
| Have a license? | 3 | — |
| Paste it here | 3 | — |
| No supporter license is stored. | 5 | — |
| Choose a notebook cover: | 4 | F-1-1 |
| Keep the route reader in your toolbar | 7 | — |
| Download the package, unzip it, then load the folder from the browser extensions page. | 14 | — |
| Install an unpacked extension | 4 | F-1-7 |
| Open `chrome://extensions`. | 3 | — |
| Turn on Developer mode. | 4 | — |
| Select Load unpacked and choose the unzipped folder. | 8 | — |
| Follow saved routes through busy web apps. | 7 | F-1-6 |

### Landing and demo action labels

| Action | Words | Result-naming check |
| --- | ---: | --- |
| Try it with sample data | 5 | Pass: required demo action |
| Buy supporter license | 3 | Pass as copy; delivered result fails F-1-1 |
| Restore license | 2 | Pass |
| Download extension | 2 | Pass |
| Reset demo | 2 | Pass |
| Start for real | 3 | F-1-5 |
| Export Markdown | 2 | Pass |
| Export JSON | 2 | Pass |
| Back | 1 | Pass: conventional reader direction |
| Next | 1 | Pass: conventional reader direction |
| Note | 1 | F-1-11 |
| Remove | 1 | Pass in step context |
| Undo | 1 | Pass |
| Save note | 2 | Pass |

The hero labels **Guided**, **Local**, and **Open** are also flagged by F-1-4;
**Open** is especially ambiguous because it can imply open source rather than
“no account.” The licensed cover buttons **Blueprint**, **Graphite**, and
**Sunrise** should become “Use Blueprint cover,” “Use Graphite cover,” and “Use
Sunrise cover” when F-1-1 is implemented.

### README sentences

| Sentence | Words | Flag |
| --- | ---: | --- |
| Follow saved routes through dense browser apps. | 7 | F-1-6 |
| App Flow Reader is a Manifest V3 extension for knowledge workers with progressive low vision. | 15 | F-1-7, F-1-3 |
| Record a named route once, then follow its 3–10 steps with current-step announcements, visible target outlines, and large Back and Next controls. | 22 | F-1-3 |
| Keeps multiple named routes in Chrome local storage. | 8 | F-1-8 |
| Uses accessible control names before visible text fallbacks. | 8 | — |
| Ignores password controls and never stores typed values or screenshots. | 10 | F-1-3 |
| Pauses, resumes, annotates, exports, and deletes routes. | 7 | — |
| Exports complete Markdown and JSON files. | 6 | — |
| Works offline after the site and sample route are first loaded. | 11 | — |
| The free reader, exports, and accessibility features need no account. | 10 | — |
| Public pages load no analytics, external fonts, or third-party scripts. | 10 | — |
| Open `/demo` and use Back and Next to follow a five-step monthly expense route. | 14 | — |
| Changes stay in page memory and do not touch real extension data. | 12 | — |
| Reset demo restores the sample. | 5 | — |
| Download `app-flow-reader-chrome.zip` from the live site. | 6 | — |
| Unzip it. | 2 | — |
| Open `chrome://extensions` in Chrome or another Chromium browser. | 9 | F-1-7 |
| Turn on Developer mode. | 4 | — |
| Select Load unpacked, then choose the unzipped folder. | 8 | — |
| Name a route in the toolbar popup and select Start recording. | 11 | — |
| Complete 3–10 steps. | 3 | — |
| Reopen the popup, select the route, then choose Follow route. | 10 | — |
| A $12 one-time supporter license adds Blueprint, Graphite, and Sunrise notebook covers. | 12 | F-1-1, F-1-3 |
| It never gates the reader, exports, privacy controls, or accessibility features. | 11 | F-1-3 |
| Sociobot and Dodo handle payment and refunds. | 7 | F-1-3 |
| A license can be restored on the product site. | 9 | F-1-3 |
| Requirements: Node.js 22 and npm 10. | 6 | —: developer context |
| `test:live-checkout` checks the production catalog entry, the Sociobot checkout redirect, and the hosted Dodo page. | 15 | —: developer context |
| It does not submit a payment. | 6 | — |
| The build produces `dist/site/`, `dist/extension/`, and the packaged extension at `dist/site/downloads/app-flow-reader-chrome.zip`. | 16 | —: developer context, verified |
| Deploy `dist/site/` as the static artifact. | 7 | —: developer context |
| Azure Static Web Apps reads `staticwebapp.config.json` for known SPA rewrites, a real 404 catch-all, security headers, and cache policy. | 19 | —: developer context |
| Read `/privacy` and `/terms`. | 4 | — |
| Support: `support@sociobot.in`. | 3 | — |
| MIT. | 1 | — |
| See LICENSE. | 2 | — |

README heading flags are recorded in F-1-9. The headings **Try the isolated
sample**, **Install the extension**, **Optional supporter license**, **Privacy
and legal**, and **License** pass the out-of-context check.

## Demo and sandbox evidence

- One click from `/` opens `/demo` on mobile and desktop.
- The first demo viewport already shows a five-step monthly-expense route and
  the current reader instruction.
- The persistent banner says “Demo — Sample data. Nothing is saved” and offers
  **Reset demo** and **Start for real**.
- Next advances from “Step 1 of 5” to “Step 2 of 5.” Reset restores the sample.
- Editing, removal/undo, Markdown export, and JSON export operate on the sample.
- No cross-origin request occurred during the live demo. Web storage, IndexedDB,
  and cookies stayed empty. A pre-seeded real extension route was byte-for-byte
  unchanged after editing the live demo.
- After priming the service worker, the live demo reloaded offline with five
  steps and advanced to step 2.
- F-1-2 is the one sandbox lifecycle failure.

## Claims results

Every command in `.factory/claims.json` was run separately after `npm ci`.

| Claim | Exact command | Result |
| --- | --- | --- |
| `guided-route` | `npm run test:e2e -- --grep @claim:guided-route` | PASS: 1 passed, 1 expected mobile skip |
| `private-capture` | `npm run test:e2e -- --grep @claim:private-capture` | PASS: 1 passed, 1 expected mobile skip |
| `local-storage` | `npm run test:e2e -- --grep @claim:local-storage` | PASS: 1 passed, 1 expected mobile skip |
| `route-controls` | `npm run test:e2e -- --grep @claim:route-controls` | PASS: 1 passed, 1 expected mobile skip |
| `export-files` | `npm run test:e2e -- --grep @claim:export-files` | PASS: 2 passed |
| `no-account` | `npm run test:e2e -- --grep @claim:no-account` | PASS: 2 passed |
| `demo-isolated` | `npm run test:e2e -- --grep @claim:demo-isolated` | PASS: 2 passed; incomplete per F-1-3 |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS: 2 passed |
| `no-tracking` | `npm run test:e2e -- --grep @claim:no-tracking` | PASS: 2 passed |
| `supporter-license` | `npm run test:e2e -- --grep @claim:supporter-license` | PASS: 2 passed; incomplete per F-1-1/F-1-3 |

No listed command failed. F-1-3 prevents the result from being “no untested
claim.”

## Earlier finding audit

No earlier `.factory/review-*.md` or `.factory/polish-*.md` exists. I read the
handoff and all three retained independent verification reports, then checked
their findings against the live site and current code.

| Earlier ID | Current result | Evidence |
| --- | --- | --- |
| C1 — wrong product/job | Fixed | Live low-vision copy; named route library, 3–10-step bounds, playback, status announcement, target outline, and Back/Next code are present. |
| H1 — rapid clicks lost | Fixed | Serialized `mutationQueue`; burst claim test stores the capped sequence. |
| H2 — accessible names/passwords | Fixed | `aria-labelledby` and form-label precedence; password exclusion; packaged test passes. |
| H3 — dark contrast | Fixed | Live dark/reduced-motion axe has zero serious/critical findings; local route matrix passes. |
| H4 — incomplete claims | **Regressed: BLOCKING as F-1-3** | Inventory is larger, but public promises and central assertions remain uncovered. |
| M1 — 34 px demo controls | Fixed | Demo banner controls are 44 px; 390 px target test passes. |
| M2 — soft 404 | Fixed | Unknown live route returns HTTP 404 with the designed page. |
| M3 — no paid model | **Half-fixed: BLOCKING as F-1-1** | Checkout works, but the paid result is absent from the extension. |
| Verification-2 H1 — checkout 404 | Fixed | Live endpoint redirects to hosted Dodo and finishes HTTP 200. |
| Handoff NVDA gap | Still accurately disclosed | No NVDA claim is made; this is not counted as a product finding. |

## Structure, links, and accessibility

- Titles pass the route pattern and 60-character limit: home, demo, privacy,
  terms, and 404 each have one H1, one main landmark, a description, and a
  correct canonical URL.
- The favicon, 180 × 180 apple-touch icon, and original 1200 × 630 OG image are
  present. Route-specific OG data fails only as F-1-10.
- `/`, `/demo`, `/privacy`, and `/terms` return 200. The designed missing route
  returns 404. Direct `/#how-it-works` loading lands on the section.
- Internal navigation updates history and focuses the new H1. Back restores the
  prior scroll position and focuses the restored H1.
- Every crawled internal route, download, the Param Factory link, and the live
  checkout resolves. Mail links are explicit and were not fetched.
- Header, skip link, and footer are consistent on all routes. Footer includes
  Privacy, Terms, Param Factory, version, and build ID.
- Live 390 px dark/reduced-motion axe and the local light/dark route matrix found
  zero serious or critical violations. `npm run test:a11y` passed. Touch targets,
  focus, keyboard dialog return, overflow, reduced motion, and headings pass.
- `/opt/fleet/lib/verify-url.sh` passed after supplying its required evidence
  directory: no console/page errors, one H1, `lang=en`, main, image-alt, and
  button-label checks all passed.
- The warm paper, blueprint rules, orange route line, large numbered junctions,
  and dark reader form a distinct product-specific identity. It does not read as
  a generic gradient/card SaaS template.

## Missed leverage

No additional AI or sync feature is warranted. The brief explicitly excludes
AI processing and cloud sync, and the repository contains no model keys or
provider calls. Markdown and JSON export cover the included portability scope.
An import feature could be useful, but the researched brief specifies export,
not import, so it is not raised as a finding in this round.

## Verification summary

- `npm ci`: PASS, 171 packages, 0 vulnerabilities reported.
- Ten exact claim commands: PASS.
- `npm test`: PASS, 6 unit tests and 29 Playwright tests; 7 expected
  project-specific skips.
- `npm run test:a11y`: PASS, 3 tests; 1 expected mobile extension skip.
- `npm run test:live-checkout`: PASS.
- Build executed repeatedly by Playwright: PASS; `dist/site`, `dist/extension`,
  and the ZIP were produced.
- Live/local SHA-256 values match for JS, CSS, and the extension ZIP.
- Live cold requests were same-origin only; initial JS is 7.22 kB gzip.

## What would make this perfect

Ship the paid covers inside the extension, reset demo memory when leaving,
close every claims gap with observable tagged assertions, replace the ambiguous
demo exit, put privacy/offline/price facts in the hero, standardize the core
terminology, simplify the README jargon/headings, and update social metadata per
route. Then rerun this entire review from a fresh context; do not accept a
diff-only verification.
