export type LessonReviewState = "fully-enhanced-verified" | "preserved-verified" | "enhanced-review-pending" | "blocked";
export interface LessonReview { state: LessonReviewState; reviewedOn: string; evidence: string; }

export const LESSON_REVIEWS: Record<string, LessonReview> = {
  "electrical-fundamentals:l1": { state: "enhanced-review-pending", reviewedOn: "2026-08-21", evidence: "Topic-specific structured lesson, calculation checked, deterministic atomic-model diagram added; final professional content review remains pending." },
  "electrical-fundamentals:l2": { state: "enhanced-review-pending", reviewedOn: "2026-08-21", evidence: "SI charge definitions and worked conversion checked against BIPM/NIST." },
  "electrical-fundamentals:l3": { state: "enhanced-review-pending", reviewedOn: "2026-08-21", evidence: "Material model, breakdown caveat, and safety context reviewed." },
  "electrical-fundamentals:l4": { state: "enhanced-review-pending", reviewedOn: "2026-08-21", evidence: "Conventional-current and carrier-direction treatment reviewed." },
  "electrical-fundamentals:l5": { state: "preserved-verified", reviewedOn: "2026-08-21", evidence: "Topic-specific charge/carrier module quiz has a stable valid answer; retry and persisted attempt behavior covered by tests." },
  "electrical-fundamentals:l6": { state: "enhanced-review-pending", reviewedOn: "2026-08-14", evidence: "Structured potential-difference lesson and worked example." },
  "electrical-fundamentals:l7": { state: "enhanced-review-pending", reviewedOn: "2026-08-14", evidence: "Structured current lesson and worked example." },
  "electrical-fundamentals:l8": { state: "enhanced-review-pending", reviewedOn: "2026-08-14", evidence: "Structured resistance and resistivity lesson." },
  "electrical-fundamentals:l9": { state: "enhanced-review-pending", reviewedOn: "2026-08-14", evidence: "Structured Ohm-law lesson and inverse calculation checks." },
  "electrical-fundamentals:l10": { state: "preserved-verified", reviewedOn: "2026-08-21", evidence: "Existing 240 V heater exercise checked: 5 A, 1.2 kW, 2.4 kWh." },
  "electrical-fundamentals:l11": { state: "enhanced-review-pending", reviewedOn: "2026-08-21", evidence: "Series rules, balance checks, and example verified." },
  "electrical-fundamentals:l12": { state: "enhanced-review-pending", reviewedOn: "2026-08-21", evidence: "Parallel rules, branch currents, and example verified." },
  "electrical-fundamentals:l13": { state: "enhanced-review-pending", reviewedOn: "2026-08-21", evidence: "Node-based series-parallel reduction and conservation checks verified." },
  "electrical-fundamentals:l14": { state: "enhanced-review-pending", reviewedOn: "2026-08-21", evidence: "Unloaded divider formulas and loading caveat verified." },
  "electrical-fundamentals:l15": { state: "preserved-verified", reviewedOn: "2026-08-21", evidence: "Topic-specific combined-network exercise checked: 6 Ω total, 2 A source current, and branch-current conservation." },
};