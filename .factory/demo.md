# Demo sandbox

- URL: `https://app-flow-reader.sociobot.in/?demo=1` (also available at `/demo`)
- Local URL: `http://127.0.0.1:4173/?demo=1`
- Entry point: select **Try it with sample data** on the first screen.
- Sample: a five-step route for submitting monthly expenses in the fictional Ledger workplace app.
- Main action: use the 52 px **Back** and **Next** controls to read one instruction at a time. The current route step has a thick outline.
- Other actions: edit a note, remove and undo a step, reset, export Markdown, or export JSON.
- Reset: select **Reset demo** in the persistent yellow demo banner.
- Start for real: select **Start for real** to discard sample changes and open the extension download instructions.
- Direct entry: `?demo=1` and `/demo` both start from the first sample step in a fresh page.

The demo state exists only in the page's JavaScript memory. It never reads or writes the extension namespace, localStorage, sessionStorage, IndexedDB, or a backend. Reloading or starting for real discards every demo change.
