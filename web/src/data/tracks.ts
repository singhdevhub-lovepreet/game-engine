import type { Track } from "../types";
import { chapters } from "./chapters";
import { transformerChapters } from "./transformers";

export const tracks: Track[] = [
  {
    id: "os",
    label: "OS",
    tagline: "Interactive OS for interviews — learn from first principles",
    defaultLessonId: "kernel-vs-user-space",
    chapters,
  },
  {
    id: "transformers",
    label: "Transformers",
    tagline: "Transformers from first principles — attention, encoders, decoders",
    defaultLessonId: "self-attention",
    chapters: transformerChapters,
  },
];
