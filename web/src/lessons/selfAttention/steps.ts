import type { LessonStep } from "../../types";

export const pyCode = `import torch
import torch.nn.functional as F

tokens = ["the", "bank", "of", "the", "river"]
x = embed(tokens)               # (5, d) one row per token

Wq = torch.nn.Linear(d, d_k, bias=False)
Wk = torch.nn.Linear(d, d_k, bias=False)
Wv = torch.nn.Linear(d, d_k, bias=False)

Q = Wq(x)                       # what am I looking for?
K = Wk(x)                       # what do I contain?
V = Wv(x)                       # what do I give away?

scores = Q @ K.T                # (5, 5) similarity scores
scores = scores / d_k ** 0.5    # keep softmax soft

A = F.softmax(scores, dim=-1)   # each row sums to 1

out = A @ V                     # contextual embeddings`;

export type SceneState =
  | "tokens"
  | "embeddings"
  | "projections"
  | "qkv"
  | "scores"
  | "scale"
  | "softmax"
  | "mix"
  | "matrix"
  | "done";

export interface SelfAttentionStep extends LessonStep {
  scene: SceneState;
}

/** Terms surfaced in this lesson's jargon decoder, in teaching order. */
export const glossaryIds = [
  "token",
  "embedding",
  "linear-layer",
  "query",
  "key",
  "value",
  "dot-product",
  "sqrt-dk",
  "softmax",
  "attention-weights",
  "contextual-embedding",
];

export const steps: SelfAttentionStep[] = [
  {
    id: "intro",
    codeLines: [],
    scene: "tokens",
    terms: ["token"],
    narration: {
      id: "intro",
      text: "Read the sentence 'the bank of the river'. You instantly know this bank holds water, not money — because you looked at the words around it. Self-attention is the mechanism that lets a model do exactly that: let every word look at every other word.",
    },
    note: "'bank' is ambiguous alone; its neighbours disambiguate it.",
  },
  {
    id: "embeddings",
    codeLines: [4, 5],
    scene: "embeddings",
    terms: ["token", "embedding"],
    narration: {
      id: "embeddings",
      text: "First each token becomes an embedding — a vector of numbers standing in for its meaning. But a lookup table is static: 'bank' gets the exact same vector next to 'river' as next to 'money'. That is the problem attention has to fix.",
    },
    note: "Static embeddings: same vector for 'bank' in every sentence.",
  },
  {
    id: "projections",
    codeLines: [7, 8, 9],
    scene: "projections",
    terms: ["linear-layer"],
    narration: {
      id: "projections",
      text: "The model learns three matrices — Wq, Wk, Wv. One embedding goes in, three different views come out. And the same three matrices are shared by every token: the model learns one way of asking, one way of advertising, one way of giving.",
    },
    note: "One shared Wq, Wk, Wv for all tokens — learned during training.",
  },
  {
    id: "qkv",
    codeLines: [11, 12, 13],
    scene: "qkv",
    terms: ["query", "key", "value"],
    narration: {
      id: "qkv",
      text: "Each token now carries three vectors. The query: what am I looking for? The key: what do I contain? The value: what do I hand over if you pick me. 'bank' asks; 'river' advertises; whoever matches gets to contribute their value.",
    },
    note: "Q = what I seek, K = what I contain, V = what I give.",
  },
  {
    id: "scores",
    codeLines: [15],
    scene: "scores",
    terms: ["dot-product", "query", "key"],
    narration: {
      id: "scores",
      text: "Every query is dotted with every key — one multiply-and-sum per pair — giving a 5-by-5 score matrix. Row 'bank' holds bank's relevance to each word in the sentence. High score between bank's query and river's key: that is the match we wanted.",
    },
    note: "Q @ K.T → n×n scores: how relevant is each token to each other.",
  },
  {
    id: "scale",
    codeLines: [16],
    scene: "scale",
    terms: ["sqrt-dk", "softmax"],
    narration: {
      id: "scale",
      text: "Longer vectors produce bigger dot products, and huge scores would slam the upcoming softmax into a hard 1-or-0 choice where gradients die. Dividing every score by the square root of the key dimension keeps the distribution soft and the training stable.",
    },
    note: "÷ √dₖ stops softmax from saturating; gradients keep flowing.",
  },
  {
    id: "softmax",
    codeLines: [18],
    scene: "softmax",
    terms: ["softmax", "attention-weights"],
    narration: {
      id: "softmax",
      text: "Softmax turns each row of raw scores into positive weights that sum to one. Now row 'bank' literally reads as a recipe: take 62% of river, 14% of the, 9% of of… These are the attention weights.",
    },
    note: "softmax(row) → attention weights, each row sums to 1.",
  },
  {
    id: "mix",
    codeLines: [20],
    scene: "mix",
    terms: ["value", "contextual-embedding"],
    narration: {
      id: "mix",
      text: "Finally each token's output is the weighted mix of everyone's value vectors. Bank's new vector is mostly river's value blended with its own — a contextual embedding. The same word now carries different vectors in different sentences. Ambiguity solved.",
    },
    note: "out = A @ V — 'bank' becomes a river-flavoured vector.",
  },
  {
    id: "matrix",
    codeLines: [15, 16, 18, 20],
    scene: "matrix",
    terms: ["dot-product", "softmax", "attention-weights"],
    narration: {
      id: "matrix",
      text: "Step back: the whole mechanism is one formula — softmax of Q K-transpose over root d-k, times V. Every token is processed in the same matrix multiplications, all at once. No loop over positions like an RNN: this parallelism is why transformers train so fast.",
    },
    note: "Attention(Q,K,V) = softmax(QKᵀ/√dₖ)V — all tokens in parallel.",
  },
  {
    id: "summary",
    codeLines: [],
    scene: "done",
    terms: ["query", "key", "value", "contextual-embedding"],
    narration: {
      id: "summary",
      text: "Recap: embed the tokens, project each into query, key, value with shared learned matrices, score every pair with dot products, scale by root d-k, softmax into weights, and mix the values. Words stop being dictionary entries and start meaning what their context says.",
    },
    note: "Pipeline: embed → Q/K/V → scores → scale → softmax → mix values.",
  },
];
