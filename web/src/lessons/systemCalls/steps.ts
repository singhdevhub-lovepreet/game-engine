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
      text: {
        en: "A system call is a numbered service in the kernel. The kernel keeps a syscall table — an array of function pointers — and every request from user space is just an index into it.",
        hi: "System call kernel की एक numbered service है। Kernel एक syscall table रखता है — function pointers का एक array — और user space की हर request उसमें बस एक index है।",
      },
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
      text: {
        en: "You never trap into the kernel by hand. write() is a thin libc wrapper: it loads the syscall number (1 for write on x86-64) into a register, places arguments, and executes the syscall instruction.",
        hi: "आप कभी हाथ से kernel में trap नहीं करते। write() एक पतला libc wrapper है: यह syscall number (x86-64 पर write के लिए 1) एक register में रखता है, arguments सेट करता है, और syscall instruction चलाता है।",
      },
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
      text: {
        en: "The syscall instruction flips the CPU into kernel mode and jumps to one fixed entry point. Carrying just a number — no pointers into kernel memory, nothing the app chose to run.",
        hi: "syscall instruction CPU को kernel mode में ले जाता है और एक fixed entry point पर jump करता है। साथ में सिर्फ़ एक number जाता है — kernel memory के pointers नहीं, और न ही कोई app का चुना हुआ code।",
      },
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
      text: {
        en: "The kernel validates the number, indexes the syscall table, and calls the handler: sys_write. Arguments are checked — a bad buffer pointer gets EFAULT back, not a crash inside the kernel.",
        hi: "Kernel number validate करता है, syscall table में index करता है, और handler चलाता है: sys_write। Arguments जाँचे जाते हैं — गलत buffer pointer पर EFAULT मिलता है, kernel के अंदर crash नहीं।",
      },
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
      text: {
        en: "fork() (number 57) asks the kernel to clone the calling process. One call, two returns: the parent gets the child's pid, the child gets 0. Both continue from the same line of code.",
        hi: "fork() (number 57) kernel से calling process की copy बनवाता है। एक call, दो return: parent को child का pid मिलता है, child को 0। दोनों उसी line से आगे चलते हैं।",
      },
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
      text: {
        en: "The child calls execve() (number 59). The kernel throws away the child's program image and loads a new one — ls — keeping the same pid. fork makes a process; exec gives it a new program.",
        hi: "Child execve() (number 59) call करता है। Kernel child की program image हटाकर नई image — ls — load करता है, pid वही रहता है। fork process बनाता है; exec उसे नया program देता है।",
      },
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
      text: {
        en: "wait() blocks until the child exits and reaps it. Remember the pipeline: libc wrapper → syscall instruction → table dispatch → handler → return. Numbers in, services out.",
        hi: "wait() child के खत्म होने तक रुकता है और उसे reap करता है। Pipeline याद रखें: libc wrapper → syscall instruction → table dispatch → handler → return। अंदर number, बाहर service।",
      },
    },
    note: "Pipeline: wrapper → syscall → table → handler → return.",
  },
];
