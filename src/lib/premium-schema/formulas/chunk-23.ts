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
export const CHUNK_23_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.volumetric_weight_chargeable_1",
    family: "cost",
    label: "HACİMSEL AĞIRLIK — VolWeight_Road",
    fn: (inputs) => {
    const l = num(inputs, "l");
    const w = num(inputs, "w");
    const h = num(inputs, "h");
    return nonNegative(assertFinite((l * w * h) / 5000));
  },
  },
  {
    id: "user.volumetric_weight_chargeable_2",
    family: "cost",
    label: "HACİMSEL AĞIRLIK — VolWeight_Sea",
    fn: (inputs) => {
    const l = num(inputs, "l");
    const w = num(inputs, "w");
    const h = num(inputs, "h");
    return nonNegative(assertFinite((l * w * h) / 1000));
  },
  },
  {
    id: "user.volumetric_weight_chargeable_3",
    family: "cost",
    label: "HACİMSEL AĞIRLIK — Chargeable",
    fn: (inputs) => {
    const gross = num(inputs, "gross");
    const volWeight = num(inputs, "volWeight");
    const max = num(inputs, "max") || 0;
    return nonNegative(assertFinite(Math.max(gross, volWeight)));
  },
  },
  {
    id: "user.volumetric_weight_chargeable_4",
    family: "cost",
    label: "HACİMSEL AĞIRLIK — Freight",
    fn: (inputs) => {
    const chargeable = num(inputs, "chargeable");
    const rate = num(inputs, "rate");
    return nonNegative(assertFinite(chargeable * rate));
  },
  },
  {
    id: "user.volumetric_weight_chargeable_5",
    family: "cost",
    label: "HACİMSEL AĞIRLIK — Density",
    fn: (inputs) => {
    const gross = num(inputs, "gross");
    const vol = num(inputs, "vol");
    return nonNegative(assertFinite(gross / vol));
  },
  },
  {
    id: "user.volumetric_weight_chargeable_6",
    family: "cost",
    label: "HACİMSEL AĞIRLIK — StackLoss",
    fn: (inputs) => {
    const actualLoad = num(inputs, "actualLoad");
    const maxCont = num(inputs, "maxCont");
    return nonNegative(assertFinite(1 - (actualLoad / maxCont)));
  },
  },
  {
    id: "user.volumetric_weight_chargeable_7",
    family: "cost",
    label: "HACİMSEL AĞIRLIK — Ineff",
    fn: (inputs) => {
    const chargeable = num(inputs, "chargeable");
    const gross = num(inputs, "gross");
    const rate = num(inputs, "rate");
    return nonNegative(assertFinite((chargeable - gross) * rate));
  },
  },

  // ── HAFİFLİK MALİYET TASARRUFU (7 formulas) ──,
  {
    id: "user.lightweight_cost_savings_0",
    family: "cost",
    label: "HAFİFLİK MALİYET TASARRUFU — WeightRed",
    fn: (inputs) => {
    const mass = num(inputs, "mass");
    const Orig = num(inputs, "Orig");
    const mass_Orig = num(inputs, "mass_Orig") || 0;
    const mass_LW = num(inputs, "mass_LW") || 0;
    return nonNegative(assertFinite(mass_Orig - mass_LW));
  },
  },
  {
    id: "user.lightweight_cost_savings_1",
    family: "cost",
    label: "HAFİFLİK MALİYET TASARRUFU — FuelSav_Auto",
    fn: (inputs) => {
    const weightRed = num(inputs, "weightRed");
    const fuelFactor = num(inputs, "fuelFactor");
    const dist = num(inputs, "dist");
    const fuelPrice = num(inputs, "fuelPrice");
    return nonNegative(assertFinite(weightRed * fuelFactor * dist * fuelPrice));
  },
  },
  {
    id: "user.lightweight_cost_savings_2",
    family: "cost",
    label: "HAFİFLİK MALİYET TASARRUFU — FuelSav_Aero",
    fn: (inputs) => {
    const weightRed = num(inputs, "weightRed");
    const burnFactor = num(inputs, "burnFactor");
    const hours = num(inputs, "hours");
    const jetPrice = num(inputs, "jetPrice");
    return nonNegative(assertFinite(weightRed * burnFactor * hours * jetPrice));
  },
  },
  {
    id: "user.lightweight_cost_savings_3",
    family: "cost",
    label: "HAFİFLİK MALİYET TASARRUFU — PayloadGain",
    fn: (inputs) => {
    const weightRed = num(inputs, "weightRed");
    const revPerKg = num(inputs, "revPerKg");
    return nonNegative(assertFinite(weightRed * revPerKg));
  },
  },
  {
    id: "user.lightweight_cost_savings_4",
    family: "cost",
    label: "HAFİFLİK MALİYET TASARRUFU — MatPrem",
    fn: (inputs) => {
    const cost = num(inputs, "cost");
    const Orig = num(inputs, "Orig");
    const vol = num(inputs, "vol");
    const cost_LW = num(inputs, "cost_LW") || 0;
    const cost_Orig = num(inputs, "cost_Orig") || 0;
    return nonNegative(assertFinite((cost_LW - cost_Orig) * vol));
  },
  },
  {
    id: "user.lightweight_cost_savings_5",
    family: "cost",
    label: "HAFİFLİK MALİYET TASARRUFU — ToolDelta",
    fn: (inputs) => {
    const tool = num(inputs, "tool");
    const Orig = num(inputs, "Orig");
    const tool_LW = num(inputs, "tool_LW") || 0;
    const tool_Orig = num(inputs, "tool_Orig") || 0;
    return nonNegative(assertFinite(tool_LW - tool_Orig));
  },
  },
  {
    id: "user.lightweight_cost_savings_6",
    family: "cost",
    label: "HAFİFLİK MALİYET TASARRUFU — NetSav",
    fn: (inputs) => {
    const fuelSav = num(inputs, "fuelSav");
    const payload = num(inputs, "payload");
    const life = num(inputs, "life");
    const matPrem = num(inputs, "matPrem");
    const toolDelta = num(inputs, "toolDelta");
    return nonNegative(assertFinite((fuelSav + payload) * life - matPrem - toolDelta));
  },
  },

  // ── HURDA ORANI OPTİMİZE (8 formulas) ──,
  {
    id: "user.scrap_rate_optimize_0",
    family: "cost",
    label: "HURDA ORANI OPTİMİZE — ScrapRate",
    fn: (inputs) => {
    const scrapQty = num(inputs, "scrapQty");
    const totalInput = num(inputs, "totalInput");
    return nonNegative(assertFinite(scrapQty / totalInput));
  },
  }
];
