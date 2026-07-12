import type { ChapterSummary } from "./types";

export const osBasicsSummary: ChapterSummary = {
  chapterId: "os-basics",
  title: "Chapter 1 Recap — OS Basics & Architecture",
  intro: "Before an OS can juggle processes, memory, or files, it has to answer a more basic question: who is allowed to touch the hardware, and how does everyone else ask for it? This chapter built that foundation — the privilege boundary, the three ways execution crosses it (system calls, interrupts), and the two big schools of kernel design. Read this recap end-to-end once; if every paragraph feels obvious, you are ready for Chapter 2.",
  sections: [
    {
      id: "kernel-vs-user",
      heading: "1. Kernel vs. User Space — one machine, two worlds",
      body: [
        "Every modern CPU runs code at (at least) two privilege levels. In user mode (ring 3), your program can compute, branch, and read/write its own memory — but it cannot talk to the disk, the network card, or another process's memory. In kernel mode (ring 0), the OS has unrestricted access to every instruction and every byte of physical hardware. This split is enforced by the CPU itself, not by convention: a user-mode program that tries a privileged instruction gets a fault, not a favor.",
        "Why bother? Isolation and stability. If your text editor dereferences a wild pointer, only the editor dies — the kernel and every other program keep running. The boundary is the reason a buggy app cannot corrupt the file system, and the reason multi-user systems can exist at all.",
      ],
      figure: {
        kind: "rings",
        caption: "The privilege boundary: apps in ring 3, the kernel in ring 0, hardware below.",
      },
      bullets: [
        "User mode = restricted; kernel mode = unrestricted. The CPU enforces it.",
        "Crossing the boundary is a controlled event (trap), never a free jump.",
      ],
    },
    {
      id: "system-calls",
      heading: "2. System Calls — the front door into the kernel",
      body: [
        "A system call is how a user program asks the kernel to do privileged work: open a file, read bytes, create a process. Your code calls a libc wrapper (read(), fork()…), the wrapper puts a syscall number in a register (e.g. rax) and executes the syscall instruction. The CPU flips to kernel mode, jumps to a fixed entry point, and the kernel uses the number to index its syscall table and dispatch to the right handler (sys_read, sys_fork…). The result travels back, the CPU drops to user mode, and your program continues as if it had called an ordinary function — an ordinary function that briefly owned the machine.",
        "The four calls every interview expects: fork() clones the calling process (returning 0 in the child, the child's PID in the parent); exec() replaces the current process image with a new program; wait() blocks until a child exits and reaps it; read()/write() move bytes through file descriptors. fork-then-exec is how every shell launches every command.",
      ],
      figure: {
        kind: "syscall-path",
        caption: "wrapper → trap → syscall table → handler → return: one round trip into ring 0.",
      },
      bullets: [
        "A syscall is a controlled trap, dispatched via a numbered table.",
        "fork = clone, exec = replace, wait = reap, read/write = byte I/O via fds.",
      ],
    },
    {
      id: "interrupts",
      heading: "3. Interrupts — when hardware taps the CPU on the shoulder",
      body: [
        "Devices are slow and unpredictable, so the CPU never waits for them (that would be polling — burning cycles asking \"done yet?\"). Instead a device raises an IRQ line when it has news. The interrupt controller (APIC) collects IRQs from every device, prioritizes them, and forwards one to the CPU. Between two instructions, the CPU notices the pending interrupt, saves its execution state (rip, rflags, rsp), switches to kernel mode, and uses the interrupt's vector number to index the IDT — the interrupt descriptor table — which points at the right handler.",
        "The handler does the minimum: read the device's data (say, a keyboard scancode into a buffer), acknowledge the interrupt with an EOI so the APIC can deliver the next one, and wake any process that was blocked waiting for this data — moving it from the wait queue to the run queue. Finally iret restores the saved state and the interrupted program resumes, unaware it ever stopped. This is why a blocked read() costs no CPU: the process sleeps until an interrupt says its data arrived.",
      ],
      figure: {
        kind: "interrupt-path",
        caption: "device → IRQ → APIC → CPU saves state → IDT → handler → EOI → wake → iret.",
      },
      bullets: [
        "Interrupts replace polling: the CPU is told, it doesn't ask.",
        "Syscalls are software-initiated traps; interrupts are hardware-initiated. Both land in ring 0 via a table.",
      ],
    },
    {
      id: "mono-vs-micro",
      heading: "4. Monolithic vs. Microkernel — where should services live?",
      body: [
        "Every OS service — file system, network stack, device drivers, scheduler — has to live somewhere. A monolithic kernel (Linux, BSD) puts them all inside ring 0, sharing one address space. Calls between services are plain function calls: one syscall in, then everything is direct and fast. The price is blast radius — a buggy driver in ring 0 can scribble over anything, and the kernel's only safe answer is a full kernel panic.",
        "A microkernel (QNX, MINIX, seL4) keeps only the bare minimum in ring 0 — IPC, scheduling, basic memory — and runs every other service as a user-space server process. Services talk by message passing (IPC) through the kernel, so a file read hops app → kernel → FS server → kernel → driver server and back. Slower (many boundary crossings), but a crashed driver is just a dead user process: the kernel restarts it and the machine survives. That is why cars and medical devices run QNX. Real systems sit on a spectrum — Linux loads drivers as modules, Windows and macOS are hybrids.",
      ],
      figure: {
        kind: "mono-vs-micro",
        caption: "Monolithic: everything in ring 0, fast, fragile. Microkernel: tiny core, IPC, resilient.",
      },
      bullets: [
        "The trade-off in one line: performance (direct calls) vs. fault isolation (IPC walls).",
      ],
    },
  ],
  quickfire: [
    {
      q: "Why can't a user program just call kernel functions directly?",
      a: "The CPU blocks privileged operations in ring 3. The only entries into ring 0 are controlled traps — syscalls and interrupts — that land at kernel-chosen addresses.",
    },
    {
      q: "What does fork() return, and to whom?",
      a: "0 in the child, the child's PID in the parent, -1 on failure. One call, two returns.",
    },
    {
      q: "Interrupt vs. syscall — what's the difference?",
      a: "Both trap into ring 0 via a table (IDT / syscall table). A syscall is requested by software; an interrupt is raised by hardware at an unpredictable time.",
    },
    {
      q: "A driver crashes. What happens on Linux vs. QNX?",
      a: "Linux (monolithic): the driver shares ring 0, so the kernel panics — whole machine down. QNX (microkernel): the driver is a user-space server, so the kernel just restarts it.",
    },
    {
      q: "Why is polling wasteful?",
      a: "The CPU burns cycles repeatedly asking a slow device \"done yet?\". Interrupts invert it: the device signals when ready, and the CPU does useful work meanwhile.",
    },
  ],
};
