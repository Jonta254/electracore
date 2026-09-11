import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { COURSE_LESSON_COUNTS } from "../app/learn/courseTopology.ts";

const catalogueSource = fs.readFileSync(new URL("../app/learn/page.tsx", import.meta.url), "utf8");
const courseSource = fs.readFileSync(new URL("../app/learn/[slug]/CourseExperience.tsx", import.meta.url), "utf8");
const enhancedReaderSource = fs.readFileSync(new URL("../app/learn/EnhancedLessonView.tsx", import.meta.url), "utf8");
const globalStyles = fs.readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const nextConfigSource = fs.readFileSync(new URL("../next.config.mjs", import.meta.url), "utf8");
const lessonRouteSource = fs.readFileSync(new URL("../app/learn/[slug]/[lessonId]/page.tsx", import.meta.url), "utf8");
const lessonExperienceSource = fs.readFileSync(new URL("../app/learn/[slug]/[lessonId]/LessonExperience.tsx", import.meta.url), "utf8");
const lessonLayoutSource = fs.readFileSync(new URL("../app/learn/[slug]/[lessonId]/layout.tsx", import.meta.url), "utf8");
const courseRouteSource = fs.readFileSync(new URL("../app/learn/[slug]/page.tsx", import.meta.url), "utf8");

function sourceFiles(directory: URL): URL[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const child = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, directory);
    if (entry.isDirectory()) return sourceFiles(child);
    return /\.tsx?$/.test(entry.name) ? [child] : [];
  });
}

test("catalogue metadata covers every preserved course and matches lesson counts", () => {
  const courseBlocks = [...courseSource.matchAll(/^  "([^"]+)": \{([\s\S]*?)(?=^  "[^"]+": \{|^\};)/gm)];
  assert.equal(courseBlocks.length, 9);
  for (const [, slug, block] of courseBlocks) {
    const lessonCount = [...block.matchAll(/\{ id: "l\d+", title: "[^"]+", duration: "\d+min", type: "(?:lesson|quiz|exercise)" \}/g)].length;
    assert.match(catalogueSource, new RegExp(`"${slug}": \\{ lessons: ${lessonCount},`), `${slug} catalogue count is stale`);
    assert.equal(COURSE_LESSON_COUNTS[slug as keyof typeof COURSE_LESSON_COUNTS], lessonCount, `${slug} route topology is stale`);
  }
});

test("learning catalogue uses versioned progress and exposes substantive filters", () => {
  assert.match(catalogueSource, /loadCourseLearning\(localStorage, course\.slug\)/);
  for (const label of ["Learning pathway", "Completion", "Estimated duration", "Practical exercise", "Related calculator", "Technical diagram"]) {
    assert.ok(catalogueSource.includes(label), `missing catalogue filter: ${label}`);
  }
});

test("professional learning routes contain no emoji controls or false video type", () => {
  const emoji = /[\u{1F300}-\u{1FAFF}]/u;
  assert.equal(emoji.test(catalogueSource), false);
  assert.equal(emoji.test(courseSource), false);
  assert.doesNotMatch(courseSource, /type: "video"/i);

});

test("customer-facing source avoids editorial em dashes", () => {
  const appRoot = new URL("../app/", import.meta.url);

  for (const file of sourceFiles(appRoot)) {
    const source = fs.readFileSync(file, "utf8");
    assert.equal(source.includes("—"), false, `${file.pathname} contains an editorial em dash`);
  }
});

