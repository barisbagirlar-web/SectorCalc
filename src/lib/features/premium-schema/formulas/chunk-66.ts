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
export const CHUNK_66_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.renewable_energy_irr_3",
    family: "cost",
    label: "Yenilenebilir Enerji YG — NetCashFlow",
    fn: (inputs) => {
    const annualSavings = num(inputs, "annualSavings");
    const annualOPEX = num(inputs, "annualOPEX");
    const incentives = num(inputs, "incentives");
    return nonNegative(assertFinite(annualSavings - annualOPEX + incentives));
  },
  },
  {
    id: "user.renewable_energy_irr_4",
    family: "cost",
    label: "Yenilenebilir Enerji YG — PaybackPeriod",
    fn: (inputs) => {
    const totalCapex = num(inputs, "totalCapex");
    const netCashFlow = num(inputs, "netCashFlow");
    return nonNegative(assertFinite(totalCapex / netCashFlow));
  },
  },
  {
    id: "user.renewable_energy_irr_5",
    family: "cost",
    label: "Yenilenebilir Enerji YG — LCOE",
    fn: (inputs) => {
    const totalCapex = num(inputs, "totalCapex");
    const oPEX = num(inputs, "oPEX");
    const t = num(inputs, "t");
    const r = num(inputs, "r");
    const generation = num(inputs, "generation");
    const oPEX_t = num(inputs, "oPEX_t") || 0;
    return nonNegative(assertFinite((totalCapex + oPEX_t / Math.pow(1+r, t)) / (generation / Math.pow(1+r, t))));
  },
  },
  {
    id: "user.renewable_energy_irr_6",
    family: "cost",
    label: "Yenilenebilir Enerji YG — NPV",
    fn: (inputs) => {
    const netCashFlow = num(inputs, "netCashFlow");
    const t = num(inputs, "t");
    const wACC = num(inputs, "wACC");
    const totalCapex = num(inputs, "totalCapex");
    const netCashFlow_t = num(inputs, "netCashFlow_t") || 0;
    return nonNegative(assertFinite(SUM(netCashFlow_t / (1+wACC)**t) - totalCapex));
  },
  },

  // ── YG ve NBD (6 formulas) ──,
  {
    id: "user.roi_npv_0",
    family: "cost",
    label: "YG ve NBD — ROI",
    fn: (inputs) => {
    const totalNetProfit = num(inputs, "totalNetProfit");
    const totalInvestment = num(inputs, "totalInvestment");
    return nonNegative(assertFinite((totalNetProfit / totalInvestment) * 100));
  },
  },
  {
    id: "user.roi_npv_1",
    family: "cost",
    label: "YG ve NBD — NPV",
    fn: (inputs) => {
    const cashFlow = num(inputs, "cashFlow");
    const t = num(inputs, "t");
    const discountRate = num(inputs, "discountRate");
    const initialInvestment = num(inputs, "initialInvestment");
    const cashFlow_t = num(inputs, "cashFlow_t") || 0;
    return nonNegative(assertFinite(SUM(cashFlow_t / (1 + discountRate)**t) - initialInvestment));
  },
  },
  {
    id: "user.roi_npv_2",
    family: "cost",
    label: "YG ve NBD — IRR",
    fn: (inputs) => {
    const rate = num(inputs, "rate");
    const where = num(inputs, "where");
    const nPV = num(inputs, "nPV");
    return 0; // IRR = r where NPV=0 requires iteration
  },
  },
  {
    id: "user.roi_npv_3",
    family: "cost",
    label: "YG ve NBD — PaybackPeriod",
    fn: (inputs) => {
    const yearBefore = num(inputs, "yearBefore");
    const unrecoveredCost = num(inputs, "unrecoveredCost");
    const cashFlow = num(inputs, "cashFlow");
    const recoveryYear = num(inputs, "recoveryYear");
    return nonNegative(assertFinite(yearBefore + (unrecoveredCost / cashFlow)));
  },
  },
  {
    id: "user.roi_npv_4",
    family: "cost",
    label: "YG ve NBD — ProfitabilityIndex",
    fn: (inputs) => {
    const pV = num(inputs, "pV");
    const FutureCashFlows = num(inputs, "FutureCashFlows");
    const initialInvestment = num(inputs, "initialInvestment");
    const pV_FutureCashFlows = num(inputs, "pV_FutureCashFlows") || 0;
    return nonNegative(assertFinite(pV_FutureCashFlows / initialInvestment));
  },
  },
  {
    id: "user.roi_npv_5",
    family: "cost",
    label: "YG ve NBD — DiscountedPayback",
    fn: (inputs) => {
    return 0; // DiscountedPayback = Year where CumulativeDiscountedCashFlow > 0 — requires iteration
  },
  },

  // ── Zaman Etudu Analizoru (7 formulas) ──,
  {
    id: "user.standard_time_work_study_0",
    family: "cost",
    label: "Zaman Etudu Analizoru — ObservedTime",
    fn: (inputs) => {
    const cycleTimes = num(inputs, "cycleTimes");
    const numberOfCycles = num(inputs, "numberOfCycles");
    return nonNegative(assertFinite(SUM(cycleTimes) / numberOfCycles));
  },
  },
  {
    id: "user.standard_time_work_study_1",
    family: "cost",
    label: "Zaman Etudu Analizoru — NormalTime",
    fn: (inputs) => {
    const observedTime = num(inputs, "observedTime");
    const performanceRating = num(inputs, "performanceRating");
    return nonNegative(assertFinite(observedTime * performanceRating));
  },
  },
  {
    id: "user.standard_time_work_study_2",
    family: "cost",
    label: "Zaman Etudu Analizoru — AllowancePct",
    fn: (inputs) => {
    const personal = num(inputs, "personal");
    const fatigue = num(inputs, "fatigue");
    const delay = num(inputs, "delay");
    return nonNegative(assertFinite(personal + fatigue + delay));
  },
  },
  {
    id: "user.standard_time_work_study_3",
    family: "cost",
    label: "Zaman Etudu Analizoru — StandardTime",
    fn: (inputs) => {
    const normalTime = num(inputs, "normalTime");
    const allowancePct = num(inputs, "allowancePct");
    return nonNegative(assertFinite(normalTime * (1 + allowancePct)));
  },
  },
  {
    id: "user.standard_time_work_study_4",
    family: "cost",
    label: "Zaman Etudu Analizoru — StandardOutput",
    fn: (inputs) => {
    const shiftDuration = num(inputs, "shiftDuration");
    const standardTime = num(inputs, "standardTime");
    return nonNegative(assertFinite(shiftDuration / standardTime));
  },
  }
];
