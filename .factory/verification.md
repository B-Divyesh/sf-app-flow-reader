# Independent product verification — FAIL

Date: 28 August 2026 UTC

Candidate: `5e6e9632d83056f3b64b67fb0b79281fe7697285`

Branch: `main`

Live URL: `https://app-flow-reader.sociobot.in`

Acceptance contract: the original researched brief supplied in work order `app-flow-reader-verify-1`, plus the factory product contract and attached QA skills.

## Verdict

**FAIL — do not release this candidate.**

The deployment is healthy and byte-for-byte matches the candidate, and the candidate's own recorder/export tests pass. The release fails because it implements a different product from the researched opportunity. It records a workflow for product teams; it does not help a low-vision worker follow a saved workflow. It has no collection of named 3–10-step routes, playback mode, current-step or visible-anchor announcement, or large high-contrast Next/Back controls. Fresh testing also found click-loss under burst input, failure to use accessible names, password-field inspection, dark-theme contrast failures, incomplete claims coverage, and undersized mobile demo controls.

## Mandatory first-read and demo gate

Cold read of the live first screen at desktop and 390 px:

- What it does: “Record browser tasks as clear steps.”
- Who it says it is for: “product teams who need to explain a web app.”
- First click: “Try it with sample data.”
- Result: the literal clarity and one-click-demo mechanics pass. `/demo` immediately shows five realistic sample steps and the persistent “Demo — Sample data. Nothing is saved” banner with Reset and Start for real.
- Acceptance failure: the named audience and demonstrated job are not the researched audience or job. The contract calls for knowledge workers with progressive low vision following their own reliable route through dense applications.

The candidate replaced that supplied research with a reconstructed brief for product managers, QA testers, support writers, and designers (`.factory/brief.json:5-23`). This replacement is not an acceptable scope decision.

## Claims gate

`.factory/claims.json` exists. After `npm ci` in the initially clean checkout, every listed command was run exactly as written:

| Claim | Exact command | Result |
| --- | --- | --- |
| `click-recording` | `npm run test:e2e -- --grep @claim:click-recording` | PASS: 1 passed, 1 expected mobile-project skip |
| `export-files` | `npm run test:e2e -- --grep @claim:export-files` | PASS: 2 passed |
| `local-storage` | `npm run test:e2e -- --grep @claim:local-storage` | PASS: 1 passed, 1 expected mobile-project skip |
| `no-account` | `npm run test:e2e -- --grep @claim:no-account` | PASS: 2 passed |
| `private-capture` | `npm run test:e2e -- --grep @claim:private-capture` | PASS: 1 passed, 1 expected mobile-project skip |

The commands pass, but the claims contract is still not satisfied:

- README and live copy make unlisted claims, including start/pause/resume/annotation/clear behavior; an in-memory demo that saves nothing; removal-on-uninstall; and no analytics, advertising identifiers, external fonts, third-party scripts, AI service, or payment provider.
- The `local-storage` claim test writes a fabricated state directly to `chrome.storage.local` and reads it back. It does not start and record a flow as its declared sandbox says.
- The `no-account` test opens the demo and counts steps but does not complete a flow action as its declared sandbox says.
- No claim or test covers the original brief's essential assistive behavior because that behavior is absent.

Under the supplied claims rules, unlisted claims and non-observable claim tests are release-blocking even when their commands exit zero.

## Release-blocking findings

### Critical — C1: The original job-to-be-done is absent

The implementation has one `Flow | null` recorder state (`lib/flow.ts:20-25`), automatically names it from the active page, lists recorded clicks, and offers Pause, Resume, exports, notes, and Clear (`entrypoints/popup/main.ts:15-78`). It provides none of the minimum assistive route-following behavior:

- no way to save and select multiple named routes;
- no 3–10 step model or limit — a sequential boundary test stored 19 total steps;
- no follow/playback mode;
- no current-step announcement on the target page;
- no visible-anchor detection or highlight;
- no Next, Back, or Previous control (independent popup query found zero);
- no low-vision audience copy or scenario;
- no evidence of NVDA testing.

