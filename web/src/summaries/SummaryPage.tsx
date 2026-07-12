import type { Language } from "../types";
import type { ChapterSummary, SummaryFigure } from "./types";

const VIOLET = "rgba(139, 92, 246, 0.55)";
const AMBER = "rgba(245, 158, 11, 0.55)";

function RingsFigure() {
  return (
    <svg viewBox="0 0 360 150" className="summary-figure-svg">
      <rect x={20} y={14} width={320} height={54} rx={8} className="space" stroke={VIOLET} />
      <text x={34} y={32} className="tiny-label" fill={VIOLET}>
        USER · RING 3
      </text>
      <rect x={40} y={38} width={80} height={22} rx={6} className="node-box" />
      <text x={80} y={53} textAnchor="middle" className="tiny-label" fill="var(--text-secondary)">
        editor
      </text>
      <rect x={140} y={38} width={80} height={22} rx={6} className="node-box" />
      <text x={180} y={53} textAnchor="middle" className="tiny-label" fill="var(--text-secondary)">
        browser
      </text>
      <rect x={240} y={38} width={80} height={22} rx={6} className="node-box" />
      <text x={280} y={53} textAnchor="middle" className="tiny-label" fill="var(--text-secondary)">
        shell
      </text>
      <line x1={20} y1={78} x2={340} y2={78} className="dma-line" opacity={0.6} />
      <text x={180} y={74} textAnchor="middle" className="tiny-label" opacity={0.8}>
        traps only: syscalls · interrupts
      </text>
      <rect x={20} y={88} width={320} height={40} rx={8} className="space" stroke={AMBER} />
      <text x={34} y={106} className="tiny-label" fill={AMBER}>
        KERNEL · RING 0
      </text>
      <text x={180} y={120} textAnchor="middle" className="tiny-label" fill="var(--text-secondary)">
        scheduler · memory · drivers · file system
      </text>
      <text x={180} y={144} textAnchor="middle" className="tiny-label" opacity={0.7}>
        hardware
      </text>
    </svg>
  );
}

function PathFigure({ stops, color }: { stops: string[]; color: string }) {
  const w = 360;
  const step = (w - 40) / (stops.length - 1);
  return (
    <svg viewBox={`0 0 ${w} 70`} className="summary-figure-svg">
      <line x1={20} y1={28} x2={w - 20} y2={28} className="dma-line" opacity={0.5} />
      {stops.map((s, i) => (
        <g key={s}>
          <circle cx={20 + i * step} cy={28} r={4} fill={color} />
          <text
            x={20 + i * step}
            y={i % 2 === 0 ? 16 : 48}
            textAnchor="middle"
            className="tiny-label"
            fill="var(--text-secondary)"
          >
            {s}
          </text>
        </g>
      ))}
    </svg>
  );
}

function MonoVsMicroFigure() {
  return (
    <svg viewBox="0 0 360 130" className="summary-figure-svg">
      <rect x={20} y={14} width={150} height={100} rx={8} className="space" stroke={AMBER} />
      <text x={95} y={30} textAnchor="middle" className="tiny-label" fill={AMBER}>
        MONOLITHIC
      </text>
      <text x={95} y={52} textAnchor="middle" className="tiny-label" fill="var(--text-secondary)">
        app
      </text>
      <line x1={40} y1={60} x2={150} y2={60} className="dma-line" opacity={0.6} />
      <text x={95} y={78} textAnchor="middle" className="tiny-label" fill="var(--text-secondary)">
        FS · net · drivers
      </text>
      <text x={95} y={96} textAnchor="middle" className="tiny-label" fill="var(--text-secondary)">
        sched · memory
      </text>
      <rect x={190} y={14} width={150} height={100} rx={8} className="space" stroke={VIOLET} />
      <text x={265} y={30} textAnchor="middle" className="tiny-label" fill={VIOLET}>
        MICROKERNEL
      </text>
      <text x={265} y={52} textAnchor="middle" className="tiny-label" fill="var(--text-secondary)">
        app · FS server · driver server
      </text>
      <line x1={210} y1={78} x2={320} y2={78} className="dma-line" opacity={0.6} />
      <text x={265} y={96} textAnchor="middle" className="tiny-label" fill="var(--text-secondary)">
        IPC · sched · memory
      </text>
    </svg>
  );
}

function Figure({ figure, language }: { figure: SummaryFigure; language: Language }) {
  return (
    <figure className="summary-figure">
      {figure.kind === "rings" && <RingsFigure />}
      {figure.kind === "syscall-path" && (
        <PathFigure
          stops={["read()", "trap", "table", "sys_read", "return"]}
          color={VIOLET}
        />
      )}
      {figure.kind === "interrupt-path" && (
        <PathFigure
          stops={["device", "IRQ", "APIC", "IDT", "handler", "EOI", "iret"]}
          color={AMBER}
        />
      )}
      {figure.kind === "mono-vs-micro" && <MonoVsMicroFigure />}
      <figcaption>{figure.caption[language]}</figcaption>
    </figure>
  );
}

interface SummaryPageProps {
  summary: ChapterSummary;
  language: Language;
}

export function SummaryPage({ summary, language }: SummaryPageProps) {
  return (
    <div className="lesson summary-page">
      <header className="lesson-header">
        <div>
          <h2>{summary.title[language]}</h2>
          <p>Blog-style recap · read before the next chapter</p>
        </div>
      </header>
      <article className="summary-article">
        <p className="summary-intro">{summary.intro[language]}</p>
        {summary.sections.map((section) => (
          <section key={section.id}>
            <h3>{section.heading[language]}</h3>
            {section.body.map((p, i) => (
              <p key={i}>{p[language]}</p>
            ))}
            {section.figure && <Figure figure={section.figure} language={language} />}
            {section.bullets && (
              <ul className="summary-takeaways">
                {section.bullets.map((b, i) => (
                  <li key={i}>{b[language]}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
        <section>
          <h3>{language === "en" ? "Interview quickfire" : "Interview quickfire"}</h3>
          <dl className="summary-quickfire">
            {summary.quickfire.map((item, i) => (
              <div key={i}>
                <dt>{item.q[language]}</dt>
                <dd>{item.a[language]}</dd>
              </div>
            ))}
          </dl>
        </section>
      </article>
    </div>
  );
}
