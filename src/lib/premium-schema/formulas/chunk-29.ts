import type {
  FormulaDefinition,
  FormulaInputs,
} from "@/lib/premium-schema/formula-registry";

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

// @ts-expect-error TS2590 - chunk to avoid OOM
export const CHUNK_29_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.machining_strategy_2",
    family: "cost",
    label: "İŞLEME STRATEJİSİ SÜRE — ToolLife",
    fn: (inputs) => {
    const c = num(inputs, "c");
    const v = num(inputs, "v");
    const n = num(inputs, "n");
    const f = num(inputs, "f");
    const m = num(inputs, "m");
    const v_c = num(inputs, "v_c") || 0;
    return nonNegative(assertFinite(c / (v_c**n * f**m)));
  },
  },
  {
    id: "user.machining_strategy_3",
    family: "cost",
    label: "İŞLEME STRATEJİSİ SÜRE — Cost",
    fn: (inputs) => {
    const mach = num(inputs, "mach");
    const change = num(inputs, "change");
    const tool = num(inputs, "tool");
    const min = num(inputs, "min") || 0;
    return nonNegative(assertFinite(Math.min(mach + change + tool)));
  },
  },
  {
    id: "user.machining_strategy_4",
    family: "cost",
    label: "İŞLEME STRATEJİSİ SÜRE — Opt_Vc",
    fn: (inputs) => {
    const c = num(inputs, "c");
    const t = num(inputs, "t");
    const opt = num(inputs, "opt");
    const n = num(inputs, "n");
    const t_opt = num(inputs, "t_opt") || 0;
    return nonNegative(assertFinite((c / (t_opt)**n)**(1/n)));
  },
  },
  {
    id: "user.machining_strategy_5",
    family: "cost",
    label: "İŞLEME STRATEJİSİ SÜRE — T_opt",
    fn: (inputs) => {
    const n = num(inputs, "n");
    const changeTime = num(inputs, "changeTime");
    const toolCost = num(inputs, "toolCost");
    const machRate = num(inputs, "machRate");
    return nonNegative(assertFinite(((1/n - 1) * (changeTime + toolCost/machRate))));
  },
  },
  {
    id: "user.machining_strategy_6",
    family: "cost",
    label: "İŞLEME STRATEJİSİ SÜRE — Ra",
    fn: (inputs) => {
    const f = num(inputs, "f");
    const noseRad = num(inputs, "noseRad");
    return nonNegative(assertFinite(f**2 / (8 * noseRad)));
  },
  },
  {
    id: "user.machining_strategy_7",
    family: "cost",
    label: "İŞLEME STRATEJİSİ SÜRE — Check",
    fn: (inputs) => {
    const power = num(inputs, "power");
    const maxPower = num(inputs, "maxPower");
    const ra = num(inputs, "ra");
    const tol = num(inputs, "tol");
    return (power < maxPower && ra < tol) ? 1 : 0;
  },
  },

  // ── KAIZEN TASARRUF TAKİPÇİSİ (8 formulas) ──,
  {
    id: "user.kaizen_savings_tracker_0",
    family: "cost",
    label: "KAIZEN TASARRUF TAKİPÇİSİ — Hard",
    fn: (inputs) => {
    const baseline = num(inputs, "baseline");
    const actual = num(inputs, "actual");
    const vol = num(inputs, "vol");
    return nonNegative(assertFinite((baseline - actual) * vol));
  },
  },
  {
    id: "user.kaizen_savings_tracker_1",
    family: "cost",
    label: "KAIZEN TASARRUF TAKİPÇİSİ — Soft",
    fn: (inputs) => {
    const timeSaved = num(inputs, "timeSaved");
    const labRate = num(inputs, "labRate");
    const conv = num(inputs, "conv");
    return nonNegative(assertFinite(timeSaved * labRate * conv));
  },
  },
  {
    id: "user.kaizen_savings_tracker_2",
    family: "cost",
    label: "KAIZEN TASARRUF TAKİPÇİSİ — ImpCost",
    fn: (inputs) => {
    const lab = num(inputs, "lab");
    const mat = num(inputs, "mat");
    const down = num(inputs, "down");
    const lab_K = num(inputs, "lab_K") || 0;
    return nonNegative(assertFinite(lab_K + mat + down));
  },
  },
  {
    id: "user.kaizen_savings_tracker_3",
    family: "cost",
    label: "KAIZEN TASARRUF TAKİPÇİSİ — ROI",
    fn: (inputs) => {
    const hard = num(inputs, "hard");
    const soft = num(inputs, "soft");
    const impCost = num(inputs, "impCost");
    return nonNegative(assertFinite((hard + soft - impCost) / impCost));
  },
  },
  {
    id: "user.kaizen_savings_tracker_4",
    family: "cost",
    label: "KAIZEN TASARRUF TAKİPÇİSİ — Payback",
    fn: (inputs) => {
    const impCost = num(inputs, "impCost");
    const monthSav = num(inputs, "monthSav");
    return nonNegative(assertFinite(impCost / monthSav));
  },
  },
  {
    id: "user.kaizen_savings_tracker_5",
    family: "cost",
    label: "KAIZEN TASARRUF TAKİPÇİSİ — Sust",
    fn: (inputs) => {
    const sav = num(inputs, "sav");
    const M6 = num(inputs, "M6");
    const M1 = num(inputs, "M1");
    const sav_M6 = num(inputs, "sav_M6") || 0;
    const sav_M1 = num(inputs, "sav_M1") || 0;
    return nonNegative(assertFinite(sav_M6 / sav_M1));
  },
  },
  {
    id: "user.kaizen_savings_tracker_6",
    family: "cost",
    label: "KAIZEN TASARRUF TAKİPÇİSİ — Cum",
    fn: (inputs) => {
    const monthSav = num(inputs, "monthSav");
    return nonNegative(assertFinite(SUM(monthSav)));
  },
  },
  {
    id: "user.kaizen_savings_tracker_7",
    family: "cost",
    label: "KAIZEN TASARRUF TAKİPÇİSİ — Opp",
    fn: (inputs) => {
    const time = num(inputs, "time");
    const prodRate = num(inputs, "prodRate");
    const margin = num(inputs, "margin");
    const time_K = num(inputs, "time_K") || 0;
    return nonNegative(assertFinite(time_K * prodRate * margin));
  },
  },

  // ── Kalite Maliyeti PAF (7 formulas) ──,
  {
    id: "user.quality_cost_paf_0",
    family: "cost",
    label: "Kalite Maliyeti PAF — PreventionCost",
    fn: (inputs) => {
    const training = num(inputs, "training");
    const qualityPlanning = num(inputs, "qualityPlanning");
    const supplierEvaluation = num(inputs, "supplierEvaluation");
    const designReview = num(inputs, "designReview");
    return nonNegative(assertFinite(training + qualityPlanning + supplierEvaluation + designReview));
  },
  }
];
