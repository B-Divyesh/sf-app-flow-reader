# App Flow Reader visual thesis

## Direction

The product looks like a low-vision worker's route notebook: warm paper, precise blueprint lines, correction marks, and oversized numbered junctions. A reliable path is the subject, so the signature graphic is a ruled line connecting discrete steps. The dark reader panel uses unusually strong borders and large controls because it must remain findable inside visually dense workplace software. The site avoids generic feature cards and decorative gradients.

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

Route documents use square paper edges, two-pixel rules, offset ink shadows, numbered circles, and one connecting orange line. The current step gains a four-pixel orange outline. The injected reader uses a near-black field, a coral edge, and 48 px or larger Back and Next controls. Buttons press two pixels into their shadows. Removing a step exposes an Undo bar. Notes open from their source step and return focus through the native dialog model.

The optional Blueprint, Graphite, and Sunrise covers now apply to the extension popup itself, after a valid supporter license is restored there. They only change the notebook paper behind the reader controls; route reading, exports, and all accessibility controls remain identical and free.

## Motion policy

Only the primary button press and current-step scroll use movement. Both describe a state change and finish within 200 ms. `prefers-reduced-motion` removes transforms, smooth scrolling, and transition duration. Nothing loops, flashes, or autoplays.

## Responsive intent

At 390 px, the route becomes a single ruled column, export actions stack, and supporting desktop chrome disappears behind a labeled menu. Touch targets remain at least 44 px. The current instruction and 52 px demo Back and Next controls precede the full route.

## Contrast repair

Dark-mode section markers use `#244f80` behind white text, and the boundaries band uses `#173d67` behind white text. These replace the candidate's pale-blue dark-mode band that produced seven serious axe contrast failures. Automated axe coverage now runs every route in both color schemes.

## Original asset provenance

The branching-path mark, favicon, extension icons, and 1200 × 630 social preview were hand-authored as SVG for this product on 28 August 2026. Raster versions were rendered locally with Playwright. No stock, generated, trademarked, or third-party artwork is included. Model-generated imagery was intentionally omitted because the diagram itself explains the product more clearly.
