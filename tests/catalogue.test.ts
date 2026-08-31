import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const catalogueSource = fs.readFileSync(new URL("../app/learn/page.tsx", import.meta.url), "utf8");
const courseSource = fs.readFileSync(new URL("../app/learn/[slug]/page.tsx", import.meta.url), "utf8");
const enhancedReaderSource = fs.readFileSync(new URL("../app/learn/EnhancedLessonView.tsx", import.meta.url), "utf8");
const globalStyles = fs.readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const nextConfigSource = fs.readFileSync(new URL("../next.config.mjs", import.meta.url), "utf8");

test("catalogue metadata covers every preserved course and matches lesson counts", () => {
  const courseBlocks = [...courseSource.matchAll(/^  "([^"]+)": \{([\s\S]*?)(?=^  "[^"]+": \{|^\};)/gm)];
  assert.equal(courseBlocks.length, 9);
  for (const [, slug, block] of courseBlocks) {
    const lessonCount = [...block.matchAll(/\{ id: "l\d+", title: "[^"]+", duration: "\d+min", type: "(?:lesson|quiz|exercise)" \}/g)].length;
    assert.match(catalogueSource, new RegExp(`"${slug}": \\{ lessons: ${lessonCount},`), `${slug} catalogue count is stale`);
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
  assert.match(courseSource, /aria-expanded=\{isActive\}/);
  assert.doesNotMatch(courseSource, /className=\{`lesson-item[\s\S]{0,180}onClick=/);
  assert.match(nextConfigSource, /NODE_ENV === 'development'/);
  assert.match(nextConfigSource, /"connect-src 'self'"/);
  assert.match(nextConfigSource, /"object-src 'none'"/);
  assert.doesNotMatch(nextConfigSource, /"connect-src 'self' https:"/);
  assert.doesNotMatch(nextConfigSource, /"img-src 'self' data: blob: https:"/);
});
