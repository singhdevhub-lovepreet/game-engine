import { AnimatePresence, motion } from "framer-motion";
import type { PositionalEncodingsStep } from "./steps";

interface SceneProps {
  step: PositionalEncodingsStep;
}

const GX0 = 50;
const GX1 = 430;
const MAX_POS = 12;

function wavePath(freq: number, phase: number, baseY: number, amp: number): string {
  const pts: string[] = [];
  for (let s = 0; s <= 120; s++) {
    const pos = (s / 120) * MAX_POS;
    const x = GX0 + (s / 120) * (GX1 - GX0);
    const y = baseY - amp * Math.sin(pos * freq + phase);
    pts.push(`${s === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(" ");
}

const posX = (pos: number) => GX0 + (pos / MAX_POS) * (GX1 - GX0);

/** PE heat value for the fingerprint stripe. */
function pe(dim: number, pos: number): number {
  const freq = 1 / 10000 ** (Math.floor(dim / 2) / 4);
  return dim % 2 === 0 ? Math.sin(pos * freq) : Math.cos(pos * freq);
}

export function Scene({ step }: SceneProps) {
  const { scene } = step;

  return (
    <div className="scene">
      <div className="pane-title">positional encodings</div>
      <svg viewBox="0 0 480 360" className="scene-svg">
        {/* Bag of words problem */}
        <AnimatePresence>
          {scene === "bag" && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {["dog", "bites", "man"].map((w, i) => (
                <g key={`a${i}`}>
                  <rect x={90 + i * 106} y={80} width={94} height={26} rx={13} className="node-box" />
                  <text x={137 + i * 106} y={97} textAnchor="middle" className="box-label">
                    {w}
                  </text>
                </g>
              ))}
              {["man", "bites", "dog"].map((w, i) => (
                <g key={`b${i}`}>
                  <rect x={90 + i * 106} y={150} width={94} height={26} rx={13} className="node-box" />
                  <text x={137 + i * 106} y={167} textAnchor="middle" className="box-label">
                    {w}
                  </text>
                </g>
              ))}
              <text x={240} y={215} textAnchor="middle" className="box-label">
                same three vectors — the model can't tell them apart
              </text>
              <text x={240} y={238} textAnchor="middle" className="tiny-label">
                embeddings carry meaning, not order
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Naive numbering fails */}
        <AnimatePresence>
          {scene === "naive" && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <text x={240} y={70} textAnchor="middle" className="box-label">
                idea 1: append the position
              </text>
              {["1", "2", "3", "…", "500"].map((n, i) => (
                <g key={i}>
                  <rect
                    x={110 + i * 54}
                    y={86}
                    width={44}
                    height={22 + (i === 4 ? 26 : i * 4)}
                    rx={6}
                    className="node-box"
                    stroke={i === 4 ? "rgba(245, 158, 11, 0.55)" : "#2a2a2a"}
                  />
                  <text x={132 + i * 54} y={101} textAnchor="middle" className="tiny-label">
                    {n}
                  </text>
                </g>
              ))}
              <text x={240} y={160} textAnchor="middle" className="tiny-label">
                ✗ unbounded — position 500 drowns out the meaning
              </text>
              <text x={240} y={200} textAnchor="middle" className="box-label">
                idea 2: normalize to 0…1
              </text>
              <text x={240} y={226} textAnchor="middle" className="tiny-label">
                ✗ 0.5 = word 5 of 10, but word 50 of 100 — inconsistent
              </text>
              <text x={240} y={262} textAnchor="middle" className="tiny-label">
                needed: bounded, and the same meaning at every length
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Single sine wave */}
        <AnimatePresence>
          {scene === "wave" && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <line x1={GX0} y1={170} x2={GX1} y2={170} className="dma-line" opacity={0.4} />
              <path d={wavePath(1, 0, 170, 60)} fill="none" stroke="rgba(139, 92, 246, 0.8)" strokeWidth={1.5} />
              {[0, 1, 2, 3, 4, 5].map((p) => (
                <g key={p}>
                  <circle cx={posX(p)} cy={170 - 60 * Math.sin(p)} r={4} fill="rgba(245, 158, 11, 0.85)" />
                  <text x={posX(p)} y={252} textAnchor="middle" className="tiny-label">
                    {p}
                  </text>
                </g>
              ))}
              <text x={240} y={280} textAnchor="middle" className="tiny-label">
                read the height at each position — always within [−1, 1]
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Multiple frequencies */}
        <AnimatePresence>
          {scene === "many-waves" && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {[
                { f: 1, y: 100, label: "fast — tells neighbours apart" },
                { f: 0.4, y: 180, label: "slower" },
                { f: 0.15, y: 260, label: "slowest — coarse position" },
              ].map((w) => (
                <g key={w.f}>
                  <line x1={GX0} y1={w.y} x2={GX1} y2={w.y} className="dma-line" opacity={0.3} />
                  <path
                    d={wavePath(w.f, 0, w.y, 28)}
                    fill="none"
                    stroke={w.f === 1 ? "rgba(139, 92, 246, 0.85)" : w.f === 0.4 ? "rgba(139, 92, 246, 0.55)" : "rgba(245, 158, 11, 0.6)"}
                    strokeWidth={1.5}
                  />
                  <text x={240} y={w.y + 42} textAnchor="middle" className="tiny-label">
                    {w.label}
                  </text>
                </g>
              ))}
              <text x={240} y={330} textAnchor="middle" className="tiny-label">
                like second + minute + hour hands: together, unambiguous
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Sin/cos pair */}
        <AnimatePresence>
          {scene === "sincos" && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <line x1={GX0} y1={140} x2={GX1 - 120} y2={140} className="dma-line" opacity={0.3} />
              <path d={wavePath(0.8, 0, 140, 44)} fill="none" stroke="rgba(139, 92, 246, 0.85)" strokeWidth={1.5} />
              <path d={wavePath(0.8, Math.PI / 2, 140, 44)} fill="none" stroke="rgba(245, 158, 11, 0.65)" strokeWidth={1.5} />
              <text x={110} y={70} className="tiny-label" fill="#8b5cf6">
                sin — dimension i
              </text>
              <text x={230} y={70} className="tiny-label" fill="#f59e0b">
                cos — dimension i+1
              </text>
              <circle cx={240} cy={280} r={34} fill="none" stroke="rgba(255,255,255,0.25)" />
              <line x1={240} y1={280} x2={240 + 34 * Math.cos(1)} y2={280 - 34 * Math.sin(1)} stroke="rgba(139, 92, 246, 0.8)" strokeWidth={1.5} />
              <circle cx={240 + 34 * Math.cos(1)} cy={280 - 34 * Math.sin(1)} r={3.5} fill="rgba(245, 158, 11, 0.85)" />
              <text x={290} y={276} className="tiny-label">
                (cos, sin) = a point on a circle
              </text>
              <text x={290} y={294} className="tiny-label">
                the pair pins down the exact phase
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Fingerprint heatmap */}
        <AnimatePresence>
          {(scene === "fingerprint" || scene === "done") && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <text x={240} y={66} textAnchor="middle" className="box-label">
                p — one column per position
              </text>
              {Array.from({ length: 8 }, (_, dim) => (
                <g key={dim}>
                  <text x={98} y={98 + dim * 24} textAnchor="end" className="tiny-label">
                    {dim % 2 === 0 ? "sin" : "cos"} d{dim}
                  </text>
                  {Array.from({ length: 10 }, (_, pos) => {
                    const v = pe(dim, pos);
                    return (
                      <rect
                        key={pos}
                        x={106 + pos * 27}
                        y={86 + dim * 24}
                        width={25}
                        height={22}
                        rx={3}
                        fill={
                          v >= 0
                            ? `rgba(139, 92, 246, ${(0.12 + v * 0.55).toFixed(2)})`
                            : `rgba(245, 158, 11, ${(0.08 + -v * 0.4).toFixed(2)})`
                        }
                        stroke="#1f1f1f"
                      />
                    );
                  })}
                </g>
              ))}
              {Array.from({ length: 10 }, (_, pos) => (
                <text key={pos} x={118.5 + pos * 27} y={292} textAnchor="middle" className="tiny-label">
                  {pos}
                </text>
              ))}
              <text x={240} y={320} textAnchor="middle" className="tiny-label">
                {scene === "done"
                  ? "waves → unique fingerprints → x + p. next: attention"
                  : "no two columns match — every position is unique"}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* x + p */}
        <AnimatePresence>
          {scene === "add" && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {[
                { label: "x — meaning", x: 60, fill: "rgba(139, 92, 246, 0.25)" },
                { label: "p — position", x: 210, fill: "rgba(245, 158, 11, 0.2)" },
                { label: "x + p", x: 360, fill: "rgba(139, 92, 246, 0.35)" },
              ].map((col) => (
                <g key={col.label}>
                  <text x={col.x + 30} y={100} textAnchor="middle" className="box-label">
                    {col.label}
                  </text>
                  {[0, 1, 2, 3, 4].map((r) => (
                    <rect
                      key={r}
                      x={col.x}
                      y={112 + r * 26}
                      width={60}
                      height={22}
                      rx={4}
                      fill={col.fill}
                      stroke="#1f1f1f"
                    />
                  ))}
                </g>
              ))}
              <text x={165} y={180} textAnchor="middle" className="box-label">
                +
              </text>
              <text x={315} y={180} textAnchor="middle" className="box-label">
                =
              </text>
              <text x={240} y={276} textAnchor="middle" className="tiny-label">
                added, not concatenated — same 768 numbers now carry both
              </text>
              <text x={240} y={298} textAnchor="middle" className="tiny-label">
                'dog bites man' ≠ 'man bites dog' at last
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}
