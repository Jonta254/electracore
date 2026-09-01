/* ─────────────────────────────────────────────────────────────
   ElectraCore: Circuit design engine (pure functions, no UI)

   Sizes a copper conductor for a load through the real chain:
     load  →  design current (Ib)
           →  protective device (In ≥ Ib)
           →  thermal cable size (Iz after derating ≥ In)
           →  voltage-drop check (bump size if needed)
           →  verdict

   The current-carrying capacities and mV/A/m figures below are
   representative values for 70 °C thermoplastic (PVC) insulated
   copper for common installation methods. They exist to make the
   workflow realistic: always verify the final design against the
   wiring regulations and cable data that apply to your installation.
────────────────────────────────────────────────────────────── */

export const SIZES = [1, 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120] as const;
export type Size = (typeof SIZES)[number];

/* Standard protective-device ratings (A) */
export const DEVICE_RATINGS = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125] as const;

/* Reference installation methods (representative copper / 70 °C PVC capacities, A) */
export interface MethodDef { id: string; label: string; hint: string; ccc: Record<number, number>; }

export const METHODS: MethodDef[] = [
  {
    id: "A",
    label: "Enclosed in conduit (insulated wall)",
    hint: "Cables in conduit or trunking within a thermally insulating wall. The most restrictive common method.",
    ccc: { 1: 11.5, 1.5: 14.5, 2.5: 19.5, 4: 26, 6: 34, 10: 46, 16: 61, 25: 80, 35: 99, 50: 119, 70: 151, 95: 182, 120: 210 },
  },
  {
    id: "B",
    label: "Enclosed in conduit (on a wall)",
    hint: "Cables in conduit or trunking mounted on a surface. A little more heat can escape than Method A.",
    ccc: { 1: 13.5, 1.5: 17.5, 2.5: 24, 4: 32, 6: 41, 10: 57, 16: 76, 25: 101, 35: 125, 50: 151, 70: 192, 95: 232, 120: 269 },
  },
  {
    id: "C",
    label: "Clipped direct to a surface",
    hint: "Twin-and-earth or singles clipped to a surface, open to air. A common domestic method.",
    ccc: { 1: 15.5, 1.5: 20, 2.5: 27, 4: 37, 6: 47, 10: 64, 16: 85, 25: 112, 35: 138, 50: 168, 70: 213, 95: 258, 120: 299 },
  },
  {
    id: "E",
    label: "In free air / on cable tray",
    hint: "Spaced from a surface with free air movement: perforated tray, ladder, or open air.",
    ccc: { 1: 17, 1.5: 22, 2.5: 30, 4: 40, 6: 51, 10: 70, 16: 94, 25: 119, 35: 148, 50: 180, 70: 232, 95: 282, 120: 328 },
  },
];

export const METHOD_MAP: Record<string, MethodDef> = Object.fromEntries(METHODS.map((m) => [m.id, m]));

/* Voltage drop: mV per amp per metre, single-phase two-core, copper 70 °C (representative) */
export const MVAM: Record<number, number> = {
  1: 44, 1.5: 29, 2.5: 18, 4: 11, 6: 7.3, 10: 4.4, 16: 2.8, 25: 1.75, 35: 1.25, 50: 0.93, 70: 0.63, 95: 0.46, 120: 0.36,
};
/* Three-phase drop is measured line-to-line; mV/A/m ≈ single-phase × (√3 / 2). */
const THREE_PHASE_FACTOR = Math.sqrt(3) / 2;

/* ── Correction (derating) factors: representative ── */
export const AMBIENT_OPTIONS = [
  { c: 25, ca: 1.03 }, { c: 30, ca: 1.0 }, { c: 35, ca: 0.94 },
  { c: 40, ca: 0.87 }, { c: 45, ca: 0.79 }, { c: 50, ca: 0.71 }, { c: 55, ca: 0.61 },
];

export const GROUPING_OPTIONS = [
  { n: 1, cg: 1.0 }, { n: 2, cg: 0.8 }, { n: 3, cg: 0.7 },
  { n: 4, cg: 0.65 }, { n: 5, cg: 0.6 }, { n: 6, cg: 0.57 }, { n: 8, cg: 0.52 },
];

export const INSULATION_OPTIONS = [
  { id: "none", label: "Not in thermal insulation", ci: 1.0 },
  { id: "one", label: "Touching insulation on one side", ci: 0.75 },
  { id: "short", label: "Short length surrounded (≤ 0.5 m)", ci: 0.55 },
  { id: "full", label: "Surrounded by insulation", ci: 0.5 },
];

/* ── Inputs / outputs ── */
export interface DesignInput {
  phase: "single" | "three";
  mode: "power" | "current"; // enter power or design current directly
  power: string;             // watts
  pf: string;                // power factor 0–1
  current: string;          // design current (if mode = current)
  voltage: string;          // supply voltage (V): 230 single / 400 three, editable
  length: string;           // one-way run length (m)
  deviceOverride: number | null; // manual In, else auto
  method: string;           // reference method id
  ambientC: number;
  groupN: number;
  insulationId: string;
  vdLimitPct: string;       // allowable voltage drop %
}

export interface Check { ok: boolean; label: string; detail: string; }

