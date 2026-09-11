import React from "react";

const ink = "#F0F0F0";
const dim = "#888899";
const line = "#00D4FF";
const hot = "#FF4444";
const earth = "#34D399";
const core = "#F0A500";

const wrap: React.CSSProperties = { display: "block", width: "100%", height: "auto", background: "#0B0D11", borderRadius: 8 };
const text = { fontFamily: "monospace", fontSize: 9 };

export function SymbolSheet() {
  const rows = [
    ["Conductor", "line"], ["Junction", "junction"], ["Switch, SPST", "switch"],
    ["Lamp / luminaire", "lamp"], ["Fuse", "fuse"], ["Protective device", "breaker"],
    ["Earth / PE", "earth"], ["Motor", "motor"], ["Transformer", "transformer"],
  ];
  return <svg viewBox="0 0 640 300" style={wrap} role="img" aria-label="IEC-style teaching symbol sheet showing common electrical diagram symbols">
    <text x="18" y="22" fill={core} {...text} letterSpacing="1">COMMON SYMBOLS · IEC-STYLE TEACHING SET</text>
    {rows.map(([label, kind], i) => { const x = 28 + (i % 3) * 205; const y = 52 + Math.floor(i / 3) * 78; return <g key={kind} transform={`translate(${x} ${y})`}>
      <rect width="184" height="58" rx="5" fill="#12151A" stroke="#2A3038" />
      <text x="12" y="18" fill={ink} {...text}>{label}</text>
      {kind === "line" && <line x1="20" y1="38" x2="164" y2="38" stroke={line} strokeWidth="2"/>}
      {kind === "junction" && <><line x1="20" y1="38" x2="164" y2="38" stroke={line} strokeWidth="2"/><line x1="92" y1="24" x2="92" y2="52" stroke={line} strokeWidth="2"/><circle cx="92" cy="38" r="4" fill={line}/></>}
      {kind === "switch" && <><line x1="20" y1="38" x2="76" y2="38" stroke={line} strokeWidth="2"/><line x1="108" y1="38" x2="164" y2="38" stroke={line} strokeWidth="2"/><line x1="76" y1="38" x2="104" y2="24" stroke={core} strokeWidth="2"/><circle cx="76" cy="38" r="3" fill={line}/><circle cx="108" cy="38" r="3" fill={line}/></>}
      {kind === "lamp" && <><line x1="20" y1="38" x2="64" y2="38" stroke={line} strokeWidth="2"/><circle cx="92" cy="38" r="20" fill="none" stroke={core} strokeWidth="2"/><path d="M78 24l28 28m0-28L78 52" stroke={core} strokeWidth="1.5"/><line x1="120" y1="38" x2="164" y2="38" stroke={line} strokeWidth="2"/></>}
      {kind === "fuse" && <><line x1="20" y1="38" x2="70" y2="38" stroke={line} strokeWidth="2"/><rect x="70" y="29" width="44" height="18" fill="none" stroke={core} strokeWidth="2"/><line x1="80" y1="38" x2="104" y2="38" stroke={core} strokeWidth="1.5"/><line x1="114" y1="38" x2="164" y2="38" stroke={line} strokeWidth="2"/></>}
      {kind === "breaker" && <><line x1="20" y1="38" x2="70" y2="38" stroke={line} strokeWidth="2"/><rect x="70" y="27" width="44" height="22" rx="3" fill="none" stroke={hot} strokeWidth="2"/><text x="92" y="42" fill={hot} textAnchor="middle" {...text}>QF</text><line x1="114" y1="38" x2="164" y2="38" stroke={line} strokeWidth="2"/></>}
      {kind === "earth" && <><line x1="92" y1="22" x2="92" y2="38" stroke={earth} strokeWidth="2"/><line x1="70" y1="38" x2="114" y2="38" stroke={earth} strokeWidth="2"/><line x1="76" y1="44" x2="108" y2="44" stroke={earth} strokeWidth="2"/><line x1="83" y1="50" x2="101" y2="50" stroke={earth} strokeWidth="2"/></>}
      {kind === "motor" && <><line x1="20" y1="38" x2="62" y2="38" stroke={line} strokeWidth="2"/><circle cx="92" cy="38" r="28" fill="none" stroke={core} strokeWidth="2"/><text x="92" y="43" fill={core} textAnchor="middle" {...text}>M</text><line x1="120" y1="38" x2="164" y2="38" stroke={line} strokeWidth="2"/></>}
      {kind === "transformer" && <><line x1="20" y1="38" x2="62" y2="38" stroke={line} strokeWidth="2"/><path d="M68 20q12 9 0 18t0 18M78 20q12 9 0 18t0 18" fill="none" stroke={core} strokeWidth="2"/><line x1="88" y1="20" x2="88" y2="56" stroke={dim} strokeWidth="2"/><path d="M98 20q12 9 0 18t0 18M108 20q12 9 0 18t0 18" fill="none" stroke={core} strokeWidth="2"/><line x1="120" y1="38" x2="164" y2="38" stroke={line} strokeWidth="2"/></>}
    </g> })}
    <text x="18" y="286" fill={dim} {...text}>Teaching redraws only. Confirm the applicable symbol library, device data, and project convention before issuing drawings.</text>
  </svg>;
}

