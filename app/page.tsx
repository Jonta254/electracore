"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Cable, Calculator, FileText, GraduationCap, Workflow } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   "Who it's for": real electrical illustrations, one per audience.
   Conductor colours follow the harmonised UK/EU scheme:
   brown = line, blue = neutral, green/yellow = earth, grey/black =
   further line conductors.
────────────────────────────────────────────────────────────── */
const COL = { core: "#F0A500", volt: "#00D4FF", gnd: "#34D399", hot: "#FF4444", L: "#7A4A2B", N: "#1E62D0", E: "#3FA34D", grey: "#8A8A8A", dim: "#888899", txt: "#F0F0F0" };
const svgWrap = { display: "block", width: "100%", borderRadius: 10, background: "#0B0D11" } as const;

/* Students: Ohm's law with a series resistor into a parallel pair, live meters */
function IlloStudents() {
  return (
    <svg viewBox="0 0 360 210" style={svgWrap} role="img" aria-label="Ohm's law circuit: battery, ammeter, resistors in series and parallel, voltmeter">
      <text x="14" y="20" fontFamily="monospace" fontSize="9" fill={COL.core} opacity="0.55" letterSpacing="1">OHM&apos;S LAW · SERIES + PARALLEL</text>
      {/* Battery */}
      <line x1="34" y1="70" x2="34" y2="150" stroke={COL.core} strokeWidth="2" opacity="0.9" />
      <line x1="26" y1="92" x2="42" y2="92" stroke={COL.core} strokeWidth="4" />
      <line x1="30" y1="100" x2="38" y2="100" stroke={COL.core} strokeWidth="1.6" />
      <line x1="26" y1="118" x2="42" y2="118" stroke={COL.core} strokeWidth="4" />
      <line x1="30" y1="126" x2="38" y2="126" stroke={COL.core} strokeWidth="1.6" />
      <text x="16" y="112" fontFamily="monospace" fontSize="11" fill={COL.core} textAnchor="middle">12V</text>
      {/* Top rail */}
      <line x1="34" y1="60" x2="150" y2="60" stroke={COL.volt} strokeWidth="2" />
      {/* Ammeter */}
      <circle cx="80" cy="60" r="12" fill="rgba(168,85,247,0.12)" stroke="#A855F7" strokeWidth="1.5" />
      <text x="80" y="64" fontFamily="monospace" fontSize="10" fill="#A855F7" textAnchor="middle">A</text>
      {/* current arrow */}
      <polygon points="120,57 128,60 120,63" fill={COL.volt} opacity="0.8" />
      {/* R1 series */}
      <rect x="150" y="52" width="46" height="16" rx="3" fill="none" stroke={COL.volt} strokeWidth="1.6" />
      <text x="173" y="45" fontFamily="monospace" fontSize="8" fill={COL.volt} textAnchor="middle">R1 220Ω</text>
      <line x1="196" y1="60" x2="250" y2="60" stroke={COL.volt} strokeWidth="2" />
      {/* Parallel node bars */}
      <line x1="250" y1="60" x2="320" y2="60" stroke={COL.volt} strokeWidth="2" />
      <line x1="250" y1="150" x2="320" y2="150" stroke={COL.gnd} strokeWidth="2" />
      {/* R2 */}
      <rect x="242" y="82" width="16" height="46" rx="3" fill="none" stroke={COL.gnd} strokeWidth="1.6" />
      <line x1="250" y1="60" x2="250" y2="82" stroke={COL.volt} strokeWidth="2" />
      <line x1="250" y1="128" x2="250" y2="150" stroke={COL.gnd} strokeWidth="2" />
      <text x="230" y="108" fontFamily="monospace" fontSize="8" fill={COL.gnd}>R2</text>
      {/* R3 */}
      <rect x="312" y="82" width="16" height="46" rx="3" fill="none" stroke={COL.gnd} strokeWidth="1.6" />
      <line x1="320" y1="60" x2="320" y2="82" stroke={COL.volt} strokeWidth="2" />
      <line x1="320" y1="128" x2="320" y2="150" stroke={COL.gnd} strokeWidth="2" />
      <text x="332" y="108" fontFamily="monospace" fontSize="8" fill={COL.gnd}>R3</text>
      {/* Voltmeter across parallel */}
      <circle cx="285" cy="105" r="12" fill="rgba(0,212,255,0.1)" stroke={COL.volt} strokeWidth="1.4" />
      <text x="285" y="109" fontFamily="monospace" fontSize="10" fill={COL.volt} textAnchor="middle">V</text>
      <line x1="285" y1="60" x2="285" y2="93" stroke={COL.volt} strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5" />
      <line x1="285" y1="117" x2="285" y2="150" stroke={COL.volt} strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5" />
      {/* Return */}
      <line x1="250" y1="150" x2="34" y2="150" stroke={COL.core} strokeWidth="2" />
      {/* Formula panel */}
      <rect x="18" y="164" width="324" height="34" rx="6" fill="rgba(240,165,0,0.06)" stroke="rgba(240,165,0,0.25)" strokeWidth="0.8" />
      <text x="60" y="185" fontFamily="monospace" fontSize="11" fill={COL.core} textAnchor="middle">V = I × R</text>
      <text x="150" y="185" fontFamily="monospace" fontSize="11" fill={COL.volt} textAnchor="middle">P = V × I</text>
      <text x="270" y="185" fontFamily="monospace" fontSize="10" fill={COL.gnd} textAnchor="middle">1/Rₚ = 1/R2 + 1/R3</text>
    </svg>
  );
}

