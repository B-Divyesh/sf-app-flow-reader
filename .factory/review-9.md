# Follow saved routes through dense workplace apps — review 9

Date: 6 September 2026 UTC

Live URL: <https://app-flow-reader.sociobot.in>

Implementation candidate: `83326ef0d6740214f2096d29eaf0def996063b08`

Documentation reviewed: `d39ded489c4fe18ea3e249fdc1223fb52ffc1219`

The commits after the implementation candidate change only `.factory` review,
verification, and handoff documents. The live HTML, JavaScript, CSS, service
worker, and extension ZIP match a clean build from the reviewed checkout.

## Verdict

**PASS — zero findings and zero untested claims.**

No critical, high, medium, or minor defect was found. This is a static site and
Manifest V3 extension, not a product backend. Tenant isolation, backend health,
SQLite restart persistence, and backend 429 handling are therefore not
applicable.

## First screen before scrolling

Fresh Chromium browsers opened the live home page at 390 × 844 and 1440 × 900.
Neither browser had prior product state, and neither page was scrolled.

| Question | Visible answer | Result |
| --- | --- | --- |
| Job | “Follow saved routes through dense workplace apps” | Clear and under nine words. |
| Audience | “For people with progressive low vision who need one reliable path through dense workplace apps.” | Names the user and situation. |
| First action | **Try it with sample data** beside “Follow a five-step expense route.” | Clear result in one click. |

The phone action ended at 505 px and the three Private, Offline, and Free facts
ended at 746 px, inside the 844 px first screen. The desktop facts ended at
897 px, inside its 900 px first screen. The route-notebook design matches
`.factory/design.md` and does not use a generic hero or decorative gradient.

## One-click sample and isolation

- The first action opened `/?demo=1` in one click.
- The populated result immediately showed “Submit a monthly expense report,”
  five realistic Ledger steps, Step 1 of 5, and enabled Back/Next controls.
- The persistent banner read “Demo — Sample data. Nothing is saved.” and kept
  **Reset demo** and **Start for real** visible after advancing and editing.
- Next moved to Step 2, kept one `aria-current="step"`, and announced “Step 2
  of 5. Choose New report.”
- A 280-character unbroken note stayed inside both the 390 px and 1440 px
  viewports. Reset removed it and restored Step 1 of 5 and all five steps.
- Markdown and JSON exports each contained all five steps.
- Start for real discarded the edit and opened the extension download
  instructions. Direct re-entry restored the untouched sample.
- Cookies, localStorage, sessionStorage, and IndexedDB remained empty. The
  complete sample exercise made no cross-origin request. Real extension data
  was not read or changed.

## Claims

I cloned the checkout to `/tmp/app-flow-reader-review9.6O02Fm`, ran `npm ci`,
and ran each exact command from `.factory/claims.json` separately. Every claim
has exactly one tagged test. All 16 commands passed:

| Claim | Result |
| --- | --- |
| `guided-route` | PASS — 1 desktop extension test; 1 expected mobile-extension skip |
| `playback-waits` | PASS — 1 desktop extension test; 1 expected mobile-extension skip |
| `private-capture` | PASS — 1 desktop extension test; 1 expected mobile-extension skip |
| `local-storage` | PASS — 1 desktop extension test; 1 expected mobile-extension skip |
| `extension-network` | PASS — 1 desktop extension test; 1 expected mobile-extension skip |
| `route-controls` | PASS — 1 desktop extension test; 1 expected mobile-extension skip |
| `export-files` | PASS — desktop and phone |
| `no-account` | PASS — desktop and phone |
| `demo-isolated` | PASS — desktop and phone |
| `offline-reload` | PASS — desktop and phone |
| `no-tracking` | PASS — desktop and phone |
| `supporter-license` | PASS — 1 desktop extension test; 1 expected mobile-extension skip |
| `supporter-checkout` | PASS — desktop and phone |
| `browser-page-boundaries` | PASS — 1 desktop extension test; 1 expected mobile-extension skip |
| `mv3-package` | PASS — 1 desktop extension test; 1 expected mobile-extension skip |
| `license-return` | PASS — desktop and phone |

