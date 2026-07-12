import { AnimatePresence, motion } from "framer-motion";
import type { VectorSpaceStep } from "./steps";

interface SceneProps {
  step: VectorSpaceStep;
}

const OX = 200;
const OY = 230;
const S = 150;

const px = (x: number) => OX + x * S;
const py = (y: number) => OY - y * S;

const WORDS = [
  { label: "river", x: 0.9, y: 0.8 },
  { label: "water", x: 0.8, y: 0.9 },
  { label: "money", x: -0.7, y: 0.6 },
];

export function Scene({ step }: SceneProps) {
  const { scene } = step;
  const showPoints = scene !== "axes";
  const showArrows =
    scene === "arrows" || scene === "dot-close" || scene === "dot-far" || scene === "angle" || scene === "done";
  const closePair = scene === "dot-close" || scene === "angle" || scene === "done";
  const farPair = scene === "dot-far" || scene === "done";
  const showAngle = scene === "angle" || scene === "done";

  return (
    <div className="scene">
      <div className="pane-title">vector space</div>
      <svg viewBox="0 0 480 360" className="scene-svg">
        {/* Axes */}
        <line x1={40} y1={OY} x2={370} y2={OY} className="dma-line" opacity={0.5} />
        <line x1={OX} y1={40} x2={OX} y2={330} className="dma-line" opacity={0.5} />
        <text x={366} y={OY + 16} textAnchor="end" className="tiny-label">
          dimension 1
        </text>
        <text x={OX + 8} y={52} className="tiny-label">
          dimension 2
        </text>
        {scene === "axes" && (
          <text x={OX} y={320} textAnchor="middle" className="tiny-label">
            2 numbers per word = 2 coordinates = a point on this map
          </text>
        )}

        {/* Arrows from origin */}
        <AnimatePresence>
          {showArrows && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {WORDS.map((w) => {
                const hotViolet =
                  (closePair && (w.label === "river" || w.label === "water")) ||
                  (scene === "arrows" && false);
                const hotAmber = farPair && w.label === "money";
                return (
                  <motion.line
                    key={w.label}
                    x1={OX}
                    y1={OY}
                    x2={px(w.x)}
                    y2={py(w.y)}
                    animate={{
                      stroke: hotViolet
                        ? "rgba(139, 92, 246, 0.75)"
                        : hotAmber
                          ? "rgba(245, 158, 11, 0.7)"
                          : "rgba(255, 255, 255, 0.3)",
                    }}
                    strokeWidth={1.5}
                  />
                );
              })}
            </motion.g>
          )}
        </AnimatePresence>

        {/* Angle arc between river and water */}
        <AnimatePresence>
          {showAngle && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <path
                d={`M ${OX + 60 * Math.cos(Math.atan2(0.8, 0.9))} ${OY - 60 * Math.sin(Math.atan2(0.8, 0.9))}
                    A 60 60 0 0 1 ${OX + 60 * Math.cos(Math.atan2(0.9, 0.8))} ${OY - 60 * Math.sin(Math.atan2(0.9, 0.8))}`}
                fill="none"
                stroke="rgba(139, 92, 246, 0.8)"
                strokeWidth={1.5}
              />
              <text x={OX + 82} y={OY - 62} className="tiny-label" fill="#8b5cf6">
                θ ≈ 6° · cos θ = 0.99
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Word points */}
        <AnimatePresence>
          {showPoints && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {WORDS.map((w) => (
                <g key={w.label}>
                  <circle
                    cx={px(w.x)}
                    cy={py(w.y)}
                    r={5}
                    fill={
                      w.label === "money"
                        ? "rgba(245, 158, 11, 0.7)"
                        : "rgba(139, 92, 246, 0.8)"
                    }
                  />
                  <text
                    x={px(w.x) + (w.label === "money" ? -10 : 10)}
                    y={py(w.y) - 8}
                    textAnchor={w.label === "money" ? "end" : "start"}
                    className="box-label"
                  >
                    {w.label} ({w.x}, {w.y})
                  </text>
                </g>
              ))}
              {scene === "points" && (
                <text x={OX} y={320} textAnchor="middle" className="tiny-label">
                  river & water cluster · money lands far away
                </text>
              )}
            </motion.g>
          )}
        </AnimatePresence>

        {/* Dot product computation panels */}
        <AnimatePresence>
          {scene === "dot-close" && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <rect x={40} y={280} width={400} height={52} rx={10} className="node-box" stroke="rgba(139, 92, 246, 0.4)" />
              <text x={240} y={302} textAnchor="middle" className="box-label">
                river · water = 0.9×0.8 + 0.8×0.9 = 1.44
              </text>
              <text x={240} y={321} textAnchor="middle" className="tiny-label">
                coordinates agree → products add up → big score
              </text>
            </motion.g>
          )}
          {scene === "dot-far" && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <rect x={40} y={280} width={400} height={52} rx={10} className="node-box" stroke="rgba(245, 158, 11, 0.4)" />
              <text x={240} y={302} textAnchor="middle" className="box-label">
                river · money = 0.9×(−0.7) + 0.8×0.6 = −0.15
              </text>
              <text x={240} y={321} textAnchor="middle" className="tiny-label">
                products fight each other → score collapses
              </text>
            </motion.g>
          )}
          {scene === "done" && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <text x={240} y={320} textAnchor="middle" className="tiny-label">
                closeness in space → one number: attention's core operation
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}