/* Apprentices: double socket termination on a ring final */
function IlloApprentices() {
  return (
    <svg viewBox="0 0 360 210" style={svgWrap} role="img" aria-label="Double socket outlet terminated on a ring final circuit, showing line, neutral and earth conductors">
      <text x="14" y="20" fontFamily="monospace" fontSize="9" fill={COL.core} opacity="0.55" letterSpacing="1">SOCKET TERMINATION · 2.5mm² T&amp;E · 32A RING</text>
      {/* Back box */}
      <rect x="26" y="34" width="150" height="150" rx="4" fill="#101318" stroke={COL.grey} strokeWidth="1.4" />
      {/* Faceplate */}
      <rect x="36" y="44" width="130" height="130" rx="6" fill="#161A20" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      {/* Two socket outlets */}
      {[70, 132].map((cx, i) => (
        <g key={i}>
          <rect x={cx - 24} y="66" width="48" height="86" rx="6" fill="#0D1014" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <rect x={cx - 3.5} y="78" width="7" height="14" rx="2" fill={COL.E} opacity="0.8" />
          <rect x={cx - 18} y="112" width="7" height="16" rx="2" fill={COL.L} opacity="0.85" />
          <rect x={cx + 11} y="112" width="7" height="16" rx="2" fill={COL.N} opacity="0.85" />
        </g>
      ))}
      {/* Terminal blocks (right) */}
      {[{ y: 60, c: COL.L, t: "L" }, { y: 100, c: COL.N, t: "N" }, { y: 140, c: COL.E, t: "E" }].map((tb, i) => (
        <g key={i}>
          <rect x="236" y={tb.y - 10} width="34" height="20" rx="3" fill="#12151A" stroke={tb.c} strokeWidth="1.4" />
          <text x="253" y={tb.y + 4} fontFamily="monospace" fontSize="10" fill={tb.c} textAnchor="middle">{tb.t}</text>
          {/* two ring conductors into each terminal */}
          <path d={`M270 ${tb.y - 4} H320`} stroke={tb.c} strokeWidth="2.4" fill="none" />
          <path d={`M270 ${tb.y + 4} H320`} stroke={tb.c} strokeWidth="2.4" fill="none" />
          {/* link from faceplate to terminal */}
          <path d={`M176 ${tb.y} H236`} stroke={tb.c} strokeWidth="1.6" fill="none" opacity="0.7" strokeDasharray="4 3" />
        </g>
      ))}
      {/* Earth fly-lead to metal box */}
      <path d="M236 140 Q205 200 40 178" stroke={COL.E} strokeWidth="1.6" fill="none" opacity="0.7" />
      <circle cx="40" cy="178" r="3" fill={COL.E} />
      <text x="300" y="46" fontFamily="monospace" fontSize="8" fill={COL.dim} textAnchor="middle">RING IN</text>
      <text x="300" y="176" fontFamily="monospace" fontSize="8" fill={COL.dim} textAnchor="middle">RING OUT</text>
      <text x="120" y="200" fontFamily="monospace" fontSize="8" fill={COL.dim} textAnchor="middle">cpc sleeved · earthed to metal box</text>
    </svg>
  );
}

