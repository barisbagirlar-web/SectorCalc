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
export const CHUNK_53_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.inventory_turnover_risk_0",
    family: "cost",
    label: "Stok Devir hizi risk — InventoryTurnover",
    fn: (inputs) => {
    const cOGS = num(inputs, "cOGS");
    const averageInventory = num(inputs, "averageInventory");
    return nonNegative(assertFinite(cOGS / averageInventory));
  },
  },
  {
    id: "user.inventory_turnover_risk_1",
    family: "cost",
    label: "Stok Devir hizi risk — DaysSalesInventory",
    fn: (inputs) => {
    const inventoryTurnover = num(inputs, "inventoryTurnover");
    return nonNegative(assertFinite(365 / inventoryTurnover));
  },
  },
  {
    id: "user.inventory_turnover_risk_2",
    family: "cost",
    label: "Stok Devir hizi risk — ObsolescenceRisk",
    fn: (inputs) => {
    const agingBracket = num(inputs, "agingBracket");
    const i = num(inputs, "i");
    const obsolescenceRate = num(inputs, "obsolescenceRate");
    const inventoryValue = num(inputs, "inventoryValue");
    const agingBracket_i = num(inputs, "agingBracket_i") || 0;
    const obsolescenceRate_i = num(inputs, "obsolescenceRate_i") || 0;
    const inventoryValue_i = num(inputs, "inventoryValue_i") || 0;
    return nonNegative(assertFinite(SUM(agingBracket_i * obsolescenceRate_i * inventoryValue_i)));
  },
  },
  {
    id: "user.inventory_turnover_risk_3",
    family: "cost",
    label: "Stok Devir hizi risk — CarryingCost",
    fn: (inputs) => {
    const averageInventory = num(inputs, "averageInventory");
    const wACC = num(inputs, "wACC");
    const storage = num(inputs, "storage");
    const insurance = num(inputs, "insurance");
    const obsolescence = num(inputs, "obsolescence");
    return nonNegative(assertFinite(averageInventory * (wACC + storage + insurance + obsolescence)));
  },
  },
  {
    id: "user.inventory_turnover_risk_4",
    family: "cost",
    label: "Stok Devir hizi risk — OptimalTurnover",
    fn: (inputs) => {
    const industryBenchmark = num(inputs, "industryBenchmark");
    const adjustmentFactor = num(inputs, "adjustmentFactor");
    return nonNegative(assertFinite(industryBenchmark * adjustmentFactor));
  },
  },
  {
    id: "user.inventory_turnover_risk_5",
    family: "cost",
    label: "Stok Devir hizi risk — StockoutRisk",
    fn: (inputs) => {
    const turnover = num(inputs, "turnover");
    const maxThreshold = num(inputs, "maxThreshold");
    const high = num(inputs, "high");
    const low = num(inputs, "low");
    return nonNegative(assertFinite(((turnover > maxThreshold) ? (high) : (low))));
  },
  },
  {
    id: "user.inventory_turnover_risk_6",
    family: "cost",
    label: "Stok Devir hizi risk — LiquidationLoss",
    fn: (inputs) => {
    const slowMovingInventory = num(inputs, "slowMovingInventory");
    const salvageValuePct = num(inputs, "salvageValuePct");
    return nonNegative(assertFinite(slowMovingInventory * (1 - salvageValuePct)));
  },
  },

  // ── Su Kullanimi Optimize Edici (8 formulas) ──,
  {
    id: "user.water_usage_optimizer_0",
    family: "cost",
    label: "Su Kullanimi Optimize Edici — WaterIntensity",
    fn: (inputs) => {
    const totalWaterConsumed = num(inputs, "totalWaterConsumed");
    const productionVolume = num(inputs, "productionVolume");
    return nonNegative(assertFinite(totalWaterConsumed / productionVolume));
  },
  },
  {
    id: "user.water_usage_optimizer_1",
    family: "cost",
    label: "Su Kullanimi Optimize Edici — BaselineConsumption",
    fn: (inputs) => {
    const historicalAvg = num(inputs, "historicalAvg");
    const productionVolume = num(inputs, "productionVolume");
    return nonNegative(assertFinite(historicalAvg * productionVolume));
  },
  },
  {
    id: "user.water_usage_optimizer_2",
    family: "cost",
    label: "Su Kullanimi Optimize Edici — WaterSavings",
    fn: (inputs) => {
    const baselineConsumption = num(inputs, "baselineConsumption");
    const actualConsumption = num(inputs, "actualConsumption");
    return nonNegative(assertFinite(baselineConsumption - actualConsumption));
  },
  },
  {
    id: "user.water_usage_optimizer_3",
    family: "cost",
    label: "Su Kullanimi Optimize Edici — CostSavings",
    fn: (inputs) => {
    const waterSavings = num(inputs, "waterSavings");
    const waterSupplyRate = num(inputs, "waterSupplyRate");
    const wastewaterTreatmentRate = num(inputs, "wastewaterTreatmentRate");
    return nonNegative(assertFinite(waterSavings * (waterSupplyRate + wastewaterTreatmentRate)));
  },
  },
  {
    id: "user.water_usage_optimizer_4",
    family: "cost",
    label: "Su Kullanimi Optimize Edici — RecycleRate",
    fn: (inputs) => {
    const recycledWater = num(inputs, "recycledWater");
    const totalWaterConsumed = num(inputs, "totalWaterConsumed");
    return nonNegative(assertFinite(recycledWater / totalWaterConsumed));
  },
  },
  {
    id: "user.water_usage_optimizer_5",
    family: "cost",
    label: "Su Kullanimi Optimize Edici — LeakLoss",
    fn: (inputs) => {
    const totalSupplied = num(inputs, "totalSupplied");
    const totalMetered = num(inputs, "totalMetered");
    return nonNegative(assertFinite(totalSupplied - totalMetered));
  },
  },
  {
    id: "user.water_usage_optimizer_6",
    family: "cost",
    label: "Su Kullanimi Optimize Edici — ROI_Water",
    fn: (inputs) => {
    const costSavings = num(inputs, "costSavings");
    const equipmentCost = num(inputs, "equipmentCost");
    const installationCost = num(inputs, "installationCost");
    return nonNegative(assertFinite(costSavings / (equipmentCost + installationCost)));
  },
  },
  {
    id: "user.water_usage_optimizer_7",
    family: "cost",
    label: "Su Kullanimi Optimize Edici — CarbonFootprint_Water",
    fn: (inputs) => {
    const totalConsumed = num(inputs, "totalConsumed");
    const energyIntensity = num(inputs, "energyIntensity");
    const Water = num(inputs, "Water");
    const gridEmissionFactor = num(inputs, "gridEmissionFactor");
    const energyIntensity_Water = num(inputs, "energyIntensity_Water") || 0;
    return nonNegative(assertFinite(totalConsumed * energyIntensity_Water * gridEmissionFactor));
  },
  },

  // ── Sulama Maliyet Check (7 formulas) ──
];
