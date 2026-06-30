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
export const CHUNK_55_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.dairy_profit_detector_2",
    family: "cost",
    label: "Süt Kâr Dedektörü — FeedCostPerLiter",
    fn: (inputs) => {
    const totalFeedCost = num(inputs, "totalFeedCost");
    const milkYield = num(inputs, "milkYield");
    return nonNegative(assertFinite(totalFeedCost / milkYield));
  },
  },
  {
    id: "user.dairy_profit_detector_3",
    family: "cost",
    label: "Süt Kâr Dedektörü — IncomeOverFeedCost",
    fn: (inputs) => {
    const milkPrice = num(inputs, "milkPrice");
    const milkYield = num(inputs, "milkYield");
    const totalFeedCost = num(inputs, "totalFeedCost");
    return nonNegative(assertFinite((milkPrice * milkYield) - totalFeedCost));
  },
  },
  {
    id: "user.dairy_profit_detector_4",
    family: "cost",
    label: "Süt Kâr Dedektörü — MarginPerCow",
    fn: (inputs) => {
    const incomeOverFeedCost = num(inputs, "incomeOverFeedCost");
    const vetCost = num(inputs, "vetCost");
    const breedingCost = num(inputs, "breedingCost");
    const laborCost = num(inputs, "laborCost");
    return nonNegative(assertFinite(incomeOverFeedCost - (vetCost + breedingCost + laborCost)));
  },
  },
  {
    id: "user.dairy_profit_detector_5",
    family: "cost",
    label: "Süt Kâr Dedektörü — HerdProfitability",
    fn: (inputs) => {
    const marginPerCow = num(inputs, "marginPerCow");
    const fixedOverhead = num(inputs, "fixedOverhead");
    return nonNegative(assertFinite(SUM(marginPerCow) - fixedOverhead));
  },
  },
  {
    id: "user.dairy_profit_detector_6",
    family: "cost",
    label: "Süt Kâr Dedektörü — SomaticCellPenalty",
    fn: (inputs) => {
    const sCC = num(inputs, "sCC");
    const threshold = num(inputs, "threshold");
    const milkYield = num(inputs, "milkYield");
    const penaltyRate = num(inputs, "penaltyRate");
    return nonNegative(assertFinite(((sCC > threshold) ? (milkYield * penaltyRate) : (0))));
  },
  },

  // ── Taguchi kalite kayıp Fonksiyon (7 formulas) ──,
  {
    id: "user.taguchi_quality_loss_0",
    family: "cost",
    label: "Taguchi kalite kayıp Fonksiyon — LossPerUnit",
    fn: (inputs) => {
    const k = num(inputs, "k");
    const actualValue = num(inputs, "actualValue");
    const targetValue = num(inputs, "targetValue");
    return nonNegative(assertFinite(k * (actualValue - targetValue)**2));
  },
  },
  {
    id: "user.taguchi_quality_loss_1",
    family: "cost",
    label: "Taguchi kalite kayıp Fonksiyon — k",
    fn: (inputs) => {
    const costAtTolerance = num(inputs, "costAtTolerance");
    const tolerance = num(inputs, "tolerance");
    return nonNegative(assertFinite(costAtTolerance / tolerance**2));
  },
  },
  {
    id: "user.taguchi_quality_loss_2",
    family: "cost",
    label: "Taguchi kalite kayıp Fonksiyon — AverageLoss",
    fn: (inputs) => {
    const k = num(inputs, "k");
    const variance = num(inputs, "variance");
    const mean = num(inputs, "mean");
    const target = num(inputs, "target");
    return nonNegative(assertFinite(k * (variance + (mean - target)**2)));
  },
  },
  {
    id: "user.taguchi_quality_loss_3",
    family: "cost",
    label: "Taguchi kalite kayıp Fonksiyon — TotalAnnualLoss",
    fn: (inputs) => {
    const averageLoss = num(inputs, "averageLoss");
    const annualProduction = num(inputs, "annualProduction");
    return nonNegative(assertFinite(averageLoss * annualProduction));
  },
  },
  {
    id: "user.taguchi_quality_loss_4",
    family: "cost",
    label: "Taguchi kalite kayıp Fonksiyon — SignalToNoise_LargerBetter",
    fn: (inputs) => {
    const y = num(inputs, "y");
    const i = num(inputs, "i");
    const n = num(inputs, "n");
    const log10 = num(inputs, "log10") || 0;
    const y_i = num(inputs, "y_i") || 0;
    return nonNegative(assertFinite(-10 * Math.log10(SUM(1/y_i**2) / n)));
  },
  },
  {
    id: "user.taguchi_quality_loss_5",
    family: "cost",
    label: "Taguchi kalite kayıp Fonksiyon — SignalToNoise_SmallerBetter",
    fn: (inputs) => {
    const y = num(inputs, "y");
    const i = num(inputs, "i");
    const n = num(inputs, "n");
    const log10 = num(inputs, "log10") || 0;
    const y_i = num(inputs, "y_i") || 0;
    return nonNegative(assertFinite(-10 * Math.log10(SUM(y_i**2) / n)));
  },
  },
  {
    id: "user.taguchi_quality_loss_6",
    family: "cost",
    label: "Taguchi kalite kayıp Fonksiyon — QualityImprovementSavings",
    fn: (inputs) => {
    const oldAverageLoss = num(inputs, "oldAverageLoss");
    const newAverageLoss = num(inputs, "newAverageLoss");
    const annualProduction = num(inputs, "annualProduction");
    return nonNegative(assertFinite((oldAverageLoss - newAverageLoss) * annualProduction));
  },
  },

  // ── Takım Aşınma Maliyeti (6 formulas) ──,
  {
    id: "user.tool_wear_cost_0",
    family: "cost",
    label: "Takım Aşınma Maliyeti — ToolCostPerPart",
    fn: (inputs) => {
    const insertCost = num(inputs, "insertCost");
    const edges = num(inputs, "edges");
    const machiningTime = num(inputs, "machiningTime");
    const toolLife = num(inputs, "toolLife");
    return nonNegative(assertFinite((insertCost / edges) * (machiningTime / toolLife)));
  },
  },
  {
    id: "user.tool_wear_cost_1",
    family: "cost",
    label: "Takım Aşınma Maliyeti — ChangeCostPerPart",
    fn: (inputs) => {
    const toolChangeTime = num(inputs, "toolChangeTime");
    const machineRate = num(inputs, "machineRate");
    const machiningTime = num(inputs, "machiningTime");
    const toolLife = num(inputs, "toolLife");
    return nonNegative(assertFinite((toolChangeTime * machineRate) * (machiningTime / toolLife)));
  },
  },
  {
    id: "user.tool_wear_cost_2",
    family: "cost",
    label: "Takım Aşınma Maliyeti — TotalToolingCost",
    fn: (inputs) => {
    const toolCostPerPart = num(inputs, "toolCostPerPart");
    const changeCostPerPart = num(inputs, "changeCostPerPart");
    return nonNegative(assertFinite(toolCostPerPart + changeCostPerPart));
  },
  }
];
