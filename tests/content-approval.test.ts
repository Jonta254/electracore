import assert from "node:assert/strict";
import test from "node:test";
import { getProfessionalApproval, isValidProfessionalApproval } from "../app/learn/contentApproval.ts";

test("professional approval cannot be inferred from editorial review", () => {
  assert.equal(getProfessionalApproval("domestic-wiring:l13"), null);
});

test("professional approval records require identity, credential, date, and exact hashes", () => {
  assert.equal(isValidProfessionalApproval({
    lessonKey: "domestic-wiring:l13",
    reviewerName: "",
    reviewerCredential: "",
    reviewScope: "technical-content-and-safety",
    approvedOn: "2026-09-02",
    contentSha256: "0".repeat(64),
    sourceSnapshotSha256: "1".repeat(64),
  }), false);
  assert.equal(isValidProfessionalApproval({
    lessonKey: "domestic-wiring:l13",
    reviewerName: "Named reviewer",
    reviewerCredential: "Recorded professional credential",
    reviewScope: "technical-content-and-safety",
    approvedOn: "2026-09-02",
    contentSha256: "0".repeat(64),
    sourceSnapshotSha256: "1".repeat(64),
  }), true);
});
