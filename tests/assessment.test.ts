import assert from "node:assert/strict";
import test from "node:test";
import { calculateAssessmentScore } from "../app/learn/assessment.ts";

test("scores complete and partial multi-question assessment attempts", () => {
  assert.equal(calculateAssessmentScore([0, 2, 1, 3], { 0: 0, 1: 2, 2: 1, 3: 3 }), 100);
  assert.equal(calculateAssessmentScore([0, 2, 1], { 0: 0, 1: 1, 2: 1 }), 67);
  assert.equal(calculateAssessmentScore([], {}), 0);
});
