import type { Chapter } from "../types";

export const chapters: Chapter[] = [
  {
    id: "os-basics",
    number: 1,
    title: "OS Basics & Architecture",
    lessons: [
      {
        id: "kernel-vs-user-space",
        title: "Kernel vs. User Space",
        description:
          "User mode vs. kernel mode, privilege rings, and how a system call crosses the boundary.",
        status: "available",
      },
      {
        id: "system-calls",
        title: "System Calls",
        description: "How read(), write(), fork(), exec() trap into the kernel.",
        status: "available",
      },
      {
        id: "interrupts",
        title: "Interrupts",
        description: "Hardware signals the CPU to handle immediate events.",
        status: "coming-soon",
      },
      {
        id: "monolithic-vs-microkernel",
        title: "Monolithic vs. Microkernel",
        description: "Linux vs. QNX architecture at a glance.",
        status: "coming-soon",
      },
    ],
  },
  {
    id: "process-management",
    number: 2,
    title: "Process Management",
    lessons: [
      { id: "process-definition", title: "What is a Process", description: "Text, Data, Heap, Stack layout in memory.", status: "coming-soon" },
      { id: "pcb", title: "Process Control Block", description: "The kernel's per-process data structure.", status: "coming-soon" },
      { id: "process-states", title: "Process States & Lifecycle", description: "New → Ready → Running → Waiting → Terminated.", status: "coming-soon" },
      { id: "context-switching", title: "Context Switching", description: "Saving and restoring CPU state between processes.", status: "coming-soon" },
      { id: "cpu-scheduling", title: "CPU Scheduling Algorithms", description: "FCFS, SJF, Round Robin, Priority.", status: "coming-soon" },
      { id: "zombie-orphan", title: "Zombie & Orphan Processes", description: "wait(), reaping, and init adoption.", status: "coming-soon" },
    ],
  },
  {
    id: "threads-concurrency",
    number: 3,
    title: "Threads & Concurrency",
    lessons: [
      { id: "process-vs-thread", title: "Process vs. Thread", description: "Shared heap/data, private stack and registers.", status: "coming-soon" },
      { id: "user-vs-kernel-threads", title: "User-Level vs. Kernel-Level Threads", description: "Who manages the threads.", status: "coming-soon" },
      { id: "multithreading-models", title: "Multithreading Models", description: "Many-to-One, One-to-One, Many-to-Many.", status: "coming-soon" },
    ],
  },
  {
    id: "synchronization",
    number: 4,
    title: "Process Synchronization",
    crucial: true,
    lessons: [
      { id: "critical-section", title: "Critical Section & Race Conditions", description: "Lost updates from interleaved threads.", status: "coming-soon" },
      { id: "mutex", title: "Mutex", description: "One key, one critical section.", status: "coming-soon" },
      { id: "semaphores", title: "Semaphores", description: "Binary vs. counting semaphores.", status: "coming-soon" },
      { id: "producer-consumer", title: "Producer–Consumer", description: "Bounded buffer with pseudo-code.", status: "coming-soon" },
      { id: "reader-writer", title: "Reader–Writer", description: "Shared reads, exclusive writes.", status: "coming-soon" },
      { id: "dining-philosophers", title: "Dining Philosophers", description: "Deadlock and its fixes at a round table.", status: "coming-soon" },
    ],
  },
  {
    id: "deadlocks",
    number: 5,
    title: "Deadlocks",
    lessons: [
      { id: "deadlock-conditions", title: "Definition & 4 Necessary Conditions", description: "Mutual exclusion, hold & wait, no preemption, circular wait.", status: "coming-soon" },
      { id: "deadlock-prevention", title: "Deadlock Prevention", description: "Break one condition, break the deadlock.", status: "coming-soon" },
      { id: "bankers-algorithm", title: "Deadlock Avoidance (Banker's)", description: "Safe vs. unsafe states, interactively.", status: "coming-soon" },
      { id: "detection-recovery", title: "Detection & Recovery", description: "Find cycles, abort or preempt.", status: "coming-soon" },
    ],
  },
  {
    id: "memory-management",
    number: 6,
    title: "Memory Management",
    crucial: true,
    lessons: [
      { id: "logical-vs-physical", title: "Logical vs. Physical Addresses", description: "The MMU translates every pointer.", status: "coming-soon" },
      { id: "fragmentation", title: "Fragmentation", description: "Internal vs. external waste.", status: "coming-soon" },
      { id: "paging", title: "Paging", description: "Pages and frames end external fragmentation.", status: "coming-soon" },
      { id: "page-tables-tlb", title: "Page Tables & TLB", description: "Translation walks and the TLB fast path.", status: "coming-soon" },
      { id: "virtual-memory", title: "Virtual Memory", description: "RAM + disk = the big-memory illusion.", status: "coming-soon" },
      { id: "page-faults", title: "Page Faults", description: "Trapping, loading, re-executing.", status: "coming-soon" },
      { id: "page-replacement", title: "Page Replacement", description: "FIFO, LRU, Optimal simulators.", status: "coming-soon" },
      { id: "thrashing", title: "Thrashing", description: "When paging eats the CPU.", status: "coming-soon" },
    ],
  },
  {
    id: "file-systems",
    number: 7,
    title: "File Systems & I/O",
    lessons: [
      { id: "file-allocation", title: "File Allocation Methods", description: "Contiguous, linked, indexed.", status: "coming-soon" },
      { id: "inodes", title: "Inodes", description: "Metadata and block pointers in UNIX.", status: "coming-soon" },
      { id: "disk-scheduling", title: "Disk Scheduling", description: "FCFS, SSTF, SCAN, C-SCAN.", status: "coming-soon" },
    ],
  },
  {
    id: "advanced-linux",
    number: 8,
    title: "Advanced / Linux Specifics",
    lessons: [
      { id: "linux-tools", title: "Linux Tools", description: "top, ps, grep, awk, chmod, ss.", status: "coming-soon" },
      { id: "ipc-sockets", title: "Sockets & IPC", description: "Pipes, queues, shared memory, sockets.", status: "coming-soon" },
      { id: "daemons", title: "Daemons", description: "Background processes without a terminal.", status: "coming-soon" },
      { id: "virtualization-containers", title: "Virtualization vs. Containerization", description: "VMs vs. namespaces + cgroups.", status: "coming-soon" },
    ],
  },
];
