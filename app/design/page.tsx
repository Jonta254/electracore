"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { ElectraCoreLogoMark } from "../components/Logo";
import {
  designCircuit, DEVICE_RATINGS, METHODS, AMBIENT_OPTIONS, GROUPING_OPTIONS,
  INSULATION_OPTIONS, METHOD_MAP, type DesignInput,
} from "./engine";

const DEFAULTS: DesignInput = {
  phase: "single", mode: "power", power: "", pf: "1", current: "",
  voltage: "230", length: "", deviceOverride: null, method: "C",
  ambientC: 30, groupN: 1, insulationId: "none", vdLimitPct: "5",
};

/* Cross-section that scales with the chosen conductor size */
function CableCrossSection({ size, phase }: { size: number | null; phase: "single" | "three" }) {
  const r = size ? Math.max(10, Math.min(34, 8 + Math.sqrt(size) * 5)) : 14;
  const cores = phase === "three"
    ? [{ x: 60, y: 52, c: "#7A4A2B", t: "L1" }, { x: 96, y: 52, c: "#111", t: "L2" }, { x: 78, y: 84, c: "#8A8A8A", t: "L3" }, { x: 42, y: 84, c: "#1E62D0", t: "N" }, { x: 114, y: 84, c: "#3FA34D", t: "E" }]
    : [{ x: 56, y: 62, c: "#7A4A2B", t: "L" }, { x: 100, y: 62, c: "#1E62D0", t: "N" }, { x: 78, y: 96, c: "#3FA34D", t: "E" }];
  return (
    <svg viewBox="0 0 156 150" width="100%" style={{ display: "block" }}>
      <ellipse cx="78" cy="74" rx="70" ry="62" fill="#0D1014" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
      <ellipse cx="78" cy="74" rx="62" ry="55" fill="rgba(240,165,0,0.03)" stroke="rgba(240,165,0,0.15)" strokeWidth="1" strokeDasharray="4 3" />
      {cores.map((core, i) => (
        <g key={i}>
          <circle cx={core.x} cy={core.y} r={r} fill={core.c === "#111" ? "#1a1a1a" : core.c} opacity="0.28" />
          <circle cx={core.x} cy={core.y} r={r * 0.66} fill={core.c === "#111" ? "#1a1a1a" : core.c} opacity="0.55" />
          <circle cx={core.x} cy={core.y} r={r * 0.4} fill="#C8792E" opacity="0.85" />
          <text x={core.x} y={core.y + 3} textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#fff" opacity="0.9">{core.t}</text>
        </g>
      ))}
      <text x="78" y="146" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="var(--text-mute)">
        {size ? `${size} mm² copper` : "— select a load —"}
      </text>
    </svg>
  );
}