The pilot success measure in the researched brief cannot be attempted with this build.

### High — H1: Rapid valid clicks overwrite one another

In the exact live ZIP, 13 rapidly dispatched click events produced only 3 stored steps in the retained run; repeated runs produced 1–3. Sequential clicks were retained. Each message independently reads the old state and writes a replacement (`entrypoints/background.ts:34-40`), so concurrent messages race. A user moving quickly through a responsive application can receive an incomplete route without warning.

Evidence: `.factory/evidence/verification-1/independent-extension-qa.json`.

### High — H2: Accessibility-tree-first and password-field constraints are violated

The content script subscribes to clicks on every `input`, including `type=password` (`entrypoints/content.ts:3-12`). In a real packaged-extension run, clicking a labeled password field stored `Work password` in the flow. It did not store the typed value, so the narrower candidate claim passes, but the original brief says never inspect password fields.

The label algorithm checks a limited set of DOM properties and `innerText`; it does not compute the accessible name (`lib/flow.ts:72-85`). A button whose accessible name was “Save report” via `aria-labelledby` was stored as `button`. That is the opposite of using the accessibility tree before visual heuristics.

Evidence: `.factory/evidence/verification-1/independent-extension-qa.json`.

### High — H3: Dark mode has seven serious contrast failures

Fresh axe testing with `colorScheme: dark` found `color-contrast` on seven landing-page nodes:

- the “01” and “02” section markers: 2.44:1, required 4.5:1;
- “Clear boundaries”: 1.76:1, required 4.5:1;
- the boundaries heading: 2.17:1, required 3:1;
- all three boundaries list items: 2.17:1, required 4.5:1.

The light-theme routes and extension popup had no serious/critical axe findings. The default automated suite never switches the site to dark mode, so it misses this regression.

Evidence: `.factory/evidence/verification-1/independent-live-qa.json` and `live-dark-home.png`.

### High — H4: The claims inventory and tests do not cover all public promises

The missing and semantically incomplete claims listed in the Claims gate violate the mandatory “every claim is a test” contract. This is independently release-blocking.

### Medium — M1: Two demo controls miss the 44 px mobile target minimum

At a 390 px viewport, Reset demo and Start for real are each 34 px tall. The global 44 px rule is overridden by `.demo-banner button, .demo-banner a { min-height: 34px }` (`site/src/styles.css:103-104`). The candidate mobile target test checks `/`, not `/demo`.

### Medium — M2: Missing routes are soft 404s

`/definitely-missing` renders the styled not-found view but returns HTTP 200. This conflicts with the required real 404 route and can mislead crawlers and monitors.

### Medium — M3: The researched one-time purchase model is absent

There is no price, Sociobot checkout link, license return handling, verification cache, or restore-license field. README instead advertises that no payment provider is used. Core accessibility must remain free, but the contract's one-time monetization requirement still needs an honest paid scope or a documented approved deviation.

## Functional and recovery evidence

The candidate's implemented recorder/export product otherwise works at ordinary pace:

- One-click demo opened with five steps on desktop and 390 px.
- Markdown and JSON downloads contained all five sample steps.
- A 280-character note was retained; whitespace-only input recovered to no note.
- Remove → Undo restored five steps; Reset restored the sample.
- Demo localStorage, sessionStorage, and IndexedDB remained empty.
- The packaged extension recorded a click and a page-address change, paused without recording, resumed, trimmed a 500-character note to 280 characters, exported both formats, retained data when Clear was cancelled, and removed it when Clear was confirmed.
- The downloaded live ZIP installed as an unpacked MV3 extension in a fresh Chromium profile.

## Clean local gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS: 171 packages, 0 vulnerabilities reported |
| `npm test` | PASS: 5 Vitest tests; 24 Playwright tests; 6 intentional project skips |
| `npm run typecheck` | PASS |
| `npm run check:package` | PASS: lockfile v3, 222 package records |
| `npm run check:copy` | PASS |
| `npm run build` | PASS; produced `dist/site/`, `dist/extension/`, and ZIP |
| `npm run test:a11y` | PASS in the candidate's default theme: 3 passed, 1 expected extension/mobile skip |
| `npm audit --audit-level=high` | PASS: 0 vulnerabilities |
| `unzip -t dist/site/downloads/app-flow-reader-chrome.zip` | PASS: all 11 files |

