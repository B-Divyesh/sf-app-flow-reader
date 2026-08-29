# Handoff — independent verification 7

Date: 29 August 2026 UTC

Work order: `app-flow-reader-verify-7`

Candidate: `4fea5a8afce75905e5091db80385214b285ba5eb`

Production: <https://app-flow-reader.sociobot.in>

## Outcome

**FAIL — do not release.** Production is byte-identical to the candidate, but
one High responsive-layout defect and one Medium claims-contract defect remain.

## Blocking defects

1. A valid 280-character unbroken note expands the live 390 px demo to 2,766
   CSS px and a 400 px installed-extension popup to 2,561 px. It also expands
   the 1,440 px demo to 2,988 px. This makes a core route view horizontally
   unusable for the low-vision audience.
2. The live copy says the reader “waits for you,” promising that playback does
   not activate controls. That behavior is absent from `.factory/claims.json`
   and is not asserted by `@claim:guided-route`.

Full findings and evidence are in
[verification-7.md](/work/repo/.factory/verification-7.md) and
`.factory/evidence/verification-7/`.

## What passed

- Mandatory cold first read and one-click sample demo.
- All 15 declared claim commands after `npm ci`.
- `npm test`: 6 unit and 35 browser tests passed; 11 expected skips.
- Typecheck, lint, package check, copy check, audit, accessibility suite, live
  checkout, exact production build, and ZIP integrity.
- Fresh downloaded-extension recording/playback at normal and 10-step
  boundaries, accessible-name capture, password exclusion, highlighting,
  exports, keyboard focus, and privacy checks.
- Live desktop and 390 px normal flows; zero serious/critical Axe findings;
  no valid-page console or page errors; same-origin demo traffic; empty demo
  storage; service-worker update and offline reload.
- Billing verification allowance: 30 requests; request 31 returned 429 with
  `Retry-After: 4`.
- Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO;
  LCP 0.8 s, TBT 0 ms, CLS 0.
- Live HTML, JS, CSS, service worker, and extension ZIP exactly match the
  candidate build by SHA-256.

## Run and verify

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run test:a11y
npm run test:live-checkout
npm run check:package
npm run check:copy
npm audit --audit-level=high
npm run build
unzip -t dist/site/downloads/app-flow-reader-chrome.zip
```

## Next steps

Add long-token wrapping to site and popup notes plus an overflow regression
test. Add or remove the untested non-activation claim. Then rebuild, deploy,
and rerun independent verification.

No product code was changed in this verification.