test("enhanced lesson reader exposes responsive orientation and print controls", () => {
  for (const section of ["Purpose", "Core theory", "Worked example", "Knowledge check", "Sources"]) {
    assert.ok(enhancedReaderSource.includes(`label: "${section}"`), `missing lesson section: ${section}`);
  }
  assert.match(enhancedReaderSource, /aria-current=\{activeSection === section\.id \? "location"/);
  assert.match(enhancedReaderSource, /className="lesson-mobile-contents"/);
  assert.match(enhancedReaderSource, /onClick=\{\(\) => window\.print\(\)\}/);
  assert.match(enhancedReaderSource, /className="lesson-reading-progress"/);
});

test("lesson reader styles preserve reading measure, mobile navigation, and print output", () => {
  assert.match(globalStyles, /\.lesson-reading-column\s*\{[\s\S]*?max-width:\s*68ch/);
  assert.match(globalStyles, /@media\(max-width:760px\)[\s\S]*\.lesson-mobile-tools\s*\{[^}]*display:\s*grid/);
  assert.match(globalStyles, /@media print[\s\S]*\.lesson-reader-rail\s*\{[^}]*display:\s*none !important/);
  assert.match(globalStyles, /break-inside:\s*avoid/);
  assert.match(courseSource, /className="lesson-content-shell"/);
  assert.match(courseSource, /className="lesson-reading-body"/);
  assert.match(globalStyles, /\.lesson-content-shell\s*\{[^}]*margin-inline:\s*0 !important/);
});

test("lesson controls are keyboard-native and production CSP is bounded", () => {
  assert.match(courseSource, /className="lesson-open"/);
  assert.match(courseSource, /aria-current=\{isActive \? "page"/);
  assert.match(courseSource, /href=\{`\/learn\/\$\{slug\}\/\$\{lesson\.id\}`\}/);
  assert.doesNotMatch(courseSource, /className=\{`lesson-item[\s\S]{0,180}onClick=/);
  assert.match(nextConfigSource, /NODE_ENV === 'development'/);
  assert.match(nextConfigSource, /"connect-src 'self'"/);
  assert.match(nextConfigSource, /"object-src 'none'"/);
  assert.doesNotMatch(nextConfigSource, /"connect-src 'self' https:"/);
  assert.doesNotMatch(nextConfigSource, /"img-src 'self' data: blob: https:"/);
});

test("every lesson opens on a stable route with syllabus and sequence navigation", () => {
  assert.match(courseSource, /href=\{`\/learn\/\$\{slug\}\/\$\{lesson\.id\}`\}/);
  assert.doesNotMatch(courseSource, /isActive && \(\s*<LessonContent/);
  assert.match(lessonExperienceSource, /aria-label="Course syllabus"/);
  assert.match(lessonExperienceSource, /aria-current=\{itemLesson\.id === lesson\.id \? "page"/);
  assert.match(lessonExperienceSource, /Lesson \{index \+ 1\} of \{lessons\.length\}/);
  assert.match(lessonExperienceSource, /previousLesson=\{lessons\[index - 1\]\}/);
  assert.match(lessonExperienceSource, /nextLesson=\{lessons\[index \+ 1\]\}/);
  assert.match(lessonExperienceSource, /id="lesson-jump"/);
  assert.match(lessonExperienceSource, /<optgroup key=\{item\.id\}/);
  assert.match(courseSource, /className="course-primary-actions"/);
  assert.match(courseSource, /Continue learning/);
  assert.match(courseRouteSource, /if \(!isCourseSlug\(slug\)\) notFound\(\)/);
  assert.match(lessonLayoutSource, /if \(!isLessonIdForCourse\(slug, lessonId\)\) notFound\(\)/);
  assert.match(courseRouteSource, /if \(!isCourseSlug\(slug\)\) notFound\(\)/);
  assert.match(lessonLayoutSource, /if \(!isLessonIdForCourse\(slug, lessonId\)\) notFound\(\)/);
  assert.match(courseSource, /isLessonIdForCourse\(slug, saved\.lastLessonId\)/);
  assert.match(courseSource, /aria-expanded=\{isOpen\}/);
  assert.match(courseSource, /aria-controls=\{`module-lessons-\$\{mod\.id\}`\}/);
  assert.doesNotMatch(courseSource, /if \(next\) try \{ recordExercise/);
  assert.match(courseSource, /I have completed this exercise/);
  assert.match(courseSource, /Final assessment · \$\{quizData\.length\} questions/);
  assert.match(courseSource, /calculateAssessmentScore\(quizData\.map\(item => item\.correct\), next\)/);
  assert.match(lessonRouteSource, /enhancedLesson=\{getEnhancedLesson\(slug, lessonId\)\}/);
  assert.doesNotMatch(courseSource, /Loading reviewed lesson content/);
  assert.match(lessonExperienceSource, /ASSESSMENT_PASS_SCORE/);
  assert.match(lessonExperienceSource, /completedExercises\.includes\(lesson\.id\)/);
  assert.match(courseSource, /Previous assessment performance/);
});

test("lesson visuals are technical, labelled, and topic-routed", () => {
  assert.match(enhancedReaderSource, /function QuantityDiagram/);
  assert.match(enhancedReaderSource, /role="img" aria-labelledby=/);
  for (const visual of ["RING, SPUR, AND RADIAL TOPOLOGY", "EARTH-FAULT LOOP AND ADS", "MOTOR STARTER POWER AND CONTROL", "PV I-V CURVE AND OPERATING POINTS", "MULTIMETER CONNECTIONS"]) {
    assert.ok(enhancedReaderSource.includes(visual), `missing technical visual: ${visual}`);
  }
  for (const label of ["TWO-WAY CHANGEOVER CIRCUIT", "COM", "L1", "L2", "strapper 1", "strapper 2", "INTERMEDIATE CROSSOVER CIRCUIT"]) {
    assert.ok(enhancedReaderSource.includes(label), `missing lesson-specific wiring label: ${label}`);
  }
  assert.doesNotMatch(enhancedReaderSource, /lesson-field-visual/);
  assert.match(enhancedReaderSource, /<QuantityDiagram courseSlug=\{courseSlug\} lessonId=\{lessonId\}/);
  assert.doesNotMatch(enhancedReaderSource, /LessonContextImage|Context image|AI-created editorial illustration/);
});
