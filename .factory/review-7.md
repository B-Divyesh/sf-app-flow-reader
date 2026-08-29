# Adversarial first-read review 7 — App Flow Reader

Date: 29 August 2026 UTC
Reviewed revision: `fd2b610983319c6446a401a927cb6d487a2be937`
Live URL: <https://app-flow-reader.sociobot.in>

## Verdict

**FAIL — 1 minor finding.**

The product is clear and honest on a cold first read, and the one-click demo,
claims, package, privacy behavior, routing, and accessibility checks passed.
The release is not a PASS because the only enabled forward control in the
390 px demo starts below the initial phone viewport.

## Findings

### F-7-1 — MINOR — The mobile demo hides its only enabled next action below the first viewport

- **Exact location:** live `/demo` at 390 × 844. The reader says **“Step 1
  of 5”** and shows a disabled **“Back”** button from y=785 to y=837. The
  enabled **“Next”** button starts at y=849 and ends at y=901, below the
  viewport. The preceding heading and export controls consume 372 px.
- **Why this loses a first-time visitor:** after selecting **“Try it with
  sample data”**, a visitor can see the sample route and instruction but not
  its usable forward action. The one visible reader control is disabled. A
  low-vision visitor has to discover that a further scroll is needed before
  they can try the central Back/Next interaction.
- **Concrete fix:** at the mobile breakpoint, reduce the vertical space before
  `.demo-reader` or place Back and Next side by side so the enabled **Next**
  control is fully visible with Step 1. Add a 390 × 844 regression assertion
  that `#demo-next` has `bottom <= innerHeight` on first loading `/demo`.

## Cold first read

Fresh, storage-empty Chromium contexts loaded the live `/` before scrolling at
390 × 844 and 1440 × 900. The first screen answers all three required
questions.

| Question | Exact text | Result |
| --- | --- | --- |
| What does it do? | “Follow saved routes through dense workplace apps” | Clear: it records and guides a repeatable workplace-app task. |
| For whom? | “For people with progressive low vision who need one reliable path through dense workplace apps.” | Clear. |
| What should I click first? | **“Try it with sample data”** followed by “Follow a five-step expense route.” | Clear, visible, and result-naming. |

No blocking cold-read finding applies. At 390 px the headline, audience,
action, privacy, offline, and price facts appear before scrolling. Both live
loads returned 200, had no console/page errors, and requested only the product
origin. The warm-paper route sheet, hard blueprint rules, orange path, and
numbered junctions are distinct from a generic SaaS template and match
`.factory/design.md`.

## Copy audit