export default function DesignPage() {
  const [inp, setInp] = useState<DesignInput>(DEFAULTS);
  const set = <K extends keyof DesignInput>(k: K, v: DesignInput[K]) => setInp((p) => ({ ...p, [k]: v }));

  const result = useMemo(() => designCircuit(inp), [inp]);
  const allPass = result.valid && result.checks.length > 0 && result.checks.every((c) => c.ok);
  const anyFail = result.valid && result.checks.some((c) => !c.ok);

  const method = METHOD_MAP[inp.method];
  const reportDate = new Date().toLocaleString([], { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const summaryRows: [string, string][] = result.valid ? [
    ["Supply", `${inp.phase === "three" ? "Three-phase" : "Single-phase"} · ${inp.voltage} V`],
    ["Design current (Ib)", `${result.Ib.toFixed(1)} A`],
    ["Protective device (In)", `${result.In} A${inp.deviceOverride ? " (manual)" : " (auto)"}`],
    ["Installation method", `${method.id} — ${method.label}`],
    ["Derating factors", `Ca ${result.ca} · Cg ${result.cg} · Ci ${result.ci}  →  ${result.derate.toFixed(3)}`],
    ["Required tabulated capacity", `${result.requiredIt.toFixed(1)} A`],
    ["Thermal minimum size", result.thermalSize ? `${result.thermalSize} mm²` : "—"],
    ["Selected conductor", result.finalSize ? `${result.finalSize} mm² copper${result.vdLimited ? " (increased for voltage drop)" : ""}` : "—"],
    ["Effective capacity (Iz)", result.IzEffective ? `${result.IzEffective.toFixed(1)} A` : "—"],
    ["Run length", `${inp.length} m`],
    ["Voltage drop", result.vd != null ? `${result.vd.toFixed(2)} V (${result.vdPct?.toFixed(2)}%)` : "—"],
  ] : [];

  return (
    <>
      {/* PRINT-ONLY DESIGN SUMMARY */}
      <div className="dz-report" aria-hidden>
        <div className="dz-report-head">
          <div className="dz-report-brand">ElectraCore</div>
          <div className="dz-report-title">Circuit Design Summary</div>
          <div className="dz-report-date">Generated {reportDate}</div>
        </div>
        <table className="dz-report-table">
          <tbody>
            {summaryRows.map(([k, v]) => (
              <tr key={k}><th>{k}</th><td>{v}</td></tr>
            ))}
          </tbody>
        </table>
        <div className="dz-report-verdict">
          Verdict: {allPass ? "All checks pass" : anyFail ? "One or more checks require attention" : "Incomplete"}
        </div>
        <ul className="dz-report-checks">
          {result.checks.map((c, i) => <li key={i}>{c.ok ? "PASS" : "REVIEW"} — {c.label}: {c.detail}</li>)}
        </ul>
        <div className="dz-report-foot">
          Representative figures for 70 °C thermoplastic (PVC) insulated copper. Typical voltage-drop guidance is around
          3–5%. This summary is a design aid — verify every value against your local wiring regulations and the specific
          cable data before installation. ElectraCore.
        </div>
      </div>

      <nav className="nav dz-noprint">
        <Link href="/" className="nav-logo">
          <ElectraCoreLogoMark size={32} />
          <span className="nav-logo-text">ElectraCore</span>
        </Link>
        <div className="nav-links">
          <Link href="/design" className="nav-link" style={{ color: "var(--core)" }}>Design</Link>
          <Link href="/calculate" className="nav-link">Calculate</Link>
          <Link href="/guides" className="nav-link">Guides</Link>
          <Link href="/learn" className="nav-link">Learn</Link>
        </div>
        <Link href="/calculate" className="nav-cta">Quick Tools</Link>
      </nav>

      <main style={{ paddingTop: "64px" }}>
        {/* HERO */}
        <div className="dz-hero dz-noprint">
          <div className="dz-hero-glow" />
          <div className="dz-hero-inner">
            <p className="section-label">Circuit Designer</p>
            <h1 className="dz-title">From load to a verified cable,<br /><span className="accent">in one flow.</span></h1>
            <p className="dz-sub">
              Enter the load and the installation conditions. ElectraCore chains the whole calculation — design current,
              protective device, cable size with derating, and voltage drop — and tells you whether it passes. Change any
              value and the result updates live.
            </p>
            <div className="dz-flow">
              {["Load", "Device", "Cable size", "Voltage drop", "Verdict"].map((s, i) => (
                <span key={s} className="dz-flow-node">
                  <span className="dz-flow-dot">{i + 1}</span>{s}
                  {i < 4 && <span className="dz-flow-arrow">→</span>}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="dz-layout dz-noprint">
          {/* INPUTS */}
          <div className="dz-inputs">
            {/* Step 1 — Load */}
            <section className="dz-card">
              <div className="dz-card-head"><span className="dz-step">1</span><h2>Load &amp; supply</h2></div>
              <div className="dz-seg">
                <button className={inp.phase === "single" ? "on" : ""} onClick={() => setInp((p) => ({ ...p, phase: "single", voltage: "230" }))}>Single-phase</button>
                <button className={inp.phase === "three" ? "on" : ""} onClick={() => setInp((p) => ({ ...p, phase: "three", voltage: "400" }))}>Three-phase</button>
              </div>
              <div className="dz-seg dz-seg-sm">
                <button className={inp.mode === "power" ? "on" : ""} onClick={() => set("mode", "power")}>Enter power</button>
                <button className={inp.mode === "current" ? "on" : ""} onClick={() => set("mode", "current")}>Enter current</button>
              </div>
              <div className="dz-grid">
                {inp.mode === "power" ? (
                  <>
                    <Field label="Load power" unit="W" val={inp.power} on={(v) => set("power", v)} ph="e.g. 7400" />
                    <Field label="Power factor" unit="0–1" val={inp.pf} on={(v) => set("pf", v)} ph="1.0" />
                  </>
                ) : (
                  <Field label="Design current" unit="A" val={inp.current} on={(v) => set("current", v)} ph="e.g. 32" />
                )}
                <Field label="Supply voltage" unit="V" val={inp.voltage} on={(v) => set("voltage", v)} ph={inp.phase === "three" ? "400" : "230"} />
                <Field label="Run length (one-way)" unit="m" val={inp.length} on={(v) => set("length", v)} ph="e.g. 25" />
              </div>
            </section>

            {/* Step 2 — Device */}
            <section className="dz-card">
              <div className="dz-card-head"><span className="dz-step">2</span><h2>Protective device</h2></div>
              <p className="dz-note">Auto-selected as the smallest standard rating at or above the design current. Override if your design needs a specific device.</p>
              <div className="dz-chips">
                <button className={inp.deviceOverride === null ? "on" : ""} onClick={() => set("deviceOverride", null)}>
                  Auto{result.valid ? ` (${result.deviceAuto} A)` : ""}
                </button>
                {DEVICE_RATINGS.map((r) => (
                  <button key={r} className={inp.deviceOverride === r ? "on" : ""} onClick={() => set("deviceOverride", r)}>{r} A</button>
                ))}
              </div>
            </section>

            {/* Step 3 — Install conditions */}
            <section className="dz-card">
              <div className="dz-card-head"><span className="dz-step">3</span><h2>Installation conditions</h2></div>
              <label className="dz-field-label">Reference method</label>
              <div className="dz-method-list">
                {METHODS.map((m) => (
                  <button key={m.id} className={`dz-method${inp.method === m.id ? " on" : ""}`} onClick={() => set("method", m.id)}>
                    <span className="dz-method-id">{m.id}</span>
                    <span className="dz-method-body"><strong>{m.label}</strong><span>{m.hint}</span></span>
                  </button>
                ))}
              </div>
              <div className="dz-grid dz-grid-3">
                <Select label="Ambient temp" val={String(inp.ambientC)} on={(v) => set("ambientC", Number(v))}
                  opts={AMBIENT_OPTIONS.map((a) => ({ v: String(a.c), t: `${a.c} °C (Ca ${a.ca})` }))} />
                <Select label="Grouped circuits" val={String(inp.groupN)} on={(v) => set("groupN", Number(v))}
                  opts={GROUPING_OPTIONS.map((g) => ({ v: String(g.n), t: `${g.n} circuit${g.n > 1 ? "s" : ""} (Cg ${g.cg})` }))} />
                <Select label="Thermal insulation" val={inp.insulationId} on={(v) => set("insulationId", v)}
                  opts={INSULATION_OPTIONS.map((i) => ({ v: i.id, t: `${i.label} (Ci ${i.ci})` }))} />
              </div>
              <div className="dz-grid">
                <Field label="Voltage-drop limit" unit="%" val={inp.vdLimitPct} on={(v) => set("vdLimitPct", v)} ph="5" />
                <div className="dz-limit-hint">
                  Typical guidance is around <strong>3% for lighting</strong> and <strong>5% for power</strong>.
                  Set the figure your installation requires and verify against your local wiring regulations.
                </div>
              </div>
            </section>
          </div>

          {/* LIVE RESULT */}
          <aside className="dz-result">
            <div className={`dz-result-card${allPass ? " pass" : anyFail ? " fail" : ""}`}>
              {!result.valid ? (
                <div className="dz-empty">
                  <div className="dz-empty-icon">🔌</div>
                  <p>{result.message || "Enter a load to start the design."}</p>
                </div>
              ) : (
                <>
                  <div className={`dz-verdict ${allPass ? "ok" : anyFail ? "no" : "wait"}`}>
                    {allPass ? "✓ Design passes" : anyFail ? "⚠ Needs attention" : "Working…"}
                  </div>

                  <div className="dz-xsec">
                    <CableCrossSection size={result.finalSize} phase={inp.phase} />
                  </div>

                  <div className="dz-headline">
                    <div className="dz-headline-num">{result.finalSize ?? "—"}</div>
                    <div className="dz-headline-unit">mm²</div>
                  </div>
                  <div className="dz-headline-sub">
                    copper, {method.label.toLowerCase()}
                    {result.vdLimited && <span className="dz-tag">voltage-drop limited</span>}
                  </div>

                  <div className="dz-metrics">
                    <Metric k="Design current" v={`${result.Ib.toFixed(1)} A`} />
                    <Metric k="Device" v={`${result.In} A`} />
                    <Metric k="Iz (derated)" v={result.IzEffective ? `${result.IzEffective.toFixed(1)} A` : "—"} />
                    <Metric k="Voltage drop" v={result.vdPct != null ? `${result.vdPct.toFixed(2)}%` : "—"} />
                  </div>

                  <div className="dz-checks">
                    {result.checks.map((c, i) => (
                      <div key={i} className={`dz-check ${c.ok ? "ok" : "no"}`}>
                        <span className="dz-check-mark">{c.ok ? "✓" : "✕"}</span>
                        <div>
                          <div className="dz-check-label">{c.label}</div>
                          <div className="dz-check-detail">{c.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="dz-export" onClick={() => window.print()}>⎙ Export design summary (PDF)</button>
                  <p className="dz-disclaimer">
                    Representative figures for 70 °C PVC-insulated copper. A design aid, not a substitute for the
                    regulations — verify every value against your local wiring regulations before installation.
                  </p>
                </>
              )}
            </div>
          </aside>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid var(--border)", padding: "3rem 1.5rem" }} className="dz-noprint">
        <div className="footer">
          <div className="footer-copy">ElectraCore · Built by Brian Josiah</div>
          <Link href="/calculate" className="footer-link">Individual calculators →</Link>
        </div>
      </footer>

      <style>{`
        .accent { color: var(--core); }
        .dz-hero { position: relative; overflow: hidden; padding: 3.5rem 1.5rem 2.5rem; border-bottom: 1px solid var(--border); background: radial-gradient(ellipse 70% 60% at 20% 0%, rgba(var(--core-rgb),0.12) 0%, transparent 60%); }
        .dz-hero-glow { position: absolute; top: -30%; right: -5%; width: 500px; height: 400px; background: radial-gradient(ellipse, rgba(var(--volt-rgb),0.1), transparent 70%); pointer-events: none; }
        .dz-hero-inner { max-width: 1180px; margin: 0 auto; position: relative; z-index: 1; }
        .dz-title { font-size: clamp(2rem, 5vw, 3.4rem); font-weight: 900; letter-spacing: -0.03em; line-height: 1.08; margin-bottom: 1rem; }
        .dz-sub { font-size: 1.02rem; color: var(--text-dim); line-height: 1.75; max-width: 620px; margin-bottom: 1.75rem; }
        .dz-flow { display: flex; flex-wrap: wrap; gap: 0.5rem 1.1rem; }
        .dz-flow-node { display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; font-weight: 600; color: var(--text-dim); font-family: 'JetBrains Mono', monospace; }
        .dz-flow-dot { width: 20px; height: 20px; border-radius: 50%; background: rgba(var(--core-rgb),0.15); border: 1px solid rgba(var(--core-rgb),0.4); color: var(--core); font-size: 0.7rem; display: flex; align-items: center; justify-content: center; }
        .dz-flow-arrow { color: var(--text-mute); margin-left: 0.6rem; }

        .dz-layout { max-width: 1180px; margin: 0 auto; padding: 2rem 1.5rem 5rem; display: grid; grid-template-columns: minmax(0,1fr) 380px; gap: 1.75rem; align-items: start; }
        .dz-inputs { display: flex; flex-direction: column; gap: 1.25rem; }
        .dz-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; }
        .dz-card-head { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
        .dz-card-head h2 { font-size: 1.1rem; font-weight: 800; }
        .dz-step { width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0; background: rgba(var(--core-rgb),0.15); border: 1px solid rgba(var(--core-rgb),0.4); color: var(--core); font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; }
        .dz-note { font-size: 0.83rem; color: var(--text-dim); line-height: 1.6; margin-bottom: 1rem; }
        .dz-field-label { display: block; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-dim); margin-bottom: 0.5rem; }

        .dz-seg { display: flex; gap: 0.4rem; margin-bottom: 0.6rem; background: var(--bg3); padding: 4px; border-radius: 10px; border: 1px solid var(--border); }
        .dz-seg button { flex: 1; padding: 0.55rem; border-radius: 7px; border: none; background: transparent; color: var(--text-dim); font-family: inherit; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: all 0.16s; }
        .dz-seg button.on { background: var(--core); color: #000; }
        .dz-seg-sm { margin-bottom: 1rem; }
        .dz-seg-sm button { padding: 0.4rem; font-size: 0.8rem; }
        .dz-seg-sm button.on { background: rgba(var(--core-rgb),0.9); }

        .dz-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.875rem; }
        .dz-grid-3 { grid-template-columns: 1fr 1fr 1fr; margin-bottom: 1rem; }
        @media (max-width: 560px) { .dz-grid, .dz-grid-3 { grid-template-columns: 1fr; } }
        .dz-fg { display: flex; flex-direction: column; gap: 5px; }
        .dz-fg label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-dim); }
        .dz-fg label span { color: var(--text-mute); }
        .dz-fg input, .dz-fg select { padding: 0.7rem 0.85rem; border-radius: var(--radius-sm); background: var(--bg3); border: 1px solid var(--border); color: var(--text); font-size: 0.92rem; font-family: inherit; outline: none; transition: border-color 0.18s; }
        .dz-fg input:focus, .dz-fg select:focus { border-color: rgba(var(--core-rgb),0.5); }
        .dz-limit-hint { font-size: 0.78rem; color: var(--text-dim); line-height: 1.55; align-self: center; }
        .dz-limit-hint strong { color: var(--volt); }

        .dz-chips { display: flex; flex-wrap: wrap; gap: 0.45rem; }
        .dz-chips button { padding: 0.4rem 0.8rem; border-radius: 100px; border: 1px solid var(--border); background: transparent; color: var(--text-dim); font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; cursor: pointer; transition: all 0.16s; }
        .dz-chips button:hover { border-color: rgba(var(--core-rgb),0.4); color: var(--text); }
        .dz-chips button.on { background: rgba(var(--core-rgb),0.15); border-color: rgba(var(--core-rgb),0.5); color: var(--core); font-weight: 700; }

        .dz-method-list { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.25rem; }
        .dz-method { display: flex; gap: 0.875rem; align-items: center; text-align: left; padding: 0.75rem 0.875rem; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--bg2); cursor: pointer; transition: all 0.16s; }
        .dz-method:hover { border-color: rgba(var(--core-rgb),0.35); }
        .dz-method.on { border-color: rgba(var(--core-rgb),0.6); background: rgba(var(--core-rgb),0.07); }
        .dz-method-id { width: 30px; height: 30px; flex-shrink: 0; border-radius: 7px; background: rgba(var(--volt-rgb),0.12); border: 1px solid rgba(var(--volt-rgb),0.3); color: var(--volt); font-family: 'JetBrains Mono', monospace; font-weight: 700; display: flex; align-items: center; justify-content: center; }
        .dz-method-body { display: flex; flex-direction: column; gap: 2px; }
        .dz-method-body strong { font-size: 0.88rem; color: var(--text); }
        .dz-method-body span { font-size: 0.76rem; color: var(--text-mute); line-height: 1.45; }

        .dz-result { position: sticky; top: 80px; }
        .dz-result-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; transition: border-color 0.25s, box-shadow 0.25s; }
        .dz-result-card.pass { border-color: rgba(var(--ground-rgb),0.45); box-shadow: 0 0 0 1px rgba(var(--ground-rgb),0.15), 0 12px 40px rgba(0,0,0,0.4); }
        .dz-result-card.fail { border-color: rgba(var(--hot-rgb),0.4); box-shadow: 0 0 0 1px rgba(var(--hot-rgb),0.12), 0 12px 40px rgba(0,0,0,0.4); }
        .dz-empty { text-align: center; padding: 2.5rem 1rem; color: var(--text-dim); }
        .dz-empty-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
        .dz-verdict { text-align: center; font-weight: 800; font-size: 0.95rem; padding: 0.6rem; border-radius: var(--radius-sm); margin-bottom: 1rem; }
        .dz-verdict.ok { background: rgba(var(--ground-rgb),0.12); color: var(--ground); border: 1px solid rgba(var(--ground-rgb),0.35); }
        .dz-verdict.no { background: rgba(var(--hot-rgb),0.1); color: var(--hot); border: 1px solid rgba(var(--hot-rgb),0.35); }
        .dz-verdict.wait { background: var(--bg3); color: var(--text-dim); }
        .dz-xsec { max-width: 190px; margin: 0 auto 0.5rem; }
        .dz-headline { display: flex; align-items: flex-end; justify-content: center; gap: 0.4rem; }
        .dz-headline-num { font-size: 3.2rem; font-weight: 900; color: var(--core); font-family: 'JetBrains Mono', monospace; line-height: 1; letter-spacing: -0.03em; }
        .dz-headline-unit { font-size: 1rem; color: var(--text-dim); margin-bottom: 0.5rem; }
        .dz-headline-sub { text-align: center; font-size: 0.82rem; color: var(--text-dim); margin-top: 0.4rem; }
        .dz-tag { display: inline-block; margin-left: 0.4rem; padding: 2px 8px; border-radius: 100px; background: rgba(var(--core-rgb),0.15); color: var(--core); font-size: 0.68rem; font-weight: 700; }

        .dz-metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin: 1.25rem 0; }
        .dz-metric { background: var(--bg3); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0.7rem 0.85rem; }
        .dz-metric-k { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-mute); }
        .dz-metric-v { font-size: 1.05rem; font-weight: 800; font-family: 'JetBrains Mono', monospace; color: var(--text); margin-top: 2px; }

        .dz-checks { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1.25rem; }
        .dz-check { display: flex; gap: 0.6rem; align-items: flex-start; padding: 0.6rem 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border); }
        .dz-check.ok { background: rgba(var(--ground-rgb),0.06); border-color: rgba(var(--ground-rgb),0.25); }
        .dz-check.no { background: rgba(var(--hot-rgb),0.06); border-color: rgba(var(--hot-rgb),0.28); }
        .dz-check-mark { font-weight: 900; flex-shrink: 0; }
        .dz-check.ok .dz-check-mark { color: var(--ground); }
        .dz-check.no .dz-check-mark { color: var(--hot); }
        .dz-check-label { font-size: 0.85rem; font-weight: 700; color: var(--text); }
        .dz-check-detail { font-size: 0.78rem; color: var(--text-dim); font-family: 'JetBrains Mono', monospace; margin-top: 1px; }

        .dz-export { width: 100%; padding: 0.8rem; border-radius: var(--radius-sm); background: var(--core); color: #000; border: none; font-family: inherit; font-size: 0.9rem; font-weight: 800; cursor: pointer; transition: opacity 0.16s, transform 0.14s; }
        .dz-export:hover { opacity: 0.9; transform: translateY(-1px); }
        .dz-disclaimer { font-size: 0.74rem; color: var(--text-mute); line-height: 1.55; margin-top: 0.875rem; text-align: center; }

        @media (max-width: 920px) {
          .dz-layout { grid-template-columns: 1fr; }
          .dz-result { position: static; }
        }

        /* Print — only the summary */
        .dz-report { display: none; }
        @media print {
          .nav, main, footer { display: none !important; }
          .dz-report { display: block !important; color: #111; }
          @page { margin: 16mm; }
          body { background: #fff !important; }
          .dz-report-head { border-bottom: 2px solid #F0A500; padding-bottom: 10px; margin-bottom: 18px; }
          .dz-report-brand { font-size: 20px; font-weight: 900; color: #111; }
          .dz-report-title { font-size: 13px; color: #333; margin-top: 2px; }
          .dz-report-date { font-size: 11px; color: #666; margin-top: 4px; }
          .dz-report-table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 14px; }
          .dz-report-table th { text-align: left; width: 40%; background: #f5f5f5; color: #333; padding: 6px 10px; border: 1px solid #ddd; font-weight: 600; }
          .dz-report-table td { padding: 6px 10px; border: 1px solid #ddd; color: #111; font-weight: 500; }
          .dz-report-verdict { font-size: 14px; font-weight: 800; margin: 10px 0 6px; color: #111; }
          .dz-report-checks { list-style: none; padding: 0; margin: 0 0 14px; font-size: 11px; color: #222; }
          .dz-report-checks li { padding: 3px 0; border-bottom: 1px dotted #ddd; }
          .dz-report-foot { font-size: 10px; color: #666; line-height: 1.5; border-top: 1px solid #ddd; padding-top: 8px; }
        }
      `}</style>
    </>
  );
}

/* ── small field helpers ── */
function Field({ label, unit, val, on, ph }: { label: string; unit: string; val: string; on: (v: string) => void; ph: string }) {
  return (
    <div className="dz-fg">
      <label>{label} <span>({unit})</span></label>
      <input type="number" inputMode="decimal" value={val} placeholder={ph} onChange={(e) => on(e.target.value)} />
    </div>
  );
}
function Select({ label, val, on, opts }: { label: string; val: string; on: (v: string) => void; opts: { v: string; t: string }[] }) {
  return (
    <div className="dz-fg">
      <label>{label}</label>
      <select value={val} onChange={(e) => on(e.target.value)}>
        {opts.map((o) => <option key={o.v} value={o.v}>{o.t}</option>)}
      </select>
    </div>
  );
}
function Metric({ k, v }: { k: string; v: string }) {
  return <div className="dz-metric"><div className="dz-metric-k">{k}</div><div className="dz-metric-v">{v}</div></div>;
}
