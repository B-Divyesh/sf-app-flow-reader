# Handoff — repair 2

Date: 28 August 2026 UTC

Work order: `app-flow-reader-repair-2`

Verifier report: `98b8a791684a7f8e3ad219e1d82ca76189129573`

Failed candidate: `5e6e9632d83056f3b64b67fb0b79281fe7697285`

Repair commits: `682f9a0`, `f188383`, `dcbf2a4`, `5015232`

Live URL: <https://app-flow-reader.sociobot.in>

## Outcome

The repository and live static deployment now implement the researched low-vision job. A user can record several named 3–10-step routes, choose one, hear the current instruction, see a visible page target outlined, and move with large Back and Next controls. The recorder/export behavior that passed verification remains available.

## Verifier finding repairs

- **C1 — wrong product:** restored the low-vision audience and job in `.factory/brief.json`; replaced the single recorder with a named route library and 3–10-step constraint; added popup and injected-page following modes, current-step live announcements, target highlighting, and Back/Next controls. The demo now exercises the same job with a monthly expense route.
- **H1 — burst loss:** all background mutations run through one promise queue. A regression dispatches 13 clicks without waiting and asserts the retained route contains its start plus the first nine clicks in order.
- **H2 — accessible names and passwords:** capture resolves `aria-labelledby`, `aria-label`, associated labels, and image alternatives before visible text heuristics. `input[type=password]` and explicitly private regions are rejected before any label or anchor is read. The packaged-extension regression stores `Save report` and proves `Work password` never appears.
- **H3 — dark contrast:** the dark section marker is now white on `#244f80`; the boundary band is white on `#173d67`. Axe runs `/`, `/demo`, `/privacy`, `/terms`, the not-found view, and the real extension popup in light and dark modes.
- **H4 — claims:** `.factory/claims.json` inventories ten public promises. Every entry has one exact `@claim:<id>` test. The storage and no-account tests now perform real product actions.
- **M1 — mobile targets:** removed the 34 px demo override. Demo controls are at least 44 px, reader controls are 52 px, and desktop/mobile navigation links also meet 44 px. The exact 390 × 844 scan reports no small targets or overflow.
- **M2 — soft 404:** known SPA routes use explicit 200 rewrites. Azure's 404 response override serves the designed not-found shell while preserving HTTP 404. Live `/definitely-missing` returns 404 with title `Page not found — App Flow Reader`.
- **M3 — purchase model:** added a $12 one-time supporter license for three cosmetic notebook covers. Core reading, privacy, exports, and accessibility remain free. Return-token storage, URL stripping, daily verification caching, offline optimistic state, invalid/revoked handling, restore input, checkout link, privacy, and terms are implemented. The CSP permits only the Sociobot verification origin in addition to self.

## Clean verification

The final clean command sequence was:

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run test:claims
npm run check:package
npm run check:copy
npm audit --audit-level=high
npm run build
unzip -t dist/site/downloads/app-flow-reader-chrome.zip
```

Results:

- `npm ci`: 171 packages installed; 0 vulnerabilities.
- Vitest: 6 passed.
- Playwright full matrix: 29 passed; 7 expected skips for desktop-only unpacked-extension cases.
- Claim matrix: 16 passed; 4 expected mobile skips for unpacked-extension cases. All ten claim IDs ran.
- Typecheck and lint: passed.
- Package and copy contracts: passed; lockfile v3 with 222 package records.
- Production build and ZIP integrity: passed. Site JS is 20,797 bytes raw / 7.22 kB gzip; CSS is 17,680 bytes raw / 4.70 kB gzip; extension ZIP is 15,037 bytes.
- Local and live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; live FCP 0.8 s, LCP 0.9 s, TBT 20 ms, CLS 0.
- Factory URL verifier on live `/` and `/demo`: correct title, `lang=en`, one `h1`, main landmark, no missing alt, no unlabeled buttons, and no console or page errors.
- Live browser QA at desktop and 390 × 844: Step 2 announcement emitted, exactly one current marker, five steps, no overflow, no sub-44 px targets, no external demo requests, no console errors, and offline reload retained all steps.
- Live axe: no serious or critical findings on the landing page in light or dark reduced-motion modes at desktop or 390 px. The full local matrix covers all routes and the popup.
- Keyboard: skip link, route navigation, demo Back/Next, popup controls, and note dialog focus/return passed. The reader uses native buttons and assertive/polite live regions.
- Privacy: demo storage remained empty across localStorage, sessionStorage, and IndexedDB; public pages made no third-party requests; extension recording made no external requests.
- Update/offline: service worker v2 activated; `/demo` reloaded and advanced offline after priming.
- Response policy: known routes return 200; unknown routes return 404; CSP, HSTS, `nosniff`, strict-origin referrer policy, frame denial, and camera/microphone/geolocation denial are live.

Evidence is in `.factory/evidence/repair-2/`. The reusable live harness is `.factory/evidence/repair-live-qa.mjs`.

## Deployment identity

Azure Static Web Apps deployment `af9e790f-49bf-4a0a-bf44-7d3554219912` succeeded in the existing `sf-app-flow-reader` app in `centralus`. DNS and managed TLS are ready.

| Artifact | Local/live SHA-256 |
| --- | --- |
| `index.html` | `38088a5c6e4e43c8cbaed3a7acfcbc734fc0119b833dcd4ce2974c38b477a786` |
| `sw.js` | `ce3981be73c688b4208b60e42dd54e4065558d6ddd639c2cdf185d55928fb7a3` |
| extension ZIP | `1a4ba4f9b98719dddbec20cda9c44f4d847446132efedf6ecc936b53ad8f2c21` |

## Remaining external checks

- This Linux worker cannot run NVDA on Windows. The same path was checked through Chromium's accessibility tree behavior, live regions, keyboard operation, and axe in both themes. A release operator should still perform the requested short NVDA/Windows announcement smoke test.
- The repository implements the required Sociobot checkout and verification contract, but `GET https://api.sociobot.in/api/v1/products/app-flow-reader/checkout` currently returns 404 because the factory billing product is not enabled. Repository rules prohibit changing billing infrastructure here. The factory must enable the registered product before selling the optional cover license; the free reader is unaffected.
