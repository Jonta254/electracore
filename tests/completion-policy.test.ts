import assert from "node:assert/strict";
import test from "node:test";
import { canMarkLessonComplete } from "../app/learn/completionPolicy.ts";

test("completion policy preserves legacy completion and gates new activity credit", () => {
  assert.equal(canMarkLessonComplete({ type: "lesson", alreadyComplete: false, exerciseComplete: false }), true);
  assert.equal(canMarkLessonComplete({ type: "exercise", alreadyComplete: false, exerciseComplete: false }), false);
  assert.equal(canMarkLessonComplete({ type: "exercise", alreadyComplete: false, exerciseComplete: true }), true);
  assert.equal(canMarkLessonComplete({ type: "quiz", alreadyComplete: false, exerciseComplete: false, bestAssessmentScore: 69 }), false);
  assert.equal(canMarkLessonComplete({ type: "quiz", alreadyComplete: false, exerciseComplete: false, bestAssessmentScore: 70 }), true);
  assert.equal(canMarkLessonComplete({ type: "quiz", alreadyComplete: true, exerciseComplete: false }), true);
});
