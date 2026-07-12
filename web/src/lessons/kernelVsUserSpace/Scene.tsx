import { AnimatePresence, motion } from "framer-motion";
import type { KernelLessonStep, SceneState } from "./steps";

interface SceneProps {
  step: KernelLessonStep;
}

const packetPosition: Record<SceneState, { y: number; opacity: number }> = {
  idle: { y: 0, opacity: 0 },
  "user-running": { y: 0, opacity: 0 },
  trap: { y: 150, opacity: 1 },
  "kernel-running": { y: 150, opacity: 0 },
  return: { y: 0, opacity: 1 },
  done: { y: 0, opacity: 0 },
};

export function Scene({ step }: SceneProps) {
  const { scene, activeSyscall } = step;
  const userActive = scene === "user-running" || scene === "return" || scene === "done";
  const kernelActive = scene === "kernel-running";

  return (
    <div className="scene">
      <div className="pane-title">CPU privilege levels</div>
      <svg viewBox="0 0 480 340" className="scene-svg">
        {/* User space */}
        <motion.rect
          x="20"
          y="20"
          width="440"
          height="120"
          rx="10"
          className="space user-space"
          animate={{
            stroke: userActive ? "#4ade80" : "#334155",
            strokeWidth: userActive ? 2.5 : 1.5,
          }}
        />
        <text x="36" y="46" className="space-label user-label">
          USER SPACE · ring 3 · restricted
        </text>
        <motion.rect
          x="40"
          y="60"
          width="150"
          height="60"
          rx="8"
          className="process-box"
          animate={{ opacity: scene === "idle" ? 0.5 : 1 }}
        />
        <text x="60" y="95" className="box-label">
          your app (main)
        </text>
        <motion.circle
          cx="230"
          cy="90"
          r="7"
          className="cpu-dot"
          animate={{
            fill: userActive || scene === "trap" ? "#4ade80" : "#1e293b",
          }}
        />
        <text x="245" y="95" className="tiny-label">
          CPU in user mode
        </text>

        {/* Boundary */}
        <line x1="20" y1="170" x2="460" y2="170" className="boundary" />
        <text x="330" y="163" className="boundary-label">
          syscall boundary
        </text>
        <AnimatePresence>
          {(scene === "trap" || scene === "return") && activeSyscall && (
            <motion.g
              key={`${scene}-${step.id}`}
              initial={{ y: scene === "trap" ? 0 : 150, opacity: 0 }}
              animate={{
                y: packetPosition[scene].y,
                opacity: packetPosition[scene].opacity,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            >
              <rect x="200" y="105" width="90" height="28" rx="14" className="syscall-pill" />
              <text x="212" y="124" className="syscall-label">
                {scene === "trap" ? `${activeSyscall}()` : "return"}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Kernel space */}
        <motion.rect
          x="20"
          y="200"
          width="440"
          height="120"
          rx="10"
          className="space kernel-space"
          animate={{
            stroke: kernelActive ? "#f472b6" : "#334155",
            strokeWidth: kernelActive ? 2.5 : 1.5,
          }}
        />
        <text x="36" y="226" className="space-label kernel-label">
          KERNEL SPACE · ring 0 · full hardware access
        </text>
        <motion.rect
          x="40"
          y="240"
          width="170"
          height="60"
          rx="8"
          className="kernel-box"
          animate={{ opacity: kernelActive ? 1 : 0.55 }}
        />
        <text x="58" y="275" className="box-label">
          kernel: VFS + driver
        </text>
        <motion.rect
          x="330"
          y="240"
          width="110"
          height="60"
          rx="8"
          className="disk-box"
          animate={{ opacity: kernelActive ? 1 : 0.45 }}
        />
        <text x="356" y="275" className="box-label">
          disk
        </text>
        <motion.line
          x1="210"
          y1="270"
          x2="330"
          y2="270"
          className="dma-line"
          animate={{ opacity: kernelActive ? 1 : 0.2 }}
        />
        <motion.circle
          cx="240"
          cy="270"
          r="7"
          className="cpu-dot"
          animate={{ fill: kernelActive ? "#f472b6" : "#1e293b" }}
        />
        <text x="255" y="275" className="tiny-label">
          CPU in kernel mode
        </text>
      </svg>
    </div>
  );
}
