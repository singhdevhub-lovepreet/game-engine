import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { SelfAttentionStep } from "./steps";

interface SceneProps {
  step: SelfAttentionStep;
}

const TOKENS = ["the", "bank", "of", "the", "river"];
const TOKEN_W = 80;
const tokenX = (i: number) => 26 + i * 88;
const tokenCx = (i: number) => tokenX(i) + TOKEN_W / 2;

/** Attention weights after softmax; row = attending token. */
const WEIGHTS = [
  [0.42, 0.13, 0.15, 0.18, 0.12],
  [0.1, 0.12, 0.07, 0.09, 0.62],
  [0.18, 0.2, 0.3, 0.18, 0.14],
  [0.18, 0.13, 0.15, 0.42, 0.12],
  [0.11, 0.48, 0.08, 0.11, 0.22],
];

const GRID_X = 66;
const GRID_Y = 236;
const CELL = 20;

const RAW_SCORES = ["2.1", "9.4", "0.8", "2.1", "8.1"];

export function Scene({ step }: SceneProps) {
  const { scene } = step;
  const [hoverCell, setHoverCell] = useState<{ r: number; c: number } | null>(null);
  const showEmbeddings = scene !== "tokens";
  const embedFocus = scene === "embed-one";
  const dotTwo = scene === "dot-two";
  const rawRow = scene === "raw-row" || scene === "raw-problem";
  const rawProblem = scene === "raw-problem";
  const showW = scene === "projections" || scene === "qkv";
  const showChips =
    scene === "qkv" || scene === "scores" || scene === "scale" || scene === "softmax";
  const gridVisible =
    scene === "scores" || scene === "scale" || scene === "softmax" || scene === "mix" || scene === "matrix";
  const heat = scene === "softmax" || scene === "mix" || scene === "matrix";
  const bankRowActive = scene === "softmax" || scene === "mix";
  const riverHot = dotTwo || rawRow || scene === "scores" || scene === "scale" || heat;
  const showMix = scene === "mix" || scene === "done";
  const showFormula = scene === "matrix" || scene === "done";

  const gridLabel =
    scene === "scores"
      ? "scores = Q · Kᵀ"
      : scene === "scale"
        ? "scores ÷ √dₖ"
        : "A = softmax(rows)";

  return (
    <div className="scene">
      <div className="pane-title">self-attention</div>
      <svg viewBox="0 0 480 360" className="scene-svg">
        <defs>
          <linearGradient id="saMixGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(245, 158, 11, 0.08)" />
            <stop offset="100%" stopColor="rgba(245, 158, 11, 0.01)" />
          </linearGradient>
        </defs>

        {/* Token pills */}
        {TOKENS.map((t, i) => {
          const bank = i === 1;
          const river = i === 4;
          const hot = bank || (river && riverHot);
          return (
            <g key={i}>
              <motion.rect
                x={tokenX(i)}
                y={18}
                width={TOKEN_W}
                height={26}
                rx={13}
                className="node-box"
                animate={{
                  stroke: bank
                    ? "rgba(139, 92, 246, 0.6)"
                    : river && riverHot
                      ? "rgba(245, 158, 11, 0.55)"
                      : "#1f1f1f",
                  strokeWidth: hot ? 1.5 : 1,
                }}
              />
              <text x={tokenCx(i)} y={35} textAnchor="middle" className="box-label">
                {t}
              </text>
            </g>
          );
        })}

        {/* Static embedding vectors */}
        <AnimatePresence>
          {showEmbeddings && (
            <motion.g
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: embedFocus || dotTwo || rawRow ? 1 : 0.45, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {TOKENS.map((_, i) => {
                const focused =
                  (embedFocus && i === 1) || (dotTwo && (i === 1 || i === 4));
                const dimmed = (embedFocus || dotTwo) && !focused;
                return (
                  <g key={i} opacity={dimmed ? 0.3 : 1}>
                    <line
                      x1={tokenCx(i)}
                      y1={44}
                      x2={tokenCx(i)}
                      y2={56}
                      className="dma-line"
                      opacity={0.5}
                    />
                    {[0, 1, 2, 3].map((j) => (
                      <rect
                        key={j}
                        x={tokenCx(i) - 7}
                        y={58 + j * 11}
                        width={14}
                        height={9}
                        rx={2}
                        fill={
                          i === 1
                            ? "rgba(139, 92, 246, 0.28)"
                            : i === 4 && (dotTwo || rawRow)
                              ? "rgba(245, 158, 11, 0.22)"
                              : "rgba(139, 92, 246, 0.12)"
                        }
                        stroke={focused ? "#3a3a3a" : "#1f1f1f"}
                      />
                    ))}
                  </g>
                );
              })}
              {embedFocus && (
                <text x={240} y={124} textAnchor="middle" className="tiny-label">
                  e(bank) = [0.9, −0.3, 0.4, …] — one word, one fixed vector
                </text>
              )}
            </motion.g>
          )}
        </AnimatePresence>

        {/* Dot product of two embeddings */}
        <AnimatePresence>
          {dotTwo && (
            <motion.g
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <path
                d={`M ${tokenCx(1)} 104 C ${tokenCx(1)} 150, ${tokenCx(4)} 150, ${tokenCx(4)} 104`}
                fill="none"
                className="dma-line"
                opacity={0.8}
              />
              <rect x={140} y={140} width={200} height={54} rx={10} className="node-box" />
              <text x={240} y={162} textAnchor="middle" className="box-label">
                e(bank) · e(river) = 8.1
              </text>
              <text x={240} y={181} textAnchor="middle" className="tiny-label">
                multiply element-wise, add up → one similarity score
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Raw score row: bank vs every word */}
        <AnimatePresence>
          {rawRow && (
            <motion.g
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <text x={240} y={136} textAnchor="middle" className="box-label">
                bank · every word
              </text>
              {RAW_SCORES.map((s, i) => (
                <g key={i}>
                  <line
                    x1={tokenCx(i)}
                    y1={104}
                    x2={tokenCx(i)}
                    y2={146}
                    className="dma-line"
                    opacity={0.35}
                  />
                  <rect
                    x={tokenCx(i) - 22}
                    y={148}
                    width={44}
                    height={24}
                    rx={6}
                    className="node-box"
                    stroke={i === 4 ? "rgba(245, 158, 11, 0.55)" : i === 1 ? "rgba(139, 92, 246, 0.5)" : "#2a2a2a"}
                  />
                  <text x={tokenCx(i)} y={164} textAnchor="middle" className="tiny-label">
                    {s}
                  </text>
                </g>
              ))}
              {!rawProblem && (
                <text x={240} y={194} textAnchor="middle" className="tiny-label">
                  we could already mix neighbours with these — raw attention
                </text>
              )}
            </motion.g>
          )}
        </AnimatePresence>

        {/* Why raw embeddings are not enough */}
        <AnimatePresence>
          {rawProblem && (
            <motion.g
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <rect x={90} y={196} width={300} height={112} rx={12} className="node-box" stroke="rgba(245, 158, 11, 0.4)" />
              <text x={240} y={220} textAnchor="middle" className="box-label">
                one embedding is not enough
              </text>
              <text x={110} y={244} className="tiny-label">
                ✗ same vector must ask, advertise, and give
              </text>
              <text x={110} y={264} className="tiny-label">
                ✗ x · xᵀ is symmetric — bank→river ≡ river→bank
              </text>
              <text x={110} y={284} className="tiny-label">
                ✗ no parameters — nothing for training to improve
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Shared projection matrices */}
        <AnimatePresence>
          {showW && (
            <motion.g
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {["Wq", "Wk", "Wv"].map((w, i) => (
                <g key={w}>
                  <rect
                    x={150 + i * 66}
                    y={130}
                    width={54}
                    height={30}
                    rx={8}
                    className="node-box"
                    stroke={i === 0 ? "rgba(139, 92, 246, 0.5)" : i === 1 ? "rgba(245, 158, 11, 0.45)" : "#2a2a2a"}
                  />
                  <text x={177 + i * 66} y={149} textAnchor="middle" className="box-label">
                    {w}
                  </text>
                </g>
              ))}
              <text x={240} y={178} textAnchor="middle" className="tiny-label">
                one shared set — every embedding passes through the same three
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Per-token q/k/v chips */}
        <AnimatePresence>
          {showChips && (
            <motion.g
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: scene === "qkv" ? 1 : 0.45, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {TOKENS.map((_, i) => (
                <g key={i}>
                  {(["q", "k", "v"] as const).map((c, j) => (
                    <g key={c}>
                      <rect
                        x={tokenCx(i) - 30 + j * 21}
                        y={scene === "qkv" ? 192 : 196}
                        width={18}
                        height={16}
                        rx={4}
                        fill={
                          c === "q"
                            ? "rgba(139, 92, 246, 0.18)"
                            : c === "k"
                              ? "rgba(245, 158, 11, 0.14)"
                              : "rgba(255, 255, 255, 0.05)"
                        }
                        stroke="#1f1f1f"
                      />
                      <text
                        x={tokenCx(i) - 21 + j * 21}
                        y={scene === "qkv" ? 204 : 208}
                        textAnchor="middle"
                        className="tiny-label"
                      >
                        {c}
                      </text>
                    </g>
                  ))}
                </g>
              ))}
              {scene === "qkv" && (
                <text x={240} y={228} textAnchor="middle" className="tiny-label">
                  q: what I seek · k: what I contain · v: what I give away
                </text>
              )}
            </motion.g>
          )}
        </AnimatePresence>

        {/* Score / attention grid */}
        <AnimatePresence>
          {gridVisible && (
            <motion.g
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <text x={GRID_X + (CELL * 5) / 2} y={GRID_Y - 10} textAnchor="middle" className="box-label">
                {gridLabel}
              </text>
              {TOKENS.map((t, r) => (
                <text
                  key={`r${r}`}
                  x={GRID_X - 6}
                  y={GRID_Y + r * CELL + 14}
                  textAnchor="end"
                  className="tiny-label"
                  fill={r === 1 && bankRowActive ? "#8b5cf6" : undefined}
                >
                  {t}
                </text>
              ))}
              {WEIGHTS.map((row, r) =>
                row.map((w, c) => (
                  <motion.rect
                    key={`${r}-${c}`}
                    x={GRID_X + c * CELL}
                    y={GRID_Y + r * CELL}
                    width={CELL - 2}
                    height={CELL - 2}
                    rx={3}
                    stroke={
                      heat && hoverCell?.r === r && hoverCell?.c === c
                        ? "rgba(255,255,255,0.7)"
                        : "#1f1f1f"
                    }
                    animate={{
                      fill: heat
                        ? `rgba(139, 92, 246, ${(w * 0.85).toFixed(2)})`
                        : "rgba(139, 92, 246, 0.08)",
                    }}
                    onMouseEnter={heat ? () => setHoverCell({ r, c }) : undefined}
                    onMouseLeave={heat ? () => setHoverCell(null) : undefined}
                    style={heat ? { cursor: "crosshair" } : undefined}
                  />
                )),
              )}
              {bankRowActive && (
                <motion.rect
                  x={GRID_X - 2}
                  y={GRID_Y + CELL - 2}
                  width={CELL * 5 + 2}
                  height={CELL}
                  rx={4}
                  fill="none"
                  stroke="rgba(245, 158, 11, 0.6)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
              {heat && (
                <text
                  x={GRID_X + (CELL * 5) / 2}
                  y={GRID_Y + CELL * 5 + 16}
                  textAnchor="middle"
                  className="tiny-label"
                >
                  {hoverCell
                    ? `A[${TOKENS[hoverCell.r]} → ${TOKENS[hoverCell.c]}] = ${WEIGHTS[hoverCell.r][hoverCell.c].toFixed(2)}`
                    : 'row "bank": 62% river · hover a cell'}
                </text>
              )}
            </motion.g>
          )}
        </AnimatePresence>

        {/* Weighted mix of values */}
        <AnimatePresence>
          {showMix && (
            <motion.g
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
            >
              <rect x={250} y={230} width={210} height={104} rx={12} className="node-box" />
              <rect x={250} y={230} width={210} height={104} rx={12} fill="url(#saMixGrad)" />
              <text x={355} y={252} textAnchor="middle" className="box-label">
                out("bank") = A₍bank₎ · V
              </text>
              <text x={355} y={274} textAnchor="middle" className="tiny-label">
                0.62·v(river) + 0.12·v(bank) + …
              </text>
              {[0, 1, 2, 3].map((j) => (
                <rect
                  key={j}
                  x={321 + j * 18}
                  y={286}
                  width={16}
                  height={12}
                  rx={2}
                  fill="rgba(245, 158, 11, 0.3)"
                  stroke="#1f1f1f"
                />
              ))}
              <text x={355} y={320} textAnchor="middle" className="tiny-label">
                a contextual embedding — river-ness baked in
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Closed-form formula */}
        <AnimatePresence>
          {showFormula && (
            <motion.g
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <rect
                x={scene === "done" ? 90 : 220}
                y={scene === "done" ? 150 : 244}
                width={260}
                height={56}
                rx={12}
                className="node-box"
                stroke="rgba(139, 92, 246, 0.5)"
              />
              <text
                x={scene === "done" ? 220 : 350}
                y={scene === "done" ? 174 : 268}
                textAnchor="middle"
                className="box-label"
              >
                Attention(Q,K,V) = softmax(QKᵀ/√dₖ)V
              </text>
              <text
                x={scene === "done" ? 220 : 350}
                y={scene === "done" ? 192 : 286}
                textAnchor="middle"
                className="tiny-label"
              >
                all 5 tokens in one matmul — no loop, unlike an RNN
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}
