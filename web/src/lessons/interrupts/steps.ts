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

export const steps: InterruptsStep[] = [
  {
    id: "intro",
    codeLines: [],
    scene: "idle",
    narration: {
      id: "intro",
      text: {
        en: "How does the CPU know a key was pressed? It could poll — ask the keyboard millions of times a second — but that burns the CPU doing nothing. Instead, hardware interrupts the CPU: the device taps it on the shoulder only when something actually happens.",
        hi: "CPU को कैसे पता चलता है कि key दबी? वह poll कर सकता है — keyboard से लाखों बार पूछे — पर उसमें CPU बेकार जलता है। इसके बजाय hardware CPU को interrupt करता है: device तभी कंधे पर हाथ रखता है जब सच में कुछ हुआ हो।",
      },
    },
    note: "Interrupts replace polling: devices signal the CPU only when something happens.",
  },
  {
    id: "blocked",
    codeLines: [7],
    scene: "blocked",
    narration: {
      id: "blocked",
      text: {
        en: "Our program calls read() on stdin, but no key has been pressed. The kernel has no data to give, so it marks the process blocked, parks it on a wait queue, and schedules something else. The CPU is not wasted spinning — it moves on.",
        hi: "हमारा program stdin पर read() करता है, पर कोई key नहीं दबी। Kernel के पास देने को data नहीं है, इसलिए वह process को blocked mark करके wait queue में रख देता है और कुछ और schedule करता है। CPU खाली नहीं घूमता — आगे बढ़ जाता है।",
      },
    },
    note: "No data → the process blocks on a wait queue; the CPU runs something else.",
  },
  {
    id: "irq",
    codeLines: [7],
    scene: "irq",
    narration: {
      id: "irq",
      text: {
        en: "Now you press a key. The keyboard latches the scancode and raises its interrupt request line — IRQ 1. The interrupt controller (APIC) collects such lines from every device, prioritizes them, and delivers one signal to the CPU with a vector number attached.",
        hi: "अब आप key दबाते हैं। Keyboard scancode को latch करके अपनी interrupt request line — IRQ 1 — उठाता है। Interrupt controller (APIC) हर device की ऐसी lines इकट्ठा करता है, priority तय करता है, और CPU को एक signal — vector number के साथ — भेजता है।",
      },
    },
    note: "Device raises an IRQ line; the APIC prioritizes and forwards it with a vector number.",
  },
  {
    id: "save",
    codeLines: [7],
    scene: "save",
    narration: {
      id: "save",
      text: {
        en: "The CPU checks for pending interrupts between instructions. Seeing one, it finishes the current instruction, then automatically saves where it was — the instruction pointer, flags, and stack pointer — so it can come back later as if nothing happened.",
        hi: "CPU हर instruction के बीच pending interrupts देखता है। एक मिलते ही वह चालू instruction पूरा करता है, फिर अपनी जगह — instruction pointer, flags, stack pointer — अपने आप save कर लेता है, ताकि बाद में ऐसे लौट सके जैसे कुछ हुआ ही नहीं।",
      },
    },
    note: "Between instructions the CPU saves rip/rflags/rsp automatically before handling the IRQ.",
  },
  {
    id: "vector",
    codeLines: [7],
    scene: "vector",
    narration: {
      id: "vector",
      text: {
        en: "Just like syscalls use a syscall table, interrupts use the Interrupt Descriptor Table. The vector number — 0x21 for the keyboard — is an index into the IDT, and each entry points at a kernel handler. Hardware picks the entry; software never jumps to an arbitrary address.",
        hi: "जैसे syscalls syscall table use करते हैं, वैसे interrupts Interrupt Descriptor Table use करते हैं। Vector number — keyboard के लिए 0x21 — IDT में index है, और हर entry एक kernel handler की ओर इशारा करती है। Entry hardware चुनता है; software कभी मनमाने address पर jump नहीं करता।",
      },
    },
    note: "IDT[vector] → handler. 0x21 = keyboard. Same table idea as syscalls.",
  },
  {
    id: "handler",
    codeLines: [7],
    scene: "handler",
    narration: {
      id: "handler",
      text: {
        en: "The handler runs in kernel mode and must be fast — other interrupts may be waiting. This 'top half' just reads the scancode from the device, stores it in a buffer, and acknowledges the controller (EOI). Slow work is deferred to a 'bottom half' that runs later.",
        hi: "Handler kernel mode में चलता है और तेज़ होना चाहिए — बाकी interrupts इंतज़ार में हो सकते हैं। यह 'top half' बस device से scancode पढ़ता है, buffer में रखता है, और controller को acknowledge (EOI) करता है। धीमा काम 'bottom half' के लिए टाल दिया जाता है।",
      },
    },
    note: "Top half: read scancode → buffer → EOI. Keep it short; defer slow work.",
  },
  {
    id: "wake",
    codeLines: [7],
    scene: "wake",
    narration: {
      id: "wake",
      text: {
        en: "There is now data in the input buffer — exactly what our blocked process was waiting for. The handler wakes the wait queue: our process flips from blocked to ready, back in line for the CPU. This is how a keypress 'unblocks' a read().",
        hi: "अब input buffer में data है — ठीक वही जिसका हमारा blocked process इंतज़ार कर रहा था। Handler wait queue को जगाता है: हमारा process blocked से ready हो जाता है, CPU की कतार में वापस। ऐसे ही एक keypress read() को 'unblock' करता है।",
      },
    },
    note: "Handler wakes the wait queue: blocked → ready. The keypress unblocks read().",
  },
  {
    id: "resume",
    codeLines: [9],
    scene: "resume",
    narration: {
      id: "resume",
      text: {
        en: "The handler ends with iret: the CPU restores the saved rip, flags, and stack, and resumes exactly where it left off. Soon the scheduler runs our process again — read() returns with the character, and write() prints it. The program never knew it was interrupted.",
        hi: "Handler iret से खत्म होता है: CPU saved rip, flags और stack restore करके ठीक वहीं से चलता है जहाँ रुका था। जल्द ही scheduler हमारा process फिर चलाता है — read() character के साथ return करता है, और write() उसे print करता है। Program को पता ही नहीं चला कि वह interrupt हुआ था।",
      },
    },
    note: "iret restores saved state; read() returns with the key as if nothing happened.",
  },
  {
    id: "summary",
    codeLines: [9, 10],
    scene: "done",
    narration: {
      id: "summary",
      text: {
        en: "The full path: device raises IRQ → APIC prioritizes → CPU saves state → IDT[vector] → short handler → EOI → wake waiters → iret resumes. Syscalls and interrupts are twins: one is software asking the kernel, the other is hardware demanding it.",
        hi: "पूरा रास्ता: device IRQ उठाता है → APIC priority देता है → CPU state save करता है → IDT[vector] → छोटा handler → EOI → waiters जागते हैं → iret से वापसी। Syscalls और interrupts जुड़वाँ हैं: एक software का kernel से पूछना है, दूसरा hardware का माँगना।",
      },
    },
    note: "IRQ → APIC → save state → IDT → handler → EOI → wake → iret.",
  },
];
