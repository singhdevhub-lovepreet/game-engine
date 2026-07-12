import type { LessonStep } from "../../types";

export const cCode = `#include <unistd.h>

int main(void) {
    char c;

    /* blocks until a key arrives */
    read(0, &c, 1);

    write(1, &c, 1);
    return 0;
}`;

export type SceneState =
  | "idle"
  | "blocked"
  | "irq"
  | "save"
  | "vector"
  | "handler"
  | "wake"
  | "resume"
  | "done";

export interface InterruptsStep extends LessonStep {
  scene: SceneState;
}

/** Terms surfaced in this lesson's jargon decoder, in teaching order. */
export const glossaryIds = [
  "polling",
  "stdin",
  "wait-queue",
  "irq",
  "scancode",
  "apic",
  "vector",
  "registers",
  "idt",
  "handler",
  "eoi",
  "top-bottom-half",
  "run-queue",
  "iret",
];

export const steps: InterruptsStep[] = [
  {
    id: "intro",
    codeLines: [],
    scene: "idle",
    terms: ["polling", "irq"],
    narration: {
      id: "intro",
      text: "How does the CPU know a key was pressed? It could poll — ask the keyboard millions of times a second — but that burns the CPU doing nothing. Instead, hardware interrupts the CPU: the device taps it on the shoulder only when something actually happens.",
    },
    note: "Interrupts replace polling: devices signal the CPU only when something happens.",
  },
  {
    id: "blocked",
    codeLines: [7],
    scene: "blocked",
    terms: ["stdin", "wait-queue"],
    narration: {
      id: "blocked",
      text: "Our program calls read() on stdin, but no key has been pressed. The kernel has no data to give, so it marks the process blocked, parks it on a wait queue, and schedules something else. The CPU is not wasted spinning — it moves on.",
    },
    note: "No data → the process blocks on a wait queue; the CPU runs something else.",
  },
  {
    id: "irq",
    codeLines: [7],
    scene: "irq",
    terms: ["irq", "scancode", "apic", "vector"],
    narration: {
      id: "irq",
      text: "Now you press a key. The keyboard latches the scancode and raises its interrupt request line — IRQ 1. The interrupt controller (APIC) collects such lines from every device, prioritizes them, and delivers one signal to the CPU with a vector number attached.",
    },
    note: "Device raises an IRQ line; the APIC prioritizes and forwards it with a vector number.",
  },
  {
    id: "save",
    codeLines: [7],
    scene: "save",
    terms: ["registers"],
    narration: {
      id: "save",
      text: "The CPU checks for pending interrupts between instructions. Seeing one, it finishes the current instruction, then automatically saves where it was — the instruction pointer, flags, and stack pointer — so it can come back later as if nothing happened.",
    },
    note: "Between instructions the CPU saves rip/rflags/rsp automatically before handling the IRQ.",
  },
  {
    id: "vector",
    codeLines: [7],
    scene: "vector",
    terms: ["vector", "idt", "handler"],
    narration: {
      id: "vector",
      text: "Just like syscalls use a syscall table, interrupts use the Interrupt Descriptor Table. The vector number — 0x21 for the keyboard — is an index into the IDT, and each entry points at a kernel handler. Hardware picks the entry; software never jumps to an arbitrary address.",
    },
    note: "IDT[vector] → handler. 0x21 = keyboard. Same table idea as syscalls.",
  },
  {
    id: "handler",
    codeLines: [7],
    scene: "handler",
    terms: ["handler", "scancode", "eoi", "top-bottom-half"],
    narration: {
      id: "handler",
      text: "The handler runs in kernel mode and must be fast — other interrupts may be waiting. This 'top half' just reads the scancode from the device, stores it in a buffer, and acknowledges the controller (EOI). Slow work is deferred to a 'bottom half' that runs later.",
    },
    note: "Top half: read scancode → buffer → EOI. Keep it short; defer slow work.",
  },
  {
    id: "wake",
    codeLines: [7],
    scene: "wake",
    terms: ["wait-queue", "run-queue"],
    narration: {
      id: "wake",
      text: "There is now data in the input buffer — exactly what our blocked process was waiting for. The handler wakes the wait queue: our process flips from blocked to ready, back in line for the CPU. This is how a keypress 'unblocks' a read().",
    },
    note: "Handler wakes the wait queue: blocked → ready. The keypress unblocks read().",
  },
  {
    id: "resume",
    codeLines: [9],
    scene: "resume",
    terms: ["iret", "registers"],
    narration: {
      id: "resume",
      text: "The handler ends with iret: the CPU restores the saved rip, flags, and stack, and resumes exactly where it left off. Soon the scheduler runs our process again — read() returns with the character, and write() prints it. The program never knew it was interrupted.",
    },
    note: "iret restores saved state; read() returns with the key as if nothing happened.",
  },
  {
    id: "summary",
    codeLines: [9, 10],
    scene: "done",
    terms: ["irq", "apic", "idt", "eoi", "iret"],
    narration: {
      id: "summary",
      text: "The full path: device raises IRQ → APIC prioritizes → CPU saves state → IDT[vector] → short handler → EOI → wake waiters → iret resumes. Syscalls and interrupts are twins: one is software asking the kernel, the other is hardware demanding it.",
    },
    note: "IRQ → APIC → save state → IDT → handler → EOI → wake → iret.",
  },
];
