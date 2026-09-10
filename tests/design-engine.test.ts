import assert from "node:assert/strict";
import test from "node:test";
import { designCircuit, type DesignInput } from "../app/design/engine.ts";

const base: DesignInput = {
  phase: "single", mode: "power", power: "7400", pf: "1", current: "",
  voltage: "230", length: "25", deviceOverride: null, method: "C",
  ambientC: 30, groupN: 1, insulationId: "none", vdLimitPct: "3",
};

test("sizes the documented 7.4 kW example", () => {
  const result = designCircuit(base);
  assert.equal(result.valid, true);
  assert.equal(result.In, 40);
  assert.equal(result.thermalSize, 6);
  assert.equal(result.finalSize, 6);
  assert.ok(result.checks.every((check) => check.ok));
});

test("increases cable size when voltage drop governs", () => {
  const result = designCircuit({ ...base, mode: "current", current: "32", length: "60" });
  assert.equal(result.thermalSize, 4);
  assert.equal(result.finalSize, 16);
  assert.equal(result.vdLimited, true);
  assert.ok((result.vdPct ?? Infinity) <= 3);
});

test("applies three-phase current calculation", () => {
  const result = designCircuit({ ...base, phase: "three", power: "11000", voltage: "400", pf: "0.8" });
  assert.ok(Math.abs(result.Ib - 19.846) < 0.01);
  assert.equal(result.In, 20);
});

test("rejects invalid inputs and flags an undersized manual device", () => {
  assert.equal(designCircuit({ ...base, pf: "0" }).valid, false);
  assert.equal(designCircuit({ ...base, length: "0" }).valid, false);
  const result = designCircuit({ ...base, mode: "current", current: "40", deviceOverride: 32 });
  assert.equal(result.checks[0].ok, false);
});

test("fails closed outside the supported device range", () => {
  const result = designCircuit({ ...base, mode: "current", current: "126" });
  assert.equal(result.valid, false);
  assert.match(result.message ?? "", /exceeds the supported automatic-device range/);
  assert.equal(result.In, 0);
});

test("rejects missing, non-finite, and out-of-range voltage-drop limits", () => {
  for (const vdLimitPct of ["", "0", "-1", "101", "Infinity", "5 percent"]) {
    const result = designCircuit({ ...base, vdLimitPct });
    assert.equal(result.valid, false, `accepted ${vdLimitPct}`);
    assert.match(result.message ?? "", /voltage-drop limit/);
  }
});

test("fails closed for unknown installation and derating options", () => {
  for (const input of [
    { ...base, method: "unknown" },
    { ...base, ambientC: 999 },
    { ...base, groupN: 999 },
    { ...base, insulationId: "unknown" },
  ]) {
    const result = designCircuit(input);
    assert.equal(result.valid, false);
    assert.match(result.message ?? "", /valid installation and derating options/);
  }
});

test("rejects protective-device overrides outside the supported ratings", () => {
  for (const deviceOverride of [-1, 0, 7, 126]) {
    const result = designCircuit({ ...base, deviceOverride });
    assert.equal(result.valid, false);
    assert.match(result.message ?? "", /supported protective-device rating/);
  }
});
