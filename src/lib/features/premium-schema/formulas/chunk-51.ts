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
export const CHUNK_51_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.smed_changeover_optimizer_0",
    family: "cost",
    label: "SMED Degisim Optimize Edici - CurrentSetupTime",
    fn: (inputs) => {
    const internal = num(inputs, "internal");
    const Current = num(inputs, "Current");
    const external = num(inputs, "external");
    const internal_Current = num(inputs, "internal_Current") || 0;
    const external_Current = num(inputs, "external_Current") || 0;
    return nonNegative(assertFinite(internal_Current + external_Current));
  },
  },
  {
    id: "user.smed_changeover_optimizer_1",
    family: "cost",
    label: "SMED Degisim Optimize Edici - TargetSetupTime",
    fn: (inputs) => {
    const internal = num(inputs, "internal");
    const Target = num(inputs, "Target");
    const external = num(inputs, "external");
    const internal_Target = num(inputs, "internal_Target") || 0;
    const external_Target = num(inputs, "external_Target") || 0;
    return nonNegative(assertFinite(internal_Target + external_Target));
  },
  },
  {
    id: "user.smed_changeover_optimizer_2",
    family: "cost",
    label: "SMED Degisim Optimize Edici - ConversionRate",
    fn: (inputs) => {
    const internal = num(inputs, "internal");
    const Current = num(inputs, "Current");
    const Target = num(inputs, "Target");
    const internal_Current = num(inputs, "internal_Current") || 0;
    const internal_Target = num(inputs, "internal_Target") || 0;
    return nonNegative(assertFinite((internal_Current - internal_Target) / internal_Current));
  },
  },
  {
    id: "user.smed_changeover_optimizer_3",
    family: "cost",
    label: "SMED Degisim Optimize Edici - CapacityRecovered",
    fn: (inputs) => {
    const currentSetupTime = num(inputs, "currentSetupTime");
    const targetSetupTime = num(inputs, "targetSetupTime");
    const changeoverFrequency = num(inputs, "changeoverFrequency");
    return nonNegative(assertFinite((currentSetupTime - targetSetupTime) * changeoverFrequency));
  },
  },
  {
    id: "user.smed_changeover_optimizer_4",
    family: "cost",
    label: "SMED Degisim Optimize Edici - FinancialGain",
    fn: (inputs) => {
    const capacityRecovered = num(inputs, "capacityRecovered");
    const bottleneckThroughput = num(inputs, "bottleneckThroughput");
    const unitMargin = num(inputs, "unitMargin");
    return nonNegative(assertFinite(capacityRecovered * bottleneckThroughput * unitMargin));
  },
  },
  {
    id: "user.smed_changeover_optimizer_5",
    family: "cost",
    label: "SMED Degisim Optimize Edici - SMED_Investment",
    fn: (inputs) => {
    const training = num(inputs, "training");
    const tooling = num(inputs, "tooling");
    const modification = num(inputs, "modification");
    return nonNegative(assertFinite(training + tooling + modification));
  },
  },
  {
    id: "user.smed_changeover_optimizer_6",
    family: "cost",
    label: "SMED Degisim Optimize Edici - ROI",
    fn: (inputs) => {
    const financialGain = num(inputs, "financialGain");
    const sMED = num(inputs, "sMED");
    const Investment = num(inputs, "Investment");
    const sMED_Investment = num(inputs, "sMED_Investment") || 0;
    return nonNegative(assertFinite(financialGain / sMED_Investment));
  },
  },

  // ── Sozlesme Tesvik (9 formulas) ──,
  {
    id: "user.contract_incentive_0",
    family: "cost",
    label: "Sozlesme Tesvik - TargetCost",
    fn: (inputs) => {
    const baselineEstimate = num(inputs, "baselineEstimate");
    return nonNegative(assertFinite(baselineEstimate));
  },
  },
  {
    id: "user.contract_incentive_1",
    family: "cost",
    label: "Sozlesme Tesvik - TargetFee",
    fn: (inputs) => {
    const targetCost = num(inputs, "targetCost");
    const targetFeePct = num(inputs, "targetFeePct");
    return nonNegative(assertFinite(targetCost * targetFeePct));
  },
  },
  {
    id: "user.contract_incentive_2",
    family: "cost",
    label: "Sozlesme Tesvik - ShareRatio",
    fn: (inputs) => {
    const overrunShare = num(inputs, "overrunShare");
    const underrunShare = num(inputs, "underrunShare");
    return nonNegative(assertFinite(overrunShare / underrunShare));
  },
  },
  {
    id: "user.contract_incentive_3",
    family: "cost",
    label: "Sozlesme Tesvik - ActualFee",
    fn: (inputs) => {
    const targetFee = num(inputs, "targetFee");
    const targetCost = num(inputs, "targetCost");
    const actualCost = num(inputs, "actualCost");
    const contractorSharePct = num(inputs, "contractorSharePct");
    return nonNegative(assertFinite(targetFee + (targetCost - actualCost) * contractorSharePct));
  },
  },
  {
    id: "user.contract_incentive_4",
    family: "cost",
    label: "Sozlesme Tesvik - MaxFee",
    fn: (inputs) => {
    const targetFee = num(inputs, "targetFee");
    const maxFeeMultiplier = num(inputs, "maxFeeMultiplier");
    return nonNegative(assertFinite(targetFee * maxFeeMultiplier));
  },
  },
  {
    id: "user.contract_incentive_5",
    family: "cost",
    label: "Sozlesme Tesvik - MinFee",
    fn: (inputs) => {
    const targetFee = num(inputs, "targetFee");
    const minFeeMultiplier = num(inputs, "minFeeMultiplier");
    return nonNegative(assertFinite(targetFee * minFeeMultiplier));
  },
  },
  {
    id: "user.contract_incentive_6",
    family: "cost",
    label: "Sozlesme Tesvik - FinalFee",
    fn: (inputs) => {
    const actualFee = num(inputs, "actualFee");
    const minFee = num(inputs, "minFee");
    const maxFee = num(inputs, "maxFee");
    const min = num(inputs, "min") || 0;
    const max = num(inputs, "max") || 0;
    return nonNegative(assertFinite(Math.min(Math.max(actualFee, minFee), maxFee)));
  },
  },
  {
    id: "user.contract_incentive_7",
    family: "cost",
    label: "Sozlesme Tesvik - FinalPrice",
    fn: (inputs) => {
    const actualCost = num(inputs, "actualCost");
    const finalFee = num(inputs, "finalFee");
    return nonNegative(assertFinite(actualCost + finalFee));
  },
  }
];
