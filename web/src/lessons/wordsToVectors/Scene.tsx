import { AnimatePresence, motion } from "framer-motion";
import type { WordsToVectorsStep } from "./steps";

interface SceneProps {
  step: WordsToVectorsStep;
}

const TOKENS = ["the", "bank", "of", "the", "river"];
const IDS = ["262", "3331", "286", "262", "7850"];
const TOKEN_W = 80;
const tokenX = (i: number) => 26 + i * 88;
const tokenCx = (i: number) => tokenX(i) + TOKEN_W / 2;

const TABLE_ROWS = [
  { id: "0", label: "!" },
  { id: "262", label: "the" },
  { id: "286", label: "of" },
  { id: "3331", label: "bank" },
  { id: "7850", label: "river" },
  { id: "50256", label: "<eot>" },
];

export function Scene({ step }: SceneProps) {
  const { scene } = step;
  const showTokens = scene !== "text";
  const showIds = scene !== "text" && scene !== "tokens";
  const showTable =
    scene === "table" || scene === "lookup" || scene === "learned" || scene === "done";
  const showVectors = scene === "lookup" || scene === "learned" || scene === "done";
  const learned = scene === "learned";

  return (
    <div className="scene">
      <div className="pane-title">words → vectors</div>
      <svg viewBox="0 0 480 360" className="scene-svg">
        {/* Raw sentence */}
        <AnimatePresence>
          {scene === "text" && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <rect x={90} y={120} width={300} height={60} rx={12} className="node-box" />
              <text x={240} y={147} textAnchor="middle" className="box-label">
                "the bank of the river"
              </text>
              <text x={240} y={167} textAnchor="middle" className="tiny-label">
                just characters — a model cannot compute with these
              </text>
              <text x={240} y={220} textAnchor="middle" className="tiny-label">
                goal: numbers that still carry the meaning
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Token pills */}
        {showTokens &&
          TOKENS.map((t, i) => (
            <g key={i}>
              <motion.rect
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                x={tokenX(i)}
                y={18}
                width={TOKEN_W}
                height={26}
                rx={13}
                className="node-box"
                stroke={
                  scene === "tokens" ? "rgba(139, 92, 246, 0.5)" : "#1f1f1f"
                }
              />
              <text x={tokenCx(i)} y={35} textAnchor="middle" className="box-label">
                {t}
              </text>
            </g>
          ))}
        {scene === "tokens" && (
          <>
            <text x={240} y={70} textAnchor="middle" className="tiny-label">
              5 tokens — split by the tokenizer, from a fixed menu
            </text>
            <text x={240} y={110} textAnchor="middle" className="tiny-label">
              rare words split into pieces: "riverbed" → "river" + "bed"
            </text>
          </>
        )}

        {/* Vocabulary IDs */}
        <AnimatePresence>
          {showIds && (
            <motion.g initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {IDS.map((id, i) => (
                <g key={i}>
                  <line
                    x1={tokenCx(i)}
                    y1={44}
                    x2={tokenCx(i)}
                    y2={56}
                    className="dma-line"
                    opacity={0.5}
                  />
                  <rect
                    x={tokenCx(i) - 24}
                    y={58}
                    width={48}
                    height={22}
                    rx={6}
                    className="node-box"
                    stroke={
                      scene === "ids" && (i === 0 || i === 3)
                        ? "rgba(245, 158, 11, 0.55)"
                        : "#2a2a2a"
                    }
                  />
                  <text x={tokenCx(i)} y={73} textAnchor="middle" className="tiny-label">
                    {id}
                  </text>
                </g>
              ))}
              {scene === "ids" && (
                <text x={240} y={104} textAnchor="middle" className="tiny-label">
                  both "the" → 262 · an ID is a row number, not a meaning
                </text>
              )}
            </motion.g>
          )}
        </AnimatePresence>

        {/* Embedding table */}
        <AnimatePresence>
          {showTable && (
            <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <text x={120} y={124} textAnchor="middle" className="box-label">
                embedding table E
              </text>
              <text x={120} y={140} textAnchor="middle" className="tiny-label">
                50,257 rows × 768 numbers
              </text>
              {TABLE_ROWS.map((row, r) => {
                const hot =
                  showVectors && ["262", "286", "3331", "7850"].includes(row.id);
                return (
                  <g key={row.id}>
                    <text
                      x={62}
                      y={162 + r * 26}
                      textAnchor="end"
                      className="tiny-label"
                      fill={hot ? "#8b5cf6" : undefined}
                    >
                      {row.id} · {row.label}
                    </text>
                    {[0, 1, 2, 3, 4, 5].map((c) => (
                      <motion.rect
                        key={c}
                        x={70 + c * 19}
                        y={150 + r * 26}
                        width={17}
                        height={16}
                        rx={3}
                        stroke="#1f1f1f"
                        animate={{
                          fill: hot
                            ? "rgba(139, 92, 246, 0.3)"
                            : learned
                              ? "rgba(245, 158, 11, 0.12)"
                              : "rgba(139, 92, 246, 0.08)",
                        }}
                      />
                    ))}
                  </g>
                );
              })}
              <text x={120} y={324} textAnchor="middle" className="tiny-label">
                ⋮ (50,251 more rows)
              </text>
              {learned && (
                <text x={330} y={324} textAnchor="middle" className="tiny-label">
                  rows start random → learned by training
                </text>
              )}
            </motion.g>
          )}
        </AnimatePresence>

        {/* Looked-up vectors per token */}
        <AnimatePresence>
          {showVectors && (
            <motion.g initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <path
                d="M 200 200 C 240 200, 240 200, 270 200"
                fill="none"
                className="dma-line"
                opacity={0.7}
              />
              <text x={330} y={140} textAnchor="middle" className="box-label">
                x — (5, 768)
              </text>
              {TOKENS.map((t, r) => (
                <g key={r}>
                  <text x={292} y={166 + r * 26} textAnchor="end" className="tiny-label">
                    {t}
                  </text>
                  {[0, 1, 2, 3, 4, 5].map((c) => (
                    <rect
                      key={c}
                      x={300 + c * 19}
                      y={154 + r * 26}
                      width={17}
                      height={16}
                      rx={3}
                      fill={
                        r === 0 || r === 3
                          ? "rgba(139, 92, 246, 0.22)"
                          : "rgba(139, 92, 246, 0.14)"
                      }
                      stroke="#1f1f1f"
                    />
                  ))}
                </g>
              ))}
              {scene === "lookup" && (
                <text x={330} y={300} textAnchor="middle" className="tiny-label">
                  a lookup, not a computation — ID picks the row
                </text>
              )}
            </motion.g>
          )}
        </AnimatePresence>

        {/* Summary strip */}
        <AnimatePresence>
          {scene === "done" && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <text x={240} y={110} textAnchor="middle" className="tiny-label">
                text → tokens → IDs → table lookup → vectors
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}
