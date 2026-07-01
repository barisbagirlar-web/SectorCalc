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
export const CHUNK_59_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.supplier_currency_risk_5",
    family: "cost",
    label: "Tedarikci Doviz Kuru Riski — CurrencyClauseSavings",
    fn: (inputs) => {
    const contractHasAdjustment = num(inputs, "contractHasAdjustment");
    const exposure = num(inputs, "exposure");
    const adjustmentFactor = num(inputs, "adjustmentFactor");
    return nonNegative(assertFinite(((contractHasAdjustment) ? (exposure * adjustmentFactor) : (0))));
  },
  },

  // ── Teklif Risk Analizoru (6 formulas) ──,
  {
    id: "user.bid_risk_0",
    family: "cost",
    label: "Teklif Risk Analizoru — BaseEstimate",
    fn: (inputs) => {
    const directCosts = num(inputs, "directCosts");
    const overhead = num(inputs, "overhead");
    return nonNegative(assertFinite(SUM(directCosts) + overhead));
  },
  },
  {
    id: "user.bid_risk_1",
    family: "cost",
    label: "Teklif Risk Analizoru — Contingency",
    fn: (inputs) => {
    const baseEstimate = num(inputs, "baseEstimate");
    const riskFactor = num(inputs, "riskFactor");
    return nonNegative(assertFinite(baseEstimate * riskFactor));
  },
  },
  {
    id: "user.bid_risk_2",
    family: "cost",
    label: "Teklif Risk Analizoru — ExpectedMargin",
    fn: (inputs) => {
    const bidPrice = num(inputs, "bidPrice");
    const baseEstimate = num(inputs, "baseEstimate");
    const contingency = num(inputs, "contingency");
    return nonNegative(assertFinite((bidPrice - (baseEstimate + contingency)) / bidPrice));
  },
  },
  {
    id: "user.bid_risk_3",
    family: "cost",
    label: "Teklif Risk Analizoru — WinProbability",
    fn: (inputs) => {
    const f = num(inputs, "f");
    const bidPrice = num(inputs, "bidPrice");
    const competitorIndex = num(inputs, "competitorIndex");
    const historicalWinRate = num(inputs, "historicalWinRate");
    return nonNegative(assertFinite(bidPrice * competitorIndex * historicalWinRate));
  },
  },
  {
    id: "user.bid_risk_4",
    family: "cost",
    label: "Teklif Risk Analizoru — ExpectedValue",
    fn: (inputs) => {
    const winProbability = num(inputs, "winProbability");
    const expectedMargin = num(inputs, "expectedMargin");
    const bidPrice = num(inputs, "bidPrice");
    return nonNegative(assertFinite(winProbability * expectedMargin * bidPrice));
  },
  },
  {
    id: "user.bid_risk_5",
    family: "cost",
    label: "Teklif Risk Analizoru — RiskAdjustedBid",
    fn: (inputs) => {
    const baseEstimate = num(inputs, "baseEstimate");
    const targetMargin = num(inputs, "targetMargin");
    const riskPremium = num(inputs, "riskPremium");
    return nonNegative(assertFinite(baseEstimate / (1 - targetMargin - riskPremium)));
  },
  },

  // ── Tekrarlayan Maliyet (RCA) (6 formulas) ──,
  {
    id: "user.recurring_cost_0",
    family: "cost",
    label: "Tekrarlayan Maliyet (RCA) — RecurringCost_Annual",
    fn: (inputs) => {
    const frequency = num(inputs, "frequency");
    const costPerEvent = num(inputs, "costPerEvent");
    return nonNegative(assertFinite(frequency * costPerEvent));
  },
  },
  {
    id: "user.recurring_cost_1",
    family: "cost",
    label: "Tekrarlayan Maliyet (RCA) — PresentValue_Recurring",
    fn: (inputs) => {
    const recurringCost = num(inputs, "recurringCost");
    const Annual = num(inputs, "Annual");
    const r = num(inputs, "r");
    const n = num(inputs, "n");
    const recurringCost_Annual = num(inputs, "recurringCost_Annual") || 0;
    return nonNegative(assertFinite(recurringCost_Annual * ((1 - (1+r)**-n) / r)));
  },
  },
  {
    id: "user.recurring_cost_2",
    family: "cost",
    label: "Tekrarlayan Maliyet (RCA) — RootCauseInvestment",
    fn: (inputs) => {
    const correctiveActionCost = num(inputs, "correctiveActionCost");
    const implementationCost = num(inputs, "implementationCost");
    return nonNegative(assertFinite(correctiveActionCost + implementationCost));
  },
  },
  {
    id: "user.recurring_cost_3",
    family: "cost",
    label: "Tekrarlayan Maliyet (RCA) — PaybackPeriod",
    fn: (inputs) => {
    const rootCauseInvestment = num(inputs, "rootCauseInvestment");
    const recurringCost = num(inputs, "recurringCost");
    const Annual = num(inputs, "Annual");
    const recurringCost_Annual = num(inputs, "recurringCost_Annual") || 0;
    return nonNegative(assertFinite(rootCauseInvestment / recurringCost_Annual));
  },
  },
  {
    id: "user.recurring_cost_4",
    family: "cost",
    label: "Tekrarlayan Maliyet (RCA) — NPV_Elimination",
    fn: (inputs) => {
    const presentValue = num(inputs, "presentValue");
    const Recurring = num(inputs, "Recurring");
    const rootCauseInvestment = num(inputs, "rootCauseInvestment");
    const presentValue_Recurring = num(inputs, "presentValue_Recurring") || 0;
    return nonNegative(assertFinite(presentValue_Recurring - rootCauseInvestment));
  },
  },
  {
    id: "user.recurring_cost_5",
    family: "cost",
    label: "Tekrarlayan Maliyet (RCA) — BreakevenFrequency",
    fn: (inputs) => {
    const rootCauseInvestment = num(inputs, "rootCauseInvestment");
    const costPerEvent = num(inputs, "costPerEvent");
    return nonNegative(assertFinite(rootCauseInvestment / costPerEvent));
  },
  },

  // ── Tekstil Atigi Risk Assessmentsi (7 formulas) ──,
  {
    id: "user.textile_waste_risk_0",
    family: "cost",
    label: "Tekstil Atigi Risk Assessmentsi — WasteRate",
    fn: (inputs) => {
    const inputFabric = num(inputs, "inputFabric");
    const outputGarments = num(inputs, "outputGarments");
    return nonNegative(assertFinite((inputFabric - outputGarments) / inputFabric));
  },
  },
  {
    id: "user.textile_waste_risk_1",
    family: "cost",
    label: "Tekstil Atigi Risk Assessmentsi — PreConsumerWaste",
    fn: (inputs) => {
    const cuttingScrap = num(inputs, "cuttingScrap");
    const sewingDefects = num(inputs, "sewingDefects");
    const dyeingRework = num(inputs, "dyeingRework");
    return nonNegative(assertFinite(cuttingScrap + sewingDefects + dyeingRework));
  },
  }
];
