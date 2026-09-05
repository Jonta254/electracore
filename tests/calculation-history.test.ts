import assert from "node:assert/strict";
import test from "node:test";
import { parseCalculationHistory, serializeCalculationHistory } from "../app/calculate/history.ts";

const valid = { id: "one", calc: "Power", inputs: "230 V, 10 A", value: "2300", unit: "W", ts: 1 };

test("calculation history recovers from malformed or wrong-shaped storage", () => {
  for (const raw of [null, "", "not json", "{}", '"hello"', '{"version":2,"entries":{}}']) {
    assert.deepEqual(parseCalculationHistory(raw), []);
  }
});

test("calculation history migrates legacy arrays and drops malformed records", () => {
  assert.deepEqual(parseCalculationHistory(JSON.stringify([valid, { calc: "broken" }])), [valid]);
});

test("calculation history writes a bounded versioned envelope", () => {
  const encoded = serializeCalculationHistory(Array.from({ length: 60 }, (_, index) => ({ ...valid, id: String(index), ts: index + 1 })));
  const parsed = JSON.parse(encoded);
  assert.equal(parsed.version, 2);
  assert.equal(parsed.entries.length, 50);
});
