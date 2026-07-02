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
export const CHUNK_43_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.overtime_hiring_breakeven_0",
    family: "cost",
    label: "Overtime vs. Hiring Breakeven - OvertimeCost_Hour",
    fn: (inputs) => {
    const regularRate = num(inputs, "regularRate");
    const overtimeMultiplier = num(inputs, "overtimeMultiplier");
    const burdenRate = num(inputs, "burdenRate");
    return nonNegative(assertFinite(regularRate * overtimeMultiplier * (1 + burdenRate)));
  },
  },
  {
    id: "user.overtime_hiring_breakeven_1",
    family: "cost",
    label: "Overtime vs. Hiring Breakeven - HiringCost_Total",
    fn: (inputs) => {
    const recruitment = num(inputs, "recruitment");
    const onboarding = num(inputs, "onboarding");
    const training = num(inputs, "training");
    const rampUpProductivityLoss = num(inputs, "rampUpProductivityLoss");
    return nonNegative(assertFinite(recruitment + onboarding + training + rampUpProductivityLoss));
  },
  },
  {
    id: "user.overtime_hiring_breakeven_2",
    family: "cost",
    label: "Overtime vs. Hiring Breakeven - AnnualNewHireCost",
    fn: (inputs) => {
    const regularRate = num(inputs, "regularRate");
    const annualHours = num(inputs, "annualHours");
    const burdenRate = num(inputs, "burdenRate");
    const benefits = num(inputs, "benefits");
    return nonNegative(assertFinite((regularRate * annualHours) * (1 + burdenRate) + benefits));
  },
  },
  {
    id: "user.overtime_hiring_breakeven_3",
    family: "cost",
    label: "Overtime vs. Hiring Breakeven - BreakevenHours",
    fn: (inputs) => {
    const hiringCost = num(inputs, "hiringCost");
    const Total = num(inputs, "Total");
    const annualNewHireCost = num(inputs, "annualNewHireCost");
    const annualHours = num(inputs, "annualHours");
    const overtimeCost = num(inputs, "overtimeCost");
    const Hour = num(inputs, "Hour");
    const hiringCost_Total = num(inputs, "hiringCost_Total") || 0;
    const overtimeCost_Hour = num(inputs, "overtimeCost_Hour") || 0;
    return nonNegative(assertFinite(hiringCost_Total / (annualNewHireCost / annualHours - overtimeCost_Hour)));
  },
  },
  {
    id: "user.overtime_hiring_breakeven_4",
    family: "cost",
    label: "Overtime vs. Hiring Breakeven - Decision",
    fn: (inputs) => {
    const expectedOvertimeHours = num(inputs, "expectedOvertimeHours");
    const breakevenHours = num(inputs, "breakevenHours");
    const hire = num(inputs, "hire");
    const overtime = num(inputs, "overtime");
    return nonNegative(assertFinite(((expectedOvertimeHours > breakevenHours) ? 1 : 0)));
  },
  },
  {
    id: "user.overtime_hiring_breakeven_5",
    family: "cost",
    label: "Overtime vs. Hiring Breakeven - QualityCost_OT",
    fn: (inputs) => {
    const overtimeHours = num(inputs, "overtimeHours");
    const fatigueDefectRate = num(inputs, "fatigueDefectRate");
    const defectCost = num(inputs, "defectCost");
    return nonNegative(assertFinite(overtimeHours * fatigueDefectRate * defectCost));
  },
  },

  // ── Odeme Vadesi Optimize Edici (7 formulas) ──,
  {
    id: "user.payment_terms_optimizer_0",
    family: "cost",
    label: "Odeme Vadesi Optimize Edici - DSO",
    fn: (inputs) => {
    const accountsReceivable = num(inputs, "accountsReceivable");
    const revenue = num(inputs, "revenue");
    const days = num(inputs, "days");
    return nonNegative(assertFinite((accountsReceivable / revenue) * days));
  },
  },
  {
    id: "user.payment_terms_optimizer_1",
    family: "cost",
    label: "Odeme Vadesi Optimize Edici - CarryingCost_AR",
    fn: (inputs) => {
    const averageAR = num(inputs, "averageAR");
    const wACC = num(inputs, "wACC");
    return nonNegative(assertFinite(averageAR * wACC / 365));
  },
  },
  {
    id: "user.payment_terms_optimizer_2",
    family: "cost",
    label: "Odeme Vadesi Optimize Edici - BadDebtExpense",
    fn: (inputs) => {
    const revenue = num(inputs, "revenue");
    const defaultRate = num(inputs, "defaultRate");
    return nonNegative(assertFinite(revenue * defaultRate));
  },
  },
  {
    id: "user.payment_terms_optimizer_3",
    family: "cost",
    label: "Odeme Vadesi Optimize Edici - DiscountCost",
    fn: (inputs) => {
    const earlyPaymentDiscountPct = num(inputs, "earlyPaymentDiscountPct");
    const discountTakeRate = num(inputs, "discountTakeRate");
    const revenue = num(inputs, "revenue");
    return nonNegative(assertFinite(earlyPaymentDiscountPct * discountTakeRate * revenue));
  },
  },
  {
    id: "user.payment_terms_optimizer_4",
    family: "cost",
    label: "Odeme Vadesi Optimize Edici - OptimalTerms",
    fn: (inputs) => {
    return 0; // OptimalTerms = Terms where (CarryingCost + BadDebt - DiscountCost) is MINIMUM - requires solver
  },
  },
  {
    id: "user.payment_terms_optimizer_5",
    family: "cost",
    label: "Odeme Vadesi Optimize Edici - CashFlowImpact",
    fn: (inputs) => {
    const newDSO = num(inputs, "newDSO");
    const oldDSO = num(inputs, "oldDSO");
    const revenue = num(inputs, "revenue");
    return nonNegative(assertFinite((newDSO - oldDSO) * (revenue / 365)));
  },
  },
  {
    id: "user.payment_terms_optimizer_6",
    family: "cost",
    label: "Odeme Vadesi Optimize Edici - NPV_Terms",
    fn: (inputs) => {
    const cashInflow = num(inputs, "cashInflow");
    const t = num(inputs, "t");
    const dailyWACC = num(inputs, "dailyWACC");
    const cashInflow_t = num(inputs, "cashInflow_t") || 0;
    return nonNegative(assertFinite(SUM(cashInflow_t / (1 + dailyWACC)**t)));
  },
  },

  // ── Ogrenme Egrisi Sure Tahmincisi (8 formulas) ──,
  {
    id: "user.learning_curve_time_0",
    family: "cost",
    label: "Ogrenme Egrisi Sure Tahmincisi - LearningRate",
    fn: (inputs) => {
    const time = num(inputs, "time");
    const time_2N = num(inputs, "time_2N") || 0;
    const time_N = num(inputs, "time_N") || 0;
    return nonNegative(assertFinite(1 - (time_2N / time_N)));
  },
  },
  {
    id: "user.learning_curve_time_1",
    family: "cost",
    label: "Ogrenme Egrisi Sure Tahmincisi - Slope_b",
    fn: (inputs) => {
    const learningRate = num(inputs, "learningRate");
    const log = num(inputs, "log") || 0;
    return nonNegative(assertFinite(Math.log(learningRate) / Math.log(2)));
  },
  }
];
