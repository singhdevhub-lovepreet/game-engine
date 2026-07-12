import type { LessonStep } from "../../types";

export const pyCode = `import torch
import torch.nn.functional as F

x = embed(tokens)                 # (5, 512) d_model = 512

# one head = one mixing recipe per token
single = attention(x)             # all 512 dims, one blend

h = 8                             # number of heads
d_k = d_model // h                # 512 / 8 = 64 dims each

Wq = [Linear(d_model, d_k) for _ in range(h)]
Wk = [Linear(d_model, d_k) for _ in range(h)]
Wv = [Linear(d_model, d_k) for _ in range(h)]

heads = []
for i in range(h):                # same recipe, h times
    Q, K, V = Wq[i](x), Wk[i](x), Wv[i](x)
    A = F.softmax(Q @ K.T / d_k**0.5, dim=-1)
    heads.append(A @ V)           # (5, 64) per head

cat = torch.cat(heads, dim=-1)    # (5, 512) side by side

Wo = Linear(d_model, d_model)
out = Wo(cat)                     # heads exchange notes`;

export type SceneState =
  | "recap"
  | "problem"
  | "many-heads"
  | "split"
  | "head-qkv"
  | "run-heads"
  | "head-views"
  | "concat"
  | "wo"
  | "formula"
  | "done";

export interface MultiHeadStep extends LessonStep {
  scene: SceneState;
}

/** Terms surfaced in this lesson's jargon decoder, in teaching order. */
export const glossaryIds = [
  "contextual-embedding",
  "attention-weights",
  "attention-head",
  "d-model",
  "linear-layer",
  "concat",
  "output-projection",
  "multi-head-attention",
];

export const steps: MultiHeadStep[] = [
  {
    id: "recap",
    codeLines: [4, 7],
    scene: "recap",
    terms: ["contextual-embedding"],
    narration: {
      id: "recap",
      text: "Last lesson: self-attention gave every word one contextual embedding — softmax turned bank's scores into one row of weights, and bank's output became 62% river. One softmax row is one mixing recipe. Keep that picture; this lesson asks whether one recipe is enough.",
    },
    note: "Recap: one softmax row = one mixing recipe per token.",
  },
  {
    id: "problem",
    codeLines: [6, 7],
    scene: "problem",
    terms: ["attention-weights"],
    narration: {
      id: "problem",
      text: "But 'bank' needs two different things at once. Meaning: which sense of bank? Look at 'river'. Grammar: what does this noun attach to? Look at 'of'. One softmax row must average both jobs into a single blend — each signal muddies the other. One head, one relationship at a time.",
    },
    note: "One row must average meaning AND grammar — signals muddy each other.",
  },
  {
    id: "many-heads",
    codeLines: [9],
    scene: "many-heads",
    terms: ["attention-head"],
    narration: {
      id: "many-heads",
      text: "The fix is beautifully simple: run the same attention mechanism several times in parallel, each copy with its own learned weight matrices. Each copy is called a head. During training every head is free to specialise — one on word sense, one on grammar, one on nearby words…",
    },
    note: "Run attention h times in parallel — each copy is a 'head'.",
  },
  {
    id: "split",
    codeLines: [9, 10],
    scene: "split",
    terms: ["d-model", "attention-head"],
    narration: {
      id: "split",
      text: "Eight full-size heads would cost eight times the compute. Instead, the 512 dimensions of the embedding are split: with 8 heads, each head works in its own 64-dimensional slice — d k equals d model over h. Drag the slider: more heads, thinner slices. Total work stays the same.",
    },
    note: "d_k = d_model / h — heads share the dims, total compute unchanged.",
  },
  {
    id: "head-qkv",
    codeLines: [12, 13, 14],
    scene: "head-qkv",
    terms: ["linear-layer"],
    narration: {
      id: "head-qkv",
      text: "Each head gets its own private Wq, Wk, Wv — projecting the full 512-dimensional embedding down to its 64-dimensional world. Head 2's matrices are completely different parameters from head 5's. That independence is what lets the heads learn to look for different things.",
    },
    note: "Every head owns a private Wq/Wk/Wv: 512 → 64 each.",
  },
  {
    id: "run-heads",
    codeLines: [17, 18, 19, 20],
    scene: "run-heads",
    terms: ["attention-head"],
    narration: {
      id: "run-heads",
      text: "Now every head runs the exact formula from last lesson, independently and in parallel: its own queries dot its own keys, scale by root d k, softmax, mix its own values. Nothing new — just the same machine, eight small copies, each producing a 5-by-64 output.",
    },
    note: "Each head: softmax(QKᵀ/√dₖ)V — same formula, private weights.",
  },
  {
    id: "head-views",
    codeLines: [19],
    scene: "head-views",
    terms: ["attention-weights"],
    narration: {
      id: "head-views",
      text: "Look at what two trained heads actually learn. Head 2's weights: bank leans 62% on river — word sense. Head 5's weights: bank leans 51% on 'of' — grammar structure. Same sentence, two completely different attention maps. Hover the cells to inspect the exact weights.",
    },
    note: "Head 2: bank→river 0.62 (meaning) · Head 5: bank→of 0.51 (grammar).",
  },
  {
    id: "concat",
    codeLines: [22],
    scene: "concat",
    terms: ["concat"],
    narration: {
      id: "concat",
      text: "Each head hands back a 64-dimensional answer per token. Concatenate them — glue the eight slices side by side — and every token is back to one 512-dimensional vector. So far the heads' findings just sit next to each other, like eight specialists' notes stapled together.",
    },
    note: "concat: 8 × 64 slices glued back into one 512-dim vector.",
  },
  {
    id: "wo",
    codeLines: [24, 25],
    scene: "wo",
    terms: ["output-projection"],
    narration: {
      id: "wo",
      text: "One last learned matrix, Wo, mixes the stapled notes into a single coherent answer. It can weigh head 2's meaning-signal against head 5's grammar-signal, combine them, or mute a head entirely. Without Wo the slices would never talk to each other.",
    },
    note: "Wo: learned 512×512 mix — lets the heads' findings interact.",
  },
  {
    id: "formula",
    codeLines: [22, 24, 25],
    scene: "formula",
    terms: ["multi-head-attention"],
    narration: {
      id: "formula",
      text: "The whole mechanism in one line: MultiHead(Q,K,V) = Concat(head₁ … head₈) · Wo, where each head is the attention formula you already know in its own 64-dimensional slice. Same total compute as one big head — but eight different relationships captured at once.",
    },
    note: "MultiHead = Concat(head₁…head₈)·Wo — same cost, richer view.",
  },
  {
    id: "summary",
    codeLines: [],
    scene: "done",
    terms: ["multi-head-attention", "attention-head"],
    narration: {
      id: "summary",
      text: "Recap the chain: one softmax row is one recipe → bank needs meaning and grammar at once → split 512 dims into 8 heads of 64 → each head runs attention with private Wq/Wk/Wv → concat the slices → Wo blends them. Next: stacking this into the full transformer block.",
    },
    note: "one recipe → problem → split into heads → run → concat → Wo.",
  },
];
