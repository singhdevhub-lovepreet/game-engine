import { motion } from "framer-motion";
import "./Landing.css";
import osInterrupts from "../assets/landing/os-interrupts.png";
import osKernel from "../assets/landing/os-kernel.png";
import tfAttention from "../assets/landing/tf-attention.png";
import tfWords from "../assets/landing/tf-words.png";

interface LandingProps {
  onEnter: () => void;
}

function FeatureIcon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const FEATURES = [
  {
    image: osKernel,
    kicker: "watch it happen",
    title: "Animated diagrams",
    text: "Systems drawn live, frame by frame — every animation step synced to the exact line of code that causes it.",
  },
  {
    image: tfAttention,
    kicker: "code that teaches",
    title: "Synced code",
    text: "Real code on the left, what it builds on the right. The highlighted line is always the one you are watching.",
  },
  {
    image: tfWords,
    kicker: "no leaps of faith",
    title: "First-principles steps",
    text: "No jumping ahead. Every concept is rebuilt from its smallest idea, one small step at a time.",
  },
  {
    image: osInterrupts,
    kicker: "quick notes & jargon decoder",
    title: "Every term explained",
    text: "Short notes track each step, and every abbreviation is one click away from a plain-English definition.",
  },
];

const SKILLS = [
  {
    title: "First Principles",
    text: "Every topic starts at its smallest idea and is rebuilt step by step — no leaps of faith.",
    icon: "M12 3v18M5 10l7-7 7 7",
  },
  {
    title: "Intuition",
    text: "You don't memorize diagrams. You watch them happen, so you can re-derive them.",
    icon: "M12 5a7 7 0 017 7c0 3-2 4.5-2 7h-10c0-2.5-2-4-2-7a7 7 0 017-7z",
  },
  {
    title: "Animations",
    text: "Concepts drawn live, frame by frame, synced to the exact line of code that causes them.",
    icon: "M6 4l14 8-14 8V4z",
  },
  {
    title: "Interview Questions",
    text: "Quickfire Q&A at the end of every section turns understanding into interview-ready answers.",
    icon: "M4 5h16v10H9l-5 4V5zM9 9h6",
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
          Computer science taught the way you actually understand it — one
          small visual step at a time, with the code that makes it real.
          Operating systems and transformers are just the first on the plate.
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
        <div className="skill-grid">
          {SKILLS.map((s, i) => (
            <motion.div
              key={s.title}
              className="skill-item"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: (i % 2) * 0.12 }}
            >
              <span className="skill-ghost">0{i + 1}</span>
              <span className="skill-badge">
                <FeatureIcon d={s.icon} />
              </span>
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
        <span className="footer-brand">
          thinkit<em>.club</em>
        </span>
      </footer>
    </div>
  );
}
