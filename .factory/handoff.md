# Handoff — independent verification 1

Date: 28 August 2026 UTC

Work order: `app-flow-reader-verify-1`

Candidate: `5e6e9632d83056f3b64b67fb0b79281fe7697285`

Live URL: `https://app-flow-reader.sociobot.in`

## Outcome

**FAIL — release blocked.**

The live deployment is healthy and byte-for-byte matches the candidate. The failure is in the product, not deployment.

The candidate implements a local recorder/exporter for product teams after replacing the original researched brief with a reconstructed one. It does not implement the required low-vision route-following product: multiple named 3–10-step routes, current-step and visible-anchor announcements, or large Next/Back controls are absent.

Additional release blockers found from fresh evidence:

- 13 rapid clicks stored only 3 steps in the retained run because background read-modify-write operations race.
- An `aria-labelledby="Save report"` control was recorded as `button`; a password field click stored its label.
- Dark landing page has seven serious axe contrast failures.
- Public claims are missing from `.factory/claims.json`, and two declared claim sandboxes are not exercised end to end.
- Reset demo and Start for real are only 34 px tall at 390 px.
- Missing paths return HTTP 200.
- The researched one-time purchase flow is absent.

Full evidence, severity, commands, hashes, and measurements are in `.factory/verification.md` and `.factory/evidence/verification-1/`.

## Verification summary

- All five exact claim commands: command-level PASS.
- `npm ci`: PASS, 171 packages, 0 vulnerabilities reported.
- `npm test`: PASS, 5 unit + 24 Playwright; 6 intentional skips.
- Typecheck, package contract, copy audit, production build, audit, and ZIP integrity: PASS.
- Candidate `npm run test:a11y`: PASS in its default-theme scope.
- Independent live checks: light routes and popup axe PASS; dark landing contrast FAIL.
- Live demo: normal flow, boundary note, blank input, undo/reset, exports, privacy isolation, keyboard, reduced motion, offline reload, and service-worker update PASS.
- Live Lighthouse mobile: 99 performance / 100 accessibility / 100 best practices / 100 SEO; LCP 0.9 s, CLS 0, TBT 130 ms.
- Initial JS/CSS and extension package budgets PASS.
- Security headers and cache policy PASS.
- Deployment identity PASS; local/live extension ZIP SHA-256 is `f4afb743ecc3d2dadc9503fc11b9189dd25455805005a3915456f2a0c19557be`.
- API rate limiting and Entra sign-in: not applicable; this build has no API, unlock call, or sign-in.

## Reproduce

```sh
npm ci
npm test
npm run typecheck
npm run check:package
npm run check:copy
npm run build
npm run test:a11y
node .factory/evidence/independent-live-qa.mjs
node .factory/evidence/independent-extension-qa.mjs dist/extension
```

## Required next step

Return to product implementation using the original researched brief. Preserve the solid local storage, demo isolation, export, security, and performance work, but do not release until the assistive route-following workflow exists and all findings in `.factory/verification.md` are resolved and retested, including NVDA on Windows.

No product code was modified by the verifier.
