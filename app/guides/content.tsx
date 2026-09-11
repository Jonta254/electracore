import React from "react";
import { ControlLadderDiagram, LightingWiringDiagram, SymbolSheet } from "./electrical-diagrams";
import { FieldSources, FieldWorkflow, ToolkitLinks } from "./field-toolkit";

/* ─────────────────────────────────────────────────────────────
   ElectraCore: Guide content
   Reference material written the way it's used on site. Figures are
   drawn from BS 7671:2018+A4:2026 (the IET Wiring Regulations) and the
   IET On-Site Guide unless a different standard is named in the text.
   Always confirm against the current edition and the standard that
   applies to your installation before you rely on a number.
────────────────────────────────────────────────────────────── */

export type Block =
  | { kind: "p"; text: string }
  | { kind: "list"; ordered?: boolean; items: string[] }
  | { kind: "steps"; items: { title: string; text: string }[] }
  | { kind: "table"; head: string[]; rows: string[][]; caption?: string }
  | { kind: "callout"; tone: "safety" | "note" | "warn" | "tip"; title?: string; text: string }
  | { kind: "formula"; expr: string; where?: string }
  | { kind: "keyvalues"; items: { k: string; v: string }[] }
  | { kind: "swatches"; items: { label: string; hex: string; role: string }[] }
  | { kind: "node"; node: React.ReactNode };

export interface Section { id: string; heading: string; blocks: Block[]; }

export interface Guide {
  slug: string;
  title: string;
  sub: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  cat: string;
  readMins: number;
  updated: string;
  standards: string[];
  summary: string;
  sections: Section[];
  related: string[];
}

/* ── A couple of hand-drawn SVG diagrams in the ElectraCore style ── */

function EarthingDiagram() {
  return (
    <svg viewBox="0 0 640 220" width="100%" style={{ display: "block", background: "#0B0D11", borderRadius: 8 }}>
      <text x="16" y="20" fontFamily="monospace" fontSize="10" fill="#00D4FF" opacity="0.5" letterSpacing="1">EARTHING ARRANGEMENTS · SUPPLY → INSTALLATION</text>
      {[
        { x: 20, label: "TN-S", note: "Separate PE\nback to source", earthAtSource: true, electrode: false, combined: false },
        { x: 230, label: "TN-C-S (PME)", note: "PEN split at\norigin", earthAtSource: true, electrode: false, combined: true },
        { x: 445, label: "TT", note: "Local earth\nelectrode", earthAtSource: false, electrode: true, combined: false },
      ].map((s, i) => (
        <g key={i} transform={`translate(${s.x},34)`}>
          {/* transformer */}
          <circle cx="24" cy="40" r="12" fill="none" stroke="#F0A500" strokeWidth="1.4" opacity="0.8" />
          <circle cx="36" cy="40" r="12" fill="none" stroke="#F0A500" strokeWidth="1.4" opacity="0.8" />
          <text x="30" y="20" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#F0A500" opacity="0.7">SOURCE</text>
          {/* line conductor */}
          <line x1="48" y1="34" x2="150" y2="34" stroke="#FF4444" strokeWidth="1.8" opacity="0.85" />
          <text x="150" y="30" textAnchor="end" fontFamily="monospace" fontSize="8" fill="#FF4444" opacity="0.7">L</text>
          {/* neutral / PEN */}
          <line x1="48" y1="48" x2="150" y2="48" stroke={s.combined ? "#34D399" : "#888"} strokeWidth={s.combined ? 2.4 : 1.8} opacity="0.85" strokeDasharray={s.combined ? "6 3" : "0"} />
          <text x="150" y="60" textAnchor="end" fontFamily="monospace" fontSize="8" fill={s.combined ? "#34D399" : "#aaa"} opacity="0.7">{s.combined ? "PEN" : "N"}</text>
          {/* protective earth path */}
          {!s.combined && s.earthAtSource && (
            <>
              <line x1="48" y1="62" x2="150" y2="62" stroke="#34D399" strokeWidth="1.8" opacity="0.85" />
              <text x="150" y="74" textAnchor="end" fontFamily="monospace" fontSize="8" fill="#34D399" opacity="0.7">PE</text>
            </>
          )}
          {/* consumer unit */}
          <rect x="150" y="24" width="30" height="70" rx="3" fill="#12151A" stroke="#00D4FF" strokeWidth="1.2" opacity="0.7" />
          <text x="165" y="108" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="#00D4FF" opacity="0.6">CU</text>
          {/* MET */}
          {s.combined && (
            <>
              <line x1="165" y1="48" x2="165" y2="120" stroke="#34D399" strokeWidth="1.6" opacity="0.8" />
              <text x="172" y="120" fontFamily="monospace" fontSize="7" fill="#34D399" opacity="0.7">MET</text>
            </>
          )}
          {/* local electrode for TT */}
          {s.electrode && (
            <>
              <line x1="165" y1="94" x2="165" y2="130" stroke="#34D399" strokeWidth="1.6" opacity="0.8" />
              <line x1="156" y1="130" x2="174" y2="130" stroke="#34D399" strokeWidth="2" opacity="0.7" />
              <line x1="159" y1="134" x2="171" y2="134" stroke="#34D399" strokeWidth="1.5" opacity="0.6" />
              <line x1="162" y1="138" x2="168" y2="138" stroke="#34D399" strokeWidth="1.2" opacity="0.5" />
            </>
          )}
          <text x="30" y="160" fontFamily="monospace" fontSize="11" fill="#F0F0F0" opacity="0.9" fontWeight="700">{s.label}</text>
          {s.note.split("\n").map((ln, j) => (
            <text key={j} x="30" y={174 + j * 12} fontFamily="monospace" fontSize="8" fill="#888899" opacity="0.75">{ln}</text>
          ))}
        </g>
      ))}
    </svg>
  );
}

function RCDCoreBalanceDiagram() {
  return (
    <svg viewBox="0 0 520 200" width="100%" style={{ display: "block", background: "#0B0D11", borderRadius: 8 }}>
      <text x="16" y="20" fontFamily="monospace" fontSize="10" fill="#34D399" opacity="0.5" letterSpacing="1">RCD · CORE-BALANCE PRINCIPLE</text>
      {/* toroid */}
      <ellipse cx="150" cy="105" rx="46" ry="58" fill="none" stroke="#00D4FF" strokeWidth="2" opacity="0.6" />
      <ellipse cx="150" cy="105" rx="30" ry="40" fill="none" stroke="#00D4FF" strokeWidth="1.2" opacity="0.4" />
      <text x="150" y="180" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#00D4FF" opacity="0.6">TOROIDAL CORE</text>
      {/* Line in */}
      <line x1="30" y1="85" x2="270" y2="85" stroke="#FF4444" strokeWidth="2" opacity="0.85" />
      <polygon points="270,82 278,85 270,88" fill="#FF4444" opacity="0.8" />
      <text x="34" y="78" fontFamily="monospace" fontSize="9" fill="#FF4444" opacity="0.8">L →  I</text>
      {/* Neutral return */}
      <line x1="270" y1="125" x2="30" y2="125" stroke="#888" strokeWidth="2" opacity="0.85" />
      <polygon points="30,122 22,125 30,128" fill="#888" opacity="0.8" />
      <text x="230" y="140" textAnchor="end" fontFamily="monospace" fontSize="9" fill="#aaa" opacity="0.8">N ←  I</text>
      {/* sense coil + trip */}
      <line x1="150" y1="47" x2="150" y2="30" stroke="#A855F7" strokeWidth="1.6" opacity="0.8" />
      <rect x="118" y="6" width="64" height="24" rx="4" fill="rgba(168,85,247,0.12)" stroke="#A855F7" strokeWidth="1.2" opacity="0.8" />
      <text x="150" y="22" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#A855F7" opacity="0.85">TRIP COIL</text>
      {/* balance note */}
      <text x="330" y="70" fontFamily="monospace" fontSize="9" fill="#34D399" opacity="0.85">Healthy:</text>
      <text x="330" y="86" fontFamily="monospace" fontSize="10" fill="#F0F0F0" opacity="0.75">I(L) = I(N)</text>
      <text x="330" y="100" fontFamily="monospace" fontSize="9" fill="#888" opacity="0.7">flux cancels → no trip</text>
      <text x="330" y="128" fontFamily="monospace" fontSize="9" fill="#FF4444" opacity="0.85">Fault:</text>
      <text x="330" y="144" fontFamily="monospace" fontSize="10" fill="#F0F0F0" opacity="0.75">I(L) − I(N) = ΔI</text>
      <text x="330" y="158" fontFamily="monospace" fontSize="9" fill="#888" opacity="0.7">operation depends on type + test conditions</text>
    </svg>
  );
}

