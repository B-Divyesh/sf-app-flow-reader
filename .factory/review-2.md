# Adversarial first-read review 2 — App Flow Reader

Date: 28 August 2026 UTC  
Reviewed revision: `a29711746eb5523b2bbacc623887841162d96c61`  
Live URL: <https://app-flow-reader.sociobot.in>

## Verdict

**FAIL — 3 minor findings.**

The core first-read, demo, privacy, offline, route-reading, payment, and
claims checks pass. The release is not yet a PASS because the direct 404 route
does not use the required shared header or complete route metadata, and a few
reader-facing installation labels still use unexplained browser jargon. No
blocking finding was reproduced.

## Findings

### F-2-1 — MINOR — Installation copy still assumes browser-extension jargon

- **Exact quote/location:** landing install kicker, “Chrome and Chromium
  browsers”; landing disclosure, “Install an unpacked extension”; README
  install step, “Open `chrome://extensions` in Chrome, Edge, Brave, or another
  Chromium-based browser.” The next two instructions use “Developer mode” and
  “Load unpacked” without explaining them.
- **Why this loses a first-time visitor:** “Chromium” and “unpacked” are
  implementation terms. A visitor who has downloaded the file is told which
  browser settings labels to find, but not in plain language what those labels
  mean or whether their browser is supported.
- **Concrete fix:** change the kicker to “Use in Chrome, Edge, Brave, and
  similar browsers”; change the disclosure to **Install from the downloaded
  folder**; introduce the steps as “Open your browser’s extensions page. Turn
  on the page’s Developer mode setting. Choose **Load unpacked**, then choose
  the unzipped folder.” Keep the final two terms because they are the literal
  browser labels, but explain their location. Change the README sentence to
  the same wording.

### F-2-2 — MINOR — The direct 404 page omits the shared header navigation

- **Exact quote/location:** live
  `https://app-flow-reader.sociobot.in/definitely-missing` returns the static
  `public/site/404.html`, whose entire header is
  `<header><a href="/">App Flow Reader</a></header>`. The normal header has
  Demo, How it works, Privacy, and Download links.
- **Why this loses a first-time visitor:** a visitor following a stale link
  can return home, but cannot immediately take the visible demo, read Privacy,
  or download the extension. This is the one public route that does not retain
  the site’s navigation skeleton.
- **Concrete fix:** give `404.html` the same compact header navigation as the
  application routes, including Demo, Privacy, and Download. Retain the
  existing designed lost-path artwork and footer.

### F-2-3 — MINOR — The static 404 route has incomplete required metadata

- **Exact quote/location:** `public/site/404.html` has a favicon, canonical,
  Open Graph image, and Twitter title/description, but lacks both
  `<link rel="apple-touch-icon" href="/apple-touch-icon.png">` and
  `<meta name="theme-color">`. It also lacks
  `<meta name="twitter:image" content="https://app-flow-reader.sociobot.in/og-image.png">`.
- **Why this loses or misrepresents a visitor:** a direct missing URL is a real
  route with a title, canonical URL, and share card. It should retain the
  product’s mobile icon, paper/dark theme color, and complete social image
  rather than degrade when saved or shared.
- **Concrete fix:** add the same light/dark `theme-color`, Apple-touch icon,
  and Twitter image metadata used by `site/index.html`; add a static-route
  metadata assertion to the routing test.

## Cold first screen

Fresh Chromium contexts at **390 × 844** and **1440 × 900**, before scrolling,
gave the same answers:

| Question | First-screen answer |
| --- | --- |
| What does it do? | It helps a person save and follow a route through a dense workplace web app. |
| For whom? | People with progressive low vision who need one reliable path through that app. |
| What should I click first? | **Try it with sample data**; it says that it will open a five-step expense route. |

The exact first-screen copy is “Follow saved routes through dense workplace
apps”, “For people with progressive low vision who need one reliable path
through dense workplace apps.”, and “Try it with sample data”. This gate
passes. The mobile viewport contains the primary action and all three privacy,
offline, and price facts without scrolling. Both cold loads had no console or
page errors and requested only the product origin.

## Copy audit

