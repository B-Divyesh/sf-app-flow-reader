# Independent verification 8 — PASS

Date: 29 August 2026 UTC
Verifier work order: `app-flow-reader-verify-8`
Candidate: `f03baf2a702d93874440bc84cf82380c7a9f4228`
Production: <https://app-flow-reader.sociobot.in>

## Verdict

**PASS.** The live deployment is byte-for-byte the production build from the
candidate, all mandatory claims passed from a clean install, and independent
desktop, mobile, keyboard, privacy, offline, accessibility, and package checks
found no release-blocking defect.

## Required first read

Cold-opening the production home page says: **“Follow saved routes through
dense workplace apps.”** It says it is **for people with progressive low
vision** who need a reliable path through such apps. The first primary action
is **“Try it with sample data”**, with the adjacent explanation **“Follow a
five-step expense route.”** This is a plain, one-click demo and passes the
plain-words and demo-sandbox gates.

## Clean-checkout gates

`git status --short` was empty before installation. `npm ci` completed (171
packages; `npm audit --audit-level=high` reported zero vulnerabilities).

All 16 commands declared in `.factory/claims.json` were run individually,
from that install, before other QA. Every command exited 0:

| Claim IDs | Result |
| --- | --- |
| `guided-route`, `playback-waits`, `private-capture`, `local-storage` | PASS |
| `extension-network`, `route-controls`, `export-files`, `no-account` | PASS |
| `demo-isolated`, `offline-reload`, `no-tracking`, `supporter-license` | PASS |
| `supporter-checkout`, `browser-page-boundaries`, `mv3-package`, `license-return` | PASS |

The full repository suite also passed: `npm test` produced six passing unit
tests and a passing 50-test Playwright run (`test-results/.last-run.json`:
`{"status":"passed","failedTests":[]}`). The extension-only mobile cases
are intentional skips. The dedicated `npm run test:a11y` suite passed its
three applicable Axe suites (one intentional mobile-extension skip).

| Command | Result |
| --- | --- |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run check:copy` | PASS — no unresolved long-sentence/banned-word flags |
| `npm run check:package` | PASS — lockfile install contract valid |
| `npm run test:live-checkout` | PASS — HTTPS 303 to `checkout.dodopayments.com` |
| `npm run build` | PASS — produced `dist/site`, `dist/extension`, and ZIP |
| `unzip -t dist/site/downloads/app-flow-reader-chrome.zip` | PASS — 11 entries, no archive errors |

The built landing JS is 19,586 bytes (6.80 KiB gzip) and CSS is 17,790 bytes
(4.71 KiB gzip), below the 200 KB / 50 KB budgets. Hashed JS is served with
`Cache-Control: public, max-age=31536000, immutable`; the service worker is
`no-cache`, as appropriate for updates.

## Independent product exercise

- Installed the freshly built MV3 package in a fresh Chromium profile.
  Recording a blank route name recovers safely to the default title; replacing
  it with “Quarterly access review” starts recording normally. The packaged
  flow code only promotes routes to the saved route list after the required
  three steps and caps recording at ten; the claim suite burst-tested 13
  inputs and observed the ten-step ceiling.
- Exercised the live `/demo`: five realistic expense-route steps, Next to
  “Step 2 of 5”, 280-character note, Markdown and JSON downloads, removal,
  Undo, and Reset. The route returned to “Step 1 of 5.”
- In a fresh live browser context the demo banner was present, and
  `localStorage`, `sessionStorage`, and IndexedDB were all empty. During the
  demo flow every request was same-origin.
- Keyboard-only testing focused the skip link (a visible `rgb(194,65,12)`
  3px outline), moved focus to `main`, focused the note field when opened, and
  returned safely after the dialog interaction.
- At 390 × 844, `/`, `/demo`, and `/404.html` had no horizontal overflow and
  no visible interactive target under 44 px. The enabled demo Next control
  ended at y=822, within the first viewport.
- After initial load the live service worker was active. With the context
  offline, `/demo` reloaded with five steps and advanced to “Step 2 of 5.” A
  subsequent `registration.update()` left one active, no-waiting worker.

## Accessibility, privacy, deployment, and policy

- `/opt/fleet/lib/verify-url.sh https://app-flow-reader.sociobot.in …` passed:
  HTTPS 200; title; `lang=en`; one H1; main landmark; zero missing image
  alternatives; zero unnamed buttons; zero console/page errors on normal home
  load (545 ms in this check).
- Independent Playwright Axe scans found **zero serious or critical** issues
  for `/`, `/demo`, `/privacy`, `/terms`, `/missing-path`, and `/404.html` in
  both light and dark colour schemes with reduced motion enabled. The packaged
  extension popup has the same passing Axe coverage in the repository suite.
- Cold home load made only three same-origin requests (document, local JS,
  local CSS), with no analytics, external fonts, or third-party scripts.
  Privacy and demo flows made no cross-origin request. The only optional
  extension network destination is license verification at
  `https://api.sociobot.in`.
- Production sends HSTS, `nosniff`, strict referrer policy, restrictive
  Permissions-Policy, `X-Frame-Options: DENY`, and a self-only CSP with
  `frame-ancestors 'none'` and the explicit Sociobot `connect-src` exception.
  `/definitely-missing` returned the designed HTTP 404. There is no sign-in,
  so Entra tenant validation is not applicable.
- CORS for the optional license verification request allows the production
  origin. Its documented/observed allowance is **30 requests per burst**:
  fresh invalid-token requests 1–30 returned 200; requests 31–35 returned
  **429** and each had **`Retry-After: 4`**.
- Fresh candidate build and production content hashes match exactly:

  | Artifact | SHA-256 |
  | --- | --- |
  | HTML | `9a1ab31eebc8cded591c8f1d6ad3aded260f2753561c4ba63e2989f61f864bda` |
  | JS | `c203ac4c54ff55e1b61803ded68f6d26f5bad496a4ab998954c5086895340cc9` |
  | CSS | `25152aaef36855bdf4f7672fc14a3b9bdf46ed82f45560db717d414c8a4352f4` |
  | Downloaded extension ZIP | `56ae7b148c0fd22de6853cf1a7d833fcd6582cb5d64be46d3c01da71a8674599` |

## Defects by severity

None found.

## Re-run

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
