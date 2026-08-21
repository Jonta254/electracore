import type { EnhancedLesson } from "./enhancedLessons";

function QuantityDiagram({ lessonId }: { lessonId: string }) {
  const labels: Record<string, string> = {
    l1: "ATOMIC CHARGE MODEL", l2: "CHARGE — COULOMBS AND CARRIERS", l3: "MATERIAL RESPONSE", l4: "CURRENT DIRECTION CONVENTIONS",
    l6: "VOLTAGE — ENERGY PER CHARGE", l7: "CURRENT — CHARGE PER SECOND", l8: "RESISTANCE — MATERIAL + GEOMETRY", l9: "OHM'S LAW — ONE RELATIONSHIP, THREE FORMS",
    l11: "SERIES — ONE CURRENT PATH", l12: "PARALLEL — COMMON VOLTAGE", l13: "SERIES-PARALLEL REDUCTION", l14: "DIVIDER RELATIONSHIPS",
    l16: "KCL — CURRENT BALANCE", l17: "KVL — LOOP BALANCE", l18: "MESH AND NODAL VARIABLES", l20: "POWER — ENERGY RATE", l21: "ENERGY OVER TIME", l22: "CABLE LOSS AND EFFICIENCY",
  };
  const label = labels[lessonId] ?? "ELECTRICAL RELATIONSHIP";
  return (
    <svg className="enhanced-diagram" viewBox="0 0 640 190" role="img" aria-labelledby={`diagram-${lessonId}`}>
      <title id={`diagram-${lessonId}`}>{label}</title>
      <text x="22" y="26" className="diagram-kicker">{label}</text>
      {["l1","l2","l3","l4"].includes(lessonId) && <>
        <circle cx="180" cy="100" r="54" className="diagram-source" /><circle cx="180" cy="100" r="12" className="diagram-charge" />
        <circle cx="180" cy="100" r="36" fill="none" className="diagram-wire" /><circle cx="216" cy="100" r="7" className="diagram-charge" />
        <text x="180" y="105" className="diagram-value">+</text><text x="400" y="82" className="diagram-value">{lessonId === "l3" ? "carrier availability" : lessonId === "l4" ? "I →   ← e⁻" : "Q = n·e"}</text>
        <text x="400" y="112" className="diagram-note">{lessonId === "l3" ? "material and conditions matter" : "sign and direction are explicit"}</text>
      </>}
      {["l11","l12","l13","l14"].includes(lessonId) && <>
        <line x1="60" y1="70" x2="580" y2="70" className="diagram-wire" /><line x1="60" y1="140" x2="580" y2="140" className="diagram-wire" />
        <rect x="205" y="58" width="70" height="24" className="diagram-load" /><rect x="365" y="58" width="70" height="24" className="diagram-load" />
        <text x="240" y="52" className="diagram-note">R₁</text><text x="400" y="52" className="diagram-note">R₂</text>
        <text x="320" y="120" className="diagram-value">{lessonId === "l11" ? "Req = ΣR" : lessonId === "l12" ? "1/Req = Σ1/R" : lessonId === "l13" ? "reduce → check → expand" : "Vout = Vin·R₂/(R₁+R₂)"}</text>
      </>}
      {["l16","l17","l18"].includes(lessonId) && <>
        <circle cx="320" cy="103" r="9" className="diagram-charge" />
        <line x1="75" y1="103" x2="311" y2="103" className="diagram-wire" /><line x1="329" y1="103" x2="565" y2="55" className="diagram-wire" /><line x1="329" y1="103" x2="565" y2="151" className="diagram-wire" />
        <text x="190" y="88" className="diagram-note">incoming</text><text x="470" y="48" className="diagram-note">branch 1</text><text x="470" y="168" className="diagram-note">branch 2</text>
        <text x="320" y="58" className="diagram-value">{lessonId === "l16" ? "ΣI = 0" : lessonId === "l17" ? "ΣV = 0" : "choose node V or mesh I"}</text>
      </>}
      {["l20","l21","l22"].includes(lessonId) && <>
        <rect x="90" y="65" width="150" height="76" rx="6" className="diagram-source" /><rect x="400" y="65" width="150" height="76" rx="6" className="diagram-load" />
        <line x1="240" y1="103" x2="400" y2="103" className="diagram-wire" />
        <text x="165" y="108" className="diagram-value">input</text><text x="475" y="108" className="diagram-value">output</text>
        <text x="320" y="82" className="diagram-note">{lessonId === "l20" ? "P = VI" : lessonId === "l21" ? "E = Pt" : "Ploss = I²R"}</text>
        <text x="320" y="133" className="diagram-note">{lessonId === "l22" ? "η = Pout / Pin" : "units carry meaning"}</text>
      </>}      {lessonId === "l6" && <>
        <circle cx="95" cy="96" r="43" className="diagram-source" />
        <text x="95" y="91" className="diagram-value">12 V</text><text x="95" y="111" className="diagram-note">source rise</text>
        <line x1="138" y1="96" x2="486" y2="96" className="diagram-wire" />
        <rect x="486" y="62" width="104" height="68" rx="5" className="diagram-load" />
        <text x="538" y="91" className="diagram-value">lamp</text><text x="538" y="111" className="diagram-note">12 V drop</text>
        <text x="310" y="78" className="diagram-note">energy carried to load</text>
      </>}
      {lessonId === "l7" && <>
        <line x1="60" y1="96" x2="580" y2="96" className="diagram-wire" />
        {[120, 200, 280, 360, 440].map((x) => <g key={x}><circle cx={x} cy="96" r="7" className="diagram-charge" /><path d={`M${x + 12} 88 l16 8 -16 8z`} className="diagram-arrow" /></g>)}
        <text x="320" y="55" className="diagram-value">I = Q ÷ t</text><text x="320" y="145" className="diagram-note">3 C each second = 3 A</text>
      </>}
      {lessonId === "l8" && <>
        <line x1="60" y1="70" x2="300" y2="70" className="diagram-thin" /><text x="180" y="52" className="diagram-note">longer → more R</text>
        <line x1="360" y1="70" x2="580" y2="70" className="diagram-thick" /><text x="470" y="52" className="diagram-note">larger area → less R</text>
        <text x="320" y="140" className="diagram-value">R = ρL ÷ A</text>
      </>}
      {lessonId === "l9" && <>
        <circle cx="320" cy="98" r="68" className="diagram-source" />
        <text x="320" y="74" className="diagram-value">V</text>
        <line x1="270" y1="94" x2="370" y2="94" className="diagram-wire" />
        <text x="286" y="126" className="diagram-value">I</text><text x="354" y="126" className="diagram-value">R</text>
        <text x="90" y="101" className="diagram-note">V = I × R</text><text x="475" y="101" className="diagram-note">I = V ÷ R</text>
      </>}
    </svg>
  );
}

