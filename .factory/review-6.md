# Adversarial first-read review 6 — App Flow Reader

Date: 29 August 2026 UTC
Reviewed revision: `5623dc05d54399bf47b77b171a9107d148c700b2`
Live URL: <https://app-flow-reader.sociobot.in>

## Verdict

**FAIL — 1 minor finding.**

The low-vision job, first action, one-click demo, privacy boundary, live
routing, claims, and extension package are clear and verified. The release is
not a PASS because its purchase action silently leaves the product site. The
site structure requires external links to disclose that transition.

## Findings

### F-6-1 — MINOR — The purchase action does not disclose its external checkout destination

- **Exact quote/location:** Landing supporter section: **“Buy supporter
  license”**. Its `href` is
  `https://api.sociobot.in/api/v1/products/app-flow-reader/checkout`; live
  verification returned HTTP 303 to `https://checkout.dodopayments.com/...`.
- **Why this loses a first-time visitor:** A person selecting the only paid
  action leaves App Flow Reader without advance notice. This is especially
  disorienting for a user relying on a repeatable, accessible route.
- **Concrete fix:** Change the visible label to **“Buy supporter license
  (opens secure checkout)”** and give it a matching accessible name. Keep the
  Sociobot checkout endpoint; the disclosure is about the navigation result,
  not a new payment integration. Add a browser assertion for the label and
  cross-origin redirect.

## Cold first read

Fresh Chromium contexts at 390 × 844 and 1440 × 900 loaded `/` before any
scroll or interaction. Both answer the required questions from the first
screen:

| Question | Exact evidence | Result |
| --- | --- | --- |
| What does it do? | “Follow saved routes through dense workplace apps” | Clear: save and follow a repeatable app task path. |
| For whom? | “For people with progressive low vision who need one reliable path through dense workplace apps.” | Clear. |
| What should I click first? | **“Try it with sample data”** / “Follow a five-step expense route.” | Clear, visible, and result-naming. |

At 390 px the action and the Private, Offline, and Free/$12 facts fit inside
the initial viewport. No horizontal overflow, page error, or third-party
request occurred on the home page. The warm-paper route notebook, blueprint
rules, orange route line, and oversized numbered junctions are distinct from a
generic SaaS template and match `.factory/design.md`.

## Copy audit

Counts use whitespace-separated words; code labels, URLs, prices, and hyphenated
terms count as one word. The tables include all landing and README sentences
and sentence-like headings. No text exceeds 22 words; no banned marketing
wording is present, terminology is inconsistent, or a heading lacks context. The
purchase action is the one action-label flag.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Browser extension for progressive low vision | 6 | Pass |
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
| Route 05 | 2 | Pass: diagram label |
| Open Expenses / New report / Monthly expenses / Review report / Send to manager | 10 | Pass: sample route labels |
| Live preview | 2 | Pass |
| Hear the current step and find its control | 8 | Pass |
| The reader announces one instruction, outlines the matching page control, and waits for you. | 14 | Pass — `guided-route` |
| Current route | 2 | Pass |
| Submit monthly expenses | 3 | Pass: sample route name |
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
| Buy supporter license | 3 | **F-6-1** |
| Use in Chrome, Edge, Brave, and similar browsers | 8 | Pass — `mv3-package` |
| Keep the route reader in your toolbar | 7 | Pass |
| Download the package, unzip it, then load the folder from the browser extensions page. | 14 | Pass — `mv3-package` |
| Download extension | 2 | Pass |
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
| Start for real discards edits and opens the extension download instructions. | 11 | Pass — `demo-isolated` |
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
| Requirements: Node.js 22 and npm 10. | 6 | Pass: developer context |
| Run all checks | 3 | Pass |
| `test:live-checkout` checks the production catalog entry and checkout redirect. | 9 | Pass: developer context |
| It does not submit a payment. | 6 | Pass: developer context |
| The build produces `dist/site/`, `dist/extension/`, and the packaged extension at `dist/site/downloads/app-flow-reader-chrome.zip`. | 11 | Pass: developer context |
| Deploy the website | 3 | Pass |
| Deploy `dist/site/` as the static artifact. | 6 | Pass: developer context |
| Azure Static Web Apps reads `staticwebapp.config.json` for known SPA rewrites, a real 404 catch-all, security headers, and cache policy. | 19 | Pass: developer context |
| Manifest V3 is used for the packaged extension. | 8 | Pass — `mv3-package` |
| Route state uses `chrome.storage.local`. | 4 | Pass: implementation context |
| The extension makes no background network request until a supporter token is restored. | 13 | Pass — `extension-network` |
| Verification then contacts only `api.sociobot.in`. | 5 | Pass — `extension-network` |
| Privacy and legal | 3 | Pass |
| Read `/privacy` and `/terms`. | 4 | Pass |
| Support: `support@sociobot.in`. | 2 | Pass |
| License | 1 | Pass |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

Terminology is consistent: **route** (saved task path), **step** (one
instruction), **recording**, **following**, **extension**, **demo**, and
**supporter license** retain one meaning each.

## Demo and sandbox verification

