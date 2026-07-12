import type { Language } from "../types";

export interface GlossaryTerm {
  id: string;
  /** Short label as it appears in diagrams/notes, e.g. "IRQ". */
  term: string;
  /** Expanded name, e.g. "Interrupt Request". */
  full: string;
  /** Plain-English (and Hindi) definition a first-time learner can follow. */
  definition: Record<Language, string>;
}

export const glossary: Record<string, GlossaryTerm> = {
  "kernel-mode": {
    id: "kernel-mode",
    term: "kernel mode",
    full: "Kernel mode (ring 0)",
    definition: {
      en: "The CPU's privileged mode where the operating system runs. Code here can touch any memory and any device. Also called ring 0.",
      hi: "CPU का privileged mode जिसमें operating system चलता है। यहाँ का code किसी भी memory और device को छू सकता है। इसे ring 0 भी कहते हैं।",
    },
  },
  "user-mode": {
    id: "user-mode",
    term: "user mode",
    full: "User mode (ring 3)",
    definition: {
      en: "The restricted mode where your applications run. They cannot touch hardware directly — they must ask the kernel. Also called ring 3.",
      hi: "वह restricted mode जिसमें आपकी applications चलती हैं। वे hardware को सीधे नहीं छू सकतीं — kernel से माँगना पड़ता है। इसे ring 3 भी कहते हैं।",
    },
  },
  syscall: {
    id: "syscall",
    term: "syscall",
    full: "System call",
    definition: {
      en: "A numbered request from a program to the kernel — 'please do this for me' (read a file, create a process). The only legal door from user mode into kernel mode.",
      hi: "Program की kernel से एक numbered request — 'मेरे लिए यह करो' (file पढ़ो, process बनाओ)। User mode से kernel mode में जाने का इकलौता legal दरवाज़ा।",
    },
  },
  libc: {
    id: "libc",
    term: "libc",
    full: "C standard library",
    definition: {
      en: "The library every C program links against. Functions like write() and read() are thin libc wrappers that set up and execute the real syscall instruction for you.",
      hi: "वह library जिससे हर C program जुड़ता है। write() और read() जैसे functions पतले libc wrappers हैं जो असली syscall instruction आपके लिए चलाते हैं।",
    },
  },
  trap: {
    id: "trap",
    term: "trap",
    full: "Trap (mode switch)",
    definition: {
      en: "A controlled jump from user mode into the kernel. The CPU switches privilege level and lands only at a kernel-chosen entry point — never at an arbitrary address.",
      hi: "User mode से kernel में एक controlled jump। CPU privilege level बदलता है और सिर्फ kernel के चुने entry point पर ही पहुँचता है — कभी मनमाने address पर नहीं।",
    },
  },
  "syscall-table": {
    id: "syscall-table",
    term: "syscall table",
    full: "System call table",
    definition: {
      en: "An array of function pointers inside the kernel. The syscall number (e.g. 1 = write) is an index into this table; the kernel calls whatever handler lives at that slot.",
      hi: "Kernel के अंदर function pointers का एक array। Syscall number (जैसे 1 = write) इस table में index है; kernel उसी slot का handler चलाता है।",
    },
  },
  fork: {
    id: "fork",
    term: "fork()",
    full: "fork — clone the current process",
    definition: {
      en: "A syscall that duplicates the running process. The clone (child) gets return value 0; the parent gets the child's process ID. Both continue from the same line of code.",
      hi: "एक syscall जो चालू process की copy बनाता है। Copy (child) को return value 0 मिलती है; parent को child की process ID। दोनों उसी line से आगे चलते हैं।",
    },
  },
  exec: {
    id: "exec",
    term: "exec()",
    full: "exec — replace the program image",
    definition: {
      en: "A syscall family that throws away the current program's code and memory and loads a new program into the same process. fork() + exec() is how shells launch commands.",
      hi: "Syscall परिवार जो मौजूदा program का code और memory हटाकर उसी process में नया program load करता है। fork() + exec() से ही shell commands चलाती है।",
    },
  },
  fd: {
    id: "fd",
    term: "fd",
    full: "File descriptor",
    definition: {
      en: "A small integer the kernel hands your program as a ticket to an open file (or device, or socket). You pass it back on every read()/write() so the kernel knows which file you mean.",
      hi: "एक छोटा integer जो kernel आपके program को खुली file (या device, या socket) के ticket की तरह देता है। हर read()/write() पर आप इसे लौटाते हैं ताकि kernel समझे कौन-सी file।",
    },
  },
  pid: {
    id: "pid",
    term: "pid",
    full: "Process ID",
    definition: {
      en: "The unique number the kernel assigns to every process. fork() returns the child's pid to the parent so it can track and wait for it.",
      hi: "हर process को kernel का दिया unique number। fork() parent को child का pid लौटाता है ताकि वह उसे track और wait कर सके।",
    },
  },
  polling: {
    id: "polling",
    term: "polling",
    full: "Polling",
    definition: {
      en: "Repeatedly asking a device 'anything yet? anything yet?' millions of times a second. Simple but wasteful — the CPU burns cycles doing nothing. Interrupts exist to avoid this.",
      hi: "Device से बार-बार पूछना 'कुछ हुआ? कुछ हुआ?' — लाखों बार प्रति second। आसान पर बेकार — CPU खाली जलता है। इसी से बचने के लिए interrupts हैं।",
    },
  },
  irq: {
    id: "irq",
    term: "IRQ",
    full: "Interrupt Request",
    definition: {
      en: "A physical signal line a device uses to say 'I need attention now'. Each device gets a number — the keyboard is classically IRQ 1.",
      hi: "एक physical signal line जिससे device कहता है 'मुझे अभी ध्यान चाहिए'। हर device का एक number है — keyboard classically IRQ 1 है।",
    },
  },
  apic: {
    id: "apic",
    term: "APIC",
    full: "Advanced Programmable Interrupt Controller",
    definition: {
      en: "A chip that sits between devices and the CPU. It collects IRQ lines from every device, decides which is most urgent, and delivers one signal to the CPU with a vector number attached.",
      hi: "एक chip जो devices और CPU के बीच बैठती है। हर device की IRQ lines इकट्ठा करती है, तय करती है कौन ज़रूरी है, और CPU को vector number के साथ एक signal भेजती है।",
    },
  },
  vector: {
    id: "vector",
    term: "vector",
    full: "Interrupt vector number",
    definition: {
      en: "A small number identifying which interrupt happened — the keyboard's is 0x21. The CPU uses it as an index into the IDT to find the right handler.",
      hi: "एक छोटा number जो बताता है कौन-सा interrupt हुआ — keyboard का 0x21 है। CPU इसे IDT में index की तरह use करके सही handler ढूँढता है।",
    },
  },
  idt: {
    id: "idt",
    term: "IDT",
    full: "Interrupt Descriptor Table",
    definition: {
      en: "A kernel table mapping every vector number to a handler function — like a phone directory for interrupts. Same idea as the syscall table, but for hardware events.",
      hi: "Kernel की table जो हर vector number को एक handler function से जोड़ती है — interrupts की phone directory जैसी। वही idea जो syscall table का है, पर hardware events के लिए।",
    },
  },
  handler: {
    id: "handler",
    term: "handler",
    full: "Interrupt handler (ISR)",
    definition: {
      en: "The kernel function that runs in response to an interrupt. keyboard_irq() means 'the handler for the keyboard's interrupt'. It must finish fast — others may be waiting.",
      hi: "Kernel का function जो interrupt आने पर चलता है। keyboard_irq() मतलब 'keyboard के interrupt का handler'। इसे जल्दी खत्म होना चाहिए — बाकी इंतज़ार में हो सकते हैं।",
    },
  },
  scancode: {
    id: "scancode",
    term: "scancode",
    full: "Keyboard scancode",
    definition: {
      en: "The raw byte a keyboard sends identifying which physical key was pressed (0x1E = the 'A' key). The kernel later translates it into a character.",
      hi: "Keyboard का भेजा raw byte जो बताता है कौन-सी physical key दबी (0x1E = 'A' key)। Kernel बाद में इसे character में बदलता है।",
    },
  },
  eoi: {
    id: "eoi",
    term: "EOI",
    full: "End Of Interrupt",
    definition: {
      en: "The 'done, thanks' message the handler sends back to the APIC. Until it arrives, the controller holds back further interrupts of that kind.",
      hi: "Handler का APIC को भेजा 'हो गया, धन्यवाद' message। जब तक यह नहीं पहुँचता, controller उस तरह के और interrupts रोके रखता है।",
    },
  },
  "top-bottom-half": {
    id: "top-bottom-half",
    term: "top / bottom half",
    full: "Top half & bottom half",
    definition: {
      en: "How the kernel splits interrupt work: the top half runs immediately and does the bare minimum (grab data, send EOI); slower follow-up work is deferred to a bottom half that runs later.",
      hi: "Kernel interrupt के काम को ऐसे बाँटता है: top half तुरंत चलकर कम-से-कम काम करता है (data लो, EOI भेजो); धीमा काम bottom half के लिए टाल दिया जाता है जो बाद में चलता है।",
    },
  },
  "wait-queue": {
    id: "wait-queue",
    term: "wait queue",
    full: "Wait queue (blocked processes)",
    definition: {
      en: "Where the kernel parks processes that are waiting for something (like a keypress). A blocked process uses zero CPU until an event wakes it up.",
      hi: "जहाँ kernel उन processes को रखता है जो किसी चीज़ (जैसे keypress) का इंतज़ार कर रही हैं। Blocked process तब तक zero CPU लेती है जब तक कोई event उसे जगा न दे।",
    },
  },
  "run-queue": {
    id: "run-queue",
    term: "run queue",
    full: "Run queue (ready processes)",
    definition: {
      en: "The line of processes that are ready to run and waiting for their turn on the CPU. The scheduler picks the next one from here.",
      hi: "उन processes की कतार जो चलने को तैयार हैं और CPU पर अपनी बारी का इंतज़ार कर रही हैं। Scheduler अगली process यहीं से चुनता है।",
    },
  },
  registers: {
    id: "registers",
    term: "rip · rflags · rsp",
    full: "Instruction pointer, flags, stack pointer",
    definition: {
      en: "Three CPU registers that capture 'where was I?': rip = which instruction is next, rflags = status flags of the computation, rsp = top of the stack. Save these three and you can resume exactly where you stopped.",
      hi: "तीन CPU registers जो 'मैं कहाँ था?' capture करते हैं: rip = अगली instruction कौन-सी, rflags = computation के status flags, rsp = stack का top। ये तीनों save कर लो तो ठीक वहीं से resume कर सकते हो।",
    },
  },
  iret: {
    id: "iret",
    term: "iret",
    full: "Interrupt return instruction",
    definition: {
      en: "The CPU instruction that ends a handler: it restores the saved rip, rflags and rsp, drops back to user mode, and the interrupted program continues as if nothing happened.",
      hi: "वह CPU instruction जो handler खत्म करती है: saved rip, rflags और rsp restore करती है, वापस user mode में जाती है, और interrupted program ऐसे चलता है जैसे कुछ हुआ ही नहीं।",
    },
  },
  stdin: {
    id: "stdin",
    term: "stdin / stdout",
    full: "Standard input & output",
    definition: {
      en: "Every process starts with three open 'files': stdin (fd 0, usually the keyboard), stdout (fd 1, usually the screen), stderr (fd 2). read(0, …) reads the keyboard; write(1, …) prints to the screen.",
      hi: "हर process तीन खुली 'files' के साथ शुरू होती है: stdin (fd 0, आमतौर पर keyboard), stdout (fd 1, आमतौर पर screen), stderr (fd 2)। read(0, …) keyboard पढ़ता है; write(1, …) screen पर छापता है।",
    },
  },
};