No lint script exists in `package.json`.

## Live accessibility, browser, privacy, and policy checks

- Factory `verify-url.sh` passed `/` and `/demo`: HTTP 200, title, `lang=en`, one h1, main landmark, no missing alt text, no unlabeled buttons, and no console/page errors.
- Fresh Playwright axe: no serious/critical findings on `/`, `/demo`, `/privacy`, `/terms`, or the not-found view in light mode at desktop and 390 px; dark `/demo` and the extension popup in light/dark also passed. Dark `/` failed as recorded above.
- Keyboard: skip link is first, mobile menu opens with Enter, all menu choices are reachable, demo opens with Enter, note dialog focuses the textarea, Escape closes it, and focus returns to the invoking button. No trap observed.
- Focus ring: 3 px solid orange, visibly present. Reduced motion resolves transitions/animations to 0.01 ms and scroll behavior to auto.
- 390 px pages had no horizontal overflow. A 720 CSS px viewport (1440 desktop at 200% zoom equivalent) also had no horizontal overflow; the viewport meta does not disable zoom.
- Demo network interception across the full flow observed no cross-origin request. No cookies or external scripts/fonts were observed. Extension code has no network call; its data remains in `chrome.storage.local`.
- Response policy includes CSP, HSTS, `nosniff`, strict-origin referrer policy, frame denial, and camera/microphone/geolocation denial. No CSP console violations occurred.
- Internal routes/assets and the external Param Factory link returned 200. Mail links were not fetched.
- This is a static site/extension with no server API or product-unlock endpoint, so API burst-rate limiting and `Retry-After` are not applicable. There is no sign-in, so Entra authority validation is not applicable.

## Service worker, caching, and performance

- Service worker was active at `/sw.js`; `registration.update()` completed. After a priming reload, `/demo` reloaded offline with its five steps.
- Caching: HTML `max-age=30, must-revalidate`; hashed JS/CSS `max-age=31536000, immutable`; `/sw.js` `no-cache`; extension ZIP `max-age=3600`.
- Live Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 0.8 s, LCP 0.9 s, Speed Index 1.2 s, TBT 130 ms, CLS 0. INP was not available in this single-load lab run.
- Bundle budgets pass: initial JS 16,276 B raw / 5,918 B gzip; CSS 15,477 B raw / 4,227 B gzip; fonts 0 B; social image 4,356 B. The unpacked extension is 21.37 kB and ZIP is 11,787 B.

## Deployment identity

The deployment matches the candidate exactly:

| Artifact | Local/live SHA-256 |
| --- | --- |
| `index.html` | `fb83ea65bf0ef09a354801d51353a696cd47fbb46bc32eafc354c1757088ad66` |
| main JS | `84fdb0b3e491ba814d88143eec073c96776c210628587da9480fe0789fcb5d9d` |
| `sw.js` | `82fa3574673378e1b31c31d137492072edeede321661832cf23d275e9d23c195` |
| extension ZIP | `f4afb743ecc3d2dadc9503fc11b9189dd25455805005a3915456f2a0c19557be` |

The prior deployment-only concern is not reproducible. The live deployment is present, healthy, and serves this failing candidate.

## Evidence and reproduction

Retained evidence is under `.factory/evidence/verification-1/`:

- `independent-live-qa.json` and `independent-extension-qa.json`;
- factory verifier HTML, JSON, desktop/mobile screenshots;
- dark-mode screenshot;
- Lighthouse JSON;
- root/demo/asset/service-worker/download response headers.

Independent harnesses are `.factory/evidence/independent-live-qa.mjs` and `.factory/evidence/independent-extension-qa.mjs`. They do not modify product data or source.

No product code was changed during verification.
