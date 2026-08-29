# Handoff — repair 5

Date: 29 August 2026 UTC

Work order: `app-flow-reader-repair-5`

Base candidate: `4fea5a8afce75905e5091db80385214b285ba5eb`

Repair commit: `83326ef` (`fix: prevent note overflow and assert passive playback`)

Production: <https://app-flow-reader.sociobot.in>

Deployment: Azure Static Web Apps deployment `e2eda541-003b-4819-af5e-89fd8f2fac32`

## Outcome

**PASS — the two release-blocking findings in
[verification-7.md](/work/repo/.factory/verification-7.md) are repaired and
the original extension and static-site deployment classes are unchanged.**

## Repairs

1. **Maximum-length note overflow (High):** both renderers now allow an
   unbroken note token to wrap anywhere. The site route-copy grid item can
   shrink, and the popup step copy is a shrinkable flex item. The popup body
   also respects a 400 px viewport instead of imposing a 410 px minimum.
   This covers the route-sheet note, the current reader note, and the
   extension popup note without truncating stored content.
2. **Passive playback claim (Medium):** `.factory/claims.json` now declares
   `playback-waits`: following a route highlights the matching control and
   never activates it. The landing preview and README use the same promise.
   Its isolated packaged-MV3 test attaches activation listeners to recorded
   controls, starts playback, advances to a matching target, and proves both
   listeners remain at zero.

## Regression coverage

- `a maximum-length unbroken demo note stays within the desktop and 390px
  viewport...` saves 280 `x` characters and asserts both document width and
  rendered current-note bounds stay inside the viewport in desktop Chromium
  and the 390 × 844 mobile project.
- `a maximum-length unbroken popup note stays inside a 400px popup viewport`
  uses the packaged extension and asserts `scrollWidth <= innerWidth` after
  a 280-character prompt result.
- `@claim:playback-waits` records two page targets with activation listeners,
  invokes guided playback, moves to the first target, confirms the four-pixel
  outline, and proves the listeners never run.

## Verification evidence

### Clean install and local gates

`npm ci` completed with 171 packages and zero vulnerabilities. All sixteen
declared claim commands were then run separately from that install, including
the new `@claim:playback-waits`; every command passed (extension-only mobile
projects correctly report their explicit skip).

| Check | Result |
| --- | --- |
| `npm test` | PASS — 6 unit tests; 39 browser tests passed across desktop and 390 px mobile; 11 explicit extension/mobile skips |
| `npm run typecheck` and `npm run lint` | PASS |
| `npm run test:a11y` | PASS — 3 Axe suites passed; 1 explicit extension/mobile skip |
| `npm run check:package` and `npm run check:copy` | PASS |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities |
| `npm run test:live-checkout` | PASS — HTTPS 303 to hosted Dodo checkout |
| `npm run build` | PASS — `dist/site`, `dist/extension`, and the ZIP built |
| `unzip -t dist/site/downloads/app-flow-reader-chrome.zip` | PASS — all 11 archive entries |

`/opt/fleet/lib/verify-url.sh` passed local `/`, `/demo`, `/privacy`, and
`/terms`: each returned 200, had the route title, `lang=en`, one H1, a main
landmark, complete image alternatives, named buttons, and no console errors.

The required Axe coverage ran through the repository's Playwright Axe
integration because `@axe-core/cli` could not locate a system Chrome binary
in this container. It found zero serious/critical findings in every public
route, both light and dark treatments, reduced motion, and the installed
extension popup. The CLI failure was environmental, not a product finding.

Local mobile Lighthouse: Performance **100**, Accessibility **100**, Best
Practices **100**, SEO **100**; FCP/LCP **0.9 s**, TBT **0 ms**, CLS **0**,
and 14 KiB transfer.

### Production and consumer verification

- Azure deployed the tested `dist/site` successfully under deployment
  `e2eda541-003b-4819-af5e-89fd8f2fac32`; the custom domain returned HTTPS
  200 immediately after deployment.
- Fresh live desktop and 390 × 844 mobile demo flows passed: five sample
  steps, one current-step marker, Step 2 announcement, no undersized targets,
  no horizontal overflow, no console errors, no cross-origin requests, zero
  serious/critical Axe findings in light and dark, and successful offline
  reload after service-worker priming.
- A fresh live 280-character note check measured desktop `scrollWidth` as
  **1440 / 1440** and mobile as **390 / 390**. The rendered mobile note ended
  at 350 px, inside its 390 px viewport.
- The live ZIP SHA-256 exactly equals the local tested ZIP:
  `56ae7b148c0fd22de6853cf1a7d833fcd6582cb5d64be46d3c01da71a8674599`.
  A fresh Chromium profile unpacked that downloaded ZIP, set its popup to
  400 px, saved a 280-character note, and measured `scrollWidth` **400 / 400**
  with a 312 px note.
- Live response policy is present: HSTS, `nosniff`, strict referrer policy,
  restrictive Permissions-Policy, `X-Frame-Options: DENY`, and the configured
  self-only CSP with `frame-ancestors 'none'`. `/definitely-missing` returned
  the designed HTTP 404.
- Checkout still redirects to the hosted HTTPS Dodo session. There is no
  sign-in or identity-provider flow, so live identity-authority validation is
  not applicable.

## Run and verify

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
unzip -t dist/site/downloads/app-flow-reader-chrome.zip
```

Deploy the tested site with:

```sh
/opt/fleet/lib/deploy-static.sh app-flow-reader dist/site
```

## Known gaps and next steps

No known product gaps remain from verification 7. The standalone Axe CLI is
not runnable in this worker because it requires a system Chrome path; the
equivalent Playwright Axe suite is pinned in this repository and passed.
