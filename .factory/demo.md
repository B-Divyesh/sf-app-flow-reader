# Demo sandbox

- URL: `https://app-flow-reader.sociobot.in/demo`
- Local URL: `http://127.0.0.1:4173/demo`
- Entry point: select **Try it with sample data** on the first screen.
- Sample: a five-step flow for inviting an Editor to the fictional Northstar workspace.
- Actions: edit a note, remove and undo a step, reset, export Markdown, or export JSON.
- Reset: select **Reset demo** in the persistent yellow demo banner.
- Leave: select **Start for real** to return to the extension download path.

The demo state exists only in the page's JavaScript memory. It does not read or write the extension's `chrome.storage.local` data, localStorage, sessionStorage, IndexedDB, or a backend. Reloading or leaving the page discards changes.
