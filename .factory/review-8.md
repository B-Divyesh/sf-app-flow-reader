# Adversarial first-read review 8 — App Flow Reader

Date: 29 August 2026 UTC
Reviewed revision: `327a8937f53e303158d2b20f0468943110c29fd1`
Live URL: <https://app-flow-reader.sociobot.in>

## Verdict

**PASS — zero findings.**

This was a fresh, full review rather than a diff check. The product explains
the low-vision route-following job, audience, and first action in the first
screen at 390 × 844 and 1440 × 900. The live sample is one click away, already
shows a realistic five-step expense route, resets correctly, makes no
cross-origin request, and does not write durable browser storage. All 16
declared claim commands passed from a fresh clone. No unlisted public product
claim, broken route, dead link, accessibility defect, regression, or missing
brief-implied capability was found.

## Cold first read

Fresh Chromium contexts opened `/` without scrolling or prior state.

| Question | First-screen evidence | 390 px | Desktop |
| --- | --- | --- | --- |
| What does it do? | “Follow saved routes through dense workplace apps” | Clear | Clear |
| For whom? | “For people with progressive low vision who need one reliable path through dense workplace apps.” | Clear | Clear |
| What should I click first? | **Try it with sample data** — “Follow a five-step expense route.” | Clear | Clear |

At 390 px, the action and all three facts — **Private**, **Offline**, and
**Free** — are visible in the first 844 px. At desktop width, the same action
and facts are present in the first screen. The visual treatment is a distinct
route notebook (warm paper, blueprint lines, correction-orange path, numbered
junctions), not a generic SaaS template, and it matches `.factory/design.md`.

## Copy audit

