"use client";
import { useState, useCallback } from "react";
import Link from "next/link";

type CalcResult = { value: string; unit: string; note?: string } | null;

/* ── individual calculators ─────────────────────────── */
function ohmsLaw(v: string, i: string, r: string): CalcResult {
  const V = parseFloat(v), I = parseFloat(i), R = parseFloat(r);
  if (!isNaN(V) && !isNaN(I)) return { value: (V / I).toFixed(3), unit: "Ω", note: "R = V ÷ I" };
  if (!isNaN(V) && !isNaN(R)) return { value: (V / R).toFixed(3), unit: "A", note: "I = V ÷ R" };
  if (!isNaN(I) && !isNaN(R)) return { value: (I * R).toFixed(3), unit: "V", note: "V = I × R" };
  return null;
}

function powerCalc(v: string, i: string): CalcResult {
  const V = parseFloat(v), I = parseFloat(i);
  if (isNaN(V) || isNaN(I)) return null;
  return { value: (V * I).toFixed(2), unit: "W", note: "P = V × I" };
}

function voltageDrop(v: string, i: string, len: string, res: string): CalcResult {
  const I = parseFloat(i), L = parseFloat(len), R = parseFloat(res);
  if (isNaN(I) || isNaN(L) || isNaN(R)) return null;
  const drop = (2 * I * L * R) / 1000;
  const pct = parseFloat(v) ? ((drop / parseFloat(v)) * 100).toFixed(2) : null;
  return {
    value: drop.toFixed(3),
    unit: "V",
    note: pct ? `${pct}% drop — ${parseFloat(pct) > 3 ? "⚠ Exceeds 3% — upsize cable" : "✓ Within limit"}` : "Voltage drop across cable run",
  };
}

function resistorSeriesParallel(r1: string, r2: string, r3: string, mode: "series" | "parallel"): CalcResult {
  const vals = [r1, r2, r3].map(parseFloat).filter((n) => !isNaN(n));
  if (vals.length < 2) return null;
  if (mode === "series") {
    return { value: vals.reduce((a, b) => a + b, 0).toFixed(3), unit: "Ω", note: "R_total = R1 + R2 + R3" };
  }
  const inv = vals.reduce((a, b) => a + 1 / b, 0);
  return { value: (1 / inv).toFixed(3), unit: "Ω", note: "1/R_total = 1/R1 + 1/R2 + 1/R3" };
}

function ledResistor(supply: string, vf: string, ifma: string): CalcResult {
  const Vs = parseFloat(supply), Vf = parseFloat(vf), If = parseFloat(ifma);
  if (isNaN(Vs) || isNaN(Vf) || isNaN(If)) return null;
  const R = (Vs - Vf) / (If / 1000);
  if (R <= 0) return { value: "Error", unit: "", note: "Supply must be greater than LED forward voltage" };
  return { value: R.toFixed(1), unit: "Ω", note: `Use nearest standard value · Power dissipated: ${((If / 1000) ** 2 * R * 1000).toFixed(0)} mW` };
}

function powerFactor(kw: string, kva: string): CalcResult {
  const KW = parseFloat(kw), KVA = parseFloat(kva);
  if (isNaN(KW) || isNaN(KVA) || KVA === 0) return null;
  const pf = KW / KVA;
  return {
    value: pf.toFixed(3),
    unit: "PF",
    note: pf < 0.85 ? "⚠ Below 0.85 — correction capacitors recommended" : "✓ Acceptable power factor",
  };
}

function cableSizing(i: string, vd: string, len: string): CalcResult {
  const I = parseFloat(i), VD = parseFloat(vd), L = parseFloat(len);
  if (isNaN(I) || isNaN(VD) || isNaN(L)) return null;
  const rho = 0.0175; // copper resistivity mΩ·mm²/m
  const minArea = (2 * rho * L * I) / VD;
  const sizes = [1, 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120];
  const selected = sizes.find((s) => s >= minArea) ?? 120;
  return { value: selected.toString(), unit: "mm²", note: `Min calc area: ${minArea.toFixed(2)} mm² — next standard size selected` };
}

function dividerVoltage(vin: string, r1: string, r2: string): CalcResult {
  const Vin = parseFloat(vin), R1 = parseFloat(r1), R2 = parseFloat(r2);
  if (isNaN(Vin) || isNaN(R1) || isNaN(R2) || R1 + R2 === 0) return null;
  const vout = Vin * (R2 / (R1 + R2));
  return { value: vout.toFixed(3), unit: "V", note: "Vout = Vin × R2 / (R1 + R2)" };
}

