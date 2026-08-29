# Handoff — polish round 7

Date: 29 August 2026 UTC

Work order: `app-flow-reader-polish-7`

Reviewed base: `1a0fe9c9de3c2a44bd07d1ec765da59da7e95de8`

Production: <https://app-flow-reader.sociobot.in>

## Outcome

PASS. Every finding in reviews 1–7 and every earlier polish report is closed.
No known product, copy, accessibility, privacy, offline, routing, package, or
deployment gap remains.

The round-7 defect is fixed: on a cold 390 × 844 live demo, Back and Next are
side by side, each is 149 × 52 px, and the enabled Next action ends at
`837.453 px`. It is fully visible within the initial viewport.

## What changed

- Reflowed mobile demo navigation so the only enabled first action remains
  above the fold; added a viewport-coordinate regression test.
- Raised extension popup note and footer actions to the 44 px touch baseline.
- Completed the supporter-license daily-cache contract: fresh cached verdicts
  avoid a request; stale tokens are reverified; revoked covers lock; the free
  reader renders before any due verification finishes.
- Bumped the product and MV3 package to 1.1.1 and the service-worker cache to
  `app-flow-reader-v3` so existing visitors receive the repaired CSS.
- Kept the product-specific blueprint/notebook visual system and original
  browser-extension/static-site artifact classes.
- Re-audited the first screen, catalog line, README, legal routes, claims, and
  all earlier findings. The verb-first catalog description is 79 characters.
- Added the cumulative mapping in [polish-7.md](/work/repo/.factory/polish-7.md)
  and repeatable production evidence in
  [live-audit.json](/work/repo/.factory/evidence/polish-7/live-audit.json).

## Clean-clone verification

The product revision `8ca48be619d7e9f9e7dddf683b0856d567fab6c6` was cloned to
`/tmp/app-flow-reader-polish7-clean.kEo0yr`. From that clean clone:

- `npm ci`: PASS; 171 packages; zero vulnerabilities.
- Every exact `test` command in `.factory/claims.json`: PASS, all 15 run
  separately.
- `npm test`: PASS; 6 unit tests and 35 browser tests passed, with 11 expected
  project skips.
- `npm run test:a11y`: PASS; 3 passed, 1 expected project skip.
- `npm run typecheck`, `npm run lint`, `npm run check:package`, and
  `npm run check:copy`: PASS.
- `npm audit --audit-level=high`: PASS; zero vulnerabilities.
- `npm run test:live-checkout`: PASS; HTTPS hosted-checkout redirect.
- `npm run build` and ZIP integrity: PASS.

Exact per-claim results are recorded in
[clean-clone-verification.md](/work/repo/.factory/evidence/polish-7/clean-clone-verification.md).

The production build is 19.57 kB raw / 6.79 kB gzip JavaScript, 17.70 kB raw /
4.68 kB gzip CSS, 36.45 kB unpacked extension code, and a 16.65 kB extension
ZIP. There are no webfont downloads.

## Production verification

Deployment `0d5252ab-6985-4772-8696-5b7d719d6434` succeeded via:

```sh
npm run build
/opt/fleet/lib/deploy-static.sh app-flow-reader dist/site
```

Cold browser contexts then verified:

- `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` return 200; the designed
  `/definitely-missing` route returns HTTP 404.
- Every route has its own title, description, canonical, Open Graph and
  Twitter title, one H1, one main landmark, shared navigation, and footer.
- SPA links and browser Back move focus to the new H1.
- The demo has five realistic steps, its persistent banner, Reset demo, and
  Start for real. Edit → exit → re-entry leaves no edit and no localStorage,
  sessionStorage, or IndexedDB data.
- An offline reload of `?demo=1` renders the route and advances to step 2.
- All navigational resources returned an expected 2xx/3xx response. The 404
  page's same-document skip fragment correctly retains that page's 404 status.
- Page runtime made no cross-origin request, logged no console error, and had
  zero serious or critical Axe violations across home, demo, privacy, terms,
  and 404.
- The checkout returned HTTPS 303 to hosted Dodo checkout.
- Live and local extension ZIPs match at SHA-256
  `9ab35b1a212fc16e7e09f96e1413425f51ccae90aaed64bae6b14dc7063f3b0a`.
- `/opt/fleet/lib/verify-url.sh` passed home, direct demo, privacy, and terms.
- Mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; LCP 0.8 s, CLS 0, TBT 0 ms.

Evidence:

- [live demo at 390 × 844](/work/repo/.factory/evidence/polish-7/live-demo-mobile390.png)
- [live home at 390 × 844](/work/repo/.factory/evidence/polish-7/live-home-mobile390.png)
- [live 404](/work/repo/.factory/evidence/polish-7/live-404-desktop.png)
- [Lighthouse JSON](/work/repo/.factory/evidence/polish-7/lighthouse-live-mobile.json)

## Run and verify

```sh
npm ci
npm test
npm run test:a11y
npm run typecheck
npm run lint
npm run check:package
npm run check:copy
npm audit --audit-level=high
npm run test:live-checkout
npm run build
```

The static site is in `dist/site`, the unpacked MV3 extension is in
`dist/extension`, and the downloadable package is
`dist/site/downloads/app-flow-reader-chrome.zip`.

## Known gaps and next steps

None for this work order.
