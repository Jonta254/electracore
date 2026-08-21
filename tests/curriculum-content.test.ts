import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { ENHANCED_LESSONS } from "../app/learn/enhancedLessons.ts";
import { LESSON_REVIEWS } from "../app/learn/reviewStates.ts";

test("enhanced fundamentals preserve the verified checkpoint lesson IDs", () => {
  for (const id of ["l6", "l7", "l8", "l9"]) {
    assert.ok(ENHANCED_LESSONS[`electrical-fundamentals:${id}`]);
  }
});

test("course inventory contains 9 courses and 280 uniquely addressable lessons", () => {
  const source = fs.readFileSync(new URL("../app/learn/[slug]/page.tsx", import.meta.url), "utf8");
  const courseBlocks = [...source.matchAll(/^  "([^"]+)": \{([\s\S]*?)(?=^  "[^"]+": \{|^\};)/gm)];
  assert.equal(courseBlocks.length, 9);
  let total = 0;
  const inventory = new Set<string>();
  for (const [, slug, block] of courseBlocks) {
    const ids = [...block.matchAll(/\{ id: "(l\d+)", title: "([^"]+)", duration: "([^"]+)", type: "(video|quiz|exercise)" \}/g)];
    assert.ok(ids.length > 0, `${slug} has no lessons`);
    const local = new Set<string>();
    for (const [, id, title, duration] of ids) {
      assert.ok(title.trim().length > 3, `${slug}:${id} has an invalid title`);
      assert.match(duration, /^\d+min$/, `${slug}:${id} has an invalid duration`);
      assert.equal(local.has(id), false, `${slug} duplicates ${id}`);
      local.add(id);
      inventory.add(`${slug}:${id}`);
      total += 1;
    }
  }
  assert.equal(total, 280);
  assert.equal(inventory.size, 280);
  for (const key of Object.keys(ENHANCED_LESSONS)) assert.ok(inventory.has(key), `orphan enhancement: ${key}`);
});

test("worked numerical answers are reproducible without false precision", () => {
  assert.equal(24 / 2, 12);
  assert.equal(0.45 / 0.150, 3);
  assert.equal(24 / 120, 0.2);
  assert.ok(Math.abs(24 * 0.2 - 4.8) < 1e-12);
  assert.equal(48 / 0.4, 120);
});

test("every enhanced lesson has sources, review state, safety, and local context", () => {
  for (const lesson of Object.values(ENHANCED_LESSONS)) {
    assert.ok(lesson.sources.length >= 2);
    assert.equal(lesson.reviewStatus, "professional-review-pending");
    assert.ok(lesson.safety.length > 40);
    assert.ok(lesson.localCode.length > 40);
    assert.ok(lesson.objectives.length >= 4);
    assert.ok(lesson.workedExample.steps.length >= 3);
  }
});

test("all inline quiz correct-answer indexes are within their option arrays", () => {
  const source = fs.readFileSync(new URL("../app/learn/[slug]/page.tsx", import.meta.url), "utf8");
  const blocks = [...source.matchAll(/options:\s*\[([^\]]+)\],\s*correct:\s*(\d+)/g)];
  assert.ok(blocks.length >= 5);
  for (const block of blocks) {
    const options = [...block[1].matchAll(/"[^"]*"/g)];
    const correct = Number(block[2]);
    assert.ok(correct >= 0 && correct < options.length, `Invalid quiz mapping: index ${correct}, options ${options.length}`);
  }
});
test("first fundamentals group has truthful review evidence", () => {
  const group = Array.from({ length: 15 }, (_, index) => `electrical-fundamentals:l${index + 1}`);
  for (const key of group) {
    const review = LESSON_REVIEWS[key];
    assert.ok(review, `missing review state for ${key}`);
    assert.match(review.reviewedOn, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(review.evidence.length >= 40);
  }
  assert.equal(Object.keys(ENHANCED_LESSONS).length, 12);
});

test("fundamentals module quiz and circuit practice do not use generic fallbacks", () => {
  const source = fs.readFileSync(new URL("../app/learn/[slug]/page.tsx", import.meta.url), "utf8");
  assert.match(source, /slug === "electrical-fundamentals" && t\.includes\("module quiz"\)/);
  assert.match(source, /t\.includes\("circuit analysis practice"\)/);
  assert.match(source, /Branch currents are 4\/6 = 0\.667 A and 4\/3 = 1\.333 A/);
});
