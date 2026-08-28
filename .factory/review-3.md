# Adversarial first-read review 3 — App Flow Reader

Date: 28 August 2026 UTC  
Reviewed revision: `4588905e73dd9b96daea5020fc9e346a84a2f86f`  
Live URL: <https://app-flow-reader.sociobot.in>

## Verdict

**FAIL — 1 blocking finding.**

The first read, demo, implementation behavior, history closures, and structural
checks pass. Release is blocked by one public privacy/network claim in README
that has no matching `claims.json` entry or observable tagged test.

## Findings

### F-3-1 — BLOCKING — README makes an unlisted extension-network claim

- **Exact quote/location:** README, “Route state uses `chrome.storage.local`;
  the optional license check is the only extension network request and runs
  after a user pastes a token.”
- **Why this fails the claims gate:** `local-storage` proves that recording a
  route makes no external request. `supporter-license` proves a submitted
  fixture token can be checked. Neither listed claim says, nor test observes,
  that no other extension request exists or that verification cannot occur
  before explicit token entry. This is a concrete privacy promise a visitor
  can rely on, so it cannot remain an unlisted implementation detail.
- **Concrete fix:** either remove the “only extension network request” and
  “after a user pastes” promise, or add an atomic claim such as “The extension
  sends no network request until you submit a supporter token; verification
  then contacts only `api.sociobot.in`.” Add a tagged fresh-profile extension
  test that intercepts startup/recording traffic, submits a fixture token, and
  asserts the sole request destination and timing.

## Cold first read

Fresh Chromium contexts at **390 × 844** and **1440 × 900**, before scrolling,
gave the same complete answer:

| Question | Exact first-screen evidence | Result |
| --- | --- | --- |
| What does this do? | “Follow saved routes through dense workplace apps” | Clear. |
| For whom? | “For people with progressive low vision who need one reliable path through dense workplace apps.” | Clear. |
| What should I click first? | **Try it with sample data**; adjacent copy says “Follow a five-step expense route.” | Clear and result-naming. |

The action and the Private, Offline, and Free facts were visible without
scrolling at 390 px. Both cold loads returned HTTP 200 and requested only the
product origin.

## Copy audit

Word counts use whitespace-separated visible words. Code blocks and URLs are
not prose sentences. Every prose sentence is at or below 22 words, uses the
same route/step/demo vocabulary, and has no banned marketing term. No heading
or action label required a rewrite.

### Landing-page sentences and sentence-like labels

| Copy | Words | Result |
| --- | ---: | --- |
| App Flow Reader | 3 | Pass |
| A steady path through dense workplace apps | 7 | Pass |
| Follow saved routes through dense workplace apps | 7 | Pass |
| For people with progressive low vision who need one reliable path through dense workplace apps. | 15 | Pass |
| Try it with sample data | 5 | Pass |
| Follow a five-step expense route. | 5 | Pass |
| Private | 1 | Pass |
| Routes stay on this device. | 5 | Pass — `local-storage` |
| Offline | 1 | Pass |
| The sample reader works after its first visit. | 8 | Pass — `offline-reload` |
| Free | 1 | Pass |
| Reader and exports are free; covers cost $12 once. | 9 | Pass — `supporter-license` |
| Live preview | 2 | Pass |
| Hear the current step and find its control | 8 | Pass |
| The reader announces one instruction, outlines the matching page control, and waits for you. | 14 | Pass — `guided-route` |
| Current route | 2 | Pass |
| Submit monthly expenses | 3 | Pass |
| How it works | 3 | Pass |
| Record once, then follow at your pace | 7 | Pass |
| Save a route | 3 | Pass |
| Name the task, then record between three and ten steps. | 10 | Pass — `guided-route` |
| Choose the route | 3 | Pass |
| Your named routes stay together in the extension. | 8 | Pass — `guided-route` |
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
| A supporter license adds three decorative cover styles in the extension. | 10 | Pass — `supporter-license` |
| After checkout, an installed extension restores the returned token. | 9 | Pass — `license-return` |
| You can also paste it into Supporter styles. | 8 | Pass — `license-return` |
| Buy supporter license | 3 | Pass — result-naming verb |
| Use in Chrome, Edge, Brave, and similar browsers | 8 | Pass |
| Keep the route reader in your toolbar | 7 | Pass |
| Download the package, unzip it, then load the folder from the browser extensions page. | 14 | Pass |
| Download extension | 2 | Pass — result-naming verb |
| Install from the downloaded folder | 5 | Pass |
| Open your browser’s extensions page. | 5 | Pass |
| Turn on the page’s Developer mode setting. | 7 | Pass |
| Choose Load unpacked, then choose the unzipped folder. | 8 | Pass |
| Follow saved routes through dense workplace apps. | 7 | Pass |

