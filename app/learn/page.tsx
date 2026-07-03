"use client";
import Link from "next/link";

const PATHS = [
  {
    title: "Electrical Fundamentals",
    icon: "🔋",
    color: "var(--core)",
    level: "Beginner",
    modules: 8,
    hours: 6,
    desc: "Voltage, current, resistance, power, and circuit theory from first principles. Start here.",
    topics: ["Atoms and electrons", "Ohm's Law", "Series & parallel circuits", "Kirchhoff's laws", "AC vs DC", "Power and energy", "Capacitors & inductors", "Basic measurements"],
  },
  {
    title: "Domestic Wiring",
    icon: "🏠",
    color: "#34D399",
    level: "Beginner",
    modules: 10,
    hours: 8,
    desc: "Fixed wiring installation for houses and apartments. Ring circuits, radials, lighting, and earthing.",
    topics: ["Consumer units", "Ring final circuits", "Radial circuits", "Lighting circuits", "Earthing arrangements", "Bonding requirements", "Socket and switch wiring", "Fault finding in domestic installations"],
  },
  {
    title: "Protection & Fault Analysis",
    icon: "🛡️",
    color: "#FF6B35",
    level: "Intermediate",
    modules: 7,
    hours: 5,
    desc: "Overcurrent protection, RCDs, fault loop impedance, and discrimination between protective devices.",
    topics: ["Fuses vs MCBs vs RCBOs", "Zs and Ze measurements", "Fault loop impedance", "Prospective fault current", "RCD tripping times", "Selectivity and discrimination", "Arc fault detection"],
  },
  {
    title: "Three-Phase Systems",
    icon: "⚙️",
    color: "#A855F7",
    level: "Intermediate",
    modules: 9,
    hours: 7,
    desc: "Three-phase supply, balanced and unbalanced loads, motors, and industrial power distribution.",
    topics: ["Star and delta connections", "Line vs phase voltage/current", "Balanced load calculations", "Unbalanced loads and neutral", "Three-phase motors", "Starter circuits (DOL, star-delta)", "Power in three-phase", "Metering and instrumentation"],
  },
  {
    title: "Cable Sizing & Installation",
    icon: "🔌",
    color: "#00D4FF",
    level: "Advanced",
    modules: 6,
    hours: 5,
    desc: "Cable current-carrying capacity, derating factors, voltage drop calculations, and installation methods.",
    topics: ["Current-carrying capacity tables", "Thermal derating factors", "Grouping derating", "Thermal insulation derating", "Voltage drop limits and calculation", "Cable installation methods", "Armoured cables", "Busbar sizing"],
  },
];

const SINGLE_LESSONS = [
  { title: "How to Read a Wiring Diagram", level: "Beginner", mins: 12, icon: "📋" },
  { title: "Using a Multimeter Correctly", level: "Beginner", mins: 8, icon: "🔍" },
  { title: "Cable Colour Codes (AU/NZ, UK, EU, US)", level: "Beginner", mins: 6, icon: "🎨" },
  { title: "Understanding IP Ratings", level: "Beginner", mins: 5, icon: "💧" },
  { title: "Calculating Diversity in Consumer Units", level: "Intermediate", mins: 15, icon: "📊" },
  { title: "Motor Starting Methods Compared", level: "Intermediate", mins: 18, icon: "⚙️" },
  { title: "Earth Fault Loop Impedance Testing", level: "Intermediate", mins: 14, icon: "🧪" },
  { title: "PLC Basics for Electricians", level: "Advanced", mins: 22, icon: "💻" },
];

export default function LearnPage() {
  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <div className="nav-logo-mark">E</div>
          <span className="nav-logo-text">ElectraCore</span>
        </Link>
        <div className="nav-links">
          <Link href="/calculate" className="nav-link">Calculate</Link>
          <Link href="/guides" className="nav-link">Guides</Link>
          <Link href="/learn" className="nav-link" style={{ color: "var(--core)" }}>Learn</Link>
        </div>
        <Link href="/calculate" className="nav-cta">Open Calculator</Link>
      </nav>

      <main style={{ paddingTop: "80px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1.5rem 1.5rem" }}>
          <p className="section-label">Learning Paths</p>
          <h1 className="section-title">Learn Electrical Theory & Practice</h1>
          <p className="section-sub">
            Structured paths from fundamentals to advanced topics. Built for students, apprentices, and engineers who want to understand — not just memorise.
          </p>
        </div>

        {/* LEARNING PATHS */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem 3rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%,500px),1fr))", gap: "1.25rem" }}>
            {PATHS.map((path, i) => (
              <div key={i} className="feature-card" style={{ padding: "2rem", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1.25rem" }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                    background: `${path.color}1A`, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.5rem",
                  }}>{path.icon}</div>
                  <div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.25rem" }}>{path.title}</div>
                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                      <span className={`guide-tag tag-${path.level.toLowerCase()}`}>{path.level}</span>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>{path.modules} modules · {path.hours}h</span>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: "0.9rem", color: "var(--text-dim)", marginBottom: "1.25rem", lineHeight: 1.65 }}>{path.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginBottom: "1.5rem" }}>
                  {path.topics.map((t, j) => (
                    <span key={j} style={{
                      padding: "2px 10px", borderRadius: 100,
                      fontSize: "0.75rem", background: "var(--bg3)", color: "var(--text-dim)",
                      border: "1px solid var(--border)",
                    }}>{t}</span>
                  ))}
                </div>
                <button className="btn-primary" style={{ padding: "0.625rem 1.25rem", fontSize: "0.875rem" }}>
                  Start Path →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK LESSONS */}
        <div style={{ background: "var(--bg2)", padding: "4rem 1.5rem", borderTop: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <p className="section-label">Quick Lessons</p>
            <h2 className="section-title">Pick up something specific.</h2>
            <p className="section-sub">Short focused lessons under 25 minutes. Useful when you need one answer, not an entire course.</p>
            <div className="learn-path">
              {SINGLE_LESSONS.map((lesson, i) => (
                <div key={i} className="learn-item">
                  <div className="learn-num">{lesson.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div className="learn-item-title">{lesson.title}</div>
                    <div className="learn-item-sub">{lesson.level} · {lesson.mins} min read</div>
                  </div>
                  <span className="learn-badge">{lesson.mins} min</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid var(--border)", padding: "3rem 1.5rem" }}>
        <div className="footer">
          <div className="footer-copy">ElectraCore · Built by Brian Josiah</div>
          <a href="https://josiah.rawsignal.dev" target="_blank" rel="noopener" className="footer-link">← Back to Portfolio</a>
        </div>
      </footer>
    </>
  );
}
