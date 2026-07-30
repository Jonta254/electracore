"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ElectraCoreLogoMark } from "./components/Logo";

const NAV_LINKS = [
  { label: "Design", href: "/design" },
  { label: "Calculate", href: "/calculate" },
  { label: "Guides", href: "/guides" },
  { label: "Learn", href: "/learn" },
];

const FEATURES = [
  {
    icon: "⚡",
    color: "rgba(240,165,0,0.15)",
    title: "Electrical Calculators",
    desc: "Ohm's law, voltage drop, cable sizing, power factor, LED resistor, series/parallel resistance — instant results with unit explanations.",
  },
  {
    icon: "🔌",
    color: "rgba(0,212,255,0.12)",
    title: "Wiring Connection Guides",
    desc: "Step-by-step guides for domestic, commercial, and industrial wiring. Colour codes, termination diagrams, and safety callouts included.",
  },
  {
    icon: "📐",
    color: "rgba(52,211,153,0.12)",
    title: "Load Analysis & Cable Sizing",
    desc: "Calculate current demand, size circuits correctly, and check for overloads before you wire. Supports single-phase and three-phase.",
  },
  {
    icon: "🎓",
    color: "rgba(168,85,247,0.12)",
    title: "Structured Learning Paths",
    desc: "From basic circuit theory to advanced protection coordination. Built for students, apprentices, and engineers refreshing their knowledge.",
  },
  {
    icon: "🏗️",
    color: "rgba(240,165,0,0.12)",
    title: "Project Tools & Cost Estimation",
    desc: "Map your installation, create material takeoffs, and estimate costs with live pricing data. From single rooms to full commercial fits.",
  },
  {
    icon: "💼",
    color: "rgba(255,68,68,0.1)",
    title: "Job Billing & Client Portal",
    desc: "Quote jobs, log hours, raise invoices, and share client-facing project reports — without leaving the platform.",
  },
];

const METHOD = [
  {
    title: "Standard formulas, shown",
    desc: "Ohm's law, P = V·I, resistive networks, and cross-sectional sizing from conductor resistivity. Every calculator displays the equation it used — nothing is hidden or silently approximated.",
  },
  {
    title: "Limits flagged, not assumed",
    desc: "Voltage-drop results highlight the common 3% guideline. Always confirm the exact limit for your circuit type and standard — BS 7671, NEC, or the regulations that apply where you work.",
  },
  {
    title: "An aid, not a substitute",
    desc: "ElectraCore supports your working; it doesn't replace a qualified design or inspection. Verify every result against the wiring regulations for your installation before you rely on it.",
  },
];

const WHO = [
  { role: "Students", desc: "Learn circuit theory, pass exams, and build real understanding with worked examples and calculators that show their working." },
  { role: "Apprentices", desc: "Solve real on-site problems, look up colour codes and termination methods, and build skills between sign-offs." },
  { role: "Electricians", desc: "Calculate fast, quote accurately, and reference guides that speak the language of the tools — not the textbook." },
  { role: "Engineers", desc: "Load analysis, protection coordination, cable derating, and power factor correction for design and commissioning work." },
  { role: "Teachers", desc: "Reference material, worked examples, and calculation tools to demonstrate electrical principles in the classroom." },
];

