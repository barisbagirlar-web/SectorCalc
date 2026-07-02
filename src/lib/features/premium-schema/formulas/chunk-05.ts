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
export const CHUNK_05_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.compressed_air_energy_cost_4",
    family: "cost",
    label: "COMPRESSED AIR ENERGY - TotalAnnualCost",
    fn: (inputs) => {
    const annualEnergyCost = num(inputs, "annualEnergyCost");
    const leakageCost = num(inputs, "leakageCost");
    const pressureDropCost = num(inputs, "pressureDropCost");
    const unloadWaste = num(inputs, "unloadWaste");
    const heatRecoverySavings = num(inputs, "heatRecoverySavings");
    return nonNegative(assertFinite(annualEnergyCost + leakageCost + pressureDropCost + unloadWaste - heatRecoverySavings));
  },
  },

  // ── BREAK-EVEN POINT (6 formulas) ──,
  {
    id: "user.break_even_margin_of_safety_0",
    family: "cost",
    label: "BREAK-EVEN POINT - BEP_Units",
    fn: (inputs) => {
    const fixedCosts = num(inputs, "fixedCosts");
    const unitPrice = num(inputs, "unitPrice");
    const unitVariableCost = num(inputs, "unitVariableCost");
    return nonNegative(assertFinite(fixedCosts / (unitPrice - unitVariableCost)));
  },
  },
  {
    id: "user.break_even_margin_of_safety_1",
    family: "cost",
    label: "BREAK-EVEN POINT - BEP_Revenue",
    fn: (inputs) => {
    const fixedCosts = num(inputs, "fixedCosts");
    const cMR = num(inputs, "cMR");
    return nonNegative(assertFinite(fixedCosts / cMR));
  },
  },
  {
    id: "user.break_even_margin_of_safety_2",
    family: "cost",
    label: "BREAK-EVEN POINT - CMR",
    fn: (inputs) => {
    const unitPrice = num(inputs, "unitPrice");
    const unitVariableCost = num(inputs, "unitVariableCost");
    return nonNegative(assertFinite((unitPrice - unitVariableCost) / unitPrice));
  },
  },
  {
    id: "user.break_even_margin_of_safety_3",
    family: "cost",
    label: "BREAK-EVEN POINT - MarginOfSafety_Percent",
    fn: (inputs) => {
    const actualSales = num(inputs, "actualSales");
    const bEP = num(inputs, "bEP");
    const Units = num(inputs, "Units");
    const bEP_Units = num(inputs, "bEP_Units") || 0;
    return nonNegative(assertFinite((actualSales - bEP_Units) / actualSales * 100));
  },
  },
  {
    id: "user.break_even_margin_of_safety_4",
    family: "cost",
    label: "BREAK-EVEN POINT - OperatingLeverage",
    fn: (inputs) => {
    const contributionMargin = num(inputs, "contributionMargin");
    const netOperatingIncome = num(inputs, "netOperatingIncome");
    return nonNegative(assertFinite(contributionMargin / netOperatingIncome));
  },
  },
  {
    id: "user.break_even_margin_of_safety_5",
    family: "cost",
    label: "BREAK-EVEN POINT - TargetProfit_Units",
    fn: (inputs) => {
    const fixedCosts = num(inputs, "fixedCosts");
    const targetProfit = num(inputs, "targetProfit");
    const unitContributionMargin = num(inputs, "unitContributionMargin");
    return nonNegative(assertFinite((fixedCosts + targetProfit) / unitContributionMargin));
  },
  },

  // ── CONCRETE VOLUME (8 formulas) ──,
  {
    id: "user.concrete_volume_cost_0",
    family: "cost",
    label: "CONCRETE VOLUME - V_slab",
    fn: (inputs) => {
    const length = num(inputs, "length");
    const width = num(inputs, "width");
    const thickness = num(inputs, "thickness");
    return nonNegative(assertFinite(length * width * thickness));
  },
  },
  {
    id: "user.concrete_volume_cost_1",
    family: "cost",
    label: "CONCRETE VOLUME - V_footing",
    fn: (inputs) => {
    const length = num(inputs, "length");
    const width = num(inputs, "width");
    const depth = num(inputs, "depth");
    const count = num(inputs, "count");
    return nonNegative(assertFinite(length * width * depth * count));
  },
  },
  {
    id: "user.concrete_volume_cost_2",
    family: "cost",
    label: "CONCRETE VOLUME - V_column",
    fn: (inputs) => {
    const diameter = num(inputs, "diameter");
    const height = num(inputs, "height");
    const count = num(inputs, "count");
    return nonNegative(assertFinite(Math.PI * (diameter/2)**2 * height * count));
  },
  },
  {
    id: "user.concrete_volume_cost_3",
    family: "cost",
    label: "CONCRETE VOLUME - V_wall",
    fn: (inputs) => {
    const length = num(inputs, "length");
    const height = num(inputs, "height");
    const thickness = num(inputs, "thickness");
    return nonNegative(assertFinite(length * height * thickness));
  },
  },
  {
    id: "user.concrete_volume_cost_4",
    family: "cost",
    label: "CONCRETE VOLUME - V_total",
    fn: (inputs) => {
    const v = num(inputs, "v");
    const geometric = num(inputs, "geometric");
    const wasteFactor = num(inputs, "wasteFactor");
    const v_geometric = num(inputs, "v_geometric") || 0;
    return nonNegative(assertFinite(v_geometric * (1 + wasteFactor)));
  },
  },
  {
    id: "user.concrete_volume_cost_5",
    family: "cost",
    label: "CONCRETE VOLUME - Weight",
    fn: (inputs) => {
    const v = num(inputs, "v");
    const total = num(inputs, "total");
    const density = num(inputs, "density");
    const v_total = num(inputs, "v_total") || 0;
    return nonNegative(assertFinite(v_total * density));
  },
  },
  {
    id: "user.concrete_volume_cost_6",
    family: "cost",
    label: "CONCRETE VOLUME - TruckLoads",
    fn: (inputs) => {
    const v = num(inputs, "v");
    const total = num(inputs, "total");
    const truckCapacity = num(inputs, "truckCapacity");
    const ceil = num(inputs, "ceil") || 0;
    const v_total = num(inputs, "v_total") || 0;
    return nonNegative(assertFinite(Math.ceil(v_total / truckCapacity)));
  },
  },
  {
    id: "user.concrete_volume_cost_7",
    family: "cost",
    label: "CONCRETE VOLUME - TotalCost",
    fn: (inputs) => {
    const v = num(inputs, "v");
    const total = num(inputs, "total");
    const unitPrice = num(inputs, "unitPrice");
    const pumpCost = num(inputs, "pumpCost");
    const v_total = num(inputs, "v_total") || 0;
    return nonNegative(assertFinite(v_total * unitPrice + pumpCost));
  },
  },

  // ── CALIBRATION SAPMA (6 formulas) ──
];