/* Ring final topology: both legs return to the same protective device */
function RingFinalDiagram() {
  const sockets = [[120, 60], [220, 55], [320, 60], [370, 120], [320, 168], [220, 172], [120, 168], [80, 120]];
  return (
    <svg viewBox="0 0 520 210" width="100%" style={{ display: "block", background: "#0B0D11", borderRadius: 8 }}>
      <text x="16" y="20" fontFamily="monospace" fontSize="10" fill="#F0A500" opacity="0.55" letterSpacing="1">RING FINAL · 2.5mm² T&amp;E · 32A MCB</text>
      {/* Consumer unit */}
      <rect x="18" y="86" width="44" height="66" rx="4" fill="#12151A" stroke="#00D4FF" strokeWidth="1.3" />
      <text x="40" y="78" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#00D4FF" opacity="0.7">CU</text>
      <rect x="26" y="98" width="28" height="14" rx="2" fill="#F0A500" opacity="0.8" />
      <text x="40" y="108" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="#0A0A0C">32A</text>
      {/* Ring path: two legs out and back to the same MCB */}
      <path d="M62 104 C 90 40, 400 40, 400 104 C 400 176, 90 176, 62 118"
        fill="none" stroke="#F0A500" strokeWidth="1.8" opacity="0.7" />
      {/* Both legs land on the MCB */}
      <line x1="54" y1="105" x2="62" y2="104" stroke="#F0A500" strokeWidth="2" />
      <line x1="54" y1="117" x2="62" y2="118" stroke="#F0A500" strokeWidth="2" />
      {/* Sockets around the ring */}
      {sockets.map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 13} y={y - 11} width="26" height="22" rx="3" fill="#0D1014" stroke="#34D399" strokeWidth="1.1" />
          <circle cx={x - 5} cy={y} r="2.4" fill="none" stroke="#34D399" strokeWidth="0.8" />
          <circle cx={x + 5} cy={y} r="2.4" fill="none" stroke="#34D399" strokeWidth="0.8" />
          <line x1={x} y1={y - 6} x2={x} y2={y - 3} stroke="#34D399" strokeWidth="0.8" />
        </g>
      ))}
      {/* Fused spur example */}
      <line x1="320" y1="168" x2="320" y2="196" stroke="#F0A500" strokeWidth="1.4" opacity="0.6" strokeDasharray="4 2" />
      <rect x="306" y="196" width="28" height="12" rx="2" fill="#12151A" stroke="#F0A500" strokeWidth="1" />
      <text x="320" y="205" textAnchor="middle" fontFamily="monospace" fontSize="6.5" fill="#F0A500">FCU 13A</text>
      {/* annotations */}
      <text x="430" y="70" fontFamily="monospace" fontSize="8" fill="#888899">Both ends →</text>
      <text x="430" y="82" fontFamily="monospace" fontSize="8" fill="#888899">one 32A MCB</text>
      <text x="430" y="150" fontFamily="monospace" fontSize="8" fill="#34D399" opacity="0.8">Break the ring</text>
      <text x="430" y="162" fontFamily="monospace" fontSize="8" fill="#888899">= long radial,</text>
      <text x="430" y="174" fontFamily="monospace" fontSize="8" fill="#888899">under-protected</text>
    </svg>
  );
}

/* Earth-fault loop path: Zs = Ze + (R1 + R2) */
function LoopPathDiagram() {
  return (
    <svg viewBox="0 0 520 210" width="100%" style={{ display: "block", background: "#0B0D11", borderRadius: 8 }}>
      <text x="16" y="20" fontFamily="monospace" fontSize="10" fill="#00D4FF" opacity="0.55" letterSpacing="1">EARTH-FAULT LOOP · Zs = Ze + (R1 + R2)</text>
      {/* Source transformer */}
      <circle cx="52" cy="70" r="14" fill="none" stroke="#F0A500" strokeWidth="1.4" opacity="0.8" />
      <circle cx="52" cy="92" r="14" fill="none" stroke="#F0A500" strokeWidth="1.4" opacity="0.8" />
      <text x="52" y="130" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#F0A500" opacity="0.7">SOURCE</text>
      {/* Ze external region */}
      <rect x="80" y="40" width="150" height="120" rx="6" fill="rgba(0,212,255,0.04)" stroke="rgba(0,212,255,0.2)" strokeWidth="0.8" strokeDasharray="4 3" />
      <text x="155" y="54" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#00D4FF" opacity="0.7">Ze (external)</text>
      {/* Line out to the fault */}
      <line x1="66" y1="70" x2="360" y2="70" stroke="#FF4444" strokeWidth="2" opacity="0.85" />
      <text x="300" y="63" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#FF4444" opacity="0.8">R1 (line)</text>
      {/* Consumer unit / origin */}
      <rect x="230" y="52" width="26" height="60" rx="3" fill="#12151A" stroke="#F0A500" strokeWidth="1.2" />
      <text x="243" y="124" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="#F0A500" opacity="0.7">origin</text>
      {/* Fault point */}
      <circle cx="360" cy="70" r="6" fill="rgba(255,68,68,0.2)" stroke="#FF4444" strokeWidth="1.4" />
      <path d="M360 76 l -6 14 l 8 -4 l -4 12" fill="none" stroke="#FF4444" strokeWidth="1.4" />
      <text x="378" y="70" fontFamily="monospace" fontSize="8" fill="#FF4444" opacity="0.85">fault</text>
      {/* cpc return */}
      <line x1="360" y1="92" x2="66" y2="92" stroke="#34D399" strokeWidth="2" opacity="0.85" />
      <polygon points="72,89 64,92 72,95" fill="#34D399" opacity="0.8" />
      <text x="300" y="106" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#34D399" opacity="0.8">R2 (cpc)</text>
      {/* formula box */}
      <rect x="18" y="164" width="484" height="34" rx="6" fill="rgba(0,212,255,0.05)" stroke="rgba(0,212,255,0.2)" strokeWidth="0.8" />
      <text x="260" y="185" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="#F0F0F0" opacity="0.85">
        Lower Zs → higher fault current → faster disconnection
      </text>
    </svg>
  );
}

/* Which residual waveform each RCD type detects */
function RCDWaveformDiagram() {
  const panels = [
    { x: 8, type: "AC", detect: "sine only", who: "AC A F B", color: "#34D399", kind: "sine" },
    { x: 178, type: "A / F", detect: "+ pulsating d.c.", who: "A F B", color: "#F0A500", kind: "pulse" },
    { x: 348, type: "B", detect: "+ smooth d.c.", who: "B only", color: "#FF6B35", kind: "flat" },
  ];
  const wave = (kind: string, ox: number) => {
    const pts: string[] = [];
    for (let x = 0; x <= 150; x += 3) {
      const a = (x / 150) * 4 * Math.PI;
      let y = 60;
      if (kind === "sine") y = 60 - Math.sin(a) * 26;
      else if (kind === "pulse") y = 60 - Math.abs(Math.sin(a)) * 30 * (Math.sin(a) > 0 ? 1 : 0.15);
      else y = 60 - 22 - Math.sin(a) * 5;
      pts.push(`${ox + 10 + x},${y + 34}`);
    }
    return pts.join(" ");
  };
  return (
    <svg viewBox="0 0 520 168" width="100%" style={{ display: "block", background: "#0B0D11", borderRadius: 8 }}>
      <text x="16" y="20" fontFamily="monospace" fontSize="10" fill="#F0A500" opacity="0.55" letterSpacing="1">RCD TYPES · RESIDUAL WAVEFORM DETECTED</text>
      {panels.map((p, i) => (
        <g key={i}>
          <rect x={p.x} y="34" width="164" height="120" rx="6" fill="rgba(255,255,255,0.02)" stroke={`${p.color}55`} strokeWidth="1" />
          <text x={p.x + 12} y="52" fontFamily="monospace" fontSize="10" fill={p.color} fontWeight="700">Type {p.type}</text>
          <line x1={p.x + 10} y1="94" x2={p.x + 154} y2="94" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />
          <polyline points={wave(p.kind, p.x)} fill="none" stroke={p.color} strokeWidth="1.8" opacity="0.9" />
          <text x={p.x + 12} y="128" fontFamily="monospace" fontSize="7.5" fill="#888899">{p.detect}</text>
          <text x={p.x + 12} y="144" fontFamily="monospace" fontSize="7.5" fill={p.color} opacity="0.85">detected by: {p.who}</text>
        </g>
      ))}
    </svg>
  );
}

/* Insulation-resistance test connection (initial verification) */
function IRTestDiagram() {
  return (
    <svg viewBox="0 0 520 190" width="100%" style={{ display: "block", background: "#0B0D11", borderRadius: 8 }}>
      <text x="16" y="20" fontFamily="monospace" fontSize="10" fill="#34D399" opacity="0.55" letterSpacing="1">INSULATION RESISTANCE · 500V d.c. TEST</text>
      {/* Tester */}
      <rect x="24" y="44" width="120" height="120" rx="10" fill="#12161C" stroke="#00D4FF" strokeWidth="1.3" />
      <rect x="34" y="54" width="100" height="40" rx="5" fill="#060810" />
      <text x="84" y="80" textAnchor="middle" fontFamily="monospace" fontSize="15" fill="#34D399">&gt;299 MΩ</text>
      <text x="84" y="112" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#F0A500" opacity="0.7">500V RANGE</text>
      <circle cx="60" cy="140" r="9" fill="rgba(255,68,68,0.15)" stroke="#FF4444" strokeWidth="1" />
      <text x="60" y="143" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="#FF4444">L+</text>
      <circle cx="108" cy="140" r="9" fill="rgba(52,211,153,0.15)" stroke="#34D399" strokeWidth="1" />
      <text x="108" y="143" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="#34D399">E</text>
      {/* Leads to circuit */}
      <path d="M60 149 C 60 175, 250 175, 300 120" stroke="#FF4444" strokeWidth="1.6" fill="none" opacity="0.8" />
      <path d="M108 149 C 140 172, 340 172, 380 150" stroke="#34D399" strokeWidth="1.6" fill="none" opacity="0.8" />
      {/* Circuit under test */}
      <line x1="300" y1="70" x2="470" y2="70" stroke="#7A4A2B" strokeWidth="2.4" />
      <line x1="300" y1="90" x2="470" y2="90" stroke="#1E62D0" strokeWidth="2.4" />
      <line x1="300" y1="120" x2="470" y2="120" stroke="#3FA34D" strokeWidth="2.4" />
      {/* L + N linked */}
      <line x1="300" y1="70" x2="300" y2="90" stroke="#F0A500" strokeWidth="1.6" />
      <text x="322" y="64" fontFamily="monospace" fontSize="8" fill="#7A4A2B">L</text>
      <text x="322" y="104" fontFamily="monospace" fontSize="8" fill="#1E62D0">N</text>
      <text x="322" y="134" fontFamily="monospace" fontSize="8" fill="#3FA34D">E (cpc)</text>
      <text x="410" y="56" fontFamily="monospace" fontSize="7.5" fill="#888899">L &amp; N linked</text>
      {/* Pass note */}
      <rect x="150" y="150" width="360" height="30" rx="5" fill="rgba(52,211,153,0.06)" stroke="rgba(52,211,153,0.25)" strokeWidth="0.7" />
      <text x="330" y="169" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#34D399" opacity="0.85">Pass ≥ 1 MΩ: investigate anything below ~2 MΩ</text>
    </svg>
  );
}

