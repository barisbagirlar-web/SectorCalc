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
export const CHUNK_65_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.fire_hydrant_flow_0",
    family: "cost",
    label: "Yangin Hidranti Akis - FlowRate_Q",
    fn: (inputs) => {
    const c = num(inputs, "c");
    const d = num(inputs, "d");
    const p = num(inputs, "p");
    const Pitot = num(inputs, "Pitot");
    const c_d = num(inputs, "c_d") || 0;
    const sqrt = num(inputs, "sqrt") || 0;
    const p_Pitot = num(inputs, "p_Pitot") || 0;
    return nonNegative(assertFinite(29.83 * c_d * d**2 * Math.sqrt(p_Pitot)));
  },
  },
  {
    id: "user.fire_hydrant_flow_1",
    family: "cost",
    label: "Yangin Hidranti Akis - ResidualPressure",
    fn: (inputs) => {
    const p = num(inputs, "p");
    const Static = num(inputs, "Static");
    const flowRate = num(inputs, "flowRate");
    const coefficient = num(inputs, "coefficient");
    const p_Static = num(inputs, "p_Static") || 0;
    const flowRate_Q = num(inputs, "flowRate_Q") || 0;
    return nonNegative(assertFinite(p_Static - (flowRate_Q / coefficient)**1.85));
  },
  },
  {
    id: "user.fire_hydrant_flow_2",
    family: "cost",
    label: "Yangin Hidranti Akis - AvailableFlow_At20psi",
    fn: (inputs) => {
    const flowRate = num(inputs, "flowRate");
    const p = num(inputs, "p");
    const Static = num(inputs, "Static");
    const Residual = num(inputs, "Residual");
    const flowRate_Q = num(inputs, "flowRate_Q") || 0;
    const p_Static = num(inputs, "p_Static") || 0;
    const p_Residual = num(inputs, "p_Residual") || 0;
    return nonNegative(assertFinite(flowRate_Q * ((p_Static - 20) / (p_Static - p_Residual))**0.54));
  },
  },
  {
    id: "user.fire_hydrant_flow_3",
    family: "cost",
    label: "Yangin Hidranti Akis - FrictionLoss",
    fn: (inputs) => {
    const f = num(inputs, "f");
    const length = num(inputs, "length");
    const diameter = num(inputs, "diameter");
    const velocity = num(inputs, "velocity");
    const g = num(inputs, "g");
    return nonNegative(assertFinite(f * (length / diameter) * (velocity**2 / (2 * g))));
  },
  },
  {
    id: "user.fire_hydrant_flow_4",
    family: "cost",
    label: "Yangin Hidranti Akis - RequiredPumpHead",
    fn: (inputs) => {
    const elevationHead = num(inputs, "elevationHead");
    const frictionLoss = num(inputs, "frictionLoss");
    const nozzlePressure = num(inputs, "nozzlePressure");
    return nonNegative(assertFinite(elevationHead + frictionLoss + nozzlePressure));
  },
  },
  {
    id: "user.fire_hydrant_flow_5",
    family: "cost",
    label: "Yangin Hidranti Akis - Compliance",
    fn: (inputs) => {
    const availableFlow = num(inputs, "availableFlow");
    const At20psi = num(inputs, "At20psi");
    const requiredFlow = num(inputs, "requiredFlow");
    const pASS = num(inputs, "pASS");
    const fAIL = num(inputs, "fAIL");
    const availableFlow_At20psi = num(inputs, "availableFlow_At20psi") || 0;
    return nonNegative(assertFinite(((availableFlow_At20psi > requiredFlow) ? 1 : 0)));
  },
  },

  // ── Yenileme Butcesi Optimize Edici (6 formulas) ──,
  {
    id: "user.renovation_budget_optimizer_0",
    family: "cost",
    label: "Yenileme Butcesi Optimize Edici - BaseCost",
    fn: (inputs) => {
    const area = num(inputs, "area");
    const costPerSqM = num(inputs, "costPerSqM");
    const ByComplexity = num(inputs, "ByComplexity");
    const costPerSqM_ByComplexity = num(inputs, "costPerSqM_ByComplexity") || 0;
    return nonNegative(assertFinite(area * costPerSqM_ByComplexity));
  },
  },
  {
    id: "user.renovation_budget_optimizer_1",
    family: "cost",
    label: "Yenileme Butcesi Optimize Edici - Escalation",
    fn: (inputs) => {
    const baseCost = num(inputs, "baseCost");
    const inflationRate = num(inputs, "inflationRate");
    const projectDuration = num(inputs, "projectDuration");
    return nonNegative(assertFinite(baseCost * ((1 + inflationRate)**projectDuration - 1)));
  },
  },
  {
    id: "user.renovation_budget_optimizer_2",
    family: "cost",
    label: "Yenileme Butcesi Optimize Edici - Contingency",
    fn: (inputs) => {
    const baseCost = num(inputs, "baseCost");
    const escalation = num(inputs, "escalation");
    const riskFactor = num(inputs, "riskFactor");
    return nonNegative(assertFinite((baseCost + escalation) * riskFactor));
  },
  },
  {
    id: "user.renovation_budget_optimizer_3",
    family: "cost",
    label: "Yenileme Butcesi Optimize Edici - SoftCosts",
    fn: (inputs) => {
    const baseCost = num(inputs, "baseCost");
    const escalation = num(inputs, "escalation");
    const designFeePct = num(inputs, "designFeePct");
    const permitFeePct = num(inputs, "permitFeePct");
    return nonNegative(assertFinite((baseCost + escalation) * (designFeePct + permitFeePct)));
  },
  },
  {
    id: "user.renovation_budget_optimizer_4",
    family: "cost",
    label: "Yenileme Butcesi Optimize Edici - TotalBudget",
    fn: (inputs) => {
    const baseCost = num(inputs, "baseCost");
    const escalation = num(inputs, "escalation");
    const contingency = num(inputs, "contingency");
    const softCosts = num(inputs, "softCosts");
    const fF = num(inputs, "fF");
    const fF_E = num(inputs, "fF_E") || 0;
    return nonNegative(assertFinite(baseCost + escalation + contingency + softCosts + fF_E));
  },
  },
  {
    id: "user.renovation_budget_optimizer_5",
    family: "cost",
    label: "Yenileme Butcesi Optimize Edici - ROI_Renovation",
    fn: (inputs) => {
    const newPropertyValue = num(inputs, "newPropertyValue");
    const oldPropertyValue = num(inputs, "oldPropertyValue");
    const totalBudget = num(inputs, "totalBudget");
    return nonNegative(assertFinite((newPropertyValue - oldPropertyValue - totalBudget) / totalBudget));
  },
  },

  // ── Yenilenebilir Enerji YG (7 formulas) ──,
  {
    id: "user.renewable_energy_irr_0",
    family: "cost",
    label: "Yenilenebilir Enerji YG - AnnualGeneration",
    fn: (inputs) => {
    const systemCapacity = num(inputs, "systemCapacity");
    const capacityFactor = num(inputs, "capacityFactor");
    return nonNegative(assertFinite(systemCapacity * capacityFactor * 8760));
  },
  },
  {
    id: "user.renewable_energy_irr_1",
    family: "cost",
    label: "Yenilenebilir Enerji YG - AnnualSavings",
    fn: (inputs) => {
    const annualGeneration = num(inputs, "annualGeneration");
    const gridElectricityRate = num(inputs, "gridElectricityRate");
    return nonNegative(assertFinite(annualGeneration * gridElectricityRate));
  },
  },
  {
    id: "user.renewable_energy_irr_2",
    family: "cost",
    label: "Yenilenebilir Enerji YG - AnnualOPEX",
    fn: (inputs) => {
    const maintenance = num(inputs, "maintenance");
    const insurance = num(inputs, "insurance");
    const inverterReplacementFund = num(inputs, "inverterReplacementFund");
    return nonNegative(assertFinite(maintenance + insurance + inverterReplacementFund));
  },
  }
];
