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
export const CHUNK_16_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.energy_consumption_report_6",
    family: "cost",
    label: "ENERGY CONSUMPTION REPORT — Total",
    fn: (inputs) => {
    const base = num(inputs, "base");
    const tOU = num(inputs, "tOU");
    const demand = num(inputs, "demand");
    const penalty = num(inputs, "penalty");
    const tax = num(inputs, "tax");
    return nonNegative(assertFinite(base + tOU + demand + penalty + tax));
  },
  },
  {
    id: "user.energy_consumption_report_7",
    family: "cost",
    label: "ENERGY CONSUMPTION REPORT — Carbon",
    fn: (inputs) => {
    const active = num(inputs, "active");
    const emisFactor = num(inputs, "emisFactor");
    const carbonPrice = num(inputs, "carbonPrice");
    return nonNegative(assertFinite(active * emisFactor * carbonPrice));
  },
  },

  // ── ENFLASYON ESKALASYON (8 formulas) ──,
  {
    id: "user.inflation_escalation_0",
    family: "cost",
    label: "ENFLASYON ESKALASYON — Esc_Mat",
    fn: (inputs) => {
    const infl = num(inputs, "infl");
    const Mat = num(inputs, "Mat");
    const years = num(inputs, "years");
    const infl_Mat = num(inputs, "infl_Mat") || 0;
    return nonNegative(assertFinite((1 + infl_Mat)**years));
  },
  },
  {
    id: "user.inflation_escalation_1",
    family: "cost",
    label: "ENFLASYON ESKALASYON — Esc_Lab",
    fn: (inputs) => {
    const infl = num(inputs, "infl");
    const Lab = num(inputs, "Lab");
    const years = num(inputs, "years");
    const infl_Lab = num(inputs, "infl_Lab") || 0;
    return nonNegative(assertFinite((1 + infl_Lab)**years));
  },
  },
  {
    id: "user.inflation_escalation_2",
    family: "cost",
    label: "ENFLASYON ESKALASYON — BaseAdj",
    fn: (inputs) => {
    const baseMat = num(inputs, "baseMat");
    const esc = num(inputs, "esc");
    const Mat = num(inputs, "Mat");
    const baseLab = num(inputs, "baseLab");
    const Lab = num(inputs, "Lab");
    const esc_Mat = num(inputs, "esc_Mat") || 0;
    const esc_Lab = num(inputs, "esc_Lab") || 0;
    return nonNegative(assertFinite(baseMat * esc_Mat + baseLab * esc_Lab));
  },
  },
  {
    id: "user.inflation_escalation_3",
    family: "cost",
    label: "ENFLASYON ESKALASYON — RealDisc",
    fn: (inputs) => {
    const nominal = num(inputs, "nominal");
    const infl = num(inputs, "infl");
    return nonNegative(assertFinite(((1 + nominal) / (1 + infl)) - 1));
  },
  },
  {
    id: "user.inflation_escalation_4",
    family: "cost",
    label: "ENFLASYON ESKALASYON — NPV_Nom",
    fn: (inputs) => {
    const cash = num(inputs, "cash");
    const esc = num(inputs, "esc");
    const nom = num(inputs, "nom");
    const t = num(inputs, "t");
    return nonNegative(assertFinite(SUM(cash * esc / (1 + nom)**t)));
  },
  },
  {
    id: "user.inflation_escalation_5",
    family: "cost",
    label: "ENFLASYON ESKALASYON — NPV_Real",
    fn: (inputs) => {
    const cash = num(inputs, "cash");
    const real = num(inputs, "real");
    const t = num(inputs, "t");
    return nonNegative(assertFinite(SUM(cash / (1 + real)**t)));
  },
  },
  {
    id: "user.inflation_escalation_6",
    family: "cost",
    label: "ENFLASYON ESKALASYON — Contingency",
    fn: (inputs) => {
    const baseAdj = num(inputs, "baseAdj");
    const confFactor = num(inputs, "confFactor");
    return nonNegative(assertFinite(baseAdj * confFactor));
  },
  },
  {
    id: "user.inflation_escalation_7",
    family: "cost",
    label: "ENFLASYON ESKALASYON — Total",
    fn: (inputs) => {
    const baseAdj = num(inputs, "baseAdj");
    const contingency = num(inputs, "contingency");
    return nonNegative(assertFinite(baseAdj + contingency));
  },
  },

  // ── ENVIRONMENTAL FIRE (8 formulas) ──,
  {
    id: "user.environmental_waste_cost_0",
    family: "cost",
    label: "ENVIRONMENTAL FIRE — Cost_Disp",
    fn: (inputs) => {
    const waste = num(inputs, "waste");
    const dispFee = num(inputs, "dispFee");
    return nonNegative(assertFinite(waste * dispFee));
  },
  },
  {
    id: "user.environmental_waste_cost_1",
    family: "cost",
    label: "ENVIRONMENTAL FIRE — Cost_Haz",
    fn: (inputs) => {
    const hazMass = num(inputs, "hazMass");
    const hazFee = num(inputs, "hazFee");
    const surcharge = num(inputs, "surcharge");
    return nonNegative(assertFinite(hazMass * (hazFee + surcharge)));
  },
  },
  {
    id: "user.environmental_waste_cost_2",
    family: "cost",
    label: "ENVIRONMENTAL FIRE — Cost_Recyc",
    fn: (inputs) => {
    const recycMass = num(inputs, "recycMass");
    const sortCost = num(inputs, "sortCost");
    const scrapRev = num(inputs, "scrapRev");
    return nonNegative(assertFinite(recycMass * (sortCost - scrapRev)));
  },
  },
  {
    id: "user.environmental_waste_cost_3",
    family: "cost",
    label: "ENVIRONMENTAL FIRE — Cost_Emis",
    fn: (inputs) => {
    const air = num(inputs, "air");
    const carbonPrice = num(inputs, "carbonPrice");
    const water = num(inputs, "water");
    const treatCost = num(inputs, "treatCost");
    return nonNegative(assertFinite(air * carbonPrice + water * treatCost));
  },
  },
  {
    id: "user.environmental_waste_cost_4",
    family: "cost",
    label: "ENVIRONMENTAL FIRE — PenaltyRisk",
    fn: (inputs) => {
    const probViolation = num(inputs, "probViolation");
    const fine = num(inputs, "fine");
    return nonNegative(assertFinite(probViolation * fine));
  },
  }
];
