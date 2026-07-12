export interface GlossaryTerm {
  id: string;
  /** Short label as it appears in diagrams/notes, e.g. "IRQ". */
  term: string;
  /** Expanded name, e.g. "Interrupt Request". */
  full: string;
  /** Plain-English definition a first-time learner can follow. */
  definition: string;
}

export const glossary: Record<string, GlossaryTerm> = {
  "kernel-mode": {
    id: "kernel-mode",
    term: "kernel mode",
    full: "Kernel mode (ring 0)",
    definition: "The CPU's privileged mode where the operating system runs. Code here can touch any memory and any device. Also called ring 0.",
  },
  "user-mode": {
    id: "user-mode",
    term: "user mode",
    full: "User mode (ring 3)",
    definition: "The restricted mode where your applications run. They cannot touch hardware directly — they must ask the kernel. Also called ring 3.",
  },
  syscall: {
    id: "syscall",
    term: "syscall",
    full: "System call",
    definition: "A numbered request from a program to the kernel — 'please do this for me' (read a file, create a process). The only legal door from user mode into kernel mode.",
  },
  libc: {
    id: "libc",
    term: "libc",
    full: "C standard library",
    definition: "The library every C program links against. Functions like write() and read() are thin libc wrappers that set up and execute the real syscall instruction for you.",
  },
  trap: {
    id: "trap",
    term: "trap",
    full: "Trap (mode switch)",
    definition: "A controlled jump from user mode into the kernel. The CPU switches privilege level and lands only at a kernel-chosen entry point — never at an arbitrary address.",
  },
  "syscall-table": {
    id: "syscall-table",
    term: "syscall table",
    full: "System call table",
    definition: "An array of function pointers inside the kernel. The syscall number (e.g. 1 = write) is an index into this table; the kernel calls whatever handler lives at that slot.",
  },
  fork: {
    id: "fork",
    term: "fork()",
    full: "fork — clone the current process",
    definition: "A syscall that duplicates the running process. The clone (child) gets return value 0; the parent gets the child's process ID. Both continue from the same line of code.",
  },
  exec: {
    id: "exec",
    term: "exec()",
    full: "exec — replace the program image",
    definition: "A syscall family that throws away the current program's code and memory and loads a new program into the same process. fork() + exec() is how shells launch commands.",
  },
  fd: {
    id: "fd",
    term: "fd",
    full: "File descriptor",
    definition: "A small integer the kernel hands your program as a ticket to an open file (or device, or socket). You pass it back on every read()/write() so the kernel knows which file you mean.",
  },
  pid: {
    id: "pid",
    term: "pid",
    full: "Process ID",
    definition: "The unique number the kernel assigns to every process. fork() returns the child's pid to the parent so it can track and wait for it.",
  },
  polling: {
    id: "polling",
    term: "polling",
    full: "Polling",
    definition: "Repeatedly asking a device 'anything yet? anything yet?' millions of times a second. Simple but wasteful — the CPU burns cycles doing nothing. Interrupts exist to avoid this.",
  },
  irq: {
    id: "irq",
    term: "IRQ",
    full: "Interrupt Request",
    definition: "A physical signal line a device uses to say 'I need attention now'. Each device gets a number — the keyboard is classically IRQ 1.",
  },
  apic: {
    id: "apic",
    term: "APIC",
    full: "Advanced Programmable Interrupt Controller",
    definition: "A chip that sits between devices and the CPU. It collects IRQ lines from every device, decides which is most urgent, and delivers one signal to the CPU with a vector number attached.",
  },
  vector: {
    id: "vector",
    term: "vector",
    full: "Interrupt vector number",
    definition: "A small number identifying which interrupt happened — the keyboard's is 0x21. The CPU uses it as an index into the IDT to find the right handler.",
  },
  idt: {
    id: "idt",
    term: "IDT",
    full: "Interrupt Descriptor Table",
    definition: "A kernel table mapping every vector number to a handler function — like a phone directory for interrupts. Same idea as the syscall table, but for hardware events.",
  },
  handler: {
    id: "handler",
    term: "handler",
    full: "Interrupt handler (ISR)",
    definition: "The kernel function that runs in response to an interrupt. keyboard_irq() means 'the handler for the keyboard's interrupt'. It must finish fast — others may be waiting.",
  },
  scancode: {
    id: "scancode",
    term: "scancode",
    full: "Keyboard scancode",
    definition: "The raw byte a keyboard sends identifying which physical key was pressed (0x1E = the 'A' key). The kernel later translates it into a character.",
  },
  eoi: {
    id: "eoi",
    term: "EOI",
    full: "End Of Interrupt",
    definition: "The 'done, thanks' message the handler sends back to the APIC. Until it arrives, the controller holds back further interrupts of that kind.",
  },
  "top-bottom-half": {
    id: "top-bottom-half",
    term: "top / bottom half",
    full: "Top half & bottom half",
    definition: "How the kernel splits interrupt work: the top half runs immediately and does the bare minimum (grab data, send EOI); slower follow-up work is deferred to a bottom half that runs later.",
  },
  "wait-queue": {
    id: "wait-queue",
    term: "wait queue",
    full: "Wait queue (blocked processes)",
    definition: "Where the kernel parks processes that are waiting for something (like a keypress). A blocked process uses zero CPU until an event wakes it up.",
  },
  "run-queue": {
    id: "run-queue",
    term: "run queue",
    full: "Run queue (ready processes)",
    definition: "The line of processes that are ready to run and waiting for their turn on the CPU. The scheduler picks the next one from here.",
  },
  registers: {
    id: "registers",
    term: "rip · rflags · rsp",
    full: "Instruction pointer, flags, stack pointer",
    definition: "Three CPU registers that capture 'where was I?': rip = which instruction is next, rflags = status flags of the computation, rsp = top of the stack. Save these three and you can resume exactly where you stopped.",
  },
  iret: {
    id: "iret",
    term: "iret",
    full: "Interrupt return instruction",
    definition: "The CPU instruction that ends a handler: it restores the saved rip, rflags and rsp, drops back to user mode, and the interrupted program continues as if nothing happened.",
  },
  monolithic: {
    id: "monolithic",
    term: "monolithic",
    full: "Monolithic kernel",
    definition: "A design where the whole OS — file systems, drivers, network stack, scheduler — lives together in kernel space as one big program. Services call each other directly, like rooms in one house. Linux is the classic example.",
  },
  microkernel: {
    id: "microkernel",
    term: "microkernel",
    full: "Microkernel",
    definition: "A design where the kernel keeps only the bare minimum — IPC, scheduling, basic memory. Everything else (file system, drivers) runs as separate user-space server processes that talk via messages. QNX and MINIX work this way.",
  },
  ipc: {
    id: "ipc",
    term: "IPC",
    full: "Inter-Process Communication",
    definition: "How separate processes talk to each other — by sending messages through the kernel instead of calling functions directly. It is the postal service of a microkernel: safe, but each letter costs a trip through the kernel.",
  },
  driver: {
    id: "driver",
    term: "driver",
    full: "Device driver",
    definition: "The piece of code that knows how to talk to one specific device — a disk, a keyboard, a network card. Drivers are the most common source of OS bugs, which is why where they live (kernel or user space) matters so much.",
  },
  "kernel-panic": {
    id: "kernel-panic",
    term: "panic",
    full: "Kernel panic",
    definition: "What happens when code inside the kernel crashes: there is no one above it to catch the error, so the whole machine halts. In a monolithic kernel, one buggy driver can take everything down.",
  },
  server: {
    id: "server",
    term: "server",
    full: "User-space server process",
    definition: "In a microkernel, an OS service (file system, driver, network) packaged as an ordinary user-mode process. If it crashes, the kernel survives and can simply restart it — like restarting an app.",
  },
  module: {
    id: "module",
    term: "module",
    full: "Loadable kernel module (LKM)",
    definition: "Linux's compromise: chunks of kernel code (often drivers) that can be loaded and unloaded at runtime without rebooting. They still run in kernel mode though — a buggy module can still panic the machine.",
  },
  hybrid: {
    id: "hybrid",
    term: "hybrid",
    full: "Hybrid kernel",
    definition: "A middle path used by Windows (NT) and macOS (XNU): a microkernel-style structure, but with most services pulled back into kernel space for speed. Message passing where it helps, direct calls where it counts.",
  },
  stdin: {
    id: "stdin",
    term: "stdin / stdout",
    full: "Standard input & output",
    definition: "Every process starts with three open 'files': stdin (fd 0, usually the keyboard), stdout (fd 1, usually the screen), stderr (fd 2). read(0, …) reads the keyboard; write(1, …) prints to the screen.",
  },
  token: {
    id: "token",
    term: "token",
    full: "Token",
    definition: "A piece of text the model actually sees — usually a word or word-fragment. 'the bank of the river' becomes 5 tokens. A tokenizer converts raw text into these pieces before anything else happens.",
  },
  embedding: {
    id: "embedding",
    term: "embedding",
    full: "Embedding vector",
    definition: "A list of numbers (a vector) that represents a token's meaning. Similar words get similar vectors. A plain lookup-table embedding is 'static': 'bank' gets the same vector whether it means money or a riverside.",
  },
  query: {
    id: "query",
    term: "Q (query)",
    full: "Query vector",
    definition: "What this token is looking for in the other tokens. Computed by multiplying the token's embedding with a learned matrix Wq. For 'bank', the query might effectively ask: 'is there anything nearby that tells me which kind of bank I am?'",
  },
  key: {
    id: "key",
    term: "K (key)",
    full: "Key vector",
    definition: "What this token contains, advertised to everyone else. Computed with the learned matrix Wk. A query is compared against every key — a high match means 'this token has what you are looking for'.",
  },
  value: {
    id: "value",
    term: "V (value)",
    full: "Value vector",
    definition: "What this token hands over if attention selects it. Computed with the learned matrix Wv. The final output for a token is a weighted mix of everyone's values — not their raw embeddings.",
  },
  "linear-layer": {
    id: "linear-layer",
    term: "Wq · Wk · Wv",
    full: "Learned projection matrices (nn.Linear)",
    definition: "Three weight matrices, learned during training, that turn one embedding into its query, key, and value. Crucially the same three matrices are reused for every token — the model learns one way of asking, advertising, and giving.",
  },
  "dot-product": {
    id: "dot-product",
    term: "dot product",
    full: "Dot product (similarity score)",
    definition: "Multiply two vectors element by element and add it all up. The result is one number that is large when the vectors point the same way. Attention uses query·key dot products as 'how relevant is that token to me?' scores.",
  },
  "sqrt-dk": {
    id: "sqrt-dk",
    term: "÷ √dₖ",
    full: "Scaling by the square root of the key dimension",
    definition: "Dot products grow with vector length, and huge scores push softmax into an almost one-hot output where gradients vanish. Dividing by √dₖ (dₖ = key vector length) keeps scores in a range where softmax stays soft and training stays stable.",
  },
  softmax: {
    id: "softmax",
    term: "softmax",
    full: "Softmax function",
    definition: "Turns a row of raw scores into positive weights that sum to 1 — a probability-like distribution. Big scores become big weights, but every token keeps at least a little weight.",
  },
  "attention-weights": {
    id: "attention-weights",
    term: "attention weights",
    full: "Attention weight matrix (A)",
    definition: "The n×n matrix after softmax: row i says how much token i attends to every other token. Row 'bank' putting most of its weight on 'river' is the model disambiguating the word.",
  },
  tokenizer: {
    id: "tokenizer",
    term: "tokenizer",
    full: "Tokenizer",
    definition:
      "The program that splits raw text into tokens using a fixed vocabulary. Common words stay whole ('river'); rare words get split into pieces ('river' + 'bed'). GPT-style models use byte-pair encoding (BPE) tokenizers.",
  },
  vocabulary: {
    id: "vocabulary",
    term: "vocabulary",
    full: "Vocabulary",
    definition:
      "The fixed list of all tokens a model knows — typically 30,000 to 100,000 entries. Every token has an ID (a row number), which is how text becomes numbers the model can look up.",
  },
  "embedding-table": {
    id: "embedding-table",
    term: "embedding table",
    full: "Embedding table (lookup matrix)",
    definition:
      "A big matrix with one row per vocabulary token. Turning a token into a vector is literally reading its row — no computation. The rows start random and are learned during training (word2vec, GloVe, or the transformer itself).",
  },
  "vector-space": {
    id: "vector-space",
    term: "vector space",
    full: "Vector space",
    definition:
      "Treat each vector as coordinates and every word becomes a point in space. Words used in similar contexts end up as nearby points — 'river' and 'water' cluster together, far from 'money'.",
  },
  cosine: {
    id: "cosine",
    term: "cosine similarity",
    full: "Cosine similarity",
    definition:
      "The dot product after ignoring vector lengths: just the angle between two vectors. +1 means pointing the same way (very similar), 0 means unrelated, −1 means opposite. A length-independent closeness score.",
  },
  "positional-encoding": {
    id: "positional-encoding",
    term: "positional encoding",
    full: "Positional encoding",
    definition:
      "A vector that represents a position (1st, 2nd, 3rd…) instead of a word, added onto each token's embedding. Without it, attention treats a sentence as a bag of words — 'dog bites man' and 'man bites dog' would look identical.",
  },
  "sin-cos-pair": {
    id: "sin-cos-pair",
    term: "sin/cos pair",
    full: "Sine/cosine pair",
    definition:
      "Each pair of dimensions in the positional encoding holds a sine and cosine wave of one frequency. Early pairs oscillate fast (distinguish neighbours); later pairs oscillate slowly (encode coarse position). Together they give every position a unique fingerprint.",
  },
  frequency: {
    id: "frequency",
    term: "frequency",
    full: "Wave frequency",
    definition:
      "How fast a wave repeats. The positional encoding uses many waves, from fast to extremely slow — like the second, minute, and hour hands of a clock: reading all hands together tells you the exact time (position).",
  },
  "contextual-embedding": {
    id: "contextual-embedding",
    term: "contextual embedding",
    full: "Contextual embedding",
    definition: "The output of attention for a token: a new vector built as a weighted mix of the value vectors of all tokens. Unlike the static input embedding, 'bank' now carries river-ness baked in from its context.",
  },
};
