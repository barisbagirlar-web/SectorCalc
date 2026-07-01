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
export const CHUNK_32_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.weld_strength_3",
    family: "cost",
    label: "Kaynak Mukavemeti — MaxLoad_Shear",
    fn: (inputs) => {
    const area = num(inputs, "area");
    const Shear = num(inputs, "Shear");
    const allowableShearStress = num(inputs, "allowableShearStress");
    const area_Shear = num(inputs, "area_Shear") || 0;
    return nonNegative(assertFinite(area_Shear * allowableShearStress));
  },
  },
  {
    id: "user.weld_strength_4",
    family: "cost",
    label: "Kaynak Mukavemeti — SafetyFactor",
    fn: (inputs) => {
    const maxLoad = num(inputs, "maxLoad");
    const Shear = num(inputs, "Shear");
    const appliedLoad = num(inputs, "appliedLoad");
    const maxLoad_Shear = num(inputs, "maxLoad_Shear") || 0;
    return nonNegative(assertFinite(maxLoad_Shear / appliedLoad));
  },
  },
  {
    id: "user.weld_strength_5",
    family: "cost",
    label: "Kaynak Mukavemeti — BendingStress",
    fn: (inputs) => {
    const appliedMoment = num(inputs, "appliedMoment");
    const throatThickness = num(inputs, "throatThickness");
    const momentOfInertia = num(inputs, "momentOfInertia");
    return nonNegative(assertFinite((appliedMoment * throatThickness) / momentOfInertia));
  },
  },
  {
    id: "user.weld_strength_6",
    family: "cost",
    label: "Kaynak Mukavemeti — CombinedStress",
    fn: (inputs) => {
    const shearStress = num(inputs, "shearStress");
    const bendingStress = num(inputs, "bendingStress");
    const sqrt = num(inputs, "sqrt") || 0;
    return nonNegative(assertFinite(Math.sqrt(shearStress**2 + bendingStress**2)));
  },
  },

  // ── Kesim Parameters Takim omru (6 formulas) ──,
  {
    id: "user.cutting_tool_life_0",
    family: "cost",
    label: "Kesim Parameters Takim omru — ToolLife_T",
    fn: (inputs) => {
    const c = num(inputs, "c");
    const v = num(inputs, "v");
    const n = num(inputs, "n");
    const f = num(inputs, "f");
    const m = num(inputs, "m");
    const a = num(inputs, "a");
    const p = num(inputs, "p");
    const k = num(inputs, "k");
    const v_c = num(inputs, "v_c") || 0;
    const a_p = num(inputs, "a_p") || 0;
    return nonNegative(assertFinite(c / (v_c**n * f**m * a_p**k)));
  },
  },
  {
    id: "user.cutting_tool_life_1",
    family: "cost",
    label: "Kesim Parameters Takim omru — TaylorExponent_n",
    fn: (inputs) => {
    const t1 = num(inputs, "t1");
    const t2 = num(inputs, "t2");
    const v1 = num(inputs, "v1");
    const v2 = num(inputs, "v2");
    const log = num(inputs, "log") || 0;
    return nonNegative(assertFinite(-Math.log(t1/t2) / Math.log(v1/v2)));
  },
  },
  {
    id: "user.cutting_tool_life_2",
    family: "cost",
    label: "Kesim Parameters Takim omru — CostPerPart_Tool",
    fn: (inputs) => {
    const toolCost = num(inputs, "toolCost");
    const edges = num(inputs, "edges");
    const machiningTime = num(inputs, "machiningTime");
    const toolLife = num(inputs, "toolLife");
    return nonNegative(assertFinite((toolCost / edges) * (machiningTime / toolLife)));
  },
  },
  {
    id: "user.cutting_tool_life_3",
    family: "cost",
    label: "Kesim Parameters Takim omru — OptimalToolLife_Cost",
    fn: (inputs) => {
    const n = num(inputs, "n");
    const toolChangeTime = num(inputs, "toolChangeTime");
    const toolCost = num(inputs, "toolCost");
    const edges = num(inputs, "edges");
    const machineRate = num(inputs, "machineRate");
    return nonNegative(assertFinite(((1/n - 1) * (toolChangeTime + toolCost/edges / machineRate))));
  },
  },
  {
    id: "user.cutting_tool_life_4",
    family: "cost",
    label: "Kesim Parameters Takim omru — Optimal_Vc",
    fn: (inputs) => {
    const c = num(inputs, "c");
    const optimalToolLife = num(inputs, "optimalToolLife");
    const Cost = num(inputs, "Cost");
    const n = num(inputs, "n");
    const optimalToolLife_Cost = num(inputs, "optimalToolLife_Cost") || 0;
    return nonNegative(assertFinite(c / (optimalToolLife_Cost**n)));
  },
  },
  {
    id: "user.cutting_tool_life_5",
    family: "cost",
    label: "Kesim Parameters Takim omru — ProductionRate",
    fn: (inputs) => {
    const machiningTime = num(inputs, "machiningTime");
    const toolLife = num(inputs, "toolLife");
    const toolChangeTime = num(inputs, "toolChangeTime");
    return nonNegative(assertFinite(1 / (machiningTime + (machiningTime / toolLife) * toolChangeTime)));
  },
  },

  // ── Kesme-Dolgu Denge (8 formulas) ──,
  {
    id: "user.cut_fill_balance_0",
    family: "cost",
    label: "Kesme-Dolgu Denge — Volume_Cut",
    fn: (inputs) => {
    const area = num(inputs, "area");
    const Cut = num(inputs, "Cut");
    const i = num(inputs, "i");
    const distance = num(inputs, "distance");
    const area_Cut_i = num(inputs, "area_Cut_i") || 0;
    const distance_i = num(inputs, "distance_i") || 0;
    return nonNegative(assertFinite(SUM(area_Cut_i * distance_i)));
  },
  },
  {
    id: "user.cut_fill_balance_1",
    family: "cost",
    label: "Kesme-Dolgu Denge — Volume_Fill",
    fn: (inputs) => {
    const area = num(inputs, "area");
    const Fill = num(inputs, "Fill");
    const i = num(inputs, "i");
    const distance = num(inputs, "distance");
    const area_Fill_i = num(inputs, "area_Fill_i") || 0;
    const distance_i = num(inputs, "distance_i") || 0;
    return nonNegative(assertFinite(SUM(area_Fill_i * distance_i)));
  },
  },
  {
    id: "user.cut_fill_balance_2",
    family: "cost",
    label: "Kesme-Dolgu Denge — ShrinkageFactor",
    fn: (inputs) => {
    const compactedVolume = num(inputs, "compactedVolume");
    const looseVolume = num(inputs, "looseVolume");
    return nonNegative(assertFinite(1 - (compactedVolume / looseVolume)));
  },
  },
  {
    id: "user.cut_fill_balance_3",
    family: "cost",
    label: "Kesme-Dolgu Denge — SwellFactor",
    fn: (inputs) => {
    const looseVolume = num(inputs, "looseVolume");
    const bankVolume = num(inputs, "bankVolume");
    return nonNegative(assertFinite(looseVolume / bankVolume));
  },
  },
  {
    id: "user.cut_fill_balance_4",
    family: "cost",
    label: "Kesme-Dolgu Denge — NetBalance",
    fn: (inputs) => {
    const volume = num(inputs, "volume");
    const Cut = num(inputs, "Cut");
    const Fill = num(inputs, "Fill");
    const shrinkageFactor = num(inputs, "shrinkageFactor");
    const volume_Cut = num(inputs, "volume_Cut") || 0;
    const volume_Fill = num(inputs, "volume_Fill") || 0;
    return nonNegative(assertFinite(volume_Cut - (volume_Fill * shrinkageFactor)));
  },
  }
];
