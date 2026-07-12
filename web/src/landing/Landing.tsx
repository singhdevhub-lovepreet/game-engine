import { motion } from "framer-motion";
import "./Landing.css";
import osInterrupts from "../assets/landing/os-interrupts.png";
import osKernel from "../assets/landing/os-kernel.png";
import tfAttention from "../assets/landing/tf-attention.png";
import tfWords from "../assets/landing/tf-words.png";

interface LandingProps {
  onEnter: () => void;
}

const FEATURES = [
  {
    image: osKernel,
    kicker: "animated system diagrams",
    title: "Kernel vs. User Space",
    text: "Privilege rings, syscall boundaries and interrupts drawn live — every frame synced to the line of C that causes it.",
  },
  {
    image: tfAttention,
    kicker: "synced code highlighting",
    title: "Self-Attention, step by step",
    text: "PyTorch on the left, the matrices it builds on the right. Watch softmax turn raw scores into attention weights.",
  },
  {
    image: tfWords,
    kicker: "true first principles",
    title: "Words → Vectors",
    text: "No jumping ahead. Tokens, IDs and embedding lookups come before a single attention formula appears.",
  },
  {
    image: osInterrupts,
    kicker: "jargon decoder",
    title: "Every term explained",
    text: "IRQ, APIC, IDT, softmax — every abbreviation is one click away from a plain-English definition in the sidebar.",
  },
];

const SKILLS = [
  {
    title: "Operating Systems",
    text: "Kernels, syscalls, interrupts, scheduling, memory — the layer every interview digs into.",
  },
  {
    title: "Transformers",
    text: "Embeddings, attention, encoders and decoders — built up from the dot product.",
  },
  {
    title: "Systems Intuition",
    text: "You don't memorize diagrams. You watch them happen, so you can re-derive them.",
  },
  {
    title: "Interview Fluency",
    text: "Chapter recaps and quickfire Q&A turn every section into interview-ready answers.",
  },
];

export function Landing({ onEnter }: LandingProps) {
  return (
    <div className="landing">
      <header className="landing-nav">
        <span className="landing-logo">
          thinkit <em>club</em>
        </span>
        <button className="landing-cta small" onClick={onEnter}>
          Start learning →
        </button>
      </header>

      <section className="landing-hero">
        <motion.p
          className="landing-kicker"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          interactive lectures · animations · real code
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          cs from first principles
        </motion.h1>
        <motion.p
          className="landing-sub"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Operating systems and transformers taught the way you actually
          understand them — one small visual step at a time, with the code that
          makes it real.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <button className="landing-cta" onClick={onEnter}>
            Enter the club →
          </button>
        </motion.div>
      </section>

      <section className="landing-section">
        <p className="landing-section-kicker">from the lectures</p>
        <h2>Lessons that move</h2>
        <div className="feature-grid">
          {FEATURES.map((f, i) => (
            <motion.article
              key={f.title}
              className="feature-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.12 }}
            >
              <div className="feature-shot">
                <img src={f.image} alt={f.title} loading="lazy" />
              </div>
              <div className="feature-body">
                <p className="landing-section-kicker">{f.kicker}</p>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <p className="landing-section-kicker">what you walk away with</p>
        <h2>The skill stack</h2>
        <div className="skill-stage">
          {SKILLS.map((s, i) => (
            <motion.div
              key={s.title}
              className="skill-card"
              style={{ zIndex: i + 1, marginTop: i * 14 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ y: -14, transition: { duration: 0.25 } }}
            >
              <span className="skill-index">0{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="landing-final">
        <h2>Stop memorizing. Start deriving.</h2>
        <button className="landing-cta" onClick={onEnter}>
          Enter the club →
        </button>
      </section>

      <footer className="landing-footer">
        <span>
          created with <span className="heart">❤️</span> using{" "}
          <a href="https://devin.ai" target="_blank" rel="noreferrer">
            devin.ai
          </a>
        </span>
        <a
          className="cognition-mark"
          href="https://cognition.ai"
          target="_blank"
          rel="noreferrer"
          aria-label="Cognition"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <g
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            >
              <line x1="12" y1="2.5" x2="12" y2="21.5" />
              <line x1="3.8" y1="7.3" x2="20.2" y2="16.7" />
              <line x1="20.2" y1="7.3" x2="3.8" y2="16.7" />
            </g>
          </svg>
          <span>Cognition</span>
        </a>
      </footer>
    </div>
  );
}
