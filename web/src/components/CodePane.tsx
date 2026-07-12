interface CodePaneProps {
  code: string;
  highlightedLines: number[];
}

export function CodePane({ code, highlightedLines }: CodePaneProps) {
  const lines = code.split("\n");
  return (
    <div className="code-pane">
      <div className="pane-title">program.c</div>
      <pre>
        {lines.map((line, i) => {
          const lineNo = i + 1;
          const active = highlightedLines.includes(lineNo);
          return (
            <div key={lineNo} className={`code-line${active ? " active" : ""}`}>
              <span className="line-no">{lineNo}</span>
              <span>{line || " "}</span>
            </div>
          );
        })}
      </pre>
    </div>
  );
}
