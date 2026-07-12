import { AnimatePresence, motion } from "framer-motion";
import type { MonoMicroStep, SceneState } from "./steps";

interface SceneProps {
  step: MonoMicroStep;
}

const VIOLET = "rgba(139, 92, 246, 0.55)";
const AMBER = "rgba(245, 158, 11, 0.55)";
const DIM = "#1f1f1f";

const MONO_SCENES: SceneState[] = ["mono-layout", "mono-call", "mono-crash"];
const MICRO_SCENES: SceneState[] = ["micro-layout", "micro-ipc", "micro-crash"];
const BOTH_SCENES: SceneState[] = ["intro", "spectrum", "done"];

interface Block {
  label: string;
  y: number;
  h: number;
}

const MONO_USER: Block[] = [{ label: "your app", y: 64, h: 30 }];
const MONO_KERNEL: Block[] = [
  { label: "file system", y: 136, h: 26 },
  { label: "network stack", y: 166, h: 26 },
  { label: "disk driver", y: 196, h: 26 },
  { label: "other drivers", y: 226, h: 26 },
  { label: "sched · memory", y: 256, h: 26 },
];

const MICRO_USER: Block[] = [
  { label: "your app", y: 64, h: 26 },
  { label: "FS server", y: 94, h: 26 },
  { label: "disk-driver server", y: 124, h: 26 },
  { label: "network server", y: 154, h: 26 },
];
const MICRO_KERNEL: Block[] = [{ label: "IPC · sched · memory", y: 256, h: 26 }];

function Ram({
  x,
  title,
  active,
  userBlocks,
  kernelBlocks,
  kernelTop,
  crashedLabel,
  crashFatal,
  children,
}: {
  x: number;
  title: string;
  active: boolean;
  userBlocks: Block[];
  kernelBlocks: Block[];
  kernelTop: number;
  crashedLabel?: string;
  crashFatal?: boolean;
  children?: React.ReactNode;
}) {
  const w = 168;
  return (
    <motion.g animate={{ opacity: active ? 1 : 0.5 }} transition={{ duration: 0.4 }}>
      {/* RAM stick outline with notch pins */}
      <motion.rect
        x={x}
        y={40}
        width={w}
        height={266}
        rx={12}
        className="space"
        animate={{
          stroke: crashFatal ? AMBER : active ? VIOLET : DIM,
          strokeWidth: active ? 1.5 : 1,
        }}
      />
      {Array.from({ length: 8 }, (_, i) => (
        <rect
          key={i}
          x={x + 16 + i * 19}
          y={306}
          width={9}
          height={7}
          rx={1.5}
          fill="#1a1a1a"
        />
      ))}
      <text x={x + w / 2} y={30} textAnchor="middle" className="space-label">
        {title}
      </text>

      {/* address rail */}
      <text x={x + w - 10} y={58} textAnchor="end" className="tiny-label" opacity={0.55}>
        0xFFFF…
      </text>
      <text x={x + w - 10} y={298} textAnchor="end" className="tiny-label" opacity={0.55}>
        0x0000
      </text>

      {/* user region */}
      <text x={x + 14} y={58} className="tiny-label" fill={VIOLET}>
        USER
      </text>
      {userBlocks.map((b) => {
        const crashed = crashedLabel === b.label;
        return (
          <g key={b.label}>
            <motion.rect
              x={x + 14}
              y={b.y}
              width={w - 28}
              height={b.h}
              rx={7}
              className="node-box"
              animate={{
                stroke: crashed ? AMBER : undefined,
                opacity: crashed ? [1, 0.25, 1, 0.6] : 1,
              }}
              transition={crashed ? { duration: 1.2 } : undefined}
            />
            <text
              x={x + w / 2}
              y={b.y + b.h / 2 + 4}
              textAnchor="middle"
              className="tiny-label"
              fill={crashed ? "#f59e0b" : "var(--text-secondary)"}
            >
              {b.label}
            </text>
          </g>
        );
      })}

      {/* privilege boundary */}
      <line
        x1={x + 10}
        y1={kernelTop - 10}
        x2={x + w - 10}
        y2={kernelTop - 10}
        className="dma-line"
        strokeDasharray="4 5"
        opacity={0.5}
      />

      {/* kernel region */}
      <text x={x + 14} y={kernelTop + 4} className="tiny-label" fill={AMBER}>
        KERNEL · RING 0
      </text>
      {kernelBlocks.map((b) => {
        const crashed = crashedLabel === b.label;
        return (
          <g key={b.label}>
            <motion.rect
              x={x + 14}
              y={b.y}
              width={w - 28}
              height={b.h}
              rx={7}
              className="node-box"
              animate={{
                stroke: crashed ? AMBER : "rgba(245, 158, 11, 0.22)",
                opacity: crashed ? [1, 0.25, 1, 0.6] : 1,
              }}
              transition={crashed ? { duration: 1.2 } : undefined}
            />
            <text
              x={x + w / 2}
              y={b.y + b.h / 2 + 4}
              textAnchor="middle"
              className="tiny-label"
              fill={crashed ? "#f59e0b" : "var(--text-secondary)"}
            >
              {b.label}
            </text>
          </g>
        );
      })}
      {children}
    </motion.g>
  );
}

