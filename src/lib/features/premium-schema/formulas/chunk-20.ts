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
export const CHUNK_20_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.price_elasticity_4",
    family: "cost",
    label: "FİYAT ESNEKLİĞİ — MaxPrice",
    fn: (inputs) => {
    const elast = num(inputs, "elast");
    const varCost = num(inputs, "varCost");
    return nonNegative(assertFinite((elast / (elast + 1)) * varCost));
  },
  },
  {
    id: "user.price_elasticity_5",
    family: "cost",
    label: "FİYAT ESNEKLİĞİ — Markup",
    fn: (inputs) => {
    const elast = num(inputs, "elast");
    return nonNegative(assertFinite(-1 / (elast + 1)));
  },
  },
  {
    id: "user.price_elasticity_6",
    family: "cost",
    label: "FİYAT ESNEKLİĞİ — CannibLoss",
    fn: (inputs) => {
    const newDem = num(inputs, "newDem");
    const cannibRate = num(inputs, "cannibRate");
    const margin = num(inputs, "margin");
    const Other = num(inputs, "Other");
    const margin_Other = num(inputs, "margin_Other") || 0;
    return nonNegative(assertFinite(newDem * cannibRate * margin_Other));
  },
  },
  {
    id: "user.price_elasticity_7",
    family: "cost",
    label: "FİYAT ESNEKLİĞİ — NetImpact",
    fn: (inputs) => {
    const newMargin = num(inputs, "newMargin");
    const currMargin = num(inputs, "currMargin");
    const cannib = num(inputs, "cannib");
    return nonNegative(assertFinite(newMargin - currMargin - cannib));
  },
  },

  // ── FLEXIBLE MANUFACTURING ROI (6 formulas) ──,
  {
    id: "user.flexible_manufacturing_roi_0",
    family: "cost",
    label: "FLEXIBLE MANUFACTURING ROI — Cost_Ded",
    fn: (inputs) => {
    const mach = num(inputs, "mach");
    const Ded = num(inputs, "Ded");
    const setup = num(inputs, "setup");
    const changeovers = num(inputs, "changeovers");
    const inv = num(inputs, "inv");
    const High = num(inputs, "High");
    const mach_Ded = num(inputs, "mach_Ded") || 0;
    const setup_Ded = num(inputs, "setup_Ded") || 0;
    const inv_High = num(inputs, "inv_High") || 0;
    return nonNegative(assertFinite(mach_Ded + setup_Ded * changeovers + inv_High));
  },
  },
  {
    id: "user.flexible_manufacturing_roi_1",
    family: "cost",
    label: "FLEXIBLE MANUFACTURING ROI — Cost_Flex",
    fn: (inputs) => {
    const mach = num(inputs, "mach");
    const tool = num(inputs, "tool");
    const prog = num(inputs, "prog");
    const maint = num(inputs, "maint");
    const mach_FMS = num(inputs, "mach_FMS") || 0;
    const tool_FMS = num(inputs, "tool_FMS") || 0;
    return nonNegative(assertFinite(mach_FMS + tool_FMS + prog + maint));
  },
  },
  {
    id: "user.flexible_manufacturing_roi_2",
    family: "cost",
    label: "FLEXIBLE MANUFACTURING ROI — FlexVal",
    fn: (inputs) => {
    const tTM = num(inputs, "tTM");
    const Red = num(inputs, "Red");
    const revGain = num(inputs, "revGain");
    const custPrem = num(inputs, "custPrem");
    const vol = num(inputs, "vol");
    const tTM_Red = num(inputs, "tTM_Red") || 0;
    return nonNegative(assertFinite((tTM_Red * revGain) + (custPrem * vol)));
  },
  },
  {
    id: "user.flexible_manufacturing_roi_3",
    family: "cost",
    label: "FLEXIBLE MANUFACTURING ROI — InvSav",
    fn: (inputs) => {
    const wIP = num(inputs, "wIP");
    const Ded = num(inputs, "Ded");
    const Flex = num(inputs, "Flex");
    const carryCost = num(inputs, "carryCost");
    const wIP_Ded = num(inputs, "wIP_Ded") || 0;
    const wIP_Flex = num(inputs, "wIP_Flex") || 0;
    return nonNegative(assertFinite((wIP_Ded - wIP_Flex) * carryCost));
  },
  },
  {
    id: "user.flexible_manufacturing_roi_4",
    family: "cost",
    label: "FLEXIBLE MANUFACTURING ROI — ScrapRed",
    fn: (inputs) => {
    const scrap = num(inputs, "scrap");
    const Ded = num(inputs, "Ded");
    const Flex = num(inputs, "Flex");
    const vol = num(inputs, "vol");
    const unitCost = num(inputs, "unitCost");
    const scrap_Ded = num(inputs, "scrap_Ded") || 0;
    const scrap_Flex = num(inputs, "scrap_Flex") || 0;
    return nonNegative(assertFinite((scrap_Ded - scrap_Flex) * vol * unitCost));
  },
  },
  {
    id: "user.flexible_manufacturing_roi_5",
    family: "cost",
    label: "FLEXIBLE MANUFACTURING ROI — ROI",
    fn: (inputs) => {
    const cost = num(inputs, "cost");
    const Ded = num(inputs, "Ded");
    const Flex = num(inputs, "Flex");
    const flexVal = num(inputs, "flexVal");
    const invSav = num(inputs, "invSav");
    const scrapRed = num(inputs, "scrapRed");
    const capex = num(inputs, "capex");
    const cost_Ded = num(inputs, "cost_Ded") || 0;
    const cost_Flex = num(inputs, "cost_Flex") || 0;
    return nonNegative(assertFinite((cost_Ded - cost_Flex + flexVal + invSav + scrapRed) / capex));
  },
  },

  // ── GAGE R&R MALİYET (9 formulas) ──,
  {
    id: "user.gage_rnr_cost_0",
    family: "cost",
    label: "GAGE R&R MALİYET — EV",
    fn: (inputs) => {
    const range = num(inputs, "range");
    const Avg = num(inputs, "Avg");
    const d2 = num(inputs, "d2");
    const star = num(inputs, "star");
    const range_Avg = num(inputs, "range_Avg") || 0;
    const d2_star = num(inputs, "d2_star") || 0;
    return nonNegative(assertFinite(range_Avg * d2_star));
  },
  },
  {
    id: "user.gage_rnr_cost_1",
    family: "cost",
    label: "GAGE R&R MALİYET — AV",
    fn: (inputs) => {
    const range = num(inputs, "range");
    const Ops = num(inputs, "Ops");
    const d2 = num(inputs, "d2");
    const star = num(inputs, "star");
    const eV = num(inputs, "eV");
    const n = num(inputs, "n");
    const r = num(inputs, "r");
    const sqrt = num(inputs, "sqrt") || 0;
    const range_Ops = num(inputs, "range_Ops") || 0;
    const d2_star = num(inputs, "d2_star") || 0;
    return nonNegative(assertFinite(Math.sqrt((range_Ops / d2_star)**2 - (eV**2 / (n * r)))));
  },
  },
  {
    id: "user.gage_rnr_cost_2",
    family: "cost",
    label: "GAGE R&R MALİYET — GRR",
    fn: (inputs) => {
    const eV = num(inputs, "eV");
    const aV = num(inputs, "aV");
    const sqrt = num(inputs, "sqrt") || 0;
    return nonNegative(assertFinite(Math.sqrt(eV**2 + aV**2)));
  },
  },
  {
    id: "user.gage_rnr_cost_3",
    family: "cost",
    label: "GAGE R&R MALİYET — PV",
    fn: (inputs) => {
    const range = num(inputs, "range");
    const Parts = num(inputs, "Parts");
    const d2 = num(inputs, "d2");
    const star = num(inputs, "star");
    const range_Parts = num(inputs, "range_Parts") || 0;
    const d2_star = num(inputs, "d2_star") || 0;
    return nonNegative(assertFinite(range_Parts / d2_star));
  },
  },
  {
    id: "user.gage_rnr_cost_4",
    family: "cost",
    label: "GAGE R&R MALİYET — TV",
    fn: (inputs) => {
    const gRR = num(inputs, "gRR");
    const pV = num(inputs, "pV");
    const sqrt = num(inputs, "sqrt") || 0;
    return nonNegative(assertFinite(Math.sqrt(gRR**2 + pV**2)));
  },
  }
];
