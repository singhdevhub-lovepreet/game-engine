import type { LessonStep } from "../../types";

export const cCode = `#include <unistd.h>
#include <fcntl.h>

int main(void) {
    char buf[64];

    int fd = open("notes.txt", O_RDONLY);

    ssize_t n = read(fd, buf, sizeof(buf));

    write(STDOUT_FILENO, buf, n);

    close(fd);
    return 0;
}`;

export type SceneState =
  | "idle"
  | "user-running"
  | "trap"
  | "kernel-running"
  | "return"
  | "done";

export interface KernelLessonStep extends LessonStep {
  scene: SceneState;
  activeSyscall?: "open" | "read" | "write" | "close";
}

/** Terms surfaced in this lesson's jargon decoder, in teaching order. */
export const glossaryIds = [
  "user-mode",
  "kernel-mode",
  "syscall",
  "libc",
  "trap",
  "fd",
  "stdin",
];

export const steps: KernelLessonStep[] = [
  {
    id: "intro",
    codeLines: [],
    scene: "idle",
    terms: ["user-mode", "kernel-mode"],
    narration: {
      id: "intro",
      text: "Your CPU runs in two privilege levels. Applications live in user mode (ring 3) with restricted access. The kernel runs in kernel mode (ring 0) with full hardware control.",
    },
    note: "User mode = ring 3, restricted. Kernel mode = ring 0, unrestricted hardware access.",
  },
  {
    id: "user-code",
    codeLines: [4, 5],
    scene: "user-running",
    terms: ["user-mode"],
    narration: {
      id: "user-code",
      text: "main() starts executing in user space. Local variables like buf live on the process's own stack — no kernel help needed yet.",
    },
    note: "Ordinary computation never leaves user mode — it's fast.",
  },
  {
    id: "open-trap",
    codeLines: [7],
    scene: "trap",
    activeSyscall: "open",
    terms: ["syscall", "libc", "trap"],
    narration: {
      id: "open-trap",
      text: "open() needs the disk — hardware the app cannot touch directly. The C library issues a syscall instruction, the CPU flips its mode bit, and control traps across the boundary into the kernel.",
    },
    note: "A system call is the ONLY doorway from user space into the kernel.",
  },
  {
    id: "kernel-work",
    codeLines: [7],
    scene: "kernel-running",
    activeSyscall: "open",
    terms: ["kernel-mode", "fd"],
    narration: {
      id: "kernel-work",
      text: "Now in kernel mode, the OS checks permissions, finds the file on disk, and creates a file descriptor. The application is suspended while the kernel works on its behalf.",
    },
    note: "The kernel validates every request — apps can't be trusted with raw hardware.",
  },
  {
    id: "return",
    codeLines: [7],
    scene: "return",
    activeSyscall: "open",
    terms: ["fd", "user-mode"],
    narration: {
      id: "return",
      text: "The kernel returns the file descriptor, the CPU switches back to user mode, and open() simply returns an int. To your C code the whole round trip looks like a normal function call.",
    },
    note: "Mode switch ≠ context switch — same process, different privilege level.",
  },
  {
    id: "read-write",
    codeLines: [9, 11],
    scene: "trap",
    activeSyscall: "read",
    terms: ["trap", "stdin"],
    narration: {
      id: "read-write",
      text: "read() and write() repeat the same dance: trap in, kernel copies bytes between the device and your buffer, trap out. Every crossing has a cost — that's why buffered I/O batches them.",
    },
    note: "Interview favourite: syscalls are expensive; minimize boundary crossings.",
  },
  {
    id: "summary",
    codeLines: [13, 14],
    scene: "done",
    terms: ["user-mode", "kernel-mode", "syscall"],
    narration: {
      id: "summary",
      text: "close() releases the descriptor and the program ends. Remember: user space for isolation, kernel space for authority, and system calls as the guarded gate between them.",
    },
    note: "Summary: isolation (user) + authority (kernel) + guarded gate (syscall).",
  },
];
