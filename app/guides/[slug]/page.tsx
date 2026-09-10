"use client";
import React, { use } from "react";
import Link from "next/link";
import { GUIDE_MAP, GUIDES, type Block } from "../content";
import { getGuideReview } from "../review";

const TONE = {
  safety: { c: "#FF4444", rgb: "255,68,68", label: "Safety" },
  warn: { c: "#F0A500", rgb: "240,165,0", label: "Watch out" },
  note: { c: "#00D4FF", rgb: "0,212,255", label: "Note" },
  tip: { c: "#34D399", rgb: "52,211,153", label: "On site" },
} as const;

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "p":
      return <p className="g-p">{block.text}</p>;
    case "list":
      return block.ordered ? (
        <ol className="g-list g-ol">{block.items.map((it, i) => <li key={i}>{it}</li>)}</ol>
      ) : (
        <ul className="g-list">{block.items.map((it, i) => <li key={i}>{it}</li>)}</ul>
      );
    case "steps":
      return (
        <div className="g-steps">
          {block.items.map((s, i) => (
            <div key={i} className="g-step">
              <span className="g-step-num">{i + 1}</span>
              <div>
                <div className="g-step-title">{s.title}</div>
                <div className="g-step-text">{s.text}</div>
              </div>
            </div>
          ))}
        </div>
      );
    case "table":
      return (
        <div className="g-table-wrap">
          <table className="g-table">
            <thead>
              <tr>{block.head.map((h, i) => <th key={i}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {block.rows.map((r, i) => (
                <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
              ))}
            </tbody>
          </table>
          {block.caption && <div className="g-caption">{block.caption}</div>}
        </div>
      );
    case "callout": {
      const t = TONE[block.tone];
      return (
        <div className="g-callout" style={{ borderColor: `rgba(${t.rgb},0.35)`, background: `rgba(${t.rgb},0.06)` }}>
          <div className="g-callout-tag" style={{ color: t.c }}>{block.title || t.label}</div>
          <div className="g-callout-text">{block.text}</div>
        </div>
      );
    }
    case "formula":
      return (
        <div className="g-formula">
          <code>{block.expr}</code>
          {block.where && <div className="g-formula-where">{block.where}</div>}
        </div>
      );
    case "keyvalues":
      return (
        <div className="g-kv">
          {block.items.map((it, i) => (
            <div key={i} className="g-kv-row">
              <span className="g-kv-k">{it.k}</span>
              <span className="g-kv-v">{it.v}</span>
            </div>
          ))}
        </div>
      );
    case "swatches":
      return (
        <div className="g-swatches">
          {block.items.map((s, i) => (
            <div key={i} className="g-swatch">
              <span
                className="g-swatch-chip"
                style={
                  s.role.includes("/")
                    ? { background: `linear-gradient(135deg, ${s.hex} 0 50%, #E7D63A 50% 100%)` }
                    : { background: s.hex }
                }
              />
              <div>
                <div className="g-swatch-role">{s.role}</div>
                <div className="g-swatch-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      );
    case "node":
      return <div className="g-node">{block.node}</div>;
    default:
      return null;
  }
}

export default function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const guide = GUIDE_MAP[slug];

  if (!guide) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem" }}>
        <div className="guide-empty-label">GUIDE</div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Guide not found</h1>
        <Link href="/guides" style={{ color: "var(--core)", textDecoration: "none" }}>← Back to all guides</Link>
      </div>
    );
  }

  const related = guide.related.map((s) => GUIDE_MAP[s]).filter(Boolean);
  const review = getGuideReview(slug);

  return (
    <>
      <main style={{ paddingTop: "80px" }}>
        <article className="g-article">
          {/* HEADER */}
          <header className="g-header">
            <div className="g-breadcrumb g-noprint">
              <Link href="/guides">Guides</Link>
              <span>›</span>
              <span style={{ color: "var(--core)" }}>{guide.cat}</span>
            </div>
            <div className="g-meta-row">
              <span className={`guide-tag tag-${guide.level.toLowerCase()}`}>{guide.level}</span>
              <span className="g-meta-dim">{guide.readMins} min read</span>
              <span className="g-meta-dim">Updated {guide.updated}</span>
            </div>
            <h1 className="g-title">{guide.title}</h1>
            <p className="g-sub">{guide.sub}</p>
            <div className="g-standards">
              {guide.standards.map((s) => <span key={s} className="g-standard-chip">{s}</span>)}
            </div>
            <aside className="g-review-note" aria-label="Technical source and review status">
              <strong>Source scope:</strong> {review.jurisdiction} · {review.sources.map((source) => `${source.title} (${source.edition})`).join("; ")}
              <br />
              <strong>Review status:</strong> Professional electrical review pending. Confirm the current edition and local requirements before use.
            </aside>
            <div className="g-header-actions g-noprint">
              <button className="g-print-btn" onClick={() => window.print()}>⎙ Print / save as PDF</button>
            </div>
          </header>

          <div className="g-layout">
            {/* TOC */}
            <aside className="g-toc g-noprint" aria-label="On this page">
              <div className="g-toc-title">On this page</div>
              <nav>
                {guide.sections.map((s) => (
                  <a key={s.id} href={`#${s.id}`} className="g-toc-link">{s.heading}</a>
                ))}
              </nav>
            </aside>

            {/* BODY */}
            <div className="g-body">
              <div className="g-summary">{guide.summary}</div>

              {guide.sections.map((section) => (
                <section key={section.id} id={section.id} className="g-section">
                  <h2 className="g-h2">{section.heading}</h2>
                  {section.blocks.map((b, i) => <BlockView key={i} block={b} />)}
                </section>
              ))}

              <div className="g-disclaimer">
                Reference material for qualified electrical work. Figures follow BS 7671 and the IET On-Site Guide unless
                stated; always confirm against the current edition and the standard that applies to your installation.
              </div>

              {related.length > 0 && (
                <div className="g-related g-noprint">
                  <h2 className="g-h2">Related guides</h2>
                  <div className="g-related-grid">
                    {related.map((r) => (
                      <Link key={r.slug} href={`/guides/${r.slug}`} className="g-related-card">
                        <span className={`guide-tag tag-${r.level.toLowerCase()}`}>{r.level}</span>
                        <div className="g-related-title">{r.title}</div>
                        <div className="g-related-sub">{r.sub}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>
      </main>

      <footer style={{ borderTop: "1px solid var(--border)", padding: "3rem 1.5rem" }} className="g-noprint">
        <div className="footer">
          <div className="footer-copy">ElectraCore · Built by Brian Josiah</div>
          <Link href="/guides" className="footer-link">← Back to all guides</Link>
        </div>
      </footer>

      <style>{`
        .g-article { max-width: 1040px; margin: 0 auto; padding: 2.5rem 1.5rem 1rem; }
        .g-header { border-bottom: 1px solid var(--border); padding-bottom: 1.75rem; margin-bottom: 2rem; }
        .g-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: var(--text-mute); margin-bottom: 1.25rem; }
        .g-breadcrumb a { color: var(--text-mute); text-decoration: none; }
        .g-breadcrumb a:hover { color: var(--text); }
        .g-meta-row { display: flex; align-items: center; gap: 0.875rem; margin-bottom: 1rem; flex-wrap: wrap; }
        .g-meta-dim { font-size: 0.78rem; color: var(--text-mute); font-family: 'JetBrains Mono', monospace; }
        .g-title { font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 900; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 0.875rem; }
        .g-sub { font-size: 1.05rem; color: var(--text-dim); line-height: 1.7; max-width: 680px; }
        .g-standards { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1.25rem; }
        .g-standard-chip { font-family: 'JetBrains Mono', monospace; font-size: 0.68rem; color: var(--text-dim); background: var(--bg3); border: 1px solid var(--border); padding: 3px 9px; border-radius: 6px; }
        .g-header-actions { margin-top: 1.5rem; }
        .g-print-btn { font-family: inherit; font-size: 0.82rem; font-weight: 700; color: var(--core); background: rgba(var(--core-rgb),0.1); border: 1px solid rgba(var(--core-rgb),0.3); padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; transition: background 0.18s; }
        .g-print-btn:hover { background: rgba(var(--core-rgb),0.18); }

        .g-layout { display: grid; grid-template-columns: 220px minmax(0,1fr); gap: 3rem; align-items: start; }
        .g-toc { position: sticky; top: 90px; }
        .g-toc-title { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-mute); margin-bottom: 0.875rem; }
        .g-toc nav { display: flex; flex-direction: column; gap: 0.5rem; border-left: 1px solid var(--border); }
        .g-toc-link { font-size: 0.85rem; color: var(--text-dim); text-decoration: none; padding: 2px 0 2px 0.875rem; margin-left: -1px; border-left: 2px solid transparent; transition: color 0.15s, border-color 0.15s; }
        .g-toc-link:hover { color: var(--core); border-left-color: var(--core); }

        .g-summary { font-size: 1.02rem; color: var(--text); line-height: 1.8; padding: 1.25rem 1.5rem; background: linear-gradient(135deg, rgba(var(--core-rgb),0.06), rgba(var(--volt-rgb),0.03)); border: 1px solid rgba(var(--core-rgb),0.2); border-radius: var(--radius); margin-bottom: 2.5rem; }
        .g-section { margin-bottom: 2.5rem; scroll-margin-top: 88px; }
        .g-h2 { font-size: 1.4rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 1rem; padding-bottom: 0.4rem; border-bottom: 1px solid var(--border); }
        .g-p { font-size: 0.95rem; color: var(--text-dim); line-height: 1.8; margin-bottom: 1rem; }
        .g-list { list-style: none; display: flex; flex-direction: column; gap: 0.7rem; margin-bottom: 1rem; }
        .g-list li { position: relative; padding-left: 1.4rem; font-size: 0.92rem; color: var(--text-dim); line-height: 1.7; }
        .g-list li::before { content: "▸"; position: absolute; left: 0; color: var(--core); }
        .g-ol { counter-reset: gol; }
        .g-ol li::before { counter-increment: gol; content: counter(gol) "."; color: var(--core); font-family: 'JetBrains Mono', monospace; font-weight: 700; }

        .g-steps { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1rem; }
        .g-step { display: flex; gap: 0.875rem; padding: 0.875rem 1rem; background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius-sm); }
        .g-step-num { flex-shrink: 0; width: 26px; height: 26px; border-radius: 50%; background: rgba(var(--core-rgb),0.15); border: 1px solid rgba(var(--core-rgb),0.4); color: var(--core); font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.78rem; display: flex; align-items: center; justify-content: center; }
        .g-step-title { font-size: 0.92rem; font-weight: 700; color: var(--text); margin-bottom: 0.2rem; }
        .g-step-text { font-size: 0.88rem; color: var(--text-dim); line-height: 1.65; }

        .g-table-wrap { margin-bottom: 1.25rem; overflow-x: auto; }
        .g-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; min-width: 420px; }
        .g-table th { text-align: left; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-mute); font-weight: 700; padding: 0.6rem 0.75rem; border-bottom: 1px solid rgba(var(--core-rgb),0.3); }
        .g-table td { padding: 0.65rem 0.75rem; color: var(--text-dim); border-bottom: 1px solid var(--border); line-height: 1.5; vertical-align: top; }
        .g-table tr:last-child td { border-bottom: none; }
        .g-table td:first-child { color: var(--text); font-weight: 600; }
        .g-caption { font-size: 0.78rem; color: var(--text-mute); margin-top: 0.5rem; line-height: 1.5; font-style: italic; }

        .g-callout { border: 1px solid; border-radius: var(--radius-sm); padding: 1rem 1.25rem; margin-bottom: 1.25rem; }
        .g-callout-tag { font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.4rem; }
        .g-callout-text { font-size: 0.9rem; color: var(--text-dim); line-height: 1.7; }

        .g-formula { background: var(--bg3); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 1rem 1.25rem; margin-bottom: 1.25rem; text-align: center; }
        .g-formula code { font-family: 'JetBrains Mono', monospace; font-size: 1.1rem; color: var(--core); letter-spacing: 0.03em; }
        .g-formula-where { font-size: 0.8rem; color: var(--text-mute); margin-top: 0.6rem; line-height: 1.6; }

        .g-kv { display: flex; flex-direction: column; margin-bottom: 1.25rem; border: 1px solid var(--border); border-radius: var(--radius-sm); overflow: hidden; }
        .g-kv-row { display: grid; grid-template-columns: 130px 1fr; gap: 1rem; padding: 0.7rem 1rem; border-bottom: 1px solid var(--border); }
        .g-kv-row:last-child { border-bottom: none; }
        .g-kv-k { font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; font-weight: 700; color: var(--core); }
        .g-kv-v { font-size: 0.88rem; color: var(--text-dim); line-height: 1.6; }

        .g-swatches { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px,1fr)); gap: 0.75rem; margin-bottom: 1.25rem; }
        .g-swatch { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem; background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius-sm); }
        .g-swatch-chip { width: 30px; height: 30px; border-radius: 6px; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.15); }
        .g-swatch-role { font-size: 0.85rem; font-weight: 700; color: var(--text); }
        .g-swatch-label { font-size: 0.75rem; color: var(--text-mute); }

        .g-node { margin-bottom: 1.25rem; }

        .g-disclaimer { font-size: 0.8rem; color: var(--text-mute); line-height: 1.7; padding: 1rem 1.25rem; background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius-sm); margin: 2rem 0; }

        .g-related { margin-top: 2.5rem; }
        .g-related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%,240px),1fr)); gap: 1rem; }
        .g-related-card { display: block; padding: 1.25rem; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); text-decoration: none; color: inherit; transition: border-color 0.2s, transform 0.2s; }
        .g-related-card:hover { border-color: var(--border-glow); transform: translateY(-2px); }
        .g-related-title { font-size: 0.95rem; font-weight: 700; margin-bottom: 0.3rem; }
        .g-related-sub { font-size: 0.82rem; color: var(--text-dim); line-height: 1.5; }

        @media (max-width: 860px) {
          .g-layout { grid-template-columns: 1fr; }
          .g-toc { display: none; }
        }

        @media print {
          .g-noprint { display: none !important; }
          main { padding-top: 0 !important; }
          .g-layout { grid-template-columns: 1fr; }
          .g-article { max-width: 100%; padding: 0; }
          body { background: #fff; color: #111; }
          .g-title, .g-h2, .g-step-title, .g-swatch-role, .g-table td:first-child { color: #111 !important; }
          .g-p, .g-list li, .g-step-text, .g-callout-text, .g-table td, .g-kv-v, .g-sub, .g-summary { color: #222 !important; }
          .g-summary { background: #f4f4f4 !important; border-color: #ccc !important; }
          .g-step, .g-callout, .g-formula, .g-kv, .g-swatch, .g-disclaimer { break-inside: avoid; }
          .g-section { break-inside: avoid-page; }
        }
      `}</style>
    </>
  );
}
