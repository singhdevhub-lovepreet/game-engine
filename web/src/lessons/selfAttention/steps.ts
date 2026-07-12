import type { LessonStep } from "../../types";

export const pyCode = `import torch
import torch.nn.functional as F

tokens = ["the", "bank", "of", "the", "river"]
x = embed(tokens)               # (5, d) one row per token

# naive idea: compare raw embeddings directly
sim = x[1] @ x[4]               # bank . river -> one number
raw = x @ x.T                   # all pairs - frozen & symmetric

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
  | "embed-one"
  | "dot-two"
  | "raw-row"
  | "raw-problem"
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
  "dot-product",
  "linear-layer",
  "query",
  "key",
  "value",
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
      text: "Read the sentence 'the bank of the river'. You instantly know this bank holds water, not money — because you looked at the words around it. Self-attention is the mechanism that lets a model do the same: let every word look at every other word.",
    },
    note: "'bank' is ambiguous alone; its neighbours disambiguate it.",
  },
  {
    id: "embed-one",
    codeLines: [4, 5],
    scene: "embed-one",
    terms: ["token", "embedding"],
    narration: {
      id: "embed-one",
      text: "Quick recap from Foundations: to a model, 'bank' is an embedding — a list of numbers looked up from the embedding table, standing in for its meaning. One word, one fixed vector. The catch: it is the same vector whether the sentence is about rivers or about money.",
    },
    note: "Recap: one word = one fixed embedding, blind to context.",
  },
  {
    id: "dot-two",
    codeLines: [8],
    scene: "dot-two",
    terms: ["embedding", "dot-product"],
    narration: {
      id: "dot-two",
      text: "And we already know how to compare two vectors: the dot product. Bank's vector against river's vector — multiply pair by pair, add up, one similarity score. This is the tool from the vector-space lesson, about to become the engine of attention.",
    },
    note: "Dot product: two vectors in → one similarity number out.",
  },
  {
    id: "raw-row",
    codeLines: [9],
    scene: "raw-row",
    terms: ["dot-product"],
    narration: {
      id: "raw-row",
      text: "Now dot bank's embedding against every word in the sentence — five scores. We could already use them as mixing weights and blend the neighbours into 'bank'. That is attention in its rawest form, built from nothing but embeddings and dot products.",
    },
    note: "bank · every word = a row of raw relevance scores.",
  },
  {
    id: "raw-problem",
    codeLines: [8, 9],
    scene: "raw-problem",
    terms: ["embedding", "dot-product"],
    narration: {
      id: "raw-problem",
      text: "But one embedding is not enough. The same vector must ask the question, advertise the answer, and hand over its content — three different jobs. Worse: x times x-transpose is symmetric, and there is nothing here the model can learn. We need to transform the embedding.",
    },
    note: "One vector, three jobs — and x·xᵀ is symmetric with nothing to learn.",
  },
  {
    id: "projections",
    codeLines: [11, 12, 13],
    scene: "projections",
    terms: ["linear-layer"],
    narration: {
      id: "projections",
      text: "Enter the weight matrices. The model learns three of them — Wq, Wk, Wv. One embedding goes in, three specialised views come out. And the same three matrices are shared by every token: the model learns one way of asking, one way of advertising, one way of giving.",
    },
    note: "One shared Wq, Wk, Wv for all tokens — learned during training.",
  },
  {
    id: "qkv",
    codeLines: [15, 16, 17],
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
    codeLines: [19],
    scene: "scores",
    terms: ["dot-product", "query", "key"],
    narration: {
      id: "scores",
      text: "Same dot product as before — but now between queries and keys instead of raw embeddings. Every query dotted with every key gives a 5-by-5 score matrix, and it is no longer symmetric: 'bank looking at river' can differ from 'river looking at bank'.",
    },
    note: "Q @ K.T → n×n scores — learned, and no longer symmetric.",
  },
  {
    id: "scale",
    codeLines: [20],
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
    codeLines: [22],
    scene: "softmax",
    terms: ["softmax", "attention-weights"],
    narration: {
      id: "softmax",
      text: "Softmax turns each row of raw scores into positive weights that sum to one. Now row 'bank' literally reads as a recipe: take 62% of river, 12% of bank, 10% of the… These are the attention weights.",
    },
    note: "softmax(row) → attention weights, each row sums to 1.",
  },
  {
    id: "mix",
    codeLines: [24],
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
    codeLines: [19, 20, 22, 24],
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
      text: "Recap the journey: one embedding per word, dot products for similarity, a row of raw scores — then the upgrade: learned Wq, Wk, Wv give each word a query, key, and value, scores get scaled and softmaxed, and values are mixed into contextual embeddings.",
    },
    note: "embed → raw dots (idea) → Q/K/V (learnable) → scale → softmax → mix.",
  },
];