Word counts use whitespace-separated visible words; URLs and code labels count
as one word. All landing and README sentences are at or below 22 words. The
only plain-words flags are consolidated in **F-2-1**. “License” is retained as
the conventional software-license heading; “Optional supporter license” makes
the paid concept distinct.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| App Flow Reader | 3 | Pass |
| A steady path through dense workplace apps | 7 | Pass |
| Follow saved routes through dense workplace apps | 7 | Pass |
| For people with progressive low vision who need one reliable path through dense workplace apps. | 15 | Pass |
| Try it with sample data | 5 | Pass |
| Follow a five-step expense route. | 5 | Pass |
| Private | 1 | Pass |
| Routes stay on this device. | 5 | Pass |
| Offline | 1 | Pass |
| The sample reader works after its first visit. | 8 | Pass |
| Free | 1 | Pass |
| Reader and exports are free; covers cost $12 once. | 9 | Pass |
| Live preview | 2 | Pass |
| Hear the current step and find its control | 8 | Pass |
| The reader announces one instruction, outlines the matching page control, and waits for you. | 14 | Pass — `guided-route` |
| Current route | 2 | Pass |
| Submit monthly expenses | 3 | Pass |
| How it works | 3 | Pass |
| Record once, then follow at your pace | 7 | Pass |
| Save a route | 3 | Pass |
| Name the task, then record between three and ten steps. | 10 | Pass |
| Choose the route | 3 | Pass |
| Your named routes stay together in the extension. | 8 | Pass |
| Follow each step | 3 | Pass |
| Use large Back and Next controls while the page target stays outlined. | 12 | Pass — `guided-route` |
| Clear boundaries | 2 | Pass |
| It reads the route, not your private fields | 8 | Pass |
| Password controls are ignored completely. | 5 | Pass — `private-capture` |
| No screenshots or typed field values are stored. | 8 | Pass — `private-capture` |
| Browser settings pages cannot be read. | 6 | Pass — `browser-page-boundaries` |
| Optional supporter license | 3 | Pass |
| Add notebook cover styles for $12 once | 7 | Pass — `supporter-license` |
| The route reader, exports, and every accessibility feature remain free. | 10 | Pass — `supporter-license` |
| A supporter license adds three decorative cover styles in the extension. | 11 | Pass — `supporter-license` |
| After checkout, an installed extension restores the returned token. | 9 | Pass — `license-return` |
| You can also paste it into Supporter styles. | 8 | Pass — `license-return` |
| Buy supporter license | 3 | Pass — result-naming verb |
| Chrome and Chromium browsers | 4 | **F-2-1** |
| Keep the route reader in your toolbar | 7 | Pass |
| Download the package, unzip it, then load the folder from the browser extensions page. | 14 | Pass |
| Download extension | 2 | Pass — result-naming verb |
| Install an unpacked extension | 4 | **F-2-1** |
| Open `chrome://extensions`. | 2 | **F-2-1** in context |
| Turn on Developer mode. | 4 | **F-2-1** |
| Select Load unpacked and choose the unzipped folder. | 8 | **F-2-1** |
| Follow saved routes through dense workplace apps. | 7 | Pass |

The navigation and demo actions are result-naming: **Try it with sample data**,
**Open navigation**, **Reset demo**, **Leave demo**, **Export Markdown**,
**Export JSON**, **Edit note**, **Remove**, **Undo**, **Save note**,
**Download extension**, and **Buy supporter license**. Back and Next are clear
conventional reader-direction controls.

### README

