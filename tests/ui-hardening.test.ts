import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path: string) => fs.readFileSync(new URL(path, import.meta.url), "utf8");

test("major routes rely on the shared global header", () => {
  for (const path of ["../app/calculate/page.tsx", "../app/design/page.tsx", "../app/guides/page.tsx"]) {
    assert.doesNotMatch(read(path), /<nav className="nav/);
  }
});

test("stateful design and catalogue controls expose their selected state", () => {
  const designer = read("../app/design/page.tsx");
  const calculators = read("../app/calculate/page.tsx");
  const guides = read("../app/guides/page.tsx");
  assert.match(designer, /aria-pressed=\{inp\.phase === "single"\}/);
  assert.match(designer, /aria-live="polite"/);
  assert.match(calculators, /aria-pressed=\{activeId === c\.id\}/);
  assert.match(guides, /aria-pressed=\{cat === c\}/);
});

test("search combobox exposes its active descendant", () => {
  const header = read("../app/components/GlobalHeader.tsx");
  assert.match(header, /role="combobox"/);
  assert.match(header, /aria-activedescendant=/);
  assert.match(header, /id=\{`site-search-result-\$\{index\}`\}/);
});

test("public designer copy stays within preliminary-screening scope", () => {
  const designer = read("../app/design/page.tsx");
  assert.match(designer, /Screen a preliminary cable size/);
  assert.doesNotMatch(designer, /verified cable|Design passes|PASS: Design passes/);
});

test("every course maps to a disclosed responsive lesson context image", () => {
  const lesson = read("../app/learn/EnhancedLessonView.tsx");
  for (const slug of ["electrical-fundamentals", "domestic-wiring", "protection-fault-analysis", "three-phase-systems", "cable-sizing", "solar-pv", "industrial-control", "inspection-testing", "led-lighting"]) {
    assert.match(lesson, new RegExp(`"${slug}"\\s*:`), `missing lesson media for ${slug}`);
  }
  assert.match(lesson, /AI-created editorial illustration; not installation or test guidance/);
  assert.match(lesson, /sizes="\(max-width: 760px\) calc\(100vw - 1\.5rem\), 68ch"/);
  assert.match(lesson, /<LessonContextImage courseSlug=\{courseSlug\}/);
});

test("all registered lesson context assets exist", () => {
  for (const name of ["measurement", "industrial", "solar", "lighting"]) {
    assert.equal(fs.existsSync(new URL(`../public/lesson-context-${name}-v1.png`, import.meta.url)), true, `missing ${name} context asset`);
  }
});

test("instruction diagrams retain critical engineering qualifications", () => {
  const course = read("../app/learn/[slug]/CourseExperience.tsx");
  assert.match(course, /MCB OPERATING REGIONS · SCHEMATIC ONLY/);
  assert.match(course, /manufacturer time-current curve for coordination/);
  assert.match(course, /RMS is an equivalent heating value/);
  assert.match(course, /select cable with tabulated capacity ≥ It/);
  assert.match(course, /OL NC/);
  assert.match(course, /KM1 aux NO \(seal-in\)/);
  assert.match(course, /Eav = N·F·UF·MF/);
  assert.match(course, /optional compatible storage port/);
  assert.match(course, /Δ: Iʟ=√3·Iₚ/);
  assert.match(course, /SIMPLIFIED CHARGE MODEL/);
  assert.match(course, /time limit depends on device type and test current/);
  assert.match(course, /BEFORE ENERGIZATION \(WHERE RELEVANT\)/);
  assert.match(course, /METHOD \/ SYSTEM DEPENDENT/);
  assert.doesNotMatch(course, /30mA trips &lt;300 ms/);
});

test("lesson handouts support structured print and self-contained download", () => {
  const lesson = read("../app/learn/EnhancedLessonView.tsx");
  const course = read("../app/learn/[slug]/CourseExperience.tsx");
  const css = read("../app/globals.css");
  assert.match(course, /lessonTitle=\{lesson\.title\}/);
  assert.match(lesson, /Download handout/);
  assert.match(lesson, /new Blob\(\[html\], \{ type: "text\/html;charset=utf-8" \}\)/);
  assert.match(lesson, /canvas\.toDataURL\("image\/jpeg", 0\.9\)/);
  assert.match(lesson, /copy\.querySelectorAll\("details"\)/);
  assert.match(lesson, /lesson-print-header/);
  assert.match(lesson, /Print \/ save PDF/);
  assert.match(css, /@page \{ size: A4 portrait; margin: 16mm 15mm 18mm; \}/);
  assert.match(css, /break-inside: avoid-page/);
  assert.match(css, /\.terms-table thead \{ display: table-header-group; \}/);
  assert.match(css, /\.lesson-sources a\[href\]::after/);
});
