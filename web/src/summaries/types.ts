export interface SummaryFigure {
  /** Key of a figure component registered in SummaryPage. */
  kind: "rings" | "syscall-path" | "interrupt-path" | "mono-vs-micro";
  caption: string;
}

export interface SummarySection {
  id: string;
  heading: string;
  /** Blog paragraphs, in order. */
  body: string[];
  bullets?: string[];
  figure?: SummaryFigure;
}

export interface QuickfireItem {
  q: string;
  a: string;
}

export interface ChapterSummary {
  chapterId: string;
  title: string;
  intro: string;
  sections: SummarySection[];
  /** Rapid interview-style Q&A at the end of the recap. */
  quickfire: QuickfireItem[];
}
