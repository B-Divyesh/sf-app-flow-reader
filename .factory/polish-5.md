# Polish round 5 — App Flow Reader

Date: 29 August 2026 UTC  
Candidate repaired: `743b82f005008958a10204dffaa94efd40e07a19`  
Review commit: `d8dba01a25418af8d41ffcecf4f13422f9cd84dc`  
Repair commit: `63f9bee02c7da7fe600c2b4f6b8ed4de948fa64c`  
Production deployment: `8e35d82f-8d8e-47d8-a7d9-b0da30a1ab6e`

## Outcome

All current and historical findings are resolved. Round 5 replaces the only
remaining metaphorical first-screen line with the literal label “Browser
extension for progressive low vision”. The full prior implementation remains
intact: the packaged MV3 reader, isolated demo, claims, real routes, legal
pages, mobile treatment, and route-notebook identity were all re-tested.

## Finding closure

| Finding ID | Change made | Evidence |
| --- | --- | --- |
| C1 — wrong job/product | Rebuilt the artifact around named 3–10-step routes for people with progressive low vision, including guided playback and a real MV3 package. | `@claim:guided-route`; live ZIP hash match in `.factory/evidence/polish-5/live-audit.json`; [live demo](https://app-flow-reader.sociobot.in/?demo=1); `.factory/evidence/polish-5/live-demo-mobile.png`. |
| H1 — rapid clicks lost | Serialized background mutations and capped a recorded route at ten ordered steps. | `@claim:guided-route` records a 13-click burst as the first ten ordered steps; `.factory/evidence/polish-5/live-demo/screenshot-desktop.png`; matching package at [the live demo](https://app-flow-reader.sociobot.in/demo). |
| H2 — accessible names/password inspection | Capture now uses accessible names and excludes passwords, typed values, and screenshots. | `@claim:private-capture`; [live privacy](https://app-flow-reader.sociobot.in/privacy); `.factory/evidence/polish-5/live-privacy/screenshot-desktop.png`. |
| H3 — dark contrast | Repaired dark marker and boundary colors while preserving the blueprint-paper palette. | `@a11y every route passes axe in light, dark, and reduced-motion modes`; live Axe matrix is empty in `.factory/evidence/polish-5/live-audit.json`; `.factory/evidence/polish-5/live-home/screenshot-desktop.png`; [live home](https://app-flow-reader.sociobot.in/). |
| H4 — incomplete claims | Maintained 14 atomic claims with observable demo or packaged-extension tests. | Every exact `.factory/claims.json` test command passed separately from clean clone `63f9bee`; `.factory/evidence/polish-5/live-home/screenshot-desktop.png`; [live home and demo](https://app-flow-reader.sociobot.in/?demo=1). |
| M1 — undersized demo controls | Demo banner actions remain at least 44 px; reader Back and Next remain 52 px. | `390px layout has 44px targets and no horizontal overflow on home and demo`; live `smallTargets: []`; `.factory/evidence/polish-5/live-demo-mobile.png`; [live demo](https://app-flow-reader.sociobot.in/demo). |
| M2 — soft 404 | Static Web Apps rewrites missing responses to the designed page while preserving HTTP 404. | `routes update titles, social metadata, history, heading focus, and deployment policy has a real 404 catch-all`; live `/definitely-missing` returned 404; `.factory/evidence/polish-5/live-404-desktop.png`. |
| M3 — paid feature absent | The extension restores and verifies a supporter token, persists Blueprint, Graphite, or Sunrise, and leaves the reader free. | `@claim:supporter-license`; `@claim:license-return`; `.factory/evidence/polish-5/live-home/screenshot-desktop.png`; live checkout returned 303 from the [supporter section](https://app-flow-reader.sociobot.in/#supporter-title). |
| Verification-2 H1 — checkout unavailable | Registered the Sociobot product checkout; no direct provider integration was added. | `npm run test:live-checkout`; `.factory/evidence/polish-5/live-home/screenshot-desktop.png`; live [checkout URL](https://api.sociobot.in/api/v1/products/app-flow-reader/checkout) returned 303. |
| F-1-1 — paid result absent in extension | Added valid/revoked license handling and all three cover selectors to the packaged extension. | `@claim:supporter-license`; `@claim:license-return`; `.factory/evidence/polish-5/live-home/screenshot-desktop.png`; matching ZIP downloaded from [live](https://app-flow-reader.sociobot.in/downloads/app-flow-reader-chrome.zip). |
| F-1-2 — demo edit survives exit | Demo state resets on entry, Reset demo, and Leave demo; it never enters durable storage. | `@claim:demo-isolated`; live edit → leave → re-enter produced zero retained notes and empty local/session/IndexedDB; `.factory/evidence/polish-5/live-demo-mobile.png`; [live demo](https://app-flow-reader.sociobot.in/?demo=1). |
| F-1-3 — unlisted or weak claims | Added package, page-boundary, license-return, and network claims; strengthened the guided, supporter, and isolation assertions. Removed untestable refund copy. | All 14 `.factory/claims.json` test commands passed independently; `.factory/evidence/polish-5/live-home/screenshot-desktop.png`; live ZIP and checkout checks at [the product](https://app-flow-reader.sociobot.in/). |
| F-1-4 — first screen lacks offline/price | First screen states Private, Offline, and Free with the $12 cover price. | `landing page names the low-vision job and keeps the product skeleton`; `390px layout has 44px targets and no horizontal overflow on home and demo`; `.factory/evidence/polish-5/live-home-mobile.png`; [live home](https://app-flow-reader.sociobot.in/). |
| F-1-5 — ambiguous Start for real | Renamed the action Leave demo and made it discard edits. | `@claim:demo-isolated`; live banner check at [the sample path](https://app-flow-reader.sociobot.in/?demo=1); `.factory/evidence/polish-5/live-demo-mobile.png`. |
| F-1-6 — inconsistent app terminology | Standardized visitor copy on “dense workplace apps”. | `npm run check:copy`; `.factory/evidence/polish-5/live-home/screenshot-mobile.png`; [live home](https://app-flow-reader.sociobot.in/). |
| F-1-7 — README opens with jargon | README starts with the audience and job; platform detail appears under development. | `npm run check:copy`; `.factory/evidence/polish-5/live-home/screenshot-mobile.png`; equivalent plain install copy on [live home](https://app-flow-reader.sociobot.in/). |
| F-1-8 — storage API in visitor copy | Visitor copy says routes stay on this device; API wording remains only in development details. | `@claim:local-storage`; `npm run check:copy`; `.factory/evidence/polish-5/live-home-mobile.png`; [live home](https://app-flow-reader.sociobot.in/). |
| F-1-9 — context-free README headings | Headings now identify App Flow Reader or the action. | `npm run check:copy`; `.factory/evidence/polish-5/live-home/screenshot-desktop.png`; live product cross-check at [home](https://app-flow-reader.sociobot.in/). |
| F-1-10 — stale social metadata | SPA navigation updates title, description, canonical, Open Graph, and Twitter data per route. | `routes update titles, social metadata, history, heading focus, and deployment policy has a real 404 catch-all`; `.factory/evidence/polish-5/live-privacy/screenshot-desktop.png`; [Demo](https://app-flow-reader.sociobot.in/demo), [Privacy](https://app-flow-reader.sociobot.in/privacy), and [Terms](https://app-flow-reader.sociobot.in/terms). |
| F-1-11 — Note is not a result | Visible controls say Edit note and retain step-specific accessible names. | `@claim:demo-isolated`; `keyboard navigation manages route focus and the note dialog`; `.factory/evidence/polish-5/live-demo/screenshot-mobile.png`; [live demo](https://app-flow-reader.sociobot.in/demo). |
| F-2-1 — unexplained install jargon | Landing and README explain the browser extensions page before literal Developer mode and Load unpacked labels. | `landing page names the low-vision job and keeps the product skeleton`; `npm run check:copy`; `.factory/evidence/polish-5/live-home/screenshot-mobile.png`; [live install section](https://app-flow-reader.sociobot.in/#install-title). |
| F-2-2 — 404 missing shared navigation | The 404 uses the shared wordmark, skip link, Demo/How it works/Privacy/Download navigation, and footer. | `routes update titles, social metadata, history, heading focus, and deployment policy has a real 404 catch-all`; live navigation array in `live-audit.json`; `.factory/evidence/polish-5/live-404-desktop.png`; [live missing URL](https://app-flow-reader.sociobot.in/definitely-missing). |
| F-2-3 — incomplete 404 metadata | Added favicon, Apple icon, two theme colors, canonical, and complete Open Graph/Twitter data. | `routes update titles, social metadata, history, heading focus, and deployment policy has a real 404 catch-all`; `.factory/evidence/polish-5/live-404-desktop.png`; [live missing URL](https://app-flow-reader.sociobot.in/definitely-missing). |
| F-3-1 — unlisted network promise | Added the atomic `extension-network` claim and fresh-profile request interception. | `@claim:extension-network`; `.factory/evidence/polish-5/live-privacy/screenshot-desktop.png`; network wording checked at [live privacy](https://app-flow-reader.sociobot.in/privacy). |
| F-5-1 — metaphorical hero slogan | Replaced “A steady path through dense workplace apps” with “Browser extension for progressive low vision”; added an explicit regression assertion and updated the copy audit. | `landing page names the low-vision job and keeps the product skeleton`; live audit records the new kicker and rejected-slogan count 0; `.factory/evidence/polish-5/live-home-mobile.png`; [live home](https://app-flow-reader.sociobot.in/). |

Review 4 contained zero findings. No earlier finding regressed.

## Clean-clone and production evidence

- Clean clone: `/tmp/app-flow-reader-polish5-clean.UPh5r6`, commit `63f9bee`;
  `npm ci` reported zero vulnerabilities.
- Each exact command for `guided-route`, `private-capture`, `local-storage`,
  `extension-network`, `route-controls`, `export-files`, `no-account`,
  `demo-isolated`, `offline-reload`, `no-tracking`, `supporter-license`,
  `browser-page-boundaries`, `mv3-package`, and `license-return` passed.
- `npm test`: 6 unit tests and 32 browser tests passed; 10 mobile-extension
  project skips were expected. `npm run test:a11y`: 3 passed and one expected
  mobile-extension skip.
- Typecheck, lint, package contract, copy audit, high-severity dependency audit,
  build, ZIP integrity, and checkout smoke all passed.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100, LCP 0.9 s, CLS 0, TBT 0 ms. Evidence:
  `.factory/evidence/polish-5/lighthouse-live-mobile.json`.
- Initial site assets are 19.34 kB JavaScript raw / 6.72 kB gzip and 17.57 kB
  CSS raw / 4.65 kB gzip. There are no font downloads.
- `/opt/fleet/lib/verify-url.sh` passed home, direct demo, privacy, and terms;
  evidence is under `.factory/evidence/polish-5/live-*`.

## Deployment and cold live check

The work-order build command `npm ci && npm test && npm run build:site` passed,
then `/opt/fleet/lib/deploy-static.sh app-flow-reader dist/site` deployed the
static artifact. A fresh post-deploy context verified the literal first-screen
copy, all three facts above the fold, one-click `?demo=1`, reset/leave
isolation, empty durable storage, same-origin traffic, offline reload and Next,
route metadata, navigation focus and browser Back, legal links, light/dark Axe,
real HTTP 404, checkout redirect, and live/local ZIP identity. No finding of
any severity remains.