### README sentences and sentence-like headings

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
| Open your browser’s extensions page in Chrome, Edge, Brave, or a similar browser. | 13 | Pass |
| Turn on that page’s Developer mode setting. | 7 | Pass |
| Choose Load unpacked, then choose the unzipped folder. | 8 | Pass |
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
| Route state uses `chrome.storage.local`; the optional license check is the only extension network request and runs after a user pastes a token. | 22 | **F-3-1** — unlisted privacy/network claim |
| Privacy and legal | 3 | Pass |
| Read `/privacy` and `/terms`. | 4 | Pass |
| Support: `support@sociobot.in`. | 2 | Pass |
| License | 1 | Pass |
| MIT. | 1 | Pass |
| See `LICENSE`. | 2 | Pass |

The visible actions also pass the result-naming check: **Try it with sample
data**, **Reset demo**, **Leave demo**, **Export Markdown**, **Export JSON**,
**Edit note**, **Save note**, **Download extension**, and **Buy supporter
license**. Back and Next are conventional reader-direction controls.

## Demo and sandbox verification

- One click from the hero opened `/?demo=1` at both viewports.
- The first demo view already showed the persistent “Demo — Sample data.
  Nothing is saved.” banner, Reset demo, Leave demo, five realistic
  monthly-expense steps, and the active Step 1 reader.
- An edited note was removed by Leave demo; re-entry restored the untouched
  five-step sample. Reset demo also restored the sample.
- During the full live demo flow, `localStorage`, `sessionStorage`, and
  IndexedDB remained empty; all observed requests were same-origin.
- After priming the live service worker, a fresh 390 px context reloaded
  `/demo` offline with five steps and Next changed “STEP 1 OF 5” to
  “STEP 2 OF 5”.

## Claims verification

I made a fresh clone at `/tmp/app-flow-reader-review3.Y70SnW`, ran `npm ci`,
and ran each command declared by `.factory/claims.json` separately. Every
command passed. Extension-only mobile projects are intentional skips; desktop
exercises the packaged MV3 extension.

| Claim ID | Exact command | Result |
| --- | --- | --- |
| guided-route | `npm run test:e2e -- --grep @claim:guided-route` | Pass |
| private-capture | `npm run test:e2e -- --grep @claim:private-capture` | Pass |
| local-storage | `npm run test:e2e -- --grep @claim:local-storage` | Pass |
| route-controls | `npm run test:e2e -- --grep @claim:route-controls` | Pass |
| export-files | `npm run test:e2e -- --grep @claim:export-files` | Pass |
| no-account | `npm run test:e2e -- --grep @claim:no-account` | Pass |
| demo-isolated | `npm run test:e2e -- --grep @claim:demo-isolated` | Pass |
| offline-reload | `npm run test:e2e -- --grep @claim:offline-reload` | Pass |
| no-tracking | `npm run test:e2e -- --grep @claim:no-tracking` | Pass |
| supporter-license | `npm run test:e2e -- --grep @claim:supporter-license` | Pass |
| browser-page-boundaries | `npm run test:e2e -- --grep @claim:browser-page-boundaries` | Pass |
| mv3-package | `npm run test:e2e -- --grep @claim:mv3-package` | Pass |
| license-return | `npm run test:e2e -- --grep @claim:license-return` | Pass |