export function EnhancedLessonView({ lesson, lessonId }: { lesson: EnhancedLesson; lessonId: string }) {
  return (
    <div className="enhanced-lesson">
      <nav className="lesson-toc" aria-label="Lesson contents">
        <a href={`#purpose-${lessonId}`}>Purpose</a><a href={`#theory-${lessonId}`}>Theory</a>
        <a href={`#example-${lessonId}`}>Worked example</a><a href={`#check-${lessonId}`}>Knowledge check</a>
        <a href={`#sources-${lessonId}`}>Sources</a>
      </nav>

      <section id={`purpose-${lessonId}`}>
        <div className="lesson-meta-line"><span>{lesson.difficulty}</span><span>Review: {lesson.reviewStatus === "professional-review-pending" ? "expert review pending" : "reviewed"}</span></div>
        <h3>Purpose</h3><p>{lesson.purpose}</p>
        <div className="lesson-callout remember"><strong>Before you begin</strong><span>{lesson.prerequisites.join(" · ")}</span></div>
        <h3>Learning objectives</h3><ul>{lesson.objectives.map(item => <li key={item}>{item}</li>)}</ul>
        <p className="lesson-introduction">{lesson.introduction}</p>
      </section>

      <QuantityDiagram lessonId={lessonId} />

      <section id={`theory-${lessonId}`}>
        <h3>Core theory</h3>{lesson.theory.map(item => <p key={item}>{item}</p>)}
        <div className="terms-table-wrap"><table className="terms-table"><caption>Terms, symbols, and units</caption><thead><tr><th>Term</th><th>Meaning</th><th>Symbol</th><th>Unit</th></tr></thead>
          <tbody>{lesson.terms.map(item => <tr key={item.term}><th scope="row">{item.term}</th><td>{item.meaning}</td><td>{item.symbol ?? "—"}</td><td>{item.unit ?? "—"}</td></tr>)}</tbody>
        </table></div>
        {lesson.formula && <div className="lesson-formula"><code>{lesson.formula.expression}</code><p>{lesson.formula.explanation}</p><small>{lesson.formula.units}</small></div>}
      </section>

      <section id={`example-${lessonId}`}>
        <div className="lesson-callout example"><strong>Worked example</strong><span>{lesson.workedExample.problem}</span></div>
        <p><strong>Assumptions:</strong> {lesson.workedExample.assumptions.join("; ")}.</p>
        <ol className="worked-steps">{lesson.workedExample.steps.map(step => <li key={step.label}><strong>{step.label}:</strong> {step.detail}</li>)}</ol>
        <p className="worked-answer">{lesson.workedExample.answer}</p>
        <p><strong>Reasonableness check:</strong> {lesson.workedExample.reasonableness}</p>
      </section>

      <div className="lesson-callout mistake"><strong>Common mistakes</strong><ul>{lesson.commonMistakes.map(item => <li key={item}>{item}</li>)}</ul></div>
      <h3>Where this appears in practice</h3><p>{lesson.application}</p>
      <div className="lesson-callout safety"><strong>Safety</strong><span>{lesson.safety}</span></div>
      <div className="lesson-callout local"><strong>Local code check</strong><span>{lesson.localCode}</span></div>

      <section id={`check-${lessonId}`}>
        <h3>Knowledge check</h3>
        <details className="lesson-check-detail"><summary>{lesson.knowledgeCheck.question}</summary><p><strong>{lesson.knowledgeCheck.answer}.</strong> {lesson.knowledgeCheck.feedback}</p></details>
        <h3>Practical exercise</h3><p>{lesson.practicalExercise}</p>
        <h3>Summary</h3><ul>{lesson.summary.map(item => <li key={item}>{item}</li>)}</ul>
      </section>

      <section id={`sources-${lessonId}`} className="lesson-sources">
        <h3>Sources and review</h3>
        <ul>{lesson.sources.map(source => <li key={source.title}>{source.url ? <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a> : source.title} — {source.publisher}; {source.edition}; {source.jurisdiction}</li>)}</ul>
        <p>Content review date: {lesson.reviewDate}. Professional electrical review is pending.</p>
      </section>
    </div>
  );
}
