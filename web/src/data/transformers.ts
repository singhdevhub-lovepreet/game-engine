import type { Chapter } from "../types";

/**
 * Transformers-from-first-principles roadmap. Chapter order follows the
 * source notes column by column, top to bottom.
 */
export const transformerChapters: Chapter[] = [
  {
    id: "attention",
    number: 1,
    title: "Attention",
    crucial: true,
    lessons: [
      {
        id: "self-attention",
        title: "Self-Attention",
        description:
          "Queries, keys, values — how a word borrows meaning from its neighbours.",
        status: "available",
      },
      {
        id: "multi-head-attention",
        title: "Multi-Head Attention",
        description: "Many attention heads, each looking for something different.",
        status: "coming-soon",
      },
      {
        id: "attention-is-all-you-need",
        title: "Attention Is All You Need",
        description: "The full architecture from the 2017 paper, block by block.",
        status: "coming-soon",
      },
      {
        id: "encoder-block",
        title: "The Encoder Block & Residuals",
        description: "Stacking attention, feed-forward layers, and skip connections.",
        status: "coming-soon",
      },
      {
        id: "masked-self-attention",
        title: "Masked Self-Attention",
        description: "Hiding future tokens so the decoder cannot cheat.",
        status: "coming-soon",
      },
      {
        id: "parallel-training",
        title: "Parallel (Non-Autoregressive) Training",
        description: "Masking lets us train on every position at once.",
        status: "coming-soon",
      },
    ],
  },
  {
    id: "positions-and-cross-attention",
    number: 2,
    title: "Positions & Cross Attention",
    lessons: [
      {
        id: "positional-encodings",
        title: "Positional Encodings",
        description: "sin/cos pairs that tell attention where each token sits.",
        status: "coming-soon",
      },
      {
        id: "cross-attention",
        title: "Cross Attention",
        description: "Queries from the decoder, keys and values from the encoder.",
        status: "coming-soon",
      },
      {
        id: "decoder-architecture",
        title: "Decoder Architecture",
        description: "Right-shift, masked attention, cross attention, stack of blocks.",
        status: "coming-soon",
      },
    ],
  },
  {
    id: "norms-and-inference",
    number: 3,
    title: "Normalization & Inference",
    lessons: [
      {
        id: "layer-vs-batch-norm",
        title: "Layer Norm vs. Batch Norm",
        description: "Why padding zeros break batch norm in sequence models.",
        status: "coming-soon",
      },
      {
        id: "positional-linearity",
        title: "Linearity of Positional Encodings",
        description: "Why sin/cos encodings support linear offset transforms.",
        status: "coming-soon",
      },
      {
        id: "output-block-inference",
        title: "Output Block & Autoregressive Inference",
        description: "Vocabulary-sized softmax and generating one token at a time.",
        status: "coming-soon",
      },
    ],
  },
];
