import type { LessonStep } from "../../types";

export const pyCode = `from transformers import AutoTokenizer
import torch

text = "the bank of the river"

tok = AutoTokenizer.from_pretrained("gpt2")
ids = tok.encode(text)          # [262, 3331, 286, 262, 7850]

vocab_size, d = 50257, 768
E = torch.nn.Embedding(vocab_size, d)

x = E(torch.tensor(ids))        # (5, 768) one row per token

# where do E's numbers come from? learned:
#   word2vec / GloVe  (train on word co-occurrence)
#   or end-to-end inside the transformer itself`;

export type SceneState =
  | "text"
  | "tokens"
  | "ids"
  | "table"
  | "lookup"
  | "learned"
  | "done";

export interface WordsToVectorsStep extends LessonStep {
  scene: SceneState;
}

export const glossaryIds = [
  "token",
  "tokenizer",
  "vocabulary",
  "embedding",
  "embedding-table",
];

export const steps: WordsToVectorsStep[] = [
  {
    id: "intro",
    codeLines: [4],
    scene: "text",
    terms: [],
    narration: {
      id: "intro",
      text: "A neural network cannot read. It only computes with numbers — adding, multiplying, comparing them. So before a model can do anything with 'the bank of the river', we need a pipeline that turns text into numbers without losing the meaning. That pipeline is the very first layer of every language model.",
    },
    note: "Models compute with numbers, not letters — text must become numbers.",
  },
  {
    id: "tokenize",
    codeLines: [6],
    scene: "tokens",
    terms: ["token", "tokenizer"],
    narration: {
      id: "tokenize",
      text: "Step one: split the text into tokens. A tokenizer chops the sentence into pieces from a fixed menu — common words stay whole, rare words get split into fragments, so 'riverbed' might become 'river' plus 'bed'. Our sentence becomes five tokens.",
    },
    note: "Tokenizer splits text into pieces from a fixed menu of tokens.",
  },
  {
    id: "ids",
    codeLines: [7],
    scene: "ids",
    terms: ["tokenizer", "vocabulary"],
    narration: {
      id: "ids",
      text: "Step two: each token gets an ID — its row number in the vocabulary, the model's dictionary of every token it knows. Notice both occurrences of 'the' get the same ID, 262. The sentence is now a list of integers. Numbers at last — but a bare ID carries no meaning: 3331 is not 'more' than 262.",
    },
    note: "token → vocabulary ID (row number). Same word, same ID.",
  },
  {
    id: "table",
    codeLines: [9, 10],
    scene: "table",
    terms: ["embedding-table", "embedding"],
    narration: {
      id: "table",
      text: "To give IDs meaning, the model keeps an embedding table: a giant matrix with one row for every token in the vocabulary — 50,257 rows for GPT-2, each row 768 numbers long. Each row is that token's embedding: its meaning, written as a vector.",
    },
    note: "Embedding table: one learned row of numbers per vocabulary token.",
  },
  {
    id: "lookup",
    codeLines: [12],
    scene: "lookup",
    terms: ["embedding", "embedding-table"],
    narration: {
      id: "lookup",
      text: "Step three is just a lookup — no math. ID 3331 means: read row 3331. Five IDs pick five rows, and the sentence is now a small matrix: one embedding vector per token. This is exactly what x equals embed of tokens meant in the attention formula.",
    },
    note: "Embedding = table lookup: ID picks a row, row is the vector.",
  },
  {
    id: "learned",
    codeLines: [14, 15, 16],
    scene: "learned",
    terms: ["embedding-table"],
    narration: {
      id: "learned",
      text: "Where do the numbers in the table come from? Nobody writes them by hand. They start random and get learned: classic models like word2vec and GloVe trained them by predicting neighbouring words, so words used in similar contexts got similar vectors. Modern transformers learn the table end-to-end, as part of the whole network.",
    },
    note: "Rows start random, get learned — word2vec/GloVe or end-to-end.",
  },
  {
    id: "summary",
    codeLines: [],
    scene: "done",
    terms: ["token", "vocabulary", "embedding"],
    narration: {
      id: "summary",
      text: "The full pipeline: text is split into tokens, tokens become vocabulary IDs, IDs look up learned rows in the embedding table, and out comes one meaning-vector per token. Next lesson: what these vectors look like in space, and how to measure whether two of them are close.",
    },
    note: "text → tokens → IDs → table lookup → one vector per token.",
  },
];
