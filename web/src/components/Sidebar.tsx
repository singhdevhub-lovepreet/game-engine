import { tracks } from "../data/tracks";
import type { Lesson, Track } from "../types";

interface SidebarProps {
  selectedTrackId: string;
  selectedLessonId: string;
  onSelectTrack: (track: Track) => void;
  onSelect: (lesson: Lesson) => void;
}

export function Sidebar({
  selectedTrackId,
  selectedLessonId,
  onSelectTrack,
  onSelect,
}: SidebarProps) {
  const track = tracks.find((t) => t.id === selectedTrackId) ?? tracks[0];
  return (
    <nav className="sidebar">
      <h1 className="logo">
        {track.label}
        <span>/first-principles</span>
      </h1>
      <div className="track-tabs">
        {tracks.map((t) => (
          <button
            key={t.id}
            className={`track-tab${t.id === selectedTrackId ? " selected" : ""}`}
            onClick={() => onSelectTrack(t)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {track.chapters.map((chapter) => (
        <div key={chapter.id} className="chapter">
          <div className="chapter-title">
            {chapter.number}. {chapter.title}
            {chapter.crucial && <span className="crucial">crucial</span>}
          </div>
          <ul>
            {chapter.lessons.map((lesson) => (
              <li key={lesson.id}>
                <button
                  className={`lesson-link${lesson.id === selectedLessonId ? " selected" : ""}${lesson.kind === "summary" ? " recap" : ""}`}
                  disabled={lesson.status === "coming-soon"}
                  onClick={() => onSelect(lesson)}
                  title={lesson.description}
                >
                  {lesson.title}
                  {lesson.kind === "summary" && <span className="soon recap-tag">recap</span>}
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