Landing, README, Privacy, and Terms copy was checked against the inventory.
No public product claim is missing from `.factory/claims.json`. The checked
copy audit reports no sentence over 22 words and no banned word. The brief
explicitly excludes AI, cloud sync, and team accounts; Markdown and JSON cover
the implied portable-data need, so there is no missed-leverage finding.

## Normal, invalid, boundary, and recovery paths

- Normal: a fresh packaged extension records named routes, saves multiple
  routes, announces playback, outlines the matching control, and exposes large
  Back and Next controls.
- Passive playback: target activation listeners remained at zero while the
  reader highlighted the target and waited.
- Invalid/private input: password controls, typed values, screenshots, and
  privileged browser URLs are excluded; an empty token gets a clear
  instruction; a revoked token locks only decorative covers.
- Boundaries: burst recording remains ordered and stops at ten steps; a
  280-character unbroken note fits both the live demo and 400 px popup.
- Recovery: pause/resume, remove/Undo, cancel/confirm delete, reset, export,
  stale-license recheck, and offline reload all passed.
- The packaged artifact was exercised in a clean Chromium extension profile.
  The live ZIP is byte-for-byte identical to that clean build.

## Accessibility, routes, privacy, and offline behavior

- `/opt/fleet/lib/verify-url.sh` passed live home, demo, privacy, and terms:
  HTTP 200, route title, `lang=en`, one H1, a main landmark, image alternatives,
  named buttons, and no console or page error.
- Fresh Playwright Axe scans found no serious or critical issue on home, demo,
  privacy, terms, or the designed missing page in light and dark modes with
  reduced motion.
- The first Tab focused the skip link with a 3 px orange outline. Enter moved
  focus to main. The note dialog focused its labeled field; Escape closed it
  and restored the invoking control. Route navigation focused the new H1 and
  announced it; browser Back restored and announced the home H1.
- At 390 px, visible targets were at least 44 px and pages had no horizontal
  overflow. Simulated 200% root text also retained the content without
  horizontal overflow.
- Reduced motion was detected; transitions reduced to `0.00001s` and scrolling
  became `auto`.
- Home, demo, privacy, and terms returned 200. `/missing-review-9` returned the
  intended designed HTTP 404 with the standard header, footer, route title,
  H1, main landmark, and return action. This expected 404 is not a defect.
- The same-origin routes, `robots.txt`, `sitemap.xml`, and extension download
  returned 200. The supporter action returned the intended HTTPS 303 to the
  hosted checkout. Mail links were recognized but not fetched. The external
  Param Factory site was not opened because it is outside this work order.
- Privacy offers a clear deletion action and contact address. Public pages and
  the demo made no third-party request. The manifest limits hosts to the
  Sociobot license verification API and content scripts to HTTP(S) pages.
- The service worker updated with one active worker and no waiting worker.
  After priming, the live demo reloaded offline with five steps and advanced
  to Step 2.
- There is no product backend, login, or tenant data store. The optional
  license service is external to this static product; the checkout smoke test
  passed without submitting payment.

## Site structure and performance

Each live route has its own title, description, canonical URL, Open Graph and
Twitter metadata, one H1, one main landmark, shared navigation, and shared
footer. The 404 has matching metadata and navigation. Security headers include
HSTS, `nosniff`, strict-origin referrer policy, restrictive permissions, frame
denial, and a CSP with `frame-ancestors 'none'` in the response header.

The clean build produced `dist/site`, `dist/extension`, and the extension ZIP.
Initial JavaScript is 19,586 bytes (6,841 gzip), CSS is 17,790 bytes (4,714
gzip), and there is no font payload. A fresh mobile Lighthouse run scored 100
for Performance, Accessibility, Best Practices, and SEO: FCP 0.8 s, LCP 0.9 s,
TBT 0 ms, and CLS 0.

## Live candidate identity

| Artifact | SHA-256 | Live matches clean build |
| --- | --- | --- |
| `index.html` | `9a1ab31eebc8cded591c8f1d6ad3aded260f2753561c4ba63e2989f61f864bda` | Yes |
| JavaScript | `c203ac4c54ff55e1b61803ded68f6d26f5bad496a4ab998954c5086895340cc9` | Yes |
| CSS | `25152aaef36855bdf4f7672fc14a3b9bdf46ed82f45560db717d414c8a4352f4` | Yes |
| `sw.js` | `de8ef9a504c883bc9999831b9e35f939d74f7aab2744142acb517aeda4e6b256` | Yes |
| Extension ZIP | `56ae7b148c0fd22de6853cf1a7d833fcd6582cb5d64be46d3c01da71a8674599` | Yes |

