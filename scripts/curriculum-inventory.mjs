import fs from "node:fs";

const source = fs.readFileSync(new URL("../app/learn/[slug]/page.tsx", import.meta.url), "utf8");
const lines = source.split(/\r?\n/);
const rows = [];
let course = "";
let moduleTitle = "";
const richTerms = /ohm|voltage|current|resistance|kirchhoff|power|series|parallel|rcd|cable|three.phase|mcb|solar|pv|motor|atom|electron|earthing|ac vs dc|frequency|inspection|testing|led|lighting/i;

for (const line of lines) {
  const courseMatch = line.match(/^  "([^"]+)": \{$/);
  if (courseMatch) course = courseMatch[1];
  const moduleMatch = line.match(/(?:^\s*\{|^\s*)id: "m\d+", title: "([^"]+)"/);
  if (moduleMatch) moduleTitle = moduleMatch[1];
  const lesson = line.match(/\{ id: "(l\d+)", title: "([^"]+)", duration: "([^"]+)", type: "(video|quiz|exercise)" \}/);
  if (!lesson || !course) continue;
  const [, id, title, duration, type] = lesson;
  const rich = richTerms.test(title);
  rows.push({
    course, moduleTitle, id, title, duration, type,
    url: `/learn/${course} (lesson id: ${id})`,
    depth: rich ? "Topic-specific summary" : "Generic fallback summary",
    diagram: rich && type === "video" ? "Topic diagram where matched" : "None recorded",
    assessment: type === "quiz" ? "Multiple choice" : type === "exercise" ? "Worked exercise" : "None",
    review: "Professional review pending",
    plan: course === "electrical-fundamentals" && ["l6", "l7", "l8", "l9"].includes(id)
      ? "Deepen in current implementation group"
      : "Preserve; review in a later small group",
    risk: type === "quiz" || type === "exercise" ? "Medium — progress/answer behavior" : "Low — content-only",
  });
}

const header = [
  "# Curriculum matrix",
  "",
  `Generated from the preserved course database on 2026-08-14. Courses: ${new Set(rows.map(r => r.course)).size}; lessons: ${rows.length}.`,
  "",
  "Lesson IDs are internal state identifiers on the course route. There are no separate per-lesson URL paths; changing an ID would risk stored completion compatibility.",
  "",
  "| Course | Module | Lesson | Existing URL / ID | Duration | Type | Present depth | Diagram | Assessment | Accuracy review | Planned improvement | Migration risk |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
];
const escape = (value) => String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
const body = rows.map(r => `| ${[r.course, r.moduleTitle, r.title, r.url, r.duration, r.type, r.depth, r.diagram, r.assessment, r.review, r.plan, r.risk].map(escape).join(" | ")} |`);
fs.writeFileSync(new URL("../docs/CURRICULUM-MATRIX.md", import.meta.url), [...header, ...body, ""].join("\n"));
console.log(`Wrote ${rows.length} lesson rows across ${new Set(rows.map(r => r.course)).size} courses.`);
