import { chapters } from "../data/chapters";
import type { Lesson } from "../types";

interface SidebarProps {
  selectedLessonId: string;
  onSelect: (lesson: Lesson) => void;
}

export function Sidebar({ selectedLessonId, onSelect }: SidebarProps) {
  return (
    <nav className="sidebar">
      <h1 className="logo">
        OS<span>/first-principles</span>
      </h1>
      {chapters.map((chapter) => (
        <div key={chapter.id} className="chapter">
          <div className="chapter-title">
            {chapter.number}. {chapter.title}
            {chapter.crucial && <span className="crucial">crucial</span>}
          </div>
          <ul>
            {chapter.lessons.map((lesson) => (
              <li key={lesson.id}>
                <button
                  className={`lesson-link${lesson.id === selectedLessonId ? " selected" : ""}`}
                  disabled={lesson.status === "coming-soon"}
                  onClick={() => onSelect(lesson)}
                  title={lesson.description}
                >
                  {lesson.title}
                  {lesson.status === "coming-soon" && <span className="soon">soon</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
