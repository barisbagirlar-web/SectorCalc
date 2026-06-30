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

// @ts-ignore TS2590 - chunk to avoid OOM
export const CHUNK_39_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.moq_stock_balance_1",
    family: "cost",
    label: "MOQ Stok Denge — MOQ_Penalty",
    fn: (inputs) => {
    const mOQ = num(inputs, "mOQ");
    const eOQ = num(inputs, "eOQ");
    const holdingCost = num(inputs, "holdingCost");
    return nonNegative(assertFinite(((mOQ > eOQ) ? ((mOQ - eOQ)/2 * holdingCost) : (0))));
  },
  },
  {
    id: "user.moq_stock_balance_2",
    family: "cost",
    label: "MOQ Stok Denge — PriceBreakSavings",
    fn: (inputs) => {
    const unitPrice = num(inputs, "unitPrice");
    const Standard = num(inputs, "Standard");
    const annualDemand = num(inputs, "annualDemand");
    const unitPrice_Standard = num(inputs, "unitPrice_Standard") || 0;
    const unitPrice_MOQ = num(inputs, "unitPrice_MOQ") || 0;
    return nonNegative(assertFinite((unitPrice_Standard - unitPrice_MOQ) * annualDemand));
  },
  },
  {
    id: "user.moq_stock_balance_3",
    family: "cost",
    label: "MOQ Stok Denge — NetBenefit",
    fn: (inputs) => {
    const priceBreakSavings = num(inputs, "priceBreakSavings");
    const mOQ = num(inputs, "mOQ");
    const Penalty = num(inputs, "Penalty");
    const additionalOrderCostSavings = num(inputs, "additionalOrderCostSavings");
    const mOQ_Penalty = num(inputs, "mOQ_Penalty") || 0;
    return nonNegative(assertFinite(priceBreakSavings - mOQ_Penalty - additionalOrderCostSavings));
  },
  },
  {
    id: "user.moq_stock_balance_4",
    family: "cost",
    label: "MOQ Stok Denge — OptimalOrderQty",
    fn: (inputs) => {
    const netBenefit = num(inputs, "netBenefit");
    const mOQ = num(inputs, "mOQ");
    const eOQ = num(inputs, "eOQ");
    return nonNegative(assertFinite(((netBenefit > 0) ? (mOQ) : (eOQ))));
  },
  },
  {
    id: "user.moq_stock_balance_5",
    family: "cost",
    label: "MOQ Stok Denge — CycleStock_Cost",
    fn: (inputs) => {
    const optimalOrderQty = num(inputs, "optimalOrderQty");
    const holdingCost = num(inputs, "holdingCost");
    return nonNegative(assertFinite((optimalOrderQty / 2) * holdingCost));
  },
  },

  // ── MTBF/MTTR Finansal Etki (8 formulas) ──,
  {
    id: "user.mtbf_mttr_financial_0",
    family: "cost",
    label: "MTBF/MTTR Finansal Etki — Availability",
    fn: (inputs) => {
    const mTBF = num(inputs, "mTBF");
    const mTTR = num(inputs, "mTTR");
    return nonNegative(assertFinite(mTBF / (mTBF + mTTR)));
  },
  },
  {
    id: "user.mtbf_mttr_financial_1",
    family: "cost",
    label: "MTBF/MTTR Finansal Etki — ExpectedDowntime",
    fn: (inputs) => {
    const totalTime = num(inputs, "totalTime");
    const availability = num(inputs, "availability");
    return nonNegative(assertFinite(totalTime * (1 - availability)));
  },
  },
  {
    id: "user.mtbf_mttr_financial_2",
    family: "cost",
    label: "MTBF/MTTR Finansal Etki — DowntimeCost",
    fn: (inputs) => {
    const expectedDowntime = num(inputs, "expectedDowntime");
    const costPerHour = num(inputs, "costPerHour");
    return nonNegative(assertFinite(expectedDowntime * costPerHour));
  },
  },
  {
    id: "user.mtbf_mttr_financial_3",
    family: "cost",
    label: "MTBF/MTTR Finansal Etki — FailureFrequency",
    fn: (inputs) => {
    const totalTime = num(inputs, "totalTime");
    const mTBF = num(inputs, "mTBF");
    return nonNegative(assertFinite(totalTime / mTBF));
  },
  },
  {
    id: "user.mtbf_mttr_financial_4",
    family: "cost",
    label: "MTBF/MTTR Finansal Etki — RepairCost",
    fn: (inputs) => {
    const failureFrequency = num(inputs, "failureFrequency");
    const mTTR = num(inputs, "mTTR");
    const laborRate = num(inputs, "laborRate");
    const partsCost = num(inputs, "partsCost");
    return nonNegative(assertFinite(failureFrequency * (mTTR * laborRate + partsCost)));
  },
  },
  {
    id: "user.mtbf_mttr_financial_5",
    family: "cost",
    label: "MTBF/MTTR Finansal Etki — TotalReliabilityCost",
    fn: (inputs) => {
    const downtimeCost = num(inputs, "downtimeCost");
    const repairCost = num(inputs, "repairCost");
    return nonNegative(assertFinite(downtimeCost + repairCost));
  },
  },
  {
    id: "user.mtbf_mttr_financial_6",
    family: "cost",
    label: "MTBF/MTTR Finansal Etki — ROI_Improvement",
    fn: (inputs) => {
    const oldCost = num(inputs, "oldCost");
    const newCost = num(inputs, "newCost");
    const investmentCost = num(inputs, "investmentCost");
    return nonNegative(assertFinite((oldCost - newCost) / investmentCost));
  },
  },
  {
    id: "user.mtbf_mttr_financial_7",
    family: "cost",
    label: "MTBF/MTTR Finansal Etki — TargetMTBF",
    fn: (inputs) => {
    const totalTime = num(inputs, "totalTime");
    const targetAvailability = num(inputs, "targetAvailability");
    const log = num(inputs, "log") || 0;
    return nonNegative(assertFinite(-totalTime / Math.log(targetAvailability)));
  },
  },

  // ── Muda Atık Maliyet (8 formulas) ──,
  {
    id: "user.muda_waste_cost_0",
    family: "cost",
    label: "Muda Atık Maliyet — Overproduction",
    fn: (inputs) => {
    const excessUnits = num(inputs, "excessUnits");
    const unitCost = num(inputs, "unitCost");
    return nonNegative(assertFinite(excessUnits * unitCost));
  },
  },
  {
    id: "user.muda_waste_cost_1",
    family: "cost",
    label: "Muda Atık Maliyet — Waiting",
    fn: (inputs) => {
    const waitingHours = num(inputs, "waitingHours");
    const laborRate = num(inputs, "laborRate");
    const machineRate = num(inputs, "machineRate");
    return nonNegative(assertFinite(waitingHours * (laborRate + machineRate)));
  },
  }
];
