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
export const CHUNK_31_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.weld_volume_cost_2",
    family: "cost",
    label: "Kaynak Hacmi ve Maliyeti — Weight_Deposited",
    fn: (inputs) => {
    const volume = num(inputs, "volume");
    const Weld = num(inputs, "Weld");
    const density = num(inputs, "density");
    const volume_Weld = num(inputs, "volume_Weld") || 0;
    return nonNegative(assertFinite(volume_Weld * density));
  },
  },
  {
    id: "user.weld_volume_cost_3",
    family: "cost",
    label: "Kaynak Hacmi ve Maliyeti — Weight_Electrode",
    fn: (inputs) => {
    const weight = num(inputs, "weight");
    const Deposited = num(inputs, "Deposited");
    const depositionEfficiency = num(inputs, "depositionEfficiency");
    const weight_Deposited = num(inputs, "weight_Deposited") || 0;
    return nonNegative(assertFinite(weight_Deposited / depositionEfficiency));
  },
  },
  {
    id: "user.weld_volume_cost_4",
    family: "cost",
    label: "Kaynak Hacmi ve Maliyeti — Cost_Filler",
    fn: (inputs) => {
    const weight = num(inputs, "weight");
    const Electrode = num(inputs, "Electrode");
    const pricePerKg = num(inputs, "pricePerKg");
    const weight_Electrode = num(inputs, "weight_Electrode") || 0;
    return nonNegative(assertFinite(weight_Electrode * pricePerKg));
  },
  },
  {
    id: "user.weld_volume_cost_5",
    family: "cost",
    label: "Kaynak Hacmi ve Maliyeti — Cost_Gas",
    fn: (inputs) => {
    const gasFlowRate = num(inputs, "gasFlowRate");
    const arcTime = num(inputs, "arcTime");
    const gasPrice = num(inputs, "gasPrice");
    return nonNegative(assertFinite(gasFlowRate * arcTime * gasPrice));
  },
  },
  {
    id: "user.weld_volume_cost_6",
    family: "cost",
    label: "Kaynak Hacmi ve Maliyeti — Cost_Power",
    fn: (inputs) => {
    const voltage = num(inputs, "voltage");
    const current = num(inputs, "current");
    const arcTime = num(inputs, "arcTime");
    const machineEff = num(inputs, "machineEff");
    const elecRate = num(inputs, "elecRate");
    return nonNegative(assertFinite((voltage * current * arcTime) / (1000 * machineEff) * elecRate));
  },
  },
  {
    id: "user.weld_volume_cost_7",
    family: "cost",
    label: "Kaynak Hacmi ve Maliyeti — TotalWeldCost",
    fn: (inputs) => {
    const cost = num(inputs, "cost");
    const Filler = num(inputs, "Filler");
    const Gas = num(inputs, "Gas");
    const Power = num(inputs, "Power");
    const arcTime = num(inputs, "arcTime");
    const depositionRate = num(inputs, "depositionRate");
    const laborRate = num(inputs, "laborRate");
    const cost_Filler = num(inputs, "cost_Filler") || 0;
    const cost_Gas = num(inputs, "cost_Gas") || 0;
    const cost_Power = num(inputs, "cost_Power") || 0;
    return nonNegative(assertFinite(cost_Filler + cost_Gas + cost_Power + (arcTime / depositionRate) * laborRate));
  },
  },

  // ── Kaynak Maliyeti (6 formulas) ──,
  {
    id: "user.weld_cost_analysis_0",
    family: "cost",
    label: "Kaynak Maliyeti — OperatingFactor",
    fn: (inputs) => {
    const arcTime = num(inputs, "arcTime");
    const totalShiftTime = num(inputs, "totalShiftTime");
    return nonNegative(assertFinite(arcTime / totalShiftTime));
  },
  },
  {
    id: "user.weld_cost_analysis_1",
    family: "cost",
    label: "Kaynak Maliyeti — DepositionRate",
    fn: (inputs) => {
    const weight = num(inputs, "weight");
    const Deposited = num(inputs, "Deposited");
    const arcTime = num(inputs, "arcTime");
    const weight_Deposited = num(inputs, "weight_Deposited") || 0;
    return nonNegative(assertFinite(weight_Deposited / arcTime));
  },
  },
  {
    id: "user.weld_cost_analysis_2",
    family: "cost",
    label: "Kaynak Maliyeti — TotalJointCost",
    fn: (inputs) => {
    const length = num(inputs, "length");
    const travelSpeed = num(inputs, "travelSpeed");
    const laborRate = num(inputs, "laborRate");
    const overheadRate = num(inputs, "overheadRate");
    const operatingFactor = num(inputs, "operatingFactor");
    const fillerCost = num(inputs, "fillerCost");
    const gasCost = num(inputs, "gasCost");
    const powerCost = num(inputs, "powerCost");
    return nonNegative(assertFinite((length / travelSpeed) * (laborRate + overheadRate) / operatingFactor + fillerCost + gasCost + powerCost));
  },
  },
  {
    id: "user.weld_cost_analysis_3",
    family: "cost",
    label: "Kaynak Maliyeti — CostPerMeter",
    fn: (inputs) => {
    const totalJointCost = num(inputs, "totalJointCost");
    const length = num(inputs, "length");
    return nonNegative(assertFinite(totalJointCost / length));
  },
  },
  {
    id: "user.weld_cost_analysis_4",
    family: "cost",
    label: "Kaynak Maliyeti — ConsumableCostPct",
    fn: (inputs) => {
    const fillerCost = num(inputs, "fillerCost");
    const totalJointCost = num(inputs, "totalJointCost");
    return nonNegative(assertFinite(fillerCost / totalJointCost));
  },
  },
  {
    id: "user.weld_cost_analysis_5",
    family: "cost",
    label: "Kaynak Maliyeti — LaborCostPct",
    fn: (inputs) => {
    const laborCost = num(inputs, "laborCost");
    const totalJointCost = num(inputs, "totalJointCost");
    return nonNegative(assertFinite(laborCost / totalJointCost));
  },
  },

  // ── Kaynak Mukavemeti (7 formulas) ──,
  {
    id: "user.weld_strength_0",
    family: "cost",
    label: "Kaynak Mukavemeti — ThroatThickness",
    fn: (inputs) => {
    const leg = num(inputs, "leg");
    const cos = num(inputs, "cos") || 0;
    return nonNegative(assertFinite(leg * Math.cos(45)));
  },
  },
  {
    id: "user.weld_strength_1",
    family: "cost",
    label: "Kaynak Mukavemeti — Area_Shear",
    fn: (inputs) => {
    const throatThickness = num(inputs, "throatThickness");
    const length = num(inputs, "length");
    return nonNegative(assertFinite(throatThickness * length));
  },
  },
  {
    id: "user.weld_strength_2",
    family: "cost",
    label: "Kaynak Mukavemeti — AllowableShearStress",
    fn: (inputs) => {
    const tensileStrength = num(inputs, "tensileStrength");
    const Electrode = num(inputs, "Electrode");
    const tensileStrength_Electrode = num(inputs, "tensileStrength_Electrode") || 0;
    return nonNegative(assertFinite(0.3 * tensileStrength_Electrode));
  },
  }
];
