import type { LessonStep } from "../../types";

export const pyCode = `import torch, math

def pos_encoding(pos, d):
    pe = torch.zeros(d)
    for i in range(0, d, 2):
        freq = 1 / 10000 ** (i / d)
        pe[i]     = math.sin(pos * freq)
        pe[i + 1] = math.cos(pos * freq)
    return pe

x = embed(tokens)               # meaning only
p = torch.stack(
    [pos_encoding(t, d) for t in range(5)]
)

x = x + p                       # meaning + position`;

export type SceneState =
  | "bag"
  | "naive"
  | "wave"
  | "many-waves"
  | "sincos"
  | "fingerprint"
  | "add"
  | "done";

export interface PositionalEncodingsStep extends LessonStep {
  scene: SceneState;
}

export const glossaryIds = [
  "embedding",
  "positional-encoding",
  "frequency",
  "sin-cos-pair",
];

export const steps: PositionalEncodingsStep[] = [
  {
    id: "bag",
    codeLines: [],
    scene: "bag",
    terms: ["embedding"],
    narration: {
      id: "bag",
      text: "There is a problem with our embeddings: they carry meaning but no position. To the math we will build next, 'dog bites man' and 'man bites dog' are the same set of vectors — a bag of words. Word order matters, so we must inject it into the vectors themselves.",
    },
    note: "Embeddings alone = bag of words. Order must be injected.",
  },
  {
    id: "naive",
    codeLines: [],
    scene: "naive",
    terms: ["positional-encoding"],
    narration: {
      id: "naive",
      text: "The obvious fix: append the position as a number — 1, 2, 3… But position 500 would be a huge value that drowns out the meaning, and the model would never cope with sentences longer than any it saw in training. Normalizing to 0-to-1 breaks too: position 0.5 means word 5 in one sentence, word 50 in another. We need something bounded and consistent.",
    },
    note: "Raw 1,2,3… is unbounded; normalized breaks across lengths.",
  },
  {
    id: "wave",
    codeLines: [7],
    scene: "wave",
    terms: ["positional-encoding", "frequency"],
    narration: {
      id: "wave",
      text: "Enter waves. A sine wave is bounded — always between minus one and plus one, no matter how far you go. Read the height of the wave at position 0, 1, 2, 3… and each position gets a value. Bounded, smooth, defined for any length.",
    },
    note: "sin(pos): bounded in [−1, 1] for any position.",
  },
  {
    id: "many-waves",
    codeLines: [5, 6],
    scene: "many-waves",
    terms: ["frequency"],
    narration: {
      id: "many-waves",
      text: "One wave repeats, so distant positions would collide. The trick: use many waves at different frequencies — one per embedding dimension. A fast wave separates neighbours; slower and slower waves separate positions that are far apart. Like a clock: the second hand alone is ambiguous, but seconds plus minutes plus hours pin down the exact time.",
    },
    note: "Many frequencies: fast waves for neighbours, slow for far positions.",
  },
  {
    id: "sincos",
    codeLines: [7, 8],
    scene: "sincos",
    terms: ["sin-cos-pair"],
    narration: {
      id: "sincos",
      text: "Each frequency actually fills two dimensions: a sine and a cosine. The pair acts like the x and y of a point moving around a circle — together they pin down the phase exactly, and, as we will see later in the course, they let the model compute 'three positions to the left' with simple linear math.",
    },
    note: "sin/cos pair per frequency = a point on a circle — exact phase.",
  },
  {
    id: "fingerprint",
    codeLines: [3, 4, 5, 6, 7, 8, 9],
    scene: "fingerprint",
    terms: ["positional-encoding", "sin-cos-pair"],
    narration: {
      id: "fingerprint",
      text: "Stack all those wave readings and every position gets a unique fingerprint — a vector the same size as the word embedding. Position 0, position 1, position 2… each column of this stripe pattern is different from every other. No two positions share a fingerprint.",
    },
    note: "All waves stacked → a unique fingerprint vector per position.",
  },
  {
    id: "add",
    codeLines: [11, 12, 13, 14, 16],
    scene: "add",
    terms: ["positional-encoding", "embedding"],
    narration: {
      id: "add",
      text: "Finally, just add: x plus p. Each token's vector is now meaning plus position, in the same 768 numbers. Why add instead of concatenate? It keeps the dimension unchanged, and training learns to keep the two signals separable. Now 'dog bites man' and 'man bites dog' produce different vectors.",
    },
    note: "x = x + p: meaning and position share the same vector.",
  },
  {
    id: "summary",
    codeLines: [],
    scene: "done",
    terms: ["positional-encoding", "frequency", "sin-cos-pair"],
    narration: {
      id: "summary",
      text: "Recap: embeddings have no order, counting positions breaks, waves are bounded, many frequencies make positions unique, sin/cos pairs capture exact phase, and adding the fingerprint stamps position onto meaning. Foundations complete — next chapter, these vectors start talking to each other: attention.",
    },
    note: "bag of words → waves → fingerprints → x + p. Ready for attention.",
  },
];
