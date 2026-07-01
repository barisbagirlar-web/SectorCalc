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
export const CHUNK_60_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.textile_waste_risk_2",
    family: "cost",
    label: "Tekstil Atigi Risk Assessmentsi — FinancialLoss",
    fn: (inputs) => {
    const preConsumerWaste = num(inputs, "preConsumerWaste");
    const fabricCostPerKg = num(inputs, "fabricCostPerKg");
    const processingCost = num(inputs, "processingCost");
    return nonNegative(assertFinite(preConsumerWaste * fabricCostPerKg + processingCost));
  },
  },
  {
    id: "user.textile_waste_risk_3",
    family: "cost",
    label: "Tekstil Atigi Risk Assessmentsi — DisposalCost",
    fn: (inputs) => {
    const wasteWeight = num(inputs, "wasteWeight");
    const landfillFee = num(inputs, "landfillFee");
    return nonNegative(assertFinite(wasteWeight * landfillFee));
  },
  },
  {
    id: "user.textile_waste_risk_4",
    family: "cost",
    label: "Tekstil Atigi Risk Assessmentsi — CircularRevenue",
    fn: (inputs) => {
    const recycledWasteWeight = num(inputs, "recycledWasteWeight");
    const scrapValue = num(inputs, "scrapValue");
    return nonNegative(assertFinite(recycledWasteWeight * scrapValue));
  },
  },
  {
    id: "user.textile_waste_risk_5",
    family: "cost",
    label: "Tekstil Atigi Risk Assessmentsi — NetWasteCost",
    fn: (inputs) => {
    const financialLoss = num(inputs, "financialLoss");
    const disposalCost = num(inputs, "disposalCost");
    const circularRevenue = num(inputs, "circularRevenue");
    return nonNegative(assertFinite(financialLoss + disposalCost - circularRevenue));
  },
  },
  {
    id: "user.textile_waste_risk_6",
    family: "cost",
    label: "Tekstil Atigi Risk Assessmentsi — RiskScore",
    fn: (inputs) => {
    const netWasteCost = num(inputs, "netWasteCost");
    const totalRevenue = num(inputs, "totalRevenue");
    return nonNegative(assertFinite(netWasteCost / totalRevenue));
  },
  },

  // ── Temizlik Teklifi Optimize Edici (7 formulas) ──,
  {
    id: "user.cleaning_bid_optimizer_0",
    family: "cost",
    label: "Temizlik Teklifi Optimize Edici — AreaToClean",
    fn: (inputs) => {
    const totalSqM = num(inputs, "totalSqM");
    const cleanablePct = num(inputs, "cleanablePct");
    return nonNegative(assertFinite(totalSqM * cleanablePct));
  },
  },
  {
    id: "user.cleaning_bid_optimizer_1",
    family: "cost",
    label: "Temizlik Teklifi Optimize Edici — LaborHours",
    fn: (inputs) => {
    const areaToClean = num(inputs, "areaToClean");
    const productionRatePerHour = num(inputs, "productionRatePerHour");
    return nonNegative(assertFinite(areaToClean / productionRatePerHour));
  },
  },
  {
    id: "user.cleaning_bid_optimizer_2",
    family: "cost",
    label: "Temizlik Teklifi Optimize Edici — LaborCost",
    fn: (inputs) => {
    const laborHours = num(inputs, "laborHours");
    const hourlyWage = num(inputs, "hourlyWage");
    const burden = num(inputs, "burden");
    return nonNegative(assertFinite(laborHours * hourlyWage * (1 + burden)));
  },
  },
  {
    id: "user.cleaning_bid_optimizer_3",
    family: "cost",
    label: "Temizlik Teklifi Optimize Edici — MaterialCost",
    fn: (inputs) => {
    const areaToClean = num(inputs, "areaToClean");
    const consumableCostPerSqM = num(inputs, "consumableCostPerSqM");
    return nonNegative(assertFinite(areaToClean * consumableCostPerSqM));
  },
  },
  {
    id: "user.cleaning_bid_optimizer_4",
    family: "cost",
    label: "Temizlik Teklifi Optimize Edici — EquipmentCost",
    fn: (inputs) => {
    const machineHours = num(inputs, "machineHours");
    const depreciationRate = num(inputs, "depreciationRate");
    return nonNegative(assertFinite(machineHours * depreciationRate));
  },
  },
  {
    id: "user.cleaning_bid_optimizer_5",
    family: "cost",
    label: "Temizlik Teklifi Optimize Edici — Overhead",
    fn: (inputs) => {
    const laborCost = num(inputs, "laborCost");
    const materialCost = num(inputs, "materialCost");
    const overheadPct = num(inputs, "overheadPct");
    return nonNegative(assertFinite((laborCost + materialCost) * overheadPct));
  },
  },
  {
    id: "user.cleaning_bid_optimizer_6",
    family: "cost",
    label: "Temizlik Teklifi Optimize Edici — BidPrice",
    fn: (inputs) => {
    const laborCost = num(inputs, "laborCost");
    const materialCost = num(inputs, "materialCost");
    const equipmentCost = num(inputs, "equipmentCost");
    const overhead = num(inputs, "overhead");
    const targetMargin = num(inputs, "targetMargin");
    return nonNegative(assertFinite((laborCost + materialCost + equipmentCost + overhead) / (1 - targetMargin)));
  },
  },

  // ── Teslimat Maliyeti (6 formulas) ──,
  {
    id: "user.delivery_cost_0",
    family: "cost",
    label: "Teslimat Maliyeti — CostPerDrop",
    fn: (inputs) => {
    const totalRouteCost = num(inputs, "totalRouteCost");
    const numberOfDrops = num(inputs, "numberOfDrops");
    return nonNegative(assertFinite(totalRouteCost / numberOfDrops));
  },
  },
  {
    id: "user.delivery_cost_1",
    family: "cost",
    label: "Teslimat Maliyeti — CostPerKm",
    fn: (inputs) => {
    const totalRouteCost = num(inputs, "totalRouteCost");
    const totalDistance = num(inputs, "totalDistance");
    return nonNegative(assertFinite(totalRouteCost / totalDistance));
  },
  },
  {
    id: "user.delivery_cost_2",
    family: "cost",
    label: "Teslimat Maliyeti — FailedDeliveryCost",
    fn: (inputs) => {
    const failedDrops = num(inputs, "failedDrops");
    const returnFreight = num(inputs, "returnFreight");
    const restockingFee = num(inputs, "restockingFee");
    const adminCost = num(inputs, "adminCost");
    return nonNegative(assertFinite(failedDrops * (returnFreight + restockingFee + adminCost)));
  },
  }
];
