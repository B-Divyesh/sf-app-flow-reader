# Adversarial first-read review 5 — App Flow Reader

Date: 29 August 2026 UTC  
Reviewed revision: `054c0412c1ae409327240a86f0bf82cc1424e177`  
Live URL: <https://app-flow-reader.sociobot.in>

## Verdict

**FAIL — 1 minor finding.**

The first read, one-click demo, sandbox, all 14 claims, prior finding closures,
routing, accessibility, and links pass. The release does not meet the required
zero-finding standard because the first screen retains one metaphorical slogan
that adds no usable information.

## Findings

### F-5-1 — MINOR — The first-screen kicker is a metaphorical slogan

- **Exact quote/location:** landing hero, above the h1: “A steady path through
  dense workplace apps”.
- **Why a first-time visitor loses information:** “steady path” is a metaphor,
  not a product fact. The line repeats the route idea already stated more
  clearly by “Follow saved routes through dense workplace apps”, so it consumes
  scarce phone space without identifying the artifact, audience, or next step.
- **Concrete fix:** replace it with the literal six-word label **“Browser
  extension for progressive low vision”**, or remove it. Add the resulting copy
  to the checked copy audit.

## Cold first read

Fresh Chromium contexts at 390 × 844 and 1440 × 900 were opened before any
scroll or interaction.

| Question | First-screen answer | Result |
| --- | --- | --- |
| What does this do? | It saves routes through dense workplace apps and lets the user follow them again. | Clear from “Follow saved routes through dense workplace apps”. |
| For whom? | People with progressive low vision who need a repeatable path through a workplace app. | Clear from the 15-word audience sentence. |
| What should I click first? | **Try it with sample data** to open a five-step expense route. | Clear and visible at both sizes. |

At 390 px, the action and the Private, Offline, and Free/$12 facts all fit in
the initial 844 px viewport. The page had no horizontal overflow, console
error, page error, or cross-origin request. The required three answers pass;
F-5-1 concerns the additional slogan, so it is not blocking.

## Copy audit

Counts use whitespace-separated words; hyphenated terms, prices, URLs, and
code labels each count as one word. Code blocks are not prose. All sentences
are at or below 22 words. No banned marketing adjective, inconsistent core
term, or non-result-naming button was found. The sole copy flag is F-5-1.

### Landing page sentences and headings

| Copy | Words | Result |
| --- | ---: | --- |
| A steady path through dense workplace apps | 7 | **F-5-1 — metaphorical slogan; adds no new information** |
| Follow saved routes through dense workplace apps | 7 | Pass |
| For people with progressive low vision who need one reliable path through dense workplace apps. | 15 | Pass |
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
| A supporter license adds three decorative cover styles in the extension. | 11 | Pass — `supporter-license` |
| After checkout, an installed extension restores the returned token. | 9 | Pass — `license-return` |
| You can also paste it into Supporter styles. | 8 | Pass — `license-return` |
| Use in Chrome, Edge, Brave, and similar browsers | 8 | Pass — `mv3-package` |
| Keep the route reader in your toolbar | 7 | Pass |
| Download the package, unzip it, then load the folder from the browser extensions page. | 14 | Pass — `mv3-package` |
| Install from the downloaded folder | 5 | Pass |
| Open your browser’s extensions page. | 5 | Pass |
| Turn on the page’s Developer mode setting. | 7 | Pass |
| Choose Load unpacked, then choose the unzipped folder. | 8 | Pass |
| Follow saved routes through dense workplace apps. | 7 | Pass |

The visible action labels are **Try it with sample data**, **Open navigation**,
**Buy supporter license**, and **Download extension**. Each names the result or
the conventional interface action. Navigation links use literal destinations.

### README sentences and headings

