# Independent verification 7 — FAIL

Date: 29 August 2026 UTC

Candidate: `4fea5a8afce75905e5091db80385214b285ba5eb` (`main`)

Live URL: <https://app-flow-reader.sociobot.in>

Work order: `app-flow-reader-verify-7`

## Verdict

**FAIL — do not release this candidate.**

The deployed product is the candidate, the mandatory first-read gate passes,
all 15 declared claim tests pass after the clean lockfile install, and the
normal route workflow works. One High product defect and one Medium claims
contract defect remain:

1. A valid maximum-length note containing one unbroken token destroys the
   responsive width in both the demo and the installed extension popup.
2. The site says that the reader “waits for you,” but the non-activation
   behavior is absent from `.factory/claims.json` and is not asserted by its
   tagged tests.

No product code was modified during verification.

## Release-blocking defects

### High — valid note input makes the reader thousands of pixels wide

The note field accepts 280 characters, which is its documented input boundary.
Saving 280 `x` characters is therefore valid input, not malformed state.

- On the live 390 × 844 demo, the document grows from 390 CSS px to **2,766
  CSS px**. Chromium changes the layout viewport to 1,560 px while the visual
  viewport remains 390 px. The page appears zoomed out and requires horizontal
  navigation.
- On desktop, the same input grows a 1,440 px document to **2,988 px**.
- In a fresh install of the live extension ZIP, a 400 px popup grows to
  **2,561 px**; the note itself measures 2,495 px wide. Route controls and text
  can move outside the popup viewport.
- The cause is observable in both products: rendered `.note` and `.step-note`
  text has no long-token wrapping rule. This was diagnosed read-only; no fix
  was made.

This is release-blocking for a product designed specifically for people with
progressive low vision, and it violates the mobile/no-horizontal-loss and
boundary-input acceptance requirements.

Evidence:

- [Measured demo overflow](evidence/verification-7/note-boundary-overflow.json)
- [390 px demo screenshot](evidence/verification-7/note-overflow-mobile390.png)
- [Installed extension results](evidence/verification-7/live-extension-qa.json)
- [400 px extension screenshot](evidence/verification-7/live-extension-long-note.png)

### Medium — unlisted and untested non-activation claim

The live preview says: “The reader announces one instruction, outlines the
matching page control, and waits for you.” “Waits for you” is a user-facing
promise that the extension does not activate the target automatically. That
behavior is also an explicit non-goal in the researched brief.

No entry in `.factory/claims.json` states this promise. The
`@claim:guided-route` test checks announcement, highlighting, and Back/Next,
but never attaches an activation listener or asserts that target controls are
not clicked. Under the supplied claims contract, this unlisted claim fails the
review until the sentence is removed or a tagged sandbox test proves it.

## Mandatory first read and demo gate

**PASS.** A cold 1,440 × 900 live load answers all three questions in its first
screen:

- What: “Follow saved routes through dense workplace apps.”
- For whom: “For people with progressive low vision who need one reliable path
  through dense workplace apps.”
- First action: **Try it with sample data**, with “Follow a five-step expense
  route” beside it.

It also shows Private, Offline, and Free facts. The primary action opens
`/?demo=1` in one click. The resulting screen already contains a realistic
five-step expense route and a persistent “Demo — Sample data. Nothing is
saved” banner with **Reset demo** and **Start for real**.

At 390 × 844, the initial Next button ends at 837.45 px, every visible target
is at least 44 px, and the untouched demo has no horizontal overflow.

Evidence: [cold desktop](evidence/verification-7/first-read-desktop.png),
[cold mobile](evidence/verification-7/live-home-mobile390.png), and
[mobile demo](evidence/verification-7/live-demo-mobile390.png).

## Claims gate

`.factory/claims.json` exists and contains 15 well-formed entries. After
`npm ci`, every exact command was run separately through the packaged MV3
extension or demo entry point. All 15 passed:

| Claim | Result |
| --- | --- |
| `guided-route` | PASS |
| `private-capture` | PASS |
| `local-storage` | PASS |
| `extension-network` | PASS |
| `route-controls` | PASS |
| `export-files` | PASS |
| `no-account` | PASS |
| `demo-isolated` | PASS |
| `offline-reload` | PASS |
| `no-tracking` | PASS |
| `supporter-license` | PASS |
| `supporter-checkout` | PASS |
| `browser-page-boundaries` | PASS |
| `mv3-package` | PASS |
| `license-return` | PASS |

Extension-only cases have one expected mobile-project skip; the desktop
Chromium extension case executes and passes. Full output is retained in
[claims-after-install.log](evidence/verification-7/claims-after-install.log).
The separate unlisted-claim defect above means the claims inventory as a whole
does not meet the acceptance contract despite the declared tests passing.

## Clean checkout gates and exact build

