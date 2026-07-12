import type { Language } from "../types";

export type LocalizedText = Record<Language, string>;

export interface SummaryFigure {
  /** Key of a figure component registered in SummaryPage. */
  kind: "rings" | "syscall-path" | "interrupt-path" | "mono-vs-micro";
  caption: LocalizedText;
}

export interface SummarySection {
  id: string;
  heading: LocalizedText;
  /** Blog paragraphs, in order. */
  body: LocalizedText[];
  bullets?: LocalizedText[];
  figure?: SummaryFigure;
}

export interface QuickfireItem {
  q: LocalizedText;
  a: LocalizedText;
}

export interface ChapterSummary {
  chapterId: string;
  title: LocalizedText;
  intro: LocalizedText;
  sections: SummarySection[];
  /** Rapid interview-style Q&A at the end of the recap. */
  quickfire: QuickfireItem[];
}
