import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { glossary, type GlossaryTerm } from "../data/glossary";

interface GlossaryPaneProps {
  termIds: string[];
  /** Terms relevant to the current step get a subtle accent. */
  activeIds?: string[];
  /**
   * Future extension point: wire an AI assistant so a learner can ask
   * follow-up questions about a term ("explain APIC like I'm five").
   * When provided, each expanded term shows an "ask AI" affordance.
   */
  onAskAi?: (term: GlossaryTerm) => void;
}

export function GlossaryPane({
  termIds,
  activeIds = [],
  onAskAi,
}: GlossaryPaneProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const terms = termIds
    .map((id) => glossary[id])
    .filter((t): t is GlossaryTerm => Boolean(t));

  if (terms.length === 0) return null;

  return (
    <div className="glossary">
      <div className="pane-title">jargon decoder</div>
      <ul>
        {terms.map((t) => {
          const open = openId === t.id;
          const active = activeIds.includes(t.id);
          return (
            <li key={t.id} className={active ? "active" : ""}>
              <button
                className="glossary-term"
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : t.id)}
              >
                <span className="glossary-abbr">{t.term}</span>
                <span className="glossary-full">{t.full}</span>
                <span className={`glossary-chevron ${open ? "open" : ""}`}>
                  ›
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    className="glossary-def"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <p>{t.definition}</p>
                    {onAskAi && (
                      <button className="ask-ai" onClick={() => onAskAi(t)}>
                        ✦ ask AI about this
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
