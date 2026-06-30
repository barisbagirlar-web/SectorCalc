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
export const CHUNK_22_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.fertilizer_dosage_2",
    family: "cost",
    label: "GÜBRE DOZAJ — FertNeed",
    fn: (inputs) => {
    const nutReq = num(inputs, "nutReq");
    const soilSupp = num(inputs, "soilSupp");
    const eff = num(inputs, "eff");
    return nonNegative(assertFinite((nutReq - soilSupp) / eff));
  },
  },
  {
    id: "user.fertilizer_dosage_3",
    family: "cost",
    label: "GÜBRE DOZAJ — AppRate",
    fn: (inputs) => {
    const fertNeed = num(inputs, "fertNeed");
    const contentPct = num(inputs, "contentPct");
    return nonNegative(assertFinite(fertNeed / contentPct));
  },
  },
  {
    id: "user.fertilizer_dosage_4",
    family: "cost",
    label: "GÜBRE DOZAJ — Cost",
    fn: (inputs) => {
    const appRate = num(inputs, "appRate");
    const area = num(inputs, "area");
    const price = num(inputs, "price");
    return nonNegative(assertFinite(appRate * area * price));
  },
  },
  {
    id: "user.fertilizer_dosage_5",
    family: "cost",
    label: "GÜBRE DOZAJ — EnvRisk",
    fn: (inputs) => {
    const appRate = num(inputs, "appRate");
    const uptake = num(inputs, "uptake");
    const leach = num(inputs, "leach");
    return nonNegative(assertFinite((appRate - uptake) * leach));
  },
  },
  {
    id: "user.fertilizer_dosage_6",
    family: "cost",
    label: "GÜBRE DOZAJ — ROI",
    fn: (inputs) => {
    const yieldInc = num(inputs, "yieldInc");
    const cropPrice = num(inputs, "cropPrice");
    const cost = num(inputs, "cost");
    return nonNegative(assertFinite((yieldInc * cropPrice - cost) / cost));
  },
  },
  {
    id: "user.fertilizer_dosage_7",
    family: "cost",
    label: "GÜBRE DOZAJ — Precision",
    fn: (inputs) => {
    const baseRate = num(inputs, "baseRate");
    const zoneFactor = num(inputs, "zoneFactor");
    return nonNegative(assertFinite(baseRate * (1 + zoneFactor)));
  },
  },

  // ── HACCP DEVIATION (8 formulas) ──,
  {
    id: "user.haccp_deviation_cost_0",
    family: "cost",
    label: "HACCP DEVIATION — Cost_Hold",
    fn: (inputs) => {
    const quarVol = num(inputs, "quarVol");
    const holdCost = num(inputs, "holdCost");
    const days = num(inputs, "days");
    return nonNegative(assertFinite(quarVol * holdCost * days));
  },
  },
  {
    id: "user.haccp_deviation_cost_1",
    family: "cost",
    label: "HACCP DEVIATION — Cost_Test",
    fn: (inputs) => {
    const samples = num(inputs, "samples");
    const labCost = num(inputs, "labCost");
    return nonNegative(assertFinite(samples * labCost));
  },
  },
  {
    id: "user.haccp_deviation_cost_2",
    family: "cost",
    label: "HACCP DEVIATION — Cost_Rework",
    fn: (inputs) => {
    const devVol = num(inputs, "devVol");
    const reworkCost = num(inputs, "reworkCost");
    return nonNegative(assertFinite(devVol * reworkCost));
  },
  },
  {
    id: "user.haccp_deviation_cost_3",
    family: "cost",
    label: "HACCP DEVIATION — Cost_Disp",
    fn: (inputs) => {
    const condVol = num(inputs, "condVol");
    const dispCost = num(inputs, "dispCost");
    const lostMat = num(inputs, "lostMat");
    return nonNegative(assertFinite(condVol * dispCost + lostMat));
  },
  },
  {
    id: "user.haccp_deviation_cost_4",
    family: "cost",
    label: "HACCP DEVIATION — Cost_Recall",
    fn: (inputs) => {
    const notif = num(inputs, "notif");
    const Rev = num(inputs, "Rev");
    const retailPen = num(inputs, "retailPen");
    const brand = num(inputs, "brand");
    const log_Rev = num(inputs, "log_Rev") || 0;
    return nonNegative(assertFinite(notif + log_Rev + retailPen + brand));
  },
  },
  {
    id: "user.haccp_deviation_cost_5",
    family: "cost",
    label: "HACCP DEVIATION — Fine",
    fn: (inputs) => {
    const probDet = num(inputs, "probDet");
    const fineAmt = num(inputs, "fineAmt");
    return nonNegative(assertFinite(probDet * fineAmt));
  },
  },
  {
    id: "user.haccp_deviation_cost_6",
    family: "cost",
    label: "HACCP DEVIATION — Total",
    fn: (inputs) => {
    const hold = num(inputs, "hold");
    const test = num(inputs, "test");
    const rework = num(inputs, "rework");
    const disp = num(inputs, "disp");
    const recall = num(inputs, "recall");
    const fine = num(inputs, "fine");
    return nonNegative(assertFinite(hold + test + rework + disp + recall + fine));
  },
  },
  {
    id: "user.haccp_deviation_cost_7",
    family: "cost",
    label: "HACCP DEVIATION — RPN",
    fn: (inputs) => {
    const sev = num(inputs, "sev");
    const occ = num(inputs, "occ");
    const det = num(inputs, "det");
    return nonNegative(assertFinite(sev * occ * det));
  },
  },

  // ── HACİMSEL AĞIRLIK (8 formulas) ──,
  {
    id: "user.volumetric_weight_chargeable_0",
    family: "cost",
    label: "HACİMSEL AĞIRLIK — VolWeight_Air",
    fn: (inputs) => {
    const l = num(inputs, "l");
    const w = num(inputs, "w");
    const h = num(inputs, "h");
    return nonNegative(assertFinite((l * w * h) / 6000));
  },
  }
];