| Copy | Words | Result |
| --- | ---: | --- |
| App Flow Reader | 3 | Pass |
| Follow saved routes through dense workplace apps. | 7 | Pass |
| App Flow Reader is a browser extension for people with progressive low vision. | 13 | Pass |
| Record a named route once, then follow its 3–10 steps with current-step announcements, visible target outlines, and large Back and Next controls. | 22 | Pass — `guided-route` |
| Live site: `https://app-flow-reader.sociobot.in` | 3 | Pass |
| Sample-data demo: `https://app-flow-reader.sociobot.in/?demo=1` | 3 | Pass |
| What App Flow Reader does | 5 | Pass |
| Keeps multiple named routes on this device. | 7 | Pass — `guided-route`, `local-storage` |
| Uses accessible control names before visible text fallbacks. | 8 | Pass — `private-capture` |
| Ignores password controls and never stores typed values or screenshots. | 10 | Pass — `private-capture` |
| Pauses, resumes, annotates, exports, and deletes routes. | 7 | Pass — `route-controls` |
| Exports complete Markdown and JSON files. | 6 | Pass — `export-files` |
| Works offline after the site and sample route are first loaded. | 11 | Pass — `offline-reload` |
| The free reader, exports, and accessibility features need no account. | 10 | Pass — `no-account`, `supporter-license` |
| Public pages load no analytics, external fonts, or third-party scripts. | 10 | Pass — `no-tracking` |
| Try the isolated sample route | 5 | Pass |
| Open `?demo=1` and use Back and Next to follow a five-step monthly expense route. | 14 | Pass |
| Changes stay in page memory and do not touch real extension data. | 12 | Pass — `demo-isolated` |
| Reset demo restores the sample. | 5 | Pass — `demo-isolated` |
| Leave demo discards edits before returning home. | 7 | Pass — `demo-isolated` |
| Install the extension | 3 | Pass |
| Download `app-flow-reader-chrome.zip` from the live site. | 6 | Pass — `mv3-package` |
| Unzip it. | 2 | Pass |
| Open your browser’s extensions page in Chrome, Edge, Brave, or a similar browser. | 13 | Pass |
| Turn on that page’s Developer mode setting. | 7 | Pass |
| Choose Load unpacked, then choose the unzipped folder. | 8 | Pass |
| Name a route in the toolbar popup and select Start recording. | 11 | Pass |
| Complete 3–10 steps. | 3 | Pass — `guided-route` |
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
| Route state uses `chrome.storage.local`. | 4 | Pass — developer context |
| The extension makes no background network request until a supporter token is restored. | 13 | Pass — `extension-network` |
| Verification then contacts only `api.sociobot.in`. | 5 | Pass — `extension-network` |
| Privacy and legal | 3 | Pass |
| Read `/privacy` and `/terms`. | 4 | Pass |
| Support: `support@sociobot.in`. | 2 | Pass |
| License | 1 | Pass |
| MIT. | 1 | Pass |
| See `LICENSE`. | 2 | Pass |

Terminology is consistent: **route** is the saved task path, **step** is one
instruction, **recording** captures a route, **following** plays it back,
**extension** names the browser add-on, **demo** names the isolated sample, and
**supporter license** names the optional purchase.

## Demo and sandbox verification

- The first-screen action enters `/?demo=1` in one click; `/demo` also deep
  links directly.
- The initial demo viewport already contains the persistent “Demo — Sample
  data. Nothing is saved.” banner, **Reset demo**, **Leave demo**, five
  realistic Ledger expense steps, active Step 1, and large Back/Next controls.
- Next advances to Step 2. Reset restores Step 1 and all five original steps.
- Editing a note, leaving, and re-entering discards the edit.
- `localStorage`, `sessionStorage`, IndexedDB, cookies, and cross-origin request
  logs stay empty during the demo. The demo code uses only in-memory sample
  state and has no extension-storage access.
- After the service worker is primed, the live demo reloads offline with five
  steps and remains operable.

The demo gate passes.

## Claims verification

A separate non-local clone at `/tmp/app-flow-reader-review5-clean` ran `npm ci`.
Every exact command in `.factory/claims.json` was then executed separately.
Extension-only mobile cases are intentional skips; desktop Chromium exercises
the packaged MV3 extension.

| Claim ID | Result |
| --- | --- |
| `guided-route` | Pass |
| `private-capture` | Pass |
| `local-storage` | Pass |
| `extension-network` | Pass |
| `route-controls` | Pass |
| `export-files` | Pass |
| `no-account` | Pass |
| `demo-isolated` | Pass |
| `offline-reload` | Pass |
| `no-tracking` | Pass |
| `supporter-license` | Pass |
| `browser-page-boundaries` | Pass |
| `mv3-package` | Pass |
| `license-return` | Pass |

The current landing page and README were cross-checked line by line against
the inventory. No unlisted product claim or untested listed claim was found.

## Earlier finding audit

Every prior review, polish report, and handoff was read. Each closure below was
checked against current live behavior and source rather than accepted from its
status label.