/* ── Types ─────────────────────────────────────────── */
interface CalcField { id: string; label: string; placeholder: string; unit: string; }
interface CalcDef {
  id: string; title: string; desc: string; icon: string;
  fields: CalcField[];
  extra?: { id: string; label: string; options: string[] };
  compute: (vals: Record<string, string>) => CalcResult;
}

const CALCS: CalcDef[] = [
  {
    id: "ohms", title: "Ohm's Law", icon: "⚡", desc: "Fill any two fields — the third is calculated automatically.",
    fields: [
      { id: "v", label: "Voltage (V)", placeholder: "e.g. 230", unit: "V" },
      { id: "i", label: "Current (I)", placeholder: "e.g. 10", unit: "A" },
      { id: "r", label: "Resistance (R)", placeholder: "e.g. 23", unit: "Ω" },
    ],
    compute: (vals) => ohmsLaw(vals.v, vals.i, vals.r),
  },
  {
    id: "power", title: "Power (P = VI)", icon: "💡", desc: "Calculate power given voltage and current.",
    fields: [
      { id: "v", label: "Voltage", placeholder: "230", unit: "V" },
      { id: "i", label: "Current", placeholder: "10", unit: "A" },
    ],
    compute: (vals) => powerCalc(vals.v, vals.i),
  },
  {
    id: "vdrop", title: "Voltage Drop", icon: "📉", desc: "Calculate voltage drop across a cable run. Limit is 3% for most circuits.",
    fields: [
      { id: "v", label: "Supply Voltage", placeholder: "230", unit: "V" },
      { id: "i", label: "Load Current", placeholder: "16", unit: "A" },
      { id: "len", label: "Cable Length", placeholder: "25", unit: "m" },
      { id: "res", label: "Conductor Resistance", placeholder: "7.41", unit: "mΩ/m" },
    ],
    compute: (vals) => voltageDrop(vals.v, vals.i, vals.len, vals.res),
  },
  {
    id: "res", title: "Resistors in Series / Parallel", icon: "🔗", desc: "Calculate total resistance for combined resistor networks.",
    fields: [
      { id: "r1", label: "R1", placeholder: "100", unit: "Ω" },
      { id: "r2", label: "R2", placeholder: "220", unit: "Ω" },
      { id: "r3", label: "R3 (optional)", placeholder: "470", unit: "Ω" },
    ],
    extra: { id: "mode", label: "Connection", options: ["series", "parallel"] },
    compute: (vals) => resistorSeriesParallel(vals.r1, vals.r2, vals.r3, (vals.mode || "series") as "series" | "parallel"),
  },
  {
    id: "led", title: "LED Resistor", icon: "💠", desc: "Find the limiting resistor value for an LED circuit.",
    fields: [
      { id: "supply", label: "Supply Voltage", placeholder: "12", unit: "V" },
      { id: "vf", label: "LED Forward Voltage", placeholder: "2.1", unit: "V" },
      { id: "ifma", label: "LED Forward Current", placeholder: "20", unit: "mA" },
    ],
    compute: (vals) => ledResistor(vals.supply, vals.vf, vals.ifma),
  },
  {
    id: "pf", title: "Power Factor", icon: "📊", desc: "Calculate power factor from real (kW) and apparent (kVA) power.",
    fields: [
      { id: "kw", label: "Real Power", placeholder: "18", unit: "kW" },
      { id: "kva", label: "Apparent Power", placeholder: "22", unit: "kVA" },
    ],
    compute: (vals) => powerFactor(vals.kw, vals.kva),
  },
  {
    id: "cable", title: "Cable Sizing", icon: "🔧", desc: "Select minimum copper cable cross-section based on current and allowable voltage drop.",
    fields: [
      { id: "i", label: "Load Current", placeholder: "32", unit: "A" },
      { id: "vd", label: "Max Allowable Voltage Drop", placeholder: "6.9", unit: "V" },
      { id: "len", label: "One-Way Cable Length", placeholder: "30", unit: "m" },
    ],
    compute: (vals) => cableSizing(vals.i, vals.vd, vals.len),
  },
  {
    id: "divider", title: "Voltage Divider", icon: "🔀", desc: "Calculate output voltage from a resistive voltage divider network.",
    fields: [
      { id: "vin", label: "Input Voltage", placeholder: "12", unit: "V" },
      { id: "r1", label: "R1 (top)", placeholder: "10000", unit: "Ω" },
      { id: "r2", label: "R2 (bottom)", placeholder: "10000", unit: "Ω" },
    ],
    compute: (vals) => dividerVoltage(vals.vin, vals.r1, vals.r2),
  },
];

