import type {
  FormulaDefinition,
  FormulaInputs,
} from "@/lib/premium-schema/formula-registry";

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
export const CHUNK_10_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.cnc_cycle_time_5",
    family: "cost",
    label: "CNC ÇEVRİM SÜRESİ — T_total",
    fn: (inputs) => {
    const t = num(inputs, "t");
    const cut = num(inputs, "cut");
    const rapid = num(inputs, "rapid");
    const toolchange = num(inputs, "toolchange");
    const noncutting = num(inputs, "noncutting");
    const load = num(inputs, "load");
    const unload = num(inputs, "unload");
    const t_cut = num(inputs, "t_cut") || 0;
    const t_rapid = num(inputs, "t_rapid") || 0;
    const t_toolchange = num(inputs, "t_toolchange") || 0;
    const t_noncutting = num(inputs, "t_noncutting") || 0;
    const t_load_unload = num(inputs, "t_load_unload") || 0;
    return nonNegative(assertFinite(t_cut + t_rapid + t_toolchange + t_noncutting + t_load_unload));
  },
  },
  {
    id: "user.cnc_cycle_time_6",
    family: "cost",
    label: "CNC ÇEVRİM SÜRESİ — OEE_Availability",
    fn: (inputs) => {
    const planned = num(inputs, "planned");
    const downtime = num(inputs, "downtime");
    return nonNegative(assertFinite(planned / (planned + downtime)));
  },
  },

  // ── CNC İŞLEME MALİYETİ (6 formulas) ──,
  {
    id: "user.cnc_machining_cost_0",
    family: "cost",
    label: "CNC İŞLEME MALİYETİ — Cost_Material",
    fn: (inputs) => {
    const volume = num(inputs, "volume");
    const raw = num(inputs, "raw");
    const density = num(inputs, "density");
    const pricePerKg = num(inputs, "pricePerKg");
    const scrapRate = num(inputs, "scrapRate");
    const volume_raw = num(inputs, "volume_raw") || 0;
    return nonNegative(assertFinite(volume_raw * density * pricePerKg * (1 + scrapRate)));
  },
  },
  {
    id: "user.cnc_machining_cost_1",
    family: "cost",
    label: "CNC İŞLEME MALİYETİ — Cost_Machining",
    fn: (inputs) => {
    const t = num(inputs, "t");
    const total = num(inputs, "total");
    const machineRate = num(inputs, "machineRate");
    const t_total = num(inputs, "t_total") || 0;
    return nonNegative(assertFinite(t_total * machineRate));
  },
  },
  {
    id: "user.cnc_machining_cost_2",
    family: "cost",
    label: "CNC İŞLEME MALİYETİ — Cost_Tooling",
    fn: (inputs) => {
    const t = num(inputs, "t");
    const cut = num(inputs, "cut");
    const toolLife = num(inputs, "toolLife");
    const toolCost = num(inputs, "toolCost");
    const t_cut = num(inputs, "t_cut") || 0;
    return nonNegative(assertFinite((t_cut / toolLife) * toolCost));
  },
  },
  {
    id: "user.cnc_machining_cost_3",
    family: "cost",
    label: "CNC İŞLEME MALİYETİ — Cost_Energy",
    fn: (inputs) => {
    const power = num(inputs, "power");
    const t = num(inputs, "t");
    const total = num(inputs, "total");
    const elecRate = num(inputs, "elecRate");
    const t_total = num(inputs, "t_total") || 0;
    return nonNegative(assertFinite(power * t_total * elecRate));
  },
  },
  {
    id: "user.cnc_machining_cost_4",
    family: "cost",
    label: "CNC İŞLEME MALİYETİ — Cost_Overhead",
    fn: (inputs) => {
    const t = num(inputs, "t");
    const total = num(inputs, "total");
    const overheadRate = num(inputs, "overheadRate");
    const t_total = num(inputs, "t_total") || 0;
    return nonNegative(assertFinite(t_total * overheadRate));
  },
  },
  {
    id: "user.cnc_machining_cost_5",
    family: "cost",
    label: "CNC İŞLEME MALİYETİ — TotalUnitCost",
    fn: (inputs) => {
    const material = num(inputs, "material");
    const machining = num(inputs, "machining");
    const tooling = num(inputs, "tooling");
    const energy = num(inputs, "energy");
    const overhead = num(inputs, "overhead");
    const quality = num(inputs, "quality");
    return nonNegative(assertFinite(material + machining + tooling + energy + overhead + quality));
  },
  },

  // ── CPK TO PPM (9 formulas) ──,
  {
    id: "user.cpk_ppm_converter_0",
    family: "cost",
    label: "CPK TO PPM — Z_USL",
    fn: (inputs) => {
    const uSL = num(inputs, "uSL");
    const mean = num(inputs, "mean");
    const stdDev = num(inputs, "stdDev");
    return nonNegative(assertFinite((uSL - mean) / stdDev));
  },
  },
  {
    id: "user.cpk_ppm_converter_1",
    family: "cost",
    label: "CPK TO PPM — Z_LSL",
    fn: (inputs) => {
    const mean = num(inputs, "mean");
    const lSL = num(inputs, "lSL");
    const stdDev = num(inputs, "stdDev");
    return nonNegative(assertFinite((mean - lSL) / stdDev));
  },
  },
  {
    id: "user.cpk_ppm_converter_2",
    family: "cost",
    label: "CPK TO PPM — Cpk",
    fn: (inputs) => {
    const z = num(inputs, "z");
    const min = num(inputs, "min") || 0;
    const z_USL = num(inputs, "z_USL") || 0;
    const z_LSL = num(inputs, "z_LSL") || 0;
    return nonNegative(assertFinite(Math.min(z_USL, z_LSL) / 3));
  },
  },
  {
    id: "user.cpk_ppm_converter_3",
    family: "cost",
    label: "CPK TO PPM — P_USL",
    fn: (inputs) => {
    const z = num(inputs, "z");
    const __NORMSDIST__ = num(inputs, "__NORMSDIST__") || 0;
    const z_USL = num(inputs, "z_USL") || 0;
    return nonNegative(assertFinite(1 - normStd(z_USL)));
  },
  },
  {
    id: "user.cpk_ppm_converter_4",
    family: "cost",
    label: "CPK TO PPM — P_LSL",
    fn: (inputs) => {
    const z = num(inputs, "z");
    const __NORMSDIST__ = num(inputs, "__NORMSDIST__") || 0;
    const z_LSL = num(inputs, "z_LSL") || 0;
    return nonNegative(assertFinite(normStd(-z_LSL)));
  },
  },
  {
    id: "user.cpk_ppm_converter_5",
    family: "cost",
    label: "CPK TO PPM — P_Total",
    fn: (inputs) => {
    const p = num(inputs, "p");
    const p_USL = num(inputs, "p_USL") || 0;
    const p_LSL = num(inputs, "p_LSL") || 0;
    return nonNegative(assertFinite(p_USL + p_LSL));
  },
  },
  {
    id: "user.cpk_ppm_converter_6",
    family: "cost",
    label: "CPK TO PPM — PPM",
    fn: (inputs) => {
    const p = num(inputs, "p");
    const Total = num(inputs, "Total");
    const p_Total = num(inputs, "p_Total") || 0;
    return nonNegative(assertFinite(p_Total * 1000000));
  },
  }
];
