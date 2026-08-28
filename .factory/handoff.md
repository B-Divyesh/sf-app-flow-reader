# Handoff — adversarial first-read review 2

Date: 28 August 2026 UTC

## Outcome

Review only; no product code was changed. The review is recorded in
`review-2.md` and the result is **FAIL** with three minor findings:

1. Reader-facing install copy retains unexplained extension/browser jargon.
2. The direct static 404 page does not include the shared header navigation.
3. The direct static 404 page lacks Apple-touch, theme-color, and Twitter-image metadata.

## Verification performed

- Fresh live Chromium reads at 390 × 844 and 1440 × 900.
- Live sample demo: immediate realistic sample route, edit/reset/leave/re-entry,
  durable-storage checks, same-origin network check, and offline reload after
  service-worker priming.
- All 13 commands in `.factory/claims.json` run separately from fresh clone
  `/tmp/app-flow-reader-review-2.Aurin2` after `npm ci`; all passed.
- Full `npm test` passed (6 unit tests plus full Playwright matrix; expected
  extension/mobile skips only). `npm run typecheck`, `npm run lint`,
  `npm run check:copy`, and `npm run build` passed.
- Live route metadata, history/h1 focus, 404 status, checkout redirect, link
  crawl, and light/dark reduced-motion Axe checks were completed.

## How to repeat

```sh
npm ci
npm test
npm run test:claims
npm run typecheck
npm run lint
npm run check:copy
npm run build
```

Review the live site at <https://app-flow-reader.sociobot.in>, entering the
sample through `/?demo=1` and the static error route through any missing URL.

## Next steps

Implement the three documented findings, particularly the shared static 404
header and metadata, then re-run this first-read review.