/* Conduit cross-section: fill capacity */
function ConduitFillDiagram() {
  const cables = [[92, 74], [116, 74], [140, 74], [92, 98], [116, 98], [140, 98], [104, 122], [128, 122]];
  return (
    <svg viewBox="0 0 520 190" width="100%" style={{ display: "block", background: "#0B0D11", borderRadius: 8 }}>
      <text x="16" y="20" fontFamily="monospace" fontSize="10" fill="#F0A500" opacity="0.55" letterSpacing="1">CONDUIT FILL · Σ CABLE FACTORS ≤ CONDUIT FACTOR</text>
      {/* Conduit */}
      <circle cx="116" cy="100" r="66" fill="#0D1014" stroke="#8A8A8A" strokeWidth="2.5" opacity="0.6" />
      <circle cx="116" cy="100" r="58" fill="none" stroke="#F0A500" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.4" />
      {cables.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="12" fill="rgba(0,212,255,0.15)" stroke="#00D4FF" strokeWidth="1" opacity="0.7" />
          <circle cx={x} cy={y} r="5" fill="#C8792E" opacity="0.7" />
        </g>
      ))}
      <text x="116" y="182" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#888899">8 × 2.5mm² singles</text>
      {/* Notes */}
      <rect x="220" y="52" width="286" height="100" rx="6" fill="rgba(240,165,0,0.05)" stroke="rgba(240,165,0,0.22)" strokeWidth="0.8" />
      {[
        ["Fill target", "≈ 40% max c.s.a."],
        ["Sum of cable factors", "≤ conduit factor"],
        ["More cables", "→ grouping derating Cg"],
        ["Long runs / bends", "→ conservative factors"],
      ].map(([k, v], i) => (
        <g key={i}>
          <text x="234" y={74 + i * 20} fontFamily="monospace" fontSize="8" fill="#888899">{k}</text>
          <text x="492" y={74 + i * 20} textAnchor="end" fontFamily="monospace" fontSize="8" fill="#F0A500" opacity="0.85">{v}</text>
        </g>
      ))}
    </svg>
  );
}

/* Diversity: connected load vs assessed maximum demand */
function DiversityBars() {
  const rows = [
    { label: "Lighting", conn: 5.2, div: 3.4 },
    { label: "Cooker", conn: 43.5, div: 25 },
    { label: "Sockets ×2", conn: 64, div: 44.8 },
    { label: "Immersion", conn: 13, div: 13 },
    { label: "EV charger", conn: 32, div: 32 },
  ];
  const max = 64, scale = 300;
  return (
    <svg viewBox="0 0 520 220" width="100%" style={{ display: "block", background: "#0B0D11", borderRadius: 8 }}>
      <text x="16" y="20" fontFamily="monospace" fontSize="10" fill="#F0A500" opacity="0.55" letterSpacing="1">DIVERSITY · CONNECTED (grey) vs ASSESSED (amber)</text>
      {rows.map((r, i) => {
        const y = 40 + i * 30;
        return (
          <g key={i}>
            <text x="14" y={y + 12} fontFamily="monospace" fontSize="8" fill="#888899">{r.label}</text>
            <rect x="110" y={y} width={(r.conn / max) * scale} height="9" rx="2" fill="#8A8A8A" opacity="0.35" />
            <rect x="110" y={y + 11} width={(r.div / max) * scale} height="9" rx="2" fill="#F0A500" opacity="0.8" />
            <text x={110 + (r.conn / max) * scale + 6} y={y + 8} fontFamily="monospace" fontSize="7.5" fill="#888899">{r.conn}A</text>
            <text x={110 + (r.div / max) * scale + 6} y={y + 19} fontFamily="monospace" fontSize="7.5" fill="#F0A500">{r.div}A</text>
          </g>
        );
      })}
      <line x1="110" y1="196" x2="470" y2="196" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />
      <text x="110" y="212" fontFamily="monospace" fontSize="9" fill="#34D399" opacity="0.85">Assessed maximum demand ≈ 118 A (vs 158 A connected)</text>
    </svg>
  );
}

/* Safe isolation: prove, test, prove */
function SafeIsolationFlow() {
  const steps = [
    { t: "Identify", c: "#00D4FF" }, { t: "Isolate", c: "#00D4FF" }, { t: "Lock off\n+ notice", c: "#F0A500" },
    { t: "Prove\ntester", c: "#34D399" }, { t: "Test\ndead", c: "#34D399" }, { t: "Re-prove\ntester", c: "#34D399" },
  ];
  return (
    <svg viewBox="0 0 520 150" width="100%" style={{ display: "block", background: "#0B0D11", borderRadius: 8 }}>
      <text x="16" y="20" fontFamily="monospace" fontSize="10" fill="#34D399" opacity="0.55" letterSpacing="1">SAFE ISOLATION · PROVE: TEST: PROVE</text>
      {steps.map((s, i) => {
        const x = 20 + i * 83;
        return (
          <g key={i}>
            <rect x={x} y="48" width="66" height="52" rx="8" fill={`${s.c}12`} stroke={`${s.c}66`} strokeWidth="1.2" />
            <circle cx={x + 12} cy="60" r="8" fill={`${s.c}22`} stroke={s.c} strokeWidth="1" />
            <text x={x + 12} y="63" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={s.c}>{i + 1}</text>
            {s.t.split("\n").map((ln, j) => (
              <text key={j} x={x + 33} y={j === 0 && s.t.includes("\n") ? 80 : 86 + j * 11} textAnchor="middle" fontFamily="monospace" fontSize="8.5" fill="#F0F0F0" opacity="0.85">{ln}</text>
            ))}
            {i < steps.length - 1 && <polygon points={`${x + 70},74 ${x + 82},74 ${x + 76},80 ${x + 82},74 ${x + 76},68`} fill="#888899" opacity="0.7" />}
          </g>
        );
      })}
      <text x="260" y="128" textAnchor="middle" fontFamily="monospace" fontSize="8.5" fill="#888899">If the tester fails the final check, every dead reading is void: start again.</text>
    </svg>
  );
}

/* ── The guides ── */