## Earlier findings

Every earlier review and verification report was read. Each prior issue was
rechecked against the live product and current tests.

| Earlier finding | Current proof | Disposition |
| --- | --- | --- |
| Original C1 — wrong product/job | First read and packaged `guided-route` prove the low-vision 3–10-step route reader. | Fixed |
| Original H1 — rapid clicks lost | The burst test records the ordered ten-step cap. | Fixed |
| Original H2 — accessible names/passwords | `private-capture` proves accessible-name precedence and password/value exclusion. | Fixed |
| Original H3 — dark contrast | Live and local light/dark Axe matrices have no serious or critical issue. | Fixed |
| Original H4 / F-1-3 / F-3-1 — claim gaps | Sixteen atomic claims each have one passing tagged test; copy has no unmapped claim. | Fixed |
| Original M1 — small controls | Phone targets are at least 44 px; reader controls are 52 px. | Fixed |
| Original M2 — soft 404 | A missing live URL returns the designed page with HTTP 404. | Fixed |
| Original M3 / F-1-1 — paid result absent | The packaged supporter test covers valid, cached, stale, revoked, and three-cover states while reading stays free. | Fixed |
| Verification-2 H1 — checkout unavailable | Live checkout returns its intended 303 hosted-checkout redirect. | Fixed |
| Verification-4 M1 / F-1-5 — demo exit missing or unclear | Start for real explicitly discards sample data and opens download instructions. | Fixed |
| F-1-2 — demo edit survived exit | Live edit, exit, and re-entry restore untouched memory-only data. | Fixed |
| F-1-4 — first-screen facts absent | Private, Offline, and Free/$12 are visible before scrolling on phone and desktop. | Fixed |
| F-1-6 — inconsistent app terms | Landing, footer, and README use “dense workplace apps.” | Fixed |
| F-1-7 / F-1-8 — README jargon | README opens with the audience/job and keeps storage API terms in development details. | Fixed |
| F-1-9 — context-free README headings | Current headings name the product or action. | Fixed |
| F-1-10 — stale route metadata | Home, demo, privacy, terms, and 404 have route-specific metadata. | Fixed |
| F-1-11 — noun-only note action | The visible action is **Edit note** with a specific accessible name. | Fixed |
| F-2-1 — unexplained install jargon | Site and README explain the browser extensions page before browser labels. | Fixed |
| F-2-2 / F-2-3 — incomplete 404 shell/metadata | The 404 has the shared shell, icons, theme colors, canonical, and social metadata. | Fixed |
| F-5-1 — metaphorical hero line | The current label is “Browser extension for progressive low vision.” | Fixed |
| F-6-1 — undisclosed checkout exit | The action says it opens secure checkout; the redirect test passes. | Fixed |
| F-7-1 — mobile Next below first screen | The enabled phone Next action remains inside the 844 px initial viewport. | Fixed |
| Verification-7 high — long-note overflow | Live desktop/phone and packaged-popup boundary checks stay within their viewports. | Fixed |
| Verification-7 medium — passive playback untested | `playback-waits` proves target controls are never activated. | Fixed |

Reviews 4 and 8 and verifications 3, 5, 6, and 8 reported no remaining
finding. No earlier minor issue regressed.

## Clean-checkout commands

All commands completed successfully after `npm ci`:

```text
all 16 exact commands in .factory/claims.json
npm test                         6 unit passed; 37 browser passed; 13 expected skips
npm run typecheck               passed
npm run lint                    passed
npm run test:claims             23 passed; 9 expected skips
npm run test:a11y               3 passed; 1 expected skip
npm run test:live-checkout      passed
npm run check:package           passed
npm run check:copy              passed
npm audit --audit-level=high    zero vulnerabilities
npm run build                   passed
unzip -t ...chrome.zip          passed, 11 entries
```

Evidence is stored under `/work/.evidence/review-9/`. Product code was not
modified.
