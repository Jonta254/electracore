"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ElectraCoreLogoMark } from "../components/Logo";

type CalcResult = { value: string; unit: string; note?: string; error?: boolean } | null;

const err = (note: string): CalcResult => ({ value: "Error", unit: "", note, error: true });

/* ── individual calculators ─────────────────────────────
   Each returns the computed value, its unit, and a note that
   shows the formula used or flags a limit. Guards reject the
   physically-impossible inputs (divide-by-zero, negatives)
   instead of silently returning Infinity or NaN.
──────────────────────────────────────────────────────── */
function ohmsLaw(v: string, i: string, r: string): CalcResult {
  const V = parseFloat(v), I = parseFloat(i), R = parseFloat(r);
  if (!isNaN(V) && !isNaN(I)) {
    if (I === 0) return err("Current cannot be zero when solving for resistance.");
    return { value: (V / I).toFixed(3), unit: "Ω", note: "R = V ÷ I" };
  }
  if (!isNaN(V) && !isNaN(R)) {
    if (R === 0) return err("Resistance cannot be zero when solving for current.");
    return { value: (V / R).toFixed(3), unit: "A", note: "I = V ÷ R" };
  }
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
  if (I < 0 || L < 0 || R < 0) return err("Current, length, and resistance must be positive.");
  // R is per-conductor mΩ/m; ×2 accounts for the go-and-return path (single phase).
  const drop = (2 * I * L * R) / 1000;
  const supply = parseFloat(v);
  const pct = supply ? ((drop / supply) * 100) : null;
  return {
    value: drop.toFixed(3),
    unit: "V",
    note: pct !== null
      ? `${pct.toFixed(2)}% of supply: ${pct > 3 ? "Review: exceeds the common 3% limit; consider a larger conductor" : "Within the common 3% guideline"}`
      : "Single-phase drop across the run (×2 for go + return). Enter supply voltage to see % drop.",
  };
}

function resistorSeriesParallel(r1: string, r2: string, r3: string, mode: "series" | "parallel"): CalcResult {
  const vals = [r1, r2, r3].map(parseFloat).filter((n) => !isNaN(n));
  if (vals.length < 2) return null;
  if (vals.some((n) => n < 0)) return err("Resistance values must be positive.");
  if (mode === "series") {
    return { value: vals.reduce((a, b) => a + b, 0).toFixed(3), unit: "Ω", note: "R_total = R1 + R2 + R3" };
  }
  if (vals.some((n) => n === 0)) return err("A 0 Ω parallel branch short-circuits the network (R_total = 0).");
  const inv = vals.reduce((a, b) => a + 1 / b, 0);
  return { value: (1 / inv).toFixed(3), unit: "Ω", note: "1 / R_total = 1/R1 + 1/R2 + 1/R3" };
}

function ledResistor(supply: string, vf: string, ifma: string): CalcResult {
  const Vs = parseFloat(supply), Vf = parseFloat(vf), If = parseFloat(ifma);
  if (isNaN(Vs) || isNaN(Vf) || isNaN(If)) return null;
  if (If <= 0) return err("Forward current must be greater than zero.");
  const R = (Vs - Vf) / (If / 1000);
  if (R <= 0) return err("Supply voltage must be greater than the LED forward voltage.");
  const powerMw = (If / 1000) ** 2 * R * 1000;
  return {
    value: R.toFixed(1),
    unit: "Ω",
    note: `R = (Vs − Vf) ÷ I · use the next standard value up · resistor dissipates ${powerMw.toFixed(0)} mW`,
  };
}

function powerFactor(kw: string, kva: string): CalcResult {
  const KW = parseFloat(kw), KVA = parseFloat(kva);
  if (isNaN(KW) || isNaN(KVA)) return null;
  if (KVA <= 0) return err("Apparent power (kVA) must be greater than zero.");
  if (KW > KVA) return err("Real power (kW) cannot exceed apparent power (kVA).");
  const pf = KW / KVA;
  return {
    value: pf.toFixed(3),
    unit: "PF",
    note: pf < 0.85 ? "Review: below 0.85: correction capacitors are usually worthwhile" : "Acceptable power factor (PF = kW ÷ kVA)",
  };
}

