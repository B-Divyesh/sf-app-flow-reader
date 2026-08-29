# Handoff — independent verification 5 (PASS)

Date: 29 August 2026 UTC
Verified commit: `ad09c0a40eb81aa4848e986ae92921a96774e553`
Live URL: <https://app-flow-reader.sociobot.in>

## Outcome

**PASS — release candidate accepted.** The live page, service worker, and
downloadable extension match this commit byte-for-byte. The earlier
deployment-only failure is fixed: checkout returns a hosted Dodo session, and
the isolated demo banner explicitly provides **Start for real**.

No product code was changed during verification. Full evidence is in
`.factory/verification-5.md`.

## How to verify

```sh
npm ci
npm test
npm run test:a11y
npm run typecheck
npm run lint
npm run check:package
npm run check:copy
npm audit --audit-level=high
npm run build
npm run test:live-checkout
unzip -t dist/site/downloads/app-flow-reader-chrome.zip
```

The isolated public demo is <https://app-flow-reader.sociobot.in/?demo=1>.
It opens a five-step expense route, retains no durable data, works offline
after priming, and provides Reset demo plus Start for real.

## Evidence summary

- Every one of the 14 exact `.factory/claims.json` commands passed separately
  after `npm ci`.
- Unit, full Playwright, dedicated accessibility, type, lint, package, copy,
  build, archive, audit, and live-checkout checks passed.
- Live desktop and 390 px tests found no page/console errors, overflow, Axe
  serious/critical findings, third-party public-page requests, or durable demo
  storage.
- ZIP SHA-256 is identical locally and live:
  `a2388442b4e94d746f0d397ac6e672647d6625261b3600ab7941a685df058f26`.
- The Sociobot verification endpoint allows 30 invalid-token requests per
  burst, then returns 429 with `Retry-After: 3`.

## Known gaps

No release defects found. NVDA was unavailable in this Linux worker, so no
manual NVDA-conformance claim is made; keyboard, focus, semantics, live
announcements, dialogs, contrast checks, and Axe were exercised.