function CalcBlock({ calc }: { calc: CalcDef }) {
  const initVals = Object.fromEntries(calc.fields.map((f) => [f.id, ""]));
  if (calc.extra) initVals[calc.extra.id] = calc.extra.options[0];
  const [vals, setVals] = useState<Record<string, string>>(initVals);
  const result = useCallback(() => calc.compute(vals), [calc, vals])();

  return (
    <div className="calc-card" id={calc.id}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
        <span style={{ fontSize: "1.5rem" }}>{calc.icon}</span>
        <div className="calc-title">{calc.title}</div>
      </div>
      <div className="calc-desc">{calc.desc}</div>
      <div className="calc-grid">
        {calc.fields.map((f) => (
          <div key={f.id} className="form-group">
            <label className="form-label">{f.label} ({f.unit})</label>
            <input
              className="form-input"
              type="number"
              placeholder={f.placeholder}
              value={vals[f.id]}
              onChange={(e) => setVals((prev) => ({ ...prev, [f.id]: e.target.value }))}
            />
          </div>
        ))}
        {calc.extra && (
          <div className="form-group">
            <label className="form-label">{calc.extra.label}</label>
            <select
              className="form-input"
              value={vals[calc.extra.id]}
              onChange={(e) => setVals((prev) => ({ ...prev, [calc.extra!.id]: e.target.value }))}
              style={{ cursor: "pointer" }}
            >
              {calc.extra.options.map((o) => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
            </select>
          </div>
        )}
      </div>
      {result ? (
        <div className="calc-result">
          <div>
            <div className="calc-result-label">{calc.title}</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
              <div className="calc-result-value">{result.value}</div>
              <div className="calc-result-unit">{result.unit}</div>
            </div>
            {result.note && <div style={{ fontSize: "0.8rem", color: "var(--text-dim)", marginTop: "0.4rem" }}>{result.note}</div>}
          </div>
        </div>
      ) : (
        <div style={{ padding: "1rem", background: "var(--bg3)", borderRadius: "var(--radius-sm)", fontSize: "0.875rem", color: "var(--text-mute)", textAlign: "center" }}>
          Fill in values above to see result
        </div>
      )}
    </div>
  );
}

export default function CalculatePage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const shown = activeId ? CALCS.filter((c) => c.id === activeId) : CALCS;

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <div className="nav-logo-mark">E</div>
          <span className="nav-logo-text">ElectraCore</span>
        </Link>
        <div className="nav-links">
          <Link href="/calculate" className="nav-link" style={{ color: "var(--core)" }}>Calculate</Link>
          <Link href="/guides" className="nav-link">Guides</Link>
          <Link href="/learn" className="nav-link">Learn</Link>
        </div>
        <Link href="/" className="btn-ghost" style={{ padding: "0.4rem 1rem", fontSize: "0.85rem" }}>← Home</Link>
      </nav>

      <main style={{ paddingTop: "80px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1.5rem 1.5rem" }}>
          <p className="section-label">Calculators</p>
          <h1 className="section-title">Electrical Calculators</h1>
          <p className="section-sub">
            Instant results for the calculations you run every day. No formulas to memorise — just fill in what you know.
          </p>

          <div className="tabs" style={{ marginBottom: "2rem" }}>
            <button className={`tab ${!activeId ? "active" : ""}`} onClick={() => setActiveId(null)}>All ({CALCS.length})</button>
            {CALCS.map((c) => (
              <button
                key={c.id}
                className={`tab ${activeId === c.id ? "active" : ""}`}
                onClick={() => setActiveId(activeId === c.id ? null : c.id)}
              >
                {c.icon} {c.title}
              </button>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem 5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%,480px),1fr))", gap: "1.5rem" }}>
            {shown.map((calc) => <CalcBlock key={calc.id} calc={calc} />)}
          </div>
        </div>
      </main>
    </>
  );
}
