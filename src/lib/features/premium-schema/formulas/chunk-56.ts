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
export const CHUNK_56_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.tool_wear_cost_3",
    family: "cost",
    label: "Takim Asinma Maliyeti — WearRate",
    fn: (inputs) => {
    const flankWear = num(inputs, "flankWear");
    const machiningTime = num(inputs, "machiningTime");
    return nonNegative(assertFinite(flankWear / machiningTime));
  },
  },
  {
    id: "user.tool_wear_cost_4",
    family: "cost",
    label: "Takim Asinma Maliyeti — OptimalToolLife",
    fn: (inputs) => {
    const n = num(inputs, "n");
    const toolChangeTime = num(inputs, "toolChangeTime");
    const insertCost = num(inputs, "insertCost");
    const edges = num(inputs, "edges");
    const machineRate = num(inputs, "machineRate");
    return nonNegative(assertFinite(((1/n - 1) * (toolChangeTime + insertCost/edges / machineRate))));
  },
  },
  {
    id: "user.tool_wear_cost_5",
    family: "cost",
    label: "Takim Asinma Maliyeti — CostOfPrematureFailure",
    fn: (inputs) => {
    const expectedLife = num(inputs, "expectedLife");
    const actualLife = num(inputs, "actualLife");
    const insertCost = num(inputs, "insertCost");
    return nonNegative(assertFinite((expectedLife - actualLife) / expectedLife * insertCost));
  },
  },

  // ── Takt Sure Flexibility Maliyet (6 formulas) ──,
  {
    id: "user.takt_time_flexibility_0",
    family: "cost",
    label: "Takt Sure Flexibility Maliyet — TaktTime",
    fn: (inputs) => {
    const availableTime = num(inputs, "availableTime");
    const customerDemand = num(inputs, "customerDemand");
    return nonNegative(assertFinite(availableTime / customerDemand));
  },
  },
  {
    id: "user.takt_time_flexibility_1",
    family: "cost",
    label: "Takt Sure Flexibility Maliyet — CycleTimeFlexibility",
    fn: (inputs) => {
    const cycleTime = num(inputs, "cycleTime");
    const i = num(inputs, "i");
    const max = num(inputs, "max") || 0;
    const cycleTime_i = num(inputs, "cycleTime_i") || 0;
    const min = num(inputs, "min") || 0;
    return nonNegative(assertFinite(Math.max(cycleTime_i) - Math.min(cycleTime_i)));
  },
  },
  {
    id: "user.takt_time_flexibility_2",
    family: "cost",
    label: "Takt Sure Flexibility Maliyet — BalanceLoss",
    fn: (inputs) => {
    const taktTime = num(inputs, "taktTime");
    const cycleTime = num(inputs, "cycleTime");
    const i = num(inputs, "i");
    const laborRate = num(inputs, "laborRate");
    const cycleTime_i = num(inputs, "cycleTime_i") || 0;
    return nonNegative(assertFinite(SUM(taktTime - cycleTime_i) * laborRate));
  },
  },
  {
    id: "user.takt_time_flexibility_3",
    family: "cost",
    label: "Takt Sure Flexibility Maliyet — CrossTrainingCost",
    fn: (inputs) => {
    const operators = num(inputs, "operators");
    const trainingHours = num(inputs, "trainingHours");
    const trainerRate = num(inputs, "trainerRate");
    return nonNegative(assertFinite(operators * trainingHours * trainerRate));
  },
  },
  {
    id: "user.takt_time_flexibility_4",
    family: "cost",
    label: "Takt Sure Flexibility Maliyet — FlexibilityPremium",
    fn: (inputs) => {
    const crossTrainingCost = num(inputs, "crossTrainingCost");
    const annualProduction = num(inputs, "annualProduction");
    return nonNegative(assertFinite(crossTrainingCost / annualProduction));
  },
  },
  {
    id: "user.takt_time_flexibility_5",
    family: "cost",
    label: "Takt Sure Flexibility Maliyet — VolumeVariationCost",
    fn: (inputs) => {
    const demand = num(inputs, "demand");
    const capacity = num(inputs, "capacity");
    const overtimeRate = num(inputs, "overtimeRate");
    const idleLaborCost = num(inputs, "idleLaborCost");
    return nonNegative(assertFinite(((demand > capacity) ? ((demand - capacity) * overtimeRate) : ((capacity - demand)) * idleLaborCost)));
  },
  },

  // ── talep Forecast Stok Maliyet (5 formulas) ──,
  {
    id: "user.demand_forecast_stock_0",
    family: "cost",
    label: "talep Forecast Stok Maliyet — ForecastError",
    fn: (inputs) => {
    const actualDemand = num(inputs, "actualDemand");
    const forecastDemand = num(inputs, "forecastDemand");
    const abs = num(inputs, "abs") || 0;
    return nonNegative(assertFinite(Math.abs(actualDemand - forecastDemand) / actualDemand));
  },
  },
  {
    id: "user.demand_forecast_stock_1",
    family: "cost",
    label: "talep Forecast Stok Maliyet — SafetyStock",
    fn: (inputs) => {
    const z = num(inputs, "z");
    const Score = num(inputs, "Score");
    const stdDev = num(inputs, "stdDev");
    const ForecastError = num(inputs, "ForecastError");
    const leadTime = num(inputs, "leadTime");
    const z_Score = num(inputs, "z_Score") || 0;
    const stdDev_ForecastError = num(inputs, "stdDev_ForecastError") || 0;
    const sqrt = num(inputs, "sqrt") || 0;
    return nonNegative(assertFinite(z_Score * stdDev_ForecastError * Math.sqrt(leadTime)));
  },
  },
  {
    id: "user.demand_forecast_stock_2",
    family: "cost",
    label: "talep Forecast Stok Maliyet — CarryingCost_Safety",
    fn: (inputs) => {
    const safetyStock = num(inputs, "safetyStock");
    const unitCost = num(inputs, "unitCost");
    const holdingRate = num(inputs, "holdingRate");
    return nonNegative(assertFinite(safetyStock * unitCost * holdingRate));
  },
  },
  {
    id: "user.demand_forecast_stock_3",
    family: "cost",
    label: "talep Forecast Stok Maliyet — StockoutCost",
    fn: (inputs) => {
    const actualDemand = num(inputs, "actualDemand");
    const forecastDemand = num(inputs, "forecastDemand");
    const safetyStock = num(inputs, "safetyStock");
    const penaltyCost = num(inputs, "penaltyCost");
    return nonNegative(assertFinite(((actualDemand > (forecastDemand + safetyStock)) ? ((actualDemand - forecastDemand - safetyStock) * penaltyCost) : (0))));
  },
  },
  {
    id: "user.demand_forecast_stock_4",
    family: "cost",
    label: "talep Forecast Stok Maliyet — TotalForecastCost",
    fn: (inputs) => {
    const carryingCost = num(inputs, "carryingCost");
    const Safety = num(inputs, "Safety");
    const stockoutCost = num(inputs, "stockoutCost");
    const forecastingSystemCost = num(inputs, "forecastingSystemCost");
    const carryingCost_Safety = num(inputs, "carryingCost_Safety") || 0;
    return nonNegative(assertFinite(carryingCost_Safety + stockoutCost + forecastingSystemCost));
  },
  },

  // ── Tamirhane Parca ve Iscilik Teklif (7 formulas) ──,
  {
    id: "user.repair_shop_quote_0",
    family: "cost",
    label: "Tamirhane Parca ve Iscilik Teklif — PartCost",
    fn: (inputs) => {
    const quantity = num(inputs, "quantity");
    const i = num(inputs, "i");
    const dealerPrice = num(inputs, "dealerPrice");
    const quantity_i = num(inputs, "quantity_i") || 0;
    const dealerPrice_i = num(inputs, "dealerPrice_i") || 0;
    return nonNegative(assertFinite(SUM(quantity_i * dealerPrice_i)));
  },
  }
];
