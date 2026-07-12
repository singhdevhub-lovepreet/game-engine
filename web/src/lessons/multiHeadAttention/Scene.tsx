import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { MultiHeadStep } from "./steps";

interface SceneProps {
  step: MultiHeadStep;
}

const TOKENS = ["the", "bank", "of", "the", "river"];
const TOKEN_W = 80;
const tokenX = (i: number) => 26 + i * 88;
const tokenCx = (i: number) => tokenX(i) + TOKEN_W / 2;

/** Head 2 (trained): word-sense head — bank leans on river. */
const HEAD_SEM = [
  [0.42, 0.13, 0.15, 0.18, 0.12],
  [0.1, 0.12, 0.07, 0.09, 0.62],
  [0.18, 0.2, 0.3, 0.18, 0.14],
  [0.18, 0.13, 0.15, 0.42, 0.12],
  [0.11, 0.48, 0.08, 0.11, 0.22],
];

/** Head 5 (trained): grammar head — bank leans on "of". */
const HEAD_SYN = [
  [0.4, 0.22, 0.16, 0.12, 0.1],
  [0.16, 0.12, 0.51, 0.13, 0.08],
  [0.14, 0.42, 0.1, 0.24, 0.1],
  [0.1, 0.12, 0.2, 0.36, 0.22],
  [0.08, 0.14, 0.12, 0.44, 0.22],
];

/** Muddied single-head row for "bank": meaning + grammar averaged. */
const MUDDY_ROW = [0.13, 0.12, 0.29, 0.11, 0.35];

const D_MODEL = 512;
const BAR_X = 60;
const BAR_W = 360;
const BAR_Y = 150;
const BAR_H = 34;

const CELL = 17;
const GRID_SEM_X = 84;
const GRID_SYN_X = 288;
const GRID_Y = 172;

