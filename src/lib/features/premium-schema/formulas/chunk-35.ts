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
export const CHUNK_35_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.container_load_3",
    family: "cost",
    label: "Konteyner Yuku — LoadEfficiency",
    fn: (inputs) => {
    const volume = num(inputs, "volume");
    const Utilization = num(inputs, "Utilization");
    const weight = num(inputs, "weight");
    const min = num(inputs, "min") || 0;
    const volume_Utilization = num(inputs, "volume_Utilization") || 0;
    const weight_Utilization = num(inputs, "weight_Utilization") || 0;
    return nonNegative(assertFinite(Math.min(volume_Utilization, weight_Utilization)));
  },
  },
  {
    id: "user.container_load_4",
    family: "cost",
    label: "Konteyner Yuku — WastedSpaceCost",
    fn: (inputs) => {
    const loadEfficiency = num(inputs, "loadEfficiency");
    const freightCost = num(inputs, "freightCost");
    return nonNegative(assertFinite((1 - loadEfficiency) * freightCost));
  },
  },
  {
    id: "user.container_load_5",
    family: "cost",
    label: "Konteyner Yuku — PalletStacking",
    fn: (inputs) => {
    const containerHeight = num(inputs, "containerHeight");
    const palletHeight = num(inputs, "palletHeight");
    const floor = num(inputs, "floor") || 0;
    return nonNegative(assertFinite(Math.floor(containerHeight / palletHeight)));
  },
  },
  {
    id: "user.container_load_6",
    family: "cost",
    label: "Konteyner Yuku — MaxPallets",
    fn: (inputs) => {
    const palletStacking = num(inputs, "palletStacking");
    const floorArea = num(inputs, "floorArea");
    const Pallets = num(inputs, "Pallets");
    const weightLimit = num(inputs, "weightLimit");
    const palletWeight = num(inputs, "palletWeight");
    const min = num(inputs, "min") || 0;
    const floorArea_Pallets = num(inputs, "floorArea_Pallets") || 0;
    return nonNegative(assertFinite(Math.min(palletStacking * floorArea_Pallets, weightLimit / palletWeight)));
  },
  },

  // ── Kumas Kesim Optimize Edici (6 formulas) ──,
  {
    id: "user.fabric_cutting_optimizer_0",
    family: "cost",
    label: "Kumas Kesim Optimize Edici — MarkerEfficiency",
    fn: (inputs) => {
    const totalPatternArea = num(inputs, "totalPatternArea");
    const markerLength = num(inputs, "markerLength");
    const fabricWidth = num(inputs, "fabricWidth");
    return nonNegative(assertFinite((totalPatternArea / (markerLength * fabricWidth)) * 100));
  },
  },
  {
    id: "user.fabric_cutting_optimizer_1",
    family: "cost",
    label: "Kumas Kesim Optimize Edici — FabricRequired",
    fn: (inputs) => {
    const totalPatternArea = num(inputs, "totalPatternArea");
    const markerEfficiency = num(inputs, "markerEfficiency");
    const endLossPct = num(inputs, "endLossPct");
    return nonNegative(assertFinite((totalPatternArea / markerEfficiency) * (1 + endLossPct)));
  },
  },
  {
    id: "user.fabric_cutting_optimizer_2",
    family: "cost",
    label: "Kumas Kesim Optimize Edici — Cost_Fabric",
    fn: (inputs) => {
    const fabricRequired = num(inputs, "fabricRequired");
    const pricePerMeter = num(inputs, "pricePerMeter");
    return nonNegative(assertFinite(fabricRequired * pricePerMeter));
  },
  },
  {
    id: "user.fabric_cutting_optimizer_3",
    family: "cost",
    label: "Kumas Kesim Optimize Edici — Utilization_Gain",
    fn: (inputs) => {
    const newEfficiency = num(inputs, "newEfficiency");
    const oldEfficiency = num(inputs, "oldEfficiency");
    const fabricRequired = num(inputs, "fabricRequired");
    const pricePerMeter = num(inputs, "pricePerMeter");
    return nonNegative(assertFinite((newEfficiency - oldEfficiency) * fabricRequired * pricePerMeter));
  },
  },
  {
    id: "user.fabric_cutting_optimizer_4",
    family: "cost",
    label: "Kumas Kesim Optimize Edici — SplicingLoss",
    fn: (inputs) => {
    const splices = num(inputs, "splices");
    const overlapLength = num(inputs, "overlapLength");
    const fabricWidth = num(inputs, "fabricWidth");
    return nonNegative(assertFinite(splices * overlapLength * fabricWidth));
  },
  },
  {
    id: "user.fabric_cutting_optimizer_5",
    family: "cost",
    label: "Kumas Kesim Optimize Edici — TotalYardage",
    fn: (inputs) => {
    const markerLength = num(inputs, "markerLength");
    const endLoss = num(inputs, "endLoss");
    const splicingLoss = num(inputs, "splicingLoss");
    return nonNegative(assertFinite(markerLength + endLoss + splicingLoss));
  },
  },

  // ── Kur Riski (7 formulas) ──,
  {
    id: "user.currency_risk_0",
    family: "cost",
    label: "Kur Riski — Exposure_FC",
    fn: (inputs) => {
    const totalRevenue = num(inputs, "totalRevenue");
    const totalCost = num(inputs, "totalCost");
    const totalRevenue_FC = num(inputs, "totalRevenue_FC") || 0;
    const totalCost_FC = num(inputs, "totalCost_FC") || 0;
    return nonNegative(assertFinite(totalRevenue_FC - totalCost_FC));
  },
  },
  {
    id: "user.currency_risk_1",
    family: "cost",
    label: "Kur Riski — VaR_Historical",
    fn: (inputs) => {
    const exposure = num(inputs, "exposure");
    const stdDev = num(inputs, "stdDev");
    const ExchangeRate = num(inputs, "ExchangeRate");
    const z = num(inputs, "z");
    const Score = num(inputs, "Score");
    const exposure_FC = num(inputs, "exposure_FC") || 0;
    const stdDev_ExchangeRate = num(inputs, "stdDev_ExchangeRate") || 0;
    const z_Score = num(inputs, "z_Score") || 0;
    return nonNegative(assertFinite(exposure_FC * stdDev_ExchangeRate * z_Score));
  },
  },
  {
    id: "user.currency_risk_2",
    family: "cost",
    label: "Kur Riski — VaR_Parametric",
    fn: (inputs) => {
    const exposure = num(inputs, "exposure");
    const volatility = num(inputs, "volatility");
    const timeHorizon = num(inputs, "timeHorizon");
    const exposure_FC = num(inputs, "exposure_FC") || 0;
    const sqrt = num(inputs, "sqrt") || 0;
    return nonNegative(assertFinite(exposure_FC * volatility * Math.sqrt(timeHorizon)));
  },
  },
  {
    id: "user.currency_risk_3",
    family: "cost",
    label: "Kur Riski — HedgedExposure",
    fn: (inputs) => {
    const exposure = num(inputs, "exposure");
    const hedgeRatio = num(inputs, "hedgeRatio");
    const exposure_FC = num(inputs, "exposure_FC") || 0;
    return nonNegative(assertFinite(exposure_FC * hedgeRatio));
  },
  },
  {
    id: "user.currency_risk_4",
    family: "cost",
    label: "Kur Riski — UnhedgedVaR",
    fn: (inputs) => {
    const vaR = num(inputs, "vaR");
    const Historical = num(inputs, "Historical");
    const hedgeRatio = num(inputs, "hedgeRatio");
    const vaR_Historical = num(inputs, "vaR_Historical") || 0;
    return nonNegative(assertFinite(vaR_Historical * (1 - hedgeRatio)));
  },
  }
];