Counts use whitespace-separated words. Headings, actions, labels, and visible
sentences are included; URLs and code blocks are not prose sentences. No row
exceeds 22 words. No banned marketing word, ambiguous metaphor, inconsistent
core term, or non-result-naming button was found. Claim-bearing rows cite their
matching `.factory/claims.json` id.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| App Flow Reader | 3 | Pass — wordmark |
| Demo / How it works / Privacy / Download | 5 | Pass — navigation labels |
| Browser extension for progressive low vision | 6 | Pass — product category and audience |
| Follow saved routes through dense workplace apps | 7 | Pass — plain h1 |
| For people with progressive low vision who need one reliable path through dense workplace apps. | 15 | Pass |
| Try it with sample data | 5 | Pass — primary result |
| Follow a five-step expense route. | 5 | Pass — `no-account` |
| Private | 1 | Pass |
| Routes stay on this device. | 5 | Pass — `local-storage` |
| Offline | 1 | Pass |
| The sample reader works after its first visit. | 8 | Pass — `offline-reload` |
| Free | 1 | Pass |
| Reader and exports are free; covers cost $12 once. | 9 | Pass — `supporter-license` |
| Route 05 | 2 | Pass — sample diagram label |
| Open Expenses / New report / Monthly expenses / Review report / Send to manager | 10 | Pass — realistic sample labels |
| Live preview | 2 | Pass — section name |
| Hear the current step and find its control | 8 | Pass — section heading |
| The reader announces one instruction, outlines the matching page control, and waits for you. | 14 | Pass — `guided-route` |
| Current route | 2 | Pass — preview label |
| Submit monthly expenses | 3 | Pass — example route name |
| How it works | 3 | Pass — section name |
| Record once, then follow at your pace | 7 | Pass — descriptive heading |
| Save a route | 3 | Pass — step heading |
| Name the task, then record between three and ten steps. | 10 | Pass — `guided-route` |
| Choose the route | 3 | Pass — step heading |
| Your named routes stay together in the extension. | 8 | Pass — `guided-route` |
| Follow each step | 3 | Pass — step heading |
| Use large Back and Next controls while the page target stays outlined. | 12 | Pass — `guided-route` |
| Clear boundaries | 2 | Pass — section name |
| It reads the route, not your private fields | 8 | Pass — `private-capture` |
| Password controls are ignored completely. | 5 | Pass — `private-capture` |
| No screenshots or typed field values are stored. | 8 | Pass — `private-capture` |
| Browser settings pages cannot be read. | 6 | Pass — `browser-page-boundaries` |
| Optional supporter license | 3 | Pass — section name |
| Add notebook cover styles for $12 once | 7 | Pass — `supporter-license` |
| The route reader, exports, and every accessibility feature remain free. | 10 | Pass — `supporter-license` |
| A supporter license adds three decorative cover styles in the extension. | 11 | Pass — `supporter-license` |
| After checkout, an installed extension restores the returned token. | 9 | Pass — `license-return` |
| You can also paste it into Supporter styles. | 8 | Pass — `license-return` |
| Buy supporter license (opens secure checkout) | 7 | Pass — `supporter-checkout`; names the external result |
| Use in Chrome, Edge, Brave, and similar browsers | 8 | Pass — `mv3-package` |
| Keep the route reader in your toolbar | 7 | Pass — install section heading |
| Download the package, unzip it, then load the folder from the browser extensions page. | 14 | Pass — `mv3-package` |
| Download extension | 2 | Pass — result-naming action |
| Install from the downloaded folder | 5 | Pass — disclosure label |
| Open your browser’s extensions page. | 5 | Pass |
| Turn on the page’s Developer mode setting. | 7 | Pass — literal browser label follows an explanation |
| Choose Load unpacked, then choose the unzipped folder. | 8 | Pass — literal browser label follows an explanation |
| Follow saved routes through dense workplace apps. | 7 | Pass — footer one-liner |
| Built by Param Factory | 4 | Pass — external-link label |
| Version 1.1.0 · build 2026.08.29 | 4 | Pass — build label |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| App Flow Reader | 3 | Pass — title |
| Follow saved routes through dense workplace apps. | 7 | Pass |
| App Flow Reader is a browser extension for people with progressive low vision. | 13 | Pass — product category and audience |
| Record a named route once, then follow its 3–10 steps with current-step announcements, visible target outlines, and large Back and Next controls. | 22 | Pass — `guided-route` |
| Live site / Sample-data demo | 4 | Pass — URL labels |
| What App Flow Reader does | 5 | Pass — heading |
| Keeps multiple named routes on this device. | 7 | Pass — `guided-route`, `local-storage` |
| Uses accessible control names before visible text fallbacks. | 8 | Pass — `private-capture` |
| Ignores password controls and never stores typed values or screenshots. | 10 | Pass — `private-capture` |
| Pauses, resumes, annotates, exports, and deletes routes. | 7 | Pass — `route-controls` |
| Exports complete Markdown and JSON files. | 6 | Pass — `export-files` |
| Works offline after the site and sample route are first loaded. | 11 | Pass — `offline-reload` |
| The free reader, exports, and accessibility features need no account. | 10 | Pass — `no-account`, `supporter-license` |
| Public pages load no analytics, external fonts, or third-party scripts. | 10 | Pass — `no-tracking` |
| Try the isolated sample route | 5 | Pass — heading |
| Open `?demo=1` and use Back and Next to follow a five-step monthly expense route. | 14 | Pass — `no-account`, `guided-route` |
| Changes stay in page memory and do not touch real extension data. | 12 | Pass — `demo-isolated` |
| Reset demo restores the sample. | 5 | Pass — `demo-isolated` |
| Start for real discards edits and opens the extension download instructions. | 11 | Pass — `demo-isolated` |
| Install the extension | 3 | Pass — heading |
| Download `app-flow-reader-chrome.zip` from the live site. | 6 | Pass — `mv3-package` |
| Unzip it. | 2 | Pass |
| Open your browser’s extensions page in Chrome, Edge, Brave, or a similar browser. | 13 | Pass — `mv3-package` |
| Turn on that page’s Developer mode setting. | 7 | Pass |
| Choose Load unpacked, then choose the unzipped folder. | 8 | Pass |
| Name a route in the toolbar popup and select Start recording. | 11 | Pass — `guided-route` |
| Complete 3–10 steps. | 3 | Pass — `guided-route` |
| Reopen the popup, select the route, then choose Follow route. | 10 | Pass — `guided-route` |
| Optional supporter license | 3 | Pass — heading |
| A $12 one-time supporter license adds Blueprint, Graphite, and Sunrise notebook covers in the extension. | 15 | Pass — `supporter-license` |
| It never gates the reader, exports, privacy controls, or accessibility features. | 11 | Pass — `supporter-license` |
| Buy supporter license opens a secure checkout outside App Flow Reader. | 10 | Pass — `supporter-checkout` |
| After checkout, an installed extension restores the returned token; you can also paste it into Supporter styles. | 17 | Pass — `license-return` |
| Develop locally | 2 | Pass — heading |
| Requirements: Node.js 22 and npm 10. | 6 | Pass — developer context |
| Run all checks | 3 | Pass — heading |
| `test:live-checkout` checks the production catalog entry and checkout redirect. | 9 | Pass — developer context |
| It does not submit a payment. | 6 | Pass — developer context |
| The build produces `dist/site/`, `dist/extension/`, and the packaged extension at `dist/site/downloads/app-flow-reader-chrome.zip`. | 11 | Pass — developer context |
| Deploy the website | 3 | Pass — heading |
| Deploy `dist/site/` as the static artifact. | 6 | Pass — developer context |
| Azure Static Web Apps reads `staticwebapp.config.json` for known SPA rewrites, a real 404 catch-all, security headers, and cache policy. | 19 | Pass — developer context |
| Manifest V3 is used for the packaged extension. | 8 | Pass — `mv3-package` |
| Route state uses `chrome.storage.local`. | 4 | Pass — implementation context |
| The extension makes no background network request until a supporter token is restored. | 13 | Pass — `extension-network` |
| Verification then contacts only `api.sociobot.in`. | 5 | Pass — `extension-network` |
| Privacy and legal | 3 | Pass — heading |
| Read `/privacy` and `/terms`. | 4 | Pass |
| Support: `support@sociobot.in`. | 2 | Pass — contact label |
| License | 1 | Pass — heading |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

