# App Flow Reader visual thesis

## Direction

The product looks like a field engineer's flow notebook: warm paper, precise blueprint lines, correction marks, and numbered junctions. A recorded path is the subject, so the signature graphic is a ruled line connecting discrete steps. The site avoids generic feature cards and decorative gradients.

## Palette

| Token | Light | Dark | Purpose |
| --- | --- | --- | --- |
| Paper | `#f1ebdd` | `#101923` | Working surface |
| Surface | `#fffdf7` | `#172432` | Flow sheets and dialogs |
| Ink | `#132031` | `#f4efe4` | Primary text and hard outlines |
| Muted | `#52616c` | `#bdc8d1` | Supporting text |
| Blueprint | `#1d4f91` | `#76a9e7` | Primary action and flow nodes |
| Correction orange | `#c2410c` | `#ff8258` | Focus, labels, and the active path |
| Tab yellow | `#f4c84b` | `#f2c54b` | Temporary notes and demo state |
| Danger | `#982b2b` | `#ff9999` | Destructive actions |

Primary body and muted text combinations meet WCAG AA. Orange is used for large labels or non-text emphasis, never as the only state cue.

## Type and spacing

Georgia supplies the editorial, document-like headings. The system UI stack keeps controls direct and fast. System monospace marks step numbers and technical labels. No font files or third-party requests are required. Spacing follows an 8 px rhythm with 4 px half-steps for borders and compact labels. Body text begins at 16 px.

## Shape and interaction grammar

Flow documents use square paper edges, two-pixel rules, offset ink shadows, numbered circles, and one connecting orange line. Buttons press two pixels into their shadows. Removing a step exposes an Undo bar. Notes open from their source step and return focus through the native dialog model.

## Motion policy

Only the primary button press and route scroll use movement. Both describe a state change and finish within 200 ms. `prefers-reduced-motion` removes transforms, smooth scrolling, and transition duration. Nothing loops, flashes, or autoplays.

## Responsive intent

At 390 px, the flow becomes a single ruled column, export actions stack, and supporting desktop chrome disappears behind a labeled menu. Touch targets remain at least 44 px. The task steps, demo state, and export controls remain visible.

## Original asset provenance

The branching-path mark, favicon, extension icons, and 1200 × 630 social preview were hand-authored as SVG for this product on 28 August 2026. Raster versions were rendered locally with Playwright. No stock, generated, trademarked, or third-party artwork is included. Model-generated imagery was intentionally omitted because the diagram itself explains the product more clearly.
