function requireFinitePositive(values: number[]) {
  if (values.length === 0 || values.some((value) => !Number.isFinite(value) || value <= 0)) throw new RangeError("Values must be finite and greater than zero");
}
export function seriesResistance(...resistances: number[]) { requireFinitePositive(resistances); return resistances.reduce((sum, value) => sum + value, 0); }
export function parallelResistance(...resistances: number[]) { requireFinitePositive(resistances); return 1 / resistances.reduce((sum, value) => sum + 1 / value, 0); }
export function voltageDivider(inputVoltage: number, upperResistance: number, lowerResistance: number, loadResistance?: number) {
  if (!Number.isFinite(inputVoltage)) throw new RangeError("Voltage must be finite");
  requireFinitePositive([upperResistance, lowerResistance]);
  const effectiveLower = loadResistance === undefined ? lowerResistance : parallelResistance(lowerResistance, loadResistance);
  return inputVoltage * effectiveLower / (upperResistance + effectiveLower);
}
export function twoBranchCurrents(totalCurrent: number, firstResistance: number, secondResistance: number) {
  if (!Number.isFinite(totalCurrent)) throw new RangeError("Current must be finite");
  requireFinitePositive([firstResistance, secondResistance]);
  return { first: totalCurrent * secondResistance / (firstResistance + secondResistance), second: totalCurrent * firstResistance / (firstResistance + secondResistance) };
}