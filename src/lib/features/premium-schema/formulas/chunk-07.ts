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
export const CHUNK_07_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.cbam_compliance_verdict_3",
    family: "cost",
    label: "CBAM UYUMLULUK — ActualVsDefault",
    fn: (inputs) => {
    const specificEmbedded = num(inputs, "specificEmbedded");
    const defaultEmissionFactor = num(inputs, "defaultEmissionFactor");
    return nonNegative(assertFinite(specificEmbedded / defaultEmissionFactor));
  },
  },
  {
    id: "user.cbam_compliance_verdict_4",
    family: "cost",
    label: "CBAM UYUMLULUK — FinancialLiability",
    fn: (inputs) => {
    const totalEmbedded = num(inputs, "totalEmbedded");
    const eU = num(inputs, "eU");
    const Price = num(inputs, "Price");
    const carbonPricePaidOrigin = num(inputs, "carbonPricePaidOrigin");
    const eU_ETS_Price = num(inputs, "eU_ETS_Price") || 0;
    return nonNegative(assertFinite(totalEmbedded * (eU_ETS_Price - carbonPricePaidOrigin)));
  },
  },
  {
    id: "user.cbam_compliance_verdict_5",
    family: "cost",
    label: "CBAM UYUMLULUK — ComplianceDecision",
    fn: (inputs) => {
    const actualVsDefault = num(inputs, "actualVsDefault");
    const liability = num(inputs, "liability");
    const marginThreshold = num(inputs, "marginThreshold");
    return (actualVsDefault < 1 && liability < marginThreshold) ? 1 : 0;
  },
  },

  // ── CHATTER SURFACE QUALITY (6 formulas) ──,
  {
    id: "user.chatter_surface_quality_0",
    family: "cost",
    label: "CHATTER SURFACE QUALITY — V_c",
    fn: (inputs) => {
    const d = num(inputs, "d");
    const n = num(inputs, "n");
    return nonNegative(assertFinite((Math.PI * d * n) / 1000));
  },
  },
  {
    id: "user.chatter_surface_quality_1",
    family: "cost",
    label: "CHATTER SURFACE QUALITY — f_z",
    fn: (inputs) => {
    const v = num(inputs, "v");
    const f = num(inputs, "f");
    const z = num(inputs, "z");
    const n = num(inputs, "n");
    const v_f = num(inputs, "v_f") || 0;
    return nonNegative(assertFinite(v_f / (z * n)));
  },
  },
  {
    id: "user.chatter_surface_quality_2",
    family: "cost",
    label: "CHATTER SURFACE QUALITY — SurfaceRoughness_Theo",
    fn: (inputs) => {
    const f = num(inputs, "f");
    const z = num(inputs, "z");
    const r = num(inputs, "r");
    const epsilon = num(inputs, "epsilon");
    const f_z = num(inputs, "f_z") || 0;
    const r_epsilon = num(inputs, "r_epsilon") || 0;
    return nonNegative(assertFinite(f_z**2 / (8 * r_epsilon)));
  },
  },
  {
    id: "user.chatter_surface_quality_3",
    family: "cost",
    label: "CHATTER SURFACE QUALITY — SurfaceRoughness_Actual",
    fn: (inputs) => {
    const theo = num(inputs, "theo");
    const chatterAmplification = num(inputs, "chatterAmplification");
    return nonNegative(assertFinite(theo * chatterAmplification));
  },
  },
  {
    id: "user.chatter_surface_quality_4",
    family: "cost",
    label: "CHATTER SURFACE QUALITY — QualityLossCost",
    fn: (inputs) => {
    const actual = num(inputs, "actual");
    const toleranceLimit = num(inputs, "toleranceLimit");
    const reworkCostPerMicron = num(inputs, "reworkCostPerMicron");
    return nonNegative(assertFinite((actual - toleranceLimit) * reworkCostPerMicron));
  },
  },
  {
    id: "user.chatter_surface_quality_5",
    family: "cost",
    label: "CHATTER SURFACE QUALITY — ScrapRate",
    fn: (inputs) => {
    const actual = num(inputs, "actual");
    const maxTolerance = num(inputs, "maxTolerance");
    const batchSize = num(inputs, "batchSize");
    return nonNegative(assertFinite(((actual > maxTolerance) ? (1) : (0)) * batchSize));
  },
  },

  // ── CIVATE TORK (7 formulas) ──,
  {
    id: "user.bolt_torque_preload_0",
    family: "cost",
    label: "CIVATE TORK — T",
    fn: (inputs) => {
    const k = num(inputs, "k");
    const d = num(inputs, "d");
    const f = num(inputs, "f");
    return nonNegative(assertFinite(k * d * f));
  },
  },
  {
    id: "user.bolt_torque_preload_1",
    family: "cost",
    label: "CIVATE TORK — F",
    fn: (inputs) => {
    const preload = num(inputs, "preload");
    const sigma = num(inputs, "sigma");
    const p = num(inputs, "p");
    const a = num(inputs, "a");
    const t = num(inputs, "t");
    const sigma_p = num(inputs, "sigma_p") || 0;
    const a_t = num(inputs, "a_t") || 0;
    return nonNegative(assertFinite(sigma_p * a_t));
  },
  },
  {
    id: "user.bolt_torque_preload_2",
    family: "cost",
    label: "CIVATE TORK — Sigma_p",
    fn: (inputs) => {
    const proofStrength = num(inputs, "proofStrength");
    return nonNegative(assertFinite(0.7 * proofStrength));
  },
  },
  {
    id: "user.bolt_torque_preload_3",
    family: "cost",
    label: "CIVATE TORK — A_t",
    fn: (inputs) => {
    const d2 = num(inputs, "d2");
    const d3 = num(inputs, "d3");
    return nonNegative(assertFinite((Math.PI / 4) * ((d2 + d3) / 2)**2));
  },
  },
  {
    id: "user.bolt_torque_preload_4",
    family: "cost",
    label: "CIVATE TORK — d2",
    fn: (inputs) => {
    const d = num(inputs, "d");
    const p = num(inputs, "p");
    return nonNegative(assertFinite(d - 0.649519 * p));
  },
  },
  {
    id: "user.bolt_torque_preload_5",
    family: "cost",
    label: "CIVATE TORK — d3",
    fn: (inputs) => {
    const d = num(inputs, "d");
    const p = num(inputs, "p");
    return nonNegative(assertFinite(d - 1.226869 * p));
  },
  }
];
