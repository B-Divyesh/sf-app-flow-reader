# Adversarial first-read review 4 — App Flow Reader

Date: 28 August 2026 UTC  
Reviewed revision: `743b82f005008958a10204dffaa94efd40e07a19`  
Live URL: <https://app-flow-reader.sociobot.in>

## Verdict

**PASS — zero findings.**

The cold-read, demo, privacy boundary, claims inventory, earlier closures,
routing, accessibility, and links were independently re-run. No finding
remains and every listed claim was tested.

## Cold first read

Fresh Chromium contexts at 390 × 844 and 1440 × 900, before scrolling,
gave the same answers:

| Question | Evidence on the first screen | Result |
| --- | --- | --- |
| What does it do? | “Follow saved routes through dense workplace apps” | Clear. |
| For whom? | “For people with progressive low vision who need one reliable path through dense workplace apps.” | Clear. |
| What should I click first? | **Try it with sample data**; it says “Follow a five-step expense route.” | Clear and result-naming. |

At 390 px, the primary action and literal Private, Offline, and Free/$12 facts
fit in the initial viewport. Repeated fresh mobile loads rendered the headline
with HTTP 200 and no console or page error. The warm-paper, blueprint-line
route notebook is distinct from a generic SaaS layout and matches
`.factory/design.md`.

## Copy audit

Whitespace-separated word counts are below. Code blocks are not prose. Every
landing and README sentence is at or below 22 words. No banned marketing word,
visitor-facing jargon, inconsistent core term, context-free heading, or
non-result-naming action remains. Claim-like copy maps to `.factory/claims.json`.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| App Flow Reader | 3 | Pass |
| A steady path through dense workplace apps | 7 | Pass |
| Follow saved routes through dense workplace apps | 7 | Pass |
| For people with progressive low vision who need one reliable path through dense workplace apps. | 15 | Pass |
| Try it with sample data | 5 | Pass — result-naming |
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
| Buy supporter license | 3 | Pass — result-naming |
| Use in Chrome, Edge, Brave, and similar browsers | 8 | Pass |
| Keep the route reader in your toolbar | 7 | Pass |
| Download the package, unzip it, then load the folder from the browser extensions page. | 14 | Pass |
| Download extension | 2 | Pass — result-naming |
| Install from the downloaded folder | 5 | Pass |
| Open your browser’s extensions page. | 5 | Pass |
| Turn on the page’s Developer mode setting. | 7 | Pass |
| Choose Load unpacked, then choose the unzipped folder. | 8 | Pass |
| Follow saved routes through dense workplace apps. | 7 | Pass |

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
| The free reader, exports, and accessibility features need no account. | 10 | Pass — `no-account` |
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
| Route state uses `chrome.storage.local`. | 4 | Pass — developer context |
| The extension makes no background network request until a supporter token is restored. | 13 | Pass — `extension-network` |
| Verification then contacts only `api.sociobot.in`. | 6 | Pass — `extension-network` |
| Privacy and legal | 3 | Pass |
| Read `/privacy` and `/terms`. | 4 | Pass |
| Support: `support@sociobot.in`. | 2 | Pass |
| License | 1 | Pass |
| MIT. | 1 | Pass |
| See `LICENSE`. | 2 | Pass |

## Demo and sandbox

- One click on **Try it with sample data** entered the route reader.
- The first demo screen already showed the five-step fictional monthly-expense
  route, active Step 1, Back/Next controls, and the persistent “Demo — Sample
  data. Nothing is saved.” banner with **Reset demo** and **Leave demo**.
- Editing a note, leaving, and re-entering restored the untouched sample;
  Reset demo also restored the sample.
- `localStorage`, `sessionStorage`, IndexedDB, and cross-origin requests stayed
  empty throughout the demo flow. Real extension data is not read or written.
- After the first visit primed the service worker, `/demo` reloaded offline and
  Next advanced from Step 1 to Step 2 at both tested viewport sizes.

## Claims verification

A fresh non-local clone at `/tmp/app-flow-reader-review4-clean` ran `npm ci`.
Every exact `claims.json` command was run separately and passed. Extension-only
mobile cases are intentional skips because an MV3 extension is exercised in a
desktop Chromium profile.

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

The clean clone also passed `npm test`, `npm run test:a11y`, `npm run
typecheck`, `npm run lint`, `npm run check:package`, `npm run check:copy`,
`npm run build`, ZIP integrity, `npm run test:live-checkout`, and `npm audit
--audit-level=high` (zero vulnerabilities). The final Playwright report has
`status: "passed"` and no failed tests.

## Earlier finding audit

All earlier review and polish records were read. Each prior finding was checked
again on current source and the deployed site:

| Earlier ID(s) | Current verification | Result |
| --- | --- | --- |
| F-1-1 / M3 | Packaged extension restores valid tokens, rejects revoked tokens, applies all three covers, and keeps reading free. | Fixed |
| F-1-2 | Edit → Leave demo → re-enter discards the edit. | Fixed |
| F-1-3 / H4 | All public claims are inventoried and tagged tests pass separately. | Fixed |
| F-1-4 | Private, Offline, and Free/$12 facts appear in the mobile first screen. | Fixed |
| F-1-5 | The exit action is **Leave demo** and discards the sample. | Fixed |
| F-1-6 | Landing, footer, and README use “dense workplace apps.” | Fixed |
| F-1-7 / F-1-8 | README opens plainly and says routes stay on the device. | Fixed |
| F-1-9 | README headings name the product or action. | Fixed |
| F-1-10 | Demo, Privacy, and Terms set route-specific title, description, canonical, OG, and Twitter data after navigation. | Fixed |
| F-1-11 | Note editing visibly says **Edit note**. | Fixed |
| C1 / H1 / H2 | Packaged MV3 checks cover multi-route playback, serial capture, accessible names, and password exclusion. | Fixed |
| H3 / M1 | Light/dark/reduced-motion Axe checks pass; 390 px has no overflow or undersized visible targets. | Fixed |
| M2 | A missing live URL returns HTTP 404 with the designed static page. | Fixed |
| Verification-2 H1 | The checkout endpoint returns its intended hosted-checkout 303. | Fixed |
| F-2-1 | Visitor copy explains the browser extensions page before literal browser labels. | Fixed |
| F-2-2 / F-2-3 | The static 404 has shared navigation and complete icon/theme/social metadata. | Fixed |
| F-3-1 | README network wording maps to `extension-network`, whose fresh-profile request test passes. | Fixed |

## Structure, accessibility, links, and scope

- `/`, `/demo`, `/privacy`, `/terms`, the ZIP, `robots.txt`, and `sitemap.xml`
  returned 200; a deliberately missing route returned 404. Checkout returned
  the intended 303 and the Param Factory link returned 200. Explicit mail links
  were not fetched.
- Every application route has `lang=en`, one h1, a main landmark, title,
  description, canonical, OG/Twitter image metadata, favicon, shared header,
  and shared footer. Privacy navigation and browser Back focus the destination
  h1 and announce the route.
- Live desktop and 390 px checks observed no console errors, no page errors,
  no third-party requests, no serious/critical Axe issue, and no horizontal
  overflow. Focus, dialog, keyboard, and reduced-motion checks pass.
- The brief expressly excludes AI processing and cloud sync. Markdown and JSON
  export supply the expected portable-data path; no missing AI feature, hidden
  provider key, or decorative AI feature was found.

## What would make this perfect

Maintain this claim-to-test discipline as product copy changes. No current
product change is required.
