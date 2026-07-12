import type { LessonStep } from "../../types";

export type SceneState =
  | "intro"
  | "mono-layout"
  | "mono-call"
  | "mono-crash"
  | "micro-layout"
  | "micro-ipc"
  | "micro-crash"
  | "spectrum"
  | "done";

export interface MonoMicroStep extends LessonStep {
  scene: SceneState;
}

/** Terms surfaced in this lesson's jargon decoder, in teaching order. */
export const glossaryIds = [
  "monolithic",
  "microkernel",
  "kernel-mode",
  "user-mode",
  "driver",
  "syscall",
  "kernel-panic",
  "server",
  "ipc",
  "module",
  "hybrid",
];

/** Scorecard rows that fill in as the lesson progresses. */
export interface ScoreRow {
  label: string;
  mono: string;
  micro: string;
  /** Scene from which this row becomes visible. */
  revealAt: SceneState;
}

export const scoreRows: ScoreRow[] = [
  { label: "kernel size", mono: "everything inside", micro: "bare minimum", revealAt: "micro-layout" },
  { label: "service calls", mono: "direct function call", micro: "IPC messages", revealAt: "micro-ipc" },
  { label: "speed", mono: "fast — one trap", micro: "slower — many crossings", revealAt: "micro-ipc" },
  { label: "driver crash", mono: "kernel panic", micro: "restart the server", revealAt: "micro-crash" },
  { label: "isolation", mono: "one address space", micro: "walls everywhere", revealAt: "micro-crash" },
  { label: "examples", mono: "Linux, BSD", micro: "QNX, MINIX, seL4", revealAt: "spectrum" },
];

