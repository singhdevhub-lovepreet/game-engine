import type { LessonStep } from "../../types";

export const cCode = `#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    write(1, "hi\\n", 3);

    pid_t pid = fork();

    if (pid == 0) {
        execlp("ls", "ls", NULL);
    }

    wait(NULL);
    return 0;
}`;

export type SyscallName = "write" | "fork" | "execve" | "wait4";

export type SceneState =
  | "idle"
  | "wrapper"
  | "trap"
  | "dispatch"
  | "forked"
  | "exec"
  | "done";

export interface SystemCallsStep extends LessonStep {
  scene: SceneState;
  activeSyscall?: SyscallName;
}

/** Terms surfaced in this lesson's jargon decoder, in teaching order. */
export const glossaryIds = [
  "syscall",
  "syscall-table",
  "libc",
  "trap",
  "kernel-mode",
  "user-mode",
  "fork",
  "pid",
  "exec",
  "handler",
];

export const steps: SystemCallsStep[] = [
  {
    id: "intro",
    codeLines: [],
    scene: "idle",
    terms: ["syscall", "syscall-table"],
    narration: {
      id: "intro",
      text: "A system call is a numbered service in the kernel. The kernel keeps a syscall table — an array of function pointers — and every request from user space is just an index into it.",
    },
    note: "Every syscall has a number; the kernel dispatches through a syscall table.",
  },
  {
    id: "wrapper",
    codeLines: [5],
    scene: "wrapper",
    activeSyscall: "write",
    terms: ["libc", "syscall"],
    narration: {
      id: "wrapper",
      text: "You never trap into the kernel by hand. write() is a thin libc wrapper: it loads the syscall number (1 for write on x86-64) into a register, places arguments, and executes the syscall instruction.",
    },
    note: "libc wrappers load the syscall number into a register (rax on x86-64).",
  },
  {
    id: "trap",
    codeLines: [5],
    scene: "trap",
    activeSyscall: "write",
    terms: ["trap", "kernel-mode"],
    narration: {
      id: "trap",
      text: "The syscall instruction flips the CPU into kernel mode and jumps to one fixed entry point. Carrying just a number — no pointers into kernel memory, nothing the app chose to run.",
    },
    note: "One fixed entry point: the app passes a number, never a kernel address.",
  },
  {
    id: "dispatch",
    codeLines: [5],
    scene: "dispatch",
    activeSyscall: "write",
    terms: ["syscall-table", "handler"],
    narration: {
      id: "dispatch",
      text: "The kernel validates the number, indexes the syscall table, and calls the handler: sys_write. Arguments are checked — a bad buffer pointer gets EFAULT back, not a crash inside the kernel.",
    },
    note: "table[nr] → handler. The kernel validates every argument before touching it.",
  },
  {
    id: "fork",
    codeLines: [7],
    scene: "forked",
    activeSyscall: "fork",
    terms: ["fork", "pid"],
    narration: {
      id: "fork",
      text: "fork() (number 57) asks the kernel to clone the calling process. One call, two returns: the parent gets the child's pid, the child gets 0. Both continue from the same line of code.",
    },
    note: "fork(): one call, two returns — pid in the parent, 0 in the child.",
  },
  {
    id: "exec",
    codeLines: [9, 10],
    scene: "exec",
    activeSyscall: "execve",
    terms: ["exec", "pid"],
    narration: {
      id: "exec",
      text: "The child calls execve() (number 59). The kernel throws away the child's program image and loads a new one — ls — keeping the same pid. fork makes a process; exec gives it a new program.",
    },
    note: "exec replaces the program image, same pid. fork + exec = how every program starts.",
  },
  {
    id: "summary",
    codeLines: [13, 14],
    scene: "done",
    activeSyscall: "wait4",
    terms: ["libc", "syscall", "syscall-table", "handler"],
    narration: {
      id: "summary",
      text: "wait() blocks until the child exits and reaps it. Remember the pipeline: libc wrapper → syscall instruction → table dispatch → handler → return. Numbers in, services out.",
    },
    note: "Pipeline: wrapper → syscall → table → handler → return.",
  },
];
