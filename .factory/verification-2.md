# Independent verification 2 — FAIL

Date: 28 August 2026 UTC  
Candidate: `a993c4795eb284174b0d265cde0c92b1daa11cec` (`main`)  
Live URL: <https://app-flow-reader.sociobot.in>

## Verdict

**FAIL — do not release this candidate.**

The free App Flow Reader product is healthy and the live deployment is an exact
match for this candidate. It satisfies the researched low-vision route-reading
job in the tested flows. Release is blocked by the advertised paid feature:
the live **Buy supporter license** link returns HTTP 404, so a visitor cannot
complete the stated $12 one-time purchase. This is a live deployment/billing
configuration failure, not a source-build failure.

## Mandatory first-read and demo gate

Fresh cold desktop read of `/`:

- **What it does:** “Follow saved routes through busy web apps.”
- **For whom:** “For people with progressive low vision who need a reliable
  path through dense workplace software.”
- **What to click first:** **Try it with sample data**, followed immediately by
  “Follow a five-step expense route.”

This passes the plain-words and one-click-demo gate. The action opens `/demo`,
whose persistent banner states “Demo — Sample data. Nothing is saved”; it has
Reset demo and Start for real. Fresh desktop and 390 × 844 runs advanced from
step 1 to 2, announced “Step 2 of 5. Choose New report,” kept exactly one
current marker, and displayed five sample steps.

## Claims gate

`.factory/claims.json` exists and declares ten claims. Before the remaining
QA work, every listed exact command was invoked individually from the candidate
checkout:

| Claim | Exact test | Result |
| --- | --- | --- |
| guided-route | `npm run test:e2e -- --grep @claim:guided-route` | PASS |
| private-capture | `npm run test:e2e -- --grep @claim:private-capture` | PASS |
| local-storage | `npm run test:e2e -- --grep @claim:local-storage` | PASS |
| route-controls | `npm run test:e2e -- --grep @claim:route-controls` | PASS |
| export-files | `npm run test:e2e -- --grep @claim:export-files` | PASS |
| no-account | `npm run test:e2e -- --grep @claim:no-account` | PASS |
| demo-isolated | `npm run test:e2e -- --grep @claim:demo-isolated` | PASS |
| offline-reload | `npm run test:e2e -- --grep @claim:offline-reload` | PASS |
| no-tracking | `npm run test:e2e -- --grep @claim:no-tracking` | PASS |
| supporter-license | `npm run test:e2e -- --grep @claim:supporter-license` | PASS |

The subsequent clean-install full suite also ended with Playwright
`test-results/.last-run.json` status `passed` and no failed tests. The
supporter-license test uses a recorded/intercepted successful verification
response; it does not exercise the live checkout, which is why it missed the
release blocker below.

## Release-blocking defect

### High — H1: The advertised supporter purchase is unavailable in production

The landing page, README, and terms promise “Buy supporter license” and a
“$12 one-time supporter license.” Its actual target,
`https://api.sociobot.in/api/v1/products/app-flow-reader/checkout`, returned:

```text
HTTP/2 404
{"error":"enabled factory product","status":404}
```

The site link crawl found every other route/download/footer link healthy; this
checkout is the only HTTP failure. The researched brief specifies one-time
monetization and the product has chosen to expose this optional paid tier, so a
working checkout is part of the released product contract. Enable/register the
Sociobot product at that endpoint, then re-run checkout/return-token/
verification QA. No change to the free reader is required.

## Functional, privacy, accessibility, and policy evidence

- `npm ci` completed: 171 packages installed, audit reported 0 vulnerabilities.
- `npm test` passed: 6 Vitest tests plus the Playwright matrix; the final
  result file reported `status: passed`, `failedTests: []`.
- `npm run typecheck`, `npm run lint`, `npm run check:package`,
  `npm run check:copy`, `npm run build`, ZIP integrity, and
  `npm audit --audit-level=high` all passed. The production build produced
  `dist/site/`, `dist/extension/`, and `dist/site/downloads/app-flow-reader-chrome.zip`.
- `npm run test:a11y` passed. Fresh live axe in light and dark reduced-motion
  modes found no serious/critical findings on desktop or 390 px mobile.
  `/opt/fleet/lib/verify-url.sh` also passed `/` and `/demo`: HTTP 200,
  title, `lang=en`, one h1, main landmark, no missing image alt, no unlabeled
  buttons, and no console/page errors.
- Keyboard smoke test passed live: the first Tab reaches the skip link with a
  3 px orange focus outline; Enter moves focus to main. The demo note dialog
  receives focus, Escape closes it, and focus returns to its invoking button.
  Reduced motion resolves transitions to `0.00001s` and scrolling to `auto`.
- Demo privacy passed: no external requests during the demo, and its
  localStorage, sessionStorage, and IndexedDB namespaces remained empty.
  A cold home load requested only same-origin HTML, JS, and CSS. The extension
  manifest is MV3 and requests only `activeTab` and `storage`.
- Service worker update succeeded (`active: true`, controller present). After
  priming, `/demo` reloaded offline with five steps and could advance.
- Live policy and cache headers are present: HSTS, CSP, `nosniff`, strict-origin
  referrer policy, frame denial, and camera/microphone/geolocation denial.
  HTML is `max-age=30, must-revalidate`; hashed JS is one-year immutable;
  `sw.js` is `no-cache`; ZIP is one hour. Known routes return 200 and an
  unknown route returns a styled HTTP 404.
- The live verify endpoint accepts the product origin by CORS and is rate
  limited. A burst of 40 concurrent invalid-license requests produced 30
  HTTP 200 responses and then 10 HTTP 429 responses with `Retry-After: 4`.
  There is no sign-in flow, so Entra tenant validation is not applicable.
- Bundle budgets pass: initial site JS 20.80 kB raw / 7.22 kB gzip; CSS
  17.68 kB raw / 4.70 kB gzip; unpacked extension 31.03 kB; ZIP 15.04 kB.
  A fresh mobile Lighthouse retry completed with Performance 100,
  Accessibility 100, Best Practices 100, SEO 100; FCP 0.4 s, LCP 0.4 s,
  TBT 0 ms, CLS 0.

## Deployment identity

Fresh SHA-256 comparisons confirm the deployment is the tested candidate:

| Artifact | SHA-256 | Match |
| --- | --- | --- |
| `index.html` | `38088a5c6e4e43c8cbaed3a7acfcbc734fc0119b833dcd4ce2974c38b477a786` | yes |
| `assets/index-Ckl653Wu.js` | `5f08ef781d9fafd1d517c0bc5d45979121a69c0836d8251351de66a39a59c645` | yes |
| `sw.js` | `ce3981be73c688b4208b60e42dd54e4065558d6ddd639c2cdf185d55928fb7a3` | yes |
| extension ZIP | `1a4ba4f9b98719dddbec20cda9c44f4d847446132efedf6ecc936b53ad8f2c21` | yes |

Ignored working evidence is retained under `.factory/evidence/verify-2/`,
including the cold-read screenshot, live browser QA JSON, verify-url results,
and Lighthouse JSON. No product source code was modified during verification.
