import type {
  FormulaDefinition,
  FormulaInputs,
} from "@/lib/features/premium-schema/formula-registry";

// Helper functions (mirrored from user-premium-formulas.ts)
function num(inputs: FormulaInputs, key: string, fallback = 0): number {
  const value = inputs[key];
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
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
export const CHUNK_21_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.gage_rnr_cost_5",
    family: "cost",
    label: "GAGE R&R COST - PctGRR",
    fn: (inputs) => {
    const gRR = num(inputs, "gRR");
    const tV = num(inputs, "tV");
    return nonNegative(assertFinite((gRR / tV) * 100));
  },
  },
  {
    id: "user.gage_rnr_cost_6",
    family: "cost",
    label: "GAGE R&R COST - CostError",
    fn: (inputs) => {
    const falseAcc = num(inputs, "falseAcc");
    const escapeCost = num(inputs, "escapeCost");
    const falseRej = num(inputs, "falseRej");
    const scrapCost = num(inputs, "scrapCost");
    return nonNegative(assertFinite((falseAcc * escapeCost) + (falseRej * scrapCost)));
  },
  },
  {
    id: "user.gage_rnr_cost_7",
    family: "cost",
    label: "GAGE R&R COST - OptTol",
    fn: (inputs) => {
    const gRR = num(inputs, "gRR");
    return nonNegative(assertFinite(gRR * 6));
  },
  },
  {
    id: "user.gage_rnr_cost_8",
    family: "cost",
    label: "GAGE R&R COST - FinImpact",
    fn: (inputs) => {
    const pctGRR = num(inputs, "pctGRR");
    const totalQualCost = num(inputs, "totalQualCost");
    return nonNegative(assertFinite(pctGRR * totalQualCost));
  },
  },

  // ── GIDA FIRE MARGIN (9 formulas) ──,
  {
    id: "user.food_waste_margin_0",
    family: "cost",
    label: "GIDA FIRE MARGIN - Yield",
    fn: (inputs) => {
    const finished = num(inputs, "finished");
    const raw = num(inputs, "raw");
    return nonNegative(assertFinite(finished / raw));
  },
  },
  {
    id: "user.food_waste_margin_1",
    family: "cost",
    label: "GIDA FIRE MARGIN - Shrinkage",
    fn: (inputs) => {
    const raw = num(inputs, "raw");
    const finished = num(inputs, "finished");
    return nonNegative(assertFinite(raw - finished));
  },
  },
  {
    id: "user.food_waste_margin_2",
    family: "cost",
    label: "GIDA FIRE MARGIN - Cost_Shrink",
    fn: (inputs) => {
    const shrinkage = num(inputs, "shrinkage");
    const rawCost = num(inputs, "rawCost");
    return nonNegative(assertFinite(shrinkage * rawCost));
  },
  },
  {
    id: "user.food_waste_margin_3",
    family: "cost",
    label: "GIDA FIRE MARGIN - Cost_Spoil",
    fn: (inputs) => {
    const spoiled = num(inputs, "spoiled");
    const prodCost = num(inputs, "prodCost");
    return nonNegative(assertFinite(spoiled * prodCost));
  },
  },
  {
    id: "user.food_waste_margin_4",
    family: "cost",
    label: "GIDA FIRE MARGIN - Cost_Over",
    fn: (inputs) => {
    const excess = num(inputs, "excess");
    const unitCost = num(inputs, "unitCost");
    const salvage = num(inputs, "salvage");
    return nonNegative(assertFinite(excess * (unitCost - salvage)));
  },
  },
  {
    id: "user.food_waste_margin_5",
    family: "cost",
    label: "GIDA FIRE MARGIN - MarginLeak",
    fn: (inputs) => {
    const shrink = num(inputs, "shrink");
    const spoil = num(inputs, "spoil");
    const over = num(inputs, "over");
    return nonNegative(assertFinite(shrink + spoil + over));
  },
  },
  {
    id: "user.food_waste_margin_6",
    family: "cost",
    label: "GIDA FIRE MARGIN - OEE_Food",
    fn: (inputs) => {
    const avail = num(inputs, "avail");
    const perf = num(inputs, "perf");
    const qual = num(inputs, "qual");
    const Yield = num(inputs, "Yield");
    const qual_Yield = num(inputs, "qual_Yield") || 0;
    return nonNegative(assertFinite(avail * perf * qual_Yield));
  },
  },
  {
    id: "user.food_waste_margin_7",
    family: "cost",
    label: "GIDA FIRE MARGIN - TheoUsage",
    fn: (inputs) => {
    const recipe = num(inputs, "recipe");
    const actualProd = num(inputs, "actualProd");
    return nonNegative(assertFinite(recipe * actualProd));
  },
  },
  {
    id: "user.food_waste_margin_8",
    family: "cost",
    label: "GIDA FIRE MARGIN - Variance",
    fn: (inputs) => {
    const actual = num(inputs, "actual");
    const theo = num(inputs, "theo");
    return nonNegative(assertFinite(actual - theo));
  },
  },

  // ── GUBRE DOZAJ (8 formulas) ──,
  {
    id: "user.fertilizer_dosage_0",
    family: "cost",
    label: "GUBRE DOZAJ - NutReq",
    fn: (inputs) => {
    const yieldTarget = num(inputs, "yieldTarget");
    const remRate = num(inputs, "remRate");
    return nonNegative(assertFinite(yieldTarget * remRate));
  },
  },
  {
    id: "user.fertilizer_dosage_1",
    family: "cost",
    label: "GUBRE DOZAJ - SoilSupp",
    fn: (inputs) => {
    const soilTest = num(inputs, "soilTest");
    const convFactor = num(inputs, "convFactor");
    return nonNegative(assertFinite(soilTest * convFactor));
  },
  }
];
