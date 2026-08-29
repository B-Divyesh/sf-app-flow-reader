# Handoff — polish round 6

Date: 29 August 2026 UTC
Repair commit: `9bbf7944c516cdb89b406b45b47b192627e372bd`

## Outcome

**PASS — no unresolved finding remains.**

The repair closes F-6-1 without changing the extension's product identity or
deployment class. The landing purchase action now says **Buy supporter license
(opens secure checkout)** before leaving the product. The extension popup also
discloses its new-tab checkout. `supporter-checkout` is an atomic claim whose
browser test checks the visible label, HTTPS 303 response, and hosted Dodo
destination.

The earlier low-vision route-reader, direct `?demo=1` sandbox, privacy,
offline, supporter-cover, routing, title/metadata, focus, real-404, legal,
mobile, and first-screen repairs were rechecked rather than accepted from
prior notes. See [polish-6.md](polish-6.md) for an ID-by-ID closure map.

## How to run and verify

```sh
npm ci
npm test
npm run test:a11y
npm run typecheck
npm run lint
npm run check:copy
npm run check:package
npm audit --audit-level=high
npm run test:live-checkout
npm run build
unzip -t dist/site/downloads/app-flow-reader-chrome.zip
```

Then invoke every exact command in `.factory/claims.json` independently. From
a clean clone at `/tmp/app-flow-reader-polish6-clean.ZfhGdo`, all 15 passed;
the pass markers, including `all-claims.pass`, are at
`/tmp/app-flow-reader-polish6-claims-status.cCtHmx/`.

Production was deployed with:

```sh
/opt/fleet/lib/deploy-static.sh app-flow-reader dist/site
```

Deployment `fb0f76b4-585d-45d8-bf2d-10f107097e64` succeeded. Cold production
checks passed at <https://app-flow-reader.sociobot.in>,
<https://app-flow-reader.sociobot.in/?demo=1>,
<https://app-flow-reader.sociobot.in/privacy>, and
<https://app-flow-reader.sociobot.in/terms>. The fresh evidence is under
`.factory/evidence/polish-6/`:

- `live-audit.json` records desktop/mobile first-screen facts, demo reset and
  isolation, offline Next, focus/history, per-route metadata, the checkout
  redirect, zero console/page errors, dark Axe, and the HTTP 404 skeleton.
- `verify-*/verify.json` are the four `verify-url.sh` reports.
- `lighthouse-live-mobile.json` records Performance 100, Accessibility 100,
  Best Practices 100, SEO 100, LCP 0.8 s, CLS 0, and TBT 0 ms.

The Axe CLI could not launch in this worker because it expects a system Chrome
binary. The repository's Playwright Axe integration ran against the live site
instead and found zero serious or critical violations.

## Known gaps and next steps

None. No user data migration, infrastructure, DNS, billing configuration, or
manual release action is needed.
