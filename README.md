# App Flow Reader

Follow saved routes through dense workplace apps.

App Flow Reader is a browser extension for people with progressive low vision. Record a named route once, then follow its 3–10 steps with current-step announcements, visible target outlines, and large Back and Next controls.

Live site: <https://app-flow-reader.sociobot.in>

Sample-data demo: <https://app-flow-reader.sociobot.in/?demo=1>

## What App Flow Reader does

- Keeps multiple named routes on this device.
- Uses accessible control names before visible text fallbacks.
- Ignores password controls and never stores typed values or screenshots.
- Pauses, resumes, annotates, exports, and deletes routes.
- Exports complete Markdown and JSON files.
- Works offline after the site and sample route are first loaded.

The free reader, exports, and accessibility features need no account. Public pages load no analytics, external fonts, or third-party scripts.

## Try the isolated sample route

Open `?demo=1` and use Back and Next to follow a five-step monthly expense route. Changes stay in page memory and do not touch real extension data. **Reset demo** restores the sample. **Start for real** discards edits and opens the extension download instructions.

## Install the extension

1. Download `app-flow-reader-chrome.zip` from the live site.
2. Unzip it.
3. Open your browser’s extensions page in Chrome, Edge, Brave, or a similar browser.
4. Turn on that page’s **Developer mode** setting.
5. Choose **Load unpacked**, then choose the unzipped folder.

Name a route in the toolbar popup and select **Start recording**. Complete 3–10 steps. Reopen the popup, select the route, then choose **Follow route**.

## Optional supporter license

A $12 one-time supporter license adds Blueprint, Graphite, and Sunrise notebook covers in the extension. It never gates the reader, exports, privacy controls, or accessibility features. After checkout, an installed extension restores the returned token; you can also paste it into **Supporter styles**.

## Develop locally

Requirements: Node.js 22 and npm 10.

```sh
npm ci
npm run dev
npm run dev:site
```

## Run all checks

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

`test:live-checkout` checks the production catalog entry and checkout redirect. It does not submit a payment.

The build produces `dist/site/`, `dist/extension/`, and the packaged extension at `dist/site/downloads/app-flow-reader-chrome.zip`.

## Deploy the website

Deploy `dist/site/` as the static artifact. Azure Static Web Apps reads `staticwebapp.config.json` for known SPA rewrites, a real 404 catch-all, security headers, and cache policy.

Manifest V3 is used for the packaged extension. Route state uses `chrome.storage.local`. The extension makes no background network request until a supporter token is restored. Verification then contacts only `api.sociobot.in`.

## Privacy and legal

Read `/privacy` and `/terms`. Support: <support@sociobot.in>.

## License

MIT. See [LICENSE](LICENSE).
