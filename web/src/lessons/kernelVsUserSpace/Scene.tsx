import { AnimatePresence, motion } from "framer-motion";
import type { KernelLessonStep } from "./steps";

interface SceneProps {
  step: KernelLessonStep;
}

export function Scene({ step }: SceneProps) {
  const { scene, activeSyscall } = step;
  const userActive = scene === "user-running" || scene === "return" || scene === "done";
  const kernelActive = scene === "kernel-running";

  return (
    <div className="scene">
      <div className="pane-title">CPU privilege levels</div>
      <svg viewBox="0 0 480 360" className="scene-svg">
        <defs>
          <linearGradient id="userGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.14)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0.02)" />
          </linearGradient>
          <linearGradient id="kernelGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(245, 158, 11, 0.13)" />
            <stop offset="100%" stopColor="rgba(245, 158, 11, 0.02)" />
          </linearGradient>
        </defs>
        {/* User space */}
        <motion.rect
          x="20"
          y="16"
          width="440"
          height="120"
          rx="14"
          className="space"
          animate={{
            stroke: userActive ? "#8b5cf6" : "#1f1f1f",
            strokeWidth: userActive ? 1.5 : 1,
          }}
        />
        <motion.rect
          x="20"
          y="16"
          width="440"
          height="120"
          rx="14"
          fill="url(#userGrad)"
          animate={{ opacity: userActive ? 1 : 0 }}
        />
        <text x="40" y="40" className="space-label">
          USER SPACE · RING 3 · RESTRICTED
        </text>
        <motion.circle
          cx="250"
          cy="35"
          r="5"
          className="cpu-dot"
          animate={{ fill: userActive || scene === "trap" ? "#8b5cf6" : "#1a1a1a" }}
        />
        <text x="264" y="39" className="tiny-label">
          CPU in user mode
        </text>
        <motion.rect
          x="40"
          y="56"
          width="150"
          height="60"
          rx="10"
          className="node-box"
          animate={{ opacity: scene === "idle" ? 0.45 : 1 }}
        />
        <text x="115" y="90" textAnchor="middle" className="box-label">
          your app · main()
        </text>

        {/* Boundary */}
        <line x1="20" y1="180" x2="460" y2="180" className="boundary" />
        <text x="460" y="170" textAnchor="end" className="boundary-label">
          SYSCALL BOUNDARY
        </text>

        {/* Syscall packet */}
        <AnimatePresence>
          {(scene === "trap" || scene === "return") && activeSyscall && (
            <motion.g
              key={`${scene}-${step.id}`}
              initial={{ y: scene === "trap" ? 0 : 96, opacity: 0 }}
              animate={{ y: scene === "trap" ? 96 : 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            >
              <rect x="195" y="112" width="90" height="26" rx="13" className="syscall-pill" />
              <text x="240" y="129" textAnchor="middle" className="syscall-label">
                {scene === "trap" ? `${activeSyscall}()` : "return"}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Kernel space */}
        <motion.rect
          x="20"
          y="224"
          width="440"
          height="120"
          rx="14"
          className="space"
          animate={{
            stroke: kernelActive ? "#f59e0b" : "#1f1f1f",
            strokeWidth: kernelActive ? 1.5 : 1,
          }}
        />
        <motion.rect
          x="20"
          y="224"
          width="440"
          height="120"
          rx="14"
          fill="url(#kernelGrad)"
          animate={{ opacity: kernelActive ? 1 : 0 }}
        />
        <text x="40" y="248" className="space-label">
          KERNEL SPACE · RING 0 · FULL HARDWARE ACCESS
        </text>
        <motion.rect
          x="40"
          y="264"
          width="170"
          height="60"
          rx="10"
          className="node-box"
          animate={{ opacity: kernelActive ? 1 : 0.45 }}
        />
        <text x="125" y="298" textAnchor="middle" className="box-label">
          kernel · VFS + driver
        </text>
        <motion.rect
          x="330"
          y="264"
          width="110"
          height="60"
          rx="10"
          className="node-box"
          animate={{ opacity: kernelActive ? 1 : 0.35 }}
        />
        <text x="385" y="298" textAnchor="middle" className="box-label">
          disk
        </text>
        <motion.line
          x1="210"
          y1="294"
          x2="330"
          y2="294"
          className="dma-line"
          animate={{ opacity: kernelActive ? 0.9 : 0.15 }}
        />
        <motion.circle
          cx="250"
          cy="336"
          r="5"
          className="cpu-dot"
          animate={{ fill: kernelActive ? "#f59e0b" : "#1a1a1a" }}
        />
        <text x="264" y="340" className="tiny-label">
          CPU in kernel mode
        </text>
      </svg>
    </div>
  );
}
