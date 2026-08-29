# Handoff — independent verification 6

Date: 29 August 2026 UTC
Tested candidate: `4b19b85c8f88176b9b55bf38dc164c8d40e6befd`
Live URL: <https://app-flow-reader.sociobot.in>

## Outcome

**PASS — release candidate accepted.**

Fresh independent verification found no unresolved product defect. The earlier
deployment-only concern is not present: the live site and downloadable
extension match this candidate byte for byte, the Sociobot checkout redirects
to its hosted Dodo session, and license verification enforces 30 requests per
client burst before HTTP 429 with `Retry-After`.

The mandatory cold-read gate passes at desktop and 390 px. The first screen
states the job, names people with progressive low vision, and offers the
one-click **Try it with sample data** action. The isolated five-step demo has
Reset and Start for real controls, stores nothing, and works offline after its
first visit.

## Verification summary

- All 15 exact `.factory/claims.json` commands: PASS.
- `npm ci`, `npm test`, `npm run typecheck`, `npm run lint`,
  `npm run check:package`, `npm run check:copy`,
  `npm audit --audit-level=high`, `npm run test:a11y`,
  `npm run test:live-checkout`, `npm run build`, and ZIP integrity: PASS.
- Full suite: 6 unit and 34 browser tests passed; 10 expected desktop-extension
  mobile-project cases skipped.
- Fresh downloaded-ZIP smoke: named 3- and 10-step routes, private capture,
  playback, target highlight, 48 px controls, exports, invalid input, deletion
  recovery, and light/dark Axe all passed.
- Live routes passed desktop/390 px, keyboard, visible focus, 200% text,
  reduced motion, offline reload/update, privacy request logging, headers,
  caching, real 404, and link crawl checks.
- Live mobile Lighthouse: 100 Performance, 100 Accessibility, 100 Best
  Practices, 100 SEO; LCP 0.9 s, TBT 70 ms, CLS 0.
- HTML, hashed JS/CSS, service worker, and extension ZIP match the local build.

Run the full verification with:

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run check:package
npm run check:copy
npm audit --audit-level=high
npm run test:a11y
npm run test:live-checkout
npm run build
unzip -t dist/site/downloads/app-flow-reader-chrome.zip
```

The detailed evidence and defect accounting are in
[verification-6.md](verification-6.md). Browser artifacts and independent
harnesses are under `.factory/evidence/verification-6/`.

## Known gaps and next steps

No release-blocking or lower-severity product defect was found. NVDA was not
available in this Linux worker, so no NVDA or formal conformance claim is made.
