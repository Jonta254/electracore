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
export function sineRms(peak: number) { if (!Number.isFinite(peak)) throw new RangeError("Peak must be finite"); return peak / Math.SQRT2; }
export function periodFromFrequency(frequency: number) { requireFinitePositive([frequency]); return 1 / frequency; }
export function capacitiveReactance(frequency: number, capacitance: number) { requireFinitePositive([frequency, capacitance]); return 1 / (2 * Math.PI * frequency * capacitance); }
export function inductiveReactance(frequency: number, inductance: number) { requireFinitePositive([frequency, inductance]); return 2 * Math.PI * frequency * inductance; }
export function rcTimeConstant(resistance: number, capacitance: number) { requireFinitePositive([resistance, capacitance]); return resistance * capacitance; }
export function rlTimeConstant(inductance: number, resistance: number) { requireFinitePositive([inductance, resistance]); return inductance / resistance; }