Counts use visible whitespace-separated words. URLs, hyphenated terms, prices,
and code labels count as one word. The tables include sentence-like headings
and controls as well as prose, so a reader can verify the first-read surface.
No row exceeds 22 words. No banned marketing adjective, empty slogan,
inconsistent core term, context-free heading, or non-result-naming action was
found. “Route”, “step”, “recording”, “following”, “extension”, and “demo” are
used consistently.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| App Flow Reader | 3 | Product name |
| Demo / How it works / Privacy / Download | 5 | Named destinations |
| Browser extension for progressive low vision | 6 | Literal category and audience |
| Follow saved routes through dense workplace apps | 7 | H1; `guided-route` |
| For people with progressive low vision who need one reliable path through dense workplace apps. | 15 | Audience and situation |
| Try it with sample data | 5 | Result-naming primary action; `no-account` |
| Follow a five-step expense route. | 5 | Action result; `no-account` |
| Private | 1 | Fact label |
| Routes stay on this device. | 5 | `local-storage` |
| Offline | 1 | Fact label |
| The sample reader works after its first visit. | 8 | `offline-reload` |
| Free | 1 | Fact label |
| Reader and exports are free; covers cost $12 once. | 9 | `supporter-license` |
| Route 05 | 2 | Sample diagram label |
| Open Expenses / New report / Monthly expenses / Review report / Send to manager | 10 | Five sample labels |
| Live preview | 2 | Section label |
| Hear the current step and find its control | 8 | Section heading |
| The reader announces one instruction, outlines the matching page control, and waits for you. | 14 | `guided-route`, `playback-waits` |
| Current route | 2 | Preview label |
| Submit monthly expenses | 3 | Sample route name |
| How it works | 3 | Section label |
| Record once, then follow at your pace | 7 | Section heading |
| Save a route | 3 | Step heading |
| Name the task, then record between three and ten steps. | 10 | `guided-route` |
| Choose the route | 3 | Step heading |
| Your named routes stay together in the extension. | 8 | `guided-route` |
| Follow each step | 3 | Step heading |
| Use large Back and Next controls while the page target stays outlined. | 12 | `guided-route` |
| Clear boundaries | 2 | Section label |
| It reads the route, not your private fields | 8 | Section heading |
| Password controls are ignored completely. | 5 | `private-capture` |
| No screenshots or typed field values are stored. | 8 | `private-capture` |
| Browser settings pages cannot be read. | 6 | `browser-page-boundaries` |
| Optional supporter license | 3 | Section label |
| Add notebook cover styles for $12 once | 7 | `supporter-license` |
| The route reader, exports, and every accessibility feature remain free. | 10 | `supporter-license` |
| A supporter license adds three decorative cover styles in the extension. | 10 | `supporter-license` |
| After checkout, an installed extension restores the returned token. | 9 | `license-return` |
| You can also paste it into Supporter styles. | 8 | `license-return` |
| Buy supporter license (opens secure checkout) | 6 | Result/disclosure; `supporter-checkout` |
| Use in Chrome, Edge, Brave, and similar browsers | 8 | `mv3-package` |
| Keep the route reader in your toolbar | 7 | Install heading |
| Download the package, unzip it, then load the folder from the browser extensions page. | 14 | `mv3-package` |
| Download extension | 2 | Result-naming action |
| Install from the downloaded folder | 5 | Instruction heading |
| Open your browser’s extensions page. | 5 | Install instruction |
| Turn on the page’s Developer mode setting. | 7 | Install instruction |
| Choose Load unpacked, then choose the unzipped folder. | 8 | Install instruction |
| Follow saved routes through dense workplace apps. | 7 | Footer description |
| Privacy / Terms / Built by Param Factory | 5 | Named footer destinations |
| Version 1.1.1 · build 2026.08.29 | 4 | Release label |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| App Flow Reader | 3 | Product name |
| Follow saved routes through dense workplace apps. | 7 | Plain summary; `guided-route` |
| App Flow Reader is a browser extension for people with progressive low vision. | 13 | Audience and artifact |
| Record a named route once, then follow its 3–10 steps with current-step announcements, visible target outlines, and large Back and Next controls. | 22 | `guided-route` |
| Live site: https://app-flow-reader.sociobot.in | 3 | Link |
| Sample-data demo: https://app-flow-reader.sociobot.in/?demo=1 | 3 | Link |
| What App Flow Reader does | 5 | Contextual heading |
| Keeps multiple named routes on this device. | 7 | `local-storage` |
| Outlines each route target and waits for you; it never activates page controls. | 13 | `guided-route`, `playback-waits` |
| Uses accessible control names before visible text fallbacks. | 8 | `private-capture` |
| Ignores password controls and never stores typed values or screenshots. | 10 | `private-capture` |
| Pauses, resumes, annotates, exports, and deletes routes. | 7 | `route-controls` |
| Exports complete Markdown and JSON files. | 6 | `export-files` |
| Works offline after the site and sample route are first loaded. | 11 | `offline-reload` |
| The free reader, exports, and accessibility features need no account. | 10 | `no-account`, `supporter-license` |
| Public pages load no analytics, external fonts, or third-party scripts. | 10 | `no-tracking` |
| Try the isolated sample route | 5 | Contextual heading |
| Open `?demo=1` and use Back and Next to follow a five-step monthly expense route. | 14 | `no-account` |
| Changes stay in page memory and do not touch real extension data. | 12 | `demo-isolated` |
| Reset demo restores the sample. | 5 | `demo-isolated` |
| Start for real discards edits and opens the extension download instructions. | 11 | `demo-isolated` |
| Install the extension | 3 | Contextual heading |
| Download `app-flow-reader-chrome.zip` from the live site. | 6 | Install instruction |
| Unzip it. | 2 | Install instruction |
| Open your browser’s extensions page in Chrome, Edge, Brave, or a similar browser. | 13 | Install instruction |
| Turn on that page’s Developer mode setting. | 7 | Install instruction |
| Choose Load unpacked, then choose the unzipped folder. | 8 | Install instruction |
| Name a route in the toolbar popup and select Start recording. | 11 | `guided-route` |
| Complete 3–10 steps. | 3 | `guided-route` |
| Reopen the popup, select the route, then choose Follow route. | 10 | `guided-route` |
| Optional supporter license | 3 | Contextual heading |
| A $12 one-time supporter license adds Blueprint, Graphite, and Sunrise notebook covers in the extension. | 15 | `supporter-license` |
| It never gates the reader, exports, privacy controls, or accessibility features. | 11 | `supporter-license` |
| Buy supporter license opens a secure checkout outside App Flow Reader. | 11 | `supporter-checkout` |
| After checkout, an installed extension restores the returned token; you can also paste it into Supporter styles. | 17 | `license-return` |
| Develop locally | 2 | Contextual heading |
| Requirements: Node.js 22 and npm 10. | 6 | Developer prerequisite |
| Run all checks | 3 | Contextual heading |
| `test:live-checkout` checks the production catalog entry and checkout redirect. | 9 | Developer test description |
| It does not submit a payment. | 6 | Developer test boundary |
| The build produces `dist/site/`, `dist/extension/`, and the packaged extension at `dist/site/downloads/app-flow-reader-chrome.zip`. | 11 | Developer build output; confirmed locally |
| Deploy the website | 3 | Contextual heading |
| Deploy `dist/site/` as the static artifact. | 6 | Developer instruction |
| Azure Static Web Apps reads `staticwebapp.config.json` for known SPA rewrites, a real 404 catch-all, security headers, and cache policy. | 19 | Developer implementation detail; confirmed in build |
| Manifest V3 is used for the packaged extension. | 8 | `mv3-package` |
| Route state uses `chrome.storage.local`. | 4 | Implementation detail; covered by `local-storage` |
| The extension makes no background network request until a supporter token is restored. | 13 | `extension-network` |
| Verification then contacts only `api.sociobot.in`. | 5 | `extension-network` |
| Privacy and legal | 3 | Contextual heading |
| Read `/privacy` and `/terms`. | 4 | Named routes |
| Support: `support@sociobot.in`. | 2 | Contact |
| License | 1 | Contextual heading |
| MIT. | 1 | License identifier |
| See LICENSE. | 2 | Named file |

