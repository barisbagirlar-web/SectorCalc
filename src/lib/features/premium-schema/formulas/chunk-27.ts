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
export const CHUNK_27_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.irr_investment_5",
    family: "cost",
    label: "IC VERIM RATIO IRR - Annuity",
    fn: (inputs) => {
    const nPV = num(inputs, "nPV");
    const r = num(inputs, "r");
    const n = num(inputs, "n");
    return nonNegative(assertFinite(nPV * (r * (1 + r)**n) / ((1 + r)**n - 1)));
  },
  },
  {
    id: "user.irr_investment_6",
    family: "cost",
    label: "IC VERIM RATIO IRR - Sens",
    fn: (inputs) => {
    const delta = num(inputs, "delta");
    const Var = num(inputs, "Var");
    const delta_IRR = num(inputs, "delta_IRR") || 0;
    const delta_Var = num(inputs, "delta_Var") || 0;
    return nonNegative(assertFinite(delta_IRR / delta_Var));
  },
  },

  // ── ILERLEME YEM COST (8 formulas) ──,
  {
    id: "user.feed_cost_formulation_0",
    family: "cost",
    label: "ILERLEME YEM COST - Cost_Ing",
    fn: (inputs) => {
    const inclRate = num(inputs, "inclRate");
    const price = num(inputs, "price");
    return nonNegative(assertFinite(inclRate * price));
  },
  },
  {
    id: "user.feed_cost_formulation_1",
    family: "cost",
    label: "ILERLEME YEM COST - Cost_Base",
    fn: (inputs) => {
    const cost = num(inputs, "cost");
    const Ing = num(inputs, "Ing");
    const cost_Ing = num(inputs, "cost_Ing") || 0;
    return nonNegative(assertFinite(SUM(cost_Ing)));
  },
  },
  {
    id: "user.feed_cost_formulation_2",
    family: "cost",
    label: "ILERLEME YEM COST - Cost_Proc",
    fn: (inputs) => {
    const grind = num(inputs, "grind");
    const mix = num(inputs, "mix");
    const pellet = num(inputs, "pellet");
    return nonNegative(assertFinite(grind + mix + pellet));
  },
  },
  {
    id: "user.feed_cost_formulation_3",
    family: "cost",
    label: "ILERLEME YEM COST - Cost_Add",
    fn: (inputs) => {
    const enz = num(inputs, "enz");
    const vit = num(inputs, "vit");
    const tox = num(inputs, "tox");
    return nonNegative(assertFinite(SUM(enz + vit + tox)));
  },
  },
  {
    id: "user.feed_cost_formulation_4",
    family: "cost",
    label: "ILERLEME YEM COST - Shrink",
    fn: (inputs) => {
    const cost = num(inputs, "cost");
    const Base = num(inputs, "Base");
    const shrinkRate = num(inputs, "shrinkRate");
    const cost_Base = num(inputs, "cost_Base") || 0;
    return nonNegative(assertFinite(cost_Base * shrinkRate));
  },
  },
  {
    id: "user.feed_cost_formulation_5",
    family: "cost",
    label: "ILERLEME YEM COST - FCR",
    fn: (inputs) => {
    const feedCons = num(inputs, "feedCons");
    const weightGain = num(inputs, "weightGain");
    return nonNegative(assertFinite(feedCons / weightGain));
  },
  },
  {
    id: "user.feed_cost_formulation_6",
    family: "cost",
    label: "ILERLEME YEM COST - CostPerKg",
    fn: (inputs) => {
    const base = num(inputs, "base");
    const proc = num(inputs, "proc");
    const add = num(inputs, "add");
    const shrink = num(inputs, "shrink");
    const fCR = num(inputs, "fCR");
    return nonNegative(assertFinite((base + proc + add + shrink) * fCR));
  },
  },
  {
    id: "user.feed_cost_formulation_7",
    family: "cost",
    label: "ILERLEME YEM COST - Opt",
    fn: (inputs) => {
    const base = num(inputs, "base");
    const sUBJECT = num(inputs, "sUBJECT");
    const tO = num(inputs, "tO");
    const constraints = num(inputs, "constraints");
    return 0; // SUBJECT TO requires solver
  },
  },

  // ── ISKELE LEASING (9 formulas) ──,
  {
    id: "user.scaffold_rental_cost_0",
    family: "cost",
    label: "ISKELE LEASING - Area",
    fn: (inputs) => {
    const perim = num(inputs, "perim");
    const height = num(inputs, "height");
    return nonNegative(assertFinite(perim * height));
  },
  },
  {
    id: "user.scaffold_rental_cost_1",
    family: "cost",
    label: "ISKELE LEASING - Vol",
    fn: (inputs) => {
    const area = num(inputs, "area");
    const standoff = num(inputs, "standoff");
    return nonNegative(assertFinite(area * standoff));
  },
  },
  {
    id: "user.scaffold_rental_cost_2",
    family: "cost",
    label: "ISKELE LEASING - Rental",
    fn: (inputs) => {
    const area = num(inputs, "area");
    const rate = num(inputs, "rate");
    const dur = num(inputs, "dur");
    return nonNegative(assertFinite(area * rate * dur));
  },
  },
  {
    id: "user.scaffold_rental_cost_3",
    family: "cost",
    label: "ISKELE LEASING - Lab_Erect",
    fn: (inputs) => {
    const area = num(inputs, "area");
    const erectRate = num(inputs, "erectRate");
    return nonNegative(assertFinite(area * erectRate));
  },
  },
  {
    id: "user.scaffold_rental_cost_4",
    family: "cost",
    label: "ISKELE LEASING - Lab_Dism",
    fn: (inputs) => {
    const area = num(inputs, "area");
    const dismRate = num(inputs, "dismRate");
    return nonNegative(assertFinite(area * dismRate));
  },
  }
];
