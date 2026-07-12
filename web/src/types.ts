/** Languages a future TTS voice-over provider may support. */
export type Language = "en" | "hi";

export interface NarrationSegment {
  id: string;
  text: string;
  /** Populated later by a TTS provider (e.g. ElevenLabs) per language. */
  audioUrl?: Partial<Record<Language, string>>;
}

export interface LessonStep {
  id: string;
  /** 1-based line numbers to highlight in the code pane. */
  codeLines: number[];
  narration: NarrationSegment;
  note?: string;
  /** Glossary term ids (see data/glossary.ts) most relevant to this step. */
  terms?: string[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  status: "available" | "coming-soon";
  /** "summary" entries render as a blog-style chapter recap instead of an animated lesson. */
  kind?: "lesson" | "summary";
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  crucial?: boolean;
  lessons: Lesson[];
}

/** A top-level course (e.g. OS, Transformers) with its own chapter roadmap. */
export interface Track {
  id: string;
  /** Short name shown on the track tab, e.g. "OS". */
  label: string;
  /** Logo suffix, e.g. "/first-principles". */
  tagline: string;
  /** Lesson selected when switching to this track. */
  defaultLessonId: string;
  chapters: Chapter[];
}