The aggregate tagged run also passed: 19 passed and 7 expected skips. F-3-1 is
the sole claim-like landing/README statement without a matching claim entry and
observable tagged test.

## Earlier findings re-checked

Each closure below was confirmed from current source and the live site, not
accepted from the earlier handoff.

| Earlier finding | Current verification |
| --- | --- |
| F-1-1 / earlier M3 | Packaged-extension fixture test restores valid/revoked licenses, applies Blueprint/Graphite/Sunrise covers, and keeps free reading available. Live checkout returns 303 to hosted Dodo. Fixed. |
| F-1-2 | Live edit → Leave demo → re-enter discarded the edit. Fixed. |
| F-1-3 / earlier H4 | All 13 atomic claim commands passed; landing and README claims map to them. Fixed. |
| F-1-4 | The mobile first screen includes explicit Private, Offline, and Free/$12 facts. Fixed. |
| F-1-5 | The banner says **Leave demo** and returns home after resetting sample state. Fixed. |
| F-1-6 | Landing, footer, and README consistently use “dense workplace apps.” Fixed. |
| F-1-7 / F-1-8 | README opens in plain language and says routes stay on the device. Fixed. |
| F-1-9 | README headings identify the product or action out of context. Fixed. |
| F-1-10 | Demo, Privacy, and Terms update title, description, canonical, OG, and Twitter metadata. Fixed. |
| F-1-11 | Demo’s visible note action says **Edit note**. Fixed. |
| Earlier C1 / H1 / H2 | Packaged MV3 tests verify named multi-route 3–10-step playback, serialized burst capture, accessibility-name capture, and password exclusion. Fixed. |
| Earlier H3 / M1 | Light/dark, reduced-motion Axe tests and 390 px target checks pass. Fixed. |
| Earlier M2 | An unknown live route returned HTTP 404 and the designed not-found page. Fixed. |
| Verification-2 H1 | The advertised checkout endpoint now returns HTTP 303 to a hosted checkout. Fixed. |
| F-2-1 | Current landing and README explain the browser extensions page before retaining literal browser labels. Fixed. |
| F-2-2 | The HTTP 404 page has the shared wordmark, skip link, Demo/How it works/Privacy/Download navigation, and footer. Fixed. |
| F-2-3 | The static 404 has favicon, Apple touch icon, light/dark theme colors, canonical, and complete OG/Twitter metadata. Fixed. |

## Structure, links, accessibility, and identity

- `/`, `/demo`, `/privacy`, `/terms`, `/404.html`, assets, the extension ZIP,
  robots, and sitemap returned 200; an unknown route returned 404. The checkout
  endpoint returned 303; every crawled link resolved, apart from explicit
  `mailto:` actions.
- Each real route has one h1 and one main landmark, a route title, description,
  canonical, OG URL, and favicon. SPA Privacy navigation and Back both moved
  focus to the destination h1.
- Current automated accessibility checks passed across light/dark and
  reduced-motion routes; the live mobile check showed no horizontal overflow.
- The warm-paper route-notebook, blueprint rules, correction-orange path, and
  oversized numbered junctions match the recorded design thesis and are
  distinct from a generic SaaS template.

## Missed leverage

No missed feature is recorded. The brief explicitly excludes cloud sync and
AI processing. The valuable portable-data counterpart is already present as
Markdown and JSON export; no decorative AI feature or embedded provider key
was found.

## What would make this perfect

Resolve F-3-1, then repeat the clean-profile extension network interception,
all 13 claim commands, and the cold mobile demo check. No other change was
identified in this round.