export interface DesignResult {
  valid: boolean;
  message?: string;
  Ib: number;
  In: number;
  deviceAuto: number;
  derate: number;
  ca: number; cg: number; ci: number;
  requiredIt: number;      // In / derate
  thermalSize: number | null;
  finalSize: number | null;
  IzTabulated: number | null;
  IzEffective: number | null;
  vd: number | null;       // volts
  vdPct: number | null;
  vdLimited: boolean;      // final size was increased for voltage drop
  checks: Check[];
}

function num(s: string): number { const n = parseFloat(s); return isNaN(n) ? NaN : n; }

export function designCircuit(inp: DesignInput): DesignResult {
  const empty: DesignResult = {
    valid: false, Ib: 0, In: 0, deviceAuto: 0, derate: 1, ca: 1, cg: 1, ci: 1,
    requiredIt: 0, thermalSize: null, finalSize: null, IzTabulated: null,
    IzEffective: null, vd: null, vdPct: null, vdLimited: false, checks: [],
  };

  const V = num(inp.voltage);
  const L = num(inp.length);

  /* Design current Ib */
  let Ib: number;
  if (inp.mode === "current") {
    Ib = num(inp.current);
  } else {
    const P = num(inp.power);
    const pf = num(inp.pf);
    if (isNaN(P) || isNaN(pf) || isNaN(V)) return { ...empty, message: "Enter power, power factor and voltage." };
    if (pf <= 0 || pf > 1) return { ...empty, message: "Power factor must be between 0 and 1." };
    if (V <= 0) return { ...empty, message: "Voltage must be greater than zero." };
    Ib = inp.phase === "three" ? P / (Math.sqrt(3) * V * pf) : P / (V * pf);
  }
  if (isNaN(Ib) || Ib <= 0) return { ...empty, message: "Enter a valid load to begin sizing." };
  if (isNaN(V) || V <= 0) return { ...empty, message: "Enter the supply voltage." };
  if (isNaN(L) || L <= 0) return { ...empty, message: "Enter the cable run length." };

  /* Protective device In */
  const deviceAuto = DEVICE_RATINGS.find((r) => r >= Ib) ?? DEVICE_RATINGS[DEVICE_RATINGS.length - 1];
  const In = inp.deviceOverride ?? deviceAuto;

  /* Derating */
  const ca = AMBIENT_OPTIONS.find((a) => a.c === inp.ambientC)?.ca ?? 1;
  const cg = GROUPING_OPTIONS.find((g) => g.n === inp.groupN)?.cg ?? 1;
  const ci = INSULATION_OPTIONS.find((i) => i.id === inp.insulationId)?.ci ?? 1;
  const derate = ca * cg * ci;
  const requiredIt = In / derate;

  const method = METHOD_MAP[inp.method] ?? METHODS[0];

  /* Thermal size: smallest whose derated capacity ≥ In  (i.e. tabulated ≥ In/derate) */
  const thermalSize = SIZES.find((s) => method.ccc[s] >= requiredIt) ?? null;

  /* Voltage drop, and bump size until within the limit */
  const vdLimit = num(inp.vdLimitPct);
  const vdLimitPct = isNaN(vdLimit) || vdLimit <= 0 ? 5 : vdLimit;

  const vdFor = (size: number): { vd: number; pct: number } => {
    const mvam = MVAM[size] * (inp.phase === "three" ? THREE_PHASE_FACTOR : 1);
    const vd = (mvam * Ib * L) / 1000;
    return { vd, pct: (vd / V) * 100 };
  };

  let finalSize = thermalSize;
  let vdLimited = false;
  if (thermalSize != null) {
    let idx = SIZES.indexOf(thermalSize as Size);
    while (idx < SIZES.length) {
      const { pct } = vdFor(SIZES[idx]);
      if (pct <= vdLimitPct) break;
      idx++;
      vdLimited = true;
    }
    finalSize = idx < SIZES.length ? SIZES[idx] : null;
  }

  const IzTabulated = finalSize != null ? method.ccc[finalSize] : null;
  const IzEffective = IzTabulated != null ? IzTabulated * derate : null;
  const vdCalc = finalSize != null ? vdFor(finalSize) : null;

  /* Verdict checks */
  const checks: Check[] = [];
  checks.push({
    ok: Ib <= In,
    label: "Device covers the load",
    detail: `Ib ${Ib.toFixed(1)} A ≤ In ${In} A`,
  });
  if (IzEffective != null) {
    checks.push({
      ok: In <= IzEffective,
      label: "Cable protected by the device",
      detail: `In ${In} A ≤ Iz(derated) ${IzEffective.toFixed(1)} A`,
    });
  }
  if (vdCalc != null) {
    checks.push({
      ok: vdCalc.pct <= vdLimitPct,
      label: `Voltage drop within ${vdLimitPct}%`,
      detail: `${vdCalc.vd.toFixed(2)} V (${vdCalc.pct.toFixed(2)}%)`,
    });
  }
  if (finalSize == null) {
    checks.push({ ok: false, label: "Within cable range", detail: "Load exceeds the representative table (max 120 mm²): specialist design." });
  }

  return {
    valid: true,
    Ib, In, deviceAuto, derate, ca, cg, ci, requiredIt,
    thermalSize, finalSize, IzTabulated, IzEffective,
    vd: vdCalc?.vd ?? null, vdPct: vdCalc?.pct ?? null,
    vdLimited, checks,
  };
}
