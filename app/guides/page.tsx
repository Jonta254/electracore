"use client";
import { useState } from "react";
import Link from "next/link";
import { ElectraCoreLogoMark } from "../components/Logo";
import { GUIDES } from "./content";

const CATEGORIES = ["All", "Wiring", "Safety", "Testing", "Calculations", "Standards"];

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
          <ElectraCoreLogoMark size={32} />
          <span className="nav-logo-text">ElectraCore</span>
        </Link>
        <div className="nav-links">
          <Link href="/design" className="nav-link">Design</Link>
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
            Practical guides built around the work itself. Find installation methods, colour codes, test procedures and safety guidance without textbook filler.
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
            {filtered.map((g) => (
              <Link key={g.slug} href={`/guides/${g.slug}`} className="guide-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.875rem" }}>
                  <span className={`guide-tag tag-${g.level.toLowerCase()}`}>{g.level}</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-mute)" }}>{g.readMins} min read</span>
                </div>
                <div className="guide-card-title">{g.title}</div>
                <div className="guide-card-sub">{g.sub}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1rem" }}>
                  <span style={{
                    display: "inline-block",
                    padding: "3px 10px", borderRadius: 100,
                    fontSize: "0.7rem", background: "var(--bg3)",
                    color: "var(--text-mute)", border: "1px solid var(--border)",
                  }}>{g.cat}</span>
                  <span style={{ fontSize: "0.8rem", color: "var(--core)", fontWeight: 700 }}>Read →</span>
                </div>
              </Link>
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
