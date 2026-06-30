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
export const CHUNK_26_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.heat_exchanger_fouling_6",
    family: "cost",
    label: "ISI EXCHANGER FOULING — Total",
    fn: (inputs) => {
    const cost = num(inputs, "cost");
    const Energy = num(inputs, "Energy");
    const pumpInc = num(inputs, "pumpInc");
    const cost_Energy = num(inputs, "cost_Energy") || 0;
    return nonNegative(assertFinite(cost_Energy + pumpInc));
  },
  },
  {
    id: "user.heat_exchanger_fouling_7",
    family: "cost",
    label: "ISI EXCHANGER FOULING — ROI",
    fn: (inputs) => {
    const total = num(inputs, "total");
    const cleanCost = num(inputs, "cleanCost");
    return nonNegative(assertFinite(total / cleanCost));
  },
  },

  // ── ISO 50001 BASELINE (8 formulas) ──,
  {
    id: "user.iso_50001_baseline_0",
    family: "cost",
    label: "ISO 50001 BASELINE — EnPI",
    fn: (inputs) => {
    const energy = num(inputs, "energy");
    const volume = num(inputs, "volume");
    return nonNegative(assertFinite(energy / volume));
  },
  },
  {
    id: "user.iso_50001_baseline_1",
    family: "cost",
    label: "ISO 50001 BASELINE — Baseline",
    fn: (inputs) => {
    const intercept = num(inputs, "intercept");
    const slope1 = num(inputs, "slope1");
    const prod = num(inputs, "prod");
    const slope2 = num(inputs, "slope2");
    const dD = num(inputs, "dD");
    return nonNegative(assertFinite(intercept + (slope1 * prod) + (slope2 * dD)));
  },
  },
  {
    id: "user.iso_50001_baseline_2",
    family: "cost",
    label: "ISO 50001 BASELINE — Cusum_t",
    fn: (inputs) => {
    const actual = num(inputs, "actual");
    const predicted = num(inputs, "predicted");
    return nonNegative(assertFinite(actual - predicted));
  },
  },
  {
    id: "user.iso_50001_baseline_3",
    family: "cost",
    label: "ISO 50001 BASELINE — Cusum_Cum",
    fn: (inputs) => {
    const cusum = num(inputs, "cusum");
    const t = num(inputs, "t");
    const cusum_t = num(inputs, "cusum_t") || 0;
    return nonNegative(assertFinite(SUM(cusum_t)));
  },
  },
  {
    id: "user.iso_50001_baseline_4",
    family: "cost",
    label: "ISO 50001 BASELINE — Savings",
    fn: (inputs) => {
    const predicted = num(inputs, "predicted");
    const actual = num(inputs, "actual");
    return nonNegative(assertFinite(predicted - actual));
  },
  },
  {
    id: "user.iso_50001_baseline_5",
    family: "cost",
    label: "ISO 50001 BASELINE — Norm",
    fn: (inputs) => {
    const dD = num(inputs, "dD");
    const Curr = num(inputs, "Curr");
    const Hist = num(inputs, "Hist");
    const dD_Curr = num(inputs, "dD_Curr") || 0;
    const dD_Hist = num(inputs, "dD_Hist") || 0;
    return nonNegative(assertFinite(dD_Curr / dD_Hist));
  },
  },
  {
    id: "user.iso_50001_baseline_6",
    family: "cost",
    label: "ISO 50001 BASELINE — Sig",
    fn: (inputs) => {
    const r2 = num(inputs, "r2");
    const p = num(inputs, "p");
    return r2 > 0.75 && p < 0.05 ? 1 : 0;
  },
  },
  {
    id: "user.iso_50001_baseline_7",
    family: "cost",
    label: "ISO 50001 BASELINE — Target",
    fn: (inputs) => {
    const baseline = num(inputs, "baseline");
    const redTarget = num(inputs, "redTarget");
    return nonNegative(assertFinite(baseline * (1 - redTarget)));
  },
  },

  // ── İÇ VERİM ORANI IRR (7 formulas) ──,
  {
    id: "user.irr_investment_0",
    family: "cost",
    label: "İÇ VERİM ORANI IRR — NPV",
    fn: (inputs) => {
    const cash = num(inputs, "cash");
    const t = num(inputs, "t");
    const r = num(inputs, "r");
    const cash_t = num(inputs, "cash_t") || 0;
    return nonNegative(assertFinite(SUM(cash_t / (1 + r)**t)));
  },
  },
  {
    id: "user.irr_investment_1",
    family: "cost",
    label: "İÇ VERİM ORANI IRR — IRR",
    fn: (inputs) => {
    const r = num(inputs, "r");
    const where = num(inputs, "where");
    const nPV = num(inputs, "nPV");
    return 0; // IRR = r where NPV=0 requires iteration
  },
  },
  {
    id: "user.irr_investment_2",
    family: "cost",
    label: "İÇ VERİM ORANI IRR — MIRR",
    fn: (inputs) => {
    const fV = num(inputs, "fV");
    const Pos = num(inputs, "Pos");
    const pV = num(inputs, "pV");
    const Neg = num(inputs, "Neg");
    const n = num(inputs, "n");
    const fV_Pos = num(inputs, "fV_Pos") || 0;
    const pV_Neg = num(inputs, "pV_Neg") || 0;
    return nonNegative(assertFinite((fV_Pos / pV_Neg)**(1/n) - 1));
  },
  },
  {
    id: "user.irr_investment_3",
    family: "cost",
    label: "İÇ VERİM ORANI IRR — Payback",
    fn: (inputs) => {
    const year = num(inputs, "year");
    const Before = num(inputs, "Before");
    const unrecovered = num(inputs, "unrecovered");
    const cash = num(inputs, "cash");
    const Rec = num(inputs, "Rec");
    const year_Before = num(inputs, "year_Before") || 0;
    const cash_Rec = num(inputs, "cash_Rec") || 0;
    return nonNegative(assertFinite(year_Before + (unrecovered / cash_Rec)));
  },
  },
  {
    id: "user.irr_investment_4",
    family: "cost",
    label: "İÇ VERİM ORANI IRR — PI",
    fn: (inputs) => {
    const pV = num(inputs, "pV");
    const Future = num(inputs, "Future");
    const initInv = num(inputs, "initInv");
    const pV_Future = num(inputs, "pV_Future") || 0;
    return nonNegative(assertFinite(pV_Future / initInv));
  },
  }
];
