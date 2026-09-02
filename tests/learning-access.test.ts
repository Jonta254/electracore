import assert from "node:assert/strict";
import test from "node:test";
import {
  LEARNING_ACCESS_MODE, canAccessLearning, evaluateLearningAccess,
  type LearningResourceKind,
} from "../app/learn/accessPolicy.ts";

const resources: LearningResourceKind[] = ["course", "lesson", "quiz", "exercise", "diagram", "reference", "tool"];

test("open-preview grants every learning resource without payment side effects", () => {
  assert.equal(LEARNING_ACCESS_MODE, "open-preview");
  for (const resource of resources) {
    const decision = evaluateLearningAccess({ resource, premium: true }, "open-preview");
    assert.equal(decision.allowed, true);
    assert.equal(decision.shouldStartCheckout, false);
    assert.equal(decision.shouldCreatePaymentRecord, false);
  }
});

test("future paid mode denies protected access and permits genuine entitlements", () => {
  assert.equal(canAccessLearning({ resource: "lesson", premium: true }, "paid"), false);
  assert.equal(canAccessLearning({ resource: "lesson", premium: true }, "paid", { entitlement: "verified" }), true);
});

test("caller-controlled fields cannot impersonate a payment entitlement", () => {
  const untrusted = { resource: "lesson" as const, premium: true, hasEntitlement: true };
  assert.equal(canAccessLearning(untrusted, "paid"), false);
});

test("future mixed mode distinguishes open and premium content", () => {
  assert.equal(canAccessLearning({ resource: "course", premium: false }, "mixed"), true);
  assert.equal(canAccessLearning({ resource: "course", premium: true }, "mixed"), false);
  assert.equal(canAccessLearning({ resource: "course", premium: true }, "mixed", { entitlement: "verified" }), true);
});

test("access evaluation never starts checkout or creates payment records", () => {
  const denied = evaluateLearningAccess({ resource: "quiz", premium: true }, "paid");
  assert.equal(denied.reason, "payment-required");
  assert.equal(denied.shouldStartCheckout, false);
  assert.equal(denied.shouldCreatePaymentRecord, false);
});
