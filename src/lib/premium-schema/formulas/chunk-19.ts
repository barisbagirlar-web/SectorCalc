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
export const CHUNK_19_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.interest_rate_risk_4",
    family: "cost",
    label: "FAİZ ORANI RİSKİ — NIM",
    fn: (inputs) => {
    const inc = num(inputs, "inc");
    const earningAssets = num(inputs, "earningAssets");
    const exp = num(inputs, "exp") || 0;
    return nonNegative(assertFinite((inc - exp) / earningAssets));
  },
  },
  {
    id: "user.interest_rate_risk_5",
    family: "cost",
    label: "FAİZ ORANI RİSKİ — VaR",
    fn: (inputs) => {
    const portVal = num(inputs, "portVal");
    const volatility = num(inputs, "volatility");
    const z = num(inputs, "z");
    return nonNegative(assertFinite(portVal * volatility * z));
  },
  },
  {
    id: "user.interest_rate_risk_6",
    family: "cost",
    label: "FAİZ ORANI RİSKİ — HedgeCost",
    fn: (inputs) => {
    const notional = num(inputs, "notional");
    const swapSpread = num(inputs, "swapSpread");
    return nonNegative(assertFinite(notional * swapSpread));
  },
  },
  {
    id: "user.interest_rate_risk_7",
    family: "cost",
    label: "FAİZ ORANI RİSKİ — BreakEven",
    fn: (inputs) => {
    const fixed = num(inputs, "fixed");
    const floating = num(inputs, "floating");
    const Curr = num(inputs, "Curr");
    const floating_Curr = num(inputs, "floating_Curr") || 0;
    return nonNegative(assertFinite(fixed - floating_Curr));
  },
  },

  // ── FILAMENT RECYCLING (7 formulas) ──,
  {
    id: "user.filament_recycling_0",
    family: "cost",
    label: "FILAMENT RECYCLING — Cost_Virgin",
    fn: (inputs) => {
    const price = num(inputs, "price");
    const scrap = num(inputs, "scrap");
    const transp = num(inputs, "transp");
    const price_V = num(inputs, "price_V") || 0;
    const scrap_V = num(inputs, "scrap_V") || 0;
    const transp_V = num(inputs, "transp_V") || 0;
    return nonNegative(assertFinite(price_V * (1 + scrap_V) + transp_V));
  },
  },
  {
    id: "user.filament_recycling_1",
    family: "cost",
    label: "FILAMENT RECYCLING — Cost_Recyc",
    fn: (inputs) => {
    const collect = num(inputs, "collect");
    const sort = num(inputs, "sort");
    const pellet = num(inputs, "pellet");
    const yieldPct = num(inputs, "yield");
    return nonNegative(assertFinite((collect + sort + pellet) / yieldPct));
  },
  },
  {
    id: "user.filament_recycling_2",
    family: "cost",
    label: "FILAMENT RECYCLING — QualPenalty",
    fn: (inputs) => {
    const tensile = num(inputs, "tensile");
    const appFactor = num(inputs, "appFactor");
    const tensile_V = num(inputs, "tensile_V") || 0;
    const tensile_R = num(inputs, "tensile_R") || 0;
    return nonNegative(assertFinite((tensile_V - tensile_R) * appFactor));
  },
  },
  {
    id: "user.filament_recycling_3",
    family: "cost",
    label: "FILAMENT RECYCLING — EnergySav",
    fn: (inputs) => {
    const energy = num(inputs, "energy");
    const energyCost = num(inputs, "energyCost");
    const energy_V = num(inputs, "energy_V") || 0;
    const energy_R = num(inputs, "energy_R") || 0;
    return nonNegative(assertFinite((energy_V - energy_R) * energyCost));
  },
  },
  {
    id: "user.filament_recycling_4",
    family: "cost",
    label: "FILAMENT RECYCLING — CarbonCred",
    fn: (inputs) => {
    const cO2 = num(inputs, "cO2");
    const carbonPrice = num(inputs, "carbonPrice");
    const cO2_V = num(inputs, "cO2_V") || 0;
    const cO2_R = num(inputs, "cO2_R") || 0;
    return nonNegative(assertFinite((cO2_V - cO2_R) * carbonPrice));
  },
  },
  {
    id: "user.filament_recycling_5",
    family: "cost",
    label: "FILAMENT RECYCLING — Total_R",
    fn: (inputs) => {
    const cost = num(inputs, "cost");
    const Recyc = num(inputs, "Recyc");
    const qualPenalty = num(inputs, "qualPenalty");
    const energySav = num(inputs, "energySav");
    const carbonCred = num(inputs, "carbonCred");
    const cost_Recyc = num(inputs, "cost_Recyc") || 0;
    return nonNegative(assertFinite(cost_Recyc + qualPenalty - energySav - carbonCred));
  },
  },
  {
    id: "user.filament_recycling_6",
    family: "cost",
    label: "FILAMENT RECYCLING — ROI",
    fn: (inputs) => {
    const cost = num(inputs, "cost");
    const total = num(inputs, "total");
    const vol = num(inputs, "vol");
    const capex = num(inputs, "capex");
    const cost_V = num(inputs, "cost_V") || 0;
    const total_R = num(inputs, "total_R") || 0;
    return nonNegative(assertFinite((cost_V - total_R) * vol / capex));
  },
  },

  // ── FİYAT ESNEKLİĞİ (8 formulas) ──,
  {
    id: "user.price_elasticity_0",
    family: "cost",
    label: "FİYAT ESNEKLİĞİ — Elasticity",
    fn: (inputs) => {
    const pctChange = num(inputs, "pctChange");
    const Dem = num(inputs, "Dem");
    const Price = num(inputs, "Price");
    const pctChange_Dem = num(inputs, "pctChange_Dem") || 0;
    const pctChange_Price = num(inputs, "pctChange_Price") || 0;
    return nonNegative(assertFinite(pctChange_Dem / pctChange_Price));
  },
  },
  {
    id: "user.price_elasticity_1",
    family: "cost",
    label: "FİYAT ESNEKLİĞİ — NewDem",
    fn: (inputs) => {
    const currDem = num(inputs, "currDem");
    const elast = num(inputs, "elast");
    const pctChange = num(inputs, "pctChange");
    const Price = num(inputs, "Price");
    const pctChange_Price = num(inputs, "pctChange_Price") || 0;
    return nonNegative(assertFinite(currDem * (1 + elast * pctChange_Price)));
  },
  },
  {
    id: "user.price_elasticity_2",
    family: "cost",
    label: "FİYAT ESNEKLİĞİ — NewRev",
    fn: (inputs) => {
    const newPrice = num(inputs, "newPrice");
    const newDem = num(inputs, "newDem");
    return nonNegative(assertFinite(newPrice * newDem));
  },
  },
  {
    id: "user.price_elasticity_3",
    family: "cost",
    label: "FİYAT ESNEKLİĞİ — NewMargin",
    fn: (inputs) => {
    const newPrice = num(inputs, "newPrice");
    const varCost = num(inputs, "varCost");
    const newDem = num(inputs, "newDem");
    const fixed = num(inputs, "fixed");
    return nonNegative(assertFinite((newPrice - varCost) * newDem - fixed));
  },
  }
];
