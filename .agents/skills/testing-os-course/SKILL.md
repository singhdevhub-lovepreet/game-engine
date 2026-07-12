---
name: testing-os-course
description: Test the interactive OS course React app (web/) end-to-end. Use when verifying lesson UI, animations, code highlighting, or navigation changes.
---

# Testing the OS course app

## Run
- `cd web && npm install && npm run dev -- --port 5173`, open http://localhost:5173.
- Lint/build gates: `npm run lint` (oxlint) and `npm run build` (tsc + vite) inside `web/`.

## Architecture map (for planning assertions)
- Lessons live in `web/src/lessons/<name>/` as three files: `steps.ts` (data: code lines to highlight, scene state, EN/HI narration, note), `Scene.tsx` (SVG animation, framer-motion), `Lesson.tsx` (layout + Prev/Play/Next controls).
- A lesson is only reachable when its entry in `web/src/data/chapters.ts` has `status: "available"` AND it is routed in `web/src/App.tsx`. If a new lesson doesn't show, check both.
- Shared: `components/CodePane.tsx` (line highlighting + C tokenizer), `narration/useNarration.ts` (caption text; TTS provider is a stub).

## Test procedure that works well
1. Reload the page; click the lesson in the left sidebar (disabled lessons show a "soon" pill).
2. Step through with the "Next →" button; at each step assert: (a) highlighted code line numbers match `steps.ts`, (b) scene elements for that state, (c) step indicator `N / total` in the caption bar, (d) accumulated short notes with the active one gradient-highlighted.
3. Switch the topbar language select to हिन्दी and assert the caption re-renders in Hindi.
4. Zoom screenshots of the code+scene region make the best evidence.

## Pitfalls / gotchas
- Autoplay might already be running when you arrive on a lesson (or a stray click can start it) — the "Play" button toggles to "Pause"; pause before stepping manually, then press "← Prev" repeatedly to reset to step 1.
- The caption text can lag the step indicator ~1s after clicking Next (async narration hook). Wait a beat before asserting caption text, or you may capture the previous step's caption.
- The Java code under `src/` is an unrelated assignment skeleton; `mvn compile` fails by design. Do not treat that as a regression.

## Devin Secrets Needed
- None (fully local app, no auth).