Terminology remains consistent: **route** is a saved task path, **step** is
one instruction, and the visitor-facing situation is always **dense workplace
apps**.

## Demo and sandbox verification

- The cold primary action opened `/?demo=1` in one click; direct `/demo` also
  loaded correctly.
- The first demo view showed a realistic monthly expense route, its first
  instruction, the five-step context, export actions, and the persistent
  **“Demo — Sample data. Nothing is saved.”** banner with **Reset demo** and
  **Start for real**. F-7-1 is the only placement defect.
- Editing the first note to `temporary demo note`, selecting **Start for
  real**, and entering `/demo` again restored the original note and all five
  sample steps. Reset also restored the original state.
- `localStorage`, `sessionStorage`, cookies, and IndexedDB were empty before
  and after the demo flow. The source keeps demo state only in `demoFlow` and
  resets it on entry, reset, and exit; real extension storage is not read or
  written.
- The demo’s request log contained only
  `https://app-flow-reader.sociobot.in`; there were no console or page errors.
- After a first live visit and service-worker readiness, offline reload of
  `/demo` returned 200 and **Next** advanced from Step 1 of 5 to Step 2 of 5.

The demo is isolated and privacy behavior is confirmed. F-7-1 is a phone
layout finding, not a failure of sample-data isolation.

## Claims verification

I cloned this revision into `/tmp/app-flow-reader-review7`, ran `npm ci`, and
ran every exact test command in `.factory/claims.json` independently. All 15
passed; the explicitly desktop-only extension cases were expected mobile skips.

| Claim id | Result |
| --- | --- |
| guided-route | Pass |
| private-capture | Pass |
| local-storage | Pass |
| extension-network | Pass |
| route-controls | Pass |
| export-files | Pass |
| no-account | Pass |
| demo-isolated | Pass |
| offline-reload | Pass |
| no-tracking | Pass |
| supporter-license | Pass |
| supporter-checkout | Pass |
| browser-page-boundaries | Pass |
| mv3-package | Pass |
| license-return | Pass |

The live landing and README were then cross-checked against the inventory.
Every claim-like product statement maps to the id shown in the copy audit;
there is no unlisted claim finding and no failed or untested claim.

