import Link from "next/link";

const stages = [
  ["1", "Define", "Scope, drawings, supply, environment, responsibilities"],
  ["2", "Control", "Risk assessment, isolation plan, permits, boundaries"],
  ["3", "Inspect", "Condition, identification, damage, suitability, access"],
  ["4", "Test", "Dead-first sequence, justified live tests, record readings"],
  ["5", "Diagnose", "Confirm symptom, divide the circuit, prove the cause"],
  ["6", "Close", "Rectify, retest, label, certify, explain, hand over"],
];

export function FieldWorkflow() {
  return (
    <div className="field-workflow" role="list" aria-label="Six-stage electrical field workflow">
      {stages.map(([number, title, detail]) => (
        <div className="field-workflow-step" role="listitem" key={number}>
          <span aria-hidden="true">{number}</span>
          <strong>{title}</strong>
          <small>{detail}</small>
        </div>
      ))}
      <style>{`
        .field-workflow { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr)); gap:.75rem; }
        .field-workflow-step { min-width:0; padding:1rem; border:1px solid var(--border); background:var(--bg2); }
        .field-workflow-step span { display:grid; place-items:center; width:1.75rem; height:1.75rem; margin-bottom:.7rem; border:1px solid rgba(var(--core-rgb),.45); color:var(--core); font:700 .75rem 'JetBrains Mono',monospace; }
        .field-workflow-step strong { display:block; color:var(--text); font-size:.92rem; margin-bottom:.35rem; }
        .field-workflow-step small { display:block; color:var(--text-dim); font-size:.8rem; line-height:1.55; }
      `}</style>
    </div>
  );
}

export function ToolkitLinks() {
  return (
    <nav className="toolkit-links" aria-label="ElectraCore field toolkit shortcuts">
      <Link href="/guides/electrical-symbols-diagrams">Read electrical drawings</Link>
      <Link href="/guides/safe-isolation">Follow safe isolation</Link>
      <Link href="/calculate">Open calculators</Link>
      <Link href="/design">Screen a cable design</Link>
      <style>{`
        .toolkit-links { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,190px),1fr)); gap:.65rem; }
        .toolkit-links a { min-height:44px; display:flex; align-items:center; justify-content:center; padding:.7rem 1rem; border:1px solid rgba(var(--core-rgb),.35); color:var(--core); background:rgba(var(--core-rgb),.06); text-decoration:none; font-size:.84rem; font-weight:750; text-align:center; }
        .toolkit-links a:hover, .toolkit-links a:focus-visible { background:rgba(var(--core-rgb),.14); border-color:var(--core); }
      `}</style>
    </nav>
  );
}

export function FieldSources() {
  return (
    <div className="field-sources">
      <p>Authoritative sources reviewed for this guide:</p>
      <ul>
        <li><a href="https://skillsengland.education.gov.uk/apprenticeship-standards/st0152?view=epa" target="_blank" rel="noopener noreferrer">Skills England: Installation and maintenance electrician, version 1.2</a></li>
        <li><a href="https://www.hse.gov.uk/pubns/books/gs38.htm" target="_blank" rel="noopener noreferrer">HSE GS38: Electrical test equipment for low-voltage systems</a></li>
        <li><a href="https://www.hse.gov.uk/pubns/priced/hsg85.pdf" target="_blank" rel="noopener noreferrer">HSE HSG85: Electricity at work, safe working practices</a></li>
        <li><a href="https://www.osha.gov/enforcement/directives/std-01-16-007" target="_blank" rel="noopener noreferrer">OSHA: Electrical safety-related work practices</a></li>
      </ul>
      <style>{`
        .field-sources { padding:1rem 1.1rem; border:1px solid var(--border); background:var(--bg2); color:var(--text-dim); font-size:.82rem; line-height:1.6; overflow-wrap:anywhere; }
        .field-sources p { color:var(--text); font-weight:700; margin:0 0 .5rem; }
        .field-sources ul { margin:0; padding-left:1.2rem; }
        .field-sources a { color:var(--volt); text-underline-offset:3px; }
      `}</style>
    </div>
  );
}