/* Electricians: consumer unit (distribution board) */
function IlloElectricians() {
  const ways = [
    { t: "6A", l: "Lighting", c: COL.core }, { t: "32A", l: "Ring 1", c: COL.core },
    { t: "32A", l: "Ring 2", c: COL.core }, { t: "16A", l: "Immersion", c: COL.core },
    { t: "40A", l: "Cooker", c: COL.core }, { t: "32A", l: "EV", c: COL.volt },
  ];
  return (
    <svg viewBox="0 0 360 210" style={svgWrap} role="img" aria-label="Consumer unit with main switch, RCD and MCBs feeding final circuits">
      <text x="14" y="20" fontFamily="monospace" fontSize="9" fill={COL.core} opacity="0.55" letterSpacing="1">CONSUMER UNIT · MAIN SWITCH → RCD → MCBs</text>
      {/* Enclosure */}
      <rect x="20" y="30" width="320" height="130" rx="6" fill="#101318" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" />
      {/* Incoming tails */}
      <line x1="4" y1="52" x2="40" y2="52" stroke={COL.L} strokeWidth="3" />
      <line x1="4" y1="64" x2="40" y2="64" stroke={COL.N} strokeWidth="3" />
      <text x="2" y="46" fontFamily="monospace" fontSize="7" fill={COL.dim}>100A tails</text>
      {/* Main switch */}
      <rect x="40" y="44" width="40" height="70" rx="3" fill="#161A20" stroke={COL.grey} strokeWidth="1.2" />
      <text x="60" y="82" fontFamily="monospace" fontSize="7" fill={COL.txt} textAnchor="middle">MAIN</text>
      <text x="60" y="93" fontFamily="monospace" fontSize="7" fill={COL.dim} textAnchor="middle">100A</text>
      {/* RCD */}
      <rect x="86" y="44" width="46" height="70" rx="3" fill="rgba(52,211,153,0.08)" stroke={COL.gnd} strokeWidth="1.3" />
      <text x="109" y="76" fontFamily="monospace" fontSize="8" fill={COL.gnd} textAnchor="middle">RCD</text>
      <text x="109" y="88" fontFamily="monospace" fontSize="7" fill={COL.dim} textAnchor="middle">30mA</text>
      {/* Busbar */}
      <line x1="132" y1="52" x2="330" y2="52" stroke={COL.core} strokeWidth="2" opacity="0.7" />
      {/* MCBs */}
      {ways.map((w, i) => {
        const x = 142 + i * 33;
        return (
          <g key={i}>
            <rect x={x} y="58" width="26" height="52" rx="2" fill="#161A20" stroke={w.c} strokeWidth="1.1" />
            <line x1={x + 4} y1="52" x2={x + 4} y2="58" stroke={COL.core} strokeWidth="1.4" />
            <rect x={x + 4} y="64" width="18" height="10" rx="1.5" fill={w.c} opacity="0.75" />
            <text x={x + 13} y="72" fontFamily="monospace" fontSize="6" fill="#0A0A0C" textAnchor="middle">{w.t}</text>
            <text x={x + 13} y="90" fontFamily="monospace" fontSize="6" fill={COL.dim} textAnchor="middle">{w.l}</text>
            {/* outgoing circuit */}
            <line x1={x + 13} y1="110" x2={x + 13} y2="150" stroke={COL.core} strokeWidth="1.3" opacity="0.6" strokeDasharray="3 2" />
          </g>
        );
      })}
      <text x="180" y="176" fontFamily="monospace" fontSize="8" fill={COL.dim} textAnchor="middle">Ib ≤ In ≤ Iz  ·  verify Zs and 30mA disconnection</text>
    </svg>
  );
}

