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
export const CHUNK_58_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.transport_mode_risk_3",
    family: "cost",
    label: "Taşıma Mode Maliyet risk — TransitTimeCost",
    fn: (inputs) => {
    const transitDays = num(inputs, "transitDays");
    const inventoryCarryingCostPerDay = num(inputs, "inventoryCarryingCostPerDay");
    return nonNegative(assertFinite(transitDays * inventoryCarryingCostPerDay));
  },
  },
  {
    id: "user.transport_mode_risk_4",
    family: "cost",
    label: "Taşıma Mode Maliyet risk — RiskCost",
    fn: (inputs) => {
    const probabilityOfDamage = num(inputs, "probabilityOfDamage");
    const cargoValue = num(inputs, "cargoValue");
    const probabilityOfDelay = num(inputs, "probabilityOfDelay");
    const delayPenalty = num(inputs, "delayPenalty");
    return nonNegative(assertFinite(probabilityOfDamage * cargoValue + probabilityOfDelay * delayPenalty));
  },
  },
  {
    id: "user.transport_mode_risk_5",
    family: "cost",
    label: "Taşıma Mode Maliyet risk — TotalModeCost",
    fn: (inputs) => {
    const transportCost = num(inputs, "transportCost");
    const transitTimeCost = num(inputs, "transitTimeCost");
    const riskCost = num(inputs, "riskCost");
    return nonNegative(assertFinite(transportCost + transitTimeCost + riskCost));
  },
  },
  {
    id: "user.transport_mode_risk_6",
    family: "cost",
    label: "Taşıma Mode Maliyet risk — ModeSelection",
    fn: (inputs) => {
    const totalModeCost = num(inputs, "totalModeCost");
    const Air = num(inputs, "Air");
    const Sea = num(inputs, "Sea");
    const Road = num(inputs, "Road");
    const min = num(inputs, "min") || 0;
    const totalModeCost_Air = num(inputs, "totalModeCost_Air") || 0;
    const totalModeCost_Sea = num(inputs, "totalModeCost_Sea") || 0;
    const totalModeCost_Road = num(inputs, "totalModeCost_Road") || 0;
    return nonNegative(assertFinite(Math.min(totalModeCost_Air, totalModeCost_Sea, totalModeCost_Road)));
  },
  },

  // ── Tedarik Zinciri Kesintisi Risk Değerlendirmesi (6 formulas) ──,
  {
    id: "user.supply_chain_disruption_0",
    family: "cost",
    label: "Tedarik Zinciri Kesintisi Risk Değerlendirmesi — RiskExposure",
    fn: (inputs) => {
    const probabilityOfDisruption = num(inputs, "probabilityOfDisruption");
    const financialImpact = num(inputs, "financialImpact");
    return nonNegative(assertFinite(probabilityOfDisruption * financialImpact));
  },
  },
  {
    id: "user.supply_chain_disruption_1",
    family: "cost",
    label: "Tedarik Zinciri Kesintisi Risk Değerlendirmesi — TimeToRecover",
    fn: (inputs) => {
    const daysToRestoreFullCapacity = num(inputs, "daysToRestoreFullCapacity");
    return nonNegative(assertFinite(daysToRestoreFullCapacity));
  },
  },
  {
    id: "user.supply_chain_disruption_2",
    family: "cost",
    label: "Tedarik Zinciri Kesintisi Risk Değerlendirmesi — RevenueLoss",
    fn: (inputs) => {
    const dailyRevenue = num(inputs, "dailyRevenue");
    const timeToRecover = num(inputs, "timeToRecover");
    const bufferCapacityPct = num(inputs, "bufferCapacityPct");
    return nonNegative(assertFinite(dailyRevenue * timeToRecover * (1 - bufferCapacityPct)));
  },
  },
  {
    id: "user.supply_chain_disruption_3",
    family: "cost",
    label: "Tedarik Zinciri Kesintisi Risk Değerlendirmesi — MitigationCost",
    fn: (inputs) => {
    const dualSourcingPremium = num(inputs, "dualSourcingPremium");
    const safetyStockCarryingCost = num(inputs, "safetyStockCarryingCost");
    const insurancePremium = num(inputs, "insurancePremium");
    return nonNegative(assertFinite(dualSourcingPremium + safetyStockCarryingCost + insurancePremium));
  },
  },
  {
    id: "user.supply_chain_disruption_4",
    family: "cost",
    label: "Tedarik Zinciri Kesintisi Risk Değerlendirmesi — RiskAdjustedCost",
    fn: (inputs) => {
    const expectedAnnualLoss = num(inputs, "expectedAnnualLoss");
    const mitigationCost = num(inputs, "mitigationCost");
    return nonNegative(assertFinite(expectedAnnualLoss + mitigationCost));
  },
  },
  {
    id: "user.supply_chain_disruption_5",
    family: "cost",
    label: "Tedarik Zinciri Kesintisi Risk Değerlendirmesi — ResilienceIndex",
    fn: (inputs) => {
    const timeToRecover = num(inputs, "timeToRecover");
    const vulnerabilityScore = num(inputs, "vulnerabilityScore");
    return nonNegative(assertFinite(1 / (timeToRecover * vulnerabilityScore)));
  },
  },

  // ── Tedarikçi Döviz Kuru Riski (6 formulas) ──,
  {
    id: "user.supplier_currency_risk_0",
    family: "cost",
    label: "Tedarikçi Döviz Kuru Riski — Exposure",
    fn: (inputs) => {
    const contractValue = num(inputs, "contractValue");
    const unhedgedPct = num(inputs, "unhedgedPct");
    const contractValue_FC = num(inputs, "contractValue_FC") || 0;
    return nonNegative(assertFinite(contractValue_FC * unhedgedPct));
  },
  },
  {
    id: "user.supplier_currency_risk_1",
    family: "cost",
    label: "Tedarikçi Döviz Kuru Riski — ExpectedLoss",
    fn: (inputs) => {
    const exposure = num(inputs, "exposure");
    const forwardRate = num(inputs, "forwardRate");
    const expectedSpotRate = num(inputs, "expectedSpotRate");
    return nonNegative(assertFinite(exposure * (forwardRate - expectedSpotRate)));
  },
  },
  {
    id: "user.supplier_currency_risk_2",
    family: "cost",
    label: "Tedarikçi Döviz Kuru Riski — VaR",
    fn: (inputs) => {
    const exposure = num(inputs, "exposure");
    const volatility = num(inputs, "volatility");
    const z = num(inputs, "z");
    const Score = num(inputs, "Score");
    const timeHorizon = num(inputs, "timeHorizon");
    const z_Score = num(inputs, "z_Score") || 0;
    const sqrt = num(inputs, "sqrt") || 0;
    return nonNegative(assertFinite(exposure * volatility * z_Score * Math.sqrt(timeHorizon)));
  },
  },
  {
    id: "user.supplier_currency_risk_3",
    family: "cost",
    label: "Tedarikçi Döviz Kuru Riski — HedgingCost",
    fn: (inputs) => {
    const exposure = num(inputs, "exposure");
    const forwardRate = num(inputs, "forwardRate");
    const spotRate = num(inputs, "spotRate");
    return nonNegative(assertFinite(exposure * (forwardRate - spotRate)));
  },
  },
  {
    id: "user.supplier_currency_risk_4",
    family: "cost",
    label: "Tedarikçi Döviz Kuru Riski — NetRiskCost",
    fn: (inputs) => {
    const expectedLoss = num(inputs, "expectedLoss");
    const hedgingCost = num(inputs, "hedgingCost");
    return nonNegative(assertFinite(expectedLoss + hedgingCost));
  },
  }
];
