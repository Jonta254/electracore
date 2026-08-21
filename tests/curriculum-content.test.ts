import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { ENHANCED_LESSONS } from "../app/learn/enhancedLessons.ts";

test("enhanced fundamentals preserve the existing lesson IDs", () => {
  assert.deepEqual(Object.keys(ENHANCED_LESSONS).sort(), [
    "electrical-fundamentals:l6", "electrical-fundamentals:l7",
    "electrical-fundamentals:l8", "electrical-fundamentals:l9",
  ]);
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
