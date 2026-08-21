export type LearningAccessMode = "open-preview" | "paid" | "mixed";
export type LearningResourceKind = "course" | "lesson" | "quiz" | "exercise" | "diagram" | "reference" | "tool";

export const LEARNING_ACCESS_MODE: LearningAccessMode = "open-preview";
export const OPEN_PREVIEW_NOTICE = "Open learning preview — all current learning content is available while ElectraCore continues to develop.";

export interface LearningAccessRequest {
  resource: LearningResourceKind;
  premium?: boolean;
  hasEntitlement?: boolean;
}

export interface LearningAccessDecision {
  allowed: boolean;
  mode: LearningAccessMode;
  reason: "open-preview" | "open-resource" | "entitled" | "payment-required";
  shouldStartCheckout: false;
  shouldCreatePaymentRecord: false;
}

export function evaluateLearningAccess(
  request: LearningAccessRequest,
  mode: LearningAccessMode = LEARNING_ACCESS_MODE,
): LearningAccessDecision {
  if (mode === "open-preview") {
    return { allowed: true, mode, reason: "open-preview", shouldStartCheckout: false, shouldCreatePaymentRecord: false };
  }
  if (mode === "mixed" && !request.premium) {
    return { allowed: true, mode, reason: "open-resource", shouldStartCheckout: false, shouldCreatePaymentRecord: false };
  }
  if (request.hasEntitlement) {
    return { allowed: true, mode, reason: "entitled", shouldStartCheckout: false, shouldCreatePaymentRecord: false };
  }
  return { allowed: false, mode, reason: "payment-required", shouldStartCheckout: false, shouldCreatePaymentRecord: false };
}

export function canAccessLearning(request: LearningAccessRequest, mode: LearningAccessMode = LEARNING_ACCESS_MODE) {
  return evaluateLearningAccess(request, mode).allowed;
}