export function LightingWiringDiagram() {
  return <svg viewBox="0 0 720 230" style={wrap} role="img" aria-label="Simplified one-way lighting wiring diagram with line switched to a lamp, neutral direct to the lamp, and protective earth continuous">
    <text x="18" y="22" fill={core} {...text} letterSpacing="1">ONE-WAY LIGHTING · FUNCTIONAL WIRING VIEW</text>
    <rect x="24" y="64" width="98" height="88" rx="6" fill="#12151A" stroke={line}/><text x="73" y="87" fill={line} textAnchor="middle" {...text}>CU</text><text x="73" y="105" fill={ink} textAnchor="middle" {...text}>MCB / RCBO</text><text x="73" y="123" fill={dim} textAnchor="middle" {...text}>isolate + protect</text>
    <line x1="122" y1="82" x2="224" y2="82" stroke={hot} strokeWidth="3"/><text x="132" y="73" fill={hot} {...text}>L</text>
    <line x1="122" y1="112" x2="536" y2="112" stroke="#AAB4C0" strokeWidth="2"/><text x="132" y="104" fill="#AAB4C0" {...text}>N</text>
    <line x1="122" y1="142" x2="536" y2="142" stroke={earth} strokeWidth="2"/><text x="132" y="135" fill={earth} {...text}>CPC / PE</text>
    <rect x="224" y="61" width="70" height="42" rx="5" fill="#12151A" stroke={core}/><text x="259" y="86" fill={core} textAnchor="middle" {...text}>S1</text><line x1="294" y1="82" x2="356" y2="82" stroke={hot} strokeWidth="3"/><line x1="294" y1="82" x2="336" y2="67" stroke={core} strokeWidth="2"/><circle cx="294" cy="82" r="3" fill={hot}/><circle cx="356" cy="82" r="3" fill={hot}/><text x="224" y="52" fill={dim} {...text}>switch line only</text>
    <rect x="536" y="66" width="120" height="92" rx="8" fill="#12151A" stroke={core}/><circle cx="596" cy="112" r="23" fill="none" stroke={core} strokeWidth="2"/><path d="M580 96l32 32m0-32l-32 32" stroke={core} strokeWidth="1.5"/><text x="596" y="148" fill={ink} textAnchor="middle" {...text}>L1 luminaire</text>
    <line x1="356" y1="82" x2="536" y2="82" stroke={hot} strokeWidth="3"/><text x="382" y="73" fill={hot} {...text}>switched L</text>
    <text x="18" y="190" fill={dim} {...text}>The CPC/PE does not become a switch conductor. Route it continuously to exposed-conductive-parts and terminate it correctly.</text>
  </svg>;
}

export function ControlLadderDiagram() {
  return <svg viewBox="0 0 720 210" style={wrap} role="img" aria-label="Simplified direct-on-line motor control ladder showing stop normally closed, start normally open, contactor coil and auxiliary seal-in contact">
    <text x="18" y="22" fill={core} {...text} letterSpacing="1">DOL CONTROL · SIMPLIFIED LADDER LOGIC</text>
    <line x1="52" y1="48" x2="52" y2="170" stroke={line} strokeWidth="2"/><line x1="650" y1="48" x2="650" y2="170" stroke={line} strokeWidth="2"/>
    <text x="45" y="42" fill={line} {...text}>L control</text><text x="610" y="42" fill={line} {...text}>N control</text>
    <line x1="52" y1="82" x2="112" y2="82" stroke={line} strokeWidth="2"/><line x1="154" y1="82" x2="204" y2="82" stroke={line} strokeWidth="2"/><line x1="246" y1="82" x2="310" y2="82" stroke={line} strokeWidth="2"/>
    <text x="133" y="67" fill={ink} textAnchor="middle" {...text}>STOP NC</text><line x1="112" y1="70" x2="154" y2="94" stroke={core} strokeWidth="2"/><line x1="112" y1="82" x2="112" y2="70" stroke={line} strokeWidth="2"/><line x1="154" y1="94" x2="154" y2="82" stroke={line} strokeWidth="2"/>
    <text x="225" y="67" fill={ink} textAnchor="middle" {...text}>OL NC</text><line x1="204" y1="70" x2="246" y2="94" stroke={core} strokeWidth="2"/><line x1="204" y1="82" x2="204" y2="70" stroke={line} strokeWidth="2"/><line x1="246" y1="94" x2="246" y2="82" stroke={line} strokeWidth="2"/>
    <line x1="310" y1="82" x2="340" y2="82" stroke={line} strokeWidth="2"/><line x1="382" y1="82" x2="430" y2="82" stroke={line} strokeWidth="2"/>
    <text x="361" y="67" fill={ink} textAnchor="middle" {...text}>START NO</text><line x1="340" y1="94" x2="382" y2="70" stroke={core} strokeWidth="2"/>
    <line x1="310" y1="82" x2="310" y2="140" stroke={line} strokeWidth="2"/><line x1="310" y1="140" x2="340" y2="140" stroke={line} strokeWidth="2"/><line x1="382" y1="140" x2="430" y2="140" stroke={line} strokeWidth="2"/><line x1="430" y1="140" x2="430" y2="82" stroke={line} strokeWidth="2"/>
    <text x="361" y="126" fill={ink} textAnchor="middle" {...text}>KM1 AUX NO</text><line x1="340" y1="152" x2="382" y2="128" stroke={core} strokeWidth="2"/>
    <line x1="430" y1="82" x2="492" y2="82" stroke={line} strokeWidth="2"/><rect x="492" y="62" width="60" height="40" rx="20" fill="none" stroke={core} strokeWidth="2"/><text x="522" y="87" fill={core} textAnchor="middle" {...text}>KM1</text><line x1="552" y1="82" x2="650" y2="82" stroke={line} strokeWidth="2"/>
    <text x="18" y="194" fill={dim} {...text}>The start branch is momentary; the KM1 auxiliary contact seals the coil until STOP or overload opens.</text>
  </svg>;
}