| Copy | Words | Result |
| --- | ---: | --- |
| App Flow Reader | 3 | Pass |
| Follow saved routes through dense workplace apps. | 7 | Pass |
| App Flow Reader is a browser extension for people with progressive low vision. | 13 | Pass |
| Record a named route once, then follow its 3–10 steps with current-step announcements, visible target outlines, and large Back and Next controls. | 22 | Pass — `guided-route` |
| Live site: `https://app-flow-reader.sociobot.in` | 3 | Pass |
| Sample-data demo: `https://app-flow-reader.sociobot.in/?demo=1` | 3 | Pass |
| What App Flow Reader does | 5 | Pass |
| Keeps multiple named routes on this device. | 7 | Pass — `guided-route` / `local-storage` |
| Uses accessible control names before visible text fallbacks. | 8 | Pass — `private-capture` |
| Ignores password controls and never stores typed values or screenshots. | 10 | Pass — `private-capture` |
| Pauses, resumes, annotates, exports, and deletes routes. | 7 | Pass — `route-controls` |
| Exports complete Markdown and JSON files. | 6 | Pass — `export-files` |
| Works offline after the site and sample route are first loaded. | 11 | Pass — `offline-reload` |
| The free reader, exports, and accessibility features need no account. | 10 | Pass — `no-account` / `supporter-license` |
| Public pages load no analytics, external fonts, or third-party scripts. | 10 | Pass — `no-tracking` |
| Try the isolated sample route | 5 | Pass |
| Open `?demo=1` and use Back and Next to follow a five-step monthly expense route. | 14 | Pass |
| Changes stay in page memory and do not touch real extension data. | 12 | Pass — `demo-isolated` |
| Reset demo restores the sample. | 5 | Pass — `demo-isolated` |
| Leave demo discards edits before returning home. | 7 | Pass — `demo-isolated` |
| Install the extension | 3 | Pass |
| Download `app-flow-reader-chrome.zip` from the live site. | 6 | Pass |
| Unzip it. | 2 | Pass |
| Open `chrome://extensions` in Chrome, Edge, Brave, or another Chromium-based browser. | 10 | **F-2-1** |
| Turn on Developer mode. | 4 | **F-2-1** |
| Select Load unpacked, then choose the unzipped folder. | 8 | **F-2-1** |
| Name a route in the toolbar popup and select Start recording. | 11 | Pass |
| Complete 3–10 steps. | 3 | Pass |
| Reopen the popup, select the route, then choose Follow route. | 10 | Pass |
| Optional supporter license | 3 | Pass |
| A $12 one-time supporter license adds Blueprint, Graphite, and Sunrise notebook covers in the extension. | 15 | Pass — `supporter-license` |
| It never gates the reader, exports, privacy controls, or accessibility features. | 11 | Pass — `supporter-license` |
| After checkout, an installed extension restores the returned token; you can also paste it into Supporter styles. | 17 | Pass — `license-return` |
| Develop locally | 2 | Pass |
| Requirements: Node.js 22 and npm 10. | 6 | Pass — developer context |
| Run all checks | 3 | Pass |
| `test:live-checkout` checks the production catalog entry and checkout redirect. | 9 | Pass — developer context |
| It does not submit a payment. | 6 | Pass — developer context |
| The build produces `dist/site/`, `dist/extension/`, and the packaged extension at `dist/site/downloads/app-flow-reader-chrome.zip`. | 11 | Pass — developer context |
| Deploy the website | 3 | Pass |
| Deploy `dist/site/` as the static artifact. | 6 | Pass — developer context |
| Azure Static Web Apps reads `staticwebapp.config.json` for known SPA rewrites, a real 404 catch-all, security headers, and cache policy. | 19 | Pass — developer context |
| Manifest V3 is used for the packaged extension. | 8 | Pass — `mv3-package` |
| Route state uses `chrome.storage.local`; the optional license check is the only extension network request and runs after a user pastes a token. | 22 | Pass — developer context / `local-storage` |
| Privacy and legal | 3 | Pass |
| Read `/privacy` and `/terms`. | 4 | Pass |
| Support: `support@sociobot.in`. | 2 | Pass |
| License | 1 | Pass |
| MIT. | 1 | Pass |
| See `LICENSE`. | 2 | Pass |

“Dense workplace apps”, “route”, “step”, “recording”, “following”,
“extension”, “demo”, and “supporter license” are used consistently. No banned
marketing adjective appears. No copy claim was found without a matching claim
entry and observable claim test.

## Demo and sandbox verification

- **One click:** landing **Try it with sample data** opened `/?demo=1`.
- **Immediate product use:** the first 390 px demo screen showed the persistent
  “Demo — Sample data. Nothing is saved.” banner, Reset demo, Leave demo,
  five sample steps, and reader text “Step 1 of 5 / Open Expenses from the
  main menu”. The first action is a realistic monthly-expense route rather than
  a blank state.
- **Isolation:** after editing “Choose New report”, `localStorage`,
  `sessionStorage`, IndexedDB, cookies, and cross-origin requests were empty.
  Reset restored Step 1 with no edited note. Leaving and re-entering restored
  the untouched five-step route.
- **Offline/privacy:** after the live service worker was ready and `/demo` was
  primed, a 390 px browser context was set offline. Reload retained all five
  steps and Next reached “Step 2 of 5”. All requests in this flow were
  same-origin.

## Claims verification

I made a fresh local clone at
`/tmp/app-flow-reader-review-2.Aurin2`, ran `npm ci`, and then ran every exact
command from `.factory/claims.json` separately. All passed.

| Claim ID | Exact command | Result |
| --- | --- | --- |
| guided-route | `npm run test:e2e -- --grep @claim:guided-route` | Pass (desktop; expected mobile extension skip) |
| private-capture | `npm run test:e2e -- --grep @claim:private-capture` | Pass (desktop; expected mobile extension skip) |
| local-storage | `npm run test:e2e -- --grep @claim:local-storage` | Pass (desktop; expected mobile extension skip) |
| route-controls | `npm run test:e2e -- --grep @claim:route-controls` | Pass (desktop; expected mobile extension skip) |
| export-files | `npm run test:e2e -- --grep @claim:export-files` | Pass (desktop and mobile) |
| no-account | `npm run test:e2e -- --grep @claim:no-account` | Pass (desktop and mobile) |
| demo-isolated | `npm run test:e2e -- --grep @claim:demo-isolated` | Pass (desktop and mobile) |
| offline-reload | `npm run test:e2e -- --grep @claim:offline-reload` | Pass (desktop and mobile) |
| no-tracking | `npm run test:e2e -- --grep @claim:no-tracking` | Pass (desktop and mobile) |
| supporter-license | `npm run test:e2e -- --grep @claim:supporter-license` | Pass (desktop; expected mobile extension skip) |
| browser-page-boundaries | `npm run test:e2e -- --grep @claim:browser-page-boundaries` | Pass (desktop; expected mobile extension skip) |
| mv3-package | `npm run test:e2e -- --grep @claim:mv3-package` | Pass (desktop; expected mobile extension skip) |
| license-return | `npm run test:e2e -- --grep @claim:license-return` | Pass (desktop and mobile) |

