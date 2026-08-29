# Polish round 6 — App Flow Reader

Date: 29 August 2026 UTC
Repair commit: `9bbf7944c516cdb89b406b45b47b192627e372bd`

## Finding closure

All retained adversarial-review findings are closed. The fresh evidence is in
`.factory/evidence/polish-6/`; the deployed product was checked cold at
<https://app-flow-reader.sociobot.in> and <https://app-flow-reader.sociobot.in/?demo=1>.

| Finding ID | Change made | Evidence: test, screenshot, live check |
| --- | --- | --- |
| C1 | Kept the packaged low-vision route reader: named 3–10-step routes, current-step announcements, highlights, and large reader controls. | Clean-clone `@claim:guided-route`; [demo desktop](evidence/polish-6/live-demo-desktop.png); live `/demo` has five steps and a reader. |
| H1 | Kept serialized, capped burst capture so rapid clicks remain ordered. | Clean-clone `@claim:guided-route`; live package download at `/downloads/app-flow-reader-chrome.zip`. |
| H2 | Kept accessible-name-first capture and password/value/screenshot exclusion. | Clean-clone `@claim:private-capture`; live [privacy](https://app-flow-reader.sociobot.in/privacy). |
| H3 | Kept the dark contrast repair and reduced-motion behavior. | `@a11y every route passes axe in light, dark, and reduced-motion modes`; `live-audit.json` has no serious/critical violations; live `/demo`. |
| H4 | Retained atomic, observable claims and added the checkout-disclosure claim. | All 15 clean-clone commands passed; `/tmp/app-flow-reader-polish6-claims-status.cCtHmx/all-claims.pass`; `.factory/claims.json`. |
| M1 | Kept 44 px controls, mobile stacking, no overflow, and first-screen facts above the fold. | `390px layout has 44px targets and no horizontal overflow on home and demo`; [mobile home](evidence/polish-6/live-home-mobile390.png); live `/`. |
| M2 | Kept a designed, HTTP 404 route with a return path. | `live-audit.json` records status 404, one main, and the shared navigation; live `/definitely-missing`. |
| M3 | Kept extension-native supporter-token restore and Blueprint, Graphite, and Sunrise covers. | Clean-clone `@claim:supporter-license`; live package `/downloads/app-flow-reader-chrome.zip`. |
| Verification-2 H1 | Kept the registered Sociobot checkout endpoint and hosted redirect. | `npm run test:live-checkout`; `live-audit.json` records HTTP 303 to `checkout.dodopayments.com`; live checkout link. |
| Verification-4 M1 | Kept **Start for real** as the honest exit to extension-install instructions. | Clean-clone `@claim:demo-isolated`; [demo mobile](evidence/polish-6/live-demo-mobile390.png); live `?demo=1`. |
| F-1-1 | Kept paid covers inside the packaged extension, not merely on the landing page. | Clean-clone `@claim:supporter-license`; live extension ZIP. |
| F-1-2 | Kept memory-only demo reset on entry and exit. | Clean-clone `@claim:demo-isolated`; `live-audit.json` records no temporary note on re-entry and empty durable storage; live `?demo=1`. |
| F-1-3 | Kept claim coverage for all public product promises and added `supporter-checkout`. | Every `.factory/claims.json` command passed from the clean clone; live `/`. |
| F-1-4 | Kept literal Private, Offline, and Free/$12 first-screen facts. | `390px layout has 44px targets and no horizontal overflow on home and demo`; [mobile home](evidence/polish-6/live-home-mobile390.png); live `/`. |
| F-1-5 | Kept the result-naming **Start for real** exit to the install section. | Clean-clone `@claim:demo-isolated`; `live-audit.json`; live `?demo=1`. |
| F-1-6 | Kept **dense workplace apps** as the single visitor-facing term. | `npm run check:copy`; [desktop home](evidence/polish-6/live-home-desktop.png); live `/`. |
| F-1-7 | Kept the plain-language README opener and explained install instructions. | `npm run check:copy`; [README](../README.md); live install section `/#install-title`. |
| F-1-8 | Kept user copy that says routes stay on this device. | Clean-clone `@claim:local-storage`; live [privacy](https://app-flow-reader.sociobot.in/privacy). |
| F-1-9 | Kept README headings that identify the product or action out of context. | `npm run check:copy`; [README](../README.md). |
| F-1-10 | Kept real route metadata, history, title changes, and heading focus. | `routes update titles, social metadata, history, heading focus, and deployment policy has a real 404 catch-all`; `live-audit.json`; live `/demo`, `/privacy`, `/terms`. |
| F-1-11 | Kept the visible **Edit note** action. | Clean-clone `@claim:demo-isolated`; [demo desktop](evidence/polish-6/live-demo-desktop.png); live `?demo=1`. |
| F-2-1 | Kept explain-before-jargon install copy for the browser extensions page. | `npm run check:copy`; [README](../README.md); live `/#install-title`. |
| F-2-2 | Kept the shared wordmark, skip link, navigation, and footer on the static 404. | `live-audit.json` `notFound`; live `/definitely-missing`. |
| F-2-3 | Kept static-404 title, icon, theme, canonical, and social metadata. | routing regression test; live `/definitely-missing`; `verify-home/verify.json` confirms baseline document checks. |
| F-3-1 | Kept the atomic extension-network claim and fresh-profile request test. | Clean-clone `@claim:extension-network`; live [privacy](https://app-flow-reader.sociobot.in/privacy). |
| F-5-1 | Kept the literal **Browser extension for progressive low vision** kicker. | landing-skeleton regression test; [mobile home](evidence/polish-6/live-home-mobile390.png); live `/`. |
| F-6-1 | Changed both purchase actions to disclose the outcome before navigation: the landing CTA now reads **Buy supporter license (opens secure checkout)**; the popup additionally says it opens in a new tab. Added the atomic `supporter-checkout` claim, browser redirect test, README disclosure, and copy-audit rows. | Clean-clone `@claim:supporter-checkout`; [desktop home](evidence/polish-6/live-home-desktop.png); `live-audit.json` records the label, HTTPS 303, and Dodo destination; live `/`. |

## Verification

- Clean clone: `/tmp/app-flow-reader-polish6-clean.ZfhGdo`, from repair commit
  `9bbf7944c516cdb89b406b45b47b192627e372bd`; `npm ci` completed with zero
  vulnerabilities.
- All 15 exact `.factory/claims.json` commands passed independently. The
  durable pass markers are in
  `/tmp/app-flow-reader-polish6-claims-status.cCtHmx/`, including
  `all-claims.pass`.
- Full local suite passed before deployment: `npm test` (6 unit + 44 browser
  matrix entries, expected MV3/mobile skips only), `npm run test:a11y`,
  `npm run typecheck`, `npm run lint`, `npm run check:copy`,
  `npm run check:package`, `npm audit --audit-level=high`,
  `npm run test:live-checkout`, `npm run build`, and ZIP integrity.
- The production build is 19.57 kB raw / 6.79 kB gzip JavaScript and 17.65 kB
  raw / 4.68 kB gzip CSS. It has no font downloads.
- `/opt/fleet/lib/verify-url.sh` passed live home, direct `?demo=1`, privacy,
  and terms. See `evidence/polish-6/verify-*/verify.json`.
- Live Playwright Axe found zero serious or critical issues in dark,
  reduced-motion mobile contexts for home, demo, privacy, terms, and the real
  HTTP 404. The Axe CLI was attempted, but this worker image has no system
  Chrome binary; the repository's Playwright Axe integration is the successful
  browser-based accessibility evidence.
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; LCP 0.8 s, CLS 0, TBT 0 ms. See
  `evidence/polish-6/lighthouse-live-mobile.json`.

## Deployment

The work-order command deployed `dist/site` with
`/opt/fleet/lib/deploy-static.sh app-flow-reader dist/site`. Deployment
`fb0f76b4-585d-45d8-bf2d-10f107097e64` succeeded on the configured Static Web
App, and the production custom domain returned HTTPS 200 afterwards.
