import type {
  FormulaDefinition,
  FormulaInputs,
} from "@/lib/features/premium-schema/formula-registry";

// Helper functions (mirrored from user-premium-formulas.ts)
function num(inputs: FormulaInputs, key: string, fallback = 0): number {
  const value = inputs[key];
  return Number.isFinite(typeof value === "number" ? value : Number(value))
    ? value
    : fallback;
}

function assertFinite(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

function nonNegative(value: number): number {
  return assertFinite(Math.max(0, value));
}

function SUM<T>(_xs: T): number { return 0; }

function tVal(inputs: FormulaInputs, key: string, t: number, fallback = 0): number {
  const raw = inputs[key];
  if (Array.isArray(raw) && raw.length > t) {
    const v = Number(raw[t]);
    return Number.isFinite(v) ? v : fallback;
  }
  return typeof raw === "number" ? raw : fallback;
}

function normStd(x: number): number {
  const b0 = 0.2316419, b1 = 0.319381530, b2 = -0.356563782;
  const b3 = 1.781477937, b4 = -1.821255978, b5 = 1.330274429;
  const t = 1 / (1 + b0 * Math.abs(x));
  const poly = t * (b1 + t * (b2 + t * (b3 + t * (b4 + t * b5))));
  const cdf = 1 - poly * Math.exp(-x * x / 2);
  return x >= 0 ? cdf : 1 - cdf;
}

function normSInv(p: number): number {
  if (p <= 0) return -6;
  if (p >= 1) return 6;
  const a = [-3.969683028665376e+1, 2.209460984245205e+2,
    -2.759285104469687e+2, 1.383577518672690e+2,
    -3.066479806614716e+1, 2.506628277459239e+0];
  const b = [-5.447609879822406e+1, 1.615858368580409e+2,
    -1.556989798598866e+2, 6.680131188771972e+1,
    -1.328068155288572e+1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1,
    -2.400758277161838e+0, -2.549732539343734e+0,
    4.374664141464968e+0, 2.938163982698783e+0];
  const d = [7.784695709041462e-3, 3.224671290700398e-1,
    2.445134137142996e+0, 3.754408661907416e+0];
  
  const q = p - 0.5;
  if (Math.abs(q) <= 0.425) {
    const r = 0.180625 - q * q;
    return q * (((((a[5] * r + a[4]) * r + a[3]) * r + a[2]) * r + a[1]) * r + a[0]) /
      (((((b[4] * r + b[3]) * r + b[2]) * r + b[1]) * r + b[0]) * r + 1);
  }
  const r = q < 0 ? p : 1 - p;
  if (r <= 0) return q < 0 ? -6 : 6;
  const rSqrt = Math.sqrt(-2 * Math.log(r));
  const z = (((((c[5] * rSqrt + c[4]) * rSqrt + c[3]) * rSqrt + c[2]) * rSqrt + c[1]) * rSqrt + c[0]) /
    ((((d[3] * rSqrt + d[2]) * rSqrt + d[1]) * rSqrt + d[0]) * rSqrt + 1);
  return q < 0 ? -z : z;
}

// @ts-ignore TS2590 - chunk to avoid OOM
export const CHUNK_11_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.cpk_ppm_converter_7",
    family: "cost",
    label: "CPK TO PPM — Yield",
    fn: (inputs) => {
    const p = num(inputs, "p");
    const Total = num(inputs, "Total");
    const p_Total = num(inputs, "p_Total") || 0;
    return nonNegative(assertFinite(1 - p_Total));
  },
  },
  {
    id: "user.cpk_ppm_converter_8",
    family: "cost",
    label: "CPK TO PPM — Sigma_ShortTerm",
    fn: (inputs) => {
    const cpk = num(inputs, "cpk");
    return nonNegative(assertFinite((cpk * 3) + 1.5));
  },
  },

  // ── CPM GECİKME CEZASI (8 formulas) ──,
  {
    id: "user.cpm_delay_penalty_0",
    family: "cost",
    label: "CPM GECİKME CEZASI — TotalFloat",
    fn: (inputs) => {
    const lateStart = num(inputs, "lateStart");
    const earlyStart = num(inputs, "earlyStart");
    return nonNegative(assertFinite(lateStart - earlyStart));
  },
  },
  {
    id: "user.cpm_delay_penalty_1",
    family: "cost",
    label: "CPM GECİKME CEZASI — CriticalDelay",
    fn: (inputs) => {
    const actual = num(inputs, "actual");
    const planned = num(inputs, "planned");
    const totalFloat = num(inputs, "totalFloat");
    const max = num(inputs, "max") || 0;
    return nonNegative(assertFinite(Math.max(0, actual - planned - totalFloat)));
  },
  },
  {
    id: "user.cpm_delay_penalty_2",
    family: "cost",
    label: "CPM GECİKME CEZASI — ExcusableDelay",
    fn: (inputs) => {
    const forceMajeure = num(inputs, "forceMajeure");
    const ownerCaused = num(inputs, "ownerCaused");
    return nonNegative(assertFinite(forceMajeure + ownerCaused));
  },
  },
  {
    id: "user.cpm_delay_penalty_3",
    family: "cost",
    label: "CPM GECİKME CEZASI — NonExcusable",
    fn: (inputs) => {
    const criticalDelay = num(inputs, "criticalDelay");
    const excusable = num(inputs, "excusable");
    return nonNegative(assertFinite(criticalDelay - excusable));
  },
  },
  {
    id: "user.cpm_delay_penalty_4",
    family: "cost",
    label: "CPM GECİKME CEZASI — LiquidatedDamages",
    fn: (inputs) => {
    const nonExcusable = num(inputs, "nonExcusable");
    const dailyPenalty = num(inputs, "dailyPenalty");
    return nonNegative(assertFinite(nonExcusable * dailyPenalty));
  },
  },
  {
    id: "user.cpm_delay_penalty_5",
    family: "cost",
    label: "CPM GECİKME CEZASI — AccelerationCost",
    fn: (inputs) => {
    const crashingCost = num(inputs, "crashingCost");
    const daysAccelerated = num(inputs, "daysAccelerated");
    return nonNegative(assertFinite(crashingCost * daysAccelerated));
  },
  },
  {
    id: "user.cpm_delay_penalty_6",
    family: "cost",
    label: "CPM GECİKME CEZASI — NetPenalty",
    fn: (inputs) => {
    const liquidatedDamages = num(inputs, "liquidatedDamages");
    const accelerationCost = num(inputs, "accelerationCost");
    return nonNegative(assertFinite(liquidatedDamages - accelerationCost));
  },
  },
  {
    id: "user.cpm_delay_penalty_7",
    family: "cost",
    label: "CPM GECİKME CEZASI — EOT_Claim",
    fn: (inputs) => {
    const excusable = num(inputs, "excusable");
    const effFactor = num(inputs, "effFactor");
    return nonNegative(assertFinite(excusable * (1 - effFactor)));
  },
  },

  // ── ÇATI ALANI (7 formulas) ──,
  {
    id: "user.roof_area_load_0",
    family: "cost",
    label: "ÇATI ALANI — Area_Footprint",
    fn: (inputs) => {
    const length = num(inputs, "length");
    const width = num(inputs, "width");
    return nonNegative(assertFinite(length * width));
  },
  },
  {
    id: "user.roof_area_load_1",
    family: "cost",
    label: "ÇATI ALANI — Area_Gable",
    fn: (inputs) => {
    const footprint = num(inputs, "footprint");
    const pitchAngle = num(inputs, "pitchAngle");
    const cos = num(inputs, "cos") || 0;
    return nonNegative(assertFinite(footprint / Math.cos(pitchAngle)));
  },
  },
  {
    id: "user.roof_area_load_2",
    family: "cost",
    label: "ÇATI ALANI — OverhangArea",
    fn: (inputs) => {
    const perimeter = num(inputs, "perimeter");
    const overhangWidth = num(inputs, "overhangWidth");
    return nonNegative(assertFinite(perimeter * overhangWidth));
  },
  },
  {
    id: "user.roof_area_load_3",
    family: "cost",
    label: "ÇATI ALANI — TotalMaterialArea",
    fn: (inputs) => {
    const area = num(inputs, "area");
    const Roof = num(inputs, "Roof");
    const wasteFactor = num(inputs, "wasteFactor");
    const area_Roof = num(inputs, "area_Roof") || 0;
    return nonNegative(assertFinite(area_Roof * (1 + wasteFactor)));
  },
  },
  {
    id: "user.roof_area_load_4",
    family: "cost",
    label: "ÇATI ALANI — RidgeLength",
    fn: (inputs) => {
    const length = num(inputs, "length");
    const width = num(inputs, "width");
    const sqrt = num(inputs, "sqrt") || 0;
    return nonNegative(assertFinite(length - width + (width * Math.sqrt(2))));
  },
  }
];