/* Engineers: three-phase distribution with derating to a motor */
function IlloEngineers() {
  const phases = [{ c: COL.L, t: "L1" }, { c: "#1a1a1a", t: "L2" }, { c: COL.grey, t: "L3" }, { c: COL.N, t: "N" }];
  return (
    <svg viewBox="0 0 360 210" style={svgWrap} role="img" aria-label="Three-phase distribution board feeding a motor, with cable derating factors">
      <text x="14" y="20" fontFamily="monospace" fontSize="9" fill={COL.core} opacity="0.55" letterSpacing="1">THREE-PHASE · DERATED CABLE → MOTOR</text>
      {/* Phase lines in */}
      {phases.map((p, i) => (
        <g key={i}>
          <line x1="6" y1={40 + i * 16} x2="70" y2={40 + i * 16} stroke={p.c === "#1a1a1a" ? "#2a2a2a" : p.c} strokeWidth="3" />
          <text x="2" y={44 + i * 16} fontFamily="monospace" fontSize="8" fill={p.c === "#1a1a1a" ? COL.txt : p.c}>{p.t}</text>
        </g>
      ))}
      {/* TPN breaker */}
      <rect x="70" y="30" width="52" height="76" rx="4" fill="#161A20" stroke={COL.core} strokeWidth="1.3" />
      <text x="96" y="62" fontFamily="monospace" fontSize="8" fill={COL.core} textAnchor="middle">TPN</text>
      <text x="96" y="74" fontFamily="monospace" fontSize="7" fill={COL.dim} textAnchor="middle">MCCB</text>
      <text x="96" y="86" fontFamily="monospace" fontSize="7" fill={COL.txt} textAnchor="middle">63A</text>
      {/* Cable run */}
      <line x1="122" y1="68" x2="250" y2="68" stroke={COL.core} strokeWidth="3" opacity="0.8" />
      <text x="186" y="60" fontFamily="monospace" fontSize="8" fill={COL.txt} textAnchor="middle">16mm² · Iz 76A</text>
      {/* Motor */}
      <circle cx="285" cy="68" r="30" fill="rgba(168,85,247,0.1)" stroke="#A855F7" strokeWidth="1.6" />
      <text x="285" y="66" fontFamily="monospace" fontSize="14" fill="#A855F7" textAnchor="middle">M</text>
      <text x="285" y="80" fontFamily="monospace" fontSize="9" fill="#A855F7" textAnchor="middle">3~</text>
      <text x="285" y="112" fontFamily="monospace" fontSize="7" fill={COL.dim} textAnchor="middle">400V · star-delta</text>
      {/* Derating panel */}
      <rect x="18" y="128" width="324" height="66" rx="6" fill="rgba(0,212,255,0.05)" stroke="rgba(0,212,255,0.22)" strokeWidth="0.8" />
      <text x="30" y="146" fontFamily="monospace" fontSize="8" fill={COL.volt}>DERATING</text>
      {[{ k: "Ca ambient", v: "0.87" }, { k: "Cg grouping", v: "0.70" }, { k: "Ci insulation", v: "1.00" }].map((d, i) => (
        <g key={i}>
          <text x={40 + i * 105} y="166" fontFamily="monospace" fontSize="8" fill={COL.dim}>{d.k}</text>
          <text x={40 + i * 105} y="182" fontFamily="monospace" fontSize="12" fill={COL.txt}>{d.v}</text>
        </g>
      ))}
      <text x="300" y="182" fontFamily="monospace" fontSize="9" fill={COL.gnd} textAnchor="end">It = In ÷ (Ca·Cg·Ci)</text>
    </svg>
  );
}

