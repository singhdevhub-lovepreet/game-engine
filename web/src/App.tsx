import { useState } from "react";
import "./App.css";
import { Sidebar } from "./components/Sidebar";
import { InterruptsLesson } from "./lessons/interrupts/Lesson";
import { KernelVsUserSpaceLesson } from "./lessons/kernelVsUserSpace/Lesson";
import { MonolithicVsMicrokernelLesson } from "./lessons/monolithicVsMicrokernel/Lesson";
import { SystemCallsLesson } from "./lessons/systemCalls/Lesson";
import { SummaryPage } from "./summaries/SummaryPage";
import { osBasicsSummary } from "./summaries/osBasics";
import type { Lesson } from "./types";

export default function App() {
  const [lessonId, setLessonId] = useState("kernel-vs-user-space");

  const handleSelect = (lesson: Lesson) => setLessonId(lesson.id);

  return (
    <div className="app">
      <Sidebar selectedLessonId={lessonId} onSelect={handleSelect} />
      <main>
        <div className="topbar">
          <span>Interactive OS for interviews — learn from first principles</span>
        </div>
        {lessonId === "kernel-vs-user-space" && <KernelVsUserSpaceLesson />}
        {lessonId === "system-calls" && <SystemCallsLesson />}
        {lessonId === "interrupts" && <InterruptsLesson />}
        {lessonId === "monolithic-vs-microkernel" && (
          <MonolithicVsMicrokernelLesson />
        )}
        {lessonId === "os-basics-summary" && (
          <SummaryPage summary={osBasicsSummary} />
        )}
      </main>
    </div>
  );
}
