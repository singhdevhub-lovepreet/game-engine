export type TokenType =
  | "keyword"
  | "type"
  | "string"
  | "comment"
  | "number"
  | "function"
  | "preprocessor"
  | "punctuation"
  | "plain";

export interface Token {
  type: TokenType;
  value: string;
}

const KEYWORDS = new Set([
  "return", "if", "else", "for", "while", "do", "switch", "case", "break",
  "continue", "sizeof", "struct", "typedef", "enum", "union", "static",
  "const", "extern", "goto", "default",
]);

const TYPES = new Set([
  "int", "char", "void", "long", "short", "float", "double", "unsigned",
  "signed", "size_t", "ssize_t", "pid_t", "off_t", "bool",
]);

const PATTERN =
  /(\/\/.*|\/\*[\s\S]*?\*\/)|(#\s*\w+(?:\s*<[^>]*>)?)|("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?[uUlLfF]*\b)|([A-Za-z_]\w*)|(\s+)|(.)/g;

export function tokenizeC(line: string): Token[] {
  const tokens: Token[] = [];
  for (const m of line.matchAll(PATTERN)) {
    const [, comment, prep, dstr, sstr, num, word, ws, other] = m;
    if (comment !== undefined) tokens.push({ type: "comment", value: comment });
    else if (prep !== undefined) tokens.push({ type: "preprocessor", value: prep });
    else if (dstr !== undefined || sstr !== undefined)
      tokens.push({ type: "string", value: (dstr ?? sstr)! });
    else if (num !== undefined) tokens.push({ type: "number", value: num });
    else if (word !== undefined) {
      const rest = line.slice(m.index! + word.length);
      const type: TokenType = KEYWORDS.has(word)
        ? "keyword"
        : TYPES.has(word)
          ? "type"
          : /^\s*\(/.test(rest)
            ? "function"
            : "plain";
      tokens.push({ type, value: word });
    } else if (ws !== undefined) tokens.push({ type: "plain", value: ws });
    else tokens.push({ type: "punctuation", value: other! });
  }
  return tokens;
}
