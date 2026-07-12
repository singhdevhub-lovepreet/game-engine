import type { LessonStep } from "../../types";

export const pyCode = `import torch
import torch.nn.functional as F

# tiny 2-D embeddings so we can draw them
river = torch.tensor([0.90, 0.80])
water = torch.tensor([0.80, 0.90])
money = torch.tensor([-0.70, 0.60])

# dot product: multiply pairs, add them up
sim_rw = river @ water          #  1.44 -> close
sim_rm = river @ money          # -0.15 -> far

# cosine: ignore lengths, keep the angle
cos_rw = F.cosine_similarity(
    river.unsqueeze(0), water.unsqueeze(0)
)                               #  0.99`;

export type SceneState =
  | "axes"
  | "points"
  | "arrows"
  | "dot-close"
  | "dot-far"
  | "angle"
  | "done";

export interface VectorSpaceStep extends LessonStep {
  scene: SceneState;
}

export const glossaryIds = [
  "embedding",
  "vector-space",
  "dot-product",
  "cosine",
];

export const steps: VectorSpaceStep[] = [
  {
    id: "intro",
    codeLines: [5, 6, 7],
    scene: "axes",
    terms: ["embedding", "vector-space"],
    narration: {
      id: "intro",
      text: "An embedding is a list of numbers — and a list of numbers is a coordinate. Real models use 768 dimensions, but the idea is easiest to see in two: each word becomes a point on a map. Here are river, water and money as tiny 2-D embeddings.",
    },
    note: "A vector is a coordinate — every word becomes a point in space.",
  },
  {
    id: "points",
    codeLines: [5, 6, 7],
    scene: "points",
    terms: ["vector-space"],
    narration: {
      id: "points",
      text: "Plot them and structure appears: river and water land next to each other, money sits far away. This is not an accident — training pushed words that appear in similar contexts to similar coordinates. Meaning has become geometry: related words are nearby points.",
    },
    note: "Training makes related words land close together — meaning = geometry.",
  },
  {
    id: "arrows",
    codeLines: [5, 6, 7],
    scene: "arrows",
    terms: ["vector-space"],
    narration: {
      id: "arrows",
      text: "There is a second way to see a vector: as an arrow from the origin. River and water point in almost the same direction; money points somewhere else entirely. 'How similar are two words?' becomes 'how aligned are two arrows?' — and that we can compute.",
    },
    note: "Vector as arrow: similarity = how aligned two arrows are.",
  },
  {
    id: "dot-close",
    codeLines: [10],
    scene: "dot-close",
    terms: ["dot-product"],
    narration: {
      id: "dot-close",
      text: "The dot product measures alignment with grade-school arithmetic: multiply the vectors pair by pair, then add. River dot water: 0.9 times 0.8, plus 0.8 times 0.9 — that is 1.44, a big positive number, because both coordinates agree in sign and size. Aligned arrows, big score.",
    },
    note: "Dot product = multiply pairs, add up. Aligned → big positive.",
  },
  {
    id: "dot-far",
    codeLines: [11],
    scene: "dot-far",
    terms: ["dot-product"],
    narration: {
      id: "dot-far",
      text: "Now river dot money: 0.9 times minus 0.7 is negative, 0.8 times 0.6 is positive, and they nearly cancel — minus 0.15. When arrows point in unrelated directions the products fight each other and the score collapses. One number tells us these words have little in common.",
    },
    note: "Unaligned arrows: products cancel → score near zero or negative.",
  },
  {
    id: "angle",
    codeLines: [14, 15, 16],
    scene: "angle",
    terms: ["cosine", "dot-product"],
    narration: {
      id: "angle",
      text: "One caveat: longer arrows inflate dot products. If you only care about direction, divide the lengths out — what remains is the cosine of the angle between the arrows. Plus one means same direction, zero means unrelated, minus one means opposite. River and water: 0.99.",
    },
    note: "Cosine = dot product with lengths divided out — pure angle.",
  },
  {
    id: "summary",
    codeLines: [],
    scene: "done",
    terms: ["vector-space", "dot-product", "cosine"],
    narration: {
      id: "summary",
      text: "So: words are points in space, related words sit close, and the dot product turns closeness into a single number. Hold on to this — attention is going to compute millions of exactly these dot products to decide which words should listen to which.",
    },
    note: "Dot product turns 'closeness in space' into one number — attention's core op.",
  },
];
