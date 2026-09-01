export function calculateAssessmentScore(correctIndexes: number[], answers: Record<number, number>): number {
  if (correctIndexes.length === 0) return 0;
  const correct = correctIndexes.filter((correctIndex, questionIndex) => answers[questionIndex] === correctIndex).length;
  return Math.round((correct / correctIndexes.length) * 100);
}
