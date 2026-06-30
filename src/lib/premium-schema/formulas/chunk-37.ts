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
export const CHUNK_37_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.logistics_route_loss_6",
    family: "cost",
    label: "Lojistik Rota Kaybı — Efficiency",
    fn: (inputs) => {
    const idealDistance = num(inputs, "idealDistance");
    const actualDistance = num(inputs, "actualDistance");
    return nonNegative(assertFinite(idealDistance / actualDistance));
  },
  },

  // ── Mağaza Saatlik Ücret (7 formulas) ──,
  {
    id: "user.shop_hourly_rate_0",
    family: "cost",
    label: "Mağaza Saatlik Ücret — DirectLabor",
    fn: (inputs) => {
    const technicianWages = num(inputs, "technicianWages");
    return nonNegative(assertFinite(SUM(technicianWages)));
  },
  },
  {
    id: "user.shop_hourly_rate_1",
    family: "cost",
    label: "Mağaza Saatlik Ücret — IndirectLabor",
    fn: (inputs) => {
    const managerWages = num(inputs, "managerWages");
    const adminWages = num(inputs, "adminWages");
    return nonNegative(assertFinite(SUM(managerWages + adminWages)));
  },
  },
  {
    id: "user.shop_hourly_rate_2",
    family: "cost",
    label: "Mağaza Saatlik Ücret — Overhead",
    fn: (inputs) => {
    const rent = num(inputs, "rent");
    const utilities = num(inputs, "utilities");
    const insurance = num(inputs, "insurance");
    const tools = num(inputs, "tools");
    const depreciation = num(inputs, "depreciation");
    return nonNegative(assertFinite(rent + utilities + insurance + tools + depreciation));
  },
  },
  {
    id: "user.shop_hourly_rate_3",
    family: "cost",
    label: "Mağaza Saatlik Ücret — TotalShopCost",
    fn: (inputs) => {
    const directLabor = num(inputs, "directLabor");
    const indirectLabor = num(inputs, "indirectLabor");
    const overhead = num(inputs, "overhead");
    return nonNegative(assertFinite(directLabor + indirectLabor + overhead));
  },
  },
  {
    id: "user.shop_hourly_rate_4",
    family: "cost",
    label: "Mağaza Saatlik Ücret — BillableHours",
    fn: (inputs) => {
    const totalAvailableHours = num(inputs, "totalAvailableHours");
    const utilizationRate = num(inputs, "utilizationRate");
    return nonNegative(assertFinite(totalAvailableHours * utilizationRate));
  },
  },
  {
    id: "user.shop_hourly_rate_5",
    family: "cost",
    label: "Mağaza Saatlik Ücret — ShopHourlyRate",
    fn: (inputs) => {
    const totalShopCost = num(inputs, "totalShopCost");
    const billableHours = num(inputs, "billableHours");
    return nonNegative(assertFinite(totalShopCost / billableHours));
  },
  },
  {
    id: "user.shop_hourly_rate_6",
    family: "cost",
    label: "Mağaza Saatlik Ücret — EffectiveMargin",
    fn: (inputs) => {
    const actualBillingRate = num(inputs, "actualBillingRate");
    const shopHourlyRate = num(inputs, "shopHourlyRate");
    return nonNegative(assertFinite((actualBillingRate - shopHourlyRate) / actualBillingRate));
  },
  },

  // ── Mahsul Verim Kaybı Analizörü (8 formulas) ──,
  {
    id: "user.crop_yield_loss_0",
    family: "cost",
    label: "Mahsul Verim Kaybı Analizörü — PotentialYield",
    fn: (inputs) => {
    const geneticPotential = num(inputs, "geneticPotential");
    const environmentFactor = num(inputs, "environmentFactor");
    return nonNegative(assertFinite(geneticPotential * environmentFactor));
  },
  },
  {
    id: "user.crop_yield_loss_1",
    family: "cost",
    label: "Mahsul Verim Kaybı Analizörü — ActualYield",
    fn: (inputs) => {
    const harvestedWeight = num(inputs, "harvestedWeight");
    const area = num(inputs, "area");
    return nonNegative(assertFinite(harvestedWeight / area));
  },
  },
  {
    id: "user.crop_yield_loss_2",
    family: "cost",
    label: "Mahsul Verim Kaybı Analizörü — YieldGap",
    fn: (inputs) => {
    const potentialYield = num(inputs, "potentialYield");
    const actualYield = num(inputs, "actualYield");
    return nonNegative(assertFinite(potentialYield - actualYield));
  },
  },
  {
    id: "user.crop_yield_loss_3",
    family: "cost",
    label: "Mahsul Verim Kaybı Analizörü — Loss_Pest",
    fn: (inputs) => {
    const pestDamagePct = num(inputs, "pestDamagePct");
    const potentialYield = num(inputs, "potentialYield");
    return nonNegative(assertFinite(pestDamagePct * potentialYield));
  },
  },
  {
    id: "user.crop_yield_loss_4",
    family: "cost",
    label: "Mahsul Verim Kaybı Analizörü — Loss_Weather",
    fn: (inputs) => {
    const weatherStressPct = num(inputs, "weatherStressPct");
    const potentialYield = num(inputs, "potentialYield");
    return nonNegative(assertFinite(weatherStressPct * potentialYield));
  },
  },
  {
    id: "user.crop_yield_loss_5",
    family: "cost",
    label: "Mahsul Verim Kaybı Analizörü — Loss_Nutrient",
    fn: (inputs) => {
    const nutrientDeficiencyPct = num(inputs, "nutrientDeficiencyPct");
    const potentialYield = num(inputs, "potentialYield");
    return nonNegative(assertFinite(nutrientDeficiencyPct * potentialYield));
  },
  },
  {
    id: "user.crop_yield_loss_6",
    family: "cost",
    label: "Mahsul Verim Kaybı Analizörü — FinancialLoss",
    fn: (inputs) => {
    const yieldGap = num(inputs, "yieldGap");
    const marketPrice = num(inputs, "marketPrice");
    return nonNegative(assertFinite(yieldGap * marketPrice));
  },
  }
];