The same clean clone also passed `npm test` (6 unit tests and the 44-entry
browser matrix, with expected MV3/mobile skips), `npm run typecheck`, `npm run
check:copy`, `npm run check:package`, `npm run build`, `npm run test:a11y`, and
`npm run test:live-checkout`.

## Earlier findings re-checked

Every earlier review, polish record, and the preceding handoff was read. Each
historical finding was checked against the current source, current packaged
tests, and/or the live deployment rather than accepted from a “fixed” label.

| Earlier finding | Current verification | Status |
| --- | --- | --- |
| C1 | Packaged MV3 route reader records and follows named 3–10 step routes. | Fixed |
| H1 | Burst capture remains serialized and ordered in `guided-route`. | Fixed |
| H2 | Accessible-name capture excludes passwords, values, and screenshots. | Fixed |
| H3 | Live Axe found no serious/critical issue on `/`, `/demo`, `/privacy`, `/terms`, or 404 in light mode. | Fixed |
| H4 | All 15 atomic public claims passed separately from a clean clone. | Fixed |
| M1 | Visible controls meet the 44 px baseline; F-7-1 is a separate viewport-placement issue. | Fixed |
| M2 | `/definitely-missing` returns HTTP 404 with the designed page. | Fixed |
| M3 | The packaged extension restores valid tokens, rejects revoked tokens, applies three covers, and keeps the reader free. | Fixed |
| Verification-2 H1 | The checkout endpoint returned HTTPS 303 to hosted Dodo checkout. | Fixed |
| F-1-1 | Supporter covers exist in the packaged extension. | Fixed |
| F-1-2 | Demo note edit is discarded after Start for real and re-entry. | Fixed |
| F-1-3 | Public claims are inventoried with observable tagged tests. | Fixed |
| F-1-4 | Private, Offline, and Free/$12 facts appear in the mobile first screen. | Fixed |
| F-1-5 | **Start for real** names its installation-instructions destination and discards demo edits. | Fixed |
| F-1-6 | Landing, footer, and README use “dense workplace apps.” | Fixed |
| F-1-7 | README starts with the browser-extension job and audience, not Manifest jargon. | Fixed |
| F-1-8 | Visitor storage copy says “on this device.” | Fixed |
| F-1-9 | README headings identify the product or action out of context. | Fixed |
| F-1-10 | Live Demo, Privacy, and Terms set route-specific title, description, canonical, OG, and Twitter metadata. | Fixed |
| F-1-11 | Demo control visibly says **Edit note**. | Fixed |
| F-2-1 | Install text explains the browser extensions page before literal labels. | Fixed |
| F-2-2 | Static 404 retains wordmark, skip link, navigation, and footer. | Fixed |
| F-2-3 | Static 404 has favicon, Apple icon, theme colors, canonical, and complete social metadata. | Fixed |
| F-3-1 | `extension-network` proves no pre-token request and only Sociobot verification after restore. | Fixed |
| F-5-1 | The hero kicker is the literal “Browser extension for progressive low vision.” | Fixed |
| F-6-1 | Purchase action says **“Buy supporter license (opens secure checkout)”**; live endpoint redirects over HTTPS. | Fixed |

No earlier finding regressed. F-7-1 is new.

## Structure, links, accessibility, and scope

- `/`, `/demo`, `/privacy`, and `/terms` returned 200; the deliberate missing
  route returned 404. Each route has `lang=en`, one h1, one main landmark,
  route-specific title, description, canonical, OG title, favicon, Apple icon,
  shared header, and shared footer. The title pattern is correct on all routes.
- The static 404 has the same structural metadata and a way home. `robots.txt`
  and `sitemap.xml` are live; the sitemap lists the four public routes.
- Crawling every visible link found 200 for public/internal links, 303 for the
  labelled checkout endpoint, and explicit `mailto:` links only. The skip link
  on the deliberately 404 page resolves to that same 404 document’s `#main`
  anchor, which is functional and not a dead destination.
- SPA route navigation and browser back are covered by the passing local route
  test, including destination-h1 focus and polite announcement. Keyboard,
  reduced-motion, and light/dark Axe checks also pass locally.
- The brief excludes cloud sync and AI processing. Local export is present;
  import, sync, or an AI feature is not an implied missing capability. No
  provider key is embedded.

## What would make this perfect

Resolve F-7-1: make the enabled **Next** control fully visible on the initial
390 × 844 demo view and add the viewport regression test. Re-run the clean
claim suite and the cold phone demo check. With that one placement defect
removed, this review has no remaining finding.
