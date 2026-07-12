# Operating Systems — Interactive First-Principles Course Plan

A visual, animation-driven OS course for interview preparation. Every chapter teaches from
first principles with three synchronized layers on screen:

1. **Code pane** — a real C program with line-by-line highlighting as it executes.
2. **Animation stage** — 3D/2D visuals of hardware (RAM, CPU, MMU, disk) reacting to the code.
3. **Short notes** — concise interview-focused takeaways pinned beside the animation.

**Design stack**: Three.js / React Three Fiber for 3D scenes (RAM sticks, CPU cores, disk
platters), GSAP + ScrollTrigger for scroll-driven chapter progression, Anime.js / Motion for
2D diagrams (state machines, queues, tables), Lottie for micro-interactions.
(Per the `claudedesignskills` marketplace: `core-3d-animation`, `animation-components`,
`gsap-scrolltrigger`, `react-three-fiber` skills.)

---

## Chapter 1 — OS Basics & Architecture

**Lessons**
1. Kernel vs. User Space — split-screen animation: app running in user mode above a
   protection boundary; privilege ring visual (ring 0 vs ring 3).
2. System Calls — C code calling `read()` / `write()` / `fork()` / `exec()`; animation shows
   the trap into the kernel, mode-bit flip, and return to user space.
3. Interrupts — keyboard/timer hardware fires; CPU pauses the highlighted instruction,
   jumps to the interrupt vector table, runs the handler, resumes.
4. Monolithic vs. Microkernel — side-by-side architecture diagram (Linux vs. QNX), services
   animating in/out of kernel space.

**Signature animation**: a C `printf("hello")` traced all the way down — libc → `write()`
syscall → kernel → device driver → screen.

## Chapter 2 — Process Management

**Lessons**
1. What is a Process — memory layout animation: Text, Data, Heap, Stack segments stacking
   up in RAM as the program loads.
2. Process Control Block (PCB) — the kernel's struct visualized as a card holding PID,
   registers, state, open files.
3. Process States & Lifecycle — animated state machine: New → Ready → Running →
   Waiting/Blocked → Terminated, with processes flowing between queues.
4. Context Switching — two PCB cards; registers drain from CPU into PCB A, load from PCB B;
   cost visualized as a stall on the CPU timeline.
5. CPU Scheduling Algorithms — interactive Gantt-chart playground: FCFS, SJF, Round Robin
   (time-quantum slider), Priority; compare waiting/turnaround times live.
6. Zombie & Orphan Processes — `fork()` code highlighted; parent dies, `init` adopts the
   orphan; zombie lingers until `wait()` reaps it.

**Signature animation**: Round Robin — processes circling a scheduler wheel, each grabbing
the CPU for one quantum while the RAM view shows their working sets.

## Chapter 3 — Threads & Concurrency

**Lessons**
1. Process vs. Thread — one process box; threads share the heap/data segments (shared glow)
   but each carries its own stack and register file.
2. User-Level vs. Kernel-Level Threads — who schedules whom: thread library juggling in user
   space vs. kernel-visible threads.
3. Multithreading Models — Many-to-One, One-to-One, Many-to-Many mapping animations.

**Signature animation**: `pthread_create()` code highlighted; a thread splits off, walks to
the scheduler, gets a CPU core, and reads a shared address in the RAM view.

## Chapter 4 — Process Synchronization (crucial)

**Lessons**
1. Critical Section Problem & Race Conditions — two threads increment a shared counter;
   interleaved load/add/store shown at instruction level producing a lost update.
2. Mutex — the "one key to the bathroom" visual: a literal key object passed between threads;
   blocked threads queue at the door.
3. Semaphores — binary vs. counting; an integer gauge with `wait()`/`signal()` arrows;
   parking-lot visual for counting semaphores.
4. Producer–Consumer — bounded buffer ring animation with pseudo-code side-by-side.
5. Reader–Writer — many readers sharing, writer requiring exclusivity.
6. Dining Philosophers — animated round table; show both the deadlock and a fix.

**Signature animation**: race condition replay button — same code, two different
interleavings, two different final values.

## Chapter 5 — Deadlocks

**Lessons**
1. Definition & the 4 Necessary Conditions — Mutual Exclusion, Hold and Wait, No Preemption,
   Circular Wait; the resource-allocation graph animates a cycle forming.
2. Deadlock Prevention — break each condition one at a time and watch the cycle become
   impossible.
3. Deadlock Avoidance — Banker's Algorithm as an interactive matrix; grant/deny requests and
   see safe/unsafe states highlighted.
4. Detection & Recovery — cycle detection sweep; process termination / resource preemption.

**Signature animation**: two processes and two locks forming the classic ABBA deadlock,
drawn as a growing circular arrow.

## Chapter 6 — Memory Management (crucial)

**Lessons**
1. Logical vs. Physical Addresses — C pointer value in code pane; MMU box translates it to a
   physical RAM address in the animation.
2. Fragmentation — internal vs. external; blocks allocating/freeing, holes appearing.
3. Paging — logical memory sliced into pages, physical RAM into frames; pages fly into
   arbitrary frames, killing external fragmentation.
4. Page Tables & TLB — address translation walk; TLB hit (fast path glow) vs. miss (page
   table walk).
5. Virtual Memory — RAM stick + disk swap area; the "illusion" of large memory as pages move
   between them; a C program reads an address and the full VA→PA mapping animates.
6. Page Faults — access to a non-resident page traps to the OS; page loads from disk; the
   faulting instruction re-executes.
7. Page Replacement — FIFO / LRU / Optimal simulator with a reference string; fault counters
   race each other (LRU emphasized).
8. Thrashing — working sets exceed RAM; disk I/O arrows dominate; CPU utilization graph
   collapses.

**Signature animation** (the course's flagship, per the original vision): physical RAM
visible with real addresses → mapped through a page table to virtual pages → read by a C
program shown and highlighted in the code pane.

## Chapter 7 — File Systems & I/O

**Lessons**
1. File Allocation Methods — contiguous, linked, indexed blocks laid out on a disk surface.
2. Inodes — metadata card (size, permissions, block pointers) with direct/indirect pointer
   fan-out to data blocks.
3. Disk Scheduling — animated disk head servicing a request queue: FCFS, SSTF, SCAN
   (elevator), C-SCAN; total seek distance counter.

**Signature animation**: `open()`/`read()` in C → path resolution → inode lookup → data
block fetch as the disk head sweeps.

## Chapter 8 — Advanced / Linux Specifics (bonus)

**Lessons**
1. Linux Tools — `top`, `ps`, `grep`, `awk`, `chmod`, `netstat`/`ss` with live terminal
   walkthroughs tied to concepts from earlier chapters.
2. IPC & Sockets — pipes, message queues, shared memory, sockets; data animating between
   process boxes.
3. Daemons — background processes detaching from the terminal.
4. Virtualization vs. Containerization — full guest OS in a VM vs. namespaces + cgroups
   isolating processes (Docker), drawn as nested boxes.

---

## Suggested Build Order

1. Chapter 6 (Memory Management) first — it is the flagship visual and validates the whole
   code-pane + RAM-animation architecture.
2. Chapters 2–3 (Processes & Threads) — reuse the RAM/CPU scene, add the scheduler.
3. Chapter 4 (Synchronization) — highest interview value.
4. Chapters 5, 1, 7, 8.

Each lesson ships as: scroll-driven animation scene + highlighted C snippet + short notes +
2–3 interview flash questions.
