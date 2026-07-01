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
export const CHUNK_17_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.environmental_waste_cost_5",
    family: "cost",
    label: "ENVIRONMENTAL FIRE — Total",
    fn: (inputs) => {
    const disp = num(inputs, "disp");
    const haz = num(inputs, "haz");
    const recyc = num(inputs, "recyc");
    const emis = num(inputs, "emis");
    const penalty = num(inputs, "penalty");
    return nonNegative(assertFinite(disp + haz + recyc + emis + penalty));
  },
  },
  {
    id: "user.environmental_waste_cost_6",
    family: "cost",
    label: "ENVIRONMENTAL FIRE — WasteIntensity",
    fn: (inputs) => {
    const totalWaste = num(inputs, "totalWaste");
    const volume = num(inputs, "volume");
    return nonNegative(assertFinite(totalWaste / volume));
  },
  },
  {
    id: "user.environmental_waste_cost_7",
    family: "cost",
    label: "ENVIRONMENTAL FIRE — Circularity",
    fn: (inputs) => {
    const recyc = num(inputs, "recyc");
    const totalWaste = num(inputs, "totalWaste");
    return nonNegative(assertFinite(recyc / totalWaste));
  },
  },

  // ── EOQ ENVANTER (7 formulas) ──,
  {
    id: "user.eoq_inventory_optimizer_0",
    family: "cost",
    label: "EOQ ENVANTER — EOQ",
    fn: (inputs) => {
    const demand = num(inputs, "demand");
    const orderCost = num(inputs, "orderCost");
    const holdingCost = num(inputs, "holdingCost");
    const sqrt = num(inputs, "sqrt") || 0;
    return nonNegative(assertFinite(Math.sqrt((2 * demand * orderCost) / holdingCost)));
  },
  },
  {
    id: "user.eoq_inventory_optimizer_1",
    family: "cost",
    label: "EOQ ENVANTER — ROP",
    fn: (inputs) => {
    const leadTime = num(inputs, "leadTime");
    const dailyDemand = num(inputs, "dailyDemand");
    const safetyStock = num(inputs, "safetyStock");
    return nonNegative(assertFinite((leadTime * dailyDemand) + safetyStock));
  },
  },
  {
    id: "user.eoq_inventory_optimizer_2",
    family: "cost",
    label: "EOQ ENVANTER — SafetyStock",
    fn: (inputs) => {
    const z = num(inputs, "z");
    const stdDev = num(inputs, "stdDev");
    const leadTime = num(inputs, "leadTime");
    const sqrt = num(inputs, "sqrt") || 0;
    return nonNegative(assertFinite(z * stdDev * Math.sqrt(leadTime)));
  },
  },
  {
    id: "user.eoq_inventory_optimizer_3",
    family: "cost",
    label: "EOQ ENVANTER — TotalCost",
    fn: (inputs) => {
    const demand = num(inputs, "demand");
    const eOQ = num(inputs, "eOQ");
    const orderCost = num(inputs, "orderCost");
    const safety = num(inputs, "safety");
    const holdingCost = num(inputs, "holdingCost");
    return nonNegative(assertFinite((demand / eOQ) * orderCost + (eOQ / 2 + safety) * holdingCost));
  },
  },
  {
    id: "user.eoq_inventory_optimizer_4",
    family: "cost",
    label: "EOQ ENVANTER — CycleStock",
    fn: (inputs) => {
    const eOQ = num(inputs, "eOQ");
    return nonNegative(assertFinite(eOQ / 2));
  },
  },
  {
    id: "user.eoq_inventory_optimizer_5",
    family: "cost",
    label: "EOQ ENVANTER — Turnover",
    fn: (inputs) => {
    const demand = num(inputs, "demand");
    const avgInv = num(inputs, "avgInv");
    return nonNegative(assertFinite(demand / avgInv));
  },
  },
  {
    id: "user.eoq_inventory_optimizer_6",
    family: "cost",
    label: "EOQ ENVANTER — DaysSales",
    fn: (inputs) => {
    const turnover = num(inputs, "turnover");
    return nonNegative(assertFinite(365 / turnover));
  },
  },

  // ── EVM COST FORECAST (9 formulas) ──,
  {
    id: "user.evm_cost_forecast_0",
    family: "cost",
    label: "EVM COST FORECAST — SV",
    fn: (inputs) => {
    const eV = num(inputs, "eV");
    const pV = num(inputs, "pV");
    return nonNegative(assertFinite(eV - pV));
  },
  },
  {
    id: "user.evm_cost_forecast_1",
    family: "cost",
    label: "EVM COST FORECAST — CV",
    fn: (inputs) => {
    const eV = num(inputs, "eV");
    const aC = num(inputs, "aC");
    return nonNegative(assertFinite(eV - aC));
  },
  },
  {
    id: "user.evm_cost_forecast_2",
    family: "cost",
    label: "EVM COST FORECAST — SPI",
    fn: (inputs) => {
    const eV = num(inputs, "eV");
    const pV = num(inputs, "pV");
    return nonNegative(assertFinite(eV / pV));
  },
  },
  {
    id: "user.evm_cost_forecast_3",
    family: "cost",
    label: "EVM COST FORECAST — CPI",
    fn: (inputs) => {
    const eV = num(inputs, "eV");
    const aC = num(inputs, "aC");
    return nonNegative(assertFinite(eV / aC));
  },
  },
  {
    id: "user.evm_cost_forecast_4",
    family: "cost",
    label: "EVM COST FORECAST — EAC_CPI",
    fn: (inputs) => {
    const bAC = num(inputs, "bAC");
    const cPI = num(inputs, "cPI");
    return nonNegative(assertFinite(bAC / cPI));
  },
  }
];
