import { useState } from "react";
import "./App.css";
import { Sidebar } from "./components/Sidebar";
import { tracks } from "./data/tracks";
import { InterruptsLesson } from "./lessons/interrupts/Lesson";
import { KernelVsUserSpaceLesson } from "./lessons/kernelVsUserSpace/Lesson";
import { MonolithicVsMicrokernelLesson } from "./lessons/monolithicVsMicrokernel/Lesson";
import { SelfAttentionLesson } from "./lessons/selfAttention/Lesson";
import { SystemCallsLesson } from "./lessons/systemCalls/Lesson";
import { SummaryPage } from "./summaries/SummaryPage";
import { osBasicsSummary } from "./summaries/osBasics";
import type { Lesson, Track } from "./types";

export default function App() {
  const [trackId, setTrackId] = useState(tracks[0].id);
  const [lessonId, setLessonId] = useState(tracks[0].defaultLessonId);
  const track = tracks.find((t) => t.id === trackId) ?? tracks[0];

  const handleSelect = (lesson: Lesson) => setLessonId(lesson.id);
  const handleSelectTrack = (t: Track) => {
    setTrackId(t.id);
    setLessonId(t.defaultLessonId);
  };

  return (
    <div className="app">
      <Sidebar
        selectedTrackId={trackId}
        selectedLessonId={lessonId}
        onSelectTrack={handleSelectTrack}
        onSelect={handleSelect}
      />
      <main>
        <div className="topbar">
          <span>{track.tagline}</span>
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
        {lessonId === "self-attention" && <SelfAttentionLesson />}
      </main>
    </div>
  );
}