The landing, README, Privacy, and Terms statements were cross-checked against
`.factory/claims.json`. The two developer build/documentation statements are
not visitor product promises; the recorded fresh build confirmed them. All
visitor-reliant behavior maps to a listed, observable claim. No unlisted claim
finding is issued.

## Demo, privacy, and claims evidence

- Selecting **Try it with sample data** opened `/demo` or `?demo=1` in one
  click. The first screen already displayed the realistic monthly-expense route,
  the current instruction, all five steps, and a usable **Next** action.
- The persistent banner read “Demo — Sample data. Nothing is saved.” It
  included **Reset demo** and **Start for real**. A saved audit note disappeared
  after Start for real and did not return on re-entry. Reset also restored step
  1 of 5.
- Fresh demo contexts had empty localStorage and sessionStorage. The live demo
  exercise made only same-origin requests. The independent `demo-isolated`
  sandbox test additionally inspected IndexedDB and extension data.
- Every claim command listed in `.factory/claims.json` passed separately after
  `git clone` and `npm ci`: `guided-route`, `playback-waits`,
  `private-capture`, `local-storage`, `extension-network`, `route-controls`,
  `export-files`, `no-account`, `demo-isolated`, `offline-reload`,
  `no-tracking`, `supporter-license`, `supporter-checkout`,
  `browser-page-boundaries`, `mv3-package`, and `license-return`.

## Earlier finding audit

Every retained review, polish report, verification report, and handoff was
read. The table records a live and code re-check of every distinct prior issue;
none is merely accepted on a prior report's assertion.

