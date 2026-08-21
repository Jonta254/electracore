import assert from "node:assert/strict";
import test from "node:test";
import { parallelResistance, seriesResistance, twoBranchCurrents, voltageDivider } from "../app/learn/circuitMath.ts";

test("verified fundamentals examples reproduce series and parallel results", () => {
  assert.equal(seriesResistance(100, 200), 300);
  assert.equal(parallelResistance(6, 3), 2);
  assert.equal(seriesResistance(4, parallelResistance(6, 3)), 6);
});
test("divider utility models unloaded and loaded outputs", () => {
  assert.equal(voltageDivider(15, 10_000, 5_000), 5);
  assert.equal(voltageDivider(9, 2_000, 1_000), 3);
  assert.equal(voltageDivider(9, 2_000, 1_000, 1_000), 1.8);
});
test("current division conserves total current", () => {
  const result = twoBranchCurrents(6, 6, 3);
  assert.equal(result.first, 2); assert.equal(result.second, 4); assert.equal(result.first + result.second, 6);
});
test("network utilities reject invalid resistance values", () => {
  assert.throws(() => parallelResistance(10, 0), RangeError);
  assert.throws(() => seriesResistance(Number.NaN), RangeError);
});