/* Teachers: two-way (staircase) lighting circuit */
function IlloTeachers() {
  return (
    <svg viewBox="0 0 360 210" style={svgWrap} role="img" aria-label="Two-way lighting circuit with two changeover switches, strappers and a lamp">
      <text x="14" y="20" fontFamily="monospace" fontSize="9" fill={COL.core} opacity="0.55" letterSpacing="1">TWO-WAY SWITCHING · STAIRCASE LIGHTING</text>
      {/* Line in */}
      <line x1="10" y1="70" x2="60" y2="70" stroke={COL.L} strokeWidth="2.4" />
      <text x="10" y="62" fontFamily="monospace" fontSize="8" fill={COL.L}>L</text>
      {/* Switch 1 (changeover) */}
      <circle cx="66" cy="70" r="3" fill={COL.L} />
      <line x1="66" y1="70" x2="98" y2="56" stroke={COL.L} strokeWidth="2" />
      <circle cx="102" cy="52" r="3" fill={COL.core} />
      <circle cx="102" cy="88" r="3" fill={COL.core} />
      <text x="60" y="104" fontFamily="monospace" fontSize="7" fill={COL.dim}>SW1 · COM</text>
      {/* Strappers */}
      <line x1="102" y1="52" x2="250" y2="52" stroke={COL.core} strokeWidth="2" />
      <line x1="102" y1="88" x2="250" y2="88" stroke={COL.core} strokeWidth="2" />
      <text x="176" y="45" fontFamily="monospace" fontSize="7" fill={COL.core} textAnchor="middle">strapper L1</text>
      <text x="176" y="102" fontFamily="monospace" fontSize="7" fill={COL.core} textAnchor="middle">strapper L2</text>
      {/* Switch 2 */}
      <circle cx="250" cy="52" r="3" fill={COL.core} />
      <circle cx="250" cy="88" r="3" fill={COL.core} />
      <line x1="286" y1="70" x2="250" y2="88" stroke={COL.L} strokeWidth="2" />
      <circle cx="286" cy="70" r="3" fill={COL.L} />
      <text x="256" y="104" fontFamily="monospace" fontSize="7" fill={COL.dim}>SW2 · COM</text>
      {/* Lamp */}
      <line x1="286" y1="70" x2="286" y2="120" stroke={COL.L} strokeWidth="2.4" />
      <circle cx="286" cy="140" r="18" fill="rgba(240,165,0,0.15)" stroke={COL.core} strokeWidth="1.6" />
      <line x1="274" y1="128" x2="298" y2="152" stroke={COL.core} strokeWidth="1.2" />
      <line x1="298" y1="128" x2="274" y2="152" stroke={COL.core} strokeWidth="1.2" />
      {/* Neutral return */}
      <line x1="286" y1="158" x2="286" y2="178" stroke={COL.N} strokeWidth="2.4" />
      <line x1="286" y1="178" x2="10" y2="178" stroke={COL.N} strokeWidth="2.4" />
      <text x="14" y="172" fontFamily="monospace" fontSize="8" fill={COL.N}>N</text>
      <text x="150" y="196" fontFamily="monospace" fontSize="8" fill={COL.dim} textAnchor="middle">one lamp, controlled from two positions</text>
    </svg>
  );
}

const ILLO: Record<string, () => React.JSX.Element> = {
  students: IlloStudents,
  apprentices: IlloApprentices,
  electricians: IlloElectricians,
  engineers: IlloEngineers,
  teachers: IlloTeachers,
};

const NAV_LINKS = [
  { label: "Design", href: "/design" },
  { label: "Calculate", href: "/calculate" },
  { label: "Guides", href: "/guides" },
  { label: "Learn", href: "/learn" },
];

const FEATURES = [
  {
    icon: Calculator,
    color: "rgba(240,165,0,0.12)",
    title: "Electrical Calculators",
    desc: "Eight focused calculators show formulas, units, substitutions, and results for direct review.",
  },
  {
    icon: BookOpen,
    color: "rgba(0,212,255,0.12)",
    title: "Reference Guides",
    desc: "Nine practical guides combine concise explanations, deterministic diagrams, safety context, and print views.",
  },
  {
    icon: Cable,
    color: "rgba(52,211,153,0.12)",
    title: "Load Analysis & Cable Sizing",
    desc: "Check design current, protective-device coordination, derating, thermal capacity, and voltage drop.",
  },
  {
    icon: GraduationCap,
    color: "rgba(168,85,247,0.12)",
    title: "Structured Learning",
    desc: "Nine courses contain 280 structured lessons with worked examples, checks, exercises, sources, and visible review status.",
  },
  {
    icon: Workflow,
    color: "rgba(240,165,0,0.12)",
    title: "Circuit design workflow",
    desc: "Enter the load once, then check the supply, protective device, cable size and voltage drop. Print the result with its assumptions.",
  },
  {
    icon: FileText,
    color: "rgba(255,68,68,0.1)",
    title: "Saved work and reports",
    desc: "Keep calculation history on this device and print a clear record of each calculation or design check.",
  },
];