function cableSizing(i: string, vd: string, len: string): CalcResult {
  const I = parseFloat(i), VD = parseFloat(vd), L = parseFloat(len);
  if (isNaN(I) || isNaN(VD) || isNaN(L)) return null;
  if (VD <= 0) return err("Allowable voltage drop must be greater than zero.");
  if (I < 0 || L < 0) return err("Current and length must be positive.");
  const rho = 0.0175; // resistivity of copper ≈ 0.0175 Ω·mm²/m at ~20 °C
  const minArea = (2 * rho * L * I) / VD;
  const sizes = [1, 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120];
  const selected = sizes.find((s) => s >= minArea);
  if (!selected) return err(`Minimum area ${minArea.toFixed(1)} mm² exceeds this table (max 120 mm²): this is a specialist run.`);
  return {
    value: selected.toString(),
    unit: "mm²",
    note: `min calculated area ${minArea.toFixed(2)} mm² → next standard size · voltage-drop limited, before derating for grouping/temperature`,
  };
}

function dividerVoltage(vin: string, r1: string, r2: string): CalcResult {
  const Vin = parseFloat(vin), R1 = parseFloat(r1), R2 = parseFloat(r2);
  if (isNaN(Vin) || isNaN(R1) || isNaN(R2)) return null;
  if (R1 < 0 || R2 < 0) return err("Resistance values must be positive.");
  if (R1 + R2 === 0) return err("R1 and R2 cannot both be zero.");
  const vout = Vin * (R2 / (R1 + R2));
  return { value: vout.toFixed(3), unit: "V", note: "Vout = Vin × R2 ÷ (R1 + R2) · unloaded (no load current drawn)" };
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
    id: "ohms", title: "Ohm's Law", icon: "V/I", desc: "Fill any two fields: the third is calculated automatically.",
    fields: [
      { id: "v", label: "Voltage", placeholder: "e.g. 230", unit: "V" },
      { id: "i", label: "Current", placeholder: "e.g. 10", unit: "A" },
      { id: "r", label: "Resistance", placeholder: "e.g. 23", unit: "Ω" },
    ],
    compute: (vals) => ohmsLaw(vals.v, vals.i, vals.r),
  },
  {
    id: "power", title: "Power (P = VI)", icon: "W", desc: "Calculate power from voltage and current.",
    fields: [
      { id: "v", label: "Voltage", placeholder: "230", unit: "V" },
      { id: "i", label: "Current", placeholder: "10", unit: "A" },
    ],
    compute: (vals) => powerCalc(vals.v, vals.i),
  },
  {
    id: "vdrop", title: "Voltage Drop", icon: "ΔV", desc: "Single-phase drop across a cable run. The common limit is 3% of supply.",
    fields: [
      { id: "v", label: "Supply Voltage", placeholder: "230", unit: "V" },
      { id: "i", label: "Load Current", placeholder: "16", unit: "A" },
      { id: "len", label: "Cable Length", placeholder: "25", unit: "m" },
      { id: "res", label: "Conductor Resistance", placeholder: "7.41", unit: "mΩ/m" },
    ],
    compute: (vals) => voltageDrop(vals.v, vals.i, vals.len, vals.res),
  },
  {
    id: "res", title: "Resistors in Series / Parallel", icon: "R∥", desc: "Total resistance of a two- or three-resistor network.",
    fields: [
      { id: "r1", label: "R1", placeholder: "100", unit: "Ω" },
      { id: "r2", label: "R2", placeholder: "220", unit: "Ω" },
      { id: "r3", label: "R3 (optional)", placeholder: "470", unit: "Ω" },
    ],
    extra: { id: "mode", label: "Connection", options: ["series", "parallel"] },
    compute: (vals) => resistorSeriesParallel(vals.r1, vals.r2, vals.r3, (vals.mode || "series") as "series" | "parallel"),
  },
  {
    id: "led", title: "LED Resistor", icon: "LED", desc: "Series resistor value to drive an LED safely.",
    fields: [
      { id: "supply", label: "Supply Voltage", placeholder: "12", unit: "V" },
      { id: "vf", label: "LED Forward Voltage", placeholder: "2.1", unit: "V" },
      { id: "ifma", label: "LED Forward Current", placeholder: "20", unit: "mA" },
    ],
    compute: (vals) => ledResistor(vals.supply, vals.vf, vals.ifma),
  },
  {
    id: "pf", title: "Power Factor", icon: "PF", desc: "Power factor from real (kW) and apparent (kVA) power.",
    fields: [
      { id: "kw", label: "Real Power", placeholder: "18", unit: "kW" },
      { id: "kva", label: "Apparent Power", placeholder: "22", unit: "kVA" },
    ],
    compute: (vals) => powerFactor(vals.kw, vals.kva),
  },
  {
    id: "cable", title: "Cable Sizing", icon: "mm²", desc: "Minimum copper cross-section limited by voltage drop.",
    fields: [
      { id: "i", label: "Load Current", placeholder: "32", unit: "A" },
      { id: "vd", label: "Max Allowable Voltage Drop", placeholder: "6.9", unit: "V" },
      { id: "len", label: "One-Way Cable Length", placeholder: "30", unit: "m" },
    ],
    compute: (vals) => cableSizing(vals.i, vals.vd, vals.len),
  },
  {
    id: "divider", title: "Voltage Divider", icon: "Vout", desc: "Output voltage from a resistive divider (no load).",
    fields: [
      { id: "vin", label: "Input Voltage", placeholder: "12", unit: "V" },
      { id: "r1", label: "R1 (top)", placeholder: "10000", unit: "Ω" },
      { id: "r2", label: "R2 (bottom)", placeholder: "10000", unit: "Ω" },
    ],
    compute: (vals) => dividerVoltage(vals.vin, vals.r1, vals.r2),
  },
];

