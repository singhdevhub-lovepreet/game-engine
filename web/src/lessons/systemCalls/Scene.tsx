import { AnimatePresence, motion } from "framer-motion";
import type { SyscallName, SystemCallsStep } from "./steps";

interface SceneProps {
  step: SystemCallsStep;
}

const TABLE_ROWS: { nr: number; name: SyscallName; handler: string }[] = [
  { nr: 1, name: "write", handler: "sys_write" },
  { nr: 57, name: "fork", handler: "sys_fork" },
  { nr: 59, name: "execve", handler: "sys_execve" },
  { nr: 61, name: "wait4", handler: "sys_wait4" },
];

export function Scene({ step }: SceneProps) {
  const { scene, activeSyscall } = step;
  const userActive = scene === "wrapper" || scene === "forked" || scene === "done";
  const kernelActive = scene === "dispatch" || scene === "exec";
  const dispatching = scene === "dispatch" || scene === "forked" || scene === "exec" || scene === "done";
  const activeRow = TABLE_ROWS.find((r) => r.name === activeSyscall);
  const childVisible = scene === "forked" || scene === "exec" || scene === "done";

  return (
    <div className="scene">
      <div className="pane-title">syscall dispatch</div>
      <svg viewBox="0 0 480 360" className="scene-svg">
        <defs>
          <linearGradient id="scUserGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.07)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0.01)" />
          </linearGradient>
          <linearGradient id="scKernelGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(245, 158, 11, 0.06)" />
            <stop offset="100%" stopColor="rgba(245, 158, 11, 0.01)" />
          </linearGradient>
        </defs>

        {/* User space */}
        <motion.rect
          x="20"
          y="16"
          width="440"
          height="116"
          rx="14"
          className="space"
          animate={{
            stroke: userActive ? "rgba(139, 92, 246, 0.55)" : "#1f1f1f",
            strokeWidth: userActive ? 1.5 : 1,
          }}
        />
        <motion.rect
          x="20"
          y="16"
          width="440"
          height="116"
          rx="14"
          fill="url(#scUserGrad)"
          animate={{ opacity: userActive ? 1 : 0 }}
        />
        <text x="40" y="40" className="space-label">
          USER SPACE
        </text>
        <motion.rect
          x="40"
          y="56"
          width="120"
          height="56"
          rx="10"
          className="node-box"
          animate={{ opacity: scene === "idle" ? 0.45 : 1 }}
        />
        <text x="100" y="88" textAnchor="middle" className="box-label">
          your app
        </text>
        <motion.rect
          x="185"
          y="56"
          width="150"
          height="56"
          rx="10"
          className="node-box"
          animate={{ opacity: scene === "wrapper" || scene === "trap" ? 1 : 0.4 }}
        />
        <text x="260" y="80" textAnchor="middle" className="box-label">
          libc wrapper
        </text>
        <text x="260" y="98" textAnchor="middle" className="tiny-label">
          {activeRow ? `rax = ${activeRow.nr}` : "rax = nr"}
        </text>
        <AnimatePresence>
          {childVisible && (
            <motion.g
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <rect x="356" y="56" width="84" height="56" rx="10" className="node-box" />
              <text x="398" y="80" textAnchor="middle" className="box-label">
                {scene === "forked" ? "child" : "ls"}
              </text>
              <text x="398" y="98" textAnchor="middle" className="tiny-label">
                {scene === "forked" ? "fork → 0" : "new image"}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Boundary */}
        <line x1="20" y1="176" x2="460" y2="176" className="boundary" />
        <text x="460" y="166" textAnchor="end" className="boundary-label">
          SYSCALL BOUNDARY
        </text>

        {/* Syscall packet */}
        <AnimatePresence>
          {scene === "trap" && activeRow && (
            <motion.g
              key={step.id}
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: 92, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            >
              <rect x="185" y="118" width="150" height="26" rx="13" className="syscall-pill" />
              <text x="260" y="135" textAnchor="middle" className="syscall-label">
                syscall · nr {activeRow.nr}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Kernel space */}
        <motion.rect
          x="20"
          y="220"
          width="440"
          height="124"
          rx="14"
          className="space"
          animate={{
            stroke: kernelActive ? "rgba(245, 158, 11, 0.5)" : "#1f1f1f",
            strokeWidth: kernelActive ? 1.5 : 1,
          }}
        />
        <motion.rect
          x="20"
          y="220"
          width="440"
          height="124"
          rx="14"
          fill="url(#scKernelGrad)"
          animate={{ opacity: kernelActive ? 1 : 0 }}
        />
        <text x="40" y="244" className="space-label">
          KERNEL SPACE
        </text>

        {/* Syscall table */}
        <motion.rect
          x="40"
          y="254"
          width="180"
          height="78"
          rx="10"
          className="node-box"
          animate={{ opacity: dispatching ? 1 : 0.45 }}
        />
        {TABLE_ROWS.map((row, i) => {
          const rowY = 268 + i * 16;
          const active = dispatching && activeRow?.name === row.name;
          return (
            <g key={row.name}>
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
                {row.nr}
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
          y1="293"
          x2="300"
          y2="293"
          className="dma-line"
          animate={{ opacity: dispatching ? 0.9 : 0.15 }}
        />
        <motion.rect
          x="300"
          y="266"
          width="140"
          height="54"
          rx="10"
          className="node-box"
          animate={{ opacity: dispatching ? 1 : 0.35 }}
        />
        <text x="370" y="290" textAnchor="middle" className="box-label">
          {activeRow ? `${activeRow.handler}()` : "handler()"}
        </text>
        <text x="370" y="307" textAnchor="middle" className="tiny-label">
          validate → do → return
        </text>
      </svg>
    </div>
  );
}
