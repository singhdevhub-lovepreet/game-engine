# Authoring Lessons: Break Complex Topics into First-Principles Steps

Use this skill whenever adding or revising a lesson in any track (OS, Transformers, or future courses). The goal of this product is that a student with no background can truly understand — never jump directly to a complex topic.

## Core rule

Before building a lesson on a complex concept, decompose it into its prerequisite ideas and teach those first — either as earlier lessons in a "Foundations" chapter, or as explicit early steps inside the lesson.

Example (Transformers): before Self-Attention, the track teaches
words → tokens → embedding lookup → vectors in space → dot product / similarity → positional encodings — only then Q/K/V.

Example (OS): before Context Switching, teach what a process is, what its saved state consists of, and why the CPU can only run one thing at a time.

## Mandatory checklist per lesson

Answer all of these before writing steps:

1. **Prerequisites** — What must the student already know? Is each prerequisite taught earlier in the track? If not, add a lesson or early steps for it.
2. **Smallest first concept** — What is the smallest meaningful idea to start from (one word, one vector, one process, one interrupt line)?
3. **One new idea per step** — Each step introduces at most ONE new concept. If a narration needs "and" twice to explain new machinery, split the step.
4. **Visual evidence** — Can the idea be shown, not just told? Prefer diagrams, graphs, plotted points, waves, heatmaps, RAM maps over prose. Numbers in visuals must be concrete and consistent with the code pane.
5. **Concrete example first** — Start from a specific tiny example ("the bank of the river", one `read()` call), then generalize.
6. **Motivate every abstraction** — Before introducing a mechanism (Wq/Wk/Wv, page tables, softmax), show the *problem* the naive approach hits. The sequence is: naive attempt → limitation → mechanism.
7. **Jargon** — Every abbreviation or technical term appears in the lesson's glossary with a plain-English definition, and is added to `terms` on the step where it first appears.
8. **Recap** — The final step reconstructs the whole pipeline in one sentence chain (a → b → c → d) and previews what comes next.

## Structure conventions (this repo)

- Lesson folder: `web/src/lessons/<name>/` with `steps.ts`, `Scene.tsx`, `Lesson.tsx`.
- `steps.ts`: exports `pyCode`/`cCode`, a `SceneState` union (one state per visual beat), `glossaryIds`, and `steps`. Verify `codeLines` against actual line numbers of the code string.
- Narration: 2–4 sentences, beginner-friendly, no unexplained jargon. Notes: one short line.
- Register the lesson in the track's chapter data, `App.tsx` routing, and add glossary terms to `web/src/data/glossary.ts`.
- Aim for 7–13 steps. Fewer than 6 usually means concepts are being compressed; do not cut explanation depth to reduce animation work.

## Red flags (redo the plan if you see these)

- Step 1 already shows the final mechanism or formula.
- A step's narration defines two or more new terms.
- A visual is only labels/boxes of jargon with no concrete values.
- An abstraction appears before the problem it solves.
- The lesson assumes math (dot products, matrices, probabilities) never shown in the track.
