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
export const CHUNK_38_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.crop_yield_loss_7",
    family: "cost",
    label: "Mahsul Verim Kaybı Analizörü — ROI_Intervention",
    fn: (inputs) => {
    const financialLoss = num(inputs, "financialLoss");
    const Recovered = num(inputs, "Recovered");
    const interventionCost = num(inputs, "interventionCost");
    const financialLoss_Recovered = num(inputs, "financialLoss_Recovered") || 0;
    return nonNegative(assertFinite((financialLoss_Recovered - interventionCost) / interventionCost));
  },
  },

  // ── Makine Ekonomik Ömrü (7 formulas) ──,
  {
    id: "user.machine_economic_life_0",
    family: "cost",
    label: "Makine Ekonomik Ömrü — EUAC_Capital",
    fn: (inputs) => {
    const initialCost = num(inputs, "initialCost");
    const salvageValue = num(inputs, "salvageValue");
    const a = num(inputs, "a");
    const p = num(inputs, "p");
    const i = num(inputs, "i");
    const n = num(inputs, "n");
    return nonNegative(assertFinite((initialCost - salvageValue) * (i / (1 - 1 / Math.pow(1 + i, n))) + salvageValue * i));
  },
  },
  {
    id: "user.machine_economic_life_1",
    family: "cost",
    label: "Makine Ekonomik Ömrü — EUAC_Operating",
    fn: (inputs) => {
    const opCost = num(inputs, "opCost");
    const t = num(inputs, "t");
    const p = num(inputs, "p");
    const f = num(inputs, "f");
    const i = num(inputs, "i");
    const a = num(inputs, "a");
    const n = num(inputs, "n");
    const opCost_t = num(inputs, "opCost_t") || 0;
    return nonNegative(assertFinite(opCost_t * (1 / Math.pow(1 + i, t)) * (i / (1 - 1 / Math.pow(1 + i, n)))));
  },
  },
  {
    id: "user.machine_economic_life_2",
    family: "cost",
    label: "Makine Ekonomik Ömrü — TotalEUAC",
    fn: (inputs) => {
    const eUAC = num(inputs, "eUAC");
    const Capital = num(inputs, "Capital");
    const Operating = num(inputs, "Operating");
    const eUAC_Capital = num(inputs, "eUAC_Capital") || 0;
    const eUAC_Operating = num(inputs, "eUAC_Operating") || 0;
    return nonNegative(assertFinite(eUAC_Capital + eUAC_Operating));
  },
  },
  {
    id: "user.machine_economic_life_3",
    family: "cost",
    label: "Makine Ekonomik Ömrü — EconomicLife",
    fn: (inputs) => {
    return 0; // EconomicLife = n where TotalEUAC is MINIMUM — requires solver
  },
  },
  {
    id: "user.machine_economic_life_4",
    family: "cost",
    label: "Makine Ekonomik Ömrü — Defender_EUAC",
    fn: (inputs) => {
    const currentMarketValue = num(inputs, "currentMarketValue");
    const a = num(inputs, "a");
    const p = num(inputs, "p");
    const i = num(inputs, "i");
    const n = num(inputs, "n");
    const opCost = num(inputs, "opCost");
    const Defender = num(inputs, "Defender");
    const opCost_Defender = num(inputs, "opCost_Defender") || 0;
    return nonNegative(assertFinite(currentMarketValue * (a / (1 - 1 / Math.pow(1 + i, n)) / i) + opCost_Defender));
  },
  },
  {
    id: "user.machine_economic_life_5",
    family: "cost",
    label: "Makine Ekonomik Ömrü — Challenger_EUAC",
    fn: (inputs) => {
    const eUAC = num(inputs, "eUAC");
    const NewMachine = num(inputs, "NewMachine");
    const eUAC_NewMachine = num(inputs, "eUAC_NewMachine") || 0;
    return nonNegative(assertFinite(eUAC_NewMachine));
  },
  },
  {
    id: "user.machine_economic_life_6",
    family: "cost",
    label: "Makine Ekonomik Ömrü — ReplacementDecision",
    fn: (inputs) => {
    const defender = num(inputs, "defender");
    const challenger = num(inputs, "challenger");
    const replace = num(inputs, "replace");
    const keep = num(inputs, "keep");
    const defender_EUAC = num(inputs, "defender_EUAC") || 0;
    const challenger_EUAC = num(inputs, "challenger_EUAC") || 0;
    return nonNegative(assertFinite(((defender_EUAC > challenger_EUAC) ? 1 : 0)));
  },
  },

  // ── Malzeme Replacement Maliyet (6 formulas) ──,
  {
    id: "user.material_replacement_cost_0",
    family: "cost",
    label: "Malzeme Replacement Maliyet — TCO_Current",
    fn: (inputs) => {
    const matCost = num(inputs, "matCost");
    const Current = num(inputs, "Current");
    const processingCost = num(inputs, "processingCost");
    const lifecycleMaint = num(inputs, "lifecycleMaint");
    const disposalCost = num(inputs, "disposalCost");
    const matCost_Current = num(inputs, "matCost_Current") || 0;
    const processingCost_Current = num(inputs, "processingCost_Current") || 0;
    const lifecycleMaint_Current = num(inputs, "lifecycleMaint_Current") || 0;
    const disposalCost_Current = num(inputs, "disposalCost_Current") || 0;
    return nonNegative(assertFinite(matCost_Current + processingCost_Current + lifecycleMaint_Current + disposalCost_Current));
  },
  },
  {
    id: "user.material_replacement_cost_1",
    family: "cost",
    label: "Malzeme Replacement Maliyet — TCO_Alternative",
    fn: (inputs) => {
    const matCost = num(inputs, "matCost");
    const Alt = num(inputs, "Alt");
    const processingCost = num(inputs, "processingCost");
    const lifecycleMaint = num(inputs, "lifecycleMaint");
    const disposalCost = num(inputs, "disposalCost");
    const matCost_Alt = num(inputs, "matCost_Alt") || 0;
    const processingCost_Alt = num(inputs, "processingCost_Alt") || 0;
    const lifecycleMaint_Alt = num(inputs, "lifecycleMaint_Alt") || 0;
    const disposalCost_Alt = num(inputs, "disposalCost_Alt") || 0;
    return nonNegative(assertFinite(matCost_Alt + processingCost_Alt + lifecycleMaint_Alt + disposalCost_Alt));
  },
  },
  {
    id: "user.material_replacement_cost_2",
    family: "cost",
    label: "Malzeme Replacement Maliyet — WeightSavings",
    fn: (inputs) => {
    const weight = num(inputs, "weight");
    const Current = num(inputs, "Current");
    const Alt = num(inputs, "Alt");
    const weight_Current = num(inputs, "weight_Current") || 0;
    const weight_Alt = num(inputs, "weight_Alt") || 0;
    return nonNegative(assertFinite(weight_Current - weight_Alt));
  },
  },
  {
    id: "user.material_replacement_cost_3",
    family: "cost",
    label: "Malzeme Replacement Maliyet — FuelSavings",
    fn: (inputs) => {
    const weightSavings = num(inputs, "weightSavings");
    const fuelFactor = num(inputs, "fuelFactor");
    const lifecycleDistance = num(inputs, "lifecycleDistance");
    const fuelPrice = num(inputs, "fuelPrice");
    return nonNegative(assertFinite(weightSavings * fuelFactor * lifecycleDistance * fuelPrice));
  },
  },
  {
    id: "user.material_replacement_cost_4",
    family: "cost",
    label: "Malzeme Replacement Maliyet — NetBenefit",
    fn: (inputs) => {
    const tCO = num(inputs, "tCO");
    const Current = num(inputs, "Current");
    const Alternative = num(inputs, "Alternative");
    const fuelSavings = num(inputs, "fuelSavings");
    const qualityPremium = num(inputs, "qualityPremium");
    const tCO_Current = num(inputs, "tCO_Current") || 0;
    const tCO_Alternative = num(inputs, "tCO_Alternative") || 0;
    return nonNegative(assertFinite(tCO_Current - tCO_Alternative + fuelSavings + qualityPremium));
  },
  },
  {
    id: "user.material_replacement_cost_5",
    family: "cost",
    label: "Malzeme Replacement Maliyet — Payback",
    fn: (inputs) => {
    const toolingCost = num(inputs, "toolingCost");
    const Alt = num(inputs, "Alt");
    const qualificationCost = num(inputs, "qualificationCost");
    const annualNetBenefit = num(inputs, "annualNetBenefit");
    const toolingCost_Alt = num(inputs, "toolingCost_Alt") || 0;
    return nonNegative(assertFinite((toolingCost_Alt + qualificationCost) / annualNetBenefit));
  },
  },

  // ── MOQ Stok Denge (6 formulas) ──,
  {
    id: "user.moq_stock_balance_0",
    family: "cost",
    label: "MOQ Stok Denge — EOQ",
    fn: (inputs) => {
    const annualDemand = num(inputs, "annualDemand");
    const orderCost = num(inputs, "orderCost");
    const holdingCost = num(inputs, "holdingCost");
    const sqrt = num(inputs, "sqrt") || 0;
    return nonNegative(assertFinite(Math.sqrt((2 * annualDemand * orderCost) / holdingCost)));
  },
  }
];
