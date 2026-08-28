# App Flow Reader

Record browser tasks as ordered steps and export a readable flow.

App Flow Reader is a Manifest V3 extension for product managers, QA testers, support writers, and designers. Start on a web page, complete the task once, then export the labeled steps as Markdown or JSON. Your flow stays in Chrome local storage, and no account is needed.

Live site: <https://app-flow-reader.sociobot.in>

Sample-data demo: <https://app-flow-reader.sociobot.in/demo>

## What it records

- The label of a clicked link, button, or form control
- Page addresses and page-title changes
- The recording time and order

It does not record screenshots, passwords, or typed form values. Browser-internal pages such as `chrome://settings` do not allow content scripts.

## Install the extension

1. Download `app-flow-reader-chrome.zip` from the live site.
2. Unzip it.
3. Open `chrome://extensions` in Chrome or another Chromium browser.
4. Turn on **Developer mode**.
5. Select **Load unpacked**, then choose the unzipped folder.

Select the toolbar icon on the first page of a task. Choose **Start recording**, complete the task, then open the icon again to pause or export.

## Develop

Requirements: Node.js 22 and npm 10.

```sh
npm install
npm run dev          # WXT extension development
npm run dev:site     # static site at http://localhost:5173
```

## Verify

The deterministic clean-build command from the factory work order is:

```sh
npm ci && npm test && npm run build:site
```

Additional focused checks:

```sh
npm run typecheck
npm run test:claims
npm run test:a11y
npm run check:package
npm run check:copy
npm run package:extension
```

`npm run build:site` produces:

- `dist/site/` — deployable static site
- `dist/site/downloads/app-flow-reader-chrome.zip` — packaged extension download
- `dist/extension/` — unpacked Chromium extension

## Deploy

Deploy `dist/site/` as a static site. Azure Static Web Apps reads `staticwebapp.config.json` from that directory for SPA routes, security headers, and caching.

## Privacy and legal

The privacy policy is at `/privacy`; terms are at `/terms`. No analytics, external fonts, third-party scripts, AI service, or payment provider is used.

## License

MIT. See [LICENSE](LICENSE).
