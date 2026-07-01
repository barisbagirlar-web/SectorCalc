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
export const CHUNK_08_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.bolt_torque_preload_6",
    family: "cost",
    label: "CIVATE TORK — YieldCheck",
    fn: (inputs) => {
    const sigma = num(inputs, "sigma");
    const p = num(inputs, "p");
    const yieldStrength = num(inputs, "yieldStrength");
    const fAIL = num(inputs, "fAIL");
    const pASS = num(inputs, "pASS");
    const sigma_p = num(inputs, "sigma_p") || 0;
    return nonNegative(assertFinite(((sigma_p > yieldStrength) ? 1 : 0)));
  },
  },

  // ── TURNOVER COSTI (6 formulas) ──,
  {
    id: "user.employee_turnover_cost_0",
    family: "cost",
    label: "CIRO COSTI — SeparationCost",
    fn: (inputs) => {
    const exitInterview = num(inputs, "exitInterview");
    const hRRate = num(inputs, "hRRate");
    const severance = num(inputs, "severance");
    const admin = num(inputs, "admin");
    return nonNegative(assertFinite(exitInterview * hRRate + severance + admin));
  },
  },
  {
    id: "user.employee_turnover_cost_1",
    family: "cost",
    label: "CIRO COSTI — VacancyCost",
    fn: (inputs) => {
    const timeToFill = num(inputs, "timeToFill");
    const dailyRevenue = num(inputs, "dailyRevenue");
    const tempCost = num(inputs, "tempCost");
    return nonNegative(assertFinite((timeToFill * dailyRevenue) + tempCost));
  },
  },
  {
    id: "user.employee_turnover_cost_2",
    family: "cost",
    label: "CIRO COSTI — ReplacementCost",
    fn: (inputs) => {
    const ads = num(inputs, "ads");
    const agency = num(inputs, "agency");
    const interviewTime = num(inputs, "interviewTime");
    const rate = num(inputs, "rate");
    return nonNegative(assertFinite(ads + agency + interviewTime * rate));
  },
  },
  {
    id: "user.employee_turnover_cost_3",
    family: "cost",
    label: "CIRO COSTI — TrainingCost",
    fn: (inputs) => {
    const trainHours = num(inputs, "trainHours");
    const trainerRate = num(inputs, "trainerRate");
    const onboardHours = num(inputs, "onboardHours");
    const newHireRate = num(inputs, "newHireRate");
    return nonNegative(assertFinite(trainHours * trainerRate + onboardHours * newHireRate));
  },
  },
  {
    id: "user.employee_turnover_cost_4",
    family: "cost",
    label: "CIRO COSTI — ProductivityLoss",
    fn: (inputs) => {
    const timeToFull = num(inputs, "timeToFull");
    const avgOutput = num(inputs, "avgOutput");
    const rampUp = num(inputs, "rampUp");
    const margin = num(inputs, "margin");
    return nonNegative(assertFinite(timeToFull * avgOutput * (1 - rampUp) * margin));
  },
  },
  {
    id: "user.employee_turnover_cost_5",
    family: "cost",
    label: "CIRO COSTI — TotalTurnoverCost",
    fn: (inputs) => {
    const separation = num(inputs, "separation");
    const vacancy = num(inputs, "vacancy");
    const replacement = num(inputs, "replacement");
    const training = num(inputs, "training");
    const productivity = num(inputs, "productivity");
    return nonNegative(assertFinite(separation + vacancy + replacement + training + productivity));
  },
  },

  // ── CLOUD API OVERRUN (6 formulas) ──,
  {
    id: "user.cloud_api_overrun_0",
    family: "cost",
    label: "CLOUD API OVERRUN — OverrunRequests",
    fn: (inputs) => {
    const totalRequests = num(inputs, "totalRequests");
    const includedRequests = num(inputs, "includedRequests");
    const max = num(inputs, "max") || 0;
    return nonNegative(assertFinite(Math.max(0, totalRequests - includedRequests)));
  },
  },
  {
    id: "user.cloud_api_overrun_1",
    family: "cost",
    label: "CLOUD API OVERRUN — OverrunCost",
    fn: (inputs) => {
    const overrunRequests = num(inputs, "overrunRequests");
    const overageRate = num(inputs, "overageRate");
    return nonNegative(assertFinite(overrunRequests * overageRate));
  },
  },
  {
    id: "user.cloud_api_overrun_2",
    family: "cost",
    label: "CLOUD API OVERRUN — ThrottlingCost",
    fn: (inputs) => {
    const throttledRequests = num(inputs, "throttledRequests");
    const retryCost = num(inputs, "retryCost");
    const avgRetries = num(inputs, "avgRetries");
    return nonNegative(assertFinite(throttledRequests * retryCost * avgRetries));
  },
  },
  {
    id: "user.cloud_api_overrun_3",
    family: "cost",
    label: "CLOUD API OVERRUN — DataEgressCost",
    fn: (inputs) => {
    const dataOutGB = num(inputs, "dataOutGB");
    const egressRate = num(inputs, "egressRate");
    return nonNegative(assertFinite(dataOutGB * egressRate));
  },
  },
  {
    id: "user.cloud_api_overrun_4",
    family: "cost",
    label: "CLOUD API OVERRUN — SLABreachPenalty",
    fn: (inputs) => {
    const availability = num(inputs, "availability");
    const sLA = num(inputs, "sLA");
    const monthlyFee = num(inputs, "monthlyFee");
    const creditPct = num(inputs, "creditPct");
    return nonNegative(assertFinite(((availability < sLA) ? (monthlyFee * creditPct) : (0))));
  },
  },
  {
    id: "user.cloud_api_overrun_5",
    family: "cost",
    label: "CLOUD API OVERRUN — TotalOverrunCost",
    fn: (inputs) => {
    const overrunCost = num(inputs, "overrunCost");
    const throttlingCost = num(inputs, "throttlingCost");
    const dataEgressCost = num(inputs, "dataEgressCost");
    const sLABreachPenalty = num(inputs, "sLABreachPenalty");
    return nonNegative(assertFinite(overrunCost + throttlingCost + dataEgressCost + sLABreachPenalty));
  },
  },

  // ── CLOUD FIRE ELIMINATION (6 formulas) ──,
  {
    id: "user.cloud_waste_elimination_0",
    family: "cost",
    label: "CLOUD FIRE ELIMINATION — ZombieCost",
    fn: (inputs) => {
    const unattachedVolumes = num(inputs, "unattachedVolumes");
    const rate = num(inputs, "rate");
    const idleLBs = num(inputs, "idleLBs");
    const orphanSnapshots = num(inputs, "orphanSnapshots");
    const storageRate = num(inputs, "storageRate");
    return nonNegative(assertFinite(SUM(unattachedVolumes * rate) + SUM(idleLBs * rate) + SUM(orphanSnapshots * storageRate)));
  },
  },
  {
    id: "user.cloud_waste_elimination_1",
    family: "cost",
    label: "CLOUD FIRE ELIMINATION — OversizingSavings",
    fn: (inputs) => {
    const currentCost = num(inputs, "currentCost");
    const rightSizedCost = num(inputs, "rightSizedCost");
    const uptime = num(inputs, "uptime");
    return nonNegative(assertFinite(SUM((currentCost - rightSizedCost) * uptime)));
  },
  }
];
