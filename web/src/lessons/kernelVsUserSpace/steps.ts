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

export const steps: KernelLessonStep[] = [
  {
    id: "intro",
    codeLines: [],
    scene: "idle",
    narration: {
      id: "intro",
      text: {
        en: "Your CPU runs in two privilege levels. Applications live in user mode (ring 3) with restricted access. The kernel runs in kernel mode (ring 0) with full hardware control.",
        hi: "आपका CPU दो privilege levels में चलता है। Applications user mode (ring 3) में सीमित access के साथ चलती हैं। Kernel, kernel mode (ring 0) में पूरे hardware control के साथ चलता है।",
      },
    },
    note: "User mode = ring 3, restricted. Kernel mode = ring 0, unrestricted hardware access.",
  },
  {
    id: "user-code",
    codeLines: [4, 5],
    scene: "user-running",
    narration: {
      id: "user-code",
      text: {
        en: "main() starts executing in user space. Local variables like buf live on the process's own stack — no kernel help needed yet.",
        hi: "main() user space में execute होना शुरू होता है। buf जैसे local variables process के अपने stack पर रहते हैं — अभी kernel की ज़रूरत नहीं।",
      },
    },
    note: "Ordinary computation never leaves user mode — it's fast.",
  },
  {
    id: "open-trap",
    codeLines: [7],
    scene: "trap",
    activeSyscall: "open",
    narration: {
      id: "open-trap",
      text: {
        en: "open() needs the disk — hardware the app cannot touch directly. The C library issues a syscall instruction, the CPU flips its mode bit, and control traps across the boundary into the kernel.",
        hi: "open() को disk चाहिए — जिसे app सीधे छू नहीं सकती। C library एक syscall instruction चलाती है, CPU अपना mode bit बदलता है, और control boundary पार करके kernel में चला जाता है।",
      },
    },
    note: "A system call is the ONLY doorway from user space into the kernel.",
  },
  {
    id: "kernel-work",
    codeLines: [7],
    scene: "kernel-running",
    activeSyscall: "open",
    narration: {
      id: "kernel-work",
      text: {
        en: "Now in kernel mode, the OS checks permissions, finds the file on disk, and creates a file descriptor. The application is suspended while the kernel works on its behalf.",
        hi: "अब kernel mode में, OS permissions जाँचता है, disk पर file ढूँढता है, और एक file descriptor बनाता है। जब तक kernel काम करता है, application रुकी रहती है।",
      },
    },
    note: "The kernel validates every request — apps can't be trusted with raw hardware.",
  },
  {
    id: "return",
    codeLines: [7],
    scene: "return",
    activeSyscall: "open",
    narration: {
      id: "return",
      text: {
        en: "The kernel returns the file descriptor, the CPU switches back to user mode, and open() simply returns an int. To your C code the whole round trip looks like a normal function call.",
        hi: "Kernel file descriptor लौटाता है, CPU वापस user mode में आता है, और open() बस एक int return करता है। आपके C code को यह पूरा सफ़र एक साधारण function call जैसा दिखता है।",
      },
    },
    note: "Mode switch ≠ context switch — same process, different privilege level.",
  },
  {
    id: "read-write",
    codeLines: [9, 11],
    scene: "trap",
    activeSyscall: "read",
    narration: {
      id: "read-write",
      text: {
        en: "read() and write() repeat the same dance: trap in, kernel copies bytes between the device and your buffer, trap out. Every crossing has a cost — that's why buffered I/O batches them.",
        hi: "read() और write() वही प्रक्रिया दोहराते हैं: अंदर trap, kernel device और आपके buffer के बीच bytes copy करता है, बाहर trap। हर crossing की एक कीमत है — इसीलिए buffered I/O उन्हें batch करता है।",
      },
    },
    note: "Interview favourite: syscalls are expensive; minimize boundary crossings.",
  },
  {
    id: "summary",
    codeLines: [13, 14],
    scene: "done",
    narration: {
      id: "summary",
      text: {
        en: "close() releases the descriptor and the program ends. Remember: user space for isolation, kernel space for authority, and system calls as the guarded gate between them.",
        hi: "close() descriptor छोड़ देता है और program समाप्त होता है। याद रखें: isolation के लिए user space, authority के लिए kernel space, और दोनों के बीच सुरक्षित द्वार — system calls।",
      },
    },
    note: "Summary: isolation (user) + authority (kernel) + guarded gate (syscall).",
  },
];
