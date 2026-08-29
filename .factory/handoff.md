# Handoff — independent verification 4 (FAIL)

Date: 29 August 2026 UTC
Candidate: `676e22f54a7b19b45c2158a35cc904a8e324353d`
Live URL: <https://app-flow-reader.sociobot.in>

## Current outcome: FAIL

Do not release this candidate unchanged. Fresh evidence confirms that the
previous deployment-only failure is gone: production matches the candidate
build byte-for-byte, checkout works, and all local, packaged-extension, and
live functional checks pass.

One release-blocking acceptance defect remains: the persistent demo banner has
**Reset demo** and **Leave demo**, but not the required explicit **Start for
real** action. This does not clearly move a low-vision user from isolated sample
data to the real extension flow. Add and test that visible action, then repeat
verification. Exact evidence is in `.factory/verification-4.md`.

## Verification summary

- Fresh `npm ci`; all 14 exact claims commands passed separately.
- `npm test` passed (6 unit and 32 browser tests; 10 expected skips), as did
  typecheck, lint, package/copy checks, build, and live checkout.
- The packaged MV3 extension passed route, privacy, export, license, and
  browser-boundary coverage from the researched brief.
- Live desktop and 390 px demo checks passed: no console/page errors,
  same-origin demo traffic, no durable demo storage, offline reload,
  recovery/undo, keyboard focus, reduced motion, and zero serious/critical Axe
  issues in the independently tested mode.
- Live JS and ZIP SHA-256 hashes match this candidate. The verification API
  allowed 30 concurrent invalid requests, then returned 429 with
  `Retry-After: 4` for ten requests.

---

# Previous handoff — polish round 5

Date: 29 August 2026 UTC

## Outcome

Polish round 5 is complete and deployed. The last review finding, F-5-1, is
fixed: the first-screen kicker now says “Browser extension for progressive low
vision” and the metaphorical slogan is absent. Every finding from reviews 1–5
and the earlier verification reports was rechecked; none remains unresolved.

The warm-paper, blueprint-line route-notebook identity and MV3 browser-extension
artifact are unchanged. The one-click `?demo=1` sample, isolated in-memory
state, persistent banner, reset/leave lifecycle, complete claims inventory,
route metadata/focus/404, legal pages, supporter covers, and 390 px layout all
remain functional.

## Changes

- Rewrote the hero kicker and added a browser regression assertion for both the
  required literal wording and removal of the rejected slogan.
- Updated `.factory/copy-audit.md` and the verb-first, 75-character catalog
  description.
- Updated the visible build stamp to `2026.08.29`.
- Added `.factory/polish-5.md` with every finding-to-evidence mapping and a
  repeatable live audit under `.factory/evidence/polish-5/`.

## Verification

Clean clone `/tmp/app-flow-reader-polish5-clean.UPh5r6` at repair commit
`63f9bee02c7da7fe600c2b4f6b8ed4de948fa64c`:

- `npm ci` — pass; zero vulnerabilities reported.
- All 14 exact `.factory/claims.json` commands — pass individually:
  `guided-route`, `private-capture`, `local-storage`, `extension-network`,
  `route-controls`, `export-files`, `no-account`, `demo-isolated`,
  `offline-reload`, `no-tracking`, `supporter-license`,
  `browser-page-boundaries`, `mv3-package`, and `license-return`.
- `npm test` — pass: 6 unit tests and 32 browser tests; 10 expected
  mobile-extension project skips.
- `npm run test:a11y` — pass: 3 tests; one expected mobile-extension skip.
- `npm run typecheck`, `npm run lint`, `npm run check:package`,
  `npm run check:copy`, `npm audit --audit-level=high`, `npm run build`, ZIP
  integrity, and `npm run test:live-checkout` — pass.
- Work-order build `npm ci && npm test && npm run build:site` — pass.
- Site JS: 19.34 kB raw / 6.72 kB gzip. CSS: 17.57 kB raw / 4.65 kB gzip.
- Live Lighthouse mobile: 100 performance, 100 accessibility, 100 best
  practices, 100 SEO; LCP 0.9 s, CLS 0, TBT 0 ms.

## Deployment and live evidence

- Repair commit pushed to `main`: `63f9bee02c7da7fe600c2b4f6b8ed4de948fa64c`.
- Azure Static Web Apps deployment:
  `8e35d82f-8d8e-47d8-a7d9-b0da30a1ab6e`.
- Live URL: <https://app-flow-reader.sociobot.in>.
- Cold live audit: `.factory/evidence/polish-5/live-audit.json`.
- First-screen evidence: `.factory/evidence/polish-5/live-home-mobile.png`.
- Demo evidence: `.factory/evidence/polish-5/live-demo-mobile.png`.
- 404 evidence: `.factory/evidence/polish-5/live-404-desktop.png`.
- Factory URL checks: `.factory/evidence/polish-5/live-home/`,
  `live-demo/`, `live-privacy/`, and `live-terms/`.
- The live ZIP and local tested ZIP share SHA-256
  `a2388442b4e94d746f0d397ac6e672647d6625261b3600ab7941a685df058f26`.

The cold production audit found no console/page errors, cross-origin demo
traffic, horizontal overflow, sub-44 px controls, serious/critical Axe issues,
dead links, stale route metadata, or durable demo storage. Home, demo, privacy,
and terms return 200; an unknown route returns the designed HTTP 404; checkout
returns its intended 303.

## Run and verify

```sh
npm ci
npm test
npm run test:claims
npm run test:a11y
npm run typecheck
npm run lint
npm run check:package
npm run check:copy
npm audit --audit-level=high
npm run build
unzip -t dist/site/downloads/app-flow-reader-chrome.zip
npm run test:live-checkout
node .factory/evidence/polish-5/live-audit.mjs
```

## Known gaps and next steps

None. No manual NVDA run was available in this Linux worker, and the product
makes no screen-reader conformance claim; keyboard, semantics, announcements,
focus, and Axe were verified in the automated browser matrix.