| Earlier finding | Current evidence | Status |
| --- | --- | --- |
| C1 — wrong job/product | Live h1/audience, named 3–10-step routes, playback, announcements, highlights, and Back/Next are present; packaged `guided-route` passes. | Fixed |
| H1 — burst clicks lost | Packaged `guided-route` records the ordered capped burst through serialized mutations. | Fixed |
| H2 — accessible names/password inspection | Packaged `private-capture` passes for accessible naming, password exclusion, values, and screenshots. | Fixed |
| H3 — dark contrast | Fresh Axe scans on all public routes in light and dark found zero serious/critical issues. | Fixed |
| H4 / F-1-3 — incomplete or unlisted claims | 16 atomic claims each passed separately; landing, README, privacy, and terms cross-check found no unmapped visitor promise. | Fixed |
| M1 — undersized demo controls | 390 px live demo buttons measure 44 px or 52 px; no target is below 44 px. | Fixed |
| M2 — soft 404 | `/missing-review-8` returned the designed static page with HTTP 404. | Fixed |
| M3 / F-1-1 — paid result absent in extension | Packaged supporter test restores/revokes fixture tokens, applies Blueprint/Graphite/Sunrise, and preserves free reading. | Fixed |
| F-1-2 — demo edit survived exit | Live note → Start for real → re-enter removed the note; `demo-isolated` passed. | Fixed |
| F-1-4 — missing Private/Offline/Free facts | All three facts are visible in the initial mobile screen. | Fixed |
| F-1-5 — ambiguous demo exit | **Start for real** has explicit screen-reader help: discard sample data and go to download instructions. | Fixed |
| F-1-6 — inconsistent app terms | Current landing, footer, and README use “dense workplace apps.” | Fixed |
| F-1-7 / F-1-8 — README jargon/storage API | README starts in audience language and says routes stay on the device; API detail is confined to development documentation. | Fixed |
| F-1-9 — context-free README headings | Current headings name the product or the specific action. | Fixed |
| F-1-10 — stale social metadata | Home, demo, privacy, terms, and 404 produced route-specific title, description, canonical, OG, and Twitter URL values. | Fixed |
| F-1-11 — noun-only Note action | Demo visibly uses **Edit note** and has a specific accessible name. | Fixed |
| F-2-1 — unexplained install jargon | Site and README explain the browser extensions page before retaining literal browser labels. | Fixed |
| F-2-2 / F-2-3 — incomplete 404 shell/metadata | Static 404 has shared navigation/footer, skip link, title, canonical, favicon, Apple icon, theme colors, and social metadata. | Fixed |
| F-3-1 — unlisted extension-network promise | `extension-network` observes no pre-restore traffic and only the Sociobot verification destination after restore. | Fixed |
| F-5-1 — metaphorical hero kicker | The current kicker is literal: “Browser extension for progressive low vision.” | Fixed |
| F-6-1 — undisclosed checkout exit | Button says “Buy supporter license (opens secure checkout)”; the claim test confirms the HTTPS external redirect. | Fixed |
| F-7-1 — enabled mobile Next below viewport | Live 390 px **Next** is y=769–821 inside the initial 844 px view and is 52 px high. | Fixed |
| Verification-4 M1 — explicit start-for-real control | The current banner contains the exact **Start for real** action and explicit destination help. | Fixed |
| Verification-7 note overflow | Fresh maximum-length unbroken-note checks are in the complete suite and passed for demo and popup. | Fixed |
| Verification-7 untested non-activation | `playback-waits` attaches activation listeners and passes only when playback does not activate controls. | Fixed |

## Structure, accessibility, links, and scope

- `/`, `/demo`, `/privacy`, `/terms`, and the designed missing-page route each
  expose a valid title pattern, one H1, one main landmark, description,
  canonical, OG/Twitter data, favicon, and `lang=en`.
- SPA Privacy navigation moved focus to its H1 and announced “Privacy without
  a cloud account loaded”; browser Back restored home focus and announcement.
- The direct 404 includes the header, footer, return action, and HTTP 404.
  The expected network error for its 404 document is not a home-load console
  error; normal route loads had no console errors.
- Crawl checks returned 200 for internal pages, download ZIP, Param Factory,
  and the 303 HTTPS redirect for the disclosed checkout; `mailto:` links are
  explicit contacts.
- Fresh Axe scans at 390 px across home, demo, privacy, terms, and 404 in
  light/dark reduced-motion contexts produced zero serious or critical issues.
- The brief excludes AI processing, cloud sync, and team accounts. The product
  supplies the implied export capability (Markdown and JSON) and a local,
  isolated demo. No missing AI, import/export, or sync feature is implied by
  the stated scope; no decorative AI or embedded provider key exists.

## What would make this perfect

No in-scope repair is required for this revision. Preserve the current
one-click isolated demo, per-claim tests, low-vision interaction constraints,
and original notebook visual system as later changes are made.
