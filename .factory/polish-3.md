# Polish round 3 — App Flow Reader

Date: 28 August 2026 UTC  
Repair source: `f46d49c` and `0189b28`  
Production deployment: `9b4a1252-25e3-495d-9293-ec07bdf80475`

All findings in `.factory/review-1.md`, `.factory/review-2.md`, and
`.factory/review-3.md` were rechecked from a clean clone and on the deployed
custom domain. The detailed live audit is
`.factory/evidence/polish-3/live-audit.json`; cold-route screenshots are in
`.factory/evidence/polish-3/live-{home,demo,privacy,terms}/`.

## Finding closure

| Finding ID | Change made | Evidence |
| --- | --- | --- |
| F-1-1 / earlier M3 | The packaged extension restores and verifies a supporter token, persists its selected Blueprint, Graphite, or Sunrise cover in `chrome.storage.local`, rejects revoked tokens, and never gates route reading. | `@claim:supporter-license`; `@claim:license-return`; clean-claim transcript; live tested-ZIP SHA-256 match in `live-audit.json`. |
| F-1-2 | `/demo` and `?demo=1` initialise a fresh in-memory sample; Reset demo and Leave demo discard edits before re-entry. | `@claim:demo-isolated`; `live-demo/screenshot-mobile.png`; live edit → leave → re-enter evidence in `live-audit.json`. |
| F-1-3 / earlier H4 | The claim inventory is atomic and now contains 14 observable claims, each with a tagged test executed separately from a clean clone. Untestable refund wording remains removed. | `.factory/claims.json`; `clean-claims.log`; `npm run test:claims`. |
| F-1-4 | The first screen states Private, Offline, and Free/$12 as literal facts. | landing test; `live-home/screenshot-mobile.png`; mobile first-screen values in `live-audit.json`. |
| F-1-5 | The sandbox exit action is **Leave demo**, which says what it does and resets sample memory before returning home. | `@claim:demo-isolated`; `live-demo/screenshot-desktop.png`; <https://app-flow-reader.sociobot.in/?demo=1>. |
| F-1-6 | Visitor-facing product copy consistently says “dense workplace apps.” | `npm run check:copy`; `.factory/copy-audit.md`; live home cold audit. |
| F-1-7 / F-1-8 | README opens in plain language, describes routes as staying on the device, and reserves implementation jargon for development details. | `README.md`; `npm run check:copy`; `@claim:local-storage`. |
| F-1-9 | README headings name App Flow Reader or the action they cover. | `README.md`; `npm run check:copy`. |
| F-1-10 | SPA route changes set route-specific title, description, canonical, Open Graph, and Twitter data. | route metadata browser test; `live-audit.json` route matrix; `/demo`, `/privacy`, and `/terms` live checks. |
| F-1-11 | Sample-step notes visibly use **Edit note**, with a step-specific accessible name. | `@claim:demo-isolated`; `live-demo/screenshot-mobile.png`. |
| Earlier C1 | The actual MV3 route reader records named 3–10 step routes and plays them back with current-step instruction, visible target, and large controls. | `@claim:guided-route`; packaged extension test in `clean-claims.log`. |
| Earlier H1 | Background mutations remain serialised; burst recording is capped and retained in order. | `@claim:guided-route`; `tests/e2e/extension.spec.ts`. |
| Earlier H2 | Capture uses accessible names, excludes passwords and typed values, and never stores screenshots. | `@claim:private-capture`; packaged extension test in `clean-claims.log`. |
| Earlier H3 | Light/dark/reduced-motion Axe coverage includes all web routes and the extension popup. | `npm run test:a11y`; light/dark live Axe matrix in `live-audit.json`. |
| Earlier M1 | 390 px demo and navigation targets are at least 44 px, with no horizontal overflow. | 390 px browser test; `live-demo/screenshot-mobile.png`; `live-audit.json`. |
| Earlier M2 | Static Web Apps serves the designed, navigable `404.html` with HTTP 404. | route/deployment-policy test; live `/definitely-missing` result in `live-audit.json`. |
| Verification-2 H1 | The supporter checkout remains registered and redirects to hosted checkout. | `npm run test:live-checkout`; clean full-suite transcript. |
| F-2-1 | Landing and README explain the browser extensions page before retaining literal browser control labels. | landing browser assertion; `README.md`; `npm run check:copy`. |
| F-2-2 | The static 404 retains the wordmark, skip link, Demo/How it works/Privacy/Download navigation, and footer. | routing test; live 404 navigation in `live-audit.json`. |
| F-2-3 | The static 404 has both theme colors, favicon, Apple touch icon, canonical, and complete OG/Twitter image metadata. | routing test; live 404 metadata in `live-audit.json`. |
| F-3-1 | Added `extension-network`: a fresh packaged profile observes zero startup/recording requests, then exactly one fixture-backed verification GET only after Restore license. README and Privacy now make the same testable privacy promise. | `@claim:extension-network`; `clean-claims.log`; live ZIP hash and current Privacy copy assertion in `live-audit.json`. |

## Production evidence

- Home: `.factory/evidence/polish-3/live-home/screenshot-mobile.png`
- Direct demo: `.factory/evidence/polish-3/live-demo/screenshot-mobile.png`
- Privacy: `.factory/evidence/polish-3/live-privacy/screenshot-desktop.png`
- Terms: `.factory/evidence/polish-3/live-terms/screenshot-desktop.png`
- Mobile Lighthouse: `.factory/evidence/polish-3/lighthouse-mobile.json`

The deployed custom domain was cold-opened after deployment, rather than only
checking the Azure default hostname. The audit confirms no unresolved finding.