const METHOD = [
  {
    title: "Standard formulas, shown",
    desc: "Each calculator shows the formula, substituted values and result. You can inspect the working before using it.",
  },
  {
    title: "Limits flagged, not assumed",
    desc: "Voltage drop results show the applied limit. Confirm that limit against the circuit type and the regulations that apply to the installation.",
  },
  {
    title: "An aid, not a substitute",
    desc: "ElectraCore supports your working; it doesn't replace a qualified design or inspection. Verify every result against the wiring regulations for your installation before you rely on it.",
  },
];

const WHO = [
  {
    role: "Students",
    tagline: "Learn the method. Check your answer.",
    illo: "students",
    points: [
      "Work through Ohm's law, power, series and parallel circuits, and Kirchhoff's laws from first principles. Each calculator shows its working.",
      "Follow structured courses from fundamentals to three-phase and cable sizing, each with worked examples and self-marking quizzes.",
      "Enter your own values and compare your method with the displayed calculation steps.",
      "Practise with supplied examples that reflect common electrical scenarios while keeping assumptions visible.",
    ],
    links: [
      { label: "Start with fundamentals →", href: "/learn/electrical-fundamentals" },
      { label: "Open the calculators", href: "/calculate" },
    ],
  },
  {
    role: "Apprentices",
    tagline: "Useful references for study and site work.",
    illo: "apprentices",
    points: [
      "Look up conductor colour codes for the UK/EU, US and AU/NZ: including the legacy colours you'll still meet in older installations.",
      "Review the safe isolation sequence before work. Prove the tester, test the circuit, then prove the tester again.",
      "Get terminations right: ring vs radial, fused spurs, and the earth sleeving and back-box bonding that pass inspection.",
      "Size a cable or check a voltage drop on your phone while you're standing at the board.",
    ],
    links: [
      { label: "Cable colour codes →", href: "/guides/cable-colour-codes" },
      { label: "Safe isolation procedure", href: "/guides/safe-isolation" },
    ],
  },
  {
    role: "Electricians",
    tagline: "Check the design and keep the working.",
    illo: "electricians",
    points: [
      "Use the Circuit Designer to check the load, protective device, cable size, correction factors and voltage drop in sequence.",
      "Export a printable design summary straight into the job file or hand it to the customer.",
      "Reference guides written the way the job is done: earthing systems, RCD types, loop-impedance testing.",
      "Save calculations on the device and print a record for the job file.",
    ],
    links: [
      { label: "Open the Circuit Designer →", href: "/design" },
      { label: "Browse the guides", href: "/guides" },
    ],
  },
  {
    role: "Engineers",
    tagline: "Design and commissioning, checked and documented.",
    illo: "engineers",
    points: [
      "Size conductors across four installation methods with ambient, grouping and thermal-insulation derating applied automatically.",
      "Verify voltage drop against the limit for the circuit: single- or three-phase, editable to your requirement.",
      "Correct power factor and check protection coverage with the individual calculators.",
      "Produce a documented design summary you can verify against your local wiring regulations before commissioning.",
    ],
    links: [
      { label: "Open the Circuit Designer →", href: "/design" },
      { label: "Power factor & more", href: "/calculate" },
    ],
  },
  {
    role: "Teachers",
    tagline: "Show the working, not just the result.",
    illo: "teachers",
    points: [
      "Demonstrate principles live: every calculator prints the formula and each step of the arithmetic.",
      "Use accurate, standards-referenced guides as ready-made classroom reference material.",
      "Set problems and mark them against the built-in worked examples and quizzes.",
      "Cover the whole syllabus in one place: theory, wiring, protection, testing and three-phase.",
    ],
    links: [
      { label: "Explore the course library →", href: "/learn" },
      { label: "Reference guides", href: "/guides" },
    ],
  },
];

