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

test("home exposes a main landmark and complete keyboard tab semantics", () => {
  const home = read("../app/page.tsx");
  assert.match(home, /<main>/);
  assert.match(home, /aria-controls="who-panel"/);
  assert.match(home, /aria-labelledby=\{`who-tab-\$\{activeWho\}`\}/);
  assert.match(home, /onKeyDown=\{\(event\) => selectWhoWithKeyboard\(event, i\)\}/);
});

test("major product areas and dynamic content expose route metadata", () => {
  for (const path of ["../app/calculate/layout.tsx", "../app/design/layout.tsx", "../app/learn/layout.tsx", "../app/guides/layout.tsx"]) {
    assert.match(read(path), /export const metadata: Metadata/);
  }
  assert.match(read("../app/learn/[slug]/page.tsx"), /generateMetadata/);
  assert.match(read("../app/learn/[slug]/[lessonId]/page.tsx"), /generateMetadata/);
  const guideLayout = read("../app/guides/[slug]/layout.tsx");
  assert.match(guideLayout, /generateMetadata/);
  assert.match(guideLayout, /export const dynamicParams = false/);
  assert.match(guideLayout, /notFound\(\)/);
});

test("guide content stays server-rendered with a minimal print client boundary", () => {
  const guide = read("../app/guides/[slug]/page.tsx");
  const print = read("../app/guides/[slug]/PrintGuideButton.tsx");
  assert.doesNotMatch(guide, /^"use client"/);
  assert.match(guide, /export default async function GuidePage/);
  assert.match(guide, /const \{ slug \} = await params/);
  assert.match(guide, /<PrintGuideButton \/>/);
  assert.match(print, /^"use client"/);
  assert.match(print, /window\.print\(\)/);
});

test("public designer copy stays within preliminary-screening scope", () => {
  const designer = read("../app/design/page.tsx");
  assert.match(designer, /Screen a preliminary cable size/);
  assert.doesNotMatch(designer, /verified cable|Design passes|PASS: Design passes/);
});

test("customer-facing lessons use technical content instead of AI context art", () => {
  const lesson = read("../app/learn/EnhancedLessonView.tsx");
  assert.doesNotMatch(lesson, /LESSON_CONTEXT_MEDIA/);
  assert.doesNotMatch(lesson, /LessonContextImage/);
  assert.doesNotMatch(lesson, /AI-created editorial illustration/);
  assert.match(lesson, /enhanced-diagram/);
});

test("all registered lesson context assets exist", () => {
  for (const name of ["measurement", "industrial", "solar", "lighting"]) {
    assert.equal(fs.existsSync(new URL(`../public/lesson-context-${name}-v1.png`, import.meta.url)), true, `missing ${name} context asset`);
  }
});

test("homepage uses registered real photography and current product counts", () => {
  const home = read("../app/page.tsx");
  assert.match(home, /src="\/electracore-lab-multimeter\.jpg"/);
  assert.match(home, /CC0 public domain dedication/);
  assert.match(home, />11<\/dt><dd className="hero-stat-label">References/);
  assert.doesNotMatch(home, /electracore-training-bench-v2\.png/);
});

test("small-screen navigation and content layouts cover tablet and phone widths", () => {
  const css = read("../app/globals.css");
  const home = read("../app/page.tsx");
  const guide = read("../app/guides/[slug]/page.tsx");
  const course = read("../app/learn/[slug]/CourseExperience.tsx");
  const calculator = read("../app/calculate/page.tsx");
  const designer = read("../app/design/page.tsx");
  assert.match(css, /@media \(max-width: 768px\)[\s\S]*?\.nav-hamburger \{ display: flex; \}/);
  assert.match(css, /grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(css, /max-height: 100dvh/);
  assert.match(home, /@media \(max-width: 520px\)[\s\S]*?\.who-tabs \{ display: grid; grid-template-columns: 1fr 1fr/);
  assert.match(guide, /\.g-kv-row \{ grid-template-columns: 1fr/);
  assert.match(guide, /\.g-table-wrap \{ margin-inline: -\.9rem/);
  assert.match(course, /\.lesson-open \{ min-height: 44px/);
  assert.match(course, /\.lesson-right \.lesson-type-badge \{ display: none/);
  assert.match(calculator, /\.calc-report-val \{ white-space: normal/);
  assert.match(designer, /\.dz-metrics \{ grid-template-columns: 1fr/);
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

test("electrical symbol guide keeps accessible responsive diagrams and safety boundaries", () => {
  const content = read("../app/guides/content.tsx");
  const diagrams = read("../app/guides/electrical-diagrams.tsx");
  assert.match(content, /slug: "electrical-symbols-diagrams"/);
  assert.match(content, /IEC 60617/);
  assert.match(content, /this page is not permission to work live/i);
  assert.match(content, /design, alteration, testing, and certification belong to a competent person/i);
  assert.match(diagrams, /role="img"/);
  assert.match(diagrams, /aria-label="IEC-style teaching symbol sheet/);
  assert.match(diagrams, /width: "100%", height: "auto"/);
  assert.match(diagrams, /START NO/);
  assert.match(diagrams, /KM1 AUX NO/);
  assert.match(diagrams, /The start branch is momentary/);
});

test("field toolkit covers the researched electrical work lifecycle", () => {
  const content = read("../app/guides/content.tsx");
  const toolkit = read("../app/guides/field-toolkit.tsx");
  const catalogue = read("../app/guides/page.tsx");
  const reviews = read("../app/guides/review.ts");
  assert.match(content, /slug: "electrical-field-toolkit"/);
  for (const stage of ["Define", "Control", "Inspect", "Test", "Diagnose", "Close"]) {
    assert.match(toolkit, new RegExp(`"${stage}"`));
  }
  assert.match(content, /Do not proceed when the circuit cannot be positively identified/);
  assert.match(content, /Minimum useful job record/);
  assert.match(toolkit, /grid-template-columns:repeat\(auto-fit,minmax\(min\(100%,180px\),1fr\)\)/);
  assert.match(toolkit, /min-height:44px/);
  assert.match(catalogue, /"Fieldwork"/);
  assert.match(catalogue, /g\.summary, g\.cat, \.\.\.g\.standards/);
  assert.match(reviews, /"electrical-field-toolkit"/);
  assert.match(reviews, /ST0152 version 1\.2/);
});

test("field guides retain current RCD and fault-protection qualifications", () => {
  const content = read("../app/guides/content.tsx");
  assert.match(content, /AC test at IΔn/);
  assert.match(content, /Operate within 300 ms under the stated BS 7671 verification conditions/);
  assert.match(content, /legacy 2×\/5× routines/);
  assert.match(content, /Loop\/electrode impedance still matters/);
  assert.match(content, /never bypass protective devices merely to obtain a reading/);
  assert.match(content, /The uncorrected diversified sum of about 118 A exceeds 100 A/);
  assert.doesNotMatch(content, /trips &lt;300 ms/);
  assert.doesNotMatch(content, /link out the RCD/);
  assert.doesNotMatch(content, /disconnects regardless of (?:loop impedance|Zs)/);
  assert.doesNotMatch(content, /comfortably fits a 100 A supply/);
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
