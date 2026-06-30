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
export const CHUNK_13_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.smed_changeover_matrix_6",
    family: "cost",
    label: "DEĞİŞİM MATRİSİ SMED — AnnualSavings",
    fn: (inputs) => {
    const t = num(inputs, "t");
    const total = num(inputs, "total");
    const target = num(inputs, "target");
    const freq = num(inputs, "freq");
    const rate = num(inputs, "rate");
    const t_total = num(inputs, "t_total") || 0;
    const t_target = num(inputs, "t_target") || 0;
    return nonNegative(assertFinite((t_total - t_target) * freq * rate));
  },
  },
  {
    id: "user.smed_changeover_matrix_7",
    family: "cost",
    label: "DEĞİŞİM MATRİSİ SMED — CapacityGain",
    fn: (inputs) => {
    const t = num(inputs, "t");
    const total = num(inputs, "total");
    const target = num(inputs, "target");
    const freq = num(inputs, "freq");
    const available = num(inputs, "available");
    const t_total = num(inputs, "t_total") || 0;
    const t_target = num(inputs, "t_target") || 0;
    return nonNegative(assertFinite((t_total - t_target) * freq / available));
  },
  },

  // ── DEPO YERLEŞİMİ (8 formulas) ──,
  {
    id: "user.warehouse_layout_0",
    family: "cost",
    label: "DEPO YERLEŞİMİ — StorageArea",
    fn: (inputs) => {
    const footprint = num(inputs, "footprint");
    const utilRate = num(inputs, "utilRate");
    return nonNegative(assertFinite(footprint * utilRate));
  },
  },
  {
    id: "user.warehouse_layout_1",
    family: "cost",
    label: "DEPO YERLEŞİMİ — PalletPositions",
    fn: (inputs) => {
    const storageArea = num(inputs, "storageArea");
    const palletFootprint = num(inputs, "palletFootprint");
    const aisleFactor = num(inputs, "aisleFactor");
    return nonNegative(assertFinite(storageArea / (palletFootprint * aisleFactor)));
  },
  },
  {
    id: "user.warehouse_layout_2",
    family: "cost",
    label: "DEPO YERLEŞİMİ — VerticalCap",
    fn: (inputs) => {
    const palletPositions = num(inputs, "palletPositions");
    const rackLevels = num(inputs, "rackLevels");
    return nonNegative(assertFinite(palletPositions * rackLevels));
  },
  },
  {
    id: "user.warehouse_layout_3",
    family: "cost",
    label: "DEPO YERLEŞİMİ — ThroughputCap",
    fn: (inputs) => {
    const doors = num(inputs, "doors");
    const turnaround = num(inputs, "turnaround");
    const Load = num(inputs, "Load");
    const Unload = num(inputs, "Unload");
    const turnaround_Load = num(inputs, "turnaround_Load") || 0;
    const turnaround_Unload = num(inputs, "turnaround_Unload") || 0;
    return nonNegative(assertFinite(doors / (turnaround_Load + turnaround_Unload)));
  },
  },
  {
    id: "user.warehouse_layout_4",
    family: "cost",
    label: "DEPO YERLEŞİMİ — TravelDist",
    fn: (inputs) => {
    const freq = num(inputs, "freq");
    const dist = num(inputs, "dist");
    return nonNegative(assertFinite(SUM(freq * dist)));
  },
  },
  {
    id: "user.warehouse_layout_5",
    family: "cost",
    label: "DEPO YERLEŞİMİ — PickEfficiency",
    fn: (inputs) => {
    const lines = num(inputs, "lines");
    const travelTime = num(inputs, "travelTime");
    return nonNegative(assertFinite(lines / travelTime));
  },
  },
  {
    id: "user.warehouse_layout_6",
    family: "cost",
    label: "DEPO YERLEŞİMİ — CubeUtil",
    fn: (inputs) => {
    const actualVol = num(inputs, "actualVol");
    const rackVol = num(inputs, "rackVol");
    return nonNegative(assertFinite(actualVol / rackVol));
  },
  },
  {
    id: "user.warehouse_layout_7",
    family: "cost",
    label: "DEPO YERLEŞİMİ — CostPerPos",
    fn: (inputs) => {
    const facilityCost = num(inputs, "facilityCost");
    const palletPositions = num(inputs, "palletPositions");
    return nonNegative(assertFinite(facilityCost / palletPositions));
  },
  },

  // ── DEVAMSIZLIK MALİYETİ (7 formulas) ──,
  {
    id: "user.absenteeism_cost_0",
    family: "cost",
    label: "DEVAMSIZLIK MALİYETİ — DirectCost",
    fn: (inputs) => {
    const absentHours = num(inputs, "absentHours");
    const hourlyRate = num(inputs, "hourlyRate");
    const burden = num(inputs, "burden");
    return nonNegative(assertFinite(absentHours * hourlyRate * (1 + burden)));
  },
  },
  {
    id: "user.absenteeism_cost_1",
    family: "cost",
    label: "DEVAMSIZLIK MALİYETİ — OvertimePremium",
    fn: (inputs) => {
    const replaceOT = num(inputs, "replaceOT");
    const oTRate = num(inputs, "oTRate");
    const regRate = num(inputs, "regRate");
    return nonNegative(assertFinite(replaceOT * (oTRate - regRate)));
  },
  },
  {
    id: "user.absenteeism_cost_2",
    family: "cost",
    label: "DEVAMSIZLIK MALİYETİ — TempCost",
    fn: (inputs) => {
    const tempHours = num(inputs, "tempHours");
    const tempRate = num(inputs, "tempRate");
    const markup = num(inputs, "markup");
    return nonNegative(assertFinite(tempHours * tempRate * (1 + markup)));
  },
  },
  {
    id: "user.absenteeism_cost_3",
    family: "cost",
    label: "DEVAMSIZLIK MALİYETİ — ProdLoss",
    fn: (inputs) => {
    const absentHours = num(inputs, "absentHours");
    const outputPerHour = num(inputs, "outputPerHour");
    const margin = num(inputs, "margin");
    const effDrop = num(inputs, "effDrop");
    return nonNegative(assertFinite(absentHours * outputPerHour * margin * effDrop));
  },
  },
  {
    id: "user.absenteeism_cost_4",
    family: "cost",
    label: "DEVAMSIZLIK MALİYETİ — AdminCost",
    fn: (inputs) => {
    const events = num(inputs, "events");
    const hR = num(inputs, "hR");
    const Time = num(inputs, "Time");
    const hRRate = num(inputs, "hRRate");
    const hR_Time = num(inputs, "hR_Time") || 0;
    return nonNegative(assertFinite(events * hR_Time * hRRate));
  },
  }
];