- `npm ci`: PASS; 171 packages installed, 0 vulnerabilities.
- `npm test`: PASS; 6 unit tests and 35 Playwright tests passed; 11 deliberate
  project skips.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run check:package`: PASS.
- `npm run check:copy`: PASS.
- `npm audit --audit-level=high`: PASS; 0 vulnerabilities.
- `npm run test:a11y`: PASS; 3 tests passed, 1 expected extension/mobile skip.
- `npm run test:live-checkout`: PASS; HTTP 303 to hosted Dodo checkout.
- `npm run build`: PASS; produced `dist/site`, `dist/extension`, and the ZIP.
- `unzip -t dist/site/downloads/app-flow-reader-chrome.zip`: PASS for all 11
  files.

Logs are under `.factory/evidence/verification-7/`.

## End-to-end product exercise

Normal and recovery behavior passed:

- The demo moved from step 1 to step 2, maintained exactly one
  `aria-current="step"`, and announced “Step 2 of 5. Choose New report.”
- A normal note saved, whitespace-only note input cleared after rerender, a
  removed step restored with Undo, and Reset returned to five steps.
- Markdown and JSON downloads each contained all five sample steps.
- A fresh Chromium profile installed the live ZIP. It retained multiple named
  routes and capped a 12-click attempt at 10 total steps.
- Accessible-name capture stored “Save report.” A password control's label and
  typed value were absent from storage.
- Playback announced the route, highlighted the matching target with a 4 px
  outline, and exposed 112 × 48 px Back and Next controls.
- A blank route title recovered as “Untitled app route.” An empty license
  restore produced “Paste a supporter license token first.”
- The downloaded extension exported complete Markdown and JSON files.

The maximum-length note case then reproduced the High defect above.

## Accessibility and responsive checks

- `/opt/fleet/lib/verify-url.sh` passed `/`, `/demo`, `/privacy`, and `/terms`:
  HTTP 200, route-specific title, `lang=en`, one H1, a main landmark, complete
  image alternatives, named buttons, and no load errors.
- Fresh live Axe scans found zero serious or critical issues on home, demo,
  privacy, terms, and the designed 404 in light and dark reduced-motion modes.
  The installed extension popup also had zero serious or critical issues in
  light and dark modes.
- Keyboard smoke passed: first Tab focuses the skip link with a 3 px orange
  outline, Enter focuses main, the note dialog receives focus, Escape closes
  it, and focus returns to the invoking button.
- The ordinary 390 px demo has no undersized targets or horizontal overflow;
  200% root text retains the action without overflow.
- Reduced motion resolves transition and animation duration to `0.00001s` and
  scroll behavior to `auto`.
- Manual NVDA testing was unavailable in this Linux worker. The product makes
  no conformance claim; live regions, semantics, focus, name/role/state, and
  dialog behavior were exercised instead.

## Privacy, deployment, links, and service behavior

- The complete live demo flow made no cross-origin request and left cookies,
  localStorage, sessionStorage, and IndexedDB empty.
- The installed extension made no external request during recording or
  playback. Its manifest requests only `storage`, `activeTab`, and the
  Sociobot verification host; content scripts match only HTTP(S) pages.
- Security headers include HSTS, `nosniff`, `X-Frame-Options: DENY`, a strict
  referrer policy, restrictive camera/microphone/geolocation policy, and CSP
  with `frame-ancestors 'none'` and only the documented API in `connect-src`.
- HTML uses 30-second revalidation; hashed JS/CSS are immutable for one year;
  the ZIP caches for one hour; `sw.js` is `no-cache`.
- Service-worker `registration.update()` completed. After priming, `/demo`
  reloaded offline with five steps and Next advanced to step 2.
- All rendered links returned expected 200 or 303 responses; mail links were
  recognized without fetching. An unknown route returned the designed HTTP
  404.
- The supporter verification endpoint allowed **30 requests per client
  burst**. Requests 31–35 returned HTTP 429 with `Retry-After: 4`; CORS allowed
  the product origin.
- There is no sign-in flow, so Microsoft Entra authority validation is not
  applicable.

Evidence: [rate-limit.json](evidence/verification-7/rate-limit.json),
[link-crawl.json](evidence/verification-7/link-crawl.json), and
[deployment identity and headers](evidence/verification-7/deployment-identity-and-headers.txt).

## Performance and deployment identity

Fresh mobile Lighthouse completed successfully: Performance 100,
Accessibility 100, Best Practices 100, SEO 100; FCP 0.8 s, LCP 0.8 s, TBT
0 ms, Speed Index 0.8 s, CLS 0, and 13 KiB total transfer.

The build ships 19,566 bytes JavaScript (6.79 kB gzip), 17,704 bytes CSS
(4.68 kB gzip), no fonts, a 36.45 kB unpacked extension, and a 16,646-byte ZIP.
All are inside the supplied budgets.

Production matches the candidate byte for byte:

| Artifact | SHA-256 | Match |
| --- | --- | --- |
| `index.html` | `4336294792b7f15d7f2890b6787f80375487101b57cac6682ab5bbef1aadb579` | yes |
| `assets/index-B-JF3TR4.js` | `0395ddfa80720b0a9336292b2139b99e8825c1539a4049bb36466e493c98fe85` | yes |
| `assets/index-otP4ZuKq.css` | `0fdf6e7c730bdad9cf289696d2c8bf32faccc96877f47e1899f25bf67541aa4d` | yes |
| `sw.js` | `de8ef9a504c883bc9999831b9e35f939d74f7aab2744142acb517aeda4e6b256` | yes |
| extension ZIP | `9ab35b1a212fc16e7e09f96e1413425f51ccae90aaed64bae6b14dc7063f3b0a` | yes |

Lighthouse evidence:
[lighthouse-mobile-clean.json](evidence/verification-7/lighthouse-mobile-clean.json).

## Defects by severity

- Critical: none.
- High: maximum-length unbroken notes break responsive width in the demo and
  installed extension popup.
- Medium: the “waits for you” non-activation promise is unlisted and untested.
- Low: none.

## Required next steps

1. Add long-token wrapping to notes in both the site demo and extension popup,
   and add a 280-character desktop/390 px/popup regression test that asserts
   `scrollWidth <= innerWidth` after saving.
2. Either remove “waits for you” or add a claims entry with a tagged test that
   installs a target activation listener and proves playback never fires it.
3. Rebuild, deploy, and repeat the full claims and independent verification
   gates.
