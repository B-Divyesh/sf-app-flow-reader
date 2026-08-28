# Handoff — polish round 3

Date: 28 August 2026 UTC

## Outcome

Released the round-three repair for App Flow Reader. The production source is
`0189b28` on top of `f46d49c`; it closes F-3-1 and keeps every finding from
reviews 1–3 closed. The landing page remains the warm-paper route notebook,
not a generic product template.

The static artifact was deployed as Azure Static Web Apps deployment
`9b4a1252-25e3-495d-9293-ec07bdf80475` to
<https://app-flow-reader.sociobot.in>.

## What changed

- Added the atomic `extension-network` claim and a clean-profile packaged-MV3
  test. It observes no extension network request at startup or while
  recording, then confirms one fixture-backed GET only to `api.sociobot.in`
  after a token is restored.
- Made the same plain privacy boundary explicit in README and `/privacy`.
- Tightened the 390 px hero rhythm and added a viewport assertion: the primary
  demo action and the Private, Offline, and Free/$12 facts all fit in the
  initial 844 px screen.
- Retained the prior real fixes: isolated memory-only `?demo=1`, reset and
  leave lifecycle, extension-native supporter covers, route metadata/focus,
  legal routes, real 404, plain install copy, and high-contrast mobile reader.
- The catalog sentence is verb-first and 48 characters: “Follow saved routes
  through dense workplace apps.”

## Verification

### Fresh clone

Fresh clone: `/tmp/app-flow-reader-polish3.Y9eRdx`.

- `npm ci` passed.
- Each of the 14 exact commands declared in `.factory/claims.json` passed
  separately. Transcript:
  `.factory/evidence/polish-3/clean-claims.log`.
- Full matrix passed: `npm test` (6 unit; 32 browser pass; 10 intentional
  extension-on-mobile skips), `npm run typecheck`, `npm run lint`,
  `npm run check:copy`, `npm run check:package`, `npm run test:a11y` (3 pass;
  1 intentional mobile extension skip), `npm run test:live-checkout`,
  `npm audit --audit-level=high` (0 vulnerabilities), `npm run build`, and
  `unzip -t dist/site/downloads/app-flow-reader-chrome.zip`.
  Transcript: `.factory/evidence/polish-3/clean-full-suite.log`.
- The final static build is 6.71 kB gzip JavaScript and 4.65 kB gzip CSS. The
  packaged extension ZIP is 16.56 kB.

### Production cold check

- `verify-url.sh` passed without console/page errors for `/`, `/?demo=1`,
  `/privacy`, and `/terms`; each has `lang=en`, one H1, one main landmark,
  labeled buttons, and no missing image alt text. Screenshots and reports are
  under `.factory/evidence/polish-3/live-{home,demo,privacy,terms}/`.
- Fresh 390 × 844 production audit found the plain first-screen job, audience,
  action, and all three facts within the viewport; `?demo=1` opened the
  five-step route with banner, Reset demo, and Leave demo. Edit → Leave →
  re-enter discarded the edit with empty durable web storage and no
  cross-origin requests.
- The same cold audit confirmed route titles, descriptions, canonical/OG/Twitter
  URLs, heading focus on navigation and Back, HTTP 404 navigation and metadata,
  offline demo reload, zero serious/critical Axe issues in light and dark
  schemes, and a SHA-256 match between the live and tested extension ZIP.
  Evidence: `.factory/evidence/polish-3/live-audit.json`.
- Mobile Lighthouse against the custom domain: Performance 100, Accessibility
  100, Best Practices 100, SEO 100; LCP 843 ms, CLS 0, TBT 3 ms. Evidence:
  `.factory/evidence/polish-3/lighthouse-mobile.json`.

## Known gaps and next steps

None. The extension has no AI or cloud-sync feature because those are excluded
by the product brief; local Markdown and JSON export provide the intended
portable-data path.
