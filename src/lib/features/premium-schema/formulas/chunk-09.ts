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
export const CHUNK_09_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.cloud_waste_elimination_2",
    family: "cost",
    label: "CLOUD FIRE ELIMINATION — SpotSavings",
    fn: (inputs) => {
    const onDemand = num(inputs, "onDemand");
    const spot = num(inputs, "spot");
    const faultTolerantHours = num(inputs, "faultTolerantHours");
    return nonNegative(assertFinite(SUM((onDemand - spot) * faultTolerantHours)));
  },
  },
  {
    id: "user.cloud_waste_elimination_3",
    family: "cost",
    label: "CLOUD FIRE ELIMINATION — ReservedSavings",
    fn: (inputs) => {
    const onDemand = num(inputs, "onDemand");
    const reserved = num(inputs, "reserved");
    const commitUtil = num(inputs, "commitUtil");
    return nonNegative(assertFinite((onDemand - reserved) * commitUtil));
  },
  },
  {
    id: "user.cloud_waste_elimination_4",
    family: "cost",
    label: "CLOUD FIRE ELIMINATION — IdleHoursCost",
    fn: (inputs) => {
    const nonBizHours = num(inputs, "nonBizHours");
    const runningInstances = num(inputs, "runningInstances");
    const hourlyRate = num(inputs, "hourlyRate");
    return nonNegative(assertFinite(nonBizHours * runningInstances * hourlyRate));
  },
  },
  {
    id: "user.cloud_waste_elimination_5",
    family: "cost",
    label: "CLOUD FIRE ELIMINATION — TotalWaste",
    fn: (inputs) => {
    const zombie = num(inputs, "zombie");
    const oversizing = num(inputs, "oversizing");
    const spot = num(inputs, "spot");
    const reserved = num(inputs, "reserved");
    const idle = num(inputs, "idle");
    return nonNegative(assertFinite(zombie + oversizing + spot + reserved + idle));
  },
  },

  // ── CLV / CAC ORANI (6 formulas) ──,
  {
    id: "user.clv_cac_ratio_0",
    family: "cost",
    label: "CLV / CAC ORANI — CLV",
    fn: (inputs) => {
    const avgOrderValue = num(inputs, "avgOrderValue");
    const purchaseFreq = num(inputs, "purchaseFreq");
    const lifespan = num(inputs, "lifespan");
    return nonNegative(assertFinite(avgOrderValue * purchaseFreq * lifespan));
  },
  },
  {
    id: "user.clv_cac_ratio_1",
    family: "cost",
    label: "CLV / CAC ORANI — GrossMarginCLV",
    fn: (inputs) => {
    const cLV = num(inputs, "cLV");
    const grossMarginPct = num(inputs, "grossMarginPct");
    return nonNegative(assertFinite(cLV * grossMarginPct));
  },
  },
  {
    id: "user.clv_cac_ratio_2",
    family: "cost",
    label: "CLV / CAC ORANI — DiscountedCLV",
    fn: (inputs) => {
    const grossMarginCLV = num(inputs, "grossMarginCLV");
    const retention = num(inputs, "retention");
    const t = num(inputs, "t");
    const discountRate = num(inputs, "discountRate");
    return nonNegative(assertFinite(SUM((grossMarginCLV * retention**t) / (1 + discountRate)**t)));
  },
  },
  {
    id: "user.clv_cac_ratio_3",
    family: "cost",
    label: "CLV / CAC ORANI — CAC",
    fn: (inputs) => {
    const salesMarketing = num(inputs, "salesMarketing");
    const salaries = num(inputs, "salaries");
    const overhead = num(inputs, "overhead");
    const newCustomers = num(inputs, "newCustomers");
    return nonNegative(assertFinite((salesMarketing + salaries + overhead) / newCustomers));
  },
  },
  {
    id: "user.clv_cac_ratio_4",
    family: "cost",
    label: "CLV / CAC ORANI — Payback",
    fn: (inputs) => {
    const cAC = num(inputs, "cAC");
    const avgMonthlyGrossProfit = num(inputs, "avgMonthlyGrossProfit");
    return nonNegative(assertFinite(cAC / avgMonthlyGrossProfit));
  },
  },
  {
    id: "user.clv_cac_ratio_5",
    family: "cost",
    label: "CLV / CAC ORANI — LTV_CAC",
    fn: (inputs) => {
    const discountedCLV = num(inputs, "discountedCLV");
    const cAC = num(inputs, "cAC");
    return nonNegative(assertFinite(discountedCLV / cAC));
  },
  },

  // ── CNC CYCLE TIME (7 formulas) ──,
  {
    id: "user.cnc_cycle_time_0",
    family: "cost",
    label: "CNC CYCLE TIME — T_cut",
    fn: (inputs) => {
    const l = num(inputs, "l");
    const d = num(inputs, "d");
    const v = num(inputs, "v");
    const f = num(inputs, "f");
    const a = num(inputs, "a");
    const p = num(inputs, "p");
    const v_f = num(inputs, "v_f") || 0;
    const a_p = num(inputs, "a_p") || 0;
    return nonNegative(assertFinite((l * d) / (v_f * a_p)));
  },
  },
  {
    id: "user.cnc_cycle_time_1",
    family: "cost",
    label: "CNC CYCLE TIME — V_f",
    fn: (inputs) => {
    const f = num(inputs, "f");
    const z = num(inputs, "z");
    const n = num(inputs, "n");
    const f_z = num(inputs, "f_z") || 0;
    return nonNegative(assertFinite(f_z * z * n));
  },
  },
  {
    id: "user.cnc_cycle_time_2",
    family: "cost",
    label: "CNC CYCLE TIME — n",
    fn: (inputs) => {
    const v = num(inputs, "v");
    const c = num(inputs, "c");
    const d = num(inputs, "d");
    const tool = num(inputs, "tool");
    const v_c = num(inputs, "v_c") || 0;
    const d_tool = num(inputs, "d_tool") || 0;
    return nonNegative(assertFinite((1000 * v_c) / (Math.PI * d_tool)));
  },
  },
  {
    id: "user.cnc_cycle_time_3",
    family: "cost",
    label: "CNC CYCLE TIME — T_rapid",
    fn: (inputs) => {
    const distance = num(inputs, "distance");
    const rapid = num(inputs, "rapid");
    const v = num(inputs, "v");
    const distance_rapid = num(inputs, "distance_rapid") || 0;
    const v_rapid = num(inputs, "v_rapid") || 0;
    return nonNegative(assertFinite(distance_rapid / v_rapid));
  },
  },
  {
    id: "user.cnc_cycle_time_4",
    family: "cost",
    label: "CNC CYCLE TIME — T_toolchange",
    fn: (inputs) => {
    const changes = num(inputs, "changes");
    const timePerChange = num(inputs, "timePerChange");
    return nonNegative(assertFinite(changes * timePerChange));
  },
  }
];
