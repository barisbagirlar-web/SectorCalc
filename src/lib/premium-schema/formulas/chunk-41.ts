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

// @ts-expect-error TS2590 - chunk to avoid OOM
export const CHUNK_41_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.cash_flow_gap_9",
    family: "cost",
    label: "Nakit Akışı Açığı — FinancingCost",
    fn: (inputs) => {
    const cashGap = num(inputs, "cashGap");
    const dailyInterestRate = num(inputs, "dailyInterestRate");
    return nonNegative(assertFinite(cashGap * dailyInterestRate));
  },
  },

  // ── Navlun Maliyeti (8 formulas) ──,
  {
    id: "user.freight_cost_0",
    family: "cost",
    label: "Navlun Maliyeti — ChargeableWeight",
    fn: (inputs) => {
    const grossWeight = num(inputs, "grossWeight");
    const volumetricWeight = num(inputs, "volumetricWeight");
    const max = num(inputs, "max") || 0;
    return nonNegative(assertFinite(Math.max(grossWeight, volumetricWeight)));
  },
  },
  {
    id: "user.freight_cost_1",
    family: "cost",
    label: "Navlun Maliyeti — BaseFreight",
    fn: (inputs) => {
    const chargeableWeight = num(inputs, "chargeableWeight");
    const ratePerKg = num(inputs, "ratePerKg");
    return nonNegative(assertFinite(chargeableWeight * ratePerKg));
  },
  },
  {
    id: "user.freight_cost_2",
    family: "cost",
    label: "Navlun Maliyeti — BunkerSurcharge",
    fn: (inputs) => {
    const baseFreight = num(inputs, "baseFreight");
    const bAF = num(inputs, "bAF");
    const Pct = num(inputs, "Pct");
    const bAF_Pct = num(inputs, "bAF_Pct") || 0;
    return nonNegative(assertFinite(baseFreight * bAF_Pct));
  },
  },
  {
    id: "user.freight_cost_3",
    family: "cost",
    label: "Navlun Maliyeti — SecurityFee",
    fn: (inputs) => {
    const chargeableWeight = num(inputs, "chargeableWeight");
    const securityRate = num(inputs, "securityRate");
    return nonNegative(assertFinite(chargeableWeight * securityRate));
  },
  },
  {
    id: "user.freight_cost_4",
    family: "cost",
    label: "Navlun Maliyeti — TerminalHandling",
    fn: (inputs) => {
    const units = num(inputs, "units");
    const tHC = num(inputs, "tHC");
    const Rate = num(inputs, "Rate");
    const tHC_Rate = num(inputs, "tHC_Rate") || 0;
    return nonNegative(assertFinite(units * tHC_Rate));
  },
  },
  {
    id: "user.freight_cost_5",
    family: "cost",
    label: "Navlun Maliyeti — CustomsClearance",
    fn: (inputs) => {
    const fixedFee = num(inputs, "fixedFee");
    const value = num(inputs, "value");
    const dutyPct = num(inputs, "dutyPct");
    return nonNegative(assertFinite(fixedFee + (value * dutyPct)));
  },
  },
  {
    id: "user.freight_cost_6",
    family: "cost",
    label: "Navlun Maliyeti — TotalFreightCost",
    fn: (inputs) => {
    const baseFreight = num(inputs, "baseFreight");
    const bunkerSurcharge = num(inputs, "bunkerSurcharge");
    const securityFee = num(inputs, "securityFee");
    const terminalHandling = num(inputs, "terminalHandling");
    const customsClearance = num(inputs, "customsClearance");
    return nonNegative(assertFinite(baseFreight + bunkerSurcharge + securityFee + terminalHandling + customsClearance));
  },
  },
  {
    id: "user.freight_cost_7",
    family: "cost",
    label: "Navlun Maliyeti — CostPerUnit",
    fn: (inputs) => {
    const totalFreightCost = num(inputs, "totalFreightCost");
    const totalUnits = num(inputs, "totalUnits");
    return nonNegative(assertFinite(totalFreightCost / totalUnits));
  },
  },

  // ── Noise & Vibration Maliyet (6 formulas) ──,
  {
    id: "user.noise_vibration_cost_0",
    family: "cost",
    label: "Noise & Vibration Maliyet — NoiseExposure_dBA",
    fn: (inputs) => {
    const t = num(inputs, "t");
    const i = num(inputs, "i");
    const l = num(inputs, "l");
    const log10 = num(inputs, "log10") || 0;
    const t_i = num(inputs, "t_i") || 0;
    const l_i = num(inputs, "l_i") || 0;
    return nonNegative(assertFinite(10 * Math.log10((1/t) * SUM(t_i * 10**(l_i/10)))));
  },
  },
  {
    id: "user.noise_vibration_cost_1",
    family: "cost",
    label: "Noise & Vibration Maliyet — Vibration_RMS",
    fn: (inputs) => {
    const t = num(inputs, "t");
    const a = num(inputs, "a");
    const i = num(inputs, "i");
    const sqrt = num(inputs, "sqrt") || 0;
    const a_i = num(inputs, "a_i") || 0;
    const t_i = num(inputs, "t_i") || 0;
    return nonNegative(assertFinite(Math.sqrt((1/t) * SUM(a_i**2 * t_i))));
  },
  },
  {
    id: "user.noise_vibration_cost_2",
    family: "cost",
    label: "Noise & Vibration Maliyet — HealthCost",
    fn: (inputs) => {
    const noise = num(inputs, "noise");
    const oR = num(inputs, "oR");
    const vibration = num(inputs, "vibration");
    const vibrationLimit = num(inputs, "vibrationLimit");
    const medicalScreening = num(inputs, "medicalScreening");
    const pPE = num(inputs, "pPE");
    const Cost = num(inputs, "Cost");
    const insurancePremiumHike = num(inputs, "insurancePremiumHike");
    return nonNegative(assertFinite(((noise > 85 || vibration > vibrationLimit) ? (medicalScreening + pPE + Cost + insurancePremiumHike) : (0))));
  },
  },
  {
    id: "user.noise_vibration_cost_3",
    family: "cost",
    label: "Noise & Vibration Maliyet — ProductivityLoss",
    fn: (inputs) => {
    const actualOutput = num(inputs, "actualOutput");
    const baselineOutput = num(inputs, "baselineOutput");
    const unitMargin = num(inputs, "unitMargin");
    return nonNegative(assertFinite((actualOutput - baselineOutput) * unitMargin));
  },
  },
  {
    id: "user.noise_vibration_cost_4",
    family: "cost",
    label: "Noise & Vibration Maliyet — ReworkCost",
    fn: (inputs) => {
    const vibrationDefectRate = num(inputs, "vibrationDefectRate");
    const totalUnits = num(inputs, "totalUnits");
    const reworkCostPerUnit = num(inputs, "reworkCostPerUnit");
    return nonNegative(assertFinite(vibrationDefectRate * totalUnits * reworkCostPerUnit));
  },
  },
  {
    id: "user.noise_vibration_cost_5",
    family: "cost",
    label: "Noise & Vibration Maliyet — MitigationROI",
    fn: (inputs) => {
    const healthCost = num(inputs, "healthCost");
    const prodLoss = num(inputs, "prodLoss");
    const reworkCost = num(inputs, "reworkCost");
    const mitigationInvestment = num(inputs, "mitigationInvestment");
    return nonNegative(assertFinite((healthCost + prodLoss + reworkCost) / mitigationInvestment));
  },
  },

  // ── OEE ve Durma Süresi (8 formulas) ──
];