export default function HomePage() {
  const revealRefs = useRef<HTMLElement[]>([]);
  const [activeWho, setActiveWho] = useState(0);
  const [hasProgress, setHasProgress] = useState(false);

  useEffect(() => {
    try {
      setHasProgress(Boolean(localStorage.getItem("ec-progress") || localStorage.getItem("electracore.learning.v2")));
    } catch {
      setHasProgress(false);
    }
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
      {/* HERO */}
      <section className="hero">
        <Image className="hero-photo" src="/electracore-lab-multimeter.jpg" alt="Digital multimeter and test leads arranged on an electrical laboratory bench" fill priority sizes="100vw" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-badge">Electrical learning, calculation and circuit tools</p>
          <h1 className="hero-title">Understand the circuit.<br /><span className="accent">Check the numbers.</span></h1>
          <p className="hero-sub">Learn electrical principles, study clear diagrams, work through practical examples, and use calculation tools with visible assumptions and safety context.</p>
          <div className="hero-actions">
            <Link href="/learn" className="btn-primary">{hasProgress ? "Continue learning" : "Start learning"}<ArrowRight size={17} aria-hidden="true" /></Link>
            <Link href="/calculate" className="btn-ghost">Open calculators</Link>
          </div>
          <div className="hero-links"><Link href="/learn">Explore courses</Link><Link href="/guides">Browse references</Link></div>
          <dl className="hero-stats">
            <div className="hero-stat"><dt className="hero-stat-num">9</dt><dd className="hero-stat-label">Courses</dd></div>
            <div className="hero-stat"><dt className="hero-stat-num">280</dt><dd className="hero-stat-label">Lessons</dd></div>
            <div className="hero-stat"><dt className="hero-stat-num">8</dt><dd className="hero-stat-label">Calculators</dd></div>
            <div className="hero-stat"><dt className="hero-stat-num">9</dt><dd className="hero-stat-label">References</dd></div>
          </dl>
          <p className="hero-credit">Laboratory multimeter photograph: Aldestyo, CC0 1.0, via Wikimedia Commons.</p>
        </div>
      </section>

      <nav className="quick-access" aria-label="Quick access">
        <p><strong>Work from one place.</strong><span>Progress, notes and saved calculations remain on this device.</span></p>
        <div>{[
          ["Browse courses", "/learn"], ["Open calculator", "/calculate"], ["Circuit designer", "/design"],
          ["Reference library", "/guides"], ["Saved calculations", "/calculate#saved-calculations"],
        ].map(([label, href]) => <Link key={href} href={href}>{label}<ArrowRight size={15} aria-hidden="true" /></Link>)}</div>
      </nav>
      {/* FEATURES */}
      <section style={{ background: "var(--bg2)", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p className="section-label" ref={addReveal}>Platform</p>
          <h2 className="section-title reveal" ref={addReveal}>Tools for learning and preliminary checks.</h2>
          <p className="section-sub reveal" ref={addReveal}>
            One focused workspace for calculation, reference, structured learning, and traceable design checks.
          </p>
          <div className="feature-grid">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="feature-card reveal"
                ref={addReveal}
                style={{ transitionDelay: `${i * 0.07}s` }}
              >
                <div className="feature-icon" style={{ background: f.color }}><f.icon size={22} strokeWidth={1.8} aria-hidden="true" /></div>
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
        <p className="section-sub reveal" ref={addReveal}>
          Choose the view that matches your work. The same formulas, diagrams and references remain available throughout.
        </p>
        <div className="who-wrap">
          <div className="who-tabs" role="tablist" aria-label="Who ElectraCore is for">
            {WHO.map((w, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={activeWho === i}
                onClick={() => setActiveWho(i)}
                className={`who-tab${activeWho === i ? " active" : ""}`}
              >
                <span className="who-tab-role">{w.role}</span>
                <span className="who-tab-line">{w.tagline}</span>
              </button>
            ))}
          </div>

          <div className="who-panel" role="tabpanel">
            {(() => {
              const w = WHO[activeWho];
              const Illo = ILLO[w.illo];
              return (
                <>
                  <div className="who-panel-illo">{Illo && <Illo />}</div>
                  <div className="who-panel-body">
                    <div className="who-panel-role">{w.role}</div>
                    <div className="who-panel-tagline">{w.tagline}</div>
                    <ul className="who-points">
                      {w.points.map((p, j) => (
                        <li key={j}><span className="who-point-mark">→</span>{p}</li>
                      ))}
                    </ul>
                    <div className="who-panel-cta">
                      {w.links.map((l, j) => (
                        <Link key={j} href={l.href} className={j === 0 ? "btn-primary who-cta-btn" : "btn-ghost who-cta-btn"}>
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        <style>{`
          .who-wrap { display: grid; grid-template-columns: 300px minmax(0,1fr); gap: 2rem; align-items: start; margin-top: 2.5rem; }
          .who-tabs { display: flex; flex-direction: column; gap: 0.5rem; }
          .who-tab { display: flex; flex-direction: column; gap: 3px; text-align: left; width: 100%; padding: 0.9rem 1.1rem; border-radius: var(--radius-sm); background: transparent; border: 1px solid transparent; color: var(--text-dim); font-family: inherit; cursor: pointer; transition: all 0.2s; }
          .who-tab:hover { border-color: var(--border); background: rgba(255,255,255,0.02); }
          .who-tab.active { background: rgba(var(--core-rgb),0.1); border-color: rgba(var(--core-rgb),0.4); }
          .who-tab-role { font-size: 1.05rem; font-weight: 800; color: var(--text-dim); }
          .who-tab.active .who-tab-role { color: var(--text); }
          .who-tab-line { font-size: 0.78rem; color: var(--text-mute); line-height: 1.4; }
          .who-tab.active .who-tab-line { color: var(--core); }
          .who-panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
          .who-panel-illo { padding: 1.25rem 1.25rem 0; }
          .who-panel-body { padding: 1.25rem 1.5rem 1.5rem; }
          .who-panel-role { font-size: 1.3rem; font-weight: 900; letter-spacing: -0.02em; }
          .who-panel-tagline { font-size: 0.9rem; color: var(--core); font-weight: 600; margin: 2px 0 1.1rem; }
          .who-points { list-style: none; display: flex; flex-direction: column; gap: 0.7rem; margin-bottom: 1.5rem; }
          .who-points li { display: flex; gap: 0.6rem; font-size: 0.9rem; color: var(--text-dim); line-height: 1.65; }
          .who-point-mark { color: var(--core); font-weight: 700; flex-shrink: 0; }
          .who-panel-cta { display: flex; flex-wrap: wrap; gap: 0.75rem; }
          .who-cta-btn { padding: 0.6rem 1.15rem; font-size: 0.85rem; }
          @media (max-width: 860px) {
            .who-wrap { grid-template-columns: 1fr; }
            .who-tabs { flex-direction: row; overflow-x: auto; scrollbar-width: none; }
            .who-tabs::-webkit-scrollbar { display: none; }
            .who-tab { min-width: 180px; }
          }
        `}</style>
      </section>

      {/* ACCURACY & METHOD */}
      <section style={{ background: "var(--bg)", padding: "5rem 1.5rem", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p className="section-label reveal" ref={addReveal}>Accuracy &amp; method</p>
          <h2 className="section-title reveal" ref={addReveal}>Calculations you can check.</h2>
          <p className="section-sub reveal" ref={addReveal}>
            Every result includes the method and assumptions needed to check it. Confirm the final design against the applicable regulations and product data.
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
            Every calculator, guide, and course is open access. Saved calculations and learning progress remain on this device.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/calculate" className="btn-primary">Open Calculators</Link>
            <Link href="/learn" className="btn-ghost">Start Learning</Link>
          </div>
        </div>
      </div>

      {/* ACCESS */}
      <section className="section">
        <p className="section-label reveal" ref={addReveal}>Access</p>
        <h2 className="section-title reveal" ref={addReveal}>The complete platform is open.</h2>
        <p className="section-sub reveal" ref={addReveal}>
          Use all calculators, guides, courses, and design tools without an account or checkout.
        </p>
        <div className="price-grid">
          {[
            { title: "Calculate", desc: "Eight calculators with units, visible working, saved history, and printable results.", href: "/calculate", cta: "Open calculators" },
            { title: "Learn", desc: "Nine courses and 280 structured lessons with checks, exercises, sources, visible review status, and device-local progress.", href: "/learn", cta: "Browse courses" },
            { title: "Design", desc: "A connected preliminary workflow for load current, protection, cable capacity, and voltage drop.", href: "/design", cta: "Open designer" },
          ].map((item, i) => (
            <div key={item.title} className="price-card reveal" ref={addReveal} style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className="price-tier">{item.title}</div>
              <div className="price-desc">{item.desc}</div>
              <Link href={item.href} className="btn-ghost" style={{ width: "100%", justifyContent: "center" }}>
                {item.cta}
              </Link>
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
