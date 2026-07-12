import type { ChapterSummary } from "./types";

export const osBasicsSummary: ChapterSummary = {
  chapterId: "os-basics",
  title: {
    en: "Chapter 1 Recap — OS Basics & Architecture",
    hi: "Chapter 1 Recap — OS Basics & Architecture",
  },
  intro: {
    en: "Before an OS can juggle processes, memory, or files, it has to answer a more basic question: who is allowed to touch the hardware, and how does everyone else ask for it? This chapter built that foundation — the privilege boundary, the three ways execution crosses it (system calls, interrupts), and the two big schools of kernel design. Read this recap end-to-end once; if every paragraph feels obvious, you are ready for Chapter 2.",
    hi: "इससे पहले कि OS processes, memory या files संभाले, उसे एक बुनियादी सवाल का जवाब देना होता है: hardware को छूने की इजाज़त किसे है, और बाकी सब उसके लिए request कैसे करते हैं? इस chapter ने वही नींव रखी — privilege boundary, उसे पार करने के तरीके (system calls, interrupts), और kernel design के दो बड़े स्कूल। इस recap को एक बार पूरा पढ़ लीजिए; अगर हर paragraph obvious लगे तो आप Chapter 2 के लिए तैयार हैं।",
  },
  sections: [
    {
      id: "kernel-vs-user",
      heading: {
        en: "1. Kernel vs. User Space — one machine, two worlds",
        hi: "1. Kernel vs. User Space — एक machine, दो दुनिया",
      },
      body: [
        {
          en: "Every modern CPU runs code at (at least) two privilege levels. In user mode (ring 3), your program can compute, branch, and read/write its own memory — but it cannot talk to the disk, the network card, or another process's memory. In kernel mode (ring 0), the OS has unrestricted access to every instruction and every byte of physical hardware. This split is enforced by the CPU itself, not by convention: a user-mode program that tries a privileged instruction gets a fault, not a favor.",
          hi: "हर modern CPU कम से कम दो privilege levels पर code चलाता है। User mode (ring 3) में आपका program compute कर सकता है, अपनी memory पढ़-लिख सकता है — पर disk, network card या किसी और process की memory को नहीं छू सकता। Kernel mode (ring 0) में OS के पास हर instruction और hardware के हर byte तक unrestricted access है। यह बँटवारा CPU खुद enforce करता है, सिर्फ convention नहीं: user-mode program privileged instruction चलाए तो उसे fault मिलता है।",
        },
        {
          en: "Why bother? Isolation and stability. If your text editor dereferences a wild pointer, only the editor dies — the kernel and every other program keep running. The boundary is the reason a buggy app cannot corrupt the file system, and the reason multi-user systems can exist at all.",
          hi: "क्यों ज़रूरी है? Isolation और stability। अगर आपका text editor कोई गलत pointer छू ले, तो सिर्फ editor मरता है — kernel और बाकी सारे programs चलते रहते हैं। यही boundary वजह है कि एक buggy app file system को corrupt नहीं कर सकती, और multi-user systems मुमकिन हैं।",
        },
      ],
      figure: {
        kind: "rings",
        caption: {
          en: "The privilege boundary: apps in ring 3, the kernel in ring 0, hardware below.",
          hi: "Privilege boundary: apps ring 3 में, kernel ring 0 में, hardware नीचे।",
        },
      },
      bullets: [
        {
          en: "User mode = restricted; kernel mode = unrestricted. The CPU enforces it.",
          hi: "User mode = restricted; kernel mode = unrestricted। CPU इसे enforce करता है।",
        },
        {
          en: "Crossing the boundary is a controlled event (trap), never a free jump.",
          hi: "Boundary पार करना एक controlled event (trap) है, कभी free jump नहीं।",
        },
      ],
    },
    {
      id: "system-calls",
      heading: {
        en: "2. System Calls — the front door into the kernel",
        hi: "2. System Calls — kernel का front door",
      },
      body: [
        {
          en: "A system call is how a user program asks the kernel to do privileged work: open a file, read bytes, create a process. Your code calls a libc wrapper (read(), fork()…), the wrapper puts a syscall number in a register (e.g. rax) and executes the syscall instruction. The CPU flips to kernel mode, jumps to a fixed entry point, and the kernel uses the number to index its syscall table and dispatch to the right handler (sys_read, sys_fork…). The result travels back, the CPU drops to user mode, and your program continues as if it had called an ordinary function — an ordinary function that briefly owned the machine.",
          hi: "System call वह तरीका है जिससे user program kernel से privileged काम करवाता है: file खोलना, bytes पढ़ना, process बनाना। आपका code libc wrapper (read(), fork()…) call करता है, wrapper syscall number एक register (जैसे rax) में रखकर syscall instruction चलाता है। CPU kernel mode में जाता है, fixed entry point पर jump करता है, और kernel उस number से अपनी syscall table में सही handler (sys_read, sys_fork…) ढूँढकर dispatch करता है। नतीजा वापस आता है, CPU user mode में लौटता है, और आपका program ऐसे चलता रहता है जैसे उसने कोई साधारण function call किया हो।",
        },
        {
          en: "The four calls every interview expects: fork() clones the calling process (returning 0 in the child, the child's PID in the parent); exec() replaces the current process image with a new program; wait() blocks until a child exits and reaps it; read()/write() move bytes through file descriptors. fork-then-exec is how every shell launches every command.",
          hi: "Interview में चार calls हमेशा पूछी जाती हैं: fork() calling process की copy बनाता है (child में 0 return, parent में child का PID); exec() मौजूदा process image को नए program से बदल देता है; wait() child के exit होने तक block करके उसे reap करता है; read()/write() file descriptors के ज़रिए bytes ले जाते हैं। fork-फिर-exec ही वह तरीका है जिससे हर shell हर command चलाती है।",
        },
      ],
      figure: {
        kind: "syscall-path",
        caption: {
          en: "wrapper → trap → syscall table → handler → return: one round trip into ring 0.",
          hi: "wrapper → trap → syscall table → handler → return: ring 0 का एक round trip।",
        },
      },
      bullets: [
        {
          en: "A syscall is a controlled trap, dispatched via a numbered table.",
          hi: "Syscall एक controlled trap है, numbered table से dispatch होता है।",
        },
        {
          en: "fork = clone, exec = replace, wait = reap, read/write = byte I/O via fds.",
          hi: "fork = clone, exec = replace, wait = reap, read/write = fds से byte I/O।",
        },
      ],
    },
    {
      id: "interrupts",
      heading: {
        en: "3. Interrupts — when hardware taps the CPU on the shoulder",
        hi: "3. Interrupts — जब hardware CPU का कंधा थपथपाता है",
      },
      body: [
        {
          en: "Devices are slow and unpredictable, so the CPU never waits for them (that would be polling — burning cycles asking \"done yet?\"). Instead a device raises an IRQ line when it has news. The interrupt controller (APIC) collects IRQs from every device, prioritizes them, and forwards one to the CPU. Between two instructions, the CPU notices the pending interrupt, saves its execution state (rip, rflags, rsp), switches to kernel mode, and uses the interrupt's vector number to index the IDT — the interrupt descriptor table — which points at the right handler.",
          hi: "Devices धीमे और unpredictable होते हैं, इसलिए CPU उनका इंतज़ार नहीं करता (वह polling होती — बार-बार पूछते रहना \"हो गया?\")। इसके बजाय device के पास खबर होने पर वह IRQ line raise करता है। Interrupt controller (APIC) हर device की IRQs इकट्ठा करके prioritize करता है और CPU को भेजता है। दो instructions के बीच CPU pending interrupt देखता है, अपनी execution state (rip, rflags, rsp) save करता है, kernel mode में जाता है, और interrupt के vector number से IDT (interrupt descriptor table) में सही handler ढूँढता है।",
        },
        {
          en: "The handler does the minimum: read the device's data (say, a keyboard scancode into a buffer), acknowledge the interrupt with an EOI so the APIC can deliver the next one, and wake any process that was blocked waiting for this data — moving it from the wait queue to the run queue. Finally iret restores the saved state and the interrupted program resumes, unaware it ever stopped. This is why a blocked read() costs no CPU: the process sleeps until an interrupt says its data arrived.",
          hi: "Handler कम-से-कम काम करता है: device का data पढ़ना (जैसे keyboard scancode buffer में), EOI से interrupt acknowledge करना ताकि APIC अगला भेज सके, और इस data के इंतज़ार में blocked process को जगाना — wait queue से run queue में। आख़िर में iret saved state restore करता है और interrupted program वहीं से चलता है, उसे पता भी नहीं चलता कि वह रुका था। इसीलिए blocked read() CPU नहीं खाता: process तब तक सोता है जब तक interrupt न कहे कि data आ गया।",
        },
      ],
      figure: {
        kind: "interrupt-path",
        caption: {
          en: "device → IRQ → APIC → CPU saves state → IDT → handler → EOI → wake → iret.",
          hi: "device → IRQ → APIC → CPU state save → IDT → handler → EOI → wake → iret।",
        },
      },
      bullets: [
        {
          en: "Interrupts replace polling: the CPU is told, it doesn't ask.",
          hi: "Interrupts polling की जगह लेते हैं: CPU को बताया जाता है, वह पूछता नहीं।",
        },
        {
          en: "Syscalls are software-initiated traps; interrupts are hardware-initiated. Both land in ring 0 via a table.",
          hi: "Syscalls software-initiated traps हैं; interrupts hardware-initiated। दोनों table के ज़रिए ring 0 में पहुँचते हैं।",
        },
      ],
    },
    {
      id: "mono-vs-micro",
      heading: {
        en: "4. Monolithic vs. Microkernel — where should services live?",
        hi: "4. Monolithic vs. Microkernel — services कहाँ रहें?",
      },
      body: [
        {
          en: "Every OS service — file system, network stack, device drivers, scheduler — has to live somewhere. A monolithic kernel (Linux, BSD) puts them all inside ring 0, sharing one address space. Calls between services are plain function calls: one syscall in, then everything is direct and fast. The price is blast radius — a buggy driver in ring 0 can scribble over anything, and the kernel's only safe answer is a full kernel panic.",
          hi: "हर OS service — file system, network stack, device drivers, scheduler — को कहीं रहना है। Monolithic kernel (Linux, BSD) सबको ring 0 के अंदर, एक ही address space में रखता है। Services के बीच calls सीधी function calls हैं: एक syscall अंदर, फिर सब direct और fast। क़ीमत है blast radius — ring 0 में buggy driver कुछ भी बिगाड़ सकता है, और kernel का इकलौता safe जवाब है full kernel panic।",
        },
        {
          en: "A microkernel (QNX, MINIX, seL4) keeps only the bare minimum in ring 0 — IPC, scheduling, basic memory — and runs every other service as a user-space server process. Services talk by message passing (IPC) through the kernel, so a file read hops app → kernel → FS server → kernel → driver server and back. Slower (many boundary crossings), but a crashed driver is just a dead user process: the kernel restarts it and the machine survives. That is why cars and medical devices run QNX. Real systems sit on a spectrum — Linux loads drivers as modules, Windows and macOS are hybrids.",
          hi: "Microkernel (QNX, MINIX, seL4) ring 0 में सिर्फ न्यूनतम रखता है — IPC, scheduling, basic memory — और बाकी हर service user-space server process की तरह चलती है। Services kernel के ज़रिए message passing (IPC) से बात करती हैं, तो एक file read app → kernel → FS server → kernel → driver server होकर लौटती है। धीमा (कई boundary crossings), पर crashed driver बस एक मरा हुआ user process है: kernel उसे restart करता है और machine बची रहती है। इसीलिए गाड़ियाँ और medical devices QNX चलाते हैं। असली systems एक spectrum पर हैं — Linux drivers को modules की तरह load करता है, Windows और macOS hybrid हैं।",
        },
      ],
      figure: {
        kind: "mono-vs-micro",
        caption: {
          en: "Monolithic: everything in ring 0, fast, fragile. Microkernel: tiny core, IPC, resilient.",
          hi: "Monolithic: सब ring 0 में, fast, fragile। Microkernel: छोटा core, IPC, resilient।",
        },
      },
      bullets: [
        {
          en: "The trade-off in one line: performance (direct calls) vs. fault isolation (IPC walls).",
          hi: "Trade-off एक line में: performance (direct calls) vs. fault isolation (IPC walls)।",
        },
      ],
    },
  ],
  quickfire: [
    {
      q: {
        en: "Why can't a user program just call kernel functions directly?",
        hi: "User program सीधे kernel functions क्यों नहीं call कर सकता?",
      },
      a: {
        en: "The CPU blocks privileged operations in ring 3. The only entries into ring 0 are controlled traps — syscalls and interrupts — that land at kernel-chosen addresses.",
        hi: "CPU ring 3 में privileged operations रोक देता है। Ring 0 में entry सिर्फ controlled traps से है — syscalls और interrupts — जो kernel के चुने addresses पर ही पहुँचती हैं।",
      },
    },
    {
      q: {
        en: "What does fork() return, and to whom?",
        hi: "fork() क्या return करता है, और किसे?",
      },
      a: {
        en: "0 in the child, the child's PID in the parent, -1 on failure. One call, two returns.",
        hi: "Child में 0, parent में child का PID, failure पर -1। एक call, दो returns।",
      },
    },
    {
      q: {
        en: "Interrupt vs. syscall — what's the difference?",
        hi: "Interrupt vs. syscall — फ़र्क क्या है?",
      },
      a: {
        en: "Both trap into ring 0 via a table (IDT / syscall table). A syscall is requested by software; an interrupt is raised by hardware at an unpredictable time.",
        hi: "दोनों table (IDT / syscall table) के ज़रिए ring 0 में trap करते हैं। Syscall software माँगता है; interrupt hardware unpredictable समय पर raise करता है।",
      },
    },
    {
      q: {
        en: "A driver crashes. What happens on Linux vs. QNX?",
        hi: "Driver crash हो जाए — Linux vs. QNX में क्या होगा?",
      },
      a: {
        en: "Linux (monolithic): the driver shares ring 0, so the kernel panics — whole machine down. QNX (microkernel): the driver is a user-space server, so the kernel just restarts it.",
        hi: "Linux (monolithic): driver ring 0 share करता है, तो kernel panic — पूरी machine down। QNX (microkernel): driver user-space server है, kernel उसे बस restart कर देता है।",
      },
    },
    {
      q: {
        en: "Why is polling wasteful?",
        hi: "Polling wasteful क्यों है?",
      },
      a: {
        en: "The CPU burns cycles repeatedly asking a slow device \"done yet?\". Interrupts invert it: the device signals when ready, and the CPU does useful work meanwhile.",
        hi: "CPU बार-बार धीमे device से \"हो गया?\" पूछकर cycles जलाता है। Interrupts इसे उलट देते हैं: device तैयार होने पर signal देता है, CPU तब तक useful काम करता है।",
      },
    },
  ],
};
