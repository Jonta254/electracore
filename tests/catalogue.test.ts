import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const catalogueSource = fs.readFileSync(new URL("../app/learn/page.tsx", import.meta.url), "utf8");
const courseSource = fs.readFileSync(new URL("../app/learn/[slug]/page.tsx", import.meta.url), "utf8");

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