The full clean-clone `npm test` also passed (6 unit tests and the full
Playwright matrix, with only expected extension/mobile skips). `npm run
typecheck`, `npm run lint`, `npm run check:copy`, and `npm run build` passed.
The live checkout smoke passed: the advertised API endpoint returned HTTP 303
to the hosted Dodo checkout without submitting payment.

## History re-check

All earlier findings were checked against current live behavior and current
source, not accepted from the closure notes alone.

| Earlier finding | Current verification |
| --- | --- |
| F-1-1 / earlier M3 (supporter covers) | The packaged-extension `supporter-license` test restores valid/revoked fixtures, applies Blueprint/Graphite/Sunrise, and keeps reading free; live checkout returns 303. Fixed. |
| F-1-2 (discard demo on leave) | Live edit → Leave demo → re-enter restores the untouched sample. Fixed. |
| F-1-3 / earlier H4 (claims coverage) | 13 listed claim commands passed individually; current landing/README claim copy maps to them. Fixed. |
| F-1-4 (hero facts) | Mobile first screen has explicit Private, Offline, and Free/$12 facts. Fixed. |
| F-1-5 (ambiguous exit) | Banner uses **Leave demo** and returns home after reset. Fixed. |
| F-1-6 (terminology) | Core visitor wording consistently uses “dense workplace apps”. Fixed. |
| F-1-7 and F-1-8 (README opener/storage wording) | README is plain about a browser extension and says routes stay “on this device”. Fixed; remaining install jargon is recorded separately as F-2-1. |
| F-1-9 (README heading list) | Product-specific headings now name the product or action. Fixed. |
| F-1-10 (route social metadata) | Live SPA Demo, Privacy, and Terms have route-specific title, description, canonical, OG, Twitter title, and URL. Fixed. |
| F-1-11 (Note action) | Demo visibly labels the action **Edit note**. Fixed. |
| Earlier C1, H1, H2 | Packaged-extension claim tests cover multi-route 3–10-step playback, burst capture, accessible names, and password exclusion. Fixed. |
| Earlier H3 and M1 | Live axe has zero serious/critical issues in light/dark reduced-motion modes; 390 px target checks pass. Fixed. |
| Earlier M2 | A missing live URL returns HTTP 404 and the designed static not-found page. Fixed. |
| Verification-2 H1 | Live checkout returns HTTP 303 to the hosted checkout. Fixed. |

## Structure, accessibility, links, and visual identity

- `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` returned HTTP 200 with
  one h1, one main, `lang=en`, a route-specific title, description, canonical,
  OG URL/title, favicon, shared footer, and no console errors.
- SPA navigation to Privacy focused its new h1 and announced “Privacy without
  a cloud account loaded”. Browser Back focused the home h1 and announced the
  home route. Direct demo and deep legal links render correctly.
- A missing URL returned HTTP 404 with a designed page and a home link. The
  incomplete static header and metadata are F-2-2 and F-2-3.
- Every discovered internal route, download, icon, social image, robots file,
  sitemap, Apple touch icon, Param Factory link, and the checkout endpoint
  returned 200 or the intended 303. Mail links were identified as explicit
  mail actions and not fetched.
- Live Axe at 390 px found zero serious or critical findings on home, demo,
  privacy, terms, and missing routes in light and dark reduced-motion modes.
- The warm-paper, blueprint-line route notebook with oversized numbered
  junctions is visibly distinct from a generic SaaS hero/card template and
  matches `.factory/design.md`.

## Missed leverage check

No missed feature is recorded. The brief explicitly excludes cloud sync and AI
processing; adding either would weaken the local-first privacy model. The
product already supplies the valuable portable-data counterpart: Markdown and
JSON export. No provider key or decorative AI feature was found.

## What would make this perfect

Resolve F-2-1 through F-2-3, then re-run the 390 px cold read, direct-404
metadata/header check, link crawl, and the full claims suite. At that point the
product would have no remaining finding from this review.
