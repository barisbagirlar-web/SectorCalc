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
export const CHUNK_03_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.downtime_cost_3",
    family: "cost",
    label: "DOWNTIME COSTI - RecoveryCost",
    fn: (inputs) => {
    const overtimeHours = num(inputs, "overtimeHours");
    const overtimeRate = num(inputs, "overtimeRate");
    const crewSize = num(inputs, "crewSize");
    return nonNegative(assertFinite(overtimeHours * overtimeRate * crewSize));
  },
  },
  {
    id: "user.downtime_cost_4",
    family: "cost",
    label: "DOWNTIME COSTI - TotalDowntimeCost",
    fn: (inputs) => {
    const directLaborLoss = num(inputs, "directLaborLoss");
    const productionLoss = num(inputs, "productionLoss");
    const energyWaste = num(inputs, "energyWaste");
    const recoveryCost = num(inputs, "recoveryCost");
    const qualityLoss = num(inputs, "qualityLoss");
    const penalty = num(inputs, "penalty");
    return nonNegative(assertFinite(directLaborLoss + productionLoss + energyWaste + recoveryCost + qualityLoss + penalty));
  },
  },

  // ── AUTO REPAIR COMEBACK (6 formulas) ──,
  {
    id: "user.auto_repair_comeback_0",
    family: "cost",
    label: "AUTO REPAIR COMEBACK - ComebackRate",
    fn: (inputs) => {
    const comebackOrders = num(inputs, "comebackOrders");
    const totalCompleted = num(inputs, "totalCompleted");
    return nonNegative(assertFinite((comebackOrders / totalCompleted) * 100));
  },
  },
  {
    id: "user.auto_repair_comeback_1",
    family: "cost",
    label: "AUTO REPAIR COMEBACK - ComebackCost_Direct",
    fn: (inputs) => {
    const comebackOrders = num(inputs, "comebackOrders");
    const diagTime = num(inputs, "diagTime");
    const repairTime = num(inputs, "repairTime");
    const laborRate = num(inputs, "laborRate");
    return nonNegative(assertFinite(comebackOrders * (diagTime + repairTime) * laborRate));
  },
  },
  {
    id: "user.auto_repair_comeback_2",
    family: "cost",
    label: "AUTO REPAIR COMEBACK - ComebackCost_Parts",
    fn: (inputs) => {
    const comebackOrders = num(inputs, "comebackOrders");
    const wastedPartsValue = num(inputs, "wastedPartsValue");
    return nonNegative(assertFinite(comebackOrders * wastedPartsValue));
  },
  },
  {
    id: "user.auto_repair_comeback_3",
    family: "cost",
    label: "AUTO REPAIR COMEBACK - ComebackCost_Opportunity",
    fn: (inputs) => {
    const comebackOrders = num(inputs, "comebackOrders");
    const bayOccupancyHours = num(inputs, "bayOccupancyHours");
    const revenuePerBayHour = num(inputs, "revenuePerBayHour");
    return nonNegative(assertFinite(comebackOrders * bayOccupancyHours * revenuePerBayHour));
  },
  },
  {
    id: "user.auto_repair_comeback_4",
    family: "cost",
    label: "AUTO REPAIR COMEBACK - DPMO",
    fn: (inputs) => {
    const comebackOrders = num(inputs, "comebackOrders");
    const totalCompleted = num(inputs, "totalCompleted");
    return nonNegative(assertFinite((comebackOrders / totalCompleted) * 1000000));
  },
  },
  {
    id: "user.auto_repair_comeback_5",
    family: "cost",
    label: "AUTO REPAIR COMEBACK - TotalCost",
    fn: (inputs) => {
    const direct = num(inputs, "direct");
    const parts = num(inputs, "parts");
    const warranty = num(inputs, "warranty");
    const goodwill = num(inputs, "goodwill");
    const opportunity = num(inputs, "opportunity");
    return nonNegative(assertFinite(direct + parts + warranty + goodwill + opportunity));
  },
  },

  // ── AUTO REPAIR QUOTE (5 formulas) ──,
  {
    id: "user.auto_repair_quote_consistency_0",
    family: "cost",
    label: "AUTO REPAIR QUOTE - QuoteVariance",
    fn: (inputs) => {
    const quoteAmounts = num(inputs, "quoteAmounts");
    return nonNegative(assertFinite(quoteAmounts > 0 ? 1 : 0));
  },
  },
  {
    id: "user.auto_repair_quote_consistency_1",
    family: "cost",
    label: "AUTO REPAIR QUOTE - PartPriceDeviation",
    fn: (inputs) => {
    const quotedPartPrice = num(inputs, "quotedPartPrice");
    const marketAvg = num(inputs, "marketAvg");
    return nonNegative(assertFinite((quotedPartPrice - marketAvg) / marketAvg));
  },
  },
  {
    id: "user.auto_repair_quote_consistency_2",
    family: "cost",
    label: "AUTO REPAIR QUOTE - LaborTimeDeviation",
    fn: (inputs) => {
    const quotedLaborHours = num(inputs, "quotedLaborHours");
    const standardHours = num(inputs, "standardHours");
    return nonNegative(assertFinite((quotedLaborHours - standardHours) / standardHours));
  },
  },
  {
    id: "user.auto_repair_quote_consistency_3",
    family: "cost",
    label: "AUTO REPAIR QUOTE - ConsistencyScore",
    fn: (inputs) => {
    const quoteVariance = num(inputs, "quoteVariance");
    const partPriceDeviation = num(inputs, "partPriceDeviation");
    const laborTimeDeviation = num(inputs, "laborTimeDeviation");
    const abs = num(inputs, "abs") || 0;
    return nonNegative(assertFinite(100 - (quoteVariance * 50 + Math.abs(partPriceDeviation) * 25 + Math.abs(laborTimeDeviation) * 25)));
  },
  },
  {
    id: "user.auto_repair_quote_consistency_4",
    family: "cost",
    label: "AUTO REPAIR QUOTE - MarginLeak",
    fn: (inputs) => {
    const marketPrice = num(inputs, "marketPrice");
    const quotedPrice = num(inputs, "quotedPrice");
    const quantity = num(inputs, "quantity");
    return nonNegative(assertFinite(SUM((marketPrice - quotedPrice) * quantity)));
  },
  },

  // ── AUTO SHOP MARGIN LEAK (7 formulas) ──,
  {
    id: "user.auto_shop_margin_leak_0",
    family: "cost",
    label: "AUTO SHOP MARGIN LEAK - GrossMargin_Parts",
    fn: (inputs) => {
    const partsRevenue = num(inputs, "partsRevenue");
    const partsCOGS = num(inputs, "partsCOGS");
    return nonNegative(assertFinite((partsRevenue - partsCOGS) / partsRevenue));
  },
  },
  {
    id: "user.auto_shop_margin_leak_1",
    family: "cost",
    label: "AUTO SHOP MARGIN LEAK - EffectiveLaborRate",
    fn: (inputs) => {
    const totalLaborRevenue = num(inputs, "totalLaborRevenue");
    const totalFlagHours = num(inputs, "totalFlagHours");
    return nonNegative(assertFinite(totalLaborRevenue / totalFlagHours));
  },
  }
];
