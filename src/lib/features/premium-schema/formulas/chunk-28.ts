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
export const CHUNK_28_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.scaffold_rental_cost_5",
    family: "cost",
    label: "ISKELE LEASING - Transp",
    fn: (inputs) => {
    const trips = num(inputs, "trips");
    const truckRate = num(inputs, "truckRate");
    return nonNegative(assertFinite(trips * truckRate));
  },
  },
  {
    id: "user.scaffold_rental_cost_6",
    family: "cost",
    label: "ISKELE LEASING - Total",
    fn: (inputs) => {
    const rental = num(inputs, "rental");
    const lab = num(inputs, "lab");
    const Erect = num(inputs, "Erect");
    const Dism = num(inputs, "Dism");
    const transp = num(inputs, "transp");
    const lab_Erect = num(inputs, "lab_Erect") || 0;
    const lab_Dism = num(inputs, "lab_Dism") || 0;
    return nonNegative(assertFinite(rental + lab_Erect + lab_Dism + transp));
  },
  },
  {
    id: "user.scaffold_rental_cost_7",
    family: "cost",
    label: "ISKELE LEASING - OptDur",
    fn: (inputs) => {
    const critPath = num(inputs, "critPath");
    const buffer = num(inputs, "buffer");
    const overlap = num(inputs, "overlap");
    return nonNegative(assertFinite(critPath + buffer - overlap));
  },
  },
  {
    id: "user.scaffold_rental_cost_8",
    family: "cost",
    label: "ISKELE LEASING - Overrun",
    fn: (inputs) => {
    const actual = num(inputs, "actual");
    const optDur = num(inputs, "optDur");
    const dailyRate = num(inputs, "dailyRate");
    const max = num(inputs, "max") || 0;
    return nonNegative(assertFinite(Math.max(0, actual - optDur) * dailyRate));
  },
  },

  // ── STATISTICSSEL PROCESS CONTROL (9 formulas) ──,
  {
    id: "user.spc_limit_control_0",
    family: "cost",
    label: "STATISTICSSEL PROCESS CONTROL - X_Bar_Bar",
    fn: (inputs) => {
    const means = num(inputs, "means");
    return nonNegative(assertFinite(means));
  },
  },
  {
    id: "user.spc_limit_control_1",
    family: "cost",
    label: "STATISTICSSEL PROCESS CONTROL - R_Bar",
    fn: (inputs) => {
    const ranges = num(inputs, "ranges");
    return nonNegative(assertFinite(ranges));
  },
  },
  {
    id: "user.spc_limit_control_2",
    family: "cost",
    label: "STATISTICSSEL PROCESS CONTROL - S_Bar",
    fn: (inputs) => {
    const stdDevs = num(inputs, "stdDevs");
    return nonNegative(assertFinite(stdDevs));
  },
  },
  {
    id: "user.spc_limit_control_3",
    family: "cost",
    label: "STATISTICSSEL PROCESS CONTROL - UCL_X",
    fn: (inputs) => {
    const x = num(inputs, "x");
    const Bar = num(inputs, "Bar");
    const a2 = num(inputs, "a2");
    const r = num(inputs, "r");
    const x_Bar_Bar = num(inputs, "x_Bar_Bar") || 0;
    const r_Bar = num(inputs, "r_Bar") || 0;
    return nonNegative(assertFinite(x_Bar_Bar + (a2 * r_Bar)));
  },
  },
  {
    id: "user.spc_limit_control_4",
    family: "cost",
    label: "STATISTICSSEL PROCESS CONTROL - LCL_X",
    fn: (inputs) => {
    const x = num(inputs, "x");
    const Bar = num(inputs, "Bar");
    const a2 = num(inputs, "a2");
    const r = num(inputs, "r");
    const x_Bar_Bar = num(inputs, "x_Bar_Bar") || 0;
    const r_Bar = num(inputs, "r_Bar") || 0;
    return nonNegative(assertFinite(x_Bar_Bar - (a2 * r_Bar)));
  },
  },
  {
    id: "user.spc_limit_control_5",
    family: "cost",
    label: "STATISTICSSEL PROCESS CONTROL - UCL_R",
    fn: (inputs) => {
    const d4 = num(inputs, "d4");
    const r = num(inputs, "r");
    const Bar = num(inputs, "Bar");
    const r_Bar = num(inputs, "r_Bar") || 0;
    return nonNegative(assertFinite(d4 * r_Bar));
  },
  },
  {
    id: "user.spc_limit_control_6",
    family: "cost",
    label: "STATISTICSSEL PROCESS CONTROL - LCL_R",
    fn: (inputs) => {
    const d3 = num(inputs, "d3");
    const r = num(inputs, "r");
    const Bar = num(inputs, "Bar");
    const r_Bar = num(inputs, "r_Bar") || 0;
    return nonNegative(assertFinite(d3 * r_Bar));
  },
  },
  {
    id: "user.spc_limit_control_7",
    family: "cost",
    label: "STATISTICSSEL PROCESS CONTROL - Sigma",
    fn: (inputs) => {
    const r = num(inputs, "r");
    const Bar = num(inputs, "Bar");
    const d2 = num(inputs, "d2");
    const r_Bar = num(inputs, "r_Bar") || 0;
    return nonNegative(assertFinite(r_Bar / d2));
  },
  },
  {
    id: "user.spc_limit_control_8",
    family: "cost",
    label: "STATISTICSSEL PROCESS CONTROL - Cp",
    fn: (inputs) => {
    const uSL = num(inputs, "uSL");
    const lSL = num(inputs, "lSL");
    const sigma = num(inputs, "sigma");
    return nonNegative(assertFinite((uSL - lSL) / (6 * sigma)));
  },
  },

  // ── MACHINING STRATEGY SURE (8 formulas) ──,
  {
    id: "user.machining_strategy_0",
    family: "cost",
    label: "MACHINING STRATEGY SURE - MRR",
    fn: (inputs) => {
    const v = num(inputs, "v");
    const c = num(inputs, "c");
    const f = num(inputs, "f");
    const a = num(inputs, "a");
    const p = num(inputs, "p");
    const v_c = num(inputs, "v_c") || 0;
    const a_p = num(inputs, "a_p") || 0;
    return nonNegative(assertFinite(v_c * f * a_p));
  },
  },
  {
    id: "user.machining_strategy_1",
    family: "cost",
    label: "MACHINING STRATEGY SURE - Power",
    fn: (inputs) => {
    const mRR = num(inputs, "mRR");
    const specEnergy = num(inputs, "specEnergy");
    return nonNegative(assertFinite(mRR * specEnergy));
  },
  }
];
