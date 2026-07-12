import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { CodePane } from "../../components/CodePane";
import { GlossaryPane } from "../../components/GlossaryPane";
import { useNarration } from "../../narration/useNarration";
import { Scene } from "./Scene";
import { glossaryIds, pyCode, steps } from "./steps";

const STEP_MS = 7000;

export function SelfAttentionLesson() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { caption, speak } = useNarration();
  const step = steps[stepIndex];

  useEffect(() => {
    void speak(step.narration);
  }, [step, speak]);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setStepIndex((i) => {
        if (i >= steps.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, STEP_MS);
    return () => clearInterval(t);
  }, [playing]);

  const goto = useCallback((i: number) => {
    setStepIndex(Math.min(Math.max(i, 0), steps.length - 1));
  }, []);

  return (
    <div className="lesson">
      <header className="lesson-header">
        <div>
          <h2>Self-Attention</h2>
          <p>Chapter 1 · Attention</p>
        </div>
        <div className="controls">
          <button onClick={() => goto(stepIndex - 1)} disabled={stepIndex === 0}>
            ← Prev
          </button>
          <button className="play" onClick={() => setPlaying((p) => !p)}>
            {playing ? "Pause" : "Play"}
          </button>
          <button
            onClick={() => goto(stepIndex + 1)}
            disabled={stepIndex === steps.length - 1}
          >
            Next →
          </button>
        </div>
      </header>

      <div className="lesson-grid">
        <CodePane
          code={pyCode}
          highlightedLines={step.codeLines}
          language="python"
          title="self_attention.py"
        />
        <Scene step={step} />
        <aside className="notes-pane">
          <div className="pane-title">short notes</div>
          <ul>
            {steps.slice(0, stepIndex + 1).map(
              (s) =>
                s.note && (
                  <li key={s.id} className={s.id === step.id ? "active" : ""}>
                    {s.note}
                  </li>
                ),
            )}
          </ul>
          <GlossaryPane termIds={glossaryIds} activeIds={step.terms} />
        </aside>
      </div>

      <footer className="caption-bar">
        <span className="step-indicator">
          {stepIndex + 1} / {steps.length}
        </span>
        <AnimatePresence mode="wait">
          <motion.p
            key={step.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
          >
            {caption}
          </motion.p>
        </AnimatePresence>
      </footer>
    </div>
  );
}
