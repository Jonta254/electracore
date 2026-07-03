"use client";
import { useState } from "react";
import Link from "next/link";

const CATEGORIES = ["All", "Wiring", "Safety", "Testing", "Calculations", "Standards"];

const GUIDES = [
  {
    title: "Single-Phase Socket Outlet Wiring",
    sub: "Step-by-step termination guide with colour codes for AU/NZ, UK, and EU standards.",
    level: "Beginner", cat: "Wiring", readMins: 7,
  },
  {
    title: "Earthing Systems — TN-C-S, TN-S, TT Explained",
    sub: "Understand the difference between earthing arrangements and when each applies.",
    level: "Intermediate", cat: "Standards", readMins: 12,
  },
  {
    title: "Testing Insulation Resistance (IR Test)",
    sub: "How to perform and interpret a 500V megger test on a completed installation.",
    level: "Intermediate", cat: "Testing", readMins: 10,
  },
  {
    title: "3-Phase Motor Starter — DOL Wiring",
    sub: "Direct online starter wiring diagram with contactor, overload relay, and control circuit.",
    level: "Intermediate", cat: "Wiring", readMins: 14,
  },
  {
    title: "RCD Types — AC, A, F, B Explained",
    sub: "When to use each type of RCD and why it matters for EV chargers and VFDs.",
    level: "Intermediate", cat: "Safety", readMins: 8,
  },
  {
    title: "Cable Colour Codes — All Regions",
    sub: "Side-by-side comparison: AU/NZ AS3000, UK BS7671, EU CENELEC, US NEC, and IEC.",
    level: "Beginner", cat: "Standards", readMins: 5,
  },
  {
    title: "Loop Impedance Testing — Step by Step",
    sub: "Perform Ze and Zs measurements, record results, and verify against protective device tables.",
    level: "Intermediate", cat: "Testing", readMins: 15,
  },
  {
    title: "Safe Isolation Procedure",
    sub: "The correct sequence for safely isolating a circuit before working on it. Non-negotiable.",
    level: "Beginner", cat: "Safety", readMins: 6,
  },
  {
    title: "Calculating Maximum Demand for a House",
    sub: "Use AS3000 diversity factors to size the main switchboard and supply conductors.",
    level: "Intermediate", cat: "Calculations", readMins: 11,
  },
  {
    title: "LED Downlight Circuit — Driver Types and Wiring",
    sub: "Constant voltage vs constant current drivers, dimming compatibility, and safe installation.",
    level: "Beginner", cat: "Wiring", readMins: 9,
  },
  {
    title: "Switchboard Label Requirements",
    sub: "What labelling is required by AS3000 and IEC 60439 for distribution boards and MCBs.",
    level: "Beginner", cat: "Standards", readMins: 5,
  },
  {
    title: "Power Factor Correction — Capacitor Banks",
    sub: "How to specify, size, and install power factor correction equipment for commercial loads.",
    level: "Advanced", cat: "Calculations", readMins: 18,
  },
  {
    title: "Conduit Sizing for Cable Bundles",
    sub: "Calculate conduit fill, select conduit size, and reference installation rules for PVC and metal conduit.",
    level: "Intermediate", cat: "Calculations", readMins: 9,
  },
  {
    title: "Fire Alarm Wiring — Class A vs Class B",
    sub: "Supervised loops, end-of-line resistors, and open-circuit fault detection explained.",
    level: "Advanced", cat: "Wiring", readMins: 13,
  },
  {
    title: "Thermographic Inspection — Interpreting Results",
    sub: "How to read thermal camera images on switchboards and identify hotspot severity.",
    level: "Advanced", cat: "Testing", readMins: 11,
  },
];

export default function GuidesPage() {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const filtered = GUIDES.filter((g) => {
    const matchCat = cat === "All" || g.cat === cat;
    const matchSearch = g.title.toLowerCase().includes(search.toLowerCase()) || g.sub.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <div className="nav-logo-mark">E</div>
          <span className="nav-logo-text">ElectraCore</span>
        </Link>
        <div className="nav-links">
          <Link href="/calculate" className="nav-link">Calculate</Link>
          <Link href="/guides" className="nav-link" style={{ color: "var(--core)" }}>Guides</Link>
          <Link href="/learn" className="nav-link">Learn</Link>
        </div>
        <Link href="/calculate" className="nav-cta">Open Calculator</Link>
      </nav>

      <main style={{ paddingTop: "80px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1.5rem 2rem" }}>
          <p className="section-label">Reference Library</p>
          <h1 className="section-title">Wiring Guides & References</h1>
          <p className="section-sub">
            Practical guides written from the tools up — not from a textbook. Installation methods, colour codes, testing procedures, and safety practices.
          </p>

          {/* SEARCH */}
          <input
            className="form-input"
            type="text"
            placeholder="Search guides..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", maxWidth: 400, marginBottom: "1.5rem" }}
          />

          {/* CATEGORY TABS */}
          <div className="tabs">
            {CATEGORIES.map((c) => (
              <button key={c} className={`tab ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>

          {/* RESULTS COUNT */}
          <p style={{ fontSize: "0.85rem", color: "var(--text-mute)", marginBottom: "2rem" }}>
            {filtered.length} guide{filtered.length !== 1 ? "s" : ""}
          </p>

          {/* GUIDE GRID */}
          <div className="guide-grid">
            {filtered.map((g, i) => (
              <div key={i} className="guide-card" style={{ cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.875rem" }}>
                  <span className={`guide-tag tag-${g.level.toLowerCase()}`}>{g.level}</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-mute)" }}>{g.readMins} min read</span>
                </div>
                <div className="guide-card-title">{g.title}</div>
                <div className="guide-card-sub">{g.sub}</div>
                <div style={{
                  display: "inline-block", marginTop: "1rem",
                  padding: "3px 10px", borderRadius: 100,
                  fontSize: "0.7rem", background: "var(--bg3)",
                  color: "var(--text-mute)", border: "1px solid var(--border)",
                }}>{g.cat}</div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-mute)" }}>
              No guides found for &ldquo;{search}&rdquo;
            </div>
          )}
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
