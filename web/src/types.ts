export type Language = "en" | "hi";

export interface NarrationSegment {
  id: string;
  text: Record<Language, string>;
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
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  crucial?: boolean;
  lessons: Lesson[];
}