export function Scene({ step }: SceneProps) {
  const { scene } = step;
  const monoActive = MONO_SCENES.includes(scene) || BOTH_SCENES.includes(scene);
  const microActive = MICRO_SCENES.includes(scene) || BOTH_SCENES.includes(scene);

  const MX = 48; // monolithic column x
  const UX = 264; // microkernel column x

  return (
    <div className="scene">
      <div className="pane-title">two ways to build a kernel</div>
      <svg viewBox="0 0 480 360" className="scene-svg">
        <Ram
          x={MX}
          title="MONOLITHIC · LINUX"
          active={monoActive}
          userBlocks={MONO_USER}
          kernelBlocks={MONO_KERNEL}
          kernelTop={126}
          crashedLabel={scene === "mono-crash" ? "other drivers" : undefined}
          crashFatal={scene === "mono-crash"}
        >
          {/* direct call dot: app → FS → driver */}
          <AnimatePresence>
            {scene === "mono-call" && (
              <motion.circle
                key="mono-dot"
                cx={MX + 84}
                r={4.5}
                fill={VIOLET}
                initial={{ cy: 79, opacity: 0 }}
                animate={{ cy: [79, 149, 209], opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {scene === "mono-crash" && (
              <motion.g
                key="panic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <rect
                  x={MX + 20}
                  y={160}
                  width={128}
                  height={30}
                  rx={8}
                  fill="rgba(245, 158, 11, 0.12)"
                  stroke={AMBER}
                />
                <text
                  x={MX + 84}
                  y={179}
                  textAnchor="middle"
                  className="box-label"
                  fill="#f59e0b"
                >
                  KERNEL PANIC
                </text>
              </motion.g>
            )}
          </AnimatePresence>
        </Ram>

        <Ram
          x={UX}
          title="MICROKERNEL · QNX"
          active={microActive}
          userBlocks={MICRO_USER}
          kernelBlocks={MICRO_KERNEL}
          kernelTop={246}
          crashedLabel={scene === "micro-crash" ? "disk-driver server" : undefined}
        >
          {/* IPC hops: app → kernel → FS → kernel → driver */}
          <AnimatePresence>
            {scene === "micro-ipc" && (
              <motion.circle
                key="ipc-dot"
                cx={UX + 84}
                r={4.5}
                fill={VIOLET}
                initial={{ cy: 77, opacity: 0 }}
                animate={{ cy: [77, 269, 107, 269, 137, 269, 77], opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 4.2, ease: "easeInOut" }}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {scene === "micro-crash" && (
              <motion.text
                key="restart"
                x={UX + 84}
                y={210}
                textAnchor="middle"
                className="tiny-label"
                fill="#8b5cf6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1.3, duration: 0.5 }}
              >
                ↻ restarted by the kernel
              </motion.text>
            )}
          </AnimatePresence>
        </Ram>

        {/* spectrum band */}
        <AnimatePresence>
          {(scene === "spectrum" || scene === "done") && (
            <motion.g
              key="spectrum"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <line
                x1={90}
                y1={340}
                x2={390}
                y2={340}
                className="dma-line"
                opacity={0.6}
              />
              <circle cx={110} cy={340} r={3.5} fill={AMBER} />
              <text x={110} y={356} textAnchor="middle" className="tiny-label">
                Linux + modules
              </text>
              <circle cx={240} cy={340} r={3.5} fill="rgba(139, 92, 246, 0.75)" />
              <text x={240} y={356} textAnchor="middle" className="tiny-label">
                Windows · macOS (hybrid)
              </text>
              <circle cx={370} cy={340} r={3.5} fill={VIOLET} />
              <text x={370} y={356} textAnchor="middle" className="tiny-label">
                QNX · MINIX · seL4
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}
