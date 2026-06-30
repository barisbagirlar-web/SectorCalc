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
export const CHUNK_54_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.irrigation_cost_check_0",
    family: "cost",
    label: "Sulama Maliyet Check — WaterRequirement",
    fn: (inputs) => {
    const eTc = num(inputs, "eTc");
    const area = num(inputs, "area");
    const effectiveRainfall = num(inputs, "effectiveRainfall");
    return nonNegative(assertFinite(eTc * area * (1 - effectiveRainfall)));
  },
  },
  {
    id: "user.irrigation_cost_check_1",
    family: "cost",
    label: "Sulama Maliyet Check — PumpEnergy",
    fn: (inputs) => {
    const waterRequirement = num(inputs, "waterRequirement");
    const totalHead = num(inputs, "totalHead");
    const pumpEff = num(inputs, "pumpEff");
    const motorEff = num(inputs, "motorEff");
    return nonNegative(assertFinite((waterRequirement * totalHead) / (pumpEff * motorEff)));
  },
  },
  {
    id: "user.irrigation_cost_check_2",
    family: "cost",
    label: "Sulama Maliyet Check — EnergyCost",
    fn: (inputs) => {
    const pumpEnergy = num(inputs, "pumpEnergy");
    const elecRate = num(inputs, "elecRate");
    return nonNegative(assertFinite(pumpEnergy * elecRate));
  },
  },
  {
    id: "user.irrigation_cost_check_3",
    family: "cost",
    label: "Sulama Maliyet Check — MaintCost",
    fn: (inputs) => {
    const area = num(inputs, "area");
    const maintRatePerHa = num(inputs, "maintRatePerHa");
    return nonNegative(assertFinite(area * maintRatePerHa));
  },
  },
  {
    id: "user.irrigation_cost_check_4",
    family: "cost",
    label: "Sulama Maliyet Check — TotalIrrigationCost",
    fn: (inputs) => {
    const energyCost = num(inputs, "energyCost");
    const maintCost = num(inputs, "maintCost");
    const laborCost = num(inputs, "laborCost");
    const depreciation = num(inputs, "depreciation");
    return nonNegative(assertFinite(energyCost + maintCost + laborCost + depreciation));
  },
  },
  {
    id: "user.irrigation_cost_check_5",
    family: "cost",
    label: "Sulama Maliyet Check — CostPerM3",
    fn: (inputs) => {
    const totalIrrigationCost = num(inputs, "totalIrrigationCost");
    const waterRequirement = num(inputs, "waterRequirement");
    return nonNegative(assertFinite(totalIrrigationCost / waterRequirement));
  },
  },
  {
    id: "user.irrigation_cost_check_6",
    family: "cost",
    label: "Sulama Maliyet Check — WaterUseEfficiency",
    fn: (inputs) => {
    const waterRequirement = num(inputs, "waterRequirement");
    const losses = num(inputs, "losses");
    return nonNegative(assertFinite((waterRequirement - losses) / waterRequirement));
  },
  },

  // ── Supplier Performans Tco (6 formulas) ──,
  {
    id: "user.supplier_performance_tco_0",
    family: "cost",
    label: "Supplier Performans Tco — TCO",
    fn: (inputs) => {
    const purchasePrice = num(inputs, "purchasePrice");
    const orderingCost = num(inputs, "orderingCost");
    const transportCost = num(inputs, "transportCost");
    const qualityCost = num(inputs, "qualityCost");
    const inventoryCost = num(inputs, "inventoryCost");
    const riskCost = num(inputs, "riskCost");
    return nonNegative(assertFinite(purchasePrice + orderingCost + transportCost + qualityCost + inventoryCost + riskCost));
  },
  },
  {
    id: "user.supplier_performance_tco_1",
    family: "cost",
    label: "Supplier Performans Tco — QualityCost",
    fn: (inputs) => {
    const defectRate = num(inputs, "defectRate");
    const annualVolume = num(inputs, "annualVolume");
    const costPerDefect = num(inputs, "costPerDefect");
    return nonNegative(assertFinite(defectRate * annualVolume * costPerDefect));
  },
  },
  {
    id: "user.supplier_performance_tco_2",
    family: "cost",
    label: "Supplier Performans Tco — InventoryCost",
    fn: (inputs) => {
    const avgLeadTime = num(inputs, "avgLeadTime");
    const safetyStockDays = num(inputs, "safetyStockDays");
    const dailyDemand = num(inputs, "dailyDemand");
    const holdingRate = num(inputs, "holdingRate");
    return nonNegative(assertFinite((avgLeadTime + safetyStockDays) * dailyDemand * holdingRate));
  },
  },
  {
    id: "user.supplier_performance_tco_3",
    family: "cost",
    label: "Supplier Performans Tco — RiskCost",
    fn: (inputs) => {
    const probabilityOfDisruption = num(inputs, "probabilityOfDisruption");
    const impactCost = num(inputs, "impactCost");
    return nonNegative(assertFinite(probabilityOfDisruption * impactCost));
  },
  },
  {
    id: "user.supplier_performance_tco_4",
    family: "cost",
    label: "Supplier Performans Tco — SupplierScore",
    fn: (inputs) => {
    const qualityWeight = num(inputs, "qualityWeight");
    const qualityScore = num(inputs, "qualityScore");
    const deliveryWeight = num(inputs, "deliveryWeight");
    const deliveryScore = num(inputs, "deliveryScore");
    const costWeight = num(inputs, "costWeight");
    const costScore = num(inputs, "costScore");
    return nonNegative(assertFinite((qualityWeight * qualityScore) + (deliveryWeight * deliveryScore) + (costWeight * costScore)));
  },
  },
  {
    id: "user.supplier_performance_tco_5",
    family: "cost",
    label: "Supplier Performans Tco — TCO_Variance",
    fn: (inputs) => {
    const tCO = num(inputs, "tCO");
    const Actual = num(inputs, "Actual");
    const Quoted = num(inputs, "Quoted");
    const tCO_Actual = num(inputs, "tCO_Actual") || 0;
    const tCO_Quoted = num(inputs, "tCO_Quoted") || 0;
    return nonNegative(assertFinite(tCO_Actual - tCO_Quoted));
  },
  },

  // ── Süt Kâr Dedektörü (7 formulas) ──,
  {
    id: "user.dairy_profit_detector_0",
    family: "cost",
    label: "Süt Kâr Dedektörü — FatCorrectedMilk",
    fn: (inputs) => {
    const milkYield = num(inputs, "milkYield");
    const fatYield = num(inputs, "fatYield");
    return nonNegative(assertFinite((0.4 * milkYield) + (15 * fatYield)));
  },
  },
  {
    id: "user.dairy_profit_detector_1",
    family: "cost",
    label: "Süt Kâr Dedektörü — ProteinCorrectedMilk",
    fn: (inputs) => {
    const milkYield = num(inputs, "milkYield");
    const proteinYield = num(inputs, "proteinYield");
    return nonNegative(assertFinite((0.337 * milkYield) + (11.6 * proteinYield)));
  },
  }
];
