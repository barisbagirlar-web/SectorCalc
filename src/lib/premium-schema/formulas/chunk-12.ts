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
export const CHUNK_12_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.roof_area_load_5",
    family: "cost",
    label: "ÇATI ALANI — Load_Dead",
    fn: (inputs) => {
    const materialWeight = num(inputs, "materialWeight");
    const totalArea = num(inputs, "totalArea");
    return nonNegative(assertFinite(materialWeight * totalArea));
  },
  },
  {
    id: "user.roof_area_load_6",
    family: "cost",
    label: "ÇATI ALANI — Load_Snow",
    fn: (inputs) => {
    const groundSnow = num(inputs, "groundSnow");
    const exposure = num(inputs, "exposure");
    const thermal = num(inputs, "thermal");
    const slope = num(inputs, "slope");
    return nonNegative(assertFinite(groundSnow * exposure * thermal * slope));
  },
  },

  // ── DARBOĞAZ YATIRIM (7 formulas) ──,
  {
    id: "user.bottleneck_investment_0",
    family: "cost",
    label: "DARBOĞAZ YATIRIM — Utilization",
    fn: (inputs) => {
    const actualOutput = num(inputs, "actualOutput");
    const designCapacity = num(inputs, "designCapacity");
    return nonNegative(assertFinite(actualOutput / designCapacity));
  },
  },
  {
    id: "user.bottleneck_investment_1",
    family: "cost",
    label: "DARBOĞAZ YATIRIM — Throughput",
    fn: (inputs) => {
    const demand = num(inputs, "demand");
    const defectRate = num(inputs, "defectRate");
    return nonNegative(assertFinite(demand * (1 - defectRate)));
  },
  },
  {
    id: "user.bottleneck_investment_2",
    family: "cost",
    label: "DARBOĞAZ YATIRIM — TaktTime",
    fn: (inputs) => {
    const availableTime = num(inputs, "availableTime");
    const demand = num(inputs, "demand");
    return nonNegative(assertFinite(availableTime / demand));
  },
  },
  {
    id: "user.bottleneck_investment_3",
    family: "cost",
    label: "DARBOĞAZ YATIRIM — CycleTime_Gap",
    fn: (inputs) => {
    const bottleneckCycle = num(inputs, "bottleneckCycle");
    const taktTime = num(inputs, "taktTime");
    return nonNegative(assertFinite(bottleneckCycle - taktTime));
  },
  },
  {
    id: "user.bottleneck_investment_4",
    family: "cost",
    label: "DARBOĞAZ YATIRIM — CostOfConstraint",
    fn: (inputs) => {
    const cycleTime = num(inputs, "cycleTime");
    const Gap = num(inputs, "Gap");
    const demand = num(inputs, "demand");
    const unitMargin = num(inputs, "unitMargin");
    const cycleTime_Gap = num(inputs, "cycleTime_Gap") || 0;
    return nonNegative(assertFinite(cycleTime_Gap * demand * unitMargin));
  },
  },
  {
    id: "user.bottleneck_investment_5",
    family: "cost",
    label: "DARBOĞAZ YATIRIM — ROI",
    fn: (inputs) => {
    const throughputIncrease = num(inputs, "throughputIncrease");
    const margin = num(inputs, "margin");
    const days = num(inputs, "days");
    const upgradeCost = num(inputs, "upgradeCost");
    return nonNegative(assertFinite((throughputIncrease * margin * days) / upgradeCost));
  },
  },
  {
    id: "user.bottleneck_investment_6",
    family: "cost",
    label: "DARBOĞAZ YATIRIM — Payback",
    fn: (inputs) => {
    const upgradeCost = num(inputs, "upgradeCost");
    const monthlyGain = num(inputs, "monthlyGain");
    return nonNegative(assertFinite(upgradeCost / monthlyGain));
  },
  },

  // ── DEĞİŞİM MATRİSİ SMED (8 formulas) ──,
  {
    id: "user.smed_changeover_matrix_0",
    family: "cost",
    label: "DEĞİŞİM MATRİSİ SMED — T_internal",
    fn: (inputs) => {
    const setupStopped = num(inputs, "setupStopped");
    return nonNegative(assertFinite(setupStopped));
  },
  },
  {
    id: "user.smed_changeover_matrix_1",
    family: "cost",
    label: "DEĞİŞİM MATRİSİ SMED — T_external",
    fn: (inputs) => {
    const setupRunning = num(inputs, "setupRunning");
    return nonNegative(assertFinite(setupRunning));
  },
  },
  {
    id: "user.smed_changeover_matrix_2",
    family: "cost",
    label: "DEĞİŞİM MATRİSİ SMED — T_total",
    fn: (inputs) => {
    const t = num(inputs, "t");
    const internal = num(inputs, "internal");
    const external = num(inputs, "external");
    const t_internal = num(inputs, "t_internal") || 0;
    const t_external = num(inputs, "t_external") || 0;
    return nonNegative(assertFinite(t_internal + t_external));
  },
  },
  {
    id: "user.smed_changeover_matrix_3",
    family: "cost",
    label: "DEĞİŞİM MATRİSİ SMED — T_target",
    fn: (inputs) => {
    const t = num(inputs, "t");
    const internal = num(inputs, "internal");
    const conversionRate = num(inputs, "conversionRate");
    const external = num(inputs, "external");
    const t_internal = num(inputs, "t_internal") || 0;
    const t_external = num(inputs, "t_external") || 0;
    return nonNegative(assertFinite(t_internal * (1 - conversionRate) + t_external));
  },
  },
  {
    id: "user.smed_changeover_matrix_4",
    family: "cost",
    label: "DEĞİŞİM MATRİSİ SMED — EBQ",
    fn: (inputs) => {
    const demand = num(inputs, "demand");
    const setupCost = num(inputs, "setupCost");
    const holdingCost = num(inputs, "holdingCost");
    const sqrt = num(inputs, "sqrt") || 0;
    return nonNegative(assertFinite(Math.sqrt((2 * demand * setupCost) / holdingCost)));
  },
  },
  {
    id: "user.smed_changeover_matrix_5",
    family: "cost",
    label: "DEĞİŞİM MATRİSİ SMED — SetupCost",
    fn: (inputs) => {
    const t = num(inputs, "t");
    const total = num(inputs, "total");
    const machineRate = num(inputs, "machineRate");
    const labor = num(inputs, "labor");
    const t_total = num(inputs, "t_total") || 0;
    return nonNegative(assertFinite(t_total * machineRate + labor));
  },
  }
];
