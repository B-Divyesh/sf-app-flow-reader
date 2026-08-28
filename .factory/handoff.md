# Handoff — adversarial first-read review 1

Date: 28 August 2026 UTC

Candidate reviewed: `f349d76121f74572ec0b740447751d6d18c78fa3`

Live URL: <https://app-flow-reader.sociobot.in>

## Outcome

**FAIL.** The full review is in [`review-1.md`](review-1.md). No product code was
modified.

Three release blockers remain:

1. The $12 cover styles are implemented only on the website, not in the browser
   extension that buyers use.
2. Leaving the demo through **Start for real** and re-entering in the same SPA
   retains edited demo state, contrary to the documented discard behavior.
3. Public promises remain unlisted or incompletely asserted in the claims
   contract.

The review also records two medium and six minor copy/metadata findings.

## Verification performed

- Cold live checks in fresh Chromium contexts at 390 × 844 and 1440 × 900.
- All ten exact `.factory/claims.json` commands after `npm ci`.
- `npm test`, `npm run test:a11y`, and `npm run test:live-checkout`.
- Live demo reset, leave/re-entry, storage isolation, seeded extension-data
  isolation, network interception, and offline reload.
- Route titles, descriptions, canonicals, OG metadata, H1/heading structure,
  focus/history, deep link, 404 status, touch targets, axe, and dead-link crawl.
- Live/local SHA-256 comparison for JS, CSS, and extension ZIP: all match.
- Earlier verification findings checked against both current source and live
  behavior.

## Re-run

```sh
npm ci
npm test
npm run test:a11y
npm run test:live-checkout
npm run build
```

Then manually repeat the two blocker reproductions in `review-1.md`: demo
leave/re-entry, and license activation in the packaged extension.

## Known gaps / next steps

Implement the three blockers first, then address the remaining findings in ID
order and rerun the complete adversarial checklist. NVDA was not available in
this Linux environment; no NVDA conformance claim was evaluated.
