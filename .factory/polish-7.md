# Polish round 7 — App Flow Reader

Date: 29 August 2026 UTC

Reviewed base: `1a0fe9c9de3c2a44bd07d1ec765da59da7e95de8`

Tested product revision: `8ca48be619d7e9f9e7dddf683b0856d567fab6c6`

Production: <https://app-flow-reader.sociobot.in>

## Outcome

All findings from every `review-*.md` and `polish-*.md` are closed. The round-7
mobile demo now keeps both reader controls on one row, with the enabled Next
action fully inside the first 390 × 844 viewport. The production measurement
is `y=785.453`, `height=52`, bottom `837.453`.

While rechecking the earlier supporter-license work, the promised daily cache
behavior was found to be incomplete. The extension now rechecks stale stored
tokens, locks revoked covers, and renders the free reader before verification
finishes. That path has a packaged-extension regression test.

## Finding closure

Every row includes an executable test, visual evidence, and a production URL
or live check. Full machine-readable production data is in
[`live-audit.json`](evidence/polish-7/live-audit.json).

| Finding | Change made | Evidence |
| --- | --- | --- |
| C1 — wrong job/product | Retained the packaged 3–10-step low-vision route reader with named routes, announcements, highlights, and large controls. | `@claim:guided-route`; [live demo screenshot](evidence/polish-7/live-demo-desktop.png); [live demo](https://app-flow-reader.sociobot.in/?demo=1). |
| H1 — rapid clicks lost | Retained serialized mutations and the ordered ten-step capture cap. | `@claim:guided-route`; [live demo screenshot](evidence/polish-7/live-demo-desktop.png); live ZIP hash match at `/downloads/app-flow-reader-chrome.zip`. |
| H2 — accessible names and passwords | Retained accessible-name capture while excluding passwords, values, and screenshots. | `@claim:private-capture`; [privacy screenshot](evidence/polish-7/verify-privacy/screenshot-desktop.png); [live privacy](https://app-flow-reader.sociobot.in/privacy). |
| H3 — dark contrast | Retained the blueprint-paper contrast repair, keyboard focus, and reduced-motion behavior. | `@a11y every route passes axe in light, dark, and reduced-motion modes`; [home screenshot](evidence/polish-7/live-home-desktop.png); live Axe route matrix is empty. |
| H4 — incomplete claims | Maintained 15 atomic public claims, each with exactly one observable tagged test. | All 15 commands in [clean-clone verification](evidence/polish-7/clean-clone-verification.md); [home screenshot](evidence/polish-7/live-home-mobile390.png); [live home](https://app-flow-reader.sociobot.in/). |
| M1 — undersized demo controls | Kept all visible mobile actions at least 44 px and made the reader actions 52 px tall. | `390px layout has 44px targets and no horizontal overflow on home and demo`; [mobile demo](evidence/polish-7/live-demo-mobile390.png); live `bodyScrollWidth=390`. |
| M2 — soft 404 | Retained the designed Static Web Apps 404 with a real HTTP 404 response and return path. | `routes update titles, social metadata, history, heading focus, and deployment policy has a real 404 catch-all`; [404 screenshot](evidence/polish-7/live-404-desktop.png); live `/definitely-missing` returned 404. |
| M3 — paid result absent | Retained valid/revoked supporter-token handling and Blueprint, Graphite, and Sunrise covers inside the extension. | `@claim:supporter-license`; [home supporter section](evidence/polish-7/live-home-desktop.png); live tested ZIP hash matches production. |
| Verification-2 H1 — checkout unavailable | Retained the Sociobot checkout and hosted HTTPS redirect. | `npm run test:live-checkout`; [supporter section](evidence/polish-7/live-home-desktop.png); live checkout returned 303 to `checkout.dodopayments.com`. |
| Verification-4 M1 — demo exit wording | Retained **Start for real**, which discards the sample and opens extension download instructions. | `@claim:demo-isolated`; [mobile demo](evidence/polish-7/live-demo-mobile390.png); [live sample path](https://app-flow-reader.sociobot.in/?demo=1). |
| F-1-1 — supporter covers missing in extension | Retained token restore, three selectable covers, revoked-token lockout, and an always-free reader. Added stale-token revalidation coverage. | `@claim:supporter-license`; [supporter section](evidence/polish-7/live-home-desktop.png); live ZIP SHA-256 `9ab35b1…f3b0a`. |
| F-1-2 — demo changes survived exit | Kept sample state in memory only and reset it on entry, Reset demo, and Start for real. | `@claim:demo-isolated`; [mobile demo](evidence/polish-7/live-demo-mobile390.png); live edit → exit → re-entry found no note or durable storage. |
| F-1-3 — claims unlisted or weak | Retained the 15-entry inventory and strengthened supporter-license evidence for daily revalidation. | Every exact claim command passed; [home screenshot](evidence/polish-7/live-home-desktop.png); live audit passed privacy, offline, checkout, and package observations. |
| F-1-4 — missing first-screen facts | Kept literal Private, Offline, and Free/$12 facts in the first phone screen. | Landing skeleton and 390 px tests; [mobile home](evidence/polish-7/live-home-mobile390.png); [live home](https://app-flow-reader.sociobot.in/). |
| F-1-5 — ambiguous demo exit | Kept the result-naming **Start for real** action and its explicit discard/install description. | `@claim:demo-isolated`; [mobile demo](evidence/polish-7/live-demo-mobile390.png); [live sample path](https://app-flow-reader.sociobot.in/?demo=1). |
| F-1-6 — inconsistent app terminology | Retained **dense workplace apps** as the single visitor-facing term. | `npm run check:copy`; [mobile home](evidence/polish-7/live-home-mobile390.png); live home and footer cross-check. |
| F-1-7 — README platform jargon | Retained the plain audience/job opener and explains the extensions page before browser labels. | `npm run check:copy`; [install section](evidence/polish-7/live-home-desktop.png); [live install section](https://app-flow-reader.sociobot.in/#install-title). |
| F-1-8 — storage API in user copy | Retained user wording that routes stay on this device; implementation terms remain in developer details only. | `@claim:local-storage`; [privacy screenshot](evidence/polish-7/verify-privacy/screenshot-desktop.png); [live privacy](https://app-flow-reader.sociobot.in/privacy). |
| F-1-9 — context-free README headings | Retained headings that name App Flow Reader or the action. | `npm run check:copy`; [home screenshot](evidence/polish-7/live-home-desktop.png); live install copy cross-check. |
| F-1-10 — stale route metadata | Retained distinct title, description, canonical, Open Graph, and Twitter data plus history and heading focus. | Route metadata/history browser test; [demo screenshot](evidence/polish-7/live-demo-desktop.png); live `/demo`, `/privacy`, `/terms`, and 404 matrix. |
| F-1-11 — noun-only Note action | Retained visible **Edit note** labels with step-specific accessible names. | `@claim:demo-isolated` and keyboard-dialog test; [demo screenshot](evidence/polish-7/live-demo-desktop.png); [live demo](https://app-flow-reader.sociobot.in/demo). |
| F-2-1 — unexplained installation jargon | Retained explain-before-jargon copy for the browser extensions page. | Landing skeleton test and `npm run check:copy`; [install section](evidence/polish-7/live-home-desktop.png); [live install](https://app-flow-reader.sociobot.in/#install-title). |
| F-2-2 — 404 lacked shared navigation | Retained the wordmark, skip link, main navigation, and footer on the designed 404. | Routing/404 browser test; [404 screenshot](evidence/polish-7/live-404-desktop.png); live `/definitely-missing` audit. |
| F-2-3 — incomplete 404 metadata | Retained favicon, Apple icon, light/dark theme colors, canonical, and complete social metadata. | Routing/404 browser test; [404 screenshot](evidence/polish-7/live-404-desktop.png); live 404 metadata matrix. |
| F-3-1 — unlisted extension-network claim | Retained the atomic network claim: no request before restore, then only Sociobot token verification. | `@claim:extension-network`; [privacy screenshot](evidence/polish-7/verify-privacy/screenshot-desktop.png); live pages made zero cross-origin runtime requests. |
| F-5-1 — metaphorical hero kicker | Retained the literal **Browser extension for progressive low vision** kicker. | Landing skeleton regression test; [mobile home](evidence/polish-7/live-home-mobile390.png); [live home](https://app-flow-reader.sociobot.in/). |
| F-6-1 — undisclosed checkout destination | Retained **Buy supporter license (opens secure checkout)** and the popup’s new-tab disclosure. | `@claim:supporter-checkout`; [supporter section](evidence/polish-7/live-home-desktop.png); live endpoint returned HTTPS 303 to hosted Dodo checkout. |
| F-7-1 — enabled Next below first viewport | Put Back and Next side by side at 390 px, preserved 52 px targets, and added a hard viewport-bound regression assertion. | `390px demo keeps the enabled Next action inside the first viewport`; [local mobile](evidence/polish-7/local-demo-mobile390.png); [live mobile](evidence/polish-7/live-demo-mobile390.png); live bottom `837.453 ≤ 844`. |

Review 4 recorded no new finding. No severity was deferred.

## Verification

- Fresh clean clone: `npm ci`; every one of the 15 claim commands separately;
  `npm test`; `npm run test:a11y`; typecheck; lint; package and copy checks;
  audit; live checkout; build; ZIP integrity. All passed. Exact counts are in
  [clean-clone verification](evidence/polish-7/clean-clone-verification.md).
- Production audit: all routes have one H1/main, route-specific metadata,
  working history/focus, shared legal/footer links, no console errors, no
  cross-origin page requests, no broken navigational link, and no serious or
  critical Axe violation. The designed missing route returns HTTP 404.
- Demo: five realistic steps, banner, Reset demo, Start for real, edit discard,
  empty local/session/IndexedDB storage, offline reload, and offline advance to
  step 2 all passed at the live `?demo=1` URL.
- Performance: Lighthouse mobile scored 100 Performance, 100 Accessibility,
  100 Best Practices, and 100 SEO; LCP 0.8 s, CLS 0, TBT 0 ms. See
  [`lighthouse-live-mobile.json`](evidence/polish-7/lighthouse-live-mobile.json).
- `/opt/fleet/lib/verify-url.sh` passed live home, `?demo=1`, privacy, and terms.
- Catalog description is verb-first and 79 characters.

## Deployment

`/opt/fleet/lib/deploy-static.sh app-flow-reader dist/site` deployed the tested
artifact as Azure Static Web Apps deployment
`0d5252ab-6985-4772-8696-5b7d719d6434`. A cold browser check on the custom
domain passed after deployment. The live extension ZIP SHA-256 equals the local
tested artifact: `9ab35b1a212fc16e7e09f96e1413425f51ccae90aaed64bae6b14dc7063f3b0a`.
