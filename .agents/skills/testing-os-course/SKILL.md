---
name: testing-os-course
description: Test the interactive OS course React app (web/) end-to-end. Use when verifying lesson UI, animations, code highlighting, or navigation changes.
---

# Testing the OS course app

## Run
- `cd web && npm install && npm run dev -- --port 5173`, open http://localhost:5173.
- Lint/build gates: `npm run lint` (oxlint) and `npm run build` (tsc + vite) inside `web/`.

## Architecture map (for planning assertions)
- Lessons live in `web/src/lessons/<name>/` as three files: `steps.ts` (data: code lines to highlight, scene state, English narration string, note), `Scene.tsx` (SVG animation, framer-motion), `Lesson.tsx` (layout + Prev/Play/Next controls).
- A lesson is only reachable when its entry in `web/src/data/chapters.ts` has `status: "available"` AND it is routed in `web/src/App.tsx`. If a new lesson doesn't show, check both.
- Shared: `components/CodePane.tsx` (line highlighting + C tokenizer), `narration/useNarration.ts` (caption text; TTS provider is a stub).
- Glossary ("jargon decoder"): definitions live centrally in `web/src/data/glossary.ts`; each lesson's `steps.ts` exports `glossaryIds` (list order in sidebar) and per-step `terms` (which rows get the violet active highlight); rendered by `components/GlossaryPane.tsx` inside each `Lesson.tsx` aside. Single-open accordion; the "ask AI" button only renders if an `onAskAi` prop is wired (currently unwired — assert its absence).

## Test procedure that works well
1. Reload the page; click the lesson in the left sidebar (disabled lessons show a "soon" pill).
2. Step through with the "Next →" button; at each step assert: (a) highlighted code line numbers match `steps.ts`, (b) scene elements for that state, (c) step indicator `N / total` in the caption bar, (d) accumulated short notes with the active one gradient-highlighted.
3. Glossary checks: assert the term list matches the lesson's `glossaryIds` order; click a term → definition expands and chevron rotates; click another → previous collapses (accordion); step with Next → active highlight rows follow the current step's `terms`; an expanded definition should survive step changes.
3b. All visible text is English-only (the Hindi text feature and topbar language select were removed; Hindi may return only as future voice-over audio via `narration/provider.ts`). If bilingual `{ en, hi }` objects reappear in `steps.ts`/`glossary.ts`/`summaries`, assert against the intended design first — a `[object Object]` render means a string/record type mismatch.
4. Zoom screenshots of the code+scene region make the best evidence.

## Interactive controls (sliders, hover-to-inspect)
- Some scenes have TensorTonic-style interactivity: e.g. Positional Encodings heatmap step exposes "positions"/"dimensions" range sliders (`.scene-controls` above the SVG) and per-cell hover that draws the underlying wave + a `PE(pos, dN) = value` readout; the Self-Attention weight matrix shows `A[row → col] = w` on hover (softmax steps onward only).
- Test sliders by dragging to both extremes and asserting the grid re-renders with the exact new row/column counts and axis labels — a broken binding leaves the old grid.
- Test hover by comparing the displayed value against the source data (`WEIGHTS` array or the `pe()` formula) — the number must be recomputable, not just present.
- Assert the controls/hover readouts are ABSENT on steps/scenes where they shouldn't render (regression for the visibility gating).
- Hover state is React state, not CSS: move the mouse fully off the SVG group and assert captions revert to their defaults.
- Low-frequency dimensions produce a nearly flat inspected wave — that is mathematically correct, not a bug.
- To hover a specific cell, compute its coordinates from the grid constants in `Scene.tsx` (e.g. `GRID_X/GRID_Y/CELL` or `HEAT_X/HEAT_Y` + cell size), then verify via the on-screen readout which cell you actually hit — small cells make off-by-one hits common.

## Pitfalls / gotchas
- Autoplay might already be running when you arrive on a lesson (or a stray click can start it) — the "Play" button toggles to "Pause"; pause before stepping manually, then press "← Prev" repeatedly to reset to step 1.
- The caption text can lag the step indicator ~1s after clicking Next (async narration hook). Wait a beat before asserting caption text, or you may capture the previous step's caption.
- The stripped DOM in computer-tool output is excellent for glossary assertions: `aria-expanded` on each term button plus the definition text appear inline, so you can verify accordion state and exact definition wording without zooming screenshots.
- `gh pr comment` does NOT upload local image paths — screenshots referenced as `/home/...` render broken. Upload them first (Devin `upload_attachment`) and use the returned URLs, or post the comment via a tool that auto-uploads.
- The Java code under `src/` is an unrelated assignment skeleton; `mvn compile` fails by design. Do not treat that as a regression.

## Devin Secrets Needed
- None (fully local app, no auth).
