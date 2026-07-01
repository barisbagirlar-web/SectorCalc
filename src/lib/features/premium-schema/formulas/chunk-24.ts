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
export const CHUNK_24_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.scrap_rate_optimize_1",
    family: "cost",
    label: "HURDA RATIO OPTIMIZE — Cost_Mat",
    fn: (inputs) => {
    const scrapQty = num(inputs, "scrapQty");
    const matCost = num(inputs, "matCost");
    return nonNegative(assertFinite(scrapQty * matCost));
  },
  },
  {
    id: "user.scrap_rate_optimize_2",
    family: "cost",
    label: "HURDA RATIO OPTIMIZE — Cost_Lab",
    fn: (inputs) => {
    const scrapQty = num(inputs, "scrapQty");
    const cycle = num(inputs, "cycle");
    const labRate = num(inputs, "labRate");
    return nonNegative(assertFinite(scrapQty * cycle * labRate));
  },
  },
  {
    id: "user.scrap_rate_optimize_3",
    family: "cost",
    label: "HURDA RATIO OPTIMIZE — Cost_OH",
    fn: (inputs) => {
    const scrapQty = num(inputs, "scrapQty");
    const cycle = num(inputs, "cycle");
    const machRate = num(inputs, "machRate");
    return nonNegative(assertFinite(scrapQty * cycle * machRate));
  },
  },
  {
    id: "user.scrap_rate_optimize_4",
    family: "cost",
    label: "HURDA RATIO OPTIMIZE — OppCost",
    fn: (inputs) => {
    const scrapQty = num(inputs, "scrapQty");
    const unitMargin = num(inputs, "unitMargin");
    return nonNegative(assertFinite(scrapQty * unitMargin));
  },
  },
  {
    id: "user.scrap_rate_optimize_5",
    family: "cost",
    label: "HURDA RATIO OPTIMIZE — TotalCost",
    fn: (inputs) => {
    const mat = num(inputs, "mat");
    const lab = num(inputs, "lab");
    const oH = num(inputs, "oH");
    const opp = num(inputs, "opp");
    const salvage = num(inputs, "salvage");
    return nonNegative(assertFinite(mat + lab + oH + opp - salvage));
  },
  },
  {
    id: "user.scrap_rate_optimize_6",
    family: "cost",
    label: "HURDA RATIO OPTIMIZE — Pareto",
    fn: (inputs) => {
      // COMPLEX: Pareto = SORT(Defects, Freq, DESC)
      // Requires external implementation
      return 0;
    },
  },
  {
    id: "user.scrap_rate_optimize_7",
    family: "cost",
    label: "HURDA RATIO OPTIMIZE — Target",
    fn: (inputs) => {
    const benchmark = num(inputs, "benchmark");
    const impFactor = num(inputs, "impFactor");
    return nonNegative(assertFinite(benchmark * (1 - impFactor)));
  },
  },

  // ── HVAC CAPACITY (9 formulas) ──,
  {
    id: "user.hvac_capacity_0",
    family: "cost",
    label: "HVAC CAPACITY — Sensible",
    fn: (inputs) => {
    const cFM = num(inputs, "cFM");
    const deltaT = num(inputs, "deltaT");
    return nonNegative(assertFinite(1.08 * cFM * deltaT));
  },
  },
  {
    id: "user.hvac_capacity_1",
    family: "cost",
    label: "HVAC CAPACITY — Latent",
    fn: (inputs) => {
    const cFM = num(inputs, "cFM");
    const deltaW = num(inputs, "deltaW");
    return nonNegative(assertFinite(0.68 * cFM * deltaW));
  },
  },
  {
    id: "user.hvac_capacity_2",
    family: "cost",
    label: "HVAC CAPACITY — Total",
    fn: (inputs) => {
    const sensible = num(inputs, "sensible");
    const latent = num(inputs, "latent");
    return nonNegative(assertFinite(sensible + latent));
  },
  },
  {
    id: "user.hvac_capacity_3",
    family: "cost",
    label: "HVAC CAPACITY — Envelope",
    fn: (inputs) => {
    const u = num(inputs, "u");
    const area = num(inputs, "area");
    const deltaT = num(inputs, "deltaT");
    return nonNegative(assertFinite(u * area * deltaT));
  },
  },
  {
    id: "user.hvac_capacity_4",
    family: "cost",
    label: "HVAC CAPACITY — Internal",
    fn: (inputs) => {
    const occ = num(inputs, "occ");
    const sensPer = num(inputs, "sensPer");
    const light = num(inputs, "light");
    const equip = num(inputs, "equip");
    return nonNegative(assertFinite(occ * sensPer + light + equip));
  },
  },
  {
    id: "user.hvac_capacity_5",
    family: "cost",
    label: "HVAC CAPACITY — Vent",
    fn: (inputs) => {
    const cFM = num(inputs, "cFM");
    const Out = num(inputs, "Out");
    const t = num(inputs, "t");
    const In = num(inputs, "In");
    const cFM_Out = num(inputs, "cFM_Out") || 0;
    const t_Out = num(inputs, "t_Out") || 0;
    const t_In = num(inputs, "t_In") || 0;
    return nonNegative(assertFinite(cFM_Out * 1.08 * (t_Out - t_In)));
  },
  },
  {
    id: "user.hvac_capacity_6",
    family: "cost",
    label: "HVAC CAPACITY — Tons",
    fn: (inputs) => {
    const total = num(inputs, "total");
    return nonNegative(assertFinite(total / 12000));
  },
  },
  {
    id: "user.hvac_capacity_7",
    family: "cost",
    label: "HVAC CAPACITY — EER",
    fn: (inputs) => {
    const bTU = num(inputs, "bTU");
    const w = num(inputs, "w");
    return nonNegative(assertFinite(bTU / w));
  },
  }
];
