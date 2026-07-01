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
export const CHUNK_62_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.total_employee_cost_5",
    family: "cost",
    label: "Toplam Calisan Maliyeti — TotalEmployeeCost",
    fn: (inputs) => {
    const grossSalary = num(inputs, "grossSalary");
    const statutoryCosts = num(inputs, "statutoryCosts");
    const benefits = num(inputs, "benefits");
    const absenteeismCost = num(inputs, "absenteeismCost");
    const turnoverCost = num(inputs, "turnoverCost");
    return nonNegative(assertFinite(grossSalary + statutoryCosts + benefits + absenteeismCost + turnoverCost));
  },
  },
  {
    id: "user.total_employee_cost_6",
    family: "cost",
    label: "Toplam Calisan Maliyeti — CostPerHour",
    fn: (inputs) => {
    const totalEmployeeCost = num(inputs, "totalEmployeeCost");
    const productiveHours = num(inputs, "productiveHours");
    return nonNegative(assertFinite(totalEmployeeCost / productiveHours));
  },
  },

  // ── Transfer Fiyatlandirmasi Optimize Edici (6 formulas) ──,
  {
    id: "user.transfer_pricing_optimizer_0",
    family: "cost",
    label: "Transfer Fiyatlandirmasi Optimize Edici — CostPlusPrice",
    fn: (inputs) => {
    const fullCost = num(inputs, "fullCost");
    const markupPct = num(inputs, "markupPct");
    return nonNegative(assertFinite(fullCost * (1 + markupPct)));
  },
  },
  {
    id: "user.transfer_pricing_optimizer_1",
    family: "cost",
    label: "Transfer Fiyatlandirmasi Optimize Edici — MarketBasedPrice",
    fn: (inputs) => {
    const comparableUncontrolledPrice = num(inputs, "comparableUncontrolledPrice");
    return nonNegative(assertFinite(comparableUncontrolledPrice));
  },
  },
  {
    id: "user.transfer_pricing_optimizer_2",
    family: "cost",
    label: "Transfer Fiyatlandirmasi Optimize Edici — MarginalCost",
    fn: (inputs) => {
    const variableCost = num(inputs, "variableCost");
    const opportunityCost = num(inputs, "opportunityCost");
    return nonNegative(assertFinite(variableCost + opportunityCost));
  },
  },
  {
    id: "user.transfer_pricing_optimizer_3",
    family: "cost",
    label: "Transfer Fiyatlandirmasi Optimize Edici — TaxImpact",
    fn: (inputs) => {
    const transferPrice = num(inputs, "transferPrice");
    const armLengthPrice = num(inputs, "armLengthPrice");
    const taxRate = num(inputs, "taxRate");
    const High = num(inputs, "High");
    const Low = num(inputs, "Low");
    const taxRate_High = num(inputs, "taxRate_High") || 0;
    const taxRate_Low = num(inputs, "taxRate_Low") || 0;
    return nonNegative(assertFinite((transferPrice - armLengthPrice) * (taxRate_High - taxRate_Low)));
  },
  },
  {
    id: "user.transfer_pricing_optimizer_4",
    family: "cost",
    label: "Transfer Fiyatlandirmasi Optimize Edici — GlobalProfit",
    fn: (inputs) => {
    const revenue = num(inputs, "revenue");
    const Final = num(inputs, "Final");
    const cost = num(inputs, "cost");
    const Origin = num(inputs, "Origin");
    const Transfer = num(inputs, "Transfer");
    const taxImpact = num(inputs, "taxImpact");
    const revenue_Final = num(inputs, "revenue_Final") || 0;
    const cost_Origin = num(inputs, "cost_Origin") || 0;
    const cost_Transfer = num(inputs, "cost_Transfer") || 0;
    return nonNegative(assertFinite(revenue_Final - (cost_Origin + cost_Transfer + taxImpact)));
  },
  },
  {
    id: "user.transfer_pricing_optimizer_5",
    family: "cost",
    label: "Transfer Fiyatlandirmasi Optimize Edici — OptimalTransferPrice",
    fn: (inputs) => {
    return 0; // TransferPrice = Price that MAXIMIZES GlobalProfit subject to TaxRegulations — requires solver
  },
  },

  // ── urun Complexity Hidden Maliyet (6 formulas) ──,
  {
    id: "user.product_complexity_hidden_cost_0",
    family: "cost",
    label: "urun Complexity Hidden Maliyet — ComplexityIndex",
    fn: (inputs) => {
    const numberOfSKUs = num(inputs, "numberOfSKUs");
    const averageBOMDepth = num(inputs, "averageBOMDepth");
    return nonNegative(assertFinite(numberOfSKUs * averageBOMDepth));
  },
  },
  {
    id: "user.product_complexity_hidden_cost_1",
    family: "cost",
    label: "urun Complexity Hidden Maliyet — SetupCostComplexity",
    fn: (inputs) => {
    const changeovers = num(inputs, "changeovers");
    const setupCostPerChange = num(inputs, "setupCostPerChange");
    return nonNegative(assertFinite(changeovers * setupCostPerChange));
  },
  },
  {
    id: "user.product_complexity_hidden_cost_2",
    family: "cost",
    label: "urun Complexity Hidden Maliyet — InventoryCostComplexity",
    fn: (inputs) => {
    const safetyStock = num(inputs, "safetyStock");
    const AllSKUs = num(inputs, "AllSKUs");
    const holdingRate = num(inputs, "holdingRate");
    const safetyStock_AllSKUs = num(inputs, "safetyStock_AllSKUs") || 0;
    return nonNegative(assertFinite(safetyStock_AllSKUs * holdingRate));
  },
  },
  {
    id: "user.product_complexity_hidden_cost_3",
    family: "cost",
    label: "urun Complexity Hidden Maliyet — OverheadAllocation",
    fn: (inputs) => {
    const totalIndirectCosts = num(inputs, "totalIndirectCosts");
    const complexityDriverPct = num(inputs, "complexityDriverPct");
    return nonNegative(assertFinite(totalIndirectCosts * complexityDriverPct));
  },
  },
  {
    id: "user.product_complexity_hidden_cost_4",
    family: "cost",
    label: "urun Complexity Hidden Maliyet — HiddenCost",
    fn: (inputs) => {
    const setupCostComplexity = num(inputs, "setupCostComplexity");
    const inventoryCostComplexity = num(inputs, "inventoryCostComplexity");
    const overheadAllocation = num(inputs, "overheadAllocation");
    const traditionalOverhead = num(inputs, "traditionalOverhead");
    return nonNegative(assertFinite(setupCostComplexity + inventoryCostComplexity + (overheadAllocation - traditionalOverhead)));
  },
  },
  {
    id: "user.product_complexity_hidden_cost_5",
    family: "cost",
    label: "urun Complexity Hidden Maliyet — ProfitabilityPerSKU",
    fn: (inputs) => {
    const revenue = num(inputs, "revenue");
    const directCost = num(inputs, "directCost");
    const hiddenCost = num(inputs, "hiddenCost");
    const revenue_SKU = num(inputs, "revenue_SKU") || 0;
    const directCost_SKU = num(inputs, "directCost_SKU") || 0;
    const hiddenCost_SKU = num(inputs, "hiddenCost_SKU") || 0;
    return nonNegative(assertFinite((revenue_SKU - directCost_SKU - hiddenCost_SKU)));
  },
  },

  // ── Vakum Kacagi Enerji Loss (6 formulas) ──,
  {
    id: "user.vacuum_leak_energy_0",
    family: "cost",
    label: "Vakum Kacagi Enerji Loss — LeakRate",
    fn: (inputs) => {
    const volume = num(inputs, "volume");
    const deltaP = num(inputs, "deltaP");
    const deltaT = num(inputs, "deltaT");
    return nonNegative(assertFinite(volume * deltaP / deltaT));
  },
  }
];
