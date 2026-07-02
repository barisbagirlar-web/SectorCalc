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
export const CHUNK_01_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.ai_token_cost_0",
    family: "cost",
    label: "AI TOKEN COST - BasePromptCost",
    fn: (inputs) => {
    const promptTokens = num(inputs, "promptTokens");
    const promptPrice = num(inputs, "promptPrice");
    return nonNegative(assertFinite((promptTokens * promptPrice) / 1000000));
  },
  },
  {
    id: "user.ai_token_cost_1",
    family: "cost",
    label: "AI TOKEN COST - BaseCompletionCost",
    fn: (inputs) => {
    const completionTokens = num(inputs, "completionTokens");
    const completionPrice = num(inputs, "completionPrice");
    return nonNegative(assertFinite((completionTokens * completionPrice) / 1000000));
  },
  },
  {
    id: "user.ai_token_cost_2",
    family: "cost",
    label: "AI TOKEN COST - CacheReadCost",
    fn: (inputs) => {
    const cachedTokens = num(inputs, "cachedTokens");
    const cacheReadPrice = num(inputs, "cacheReadPrice");
    return nonNegative(assertFinite((cachedTokens * cacheReadPrice) / 1000000));
  },
  },
  {
    id: "user.ai_token_cost_3",
    family: "cost",
    label: "AI TOKEN COST - MonthlyProjection",
    fn: (inputs) => {
    const dailyBaseCost = num(inputs, "dailyBaseCost");
    const growthRate = num(inputs, "growthRate");
    return nonNegative(assertFinite((dailyBaseCost * 30) * (1 + growthRate)));
  },
  },
  {
    id: "user.ai_token_cost_4",
    family: "cost",
    label: "AI TOKEN COST - TCO",
    fn: (inputs) => {
    const monthlyProjection = num(inputs, "monthlyProjection");
    const infraOverhead = num(inputs, "infraOverhead");
    const fallbackCost = num(inputs, "fallbackCost");
    return nonNegative(assertFinite(monthlyProjection + infraOverhead + fallbackCost));
  },
  },

  // ── SIX SIGMA PROJECT PRIORITIZER (6 formulas) ──,
  {
    id: "user.six_sigma_project_prioritizer_0",
    family: "cost",
    label: "SIX SIGMA PROJECT PRIORITIZER - DPMO",
    fn: (inputs) => {
    const defects = num(inputs, "defects");
    const units = num(inputs, "units");
    const opportunities = num(inputs, "opportunities");
    return nonNegative(assertFinite((defects / (units * opportunities)) * 1000000));
  },
  },
  {
    id: "user.six_sigma_project_prioritizer_1",
    family: "cost",
    label: "SIX SIGMA PROJECT PRIORITIZER - Yield",
    fn: (inputs) => {
    const defects = num(inputs, "defects");
    const units = num(inputs, "units");
    const opportunities = num(inputs, "opportunities");
    return nonNegative(assertFinite(1 - (defects / (units * opportunities))));
  },
  },
  {
    id: "user.six_sigma_project_prioritizer_2",
    family: "cost",
    label: "SIX SIGMA PROJECT PRIORITIZER - Z_bench",
    fn: (inputs) => {
      // COMPLEX: Z_bench = NORMSINV(Yield)
      // Requires external implementation
      return 0;
    },
  },
  {
    id: "user.six_sigma_project_prioritizer_3",
    family: "cost",
    label: "SIX SIGMA PROJECT PRIORITIZER - SigmaLevel",
    fn: (inputs) => {
    const z_bench = num(inputs, "z_bench");
    return nonNegative(assertFinite(z_bench + 1.5));
  },
  },
  {
    id: "user.six_sigma_project_prioritizer_4",
    family: "cost",
    label: "SIX SIGMA PROJECT PRIORITIZER - COPQ",
    fn: (inputs) => {
    const internalFailure = num(inputs, "internalFailure");
    const externalFailure = num(inputs, "externalFailure");
    const appraisal = num(inputs, "appraisal");
    const prevention = num(inputs, "prevention");
    return nonNegative(assertFinite(internalFailure + externalFailure + appraisal + prevention));
  },
  },
  {
    id: "user.six_sigma_project_prioritizer_5",
    family: "cost",
    label: "SIX SIGMA PROJECT PRIORITIZER - ProjectScore",
    fn: (inputs) => {
    const cOPQ = num(inputs, "cOPQ");
    const recoveryProb = num(inputs, "recoveryProb");
    const sigmaGap = num(inputs, "sigmaGap");
    const strategicAlignment = num(inputs, "strategicAlignment");
    const ease = num(inputs, "ease");
    return nonNegative(assertFinite((cOPQ * recoveryProb * 0.35) + (sigmaGap * 0.25) + (strategicAlignment * 0.25) + (ease * 0.15)));
  },
  },

  // ── AQL SAMPLING RISK & COST (9 formulas) ──,
  {
    id: "user.aql_sampling_risk_0",
    family: "cost",
    label: "AQL SAMPLING RISK & COST - CodeLetter",
    fn: (inputs) => {
    return 0; // CodeLetter = LookupCodeLetter(LotSize, InspectionLevel) - requires AQL table
  },
  },
  {
    id: "user.aql_sampling_risk_1",
    family: "cost",
    label: "AQL SAMPLING RISK & COST - n",
    fn: (inputs) => {
    return 0; // n = SampleSize(CodeLetter, AQL) - requires AQL table
  },
  },
  {
    id: "user.aql_sampling_risk_2",
    family: "cost",
    label: "AQL SAMPLING RISK & COST - Ac",
    fn: (inputs) => {
    return 0; // Ac = AcceptanceNumber(CodeLetter, AQL) - requires AQL table
  },
  },
  {
    id: "user.aql_sampling_risk_3",
    family: "cost",
    label: "AQL SAMPLING RISK & COST - Pa_producer",
    fn: (inputs) => {
      // COMPLEX: Pa_producer = BINOMDIST(Ac, n, p_AQL, TRUE)
      // Requires external implementation
      return 0;
    },
  }
];