- The first-screen action opened `/?demo=1` in one click; `/demo` also worked
  as a direct deep link.
- Its first 390 px view already showed a realistic five-step monthly expense
  route, current Step 1 instruction, and Back/Next reader controls.
- The persistent banner read “Demo — Sample data. Nothing is saved.” and had
  **Reset demo** and **Start for real**. The latter went to the install section.
- Editing a note, selecting **Start for real**, and entering the demo again
  produced the untouched sample. Reset restored Step 1 and five steps.
- During this flow `localStorage`, `sessionStorage`, IndexedDB, and cookies
  were empty. All observed requests were same-origin. The code uses only the
  in-memory `demoFlow` state and resets it on demo entry/exit.
- After a first visit, the public demo reloaded offline and Next reached
  “Step 2 of 5”.

The demo is a working sandbox; no blocking demo or privacy finding remains.

## Claims verification

I made a separate clean clone at `/tmp/app-flow-reader-review6.BRU4p9`, ran
`npm ci`, and invoked every exact command in `.factory/claims.json`
independently. All 14 passed; extension-only mobile cases are intended skips.

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

The landing and README claims map to these entries. No unlisted product claim
or failing claim test was found.

## Earlier finding audit

Every retained review, polish record, verification record, and handoff was read
and checked against live behavior and current code. No earlier issue regressed.

| Earlier ID | Current verification | Result |
| --- | --- | --- |
| C1 | Named 3–10-step low-vision routes and reader playback are packaged and claim-tested. | Fixed |
| H1 | Burst recording is capped and ordered by `guided-route`. | Fixed |
| H2 | Accessible-name capture and password/value/screenshot exclusion pass `private-capture`. | Fixed |
| H3 | Live and local dark/light Axe have zero serious or critical violations. | Fixed |
| H4 | Fourteen atomic claims have individually passing tagged tests. | Fixed |
| M1 | Visible 390 px targets meet 44 px checks. | Fixed |
| M2 | A missing live URL returns designed HTTP 404 content. | Fixed |
| M3 | Packaged extension restores licenses and applies all three covers. | Fixed |
| Verification-2 H1 | Live checkout endpoint returns its intended hosted-checkout 303. | Fixed |
| Verification-4 M1 | Banner now says **Start for real** and opens the install flow. | Fixed |
| F-1-1 | Paid cover result is in the extension, not only the website. | Fixed |
| F-1-2 | Edit → Start for real → re-enter restores untouched sample data. | Fixed |
| F-1-3 | Listed claims and tests cover the public product promises. | Fixed |
| F-1-4 | Mobile first screen states Private, Offline, and Free/$12. | Fixed |
| F-1-5 | Exit action is now result-naming and opens install instructions. | Fixed |
| F-1-6 | Visitor wording consistently uses “dense workplace apps”. | Fixed |
| F-1-7 | README starts in plain user language. | Fixed |
| F-1-8 | Visitor storage wording says “on this device”. | Fixed |
| F-1-9 | README headings name the product or action. | Fixed |
| F-1-10 | Demo, Privacy, and Terms set route-specific title, description, canonical, OG, and Twitter metadata. | Fixed |
| F-1-11 | Demo action visibly says **Edit note**. | Fixed |
| F-2-1 | Installation instructions explain the browser extensions page before literal UI labels. | Fixed |
| F-2-2 | Static 404 has shared header navigation, skip link, and footer. | Fixed |
| F-2-3 | Static 404 has favicon, Apple icon, theme colors, and complete social metadata. | Fixed |
| F-3-1 | `extension-network` verifies no request until restore and only Sociobot verification afterward. | Fixed |
| F-5-1 | Hero kicker is the literal “Browser extension for progressive low vision”. | Fixed |

## Structure, accessibility, and links

- `/`, `/demo`, `/privacy`, and `/terms` returned 200; an unknown URL returned
  the designed 404 with HTTP 404. Deep links loaded correctly.
- Each live route had `lang=en`, one `h1`, one `main`, a route-specific title,
  meta description, canonical, OG/Twitter metadata, favicon, consistent header,
  footer, Privacy, and Terms links. Browser Back returned focus to the route
  heading; route changes announce through the polite live region.
- The internal links, ZIP, icons, social image, robots, sitemap, and Param
  Factory link returned 200. `mailto:` links are explicit; checkout returned
  the expected 303. F-6-1 is the missing destination disclosure, not a dead
  link.
- Live Axe in 390 px and desktop dark/reduced-motion contexts found zero serious
  or critical violations for home, demo, privacy, terms, and 404. The unknown
  URL emits the browser's expected top-level HTTP-404 resource message; no
  application script error occurred.
- The clean-clone `npm run test:a11y` passed: three tests passed and the
  extension mobile case was intentionally skipped.

## Missed leverage

No additional feature is required. The brief explicitly excludes cloud sync
and AI processing, while the product already includes the implied portable-data
path through Markdown and JSON export. No provider key or decorative AI feature
was found.

## What would make this perfect

Disclose the external checkout transition on the purchase action and add its
regression assertion. Then repeat the link crawl and cold mobile read. No other
release finding remains from this round.
