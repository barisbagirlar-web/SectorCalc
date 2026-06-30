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
export const CHUNK_04_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.auto_shop_margin_leak_2",
    family: "cost",
    label: "AUTO SHOP MARJ KAÇAK — ProductivityRate",
    fn: (inputs) => {
    const totalFlagHours = num(inputs, "totalFlagHours");
    const totalAvailableHours = num(inputs, "totalAvailableHours");
    return nonNegative(assertFinite(totalFlagHours / totalAvailableHours));
  },
  },
  {
    id: "user.auto_shop_margin_leak_3",
    family: "cost",
    label: "AUTO SHOP MARJ KAÇAK — MarginLeak_Discount",
    fn: (inputs) => {
    const discount = num(inputs, "discount");
    const totalRevenue = num(inputs, "totalRevenue");
    return nonNegative(assertFinite(SUM(discount) / totalRevenue));
  },
  },
  {
    id: "user.auto_shop_margin_leak_4",
    family: "cost",
    label: "AUTO SHOP MARJ KAÇAK — MarginLeak_Shrinkage",
    fn: (inputs) => {
    const inventoryShrinkage = num(inputs, "inventoryShrinkage");
    const partsCOGS = num(inputs, "partsCOGS");
    return nonNegative(assertFinite(inventoryShrinkage / partsCOGS));
  },
  },
  {
    id: "user.auto_shop_margin_leak_5",
    family: "cost",
    label: "AUTO SHOP MARJ KAÇAK — NetMargin",
    fn: (inputs) => {
    const totalRevenue = num(inputs, "totalRevenue");
    const totalCOGS = num(inputs, "totalCOGS");
    const totalOpEx = num(inputs, "totalOpEx");
    return nonNegative(assertFinite((totalRevenue - totalCOGS - totalOpEx) / totalRevenue));
  },
  },
  {
    id: "user.auto_shop_margin_leak_6",
    family: "cost",
    label: "AUTO SHOP MARJ KAÇAK — AnnualLeakage",
    fn: (inputs) => {
    const totalRevenue = num(inputs, "totalRevenue");
    const targetMargin = num(inputs, "targetMargin");
    const netMargin = num(inputs, "netMargin");
    return nonNegative(assertFinite(totalRevenue * (targetMargin - netMargin)));
  },
  },

  // ── BASINÇ VESSEL KALINLIK (6 formulas) ──,
  {
    id: "user.asme_pressure_vessel_0",
    family: "cost",
    label: "BASINÇ VESSEL KALINLIK — t_shell",
    fn: (inputs) => {
    const p = num(inputs, "p");
    const r = num(inputs, "r");
    const s = num(inputs, "s");
    const e = num(inputs, "e");
    const c = num(inputs, "c");
    const c_A = num(inputs, "c_A") || 0;
    return nonNegative(assertFinite((p * r) / (s * e - 0.6 * p) + c_A));
  },
  },
  {
    id: "user.asme_pressure_vessel_1",
    family: "cost",
    label: "BASINÇ VESSEL KALINLIK — t_sphere",
    fn: (inputs) => {
    const p = num(inputs, "p");
    const r = num(inputs, "r");
    const s = num(inputs, "s");
    const e = num(inputs, "e");
    const c = num(inputs, "c");
    const c_A = num(inputs, "c_A") || 0;
    return nonNegative(assertFinite((p * r) / (2 * s * e - 0.2 * p) + c_A));
  },
  },
  {
    id: "user.asme_pressure_vessel_2",
    family: "cost",
    label: "BASINÇ VESSEL KALINLIK — t_head_ellip",
    fn: (inputs) => {
    const p = num(inputs, "p");
    const d = num(inputs, "d");
    const s = num(inputs, "s");
    const e = num(inputs, "e");
    const c = num(inputs, "c");
    const c_A = num(inputs, "c_A") || 0;
    return nonNegative(assertFinite((p * d) / (2 * s * e - 0.2 * p) + c_A));
  },
  },
  {
    id: "user.asme_pressure_vessel_3",
    family: "cost",
    label: "BASINÇ VESSEL KALINLIK — M",
    fn: (inputs) => {
    const l = num(inputs, "l");
    const r = num(inputs, "r");
    const sqrt = num(inputs, "sqrt") || 0;
    return nonNegative(assertFinite(0.25 * (3 + Math.sqrt(l/r))**2));
  },
  },
  {
    id: "user.asme_pressure_vessel_4",
    family: "cost",
    label: "BASINÇ VESSEL KALINLIK — t_head_tori",
    fn: (inputs) => {
    const p = num(inputs, "p");
    const l = num(inputs, "l");
    const m = num(inputs, "m");
    const s = num(inputs, "s");
    const e = num(inputs, "e");
    const c = num(inputs, "c");
    const c_A = num(inputs, "c_A") || 0;
    return nonNegative(assertFinite((p * l * m) / (2 * s * e - 0.2 * p) + c_A));
  },
  },
  {
    id: "user.asme_pressure_vessel_5",
    family: "cost",
    label: "BASINÇ VESSEL KALINLIK — MAWP",
    fn: (inputs) => {
    const s = num(inputs, "s");
    const e = num(inputs, "e");
    const t = num(inputs, "t");
    const c = num(inputs, "c");
    const r = num(inputs, "r");
    const c_A = num(inputs, "c_A") || 0;
    return nonNegative(assertFinite((s * e * (t - c_A)) / (r + 0.6 * (t - c_A))));
  },
  },

  // ── BASINÇLI HAVA ENERJİ (5 formulas) ──,
  {
    id: "user.compressed_air_energy_cost_0",
    family: "cost",
    label: "BASINÇLI HAVA ENERJİ — CompressorPower",
    fn: (inputs) => {
    const q = num(inputs, "q");
    const deltaP = num(inputs, "deltaP");
    const eff = num(inputs, "eff");
    const isothermal = num(inputs, "isothermal");
    const motor = num(inputs, "motor");
    const drive = num(inputs, "drive");
    const eff_isothermal = num(inputs, "eff_isothermal") || 0;
    const eff_motor = num(inputs, "eff_motor") || 0;
    const eff_drive = num(inputs, "eff_drive") || 0;
    return nonNegative(assertFinite((q * deltaP) / (eff_isothermal * eff_motor * eff_drive)));
  },
  },
  {
    id: "user.compressed_air_energy_cost_1",
    family: "cost",
    label: "BASINÇLI HAVA ENERJİ — SpecificPower",
    fn: (inputs) => {
    const compressorPower = num(inputs, "compressorPower");
    const q = num(inputs, "q");
    const actual = num(inputs, "actual");
    const q_actual = num(inputs, "q_actual") || 0;
    return nonNegative(assertFinite(compressorPower / q_actual));
  },
  },
  {
    id: "user.compressed_air_energy_cost_2",
    family: "cost",
    label: "BASINÇLI HAVA ENERJİ — AnnualEnergyCost",
    fn: (inputs) => {
    const compressorPower = num(inputs, "compressorPower");
    const opHours = num(inputs, "opHours");
    const elecRate = num(inputs, "elecRate");
    const loadFactor = num(inputs, "loadFactor");
    return nonNegative(assertFinite(compressorPower * opHours * elecRate * loadFactor));
  },
  },
  {
    id: "user.compressed_air_energy_cost_3",
    family: "cost",
    label: "BASINÇLI HAVA ENERJİ — LeakageCost",
    fn: (inputs) => {
    const leakFlow = num(inputs, "leakFlow");
    const opHours = num(inputs, "opHours");
    const specificPower = num(inputs, "specificPower");
    const elecRate = num(inputs, "elecRate");
    return nonNegative(assertFinite(SUM(leakFlow * opHours * specificPower * elecRate)));
  },
  }
];
