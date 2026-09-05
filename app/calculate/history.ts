export interface CalculationHistoryEntry {
  id: string;
  calc: string;
  inputs: string;
  value: string;
  unit: string;
  note?: string;
  ts: number;
}

export const CALC_HISTORY_KEY = "electracore.calc.history.v2";
export const LEGACY_CALC_HISTORY_KEY = "electracore.calc.history.v1";
export const MAX_CALC_HISTORY = 50;

interface CalculationHistoryEnvelope {
  version: 2;
  entries: CalculationHistoryEntry[];
}

function isEntry(value: unknown): value is CalculationHistoryEntry {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === "string" && item.id.length > 0
    && typeof item.calc === "string" && item.calc.length > 0
    && typeof item.inputs === "string"
    && typeof item.value === "string"
    && typeof item.unit === "string"
    && (item.note === undefined || typeof item.note === "string")
    && typeof item.ts === "number" && Number.isFinite(item.ts) && item.ts > 0;
}

export function parseCalculationHistory(raw: string | null): CalculationHistoryEntry[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    const candidates = Array.isArray(parsed)
      ? parsed
      : parsed && typeof parsed === "object" && (parsed as { version?: unknown }).version === 2
        ? (parsed as { entries?: unknown }).entries
        : [];
    if (!Array.isArray(candidates)) return [];
    return candidates.filter(isEntry).slice(0, MAX_CALC_HISTORY);
  } catch {
    return [];
  }
}

export function serializeCalculationHistory(entries: CalculationHistoryEntry[]): string {
  const payload: CalculationHistoryEnvelope = { version: 2, entries: entries.filter(isEntry).slice(0, MAX_CALC_HISTORY) };
  return JSON.stringify(payload);
}
