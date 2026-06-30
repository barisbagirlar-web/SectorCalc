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
export const CHUNK_46_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.project_cost_estimate_2",
    family: "cost",
    label: "Project Maliyet Tahmin — Equipment",
    fn: (inputs) => {
    const rentalDays = num(inputs, "rentalDays");
    const k = num(inputs, "k");
    const dailyRate = num(inputs, "dailyRate");
    const rentalDays_k = num(inputs, "rentalDays_k") || 0;
    const dailyRate_k = num(inputs, "dailyRate_k") || 0;
    return nonNegative(assertFinite(SUM(rentalDays_k * dailyRate_k)));
  },
  },
  {
    id: "user.project_cost_estimate_3",
    family: "cost",
    label: "Project Maliyet Tahmin — Subcontractor",
    fn: (inputs) => {
    const lumpSum = num(inputs, "lumpSum");
    const m = num(inputs, "m");
    const lumpSum_m = num(inputs, "lumpSum_m") || 0;
    return nonNegative(assertFinite(SUM(lumpSum_m)));
  },
  },
  {
    id: "user.project_cost_estimate_4",
    family: "cost",
    label: "Project Maliyet Tahmin — Overhead",
    fn: (inputs) => {
    const directLabor = num(inputs, "directLabor");
    const directMaterial = num(inputs, "directMaterial");
    const overheadRate = num(inputs, "overheadRate");
    return nonNegative(assertFinite((directLabor + directMaterial) * overheadRate));
  },
  },
  {
    id: "user.project_cost_estimate_5",
    family: "cost",
    label: "Project Maliyet Tahmin — Contingency",
    fn: (inputs) => {
    const direct = num(inputs, "direct");
    const overhead = num(inputs, "overhead");
    const riskFactor = num(inputs, "riskFactor");
    return nonNegative(assertFinite((direct + overhead) * riskFactor));
  },
  },
  {
    id: "user.project_cost_estimate_6",
    family: "cost",
    label: "Project Maliyet Tahmin — TotalEstimate",
    fn: (inputs) => {
    const directLabor = num(inputs, "directLabor");
    const directMaterial = num(inputs, "directMaterial");
    const equipment = num(inputs, "equipment");
    const subcontractor = num(inputs, "subcontractor");
    const overhead = num(inputs, "overhead");
    const contingency = num(inputs, "contingency");
    return nonNegative(assertFinite(directLabor + directMaterial + equipment + subcontractor + overhead + contingency));
  },
  },
  {
    id: "user.project_cost_estimate_7",
    family: "cost",
    label: "Project Maliyet Tahmin — CostVariance",
    fn: (inputs) => {
    const totalEstimate = num(inputs, "totalEstimate");
    const budget = num(inputs, "budget");
    return nonNegative(assertFinite(totalEstimate - budget));
  },
  },

  // ── Project Overrun risk (8 formulas) ──,
  {
    id: "user.project_overrun_0",
    family: "cost",
    label: "Project Overrun risk — SPI",
    fn: (inputs) => {
    const earnedValue = num(inputs, "earnedValue");
    const plannedValue = num(inputs, "plannedValue");
    return nonNegative(assertFinite(earnedValue / plannedValue));
  },
  },
  {
    id: "user.project_overrun_1",
    family: "cost",
    label: "Project Overrun risk — CPI",
    fn: (inputs) => {
    const earnedValue = num(inputs, "earnedValue");
    const actualCost = num(inputs, "actualCost");
    return nonNegative(assertFinite(earnedValue / actualCost));
  },
  },
  {
    id: "user.project_overrun_2",
    family: "cost",
    label: "Project Overrun risk — EAC",
    fn: (inputs) => {
    const budgetAtCompletion = num(inputs, "budgetAtCompletion");
    const cPI = num(inputs, "cPI");
    return nonNegative(assertFinite(budgetAtCompletion / cPI));
  },
  },
  {
    id: "user.project_overrun_3",
    family: "cost",
    label: "Project Overrun risk — ExpectedOverrun",
    fn: (inputs) => {
    const eAC = num(inputs, "eAC");
    const budgetAtCompletion = num(inputs, "budgetAtCompletion");
    return nonNegative(assertFinite(eAC - budgetAtCompletion));
  },
  },
  {
    id: "user.project_overrun_4",
    family: "cost",
    label: "Project Overrun risk — ScheduleDelay",
    fn: (inputs) => {
    const actualDuration = num(inputs, "actualDuration");
    const plannedDuration = num(inputs, "plannedDuration");
    return nonNegative(assertFinite((actualDuration - plannedDuration) / plannedDuration));
  },
  },
  {
    id: "user.project_overrun_5",
    family: "cost",
    label: "Project Overrun risk — RiskExposure",
    fn: (inputs) => {
    const probabilityOfDelay = num(inputs, "probabilityOfDelay");
    const delayDays = num(inputs, "delayDays");
    const dailyPenalty = num(inputs, "dailyPenalty");
    const probabilityOfCostOverrun = num(inputs, "probabilityOfCostOverrun");
    const expectedOverrun = num(inputs, "expectedOverrun");
    return nonNegative(assertFinite(probabilityOfDelay * (delayDays * dailyPenalty) + probabilityOfCostOverrun * expectedOverrun));
  },
  },
  {
    id: "user.project_overrun_6",
    family: "cost",
    label: "Project Overrun risk — MitigationCost",
    fn: (inputs) => {
    const crashingCost = num(inputs, "crashingCost");
    const fastTrackingCost = num(inputs, "fastTrackingCost");
    return nonNegative(assertFinite(crashingCost + fastTrackingCost));
  },
  },
  {
    id: "user.project_overrun_7",
    family: "cost",
    label: "Project Overrun risk — NetRisk",
    fn: (inputs) => {
    const riskExposure = num(inputs, "riskExposure");
    const mitigationCost = num(inputs, "mitigationCost");
    return nonNegative(assertFinite(riskExposure - mitigationCost));
  },
  },

  // ── reçete Maliyet Check (7 formulas) ──,
  {
    id: "user.recipe_cost_check_0",
    family: "cost",
    label: "reçete Maliyet Check — TheoreticalCost",
    fn: (inputs) => {
    const formulationPct = num(inputs, "formulationPct");
    const i = num(inputs, "i");
    const ingredientPrice = num(inputs, "ingredientPrice");
    const formulationPct_i = num(inputs, "formulationPct_i") || 0;
    const ingredientPrice_i = num(inputs, "ingredientPrice_i") || 0;
    return nonNegative(assertFinite(SUM(formulationPct_i * ingredientPrice_i)));
  },
  }
];