/* ── Calculation history (persisted locally) ────────── */
interface HistEntry {
  id: string;
  calc: string;
  inputs: string;
  value: string;
  unit: string;
  note?: string;
  ts: number;
}
const LS_KEY = "electracore.calc.history.v1";

function newId(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch { /* ignore */ }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/* ── Single calculator card ─────────────────────────── */
function CalcBlock({ calc, onSave }: { calc: CalcDef; onSave: (e: Omit<HistEntry, "id" | "ts">) => void }) {
  const initVals = Object.fromEntries(calc.fields.map((f) => [f.id, ""]));
  if (calc.extra) initVals[calc.extra.id] = calc.extra.options[0];
  const [vals, setVals] = useState<Record<string, string>>(initVals);
  const [flash, setFlash] = useState<"" | "saved" | "copied">("");

  const result = calc.compute(vals);
  const usable = result !== null && !result.error;

  const inputsSummary = calc.fields
    .filter((f) => vals[f.id] !== "" && vals[f.id] !== undefined)
    .map((f) => `${f.label.replace(/\s*\(.*?\)/, "")} ${vals[f.id]} ${f.unit}`)
    .join(", ") + (calc.extra ? ` · ${vals[calc.extra.id]}` : "");

  const flashFor = (kind: "saved" | "copied") => {
    setFlash(kind);
    window.setTimeout(() => setFlash(""), 1600);
  };

  const handleSave = () => {
    if (!usable || !result) return;
    onSave({ calc: calc.title, inputs: inputsSummary, value: result.value, unit: result.unit, note: result.note });
    flashFor("saved");
  };

  const handleCopy = async () => {
    if (!usable || !result) return;
    const ok = await copyText(`${result.value} ${result.unit}: ${calc.title} (${inputsSummary})`.trim());
    if (ok) flashFor("copied");
  };

  return (
    <div className="calc-card" id={calc.id}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
        <span style={{ fontSize: "1.5rem" }} aria-hidden>{calc.icon}</span>
        <div className="calc-title">{calc.title}</div>
      </div>
      <div className="calc-desc">{calc.desc}</div>
      <div className="calc-grid">
        {calc.fields.map((f) => {
          const inputId = `${calc.id}-${f.id}`;
          return (
            <div key={f.id} className="form-group">
              <label className="form-label" htmlFor={inputId}>
                {f.label} <span style={{ color: "var(--text-mute)" }}>({f.unit})</span>
              </label>
              <input
                id={inputId}
                className="form-input"
                type="number"
                inputMode="decimal"
                placeholder={f.placeholder}
                value={vals[f.id]}
                onChange={(e) => setVals((prev) => ({ ...prev, [f.id]: e.target.value }))}
              />
            </div>
          );
        })}
        {calc.extra && (
          <div className="form-group">
            <label className="form-label" htmlFor={`${calc.id}-${calc.extra.id}`}>{calc.extra.label}</label>
            <select
              id={`${calc.id}-${calc.extra.id}`}
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

      <div aria-live="polite">
        {result ? (
          result.error ? (
            <div className="calc-result calc-result-error">
              <span aria-hidden className="calc-status-label">Review</span>
              <div style={{ fontSize: "0.85rem", color: "var(--hot)", lineHeight: 1.5 }}>{result.note}</div>
            </div>
          ) : (
            <div className="calc-result">
              <div style={{ flex: 1 }}>
                <div className="calc-result-label">{calc.title}</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
                  <div className="calc-result-value">{result.value}</div>
                  <div className="calc-result-unit">{result.unit}</div>
                </div>
                {result.note && <div style={{ fontSize: "0.8rem", color: "var(--text-dim)", marginTop: "0.4rem", lineHeight: 1.5 }}>{result.note}</div>}
              </div>
              <div className="calc-actions">
                <button type="button" className="calc-action-btn" onClick={handleSave}>
                  {flash === "saved" ? "Saved" : "Save"}
                </button>
                <button type="button" className="calc-action-btn" onClick={handleCopy}>
                  {flash === "copied" ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          )
        ) : (
          <div style={{ padding: "1rem", background: "var(--bg3)", borderRadius: "var(--radius-sm)", fontSize: "0.875rem", color: "var(--text-mute)", textAlign: "center" }}>
            Fill in values above to see the result
          </div>
        )}
      </div>
    </div>
  );
}

/* ── History panel ──────────────────────────────────── */
function HistoryPanel({ history, onRemove, onClear, onExport }: { history: HistEntry[]; onRemove: (id: string) => void; onClear: () => void; onExport: () => void }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyEntry = async (e: HistEntry) => {
    const ok = await copyText(`${e.value} ${e.unit}: ${e.calc} (${e.inputs})`.trim());
    if (ok) {
      setCopiedId(e.id);
      window.setTimeout(() => setCopiedId((c) => (c === e.id ? null : c)), 1400);
    }
  };

  return (
    <aside id="saved-calculations" className="hist-panel" aria-label="Saved calculations">
      <div className="hist-head">
        <div>
          <div className="hist-title">Saved calculations</div>
          <div className="hist-sub">{history.length === 0 ? "Stored on this device" : `${history.length} saved · this device only`}</div>
        </div>
        {history.length > 0 && (
          <div className="hist-head-actions">
            <button type="button" className="hist-export" onClick={onExport} title="Print or save your saved calculations as a PDF">⎙ PDF</button>
            <button type="button" className="hist-clear" onClick={onClear}>Clear all</button>
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="hist-empty">
          <div className="hist-empty-label">Saved results</div>
          <div style={{ fontWeight: 700, color: "var(--text)", marginBottom: "0.35rem" }}>Nothing saved yet</div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-dim)", lineHeight: 1.6 }}>
            Run a calculation and press <strong>Save</strong> to keep the result here: handy when you&apos;re working a job and need to compare a few figures side by side.
          </p>
        </div>
      ) : (
        <ul className="hist-list">
          {history.map((e) => (
            <li key={e.id} className="hist-item">
              <div className="hist-item-main">
                <div className="hist-item-val">{e.value} <span>{e.unit}</span></div>
                <div className="hist-item-calc">{e.calc}</div>
                {e.inputs && <div className="hist-item-inputs">{e.inputs}</div>}
                <time className="hist-item-time" dateTime={new Date(e.ts).toISOString()}>
                  {new Date(e.ts).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </time>
              </div>
              <div className="hist-item-actions">
                <button type="button" className="hist-icon-btn" onClick={() => copyEntry(e)} aria-label={`Copy ${e.calc} result`}>
                  {copiedId === e.id ? "Done" : "Copy"}
                </button>
                <button type="button" className="hist-icon-btn" onClick={() => onRemove(e.id)} aria-label={`Delete ${e.calc} result`}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

export default function CalculatePage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [history, setHistory] = useState<HistEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch { /* corrupt or unavailable storage: start empty */ }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(history));
    } catch { /* storage full or blocked: keep in memory */ }
  }, [history, mounted]);

  const addEntry = (e: Omit<HistEntry, "id" | "ts">) =>
    setHistory((prev) => [{ ...e, id: newId(), ts: Date.now() }, ...prev].slice(0, 50));
  const removeEntry = (id: string) => setHistory((prev) => prev.filter((e) => e.id !== id));
  const clearAll = () => setHistory([]);

  const shown = activeId ? CALCS.filter((c) => c.id === activeId) : CALCS;

  const exportReport = () => {
    if (typeof window !== "undefined") window.print();
  };

  const reportDate = new Date().toLocaleString([], { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* Print-only report: hidden on screen, rendered when the user prints / saves as PDF */}
      <div className="calc-report" aria-hidden>
        <div className="calc-report-head">
          <div className="calc-report-brand">ElectraCore</div>
          <div className="calc-report-title">Calculation Report</div>
          <div className="calc-report-date">Generated {reportDate} · {history.length} calculation{history.length !== 1 ? "s" : ""}</div>
        </div>
        <table className="calc-report-table">
          <thead>
            <tr><th>Calculation</th><th>Inputs</th><th>Result</th><th>Notes</th><th>Saved</th></tr>
          </thead>
          <tbody>
            {history.map((e) => (
              <tr key={e.id}>
                <td>{e.calc}</td>
                <td>{e.inputs}</td>
                <td className="calc-report-val">{e.value} {e.unit}</td>
                <td>{e.note}</td>
                <td>{new Date(e.ts).toLocaleString([], { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="calc-report-foot">
          Results are first-principles / voltage-drop calculations. Always verify against the wiring regulations for your
          installation before relying on any figure. ElectraCore · electracore reference tool.
        </div>
      </div>

      <nav className="nav">
        <Link href="/" className="nav-logo">
          <ElectraCoreLogoMark size={32} />
          <span className="nav-logo-text">ElectraCore</span>
        </Link>
        <div className="nav-links">
          <Link href="/design" className="nav-link">Design</Link>
          <Link href="/calculate" className="nav-link" style={{ color: "var(--core)" }}>Calculate</Link>
          <Link href="/guides" className="nav-link">Guides</Link>
          <Link href="/learn" className="nav-link">Learn</Link>
        </div>
        <Link href="/" className="btn-ghost" style={{ padding: "0.4rem 1rem", fontSize: "0.85rem" }}>← Home</Link>
      </nav>

      <main style={{ paddingTop: "80px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "3rem 1.5rem 1.5rem" }}>
          <p className="section-label">Calculators</p>
          <h1 className="section-title">Electrical Calculators</h1>
          <p className="section-sub">
            The calculations you run every day, with the formula shown and results you can save. Every answer is voltage-drop or first-principles
            math: always verify against the wiring regulations for your installation before you rely on it.
          </p>

          <Link href="/design" className="calc-designer-banner">
            <div className="calc-designer-icon" aria-hidden>DESIGN</div>
            <div className="calc-designer-copy">
              <div className="calc-designer-title">Need the whole circuit, not one number?</div>
              <div className="calc-designer-sub">Open the Circuit Designer: load → device → cable size → voltage drop → pass/fail, with a printable summary.</div>
            </div>
            <span className="calc-designer-go">Open Designer →</span>
          </Link>

          <div className="tabs" style={{ marginBottom: "0.5rem" }}>
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

        <div className="calc-layout">
          <div className="calc-column">
            {shown.map((calc) => <CalcBlock key={calc.id} calc={calc} onSave={addEntry} />)}
          </div>
          <div className="calc-side">
            {mounted && <HistoryPanel history={history} onRemove={removeEntry} onClear={clearAll} onExport={exportReport} />}
          </div>
        </div>
      </main>

      <style>{`
        .calc-designer-banner {
          display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;
          padding: 1.1rem 1.4rem; border-radius: var(--radius); text-decoration: none;
          background: linear-gradient(135deg, rgba(var(--core-rgb),0.12), rgba(var(--volt-rgb),0.07));
          border: 1px solid rgba(var(--core-rgb),0.3); transition: border-color 0.2s, transform 0.2s;
        }
        .calc-designer-banner:hover { border-color: rgba(var(--core-rgb),0.6); transform: translateY(-2px); }
        .calc-designer-icon { font-size: 1.6rem; flex-shrink: 0; }
        .calc-designer-copy { flex: 1; min-width: 0; }
        .calc-designer-title { font-size: 1rem; font-weight: 800; color: var(--text); }
        .calc-designer-sub { font-size: 0.84rem; color: var(--text-dim); margin-top: 2px; line-height: 1.5; }
        .calc-designer-go { flex-shrink: 0; font-size: 0.85rem; font-weight: 800; color: var(--core); white-space: nowrap; }
        @media (max-width: 640px) { .calc-designer-banner { flex-wrap: wrap; } .calc-designer-go { width: 100%; } }

        .calc-layout {
          max-width: 1180px; margin: 0 auto; padding: 1.5rem 1.5rem 5rem;
          display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 1.75rem; align-items: start;
        }
        .calc-column { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 420px), 1fr)); gap: 1.5rem; }
        .calc-side { position: sticky; top: 80px; }
        .calc-result { display: flex; align-items: flex-start; gap: 1rem; }
        .calc-result-error {
          background: rgba(var(--hot-rgb), 0.08); border-color: rgba(var(--hot-rgb), 0.3);
          align-items: center;
        }
        .calc-actions { display: flex; flex-direction: column; gap: 0.4rem; flex-shrink: 0; }
        .calc-action-btn {
          font-family: inherit; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.03em;
          padding: 0.35rem 0.7rem; border-radius: 7px; cursor: pointer;
          background: rgba(var(--core-rgb), 0.12); border: 1px solid rgba(var(--core-rgb), 0.3); color: var(--core);
          transition: background 0.18s, border-color 0.18s; white-space: nowrap; min-width: 68px;
        }
        .calc-action-btn:hover { background: rgba(var(--core-rgb), 0.2); border-color: rgba(var(--core-rgb), 0.5); }
        .calc-action-btn:focus-visible { outline: 2px solid var(--core); outline-offset: 2px; }

        .hist-panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
        .hist-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 0.75rem; padding: 1.1rem 1.1rem 0.85rem; border-bottom: 1px solid var(--border); }
        .hist-title { font-size: 0.95rem; font-weight: 800; }
        .hist-sub { font-size: 0.72rem; color: var(--text-mute); margin-top: 2px; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.02em; }
        .hist-head-actions { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; }
        .hist-export { font-family: inherit; font-size: 0.72rem; font-weight: 700; color: var(--core); background: rgba(var(--core-rgb),0.1); border: 1px solid rgba(var(--core-rgb),0.3); border-radius: 6px; cursor: pointer; padding: 3px 9px; transition: background 0.16s; }
        .hist-export:hover { background: rgba(var(--core-rgb),0.2); }
        .hist-clear { font-family: inherit; font-size: 0.72rem; font-weight: 600; color: var(--text-dim); background: none; border: none; cursor: pointer; padding: 2px 4px; }
        .hist-clear:hover { color: var(--hot); }

        /* ── Print report (screen: hidden; print: the only thing shown) ── */
        .calc-report { display: none; }
        @media print {
          .nav, main { display: none !important; }
          .calc-report { display: block !important; padding: 0; color: #111; }
          @page { margin: 16mm; }
          body { background: #fff !important; }
          .calc-report-head { border-bottom: 2px solid #F0A500; padding-bottom: 10px; margin-bottom: 18px; }
          .calc-report-brand { font-size: 20px; font-weight: 900; letter-spacing: -0.02em; color: #111; }
          .calc-report-title { font-size: 13px; font-weight: 600; color: #333; margin-top: 2px; }
          .calc-report-date { font-size: 11px; color: #666; margin-top: 4px; }
          .calc-report-table { width: 100%; border-collapse: collapse; font-size: 11px; }
          .calc-report-table th { text-align: left; background: #f3f3f3; color: #333; padding: 6px 8px; border: 1px solid #ddd; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; }
          .calc-report-table td { padding: 6px 8px; border: 1px solid #ddd; color: #222; vertical-align: top; line-height: 1.4; }
          .calc-report-val { font-weight: 700; color: #000; white-space: nowrap; }
          .calc-report-table tr { break-inside: avoid; }
          .calc-report-foot { margin-top: 16px; font-size: 10px; color: #666; line-height: 1.5; border-top: 1px solid #ddd; padding-top: 8px; }
        }
        .hist-empty { padding: 2rem 1.25rem; text-align: center; }
        .hist-list { list-style: none; max-height: 70vh; overflow-y: auto; }
        .hist-item { display: flex; align-items: flex-start; gap: 0.5rem; padding: 0.85rem 1.1rem; border-bottom: 1px solid var(--border); }
        .hist-item:last-child { border-bottom: none; }
        .hist-item-main { flex: 1; min-width: 0; }
        .hist-item-val { font-family: 'JetBrains Mono', monospace; font-size: 1.05rem; font-weight: 700; color: var(--core); }
        .hist-item-val span { font-size: 0.78rem; color: var(--text-dim); }
        .hist-item-calc { font-size: 0.8rem; font-weight: 600; margin-top: 1px; }
        .hist-item-inputs { font-size: 0.72rem; color: var(--text-dim); margin-top: 2px; line-height: 1.45; word-break: break-word; }
        .hist-item-time { display: block; font-size: 0.68rem; color: var(--text-mute); margin-top: 4px; font-family: 'JetBrains Mono', monospace; }
        .hist-item-actions { display: flex; flex-direction: column; gap: 0.3rem; flex-shrink: 0; }
        .hist-icon-btn { width: 26px; height: 26px; border-radius: 6px; background: var(--bg3); border: 1px solid var(--border); color: var(--text-dim); cursor: pointer; font-size: 0.8rem; line-height: 1; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
        .hist-icon-btn:hover { color: var(--text); border-color: rgba(255,255,255,0.25); }

        @media (max-width: 900px) {
          .calc-layout { grid-template-columns: 1fr; }
          .calc-side { position: static; }
          .hist-list { max-height: none; }
        }
      `}</style>
    </>
  );
}