export default function HomePage() {
  const revealRefs = useRef<HTMLElement[]>([]);
  const [activeWho, setActiveWho] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    revealRefs.current.forEach((el) => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const addReveal = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  return (
    <>
      {/* FLOATING CTA */}
      <a href="/calculate" className="float-cta" aria-label="Open calculators">
        ⚡ Open Calculators
      </a>

      {/* NAV */}
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <ElectraCoreLogoMark size={32} />
          <span className="nav-logo-text">ElectraCore</span>
        </Link>
        <div className="nav-links">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link">{l.label}</Link>
          ))}
        </div>
        <Link href="/calculate" className="nav-cta">Open Calculator</Link>
        <button
          className="nav-hamburger"
          style={{ display: "none", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 4 }}
          onClick={() => setMenuOpen(m => !m)}
          aria-label="Menu"
        >
          <span style={{ display: "block", width: 22, height: 2, background: "#F2F0FC", borderRadius: 2 }} />
          <span style={{ display: "block", width: 22, height: 2, background: "#F2F0FC", borderRadius: 2 }} />
          <span style={{ display: "block", width: 22, height: 2, background: "#F2F0FC", borderRadius: 2 }} />
        </button>
      </nav>

      {/* MOBILE NAV OVERLAY */}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, top: 64, zIndex: 800, background: "rgba(7,8,16,0.97)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2rem", padding: "2rem" }}>
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{ fontFamily: "inherit", fontSize: "2rem", fontWeight: 800, letterSpacing: "0.08em", color: "#F2F0FC", textDecoration: "none" }}>{l.label}</a>
          ))}
          <a href="/calculate" onClick={() => setMenuOpen(false)} style={{ background: "linear-gradient(135deg,#D4A843,#FFD700)", color: "#07080F", fontFamily: "inherit", fontWeight: 800, fontSize: "1rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: "1rem 2.5rem", borderRadius: 12, textDecoration: "none", marginTop: "0.5rem" }}>Open Calculators →</a>
        </div>
      )}

      {/* HERO */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-badge">
          <span>⚡</span> Built by an Electrician · 1 Year on Site
        </div>
        <h1 className="hero-title">
          Every <span className="accent">electrical</span> tool<br />
          you actually <span className="volt">need.</span>
        </h1>
        <p className="hero-sub">
          Calculators, wiring guides, learning paths, load analysis, and job billing — for students, engineers, apprentices, and trade workers. One platform, built from the job up.
        </p>
        <div className="hero-actions">
          <Link href="/calculate" className="btn-primary">Start Calculating →</Link>
          <Link href="/guides" className="btn-ghost">Browse Guides</Link>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-num">8</span>
            <span className="hero-stat-label">Calculators</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">15</span>
            <span className="hero-stat-label">Wiring Guides</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">9</span>
            <span className="hero-stat-label">Courses</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">Free</span>
            <span className="hero-stat-label">Core Tools</span>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ background: "var(--bg2)", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p className="section-label" ref={addReveal}>Platform</p>
          <h2 className="section-title reveal" ref={addReveal}>Everything the job demands.</h2>
          <p className="section-sub reveal" ref={addReveal}>
            Not a textbook. Not a single-purpose app. A full platform built from real, on-site work.
          </p>
          <div className="feature-grid">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="feature-card reveal"
                ref={addReveal}
                style={{ transitionDelay: `${i * 0.07}s` }}
              >
                <div className="feature-icon" style={{ background: f.color }}>{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="section">
        <p className="section-label reveal" ref={addReveal}>Who it's for</p>
        <h2 className="section-title reveal" ref={addReveal}>
          From classroom to<br />construction site.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>
          <div>
            {WHO.map((w, i) => (
              <button
                key={i}
                onClick={() => setActiveWho(i)}
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  padding: "1rem 1.25rem", borderRadius: "var(--radius-sm)",
                  background: activeWho === i ? "rgba(var(--core-rgb),0.1)" : "transparent",
                  border: `1px solid ${activeWho === i ? "rgba(var(--core-rgb),0.4)" : "transparent"}`,
                  color: activeWho === i ? "var(--text)" : "var(--text-dim)",
                  fontFamily: "inherit", fontSize: "1rem", fontWeight: activeWho === i ? 700 : 500,
                  cursor: "pointer", transition: "all 0.2s", marginBottom: "0.375rem",
                }}
              >
                {w.role}
              </button>
            ))}
          </div>
          <div
            style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "var(--radius)", padding: "2rem",
              minHeight: 140,
            }}
          >
            <div style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.75rem" }}>
              {WHO[activeWho].role}
            </div>
            <p style={{ color: "var(--text-dim)", lineHeight: 1.7, fontSize: "0.95rem" }}>
              {WHO[activeWho].desc}
            </p>
            <Link
              href={activeWho >= 3 ? "/calculate" : activeWho === 1 ? "/guides" : "/learn"}
              className="btn-primary"
              style={{ marginTop: "1.5rem", padding: "0.625rem 1.25rem", fontSize: "0.875rem" }}
            >
              Explore →
            </Link>
          </div>
        </div>
      </section>

      {/* ACCURACY & METHOD */}
      <section style={{ background: "var(--bg)", padding: "5rem 1.5rem", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p className="section-label reveal" ref={addReveal}>Accuracy &amp; method</p>
          <h2 className="section-title reveal" ref={addReveal}>Calculations you can check.</h2>
          <p className="section-sub reveal" ref={addReveal}>
            A professional tool earns trust by showing its working — not by hiding it. Here is exactly how ElectraCore treats every result.
          </p>
          <div className="feature-grid">
            {METHOD.map((m, i) => (
              <div key={i} className="feature-card reveal" ref={addReveal} style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="ec-testi-top" />
                <div className="feature-title" style={{ marginBottom: "0.5rem" }}>{m.title}</div>
                <div className="feature-desc">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CIRCUIT BANNER */}
      <div className="circuit-bg" style={{ padding: "4rem 1.5rem" }}>
        <div className="circuit-pattern" />
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <h2 className="reveal" ref={addReveal} style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "1rem" }}>
            Free to use. No account needed.
          </h2>
          <p className="reveal" ref={addReveal} style={{ color: "var(--text-dim)", fontSize: "1rem", marginBottom: "2rem", lineHeight: 1.7 }}>
            Every calculator and guide is open access. Create an account to save your calculations, track learning progress, and unlock Pro tools.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/calculate" className="btn-primary">Open Calculators</Link>
            <Link href="/learn" className="btn-ghost">Start Learning</Link>
          </div>
        </div>
      </div>

      {/* PRICING */}
      <section className="section">
        <p className="section-label reveal" ref={addReveal}>Pricing</p>
        <h2 className="section-title reveal" ref={addReveal}>Start free. Go Pro when it pays.</h2>
        <p className="section-sub reveal" ref={addReveal}>Core calculators and guides are free, forever.</p>
        <div className="price-grid">
          {[
            {
              tier: "Free", amount: "$0", period: "", desc: "The essentials, always available.",
              features: ["Ohm's law calculator", "Basic wiring guides", "Series/parallel resistance", "Community access"],
              cta: "Get Started", href: "/calculate", featured: false,
            },
            {
              tier: "Pro", amount: "$15", period: "/mo", desc: "For serious students and working electricians.",
              features: ["All 8 calculators", "Full guide library (15 guides)", "9 structured courses", "Calculation history & save", "PDF export"],
              cta: "Start Pro", href: "/calculate", featured: true,
            },
            {
              tier: "Business", amount: "$45", period: "/mo", desc: "Teams, firms, and training providers.",
              features: ["Everything in Pro", "Job billing & invoicing", "Client portal & reports", "Team accounts (up to 10)", "Priority support"],
              cta: "Contact Us", href: "mailto:hello@electracore.app", featured: false,
            },
          ].map((p, i) => (
            <div key={i} className={`price-card reveal ${p.featured ? "featured" : ""}`} ref={addReveal} style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className="price-tier">{p.tier}</div>
              <div className="price-amount">{p.amount}<span>{p.period}</span></div>
              <div className="price-desc">{p.desc}</div>
              <ul className="price-features">
                {p.features.map((f, j) => <li key={j}>{f}</li>)}
              </ul>
              <a href={p.href} className={p.featured ? "btn-primary" : "btn-ghost"} style={{ width: "100%", justifyContent: "center" }}>
                {p.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "3rem 1.5rem", marginTop: "2rem" }}>
        <div className="footer">
          <div>
            <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>ElectraCore</div>
            <div className="footer-copy">Built by Brian Josiah · Electrician & Developer</div>
          </div>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="footer-link" style={{ color: "var(--text-dim)" }}>{l.label}</Link>
            ))}
            <a href="https://josiah.rawsignal.dev" target="_blank" rel="noopener" className="footer-link">
              ← Portfolio
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
