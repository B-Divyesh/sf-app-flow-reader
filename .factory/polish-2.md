# Polish round 2 — App Flow Reader

Date: 28 August 2026 UTC

Repair commit: `89feeab25c3e4163af4353b8474694e2b7aeeb7b`

## Finding closure

| Finding ID | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Replaced unexplained Chromium/unpacked wording with “Use in Chrome, Edge, Brave, and similar browsers” and an explained browser-extensions-page sequence. | `tests/e2e/site.spec.ts` landing assertion; `README.md`; `.factory/copy-audit.md`; clean suite log. |
| F-2-2 | Rebuilt the direct static 404 around the shared wordmark, four-link navigation, skip link, footer, and original lost-path illustration. | routing test; live `https://app-flow-reader.sociobot.in/definitely-missing`; `evidence/polish-2/live-404-{desktop,mobile390}.png`. |
| F-2-3 | Added light/dark theme-color, Apple touch icon, Twitter image, and OG type to static 404 metadata. | routing test; `evidence/polish-2/live-404.json`. |
| F-1-1 / earlier M3 | Retained extension-native valid/revoked license restore and Blueprint, Graphite, and Sunrise covers; rechecked checkout live. | `@claim:supporter-license`; `@claim:license-return`; `npm run test:live-checkout`. |
| F-1-2 | Retained memory-only demo reset on entry and leave; rechecked edit → leave → re-enter. | `@claim:demo-isolated`; live browser QA. |
| F-1-3 / earlier H4 | Retained 13 atomic claims and strengthened the package claim wording to cover current public install copy. | `.factory/claims.json`; all commands in `evidence/polish-2/clean-claims.log`. |
| F-1-4 | Retained first-screen Private, Offline, and Free/$12 facts. | landing browser test; `evidence/polish-2/live-home/screenshot-mobile.png`. |
| F-1-5 | Retained result-naming **Leave demo** action that resets before returning home. | `@claim:demo-isolated`; live demo screenshot. |
| F-1-6 | Retained “dense workplace apps” terminology. | `.factory/copy-audit.md`; `npm run check:copy`. |
| F-1-7 / F-1-8 | Retained plain README opener and device-storage language; completed the remaining install-jargon rewrite. | `README.md`; copy audit; F-2-1 browser assertion. |
| F-1-9 | Retained out-of-context README headings. | `README.md`; `npm run check:copy`. |
| F-1-10 | Retained route-specific SPA metadata; static 404 now has a complete equivalent. | routing test; live 404 JSON. |
| F-1-11 | Retained visible **Edit note** label. | demo-edit test; `@claim:demo-isolated`. |
| Earlier C1 / H1 / H2 | Retained low-vision route reader, serialized capture, accessible-name capture, and password exclusion. | `@claim:guided-route`; `@claim:private-capture`. |
| Earlier H3 / M1 | Added the direct static 404 to dark/reduced-motion Axe and 390 px target checks. | `npm run test:a11y`; `evidence/polish-2/live-404.json`. |
| Earlier M2 | Retained real HTTP 404 rewrite and completed its full navigation/metadata skeleton. | routing test; live 404 HTTP status and screenshots. |
| Verification-2 H1 | Retained registered supporter checkout. | `npm run test:live-checkout` passed live. |

## Verification

- Clean clone: `/tmp/app-flow-reader-clean.ZBOwhg`; `npm ci` passed.
- All 13 exact claim commands passed individually. Output: `evidence/polish-2/clean-claims.log`.
- Full clean-clone matrix passed: `npm test`, `npm run test:a11y`, typecheck, lint, copy audit, package check, high-severity audit, production build, and ZIP integrity. Output: `evidence/polish-2/clean-full-suite.log`.
- Live cold verification passed on `/`, `/?demo=1`, `/privacy`, and `/terms`: one h1 and main, `lang=en`, valid route title, no console errors, no missing image alt text, and no unlabeled buttons. Evidence: `evidence/polish-2/live-*/verify.json`.
- Live desktop and 390 px demo has five sample steps, current-step announcement, no horizontal overflow, no undersized targets, no cross-origin requests, no serious/critical Axe findings, and offline reload after priming. Evidence: `evidence/polish-2/live-browser-qa.json`.
- Live static 404 returns HTTP 404 with full shared navigation, metadata, 44 px targets, no overflow, and zero serious/critical dark-mode Axe findings. Evidence: `evidence/polish-2/live-404.json` and `live-404-{desktop,mobile390}.png`.
- Mobile Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; LCP 793 ms, CLS 0, TBT 0. Evidence: `evidence/polish-2/lighthouse-mobile.json`.

## Deployment

Built `dist/site` with the work-order command and deployed it to the `sf-app-flow-reader` production Static Web App. The deployment endpoint was `https://orange-mushroom-023b54510.7.azurestaticapps.net`; the custom domain re-check passed at <https://app-flow-reader.sociobot.in>.