export const GUIDES: Guide[] = [
  {
    slug: "safe-isolation",
    title: "Safe Isolation Procedure",
    sub: "The correct sequence for proving a circuit dead before you work on it. Non-negotiable.",
    level: "Beginner",
    cat: "Safety",
    readMins: 7,
    updated: "2024",
    standards: ["Electricity at Work Regulations 1989", "HSE GS38", "BS 7671 Reg 537"],
    summary:
      "More people are hurt working on circuits they believed were dead than on circuits they knew were live. Safe isolation removes the belief and replaces it with proof. The sequence below is the one that stands up in an investigation: identify, isolate, secure, prove dead, and prove your tester on a known source both sides of the test.",
    sections: [
      {
        id: "why",
        heading: "Why the sequence matters",
        blocks: [
          { kind: "p", text: "A voltage indicator that reads zero tells you one of two things: the circuit is dead, or your indicator is faulty. You cannot tell which from the reading alone. That is why proving the instrument on a known live source: before and after you test the isolated conductors: is not optional. It is the step that turns a zero reading into evidence." },
          { kind: "callout", tone: "safety", title: "This is a legal duty, not a courtesy", text: "Regulation 14 of the Electricity at Work Regulations 1989 permits work on or near dangerous live conductors only when all three statutory conditions are met: it is unreasonable for them to be dead, live work is reasonable, and suitable precautions prevent injury. The default safe approach is to isolate, secure the isolation, and prove dead before work." },
        ],
      },
      {
        id: "kit",
        heading: "The right test kit",
        blocks: [
          { kind: "p", text: "Use an approved two-pole voltage indicator (a 'voltage tester' to GS38), not a non-contact pen and not a multimeter on the wrong range. The tester should have fused or current-limited probes, finger guards, and no more than 4 mm of exposed metal tip." },
          { kind: "p", text: "You also need a proving unit (or a known live supply), a lock-off device to suit the isolator, your own padlock with a unique key, and a caution notice." },
          { kind: "callout", tone: "warn", title: "Why not a multimeter?", text: "A multimeter left on a resistance or current range can read 0 V on a live circuit, and its leads rarely meet GS38. Two-pole voltage indicators are purpose-built for the job and fail safe." },
        ],
      },
      {
        id: "steps",
        heading: "The procedure, step by step",
        blocks: [
          { kind: "node", node: <SafeIsolationFlow /> },
          {
            kind: "steps",
            items: [
              { title: "Identify the circuit", text: "Confirm exactly which circuit or supply you are isolating, using the schedule, the labelling and, where needed, a proving trace. Isolating the wrong way switches off someone else's work, not yours." },
              { title: "Isolate", text: "Switch off and isolate at the point that removes supply to the circuit: the MCB/RCBO, the main switch, or an upstream isolator. A plug-and-socket connection is only isolation if you can keep the plug under your control." },
              { title: "Secure the isolation", text: "Lock off the isolating device with a device and padlock, keep the only key on you, and fit a caution notice so nobody re-energises the circuit." },
              { title: "Prove the tester works", text: "Check your voltage indicator on a proving unit or a known live source. It must clearly indicate voltage." },
              { title: "Prove the circuit dead", text: "Test every combination at the point of work: line–neutral, line–earth, and neutral–earth (and between phases on three-phase). All must read dead." },
              { title: "Re-prove the tester", text: "Return to the proving unit and confirm the indicator still works. Only now do you know the earlier zero readings were real." },
            ],
          },
          { kind: "callout", tone: "tip", title: "Prove–test–prove", text: "Remember it as prove the tester, test the circuit, prove the tester again. If the tester fails the final check, every dead reading is void: start over with a working instrument." },
        ],
      },
      {
        id: "gotchas",
        heading: "Traps that catch people out",
        blocks: [
          {
            kind: "list",
            items: [
              "Borrowed supplies: a circuit can be fed from more than one source (a shared neutral, a two-way lighting strap, a standby generator or inverter). Prove dead at the point of work, not just at the board.",
              "Solar PV and batteries: the DC side is live in daylight and the a.c. side can back-feed. Isolate both, and treat PV strings as live even when isolated.",
              "Capacitive charge: motors, PFC capacitors and long cable runs can hold a charge after isolation. Allow discharge and confirm dead.",
              "Neutral is not safe: a disconnected neutral on a live circuit can sit at line potential. Always test to neutral as well.",
            ],
          },
        ],
      },
    ],
    related: ["insulation-resistance-testing", "loop-impedance-testing", "rcd-types"],
  },

  {
    slug: "cable-colour-codes",
    title: "Cable Colour Codes: All Regions",
    sub: "Side-by-side conductor colours for the UK, Europe, North America and Australia/New Zealand: plus the old codes you'll still meet.",
    level: "Beginner",
    cat: "Standards",
    readMins: 6,
    updated: "2024",
    standards: ["BS 7671 / IEC 60446", "CENELEC HD 308 S2", "NEC (NFPA 70)", "AS/NZS 3000"],
    summary:
      "Colour tells you a conductor's function, not that it is safe: always prove dead. This is a working reference for the harmonised European colours, the North American convention, the Australian/New Zealand scheme, and the pre-harmonised colours you'll find in older installations.",
    sections: [
      {
        id: "uk-eu",
        heading: "UK & Europe (harmonised, post-2004)",
        blocks: [
          { kind: "p", text: "Since the harmonisation of BS 7671 with CENELEC HD 308 S2, the UK uses the same fixed-wiring colours as the rest of Europe. Green-and-yellow is reserved exclusively for the protective conductor. Never use it for another purpose." },
          {
            kind: "swatches",
            items: [
              { label: "Line (single phase)", hex: "#7A4A2B", role: "Brown" },
              { label: "Neutral", hex: "#1E62D0", role: "Blue" },
              { label: "Protective earth", hex: "#3FA34D", role: "Green / Yellow" },
              { label: "Line 1 (3-phase)", hex: "#7A4A2B", role: "Brown" },
              { label: "Line 2 (3-phase)", hex: "#111111", role: "Black" },
              { label: "Line 3 (3-phase)", hex: "#8A8A8A", role: "Grey" },
            ],
          },
          { kind: "callout", tone: "note", title: "Switch drops & sleeving", text: "A blue conductor used as a switched line (a 'switch wire') must be over-sleeved brown at both ends. The same applies to black/grey used as lines. Blue is only a neutral when it is actually working as one." },
        ],
      },
      {
        id: "old-uk",
        heading: "Old UK colours (pre-2006 installations)",
        blocks: [
          { kind: "p", text: "You will meet these for years to come. The dangerous overlap: old red was line, but new blue neutral and old black neutral can be confused, and old green earth (pre-1970) is not the same as modern green-and-yellow. When you extend an old installation, a warning notice about mixed colours is required at the consumer unit." },
          {
            kind: "table",
            head: ["Function", "Old UK", "Harmonised (now)"],
            rows: [
              ["Line / phase 1", "Red", "Brown"],
              ["Phase 2", "Yellow", "Black"],
              ["Phase 3", "Blue", "Grey"],
              ["Neutral", "Black", "Blue"],
              ["Earth", "Green (or green/yellow)", "Green / Yellow"],
            ],
          },
          { kind: "callout", tone: "warn", title: "The classic trap", text: "Old blue was a phase; new blue is neutral. Old black was neutral; new black is a phase. Never assume: prove dead and confirm function before terminating." },
        ],
      },
      {
        id: "us",
        heading: "North America (NEC / NFPA 70)",
        blocks: [
          { kind: "p", text: "The NEC fixes neutral (white or grey) and ground (green, green/yellow or bare) but leaves ungrounded 'hot' colours largely to convention, which differs by system voltage. The common practice is:" },
          {
            kind: "table",
            head: ["System", "Hot conductors", "Neutral", "Ground"],
            rows: [
              ["120/240 V single phase", "Black, Red", "White", "Green / bare"],
              ["120/208 V three phase (Y)", "Black, Red, Blue", "White", "Green"],
              ["277/480 V three phase (Y)", "Brown, Orange, Yellow", "Grey", "Green"],
            ],
            caption: "Colours above 277/480 V follow local/plant convention; the neutral and ground rules are the fixed requirements.",
          },
        ],
      },
      {
        id: "au-nz",
        heading: "Australia & New Zealand (AS/NZS 3000)",
        blocks: [
          {
            kind: "table",
            head: ["Function", "Current colours", "Older colours you may find"],
            rows: [
              ["Active (line)", "Brown (or any except those below)", "Red"],
              ["Neutral", "Blue", "Black"],
              ["Earth", "Green / Yellow", "Green"],
              ["3-phase actives", "Brown, Black, Grey", "Red, White, Blue"],
            ],
          },
          { kind: "callout", tone: "tip", title: "One rule everywhere", text: "Green/yellow (and green) is always earth. If you see it doing anything else, stop and investigate: someone has mis-wired the installation." },
        ],
      },
    ],
    related: ["single-phase-socket-wiring", "earthing-systems", "safe-isolation"],
  },

  {
    slug: "rcd-types",
    title: "RCD Types: AC, A, F and B Explained",
    sub: "Which residual current device to fit, why it matters for EV chargers, solar and VSDs, and what the ratings mean.",
    level: "Intermediate",
    cat: "Safety",
    readMins: 8,
    updated: "2026",
    standards: ["BS 7671:2018+A4:2026", "BS EN 61008 / 61009", "BS EN 62423"],
    summary:
      "An RCD monitors the vector sum of current in the live conductors passing through its sensing core. A non-zero sum indicates current returning by another path or a wiring interaction. Device selection must match the possible residual-current waveform, protective purpose, equipment instructions, and coordination design; rated residual current alone is not enough.",
    sections: [
      {
        id: "how",
        heading: "How an RCD works",
        blocks: [
          { kind: "node", node: <RCDCoreBalanceDiagram /> },
          { kind: "p", text: "Line and neutral both pass through a toroidal core. In a healthy single-phase circuit their instantaneous currents are equal and opposite, so the vector sum is approximately zero. Current returning by a protective conductor, Earth, another circuit's neutral, or another unintended path creates residual flux that can operate the trip mechanism according to the device characteristic." },
          { kind: "formula", expr: "ΔI = | I(line) − I(neutral) |", where: "A compliant device may operate above 0.5 × IΔn and is expected to operate by IΔn under its specified test conditions; consult the product standard and manufacturer data." },
        ],
      },
      {
        id: "ratings",
        heading: "Ratings: what 30 mA actually buys you",
        blocks: [
          {
            kind: "keyvalues",
            items: [
              { k: "IΔn", v: "Rated residual operating current. It is a device characteristic, not a guaranteed body-current limit." },
              { k: "≤ 30 mA", v: "Sensitivity used where BS 7671 requires additional protection; the exact circuit and exceptions must be checked." },
              { k: "> 30 mA", v: "May be selected for fault protection, selectivity, or specific fire-risk measures when the complete design supports it; it is not additional protection." },
              { k: "Delay", v: "Time-delayed/selective devices require coordination and are not used to provide additional protection." },
            ],
          },
          { kind: "p", text: "Under BS 7671, additional protection is provided by an RCD with rated residual operating current not exceeding 30 mA where the relevant regulation requires it. The requirement depends on circuit, location, intended use, exceptions, and the current edition; an RCD supplements rather than replaces basic protection and fault protection." },
          {
            kind: "table",
            head: ["Current field check", "General non-delay expectation"],
            rows: [
              ["AC test at IΔn", "Operate within 300 ms under the stated BS 7671 verification conditions"],
              ["Integral test button", "Operate functionally; follow the device and installation instructions"],
              ["Other tester sequences", "Use for diagnosis or where another applicable requirement calls for them; do not present legacy 2×/5× routines as universal current tests"],
            ],
            caption: "Current public IET guidance for BS 7671 verification. Selective S-type devices have different timing boundaries and are not applicable for additional protection.",
          },
        ],
      },
      {
        id: "types",
        heading: "Choosing the type by waveform",
        blocks: [
          { kind: "node", node: <RCDWaveformDiagram /> },
          {
            kind: "table",
            head: ["Type", "Detects", "Typical use"],
            rows: [
              ["AC", "Sinusoidal a.c. residual current", "Only where the known load and current rules make this type suitable."],
              ["A", "a.c. and specified pulsating d.c. residual current", "Many electronic loads, subject to equipment instructions and waveform assessment."],
              ["F", "Type A capability plus specified composite/mixed-frequency residual currents", "Certain single-phase inverter loads where the equipment/design calls for Type F."],
              ["B", "Broad waveform capability including specified smooth d.c. residual current", "Applications such as drives, PV, storage, or EV equipment only where required and fully coordinated."],
            ],
          },
          { kind: "callout", tone: "warn", title: "Type AC has a narrow scope", text: "Under BS 7671:2018+A2:2022, Type AC is limited to fixed equipment where the load current is known to contain no d.c. components. Select the RCD type from the expected residual-current waveform and manufacturer data; Type A is common for electronic loads, with Type F or B used where their additional capabilities are required. Confirm the applicable current or transition edition." },
          { kind: "callout", tone: "note", title: "EV charging is a common decision point", text: "Current BS 7671 arrangements can involve an individual Type A, F, or B RCD not exceeding 30 mA, together with the required d.c. fault-current protection unless that protection is provided by compliant charging equipment. The acceptable combination, switching of live conductors, product standards, upstream selectivity, and open-PEN protection all require current-rule and manufacturer verification." },
        ],
      },
      {
        id: "rcbo",
        heading: "RCD, RCBO or main-switch RCD?",
        blocks: [
          { kind: "p", text: "An RCCB provides residual-current protection but not overload or short-circuit protection, so coordinated overcurrent protection is still required. An RCBO combines residual-current and overcurrent functions for one circuit. Individual RCBOs can improve circuit division and reduce cumulative leakage compared with a shared RCCB, but the final arrangement still depends on selectivity, fault rating, neutral switching, RCD type, continuity-of-service risks, and manufacturer compatibility." },
        ],
      },
    ],
    related: ["earthing-systems", "loop-impedance-testing", "safe-isolation"],
  },

  {
    slug: "earthing-systems",
    title: "Earthing Systems: TN-S, TN-C-S and TT Explained",
    sub: "How the supply earth is arranged, how to tell which one you have, and what each means for protection.",
    level: "Intermediate",
    cat: "Standards",
    readMins: 10,
    updated: "2026",
    standards: ["BS 7671:2018+A4:2026 Section 312", "IET On-Site Guide"],
    summary:
      "The earthing system decides how a fault current gets back to the source, how low the earth-fault loop impedance is, and therefore what protection you can rely on. The first letter is the source earth, the second is the installation's exposed metalwork. Get the arrangement wrong in your head and every Zs limit and RCD decision that follows will be wrong too.",
    sections: [
      {
        id: "diagram",
        heading: "The three you'll meet",
        blocks: [
          { kind: "node", node: <EarthingDiagram /> },
          { kind: "p", text: "The letters describe the earthing at the source (first letter) and at the installation (second letter). T = a direct connection to earth; N = connected to the supply's earthed point via the network." },
        ],
      },
      {
        id: "tns",
        heading: "TN-S: separate earth back to source",
        blocks: [
          { kind: "p", text: "The protective conductor is separate from the neutral all the way back to the transformer, usually via the metallic sheath of the supply cable. Fault current has a dedicated low-impedance metallic path, so earth-fault loop impedance (Ze) is typically low." },
          { kind: "keyvalues", items: [{ k: "Typical Ze", v: "≤ 0.8 Ω (0.35 Ω is a common design figure)" }, { k: "Earth source", v: "Supply cable sheath / separate PE" }] },
        ],
      },
      {
        id: "tncs",
        heading: "TN-C-S (PME): combined then split",
        blocks: [
          { kind: "p", text: "The supply uses a combined neutral-and-earth conductor (PEN) that is split into separate N and PE at the origin of the installation (the main earthing terminal). Where the network applies multiple earthing to the PEN, the arrangement is commonly described as PME. Confirm the actual supply arrangement with inspection and network information rather than assuming it from appearance." },
          { kind: "keyvalues", items: [{ k: "Typical Ze", v: "≤ 0.35 Ω" }, { k: "Earth source", v: "Supplier's PEN, split at the MET" }] },
          { kind: "callout", tone: "warn", title: "PME has additional risks", text: "If the supply PEN conductor becomes open-circuit, connected metalwork can rise to a dangerous potential. PME use is prohibited or subject to additional conditions in particular installations. EV charging, caravans, marinas, agricultural premises, outbuildings, and exported earthing each require their own current-rule assessment; do not apply a generic open-PEN device or local electrode solution without a complete design." },
        ],
      },
      {
        id: "tt",
        heading: "TT: your own electrode",
        blocks: [
          { kind: "p", text: "There is no metallic earth back to the source. The installation makes its own connection to earth through a local electrode (a rod). The earth-fault loop is completed through the ground itself, so the loop impedance is high and often variable with weather." },
          { kind: "keyvalues", items: [{ k: "Electrode result", v: "Site-specific and seasonally variable; measure RA rather than assuming a typical value" }, { k: "Protection", v: "RCD fault protection is commonly required because an overcurrent device alone may not achieve the required disconnection time" }] },
          { kind: "callout", tone: "note", title: "Why TT commonly relies on RCDs", text: "A relatively high earth path may not produce enough current for an overcurrent device to disconnect in time. An RCD can provide fault protection when RA, IΔn, touch-voltage criteria, disconnection time, device type, and selectivity are correctly coordinated. Loop/electrode impedance still matters because sufficient residual current must flow." },
        ],
      },
      {
        id: "identify",
        heading: "How to identify the system on site",
        blocks: [
          {
            kind: "list",
            items: [
              "Look at the supply head: a separate earth from the cut-out sheath suggests TN-S; an earth link from the neutral block suggests TN-C-S/PME.",
              "An earth electrode (rod) with an earthing conductor to the MET, and no supplier earth, points to TT.",
              "PME supplies are usually labelled at the cut-out. When in doubt, ask the DNO: do not guess.",
              "Confirm by measuring Ze at the origin with the main switch off and the earthing conductor disconnected (safe-isolation applies).",
            ],
          },
        ],
      },
    ],
    related: ["loop-impedance-testing", "rcd-types", "safe-isolation"],
  },

  {
    slug: "insulation-resistance-testing",
    title: "Insulation Resistance Testing (IR Test)",
    sub: "How to perform and read a 250 V / 500 V insulation resistance test, and what a low reading is telling you.",
    level: "Intermediate",
    cat: "Testing",
    readMins: 9,
    updated: "2024",
    standards: ["BS 7671:2018+A4:2026 Reg 643.3", "GS38"],
    summary:
      "Insulation resistance testing applies a high d.c. voltage between conductors that should be electrically separate, and measures how much current leaks across the insulation. It's a dead test. Everything is isolated, and the test catches damaged cables, moisture ingress and wiring errors before the installation is energised.",
    sections: [
      {
        id: "voltages",
        heading: "Test voltage and minimum values",
        blocks: [
          {
            kind: "table",
            head: ["Circuit nominal voltage", "Test voltage (d.c.)", "Minimum insulation resistance"],
            rows: [
              ["SELV and PELV", "250 V", "0.5 MΩ"],
              ["Up to and including 500 V (incl. 230/400 V)", "500 V", "1.0 MΩ"],
              ["Above 500 V", "1000 V", "1.0 MΩ"],
            ],
            caption: "BS 7671 Table 64 values. 1 MΩ is the pass floor: a healthy new installation usually reads far higher (tens or hundreds of MΩ).",
          },
          { kind: "callout", tone: "tip", title: "1 MΩ passes, but treat low as suspect", text: "A reading between 1 and 2 MΩ is a pass on paper but a warning in practice. It usually means moisture or slightly degraded insulation. Investigate rather than sign it off and forget it." },
        ],
      },
      {
        id: "procedure",
        heading: "Doing the test",
        blocks: [
          { kind: "node", node: <IRTestDiagram /> },
          {
            kind: "steps",
            items: [
              { title: "Isolate and prove dead", text: "Safe-isolate the installation or circuit. IR testing is a dead test and the 500 V output will damage connected electronics." },
              { title: "Disconnect vulnerable equipment", text: "Remove or disconnect items that can't take 500 V d.c.: dimmers, electronic PIRs, RCDs' electronics, surge protection devices (SPDs), and connected appliances. Or test to a point that excludes them." },
              { title: "Link line and neutral (initial verification)", text: "For new work, link L and N together and test between the linked conductors and earth. This protects any connected equipment and speeds the test. Where required, also test between line and neutral." },
              { title: "Apply the test", text: "Select 500 V, connect the leads, and press test. Hold until the reading stabilises." },
              { title: "Record the lowest value", text: "Log the result per circuit on the schedule of test results. The lowest reading is the one that matters." },
            ],
          },
          { kind: "callout", tone: "warn", title: "SPDs and RCDs will skew or fail the test", text: "Modern consumer units contain surge protection and electronics that present a low resistance to 500 V d.c. Disconnect SPDs before testing, or you'll chase a 'fault' that is really the protection device doing its job." },
        ],
      },
      {
        id: "diagnose",
        heading: "Reading a low result",
        blocks: [
          {
            kind: "list",
            items: [
              "Near-zero across L–N: a dead short, a connected load still in circuit, or a crushed cable.",
              "Low L–E or N–E but healthy L–N: an earth fault: nail/screw through a cable, water in an accessory, or a trapped conductor in a back box.",
              "Reading that climbs slowly then holds: capacitance charging on a long run: normal; wait for it to settle.",
              "Reading that drifts down under test: moisture. Common in outdoor circuits and new plaster; often recovers as things dry.",
            ],
          },
          { kind: "callout", tone: "note", title: "Split the run to find it", text: "If a circuit fails, disconnect it at a mid-point (a junction or an accessory) and test each half. The half that fails contains the fault. Repeat to close in on it." },
        ],
      },
    ],
    related: ["loop-impedance-testing", "safe-isolation", "rcd-types"],
  },

  {
    slug: "loop-impedance-testing",
    title: "Earth Fault Loop Impedance: Step by Step",
    sub: "Measure Ze and Zs, understand the loop, and verify the protective device will disconnect fast enough.",
    level: "Intermediate",
    cat: "Testing",
    readMins: 11,
    updated: "2026",
    standards: ["BS 7671:2018+A4:2026 Reg 411 & Table 41.3/41.4", "IET On-Site Guide"],
    summary:
      "Earth-fault loop impedance is the total resistance of the path a fault current takes from the point of fault, back through the earthing and the supply transformer, and out again to the point of fault. The lower it is, the bigger the fault current and the faster the protective device trips. Zs is what you measure to prove the disconnection times can actually be met.",
    sections: [
      {
        id: "loop",
        heading: "What's in the loop",
        blocks: [
          { kind: "node", node: <LoopPathDiagram /> },
          { kind: "formula", expr: "Zs = Ze + (R1 + R2)", where: "Ze = external loop impedance at the origin; R1 = line conductor resistance; R2 = protective conductor resistance of the circuit." },
          { kind: "p", text: "Ze is everything outside the installation (the supply and the earth return). (R1 + R2) is the go-and-return resistance of the final circuit conductors. Add them and you have Zs: the loop impedance at the furthest point of the circuit, which is where it is highest and disconnection is hardest." },
        ],
      },
      {
        id: "measure",
        heading: "Measuring Ze and Zs",
        blocks: [
          {
            kind: "steps",
            items: [
              { title: "Establish Ze evidence", text: "Use declared network data or a competent, planned origin test appropriate to the earthing arrangement. Direct measurement can involve exposed live parts and temporary loss of protective paths, so it requires a specific safe system of work and restoration checks." },
              { title: "(R1 + R2) by measurement or calculation", text: "Either measure end-to-end continuity of line + cpc, or calculate from the cable's mΩ/m figures and length. This is a dead test." },
              { title: "Confirm Zs by an approved method", text: "Prefer calculation or permitted dead-test evidence where suitable. If a live loop test is justified, use a compatible instrument/method at the safest suitable point, control the live-testing risk, and never bypass protective devices merely to obtain a reading." },
              { title: "Compare against the limit", text: "Check the measured Zs against the maximum for the protective device and disconnection time (0.4 s for most final circuits ≤ 63 A on TN, 5 s for distribution)." },
            ],
          },
        ],
      },
      {
        id: "limits",
        heading: "The disconnection-time check",
        blocks: [
          { kind: "p", text: "The maximum Zs is whatever value lets enough current flow to operate the device within the required time. The regulations tabulate this per device; you can also derive it:" },
          { kind: "formula", expr: "Zs(max) = (U0 × Cmin) / Ia", where: "U0 = 230 V nominal, Cmin = 0.95, Ia = current for disconnection in the required time." },
          {
            kind: "table",
            head: ["Device (Type B MCB)", "Ia (5 × In)", "Max Zs @ 0.4 s (tabulated)"],
            rows: [
              ["B6", "30 A", "7.28 Ω"],
              ["B16", "80 A", "2.73 Ω"],
              ["B32", "160 A", "1.37 Ω"],
              ["B40", "200 A", "1.09 Ω"],
            ],
            caption: "Type B trips in the magnetic region at 5 × In. Type C needs 10 × In (half the Zs); Type D needs 20 × In.",
          },
          { kind: "callout", tone: "tip", title: "Apply the temperature correction", text: "Tabulated maximum Zs values already include a factor for conductors being cold at the moment of test (roughly 0.8). If you calculate your own limit from U0/Ia, apply the same correction, or measure and compare to the tabulated figure, which is simpler and safer." },
        ],
      },
      {
        id: "high",
        heading: "When Zs is too high",
        blocks: [
          {
            kind: "list",
            items: [
              "Increase the cpc size (lower R2): often the cheapest fix on a long run.",
              "Use a device with a lower trip multiple (Type B instead of C) if the load's inrush allows.",
              "Redesign the protective measure: an appropriately selected RCD may provide fault protection where overcurrent operation cannot meet the required time, but Zs/RA, IΔn, device operation, continuity, and the governing touch-voltage relationship still require verification.",
              "Recheck Ze: a poor supply earth or a PME fault at the source can push every circuit's Zs over the limit.",
            ],
          },
        ],
      },
    ],
    related: ["earthing-systems", "insulation-resistance-testing", "rcd-types"],
  },

  {
    slug: "conduit-cable-fill",
    title: "Conduit Fill & Cable Capacity",
    sub: "Work out how many cables fit in a conduit without overheating or damaging insulation on the pull.",
    level: "Intermediate",
    cat: "Calculations",
    readMins: 9,
    updated: "2024",
    standards: ["IET On-Site Guide (cable/conduit factors)", "BS 7671 Appendix 4 (grouping)"],
    summary:
      "Overfilling a conduit does two things: it makes cables impossible to pull without stripping insulation, and it traps heat so the cables can't carry their rated current. The IET On-Site Guide gives a 'factor' method that turns the geometry into simple arithmetic: add up the cable factors, and pick a conduit whose factor is larger.",
    sections: [
      {
        id: "method",
        heading: "The factor method",
        blocks: [
          { kind: "node", node: <ConduitFillDiagram /> },
          { kind: "p", text: "Every cable size has a 'cable factor' (a number proportional to its space demand) and every conduit size/length has a 'conduit factor' (its usable capacity). The rule is simple:" },
          { kind: "formula", expr: "Σ (cable factors) ≤ conduit factor", where: "Sum the factors of all cables in the run; choose a conduit whose factor is equal or greater." },
          { kind: "callout", tone: "note", title: "Two sets of tables", text: "Short straight runs (≤ 3 m, no bends) use one set of factors; longer runs and runs with bends use a second, more conservative set that accounts for the extra pulling force and reduced usable area. Always use the table that matches your run." },
        ],
      },
      {
        id: "example",
        heading: "Worked example",
        blocks: [
          { kind: "p", text: "Say you're running eight 2.5 mm² single-core thermoplastic (solid) cables through a 6 m conduit that has two bends. Using the running-system cable factors (illustrative figures: always read the current tables):" },
          {
            kind: "table",
            head: ["Item", "Factor", "Qty", "Subtotal"],
            rows: [
              ["2.5 mm² solid cable factor", "≈ 30", "8", "240"],
              ["Sum of cable factors", "", "", "240"],
              ["20 mm conduit, 6 m, 2 bends", "≈ 260", "", "260 (acceptable)"],
              ["25 mm conduit, 6 m, 2 bends", "≈ 460", "", "460 (spare capacity)"],
            ],
            caption: "240 ≤ 260, so 20 mm just works; 25 mm gives headroom for future cables. Figures illustrate the method: use the current On-Site Guide tables for real designs.",
          },
        ],
      },
      {
        id: "grouping",
        heading: "Don't forget the heat",
        blocks: [
          { kind: "p", text: "Fitting the cables in is only half the job. The more current-carrying conductors share a conduit, the less heat each can shed, so a grouping factor (Cg) reduces the current each cable may carry." },
          {
            kind: "table",
            head: ["Circuits grouped", "Approx. grouping factor Cg"],
            rows: [
              ["2", "0.80"],
              ["3", "0.70"],
              ["4", "0.65"],
              ["6", "0.57"],
            ],
            caption: "Enclosed in conduit, BS 7671 Appendix 4. A neutral+line pair is one circuit; count circuits, not cores.",
          },
          { kind: "callout", tone: "tip", title: "Rule of thumb, then verify", text: "A common working target is not to exceed about 40% of the conduit's cross-sectional area. Treat that only as a quick check. Use the applicable factor tables and grouping correction for the design." },
        ],
      },
    ],
    related: ["cable-colour-codes", "maximum-demand", "loop-impedance-testing"],
  },

  {
    slug: "maximum-demand",
    title: "Maximum Demand & Diversity for a House",
    sub: "Size the main switch and supply conductors realistically: because everything is never on at once.",
    level: "Intermediate",
    cat: "Calculations",
    readMins: 10,
    updated: "2026",
    standards: ["IET On-Site Guide (diversity allowances)", "BS 7671"],
    summary:
      "If you added up the rating of every circuit in a house you'd get a frightening number and specify a supply nobody needs. Diversity is the recognition that loads don't all run at full whack simultaneously. Applying the standard allowances gives a realistic maximum demand to size the main switch, tails and supply.",
    sections: [
      {
        id: "why",
        heading: "Connected load vs maximum demand",
        blocks: [
          { kind: "p", text: "Connected load is the sum of everything you could switch on. Maximum demand is what the installation will realistically draw at its busiest. Diversity is the set of allowances that converts one into the other. It's applied per load type, then summed." },
        ],
      },
      {
        id: "allowances",
        heading: "Typical domestic diversity allowances",
        blocks: [
          {
            kind: "table",
            head: ["Load", "Allowance (single domestic)"],
            rows: [
              ["Lighting", "66% of total connected load"],
              ["Cooker", "First 10 A + 30% of remainder + 5 A if the unit has a socket"],
              ["Ring / radial socket circuits", "100% of the largest, + 40% of the rest"],
              ["Instantaneous water heaters", "100% of the largest two, + 25% of the rest"],
              ["Thermostatic water/space heating", "100% (no diversity: it's on a thermostat, not user choice)"],
              ["EV charge point", "100% (no diversity: assume full load)"],
            ],
            caption: "IET On-Site Guide allowances for an individual household installation. Blocks of flats and commercial premises use different figures.",
          },
          { kind: "callout", tone: "warn", title: "EV charging changed the sums", text: "A 7.4 kW charger adds a solid 32 A with no diversity. On older properties this alone can push maximum demand past the supply capacity: which is why load management or a supply upgrade is often needed." },
        ],
      },
      {
        id: "example",
        heading: "Worked example",
        blocks: [
          { kind: "p", text: "A typical three-bed house at 230 V:" },
          { kind: "node", node: <DiversityBars /> },
          {
            kind: "table",
            head: ["Load", "Connected", "After diversity"],
            rows: [
              ["Lighting (12 × 100 W ≈ 1200 W ≈ 5.2 A)", "5.2 A", "3.4 A (66%)"],
              ["Cooker (10 kW ≈ 43.5 A, with socket)", "43.5 A", "10 + (33.5×0.3) + 5 = 25 A"],
              ["Two socket ring circuits (32 A each)", "64 A", "32 + (32×0.4) = 44.8 A"],
              ["Immersion (3 kW thermostatic ≈ 13 A)", "13 A", "13 A (100%)"],
              ["EV charger (7.4 kW ≈ 32 A)", "32 A", "32 A (100%)"],
              ["Maximum demand (sum)", "", "≈ 118 A"],
            ],
            caption: "Illustrative only. The uncorrected diversified sum of about 118 A exceeds 100 A. A competent design must reassess the assumptions and use verified load control, load limiting, or a supply alteration where required.",
          },
          { kind: "callout", tone: "tip", title: "Always sanity-check against the cut-out", text: "Most UK domestic supplies are fused at 60–100 A. If your maximum demand approaches or exceeds the DNO fuse, you either apply load management or arrange an upgrade: you can't just fit a bigger main switch." },
        ],
      },
    ],
    related: ["conduit-cable-fill", "single-phase-socket-wiring", "loop-impedance-testing"],
  },

  {
    slug: "single-phase-socket-wiring",
    title: "Single-Phase Socket Outlet Wiring",
    sub: "Ring finals vs radials, correct terminations, spurs, and the checks before you screw it back to the wall.",
    level: "Beginner",
    cat: "Wiring",
    readMins: 8,
    updated: "2026",
    standards: ["BS 7671:2018+A4:2026", "IET On-Site Guide"],
    summary:
      "Socket circuits are the bread and butter of domestic work, and also where small mistakes: a loose cpc, a broken ring, an over-loaded spur: cause the most call-backs. This covers the two circuit types, how to terminate correctly, and the rules for spurs.",
    sections: [
      {
        id: "types",
        heading: "Ring final vs radial",
        blocks: [
          { kind: "node", node: <RingFinalDiagram /> },
          {
            kind: "table",
            head: ["Circuit", "Cable", "Protective device", "Notes"],
            rows: [
              ["Common ring-final example", "2.5 mm² T&E", "32 A", "Both ends return to one protective device; the complete Appendix 15 conditions and actual installation factors must be checked."],
              ["Common radial example", "2.5 mm²", "20 A", "One outgoing path; current capacity, voltage drop, fault protection, grouping, insulation, and route govern suitability."],
              ["Larger radial example", "4 mm²", "32 A", "Not a universal prescription; verify every design factor and accessory/device rating."],
            ],
          },
          { kind: "p", text: "A correctly designed ring final provides two conductor paths back to one protective device. An open conductor changes current sharing and can leave part of the circuit carrying more current than intended without operating a 32 A device. Ring continuity and conductor-relationship tests are therefore essential before energization and after relevant alterations." },
        ],
      },
      {
        id: "terminate",
        heading: "Terminating a socket",
        blocks: [
          {
            kind: "steps",
            items: [
              { title: "Prepare the conductors", text: "Strip only as much insulation as the terminal needs; no bare copper should show below the terminal. Sleeve every cpc in green/yellow: bare cpcs in a back box are a common fail." },
              { title: "Match by function, not colour habit", text: "Brown line → L, blue neutral → N, green/yellow cpc → E. On a ring, two conductors go into each terminal: make sure both are captured and tight." },
              { title: "Torque the terminals", text: "Tighten to the maker's figure. Under-tight terminals arc and overheat; over-tight can shear a stranded conductor. Give each conductor a gentle tug to confirm it's held." },
              { title: "Dress and fit", text: "Fold conductors neatly into the box without trapping them behind the screws or the accessory. Check the earth tail to the box (metal boxes) is connected." },
            ],
          },
          { kind: "callout", tone: "safety", title: "Protective continuity to metalwork", text: "Exposed-conductive-parts require reliable protective continuity. For a metal back box, verify the approved connection arrangement, fixed-lug/contact path where applicable, accessory manufacturer instructions, and continuity. A separate protective fly-lead may be required or adopted by specification; do not infer continuity from fixing screws alone without verification." },
        ],
      },
      {
        id: "spurs",
        heading: "Spurs: the rules people break",
        blocks: [
          {
            kind: "list",
            items: [
              "Use the current BS 7671 Appendix 15 arrangements and the circuit design when adding a spur; do not treat a remembered socket count as the complete rule.",
              "A non-fused spur is limited by the connected accessory/load arrangement and conductor capacity. Confirm the point of connection and that the ring itself remains continuous and correctly loaded.",
              "A suitably selected fused connection unit can limit the downstream load and protect the downstream cable, but its fuse rating, cable size, accessibility, and isolation function still require design.",
              "Do not extend an unfused spur into an uncontrolled chain. Trace the existing circuit first because undocumented spurs, junctions, and broken rings are common alteration risks.",
            ],
          },
        ],
      },
      {
        id: "test",
        heading: "Before you sign it off",
        blocks: [
          {
            kind: "list",
            items: [
              "Ring continuity: prove the ring is unbroken (the three-step r1/rn/r2 method).",
              "Insulation resistance: dead test, ≥ 1 MΩ.",
              "Polarity: line to the switched/fused terminal everywhere; no reversed L–N.",
              "Zs and RCD operation: confirm disconnection times and 30 mA additional protection.",
            ],
          },
        ],
      },
    ],
    related: ["cable-colour-codes", "insulation-resistance-testing", "maximum-demand"],
  },

  {
    slug: "electrical-symbols-diagrams",
    title: "Electrical Symbols & Wiring Diagrams",
    sub: "Read schematics, functional wiring views, terminal identifiers, and fault paths with confidence.",
    level: "Beginner",
    cat: "Wiring",
    readMins: 12,
    updated: "2026",
    standards: ["IEC 60617", "IEC 60445", "IEC 61082-1"],
    summary: "A practical, standards-informed reference for reading electrical drawings: symbols, conductor identification, functional wiring, control logic, and disciplined fault-finding.",
    sections: [
      { id: "symbols", heading: "A compact symbol sheet", blocks: [
        { kind: "p", text: "IEC 60617 is the international database for graphical symbols used in electrotechnical diagrams. The redraws below are an original teaching set: they preserve the intent of common symbols without reproducing the licensed database artwork. A project drawing must use its approved symbol library and legend." },
        { kind: "node", node: <SymbolSheet /> },
        { kind: "callout", tone: "note", title: "Diagram symbols are not equipment labels", text: "A symbol communicates function; the equipment schedule identifies the actual device, rating, manufacturer, terminals, and reference designation. Never infer a device rating from a symbol alone." },
      ] },
      { id: "reading", heading: "How to read a drawing", blocks: [
        { kind: "steps", items: [
          { title: "Find the boundary", text: "Read the title block, supply system, voltage, frequency, drawing status, revision, and legend first. A schematic is a functional view; it is not automatically a physical route or installation method." },
          { title: "Trace the energy path", text: "Follow line conductors from source through isolation and protective devices to the load. Follow neutral and protective-earth paths separately. A protective conductor is not a normal load-current return path." },
          { title: "Read contact state correctly", text: "Normally open (NO) and normally closed (NC) describe the device at rest. In a control ladder, a STOP NC contact opens on operation; a START NO contact closes momentarily; an auxiliary NO contact can hold the coil energized." },
          { title: "Cross-check identifiers", text: "Use the reference designation and terminal numbers to connect the schematic to the panel schedule, cable list, terminal plan, and physical equipment. IEC 60445 addresses identification of equipment terminals and designated conductors." },
        ] },
        { kind: "table", head: ["Identifier", "Typical meaning", "Verification rule"], rows: [
          ["L / L1, L2, L3", "Line / phase conductor", "Confirm system and terminal marking; colour alone is not proof."], ["N", "Neutral conductor", "Do not assume every circuit has a neutral; trace the actual circuit."], ["PE / CPC", "Protective conductor", "Continuity and termination are safety-critical; never switch it as a normal conductor."], ["QF / FU", "Breaker / fuse reference", "Check the schedule and device data for rating and breaking capacity."], ["KM / K", "Contactor or relay", "Match coil voltage, contact arrangement, and auxiliary contact reference."], ["M / MOT", "Motor", "Confirm phase arrangement, overload setting, direction, and isolation points."],
        ], caption: "Common IEC-style reference designations are conventions, not a substitute for the project legend." },
      ] },
      { id: "lighting", heading: "Worked view: one-way lighting", blocks: [
        { kind: "node", node: <LightingWiringDiagram /> },
        { kind: "p", text: "The diagnostic insight is simple: the switch interrupts the line conductor, while neutral remains continuous to the luminaire and the CPC/PE remains continuous to exposed-conductive-parts. If a lamp is dead, begin with safe isolation and a documented prove-dead process, then check supply, switch operation, terminations, neutral continuity, and the luminaire in that order." },
        { kind: "callout", tone: "safety", title: "Safe isolation is a prerequisite", text: "HSE guidance says supplies should be made dead and proved dead before work starts, with isolation secured against inadvertent or deliberate re-energisation. Use a suitable test instrument and the local safe-isolation procedure; this page is not permission to work live." },
      ] },
      { id: "control", heading: "Worked view: motor-control logic", blocks: [
        { kind: "node", node: <ControlLadderDiagram /> },
        { kind: "list", items: ["No response to START: verify control supply, STOP NC, overload NC, START contact, coil voltage, and the coil itself.", "Contactor chatters: investigate control-voltage drop, loose terminals, incorrect coil voltage, mechanical wear, or an unstable supply; do not mask it by increasing protection.", "Motor trips on start: check overload setting against the motor nameplate and manufacturer guidance, phase loss, mechanical load, starting method, and fault current; do not simply fit a larger protective device.", "Unexpected restart risk: identify every energy source and stored energy, isolate, lock/tag, release or restrain stored energy, and prove the circuit dead before intervention."] },
      ] },
      { id: "limits", heading: "Accuracy boundaries", blocks: [
        { kind: "callout", tone: "warn", title: "Jurisdiction and edition matter", text: "Cable sizes, disconnection times, RCD requirements, colour rules, inspection tests, and permitted wiring methods depend on the governing national standard, installation type, equipment instructions, and current edition. Treat the examples as learning aids; design, alteration, testing, and certification belong to a competent person under the applicable rules." },
        { kind: "p", text: "For a real job, freeze the design basis before drawing: jurisdiction, supply characteristics, earthing arrangement, prospective fault current, environmental conditions, design current, protective-device data, installation method, voltage-drop limit, and inspection/testing plan. Then record assumptions and revisions on the drawing." },
      ] },
    ],
    related: ["safe-isolation", "cable-colour-codes", "single-phase-socket-wiring", "loop-impedance-testing"],
  },

  {
    slug: "electrical-field-toolkit",
    title: "Electrical Field Toolkit",
    sub: "A clear job workflow for planning, safe testing, fault diagnosis, recording results, and professional handover.",
    level: "Intermediate",
    cat: "Fieldwork",
    readMins: 15,
    updated: "2026",
    standards: ["HSE HSG85", "HSE GS38", "Skills England ST0152 v1.2", "OSHA 29 CFR 1910"],
    summary: "Electrical users need a reliable path from the first job brief to the final handover. This toolkit joins the information that is often scattered across drawings, safety procedures, instruments, calculations, test records, and customer communication.",
    sections: [
      { id: "workflow", heading: "The complete field workflow", blocks: [
        { kind: "node", node: <FieldWorkflow /> },
        { kind: "p", text: "Treat each stage as a gate. If the scope, supply, isolation boundary, test method, or acceptance criteria are uncertain, stop at that gate and resolve the uncertainty before progressing. Record changes as the work develops so the final documentation describes the installation actually delivered." },
        { kind: "node", node: <ToolkitLinks /> },
      ] },
      { id: "before-work", heading: "Before tools touch the installation", blocks: [
        { kind: "table", head: ["Confirm", "Questions to answer", "Record"], rows: [
          ["Scope", "What is being installed, inspected, maintained, or diagnosed? What is excluded?", "Job brief, drawing revision, client constraints"],
          ["Supply", "Voltage, phases, frequency, earthing arrangement, source capacity, alternative supplies?", "Observed labels, verified data, unresolved assumptions"],
          ["Environment", "Wet, dusty, corrosive, hot, confined, explosive, public, or mechanically exposed?", "Hazards, required enclosure/IP suitability, access controls"],
          ["Isolation", "Every source identified, including generation, batteries, UPS, controls, and stored energy?", "Isolation points, locks/tags, responsible person"],
          ["Acceptance", "Which current standard, manufacturer instruction, design limit, and test result applies?", "Edition, device data, test plan, pass/fail basis"],
        ], caption: "This is a preparation framework, not a substitute for a site-specific risk assessment, permit system, or governing standard." },
        { kind: "callout", tone: "safety", title: "Stop conditions", text: "Do not proceed when the circuit cannot be positively identified, all sources cannot be isolated, the test equipment is unsuitable or damaged, the person is outside their competence, the environment creates uncontrolled risk, or the required design and device information is unavailable." },
      ] },
      { id: "test-kit", heading: "Select and check the test kit", blocks: [
        { kind: "list", items: [
          "Choose an instrument rated for the system, measurement category, maximum voltage, prospective fault conditions, and intended test. Read the manufacturer instructions.",
          "Inspect the instrument, casing, leads, probes, fuses, connectors, batteries, and calibration or verification status before use. Withdraw damaged equipment from service.",
          "Use a suitable voltage indicator and proving unit for safe isolation. Prove the indicator before and after proving the conductors dead under the applicable procedure.",
          "Use accessories that reduce exposed conductive probe length and accidental bridging. Keep hands behind barriers and maintain controlled access to the test area.",
          "Prefer dead tests where they can provide the required information. Live testing and fault-finding require specific justification, competence, precautions, and a safe system of work.",
        ] },
        { kind: "callout", tone: "note", title: "A reading needs context", text: "Record the instrument, function, range, connection points, circuit state, expected value, measured value, units, uncertainty or limitations, and the acceptance criterion. A number without those details is weak evidence." },
      ] },
      { id: "fault-finding", heading: "Fault-finding without guesswork", blocks: [
        { kind: "steps", items: [
          { title: "Confirm the symptom", text: "Separate what was reported from what you can reproduce. Note when, where, and under which load or operating state it occurs." },
          { title: "Build the expected model", text: "Use the current drawing, supply data, control sequence, manufacturer information, and known-good values to state what should happen." },
          { title: "Make safe and inspect", text: "Apply the safe system of work. Look for heat damage, loose or displaced conductors, contamination, mechanical damage, incorrect settings, missing labels, and recent alterations." },
          { title: "Divide the system", text: "Select test points that split the possible fault area. Start with high-value checks that distinguish supply, protection, wiring, control, and load faults." },
          { title: "Prove the root cause", text: "Do not stop at the first abnormal reading. Confirm why it is abnormal, account for parallel paths and connected equipment, and show that the proposed cause explains the symptom." },
          { title: "Rectify and retest", text: "Use the correct component and method, then repeat relevant inspection, dead tests, justified live or functional tests, and safety checks before return to service." },
        ] },
        { kind: "table", head: ["Symptom", "First distinctions", "Avoid"], rows: [
          ["Protective device trips", "Overload, short circuit, earth leakage, inrush, device coordination, damaged load", "Repeated resetting or increasing the rating without finding the cause"],
          ["Intermittent operation", "Loose connection, thermal movement, vibration, control-voltage instability, environmental ingress", "Disturbing every connection before recording the original condition"],
          ["Low voltage at load", "Source voltage, conductor drop, high-resistance joint, overload, phase imbalance", "Assuming cable size is the only cause"],
          ["Motor will not start", "Control supply, permissives, STOP/overload path, coil, contactor, phase supply, mechanical load", "Bypassing interlocks or overload protection"],
          ["RCD/RCBO operates", "Actual residual current, neutral-earth fault, shared/borrowed neutral, cumulative leakage, wrong device/application", "Treating nuisance operation as proof the RCD is defective"],
        ] },
      ] },
      { id: "records", heading: "Minimum useful job record", blocks: [
        { kind: "keyvalues", items: [
          { k: "Identity", v: "Site, circuit, equipment reference, asset ID, location, date and time" },
          { k: "Basis", v: "Scope, drawing revision, governing rules, manufacturer information and assumptions" },
          { k: "Safety", v: "Hazards, isolation points, lock/tag control, stored-energy controls and authorisation" },
          { k: "Evidence", v: "Visual observations, instrument details, test method, readings, units and acceptance limits" },
          { k: "Outcome", v: "Fault cause, work completed, deviations, limitations, retest results and remaining actions" },
          { k: "Handover", v: "Labels, updated drawings, certificates, operating information, client explanation and signatures" },
        ] },
        { kind: "p", text: "Write observations in factual language. Distinguish measured facts, reported symptoms, engineering interpretation, and recommendations. If access or shutdown limits prevented a test, state the limitation and its consequence rather than implying the installation was fully verified." },
      ] },
      { id: "user-needs", heading: "What ElectraCore should help users do", blocks: [
        { kind: "table", head: ["User", "Immediate need", "ElectraCore path"], rows: [
          ["Apprentice", "Understand drawings, sequence work, practise calculations, learn why tests are ordered", "Learning courses, symbol guide, worked examples, calculators"],
          ["Installer", "Check scope, cable/protection assumptions, installation details, inspection and records", "Field workflow, design screener, wiring and testing guides"],
          ["Maintenance technician", "Find faults efficiently while controlling electrical and stored-energy risk", "Fault workflow, control diagrams, test-equipment checks"],
          ["Designer", "Document assumptions, coordinate protection, voltage drop, environment and verification", "Design screener, calculation history, standards-aware references"],
          ["Supervisor", "Assess competence, review evidence, manage isolations, approve return to service", "Stop conditions, job-record structure, source and review disclosures"],
          ["Client or learner", "Understand findings without unsafe instructions or unexplained jargon", "Plain-language summaries, limitations, handover checklist"],
        ] },
      ] },
      { id: "sources", heading: "Sources and scope", blocks: [
        { kind: "node", node: <FieldSources /> },
        { kind: "callout", tone: "warn", title: "Use the rule that governs the job", text: "The workflow is internationally useful, but legal duties, permitted live work, test sequences, certification, conductor identification, and installation requirements vary by jurisdiction. Confirm the applicable current rules and organisational procedures." },
      ] },
    ],
    related: ["safe-isolation", "electrical-symbols-diagrams", "insulation-resistance-testing", "loop-impedance-testing"],
  },
];

export const GUIDE_MAP: Record<string, Guide> = Object.fromEntries(GUIDES.map((g) => [g.slug, g]));