export const steps: MonoMicroStep[] = [
  {
    id: "intro",
    codeLines: [],
    scene: "intro",
    terms: ["monolithic", "microkernel"],
    narration: {
      id: "intro",
      text: {
        en: "Every OS must answer one architectural question: where do its services live? File systems, drivers, the network stack — put them all inside the kernel, or push them out? That single choice splits the OS world into monolithic and microkernel designs.",
        hi: "हर OS को एक architectural सवाल का जवाब देना है: उसकी services कहाँ रहें? File systems, drivers, network stack — सब kernel के अंदर रखें, या बाहर धकेलें? यही एक फैसला OS की दुनिया को monolithic और microkernel में बाँटता है।",
      },
    },
    note: "One design question: do OS services live inside the kernel, or outside it?",
  },
  {
    id: "mono-layout",
    codeLines: [],
    scene: "mono-layout",
    terms: ["monolithic", "kernel-mode", "driver"],
    narration: {
      id: "mono-layout",
      text: {
        en: "The monolithic answer: everything inside. Look at the memory map — the kernel region holds the scheduler, memory manager, file system, network stack and every driver, all in one address space, all running in ring 0. One big program with full hardware power.",
        hi: "Monolithic जवाब: सब अंदर। Memory map देखिए — kernel region में scheduler, memory manager, file system, network stack और हर driver, सब एक address space में, सब ring 0 में। पूरी hardware ताकत वाला एक बड़ा program।",
      },
    },
    note: "Monolithic: all services share one kernel address space in ring 0.",
  },
  {
    id: "mono-call",
    codeLines: [],
    scene: "mono-call",
    terms: ["syscall", "monolithic"],
    narration: {
      id: "mono-call",
      text: {
        en: "Watch a file read: the app makes one syscall, and inside the kernel the file system simply calls the disk driver — an ordinary function call, nanoseconds, no boundary to cross. This is why monolithic kernels are fast: one trap in, one trap out.",
        hi: "एक file read देखिए: app एक syscall करती है, और kernel के अंदर file system सीधे disk driver को call करता है — आम function call, nanoseconds, कोई boundary नहीं। इसीलिए monolithic kernels तेज़ हैं: एक trap अंदर, एक बाहर।",
      },
    },
    note: "Monolithic fast path: 1 syscall, then plain function calls between services.",
  },
  {
    id: "mono-crash",
    codeLines: [],
    scene: "mono-crash",
    terms: ["kernel-panic", "driver"],
    narration: {
      id: "mono-crash",
      text: {
        en: "Now the price. A buggy driver dereferences a bad pointer — but it lives inside the kernel, sharing memory with everything else. There is no wall to contain it and no one above to catch it. The whole kernel panics, and the machine goes down with it.",
        hi: "अब कीमत। एक buggy driver गलत pointer छूता है — पर वह kernel के अंदर रहता है, सबके साथ memory बाँटते हुए। रोकने वाली कोई दीवार नहीं, पकड़ने वाला कोई ऊपर नहीं। पूरा kernel panic करता है, और machine उसके साथ गिरती है।",
      },
    },
    note: "Monolithic price: one buggy driver in ring 0 → whole-machine kernel panic.",
  },
  {
    id: "micro-layout",
    codeLines: [],
    scene: "micro-layout",
    terms: ["microkernel", "server", "user-mode"],
    narration: {
      id: "micro-layout",
      text: {
        en: "The microkernel answer: almost nothing inside. The kernel shrinks to IPC, scheduling and basic memory. The file system, drivers and network stack move out to user space as separate server processes — each in its own address space, behind its own wall.",
        hi: "Microkernel जवाब: अंदर लगभग कुछ नहीं। Kernel सिकुड़कर IPC, scheduling और basic memory रह जाता है। File system, drivers, network stack बाहर user space में अलग server processes बन जाते हैं — हर एक अपने address space में, अपनी दीवार के पीछे।",
      },
    },
    note: "Microkernel: tiny ring-0 core; services become user-space servers.",
  },
  {
    id: "micro-ipc",
    codeLines: [],
    scene: "micro-ipc",
    terms: ["ipc", "server", "syscall"],
    narration: {
      id: "micro-ipc",
      text: {
        en: "The same file read now travels by post. The app sends a message; the kernel delivers it to the file-system server, which messages the disk-driver server, and the reply hops all the way back. Every hop crosses the kernel — safer, but each crossing costs time.",
        hi: "वही file read अब डाक से जाती है। App message भेजती है; kernel उसे file-system server तक पहुँचाता है, वह disk-driver server को message करता है, और जवाब उसी रास्ते लौटता है। हर hop kernel से गुज़रता है — सुरक्षित, पर हर crossing की कीमत है।",
      },
    },
    note: "Microkernel path: app → FS server → driver server via IPC. More crossings, more cost.",
  },
  {
    id: "micro-crash",
    codeLines: [],
    scene: "micro-crash",
    terms: ["server", "kernel-panic"],
    narration: {
      id: "micro-crash",
      text: {
        en: "Same buggy driver, different outcome. It crashes — but it is just a user-mode process now. The kernel is untouched, the file system keeps running, and the OS simply restarts the driver server. This is why cars and medical devices run QNX.",
        hi: "वही buggy driver, नतीजा अलग। वह crash होता है — पर अब वह बस एक user-mode process है। Kernel अछूता है, file system चलता रहता है, और OS driver server को बस restart कर देता है। इसीलिए गाड़ियाँ और medical devices QNX चलाते हैं।",
      },
    },
    note: "Microkernel payoff: a crashed driver server is restarted; the kernel survives.",
  },
  {
    id: "spectrum",
    codeLines: [],
    scene: "spectrum",
    terms: ["module", "hybrid"],
    narration: {
      id: "spectrum",
      text: {
        en: "Reality is a spectrum. Linux stays monolithic but borrows flexibility with loadable modules — code you can plug in at runtime, though it still runs in ring 0. Windows and macOS are hybrids: microkernel skeletons with most services pulled back inside for speed.",
        hi: "असलियत एक spectrum है। Linux monolithic रहकर loadable modules से लचीलापन उधार लेता है — runtime पर जुड़ने वाला code, जो फिर भी ring 0 में चलता है। Windows और macOS hybrid हैं: ढाँचा microkernel का, पर speed के लिए ज़्यादातर services वापस अंदर।",
      },
    },
    note: "Real OSes blend both: Linux + modules; Windows/macOS are hybrids.",
  },
  {
    id: "summary",
    codeLines: [],
    scene: "done",
    terms: ["monolithic", "microkernel", "ipc", "kernel-panic"],
    narration: {
      id: "summary",
      text: {
        en: "The trade in one line: monolithic buys speed by sharing one address space and pays with blast radius; microkernel buys isolation with walls and messages and pays with IPC overhead. Interview answer: it is a trade-off between performance and fault isolation.",
        hi: "सौदा एक line में: monolithic एक address space बाँटकर speed खरीदता है और blast radius चुकाता है; microkernel दीवारों और messages से isolation खरीदता है और IPC overhead चुकाता है। Interview जवाब: यह performance बनाम fault isolation का trade-off है।",
      },
    },
    note: "Trade-off: speed (monolithic) vs. fault isolation (microkernel).",
  },
];
