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
export const CHUNK_47_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.recipe_cost_check_1",
    family: "cost",
    label: "recete Maliyet Check - ActualCost",
    fn: (inputs) => {
    const totalMaterialConsumed = num(inputs, "totalMaterialConsumed");
    const avgPrice = num(inputs, "avgPrice");
    const totalOutput = num(inputs, "totalOutput");
    return nonNegative(assertFinite(totalMaterialConsumed * avgPrice / totalOutput));
  },
  },
  {
    id: "user.recipe_cost_check_2",
    family: "cost",
    label: "recete Maliyet Check - Variance",
    fn: (inputs) => {
    const actualCost = num(inputs, "actualCost");
    const theoreticalCost = num(inputs, "theoreticalCost");
    return nonNegative(assertFinite(actualCost - theoreticalCost));
  },
  },
  {
    id: "user.recipe_cost_check_3",
    family: "cost",
    label: "recete Maliyet Check - YieldLossCost",
    fn: (inputs) => {
    const actualYield = num(inputs, "actualYield");
    const theoreticalCost = num(inputs, "theoreticalCost");
    return nonNegative(assertFinite((1 - actualYield) * theoreticalCost));
  },
  },
  {
    id: "user.recipe_cost_check_4",
    family: "cost",
    label: "recete Maliyet Check - EvaporationLoss",
    fn: (inputs) => {
    const inputWeight = num(inputs, "inputWeight");
    const outputWeight = num(inputs, "outputWeight");
    const knownScrap = num(inputs, "knownScrap");
    return nonNegative(assertFinite(inputWeight - outputWeight - knownScrap));
  },
  },
  {
    id: "user.recipe_cost_check_5",
    family: "cost",
    label: "recete Maliyet Check - Efficiency",
    fn: (inputs) => {
    const actualOutput = num(inputs, "actualOutput");
    const theoreticalOutput = num(inputs, "theoreticalOutput");
    return nonNegative(assertFinite(actualOutput / theoreticalOutput));
  },
  },
  {
    id: "user.recipe_cost_check_6",
    family: "cost",
    label: "recete Maliyet Check - CostPerKg",
    fn: (inputs) => {
    const actualCost = num(inputs, "actualCost");
    const outputWeight = num(inputs, "outputWeight");
    return nonNegative(assertFinite(actualCost / outputWeight));
  },
  },

  // ── Restaurant Menu Marj Kacak (8 formulas) ──,
  {
    id: "user.restaurant_menu_margin_leak_0",
    family: "cost",
    label: "Restaurant Menu Marj Kacak - TheoreticalFoodCost",
    fn: (inputs) => {
    const itemsSold = num(inputs, "itemsSold");
    const i = num(inputs, "i");
    const portionCost = num(inputs, "portionCost");
    const itemsSold_i = num(inputs, "itemsSold_i") || 0;
    const portionCost_i = num(inputs, "portionCost_i") || 0;
    return nonNegative(assertFinite(SUM(itemsSold_i * portionCost_i)));
  },
  },
  {
    id: "user.restaurant_menu_margin_leak_1",
    family: "cost",
    label: "Restaurant Menu Marj Kacak - ActualFoodCost",
    fn: (inputs) => {
    const beginningInventory = num(inputs, "beginningInventory");
    const purchases = num(inputs, "purchases");
    const endingInventory = num(inputs, "endingInventory");
    return nonNegative(assertFinite(beginningInventory + purchases - endingInventory));
  },
  },
  {
    id: "user.restaurant_menu_margin_leak_2",
    family: "cost",
    label: "Restaurant Menu Marj Kacak - Variance",
    fn: (inputs) => {
    const actualFoodCost = num(inputs, "actualFoodCost");
    const theoreticalFoodCost = num(inputs, "theoreticalFoodCost");
    return nonNegative(assertFinite(actualFoodCost - theoreticalFoodCost));
  },
  },
  {
    id: "user.restaurant_menu_margin_leak_3",
    family: "cost",
    label: "Restaurant Menu Marj Kacak - VariancePct",
    fn: (inputs) => {
    const variance = num(inputs, "variance");
    const totalFoodSales = num(inputs, "totalFoodSales");
    return nonNegative(assertFinite(variance / totalFoodSales));
  },
  },
  {
    id: "user.restaurant_menu_margin_leak_4",
    family: "cost",
    label: "Restaurant Menu Marj Kacak - WasteCost",
    fn: (inputs) => {
    const recordedWaste = num(inputs, "recordedWaste");
    const avgPortionCost = num(inputs, "avgPortionCost");
    return nonNegative(assertFinite(recordedWaste * avgPortionCost));
  },
  },
  {
    id: "user.restaurant_menu_margin_leak_5",
    family: "cost",
    label: "Restaurant Menu Marj Kacak - TheftLoss",
    fn: (inputs) => {
    const variance = num(inputs, "variance");
    const wasteCost = num(inputs, "wasteCost");
    const compMeals = num(inputs, "compMeals");
    return nonNegative(assertFinite(variance - wasteCost - compMeals));
  },
  },
  {
    id: "user.restaurant_menu_margin_leak_6",
    family: "cost",
    label: "Restaurant Menu Marj Kacak - IdealMargin",
    fn: (inputs) => {
    const theoreticalFoodCost = num(inputs, "theoreticalFoodCost");
    const totalFoodSales = num(inputs, "totalFoodSales");
    return nonNegative(assertFinite(1 - (theoreticalFoodCost / totalFoodSales)));
  },
  },
  {
    id: "user.restaurant_menu_margin_leak_7",
    family: "cost",
    label: "Restaurant Menu Marj Kacak - ActualMargin",
    fn: (inputs) => {
    const actualFoodCost = num(inputs, "actualFoodCost");
    const totalFoodSales = num(inputs, "totalFoodSales");
    return nonNegative(assertFinite(1 - (actualFoodCost / totalFoodSales)));
  },
  },

  // ── Robot Kol vs. Manuel Isci (8 formulas) ──,
  {
    id: "user.robot_vs_manual_0",
    family: "cost",
    label: "Robot Kol vs. Manuel Isci - ManualCost_Annual",
    fn: (inputs) => {
    const operators = num(inputs, "operators");
    const hourlyRate = num(inputs, "hourlyRate");
    const hours = num(inputs, "hours");
    const burden = num(inputs, "burden");
    return nonNegative(assertFinite((operators * hourlyRate * hours) * (1 + burden)));
  },
  }
];
