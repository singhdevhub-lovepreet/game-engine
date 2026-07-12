import { tokenizeC, tokenizePython } from "./highlight";

interface CodePaneProps {
  code: string;
  highlightedLines: number[];
  language?: "c" | "python";
  title?: string;
}

export function CodePane({
  code,
  highlightedLines,
  language = "c",
  title,
}: CodePaneProps) {
  const lines = code.split("\n");
  const tokenize = language === "python" ? tokenizePython : tokenizeC;
  return (
    <div className="code-pane">
      <div className="pane-title">{title ?? (language === "python" ? "attention.py" : "program.c")}</div>
      <pre>
        {lines.map((line, i) => {
          const lineNo = i + 1;
          const active = highlightedLines.includes(lineNo);
          return (
            <div key={lineNo} className={`code-line${active ? " active" : ""}`}>
              <span className="line-no">{lineNo}</span>
              <span>
                {tokenize(line).map((t, j) => (
                  <span key={j} className={`tok-${t.type}`}>
                    {t.value}
                  </span>
                ))}
                {line === "" && " "}
              </span>
            </div>
          );
        })}
      </pre>
    </div>
  );
}
