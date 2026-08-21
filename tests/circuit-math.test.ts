import assert from "node:assert/strict";
import test from "node:test";
import { capacitiveReactance, inductiveReactance, parallelResistance, periodFromFrequency, rcTimeConstant, rlTimeConstant, seriesResistance, sineRms, twoBranchCurrents, voltageDivider } from "../app/learn/circuitMath.ts";

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
test("AC lesson examples reproduce RMS, period, and reactance results", () => {
  assert.ok(Math.abs(sineRms(10) - 7.0710678119) < 1e-9);
  assert.equal(periodFromFrequency(50), 0.02);
  assert.ok(Math.abs(capacitiveReactance(50, 100e-6) - 31.8309886184) < 1e-9);
  assert.ok(Math.abs(inductiveReactance(50, 0.1) - 31.4159265359) < 1e-9);
});
test("first-order time constants reproduce documented examples", () => {
  assert.equal(rcTimeConstant(10_000, 100e-6), 1);
  assert.equal(rlTimeConstant(0.2, 10), 0.02);
  assert.throws(() => periodFromFrequency(0), RangeError);
});