export function Scene({ step }: SceneProps) {
  const { scene } = step;
  const [hExp, setHExp] = useState(3); // h = 2^hExp
  const [hoverSlice, setHoverSlice] = useState<number | null>(null);
  const [hoverCell, setHoverCell] = useState<{ g: 0 | 1; r: number; c: number } | null>(
    null,
  );

  const h = 2 ** hExp;
  const dK = D_MODEL / h;
  const showSlider = scene === "split";
  const showGrids = scene === "head-views";
  const stacked = scene === "concat" || scene === "wo" || scene === "formula";

  return (
    <div className="scene">
      <div className="pane-title">multi-head attention</div>
      {showSlider && (
        <div className="scene-controls">
          <label>
            heads <span className="scene-controls-value">{h}</span>
            <input
              type="range"
              min={1}
              max={4}
              value={hExp}
              onChange={(e) => setHExp(Number(e.target.value))}
            />
          </label>
          <span>
            d_k = {D_MODEL} / {h} = <span className="scene-controls-value">{dK}</span>
          </span>
        </div>
      )}
      <svg viewBox="0 0 480 360" className="scene-svg">
        <defs>
          <linearGradient id="mhaOutGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(245, 158, 11, 0.1)" />
            <stop offset="100%" stopColor="rgba(245, 158, 11, 0.02)" />
          </linearGradient>
        </defs>

        {/* Token pills */}
        {TOKENS.map((t, i) => {
          const bank = i === 1;
          const river = i === 4 && (scene === "recap" || scene === "problem" || showGrids);
          const of = i === 2 && (scene === "problem" || showGrids);
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
                    : river
                      ? "rgba(245, 158, 11, 0.55)"
                      : of
                        ? "rgba(245, 158, 11, 0.4)"
                        : "#1f1f1f",
                  strokeWidth: bank || river || of ? 1.5 : 1,
                }}
              />
              <text x={tokenCx(i)} y={35} textAnchor="middle" className="box-label">
                {t}
              </text>
            </g>
          );
        })}

        {/* Recap: one softmax row = one recipe */}
        <AnimatePresence>
          {scene === "recap" && (
            <motion.g
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <text x={240} y={120} textAnchor="middle" className="box-label">
                A[bank] — one row of weights
              </text>
              {HEAD_SEM[1].map((w, i) => (
                <g key={i}>
                  <rect
                    x={tokenCx(i) - 22}
                    y={136}
                    width={44}
                    height={26}
                    rx={6}
                    fill={`rgba(139, 92, 246, ${(w * 0.85).toFixed(2)})`}
                    stroke={i === 4 ? "rgba(245, 158, 11, 0.55)" : "#1f1f1f"}
                  />
                  <text x={tokenCx(i)} y={153} textAnchor="middle" className="tiny-label">
                    {w.toFixed(2)}
                  </text>
                </g>
              ))}
              <text x={240} y={192} textAnchor="middle" className="tiny-label">
                out(bank) = 0.62·v(river) + 0.12·v(bank) + … — one mixing recipe
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Problem: two jobs, one blend */}
        <AnimatePresence>
          {scene === "problem" && (
            <motion.g
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <path
                d={`M ${tokenCx(1)} 48 C ${tokenCx(1)} 84, ${tokenCx(4)} 84, ${tokenCx(4)} 48`}
                fill="none"
                stroke="rgba(245, 158, 11, 0.55)"
                strokeWidth={1.4}
              />
              <text x={(tokenCx(1) + tokenCx(4)) / 2} y={90} textAnchor="middle" className="tiny-label">
                meaning: which sense of bank?
              </text>
              <path
                d={`M ${tokenCx(1)} 48 C ${tokenCx(1)} 66, ${tokenCx(2)} 66, ${tokenCx(2)} 48`}
                fill="none"
                stroke="rgba(139, 92, 246, 0.6)"
                strokeWidth={1.4}
              />
              <text x={(tokenCx(1) + tokenCx(2)) / 2} y={62} textAnchor="middle" className="tiny-label">
                grammar
              </text>
              <text x={240} y={134} textAnchor="middle" className="box-label">
                one row must average both jobs
              </text>
              {MUDDY_ROW.map((w, i) => (
                <g key={i}>
                  <rect
                    x={tokenCx(i) - 22}
                    y={148}
                    width={44}
                    height={26}
                    rx={6}
                    fill={`rgba(139, 92, 246, ${(w * 0.85).toFixed(2)})`}
                    stroke="#1f1f1f"
                  />
                  <text x={tokenCx(i)} y={165} textAnchor="middle" className="tiny-label">
                    {w.toFixed(2)}
                  </text>
                </g>
              ))}
              <text x={240} y={200} textAnchor="middle" className="tiny-label">
                0.35 river + 0.29 of — neither signal is sharp anymore
              </text>
              <text x={240} y={224} textAnchor="middle" className="tiny-label">
                ✗ one head can express only one relationship at a time
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Many heads in parallel */}
        <AnimatePresence>
          {scene === "many-heads" && (
            <motion.g
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {Array.from({ length: 8 }, (_, i) => (
                <motion.g
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12 }}
                >
                  <rect
                    x={52 + i * 48}
                    y={130}
                    width={40}
                    height={52}
                    rx={8}
                    className="node-box"
                    stroke={i === 1 ? "rgba(245, 158, 11, 0.5)" : i === 4 ? "rgba(139, 92, 246, 0.55)" : "#2a2a2a"}
                  />
                  <text x={72 + i * 48} y={152} textAnchor="middle" className="tiny-label">
                    head
                  </text>
                  <text x={72 + i * 48} y={168} textAnchor="middle" className="tiny-label">
                    {i + 1}
                  </text>
                </motion.g>
              ))}
              <text x={240} y={214} textAnchor="middle" className="tiny-label">
                same attention mechanism, h = 8 parallel copies
              </text>
              <text x={240} y={236} textAnchor="middle" className="tiny-label">
                each with its own learned Wq, Wk, Wv — free to specialise
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Split the dimensions — interactive */}
        <AnimatePresence>
          {scene === "split" && (
            <motion.g
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <text x={240} y={118} textAnchor="middle" className="box-label">
                one embedding: {D_MODEL} dims → {h} heads × {dK} dims
              </text>
              {Array.from({ length: h }, (_, i) => {
                const sliceW = BAR_W / h;
                const hot = hoverSlice === i;
                return (
                  <g key={i}>
                    <motion.rect
                      x={BAR_X + i * sliceW + 1}
                      y={BAR_Y}
                      width={sliceW - 2}
                      height={BAR_H}
                      rx={4}
                      animate={{
                        fill: hot
                          ? "rgba(245, 158, 11, 0.35)"
                          : `rgba(139, 92, 246, ${(0.14 + (i % 2) * 0.08).toFixed(2)})`,
                      }}
                      stroke={hot ? "rgba(255,255,255,0.7)" : "#1f1f1f"}
                      onMouseEnter={() => setHoverSlice(i)}
                      onMouseLeave={() => setHoverSlice(null)}
                      style={{ cursor: "crosshair" }}
                    />
                    {h <= 8 && (
                      <text
                        x={BAR_X + i * sliceW + sliceW / 2}
                        y={BAR_Y + BAR_H / 2 + 4}
                        textAnchor="middle"
                        className="tiny-label"
                        pointerEvents="none"
                      >
                        h{i + 1}
                      </text>
                    )}
                  </g>
                );
              })}
              <text x={BAR_X} y={BAR_Y + BAR_H + 18} className="tiny-label">
                dim 0
              </text>
              <text x={BAR_X + BAR_W} y={BAR_Y + BAR_H + 18} textAnchor="end" className="tiny-label">
                dim {D_MODEL - 1}
              </text>
              <text x={240} y={BAR_Y + BAR_H + 44} textAnchor="middle" className="tiny-label">
                {hoverSlice !== null
                  ? `head ${hoverSlice + 1} works in dims ${hoverSlice * dK}–${(hoverSlice + 1) * dK - 1} (${dK} of ${D_MODEL})`
                  : "hover a slice — drag the slider to change h"}
              </text>
              <text x={240} y={BAR_Y + BAR_H + 68} textAnchor="middle" className="tiny-label">
                {h} heads × {dK} dims each = {D_MODEL} — total compute unchanged
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Each head's private projections */}
        <AnimatePresence>
          {scene === "head-qkv" && (
            <motion.g
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {[0, 1].map((head) => (
                <g key={head}>
                  <rect
                    x={78 + head * 220}
                    y={112}
                    width={148}
                    height={116}
                    rx={12}
                    className="node-box"
                    stroke={head === 0 ? "rgba(245, 158, 11, 0.45)" : "rgba(139, 92, 246, 0.5)"}
                  />
                  <text x={152 + head * 220} y={134} textAnchor="middle" className="box-label">
                    head {head === 0 ? 2 : 5}
                  </text>
                  {["Wq", "Wk", "Wv"].map((w, j) => (
                    <g key={w}>
                      <rect
                        x={92 + head * 220 + j * 42}
                        y={146}
                        width={36}
                        height={26}
                        rx={6}
                        className="node-box"
                      />
                      <text
                        x={110 + head * 220 + j * 42}
                        y={163}
                        textAnchor="middle"
                        className="tiny-label"
                      >
                        {w}
                        {head === 0 ? "₂" : "₅"}
                      </text>
                    </g>
                  ))}
                  <text x={152 + head * 220} y={196} textAnchor="middle" className="tiny-label">
                    512 → 64
                  </text>
                  <text x={152 + head * 220} y={214} textAnchor="middle" className="tiny-label">
                    private parameters
                  </text>
                </g>
              ))}
              <text x={240} y={262} textAnchor="middle" className="tiny-label">
                different weights → each head learns to look for different things
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* All heads run the same formula */}
        <AnimatePresence>
          {scene === "run-heads" && (
            <motion.g
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {Array.from({ length: 8 }, (_, i) => (
                <motion.g
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.15 }}
                >
                  <rect
                    x={52 + i * 48}
                    y={122}
                    width={40}
                    height={40}
                    rx={8}
                    className="node-box"
                    stroke="#2a2a2a"
                  />
                  <text x={72 + i * 48} y={146} textAnchor="middle" className="tiny-label">
                    h{i + 1}
                  </text>
                  <motion.line
                    x1={72 + i * 48}
                    y1={162}
                    x2={72 + i * 48}
                    y2={186}
                    className="dma-line"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: i * 0.15 + 0.2 }}
                  />
                  <motion.rect
                    x={56 + i * 48}
                    y={190}
                    width={32}
                    height={20}
                    rx={4}
                    fill="rgba(245, 158, 11, 0.16)"
                    stroke="#1f1f1f"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.15 + 0.3 }}
                  />
                  <motion.text
                    x={72 + i * 48}
                    y={204}
                    textAnchor="middle"
                    className="tiny-label"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.15 + 0.3 }}
                  >
                    5×64
                  </motion.text>
                </motion.g>
              ))}
              <text x={240} y={244} textAnchor="middle" className="tiny-label">
                each head: softmax(QᵢKᵢᵀ / √64) Vᵢ — independent, in parallel
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Two trained heads, two attention maps — hover to inspect */}
        <AnimatePresence>
          {showGrids && (
            <motion.g
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              {[
                { gx: GRID_SEM_X, data: HEAD_SEM, label: "head 2 · meaning", g: 0 as const },
                { gx: GRID_SYN_X, data: HEAD_SYN, label: "head 5 · grammar", g: 1 as const },
              ].map(({ gx, data, label, g }) => (
                <g key={g}>
                  <text
                    x={gx + (CELL * 5) / 2}
                    y={GRID_Y - 34}
                    textAnchor="middle"
                    className="box-label"
                  >
                    {label}
                  </text>
                  {TOKENS.map((t, r) => (
                    <text
                      key={`r${r}`}
                      x={gx - 6}
                      y={GRID_Y + r * CELL + 12}
                      textAnchor="end"
                      className="tiny-label"
                    >
                      {t}
                    </text>
                  ))}
                  {data.map((row, r) =>
                    row.map((w, c) => (
                      <rect
                        key={`${r}-${c}`}
                        x={gx + c * CELL}
                        y={GRID_Y + r * CELL}
                        width={CELL - 2}
                        height={CELL - 2}
                        rx={3}
                        fill={
                          g === 0
                            ? `rgba(245, 158, 11, ${(w * 0.8).toFixed(2)})`
                            : `rgba(139, 92, 246, ${(w * 0.85).toFixed(2)})`
                        }
                        stroke={
                          hoverCell?.g === g && hoverCell.r === r && hoverCell.c === c
                            ? "rgba(255,255,255,0.7)"
                            : "#1f1f1f"
                        }
                        onMouseEnter={() => setHoverCell({ g, r, c })}
                        onMouseLeave={() => setHoverCell(null)}
                        style={{ cursor: "crosshair" }}
                      />
                    )),
                  )}
                </g>
              ))}
              <text x={240} y={GRID_Y + CELL * 5 + 26} textAnchor="middle" className="tiny-label">
                {hoverCell
                  ? `head ${hoverCell.g === 0 ? 2 : 5}: A[${TOKENS[hoverCell.r]} → ${TOKENS[hoverCell.c]}] = ${(hoverCell.g === 0 ? HEAD_SEM : HEAD_SYN)[hoverCell.r][hoverCell.c].toFixed(2)}`
                  : "same sentence, two different maps — hover a cell"}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Concat → Wo → out */}
        <AnimatePresence>
          {stacked && (
            <motion.g
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <text x={240} y={112} textAnchor="middle" className="box-label">
                token "bank" — 8 head outputs, side by side
              </text>
              {Array.from({ length: 8 }, (_, i) => (
                <motion.rect
                  key={i}
                  x={BAR_X + i * (BAR_W / 8) + 1}
                  y={126}
                  width={BAR_W / 8 - 2}
                  height={26}
                  rx={4}
                  fill={i === 1 ? "rgba(245, 158, 11, 0.3)" : i === 4 ? "rgba(139, 92, 246, 0.35)" : "rgba(139, 92, 246, 0.14)"}
                  stroke="#1f1f1f"
                  initial={{ y: 110, opacity: 0 }}
                  animate={{ y: 126, opacity: 1 }}
                  transition={{ delay: i * 0.08 }}
                />
              ))}
              <text x={240} y={172} textAnchor="middle" className="tiny-label">
                cat = torch.cat(heads) — (5, 512) again, but findings don't interact yet
              </text>
              {(scene === "wo" || scene === "formula") && (
                <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <line x1={240} y1={182} x2={240} y2={198} className="dma-line" />
                  <rect x={190} y={200} width={100} height={30} rx={8} className="node-box" stroke="rgba(139, 92, 246, 0.5)" />
                  <text x={240} y={219} textAnchor="middle" className="box-label">
                    Wo (512×512)
                  </text>
                  <line x1={240} y1={230} x2={240} y2={246} className="dma-line" />
                  <rect x={BAR_X} y={248} width={BAR_W} height={26} rx={6} fill="url(#mhaOutGrad)" stroke="rgba(245, 158, 11, 0.4)" />
                  <text x={240} y={265} textAnchor="middle" className="tiny-label">
                    out — meaning + grammar blended into one vector
                  </text>
                </motion.g>
              )}
              {scene === "formula" && (
                <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <rect x={90} y={292} width={300} height={46} rx={12} className="node-box" stroke="rgba(139, 92, 246, 0.5)" />
                  <text x={240} y={312} textAnchor="middle" className="box-label">
                    MultiHead(Q,K,V) = Concat(head₁…head₈)·Wo
                  </text>
                  <text x={240} y={329} textAnchor="middle" className="tiny-label">
                    8 relationships captured — same total compute as one big head
                  </text>
                </motion.g>
              )}
            </motion.g>
          )}
        </AnimatePresence>

        {/* Summary */}
        <AnimatePresence>
          {scene === "done" && (
            <motion.g
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <rect x={70} y={120} width={340} height={150} rx={12} className="node-box" stroke="rgba(139, 92, 246, 0.5)" />
              <text x={240} y={148} textAnchor="middle" className="box-label">
                multi-head attention
              </text>
              <text x={240} y={176} textAnchor="middle" className="tiny-label">
                one softmax row = one relationship → not enough
              </text>
              <text x={240} y={198} textAnchor="middle" className="tiny-label">
                split 512 dims into 8 heads of 64 — same compute
              </text>
              <text x={240} y={220} textAnchor="middle" className="tiny-label">
                each head: private Wq/Wk/Wv, same attention formula
              </text>
              <text x={240} y={242} textAnchor="middle" className="tiny-label">
                concat the slices → Wo blends the heads' findings
              </text>
              <text x={240} y={296} textAnchor="middle" className="tiny-label">
                next: stacking attention into the full transformer block
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}