| Earlier ID | Current verification | Result |
| --- | --- | --- |
| C1 — wrong product/job | Live copy and packaged extension implement named low-vision routes with guided playback. | Fixed |
| H1 — rapid clicks lost | `guided-route` stores the ordered capped burst through the serialized mutation path. | Fixed |
| H2 — accessible names/passwords | `private-capture` verifies accessible-name capture and excludes passwords, values, and screenshots. | Fixed |
| H3 — dark contrast | Live and local light/dark Axe checks have zero serious or critical findings. | Fixed |
| H4 / F-1-3 — incomplete claims | Fourteen inventoried claims each have an independently passing tagged test; no public claim is unlisted. | Fixed |
| M1 — 34 px demo controls | The 390 px check finds no visible target below 44 px. | Fixed |
| M2 — soft 404 | A missing live URL returns HTTP 404 with the designed page. | Fixed |
| M3 / F-1-1 — paid result absent | The packaged extension restores valid tokens, rejects revoked tokens, applies all three covers, and keeps reading free. | Fixed |
| Verification-2 H1 — checkout 404 | The live checkout endpoint returns its intended hosted-checkout 303. | Fixed |
| F-1-2 — demo edit survives exit | Live edit → Leave demo → re-enter restores the untouched sample. | Fixed |
| F-1-4 — hero facts missing | Private, Offline, and Free/$12 appear in the mobile first screen. | Fixed |
| F-1-5 — ambiguous demo exit | The action says **Leave demo** and discards sample changes. | Fixed |
| F-1-6 — inconsistent workplace-app terms | Landing, footer, and README consistently use “dense workplace apps”. | Fixed |
| F-1-7 — README platform jargon | The README opens in plain language and explains the browser extensions page. | Fixed |
| F-1-8 — storage API in user copy | User copy says routes stay “on this device”; the API name remains only in development details. | Fixed |
| F-1-9 — context-free README headings | README headings identify the product or action. | Fixed |
| F-1-10 — stale social metadata | Demo, Privacy, and Terms set route-specific title, description, canonical, OG, and Twitter values. | Fixed |
| F-1-11 — noun-only note action | The demo visibly says **Edit note**. | Fixed |
| F-2-1 — unexplained install jargon | Landing and README explain the browser extensions page before literal browser labels. | Fixed |
| F-2-2 — 404 missing shared navigation | The HTTP 404 page has the wordmark, shared navigation, skip link, and footer. | Fixed |
| F-2-3 — incomplete 404 metadata | The 404 has canonical, favicon, Apple icon, two theme colors, and complete OG/Twitter metadata. | Fixed |
| F-3-1 — unlisted extension-network claim | `extension-network` observes zero background requests before restore and only the Sociobot verification GET afterward. | Fixed |
| Handoff NVDA gap | No NVDA claim is made; automated and keyboard checks remain the stated evidence. | Accurately disclosed; not a finding |

No prior finding regressed. F-5-1 is new.

## Structure, accessibility, links, and identity

- `/`, `/demo`, `/privacy`, and `/terms` return 200. An unknown URL returns the
  designed HTTP 404. Deep links load directly.
- Each application route has `lang=en`, one h1, one main landmark, a compliant
  route title, description, canonical, OG/Twitter data, favicon, shared header,
  and shared footer. The 404 has the equivalent static metadata and skeleton.
- SPA navigation and browser Back move focus to the destination h1 and announce
  the route. Keyboard dialog and focus tests pass.
- The live link crawl found no dead product link: internal routes, the ZIP, and
  Param Factory return 200; checkout returns its intended 303; `mailto:` links
  are explicit. The missing page's own skip link correctly retains the page's
  404 response.
- Live desktop and 390 px checks found no console/page errors, horizontal
  overflow, undersized visible controls, or third-party requests. Light and
  dark reduced-motion Axe checks found zero serious or critical violations.
- `verify-url.sh` passes home, demo, privacy, and terms: correct title/language,
  one h1, main, image alternatives, labeled buttons, and no console errors.
- Response headers deliver CSP `frame-ancestors`, nosniff, referrer policy,
  permissions policy, and frame denial without a meta-CSP console violation.
- The warm paper, blueprint rules, correction-orange route line, offset paper,
  and oversized junction numbers match `.factory/design.md` and do not resemble
  a generic gradient/card SaaS template.

## Missed leverage

No additional feature is raised. The brief explicitly excludes AI processing
and cloud sync, and no provider key or decorative AI feature exists. Markdown
and JSON export provide the included portable-data path. Import could be useful,
but the researched scope specifies export rather than restore/import, so it is
not treated as an implied requirement.

## Verification summary

- `npm ci`: pass; zero reported vulnerabilities.
- Fourteen exact claim commands: pass individually.
- `npm test`: pass — 6 unit and 32 browser tests; 10 expected project-specific
  skips.
- `npm run test:a11y`: pass — 3 tests; 1 expected mobile-extension skip.
- Typecheck, lint, package contract, copy check, live checkout, high-severity
  audit, production build, and ZIP integrity: pass.
- First-load site JavaScript is 19.34 kB raw and 6.71 kB gzip.
- The live extension ZIP SHA-256 matches the clean local build.

## What would make this perfect

Replace or remove “A steady path through dense workplace apps” as specified in
F-5-1, then rerun the cold 390 px read and copy audit. No functional, demo,
claim, accessibility, routing, privacy, or missed-leverage change is otherwise
required by this review.
