import { useState } from "react";
import "./App.css";
import { Sidebar } from "./components/Sidebar";
import { KernelVsUserSpaceLesson } from "./lessons/kernelVsUserSpace/Lesson";
import { SystemCallsLesson } from "./lessons/systemCalls/Lesson";
import type { Language, Lesson } from "./types";

export default function App() {
  const [lessonId, setLessonId] = useState("kernel-vs-user-space");
  const [language, setLanguage] = useState<Language>("en");

  const handleSelect = (lesson: Lesson) => setLessonId(lesson.id);

  return (
    <div className="app">
      <Sidebar selectedLessonId={lessonId} onSelect={handleSelect} />
      <main>
        <div className="topbar">
          <span>Interactive OS for interviews — learn from first principles</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            aria-label="Narration language"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>
        {lessonId === "kernel-vs-user-space" && (
          <KernelVsUserSpaceLesson language={language} />
        )}
        {lessonId === "system-calls" && <SystemCallsLesson language={language} />}
      </main>
    </div>
  );
}
