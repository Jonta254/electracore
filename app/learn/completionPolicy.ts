import { ASSESSMENT_PASS_SCORE } from "./assessment.ts";

export type LearningActivityType = "lesson" | "quiz" | "exercise";

export function canMarkLessonComplete({ type, alreadyComplete, exerciseComplete, bestAssessmentScore }: {
  type: LearningActivityType;
  alreadyComplete: boolean;
  exerciseComplete: boolean;
  bestAssessmentScore?: number;
}): boolean {
  if (alreadyComplete || type === "lesson") return true;
  if (type === "exercise") return exerciseComplete;
  return (bestAssessmentScore ?? 0) >= ASSESSMENT_PASS_SCORE;
}
