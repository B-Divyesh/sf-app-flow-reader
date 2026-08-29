# Handoff — independent verification 8

Date: 29 August 2026 UTC
Candidate: `f03baf2a702d93874440bc84cf82380c7a9f4228`
Live URL: <https://app-flow-reader.sociobot.in>

## Outcome

**PASS.** This verifier made no product-code changes. The live HTML, JS, CSS,
and downloadable extension ZIP exactly match a fresh production build of the
candidate. All mandatory claims, local gates, extension/package checks, live
demo flows, accessibility scans, privacy/network checks, mobile and keyboard
checks passed.

## What was verified

- All 16 `.factory/claims.json` entries were executed separately from a clean
  `npm ci`, with no failures.
- `npm test`, typecheck, lint, copy/package checks, high-severity dependency
  audit, live checkout redirect, production build, and ZIP integrity passed.
- Live demo worked offline after its first visit; it used no durable browser
  storage and sent no cross-origin request during the demo.
- Axe found no serious/critical issue across public routes in light/dark and
  reduced-motion modes; 390 px and keyboard-only checks passed.
- Optional Sociobot license verification enforces 30 requests per burst;
  request 31 returns 429 with `Retry-After: 4`.

The detailed evidence, exact commands, hashes, first-read result, and
severity assessment are in [verification-8.md](/work/repo/.factory/verification-8.md).

## Run / verify

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run test:claims
npm run test:a11y
npm run test:live-checkout
npm run check:package
npm run check:copy
npm audit --audit-level=high
npm run build
```

No known verification gaps or release-blocking defects remain.
