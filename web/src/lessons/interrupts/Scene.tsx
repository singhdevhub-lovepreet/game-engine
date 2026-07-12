import { AnimatePresence, motion } from "framer-motion";
import type { InterruptsStep, SceneState } from "./steps";

interface SceneProps {
  step: InterruptsStep;
}

const ORDER: SceneState[] = [
  "idle",
  "blocked",
  "irq",
  "save",
  "vector",
  "handler",
  "wake",
  "resume",
  "done",
];

const IDT_ROWS = [
  { vec: "0x0E", handler: "page_fault" },
  { vec: "0x20", handler: "timer_irq" },
  { vec: "0x21", handler: "keyboard_irq" },
  { vec: "0x80", handler: "syscall" },
];

export function Scene({ step }: SceneProps) {
  const { scene } = step;
  const idx = ORDER.indexOf(scene);
  const reached = (s: SceneState) => idx >= ORDER.indexOf(s);

  const hwActive = scene === "irq" || scene === "save" || scene === "done";
  const kernelActive =
    scene === "vector" || scene === "handler" || scene === "wake" || scene === "done";
  const savedVisible = reached("save") && scene !== "done";
  const idtActive = reached("vector");
  const rowActive =
    scene === "vector" || scene === "handler" || scene === "wake" || scene === "done";
  const handlerActive = reached("handler");

  const runningOn =
    scene === "idle" || scene === "resume" || scene === "done"
      ? "your app"
      : scene === "blocked" || scene === "irq" || scene === "save"
        ? "other process"
        : "irq handler";
  const processStatus =
    scene === "idle" || scene === "resume" || scene === "done"
      ? "your app · running"
      : scene === "wake"
        ? "your app · ready (run queue)"
        : "your app · blocked (wait queue)";

  return (
    <div className="scene">
      <div className="pane-title">interrupt path</div>
      <svg viewBox="0 0 480 360" className="scene-svg">
        <defs>
          <linearGradient id="irqHwGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.07)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0.01)" />
          </linearGradient>
          <linearGradient id="irqKernelGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(245, 158, 11, 0.06)" />
            <stop offset="100%" stopColor="rgba(245, 158, 11, 0.01)" />
          </linearGradient>
        </defs>

        {/* Hardware */}
        <motion.rect
          x="20"
          y="16"
          width="440"
          height="88"
          rx="14"
          className="space"
          animate={{
            stroke: hwActive ? "rgba(139, 92, 246, 0.55)" : "#1f1f1f",
            strokeWidth: hwActive ? 1.5 : 1,
          }}
        />
        <motion.rect
          x="20"
          y="16"
          width="440"
          height="88"
          rx="14"
          fill="url(#irqHwGrad)"
          animate={{ opacity: hwActive ? 1 : 0 }}
        />
        <text x="40" y="40" className="space-label">
          HARDWARE
        </text>
        <motion.rect
          x="40"
          y="50"
          width="120"
          height="44"
          rx="10"
          className="node-box"
          animate={{ opacity: reached("irq") ? 1 : 0.45 }}
        />
        <text x="100" y="69" textAnchor="middle" className="box-label">
          keyboard
        </text>
        <text x="100" y="86" textAnchor="middle" className="tiny-label">
          scancode 0x1E
        </text>
        <motion.line
          x1="160"
          y1="72"
          x2="210"
          y2="72"
          className="dma-line"
          animate={{ opacity: scene === "irq" ? 0.9 : 0.15 }}
        />
        <motion.rect
          x="210"
          y="50"
          width="110"
          height="44"
          rx="10"
          className="node-box"
          animate={{ opacity: reached("irq") ? 1 : 0.45 }}
        />
        <text x="265" y="69" textAnchor="middle" className="box-label">
          APIC
        </text>
        <text x="265" y="86" textAnchor="middle" className="tiny-label">
          IRQ 1 → vec 0x21
        </text>
        <motion.line
          x1="320"
          y1="72"
          x2="360"
          y2="72"
          className="dma-line"
          animate={{ opacity: scene === "irq" || scene === "save" ? 0.9 : 0.15 }}
        />
        <motion.rect
          x="360"
          y="50"
          width="80"
          height="44"
          rx="10"
          className="node-box"
          animate={{ opacity: scene === "idle" ? 0.6 : 1 }}
        />
        <text x="400" y="69" textAnchor="middle" className="box-label">
          CPU
        </text>
        <text x="400" y="86" textAnchor="middle" className="tiny-label">
          {kernelActive || scene === "save" ? "kernel mode" : "user mode"}
        </text>
        <AnimatePresence>
          {scene === "irq" && (
            <motion.circle
              key="irq-dot"
              cy="72"
              r="5"
              fill="rgba(245, 158, 11, 0.8)"
              initial={{ cx: 160, opacity: 0 }}
              animate={{ cx: 360, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>

        {/* CPU state strip */}
        <rect x="20" y="116" width="440" height="64" rx="14" className="space" />
        <text x="40" y="138" className="space-label">
          CPU STATE
        </text>
        <rect x="150" y="146" width="140" height="24" rx="8" className="node-box" />
        <text x="220" y="162" textAnchor="middle" className="tiny-label">
          running: {runningOn}
        </text>
        <AnimatePresence>
          {savedVisible && (
            <motion.g
              key="saved"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <rect
                x="300"
                y="146"
                width="150"
                height="24"
                rx="8"
                className="node-box"
                stroke="rgba(139, 92, 246, 0.45)"
              />
              <text x="375" y="162" textAnchor="middle" className="tiny-label">
                saved: rip · rflags · rsp
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Kernel */}
        <motion.rect
          x="20"
          y="192"
          width="440"
          height="152"
          rx="14"
          className="space"
          animate={{
            stroke: kernelActive ? "rgba(245, 158, 11, 0.5)" : "#1f1f1f",
            strokeWidth: kernelActive ? 1.5 : 1,
          }}
        />
        <motion.rect
          x="20"
          y="192"
          width="440"
          height="152"
          rx="14"
          fill="url(#irqKernelGrad)"
          animate={{ opacity: kernelActive ? 1 : 0 }}
        />
        <text x="40" y="216" className="space-label">
          KERNEL SPACE
        </text>

        {/* IDT */}
        <motion.rect
          x="40"
          y="228"
          width="180"
          height="78"
          rx="10"
          className="node-box"
          animate={{ opacity: idtActive ? 1 : 0.45 }}
        />
        {IDT_ROWS.map((row, i) => {
          const rowY = 246 + i * 16;
          const active = rowActive && row.vec === "0x21";
          return (
            <g key={row.vec}>
              {active && (
                <motion.rect
                  x="46"
                  y={rowY - 11}
                  width="168"
                  height="15"
                  rx="4"
                  fill="rgba(245, 158, 11, 0.12)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
              <text x="56" y={rowY} className="tiny-label" fill={active ? "#f59e0b" : undefined}>
                {row.vec}
              </text>
              <text x="96" y={rowY} className="tiny-label">
                {row.handler}
              </text>
            </g>
          );
        })}

        {/* Handler */}
        <motion.line
          x1="220"
          y1="264"
          x2="300"
          y2="264"
          className="dma-line"
          animate={{ opacity: handlerActive ? 0.9 : 0.15 }}
        />
        <motion.rect
          x="300"
          y="236"
          width="140"
          height="56"
          rx="10"
          className="node-box"
          animate={{ opacity: handlerActive ? 1 : 0.35 }}
        />
        <text x="370" y="260" textAnchor="middle" className="box-label">
          keyboard_irq()
        </text>
        <text x="370" y="278" textAnchor="middle" className="tiny-label">
          scancode → buffer → EOI
        </text>

        {/* Process status */}
        <motion.text
          key={processStatus}
          x="240"
          y="328"
          textAnchor="middle"
          className="tiny-label"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          fill={scene === "wake" ? "#f59e0b" : undefined}
        >
          {processStatus}
        </motion.text>
      </svg>
    </div>
  );
}
