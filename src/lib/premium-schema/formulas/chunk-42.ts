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
export const CHUNK_42_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.oee_downtime_0",
    family: "cost",
    label: "OEE ve Durma Süresi — Availability",
    fn: (inputs) => {
    const operatingTime = num(inputs, "operatingTime");
    const plannedProductionTime = num(inputs, "plannedProductionTime");
    return nonNegative(assertFinite(operatingTime / plannedProductionTime));
  },
  },
  {
    id: "user.oee_downtime_1",
    family: "cost",
    label: "OEE ve Durma Süresi — Performance",
    fn: (inputs) => {
    const idealCycleTime = num(inputs, "idealCycleTime");
    const totalCount = num(inputs, "totalCount");
    const operatingTime = num(inputs, "operatingTime");
    return nonNegative(assertFinite((idealCycleTime * totalCount) / operatingTime));
  },
  },
  {
    id: "user.oee_downtime_2",
    family: "cost",
    label: "OEE ve Durma Süresi — Quality",
    fn: (inputs) => {
    const goodCount = num(inputs, "goodCount");
    const totalCount = num(inputs, "totalCount");
    return nonNegative(assertFinite(goodCount / totalCount));
  },
  },
  {
    id: "user.oee_downtime_3",
    family: "cost",
    label: "OEE ve Durma Süresi — OEE",
    fn: (inputs) => {
    const availability = num(inputs, "availability");
    const performance = num(inputs, "performance");
    const quality = num(inputs, "quality");
    return nonNegative(assertFinite(availability * performance * quality));
  },
  },
  {
    id: "user.oee_downtime_4",
    family: "cost",
    label: "OEE ve Durma Süresi — TEEP",
    fn: (inputs) => {
    const oEE = num(inputs, "oEE");
    const plannedProductionTime = num(inputs, "plannedProductionTime");
    const allTime = num(inputs, "allTime");
    return nonNegative(assertFinite(oEE * (plannedProductionTime / allTime)));
  },
  },
  {
    id: "user.oee_downtime_5",
    family: "cost",
    label: "OEE ve Durma Süresi — DowntimeCost",
    fn: (inputs) => {
    const plannedProductionTime = num(inputs, "plannedProductionTime");
    const operatingTime = num(inputs, "operatingTime");
    const costPerMinute = num(inputs, "costPerMinute");
    return nonNegative(assertFinite((plannedProductionTime - operatingTime) * costPerMinute));
  },
  },
  {
    id: "user.oee_downtime_6",
    family: "cost",
    label: "OEE ve Durma Süresi — SpeedLoss",
    fn: (inputs) => {
    const operatingTime = num(inputs, "operatingTime");
    const idealCycleTime = num(inputs, "idealCycleTime");
    const totalCount = num(inputs, "totalCount");
    const costPerMinute = num(inputs, "costPerMinute");
    return nonNegative(assertFinite((operatingTime - (idealCycleTime * totalCount)) * costPerMinute));
  },
  },
  {
    id: "user.oee_downtime_7",
    family: "cost",
    label: "OEE ve Durma Süresi — QualityLoss",
    fn: (inputs) => {
    const totalCount = num(inputs, "totalCount");
    const goodCount = num(inputs, "goodCount");
    const unitCost = num(inputs, "unitCost");
    return nonNegative(assertFinite((totalCount - goodCount) * unitCost));
  },
  },

  // ── Ofis Malzemeleri Maliyet (7 formulas) ──,
  {
    id: "user.office_supplies_cost_0",
    family: "cost",
    label: "Ofis Malzemeleri Maliyet — ConsumptionRate",
    fn: (inputs) => {
    const totalConsumed = num(inputs, "totalConsumed");
    const employeeCount = num(inputs, "employeeCount");
    return nonNegative(assertFinite(totalConsumed / employeeCount));
  },
  },
  {
    id: "user.office_supplies_cost_1",
    family: "cost",
    label: "Ofis Malzemeleri Maliyet — AnnualCost",
    fn: (inputs) => {
    const item = num(inputs, "item");
    const i = num(inputs, "i");
    const unitPrice = num(inputs, "unitPrice");
    const annualUsage = num(inputs, "annualUsage");
    const item_i = num(inputs, "item_i") || 0;
    const unitPrice_i = num(inputs, "unitPrice_i") || 0;
    const annualUsage_i = num(inputs, "annualUsage_i") || 0;
    return nonNegative(assertFinite(SUM(item_i * unitPrice_i * annualUsage_i)));
  },
  },
  {
    id: "user.office_supplies_cost_2",
    family: "cost",
    label: "Ofis Malzemeleri Maliyet — CarryingCost",
    fn: (inputs) => {
    const averageInventory = num(inputs, "averageInventory");
    const holdingRate = num(inputs, "holdingRate");
    return nonNegative(assertFinite(averageInventory * holdingRate));
  },
  },
  {
    id: "user.office_supplies_cost_3",
    family: "cost",
    label: "Ofis Malzemeleri Maliyet — StockoutCost",
    fn: (inputs) => {
    const emergencyOrders = num(inputs, "emergencyOrders");
    const premiumFreight = num(inputs, "premiumFreight");
    return nonNegative(assertFinite(emergencyOrders * premiumFreight));
  },
  },
  {
    id: "user.office_supplies_cost_4",
    family: "cost",
    label: "Ofis Malzemeleri Maliyet — EOQ_Office",
    fn: (inputs) => {
    const annualUsage = num(inputs, "annualUsage");
    const orderCost = num(inputs, "orderCost");
    const holdingCost = num(inputs, "holdingCost");
    const sqrt = num(inputs, "sqrt") || 0;
    return nonNegative(assertFinite(Math.sqrt((2 * annualUsage * orderCost) / holdingCost)));
  },
  },
  {
    id: "user.office_supplies_cost_5",
    family: "cost",
    label: "Ofis Malzemeleri Maliyet — WastePct",
    fn: (inputs) => {
    const purchased = num(inputs, "purchased");
    const consumed = num(inputs, "consumed");
    return nonNegative(assertFinite((purchased - consumed) / purchased));
  },
  },
  {
    id: "user.office_supplies_cost_6",
    family: "cost",
    label: "Ofis Malzemeleri Maliyet — OptimizationSavings",
    fn: (inputs) => {
    const currentCost = num(inputs, "currentCost");
    const eOQ = num(inputs, "eOQ");
    const Cost = num(inputs, "Cost");
    const wastePct = num(inputs, "wastePct");
    const eOQ_Cost = num(inputs, "eOQ_Cost") || 0;
    return nonNegative(assertFinite((currentCost - eOQ_Cost) + (wastePct * currentCost)));
  },
  },

  // ── Overtime vs. Hiring Breakeven (6 formulas) ──
];
