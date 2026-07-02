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
export const CHUNK_25_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.hvac_capacity_8",
    family: "cost",
    label: "HVAC CAPACITY - AnnualCost",
    fn: (inputs) => {
    const total = num(inputs, "total");
    const eER = num(inputs, "eER");
    const hours = num(inputs, "hours");
    const elecRate = num(inputs, "elecRate");
    return nonNegative(assertFinite((total / eER) * hours * elecRate));
  },
  },

  // ── HYDRAULIC SYSTEM KAYIP (8 formulas) ──,
  {
    id: "user.hydraulic_system_loss_0",
    family: "cost",
    label: "HYDRAULIC SYSTEM KAYIP - Loss_Leak",
    fn: (inputs) => {
    const q = num(inputs, "q");
    const Leak = num(inputs, "Leak");
    const p = num(inputs, "p");
    const q_Leak = num(inputs, "q_Leak") || 0;
    return nonNegative(assertFinite(q_Leak * p));
  },
  },
  {
    id: "user.hydraulic_system_loss_1",
    family: "cost",
    label: "HYDRAULIC SYSTEM KAYIP - Loss_Fric",
    fn: (inputs) => {
    const deltaP = num(inputs, "deltaP");
    const Pipe = num(inputs, "Pipe");
    const q = num(inputs, "q");
    const Flow = num(inputs, "Flow");
    const deltaP_Pipe = num(inputs, "deltaP_Pipe") || 0;
    const q_Flow = num(inputs, "q_Flow") || 0;
    return nonNegative(assertFinite(deltaP_Pipe * q_Flow));
  },
  },
  {
    id: "user.hydraulic_system_loss_2",
    family: "cost",
    label: "HYDRAULIC SYSTEM KAYIP - Loss_Valve",
    fn: (inputs) => {
    const deltaP = num(inputs, "deltaP");
    const Valve = num(inputs, "Valve");
    const q = num(inputs, "q");
    const Flow = num(inputs, "Flow");
    const deltaP_Valve = num(inputs, "deltaP_Valve") || 0;
    const q_Flow = num(inputs, "q_Flow") || 0;
    return nonNegative(assertFinite(deltaP_Valve * q_Flow));
  },
  },
  {
    id: "user.hydraulic_system_loss_3",
    family: "cost",
    label: "HYDRAULIC SYSTEM KAYIP - Heat",
    fn: (inputs) => {
    const loss = num(inputs, "loss");
    const Leak = num(inputs, "Leak");
    const Fric = num(inputs, "Fric");
    const Valve = num(inputs, "Valve");
    const loss_Leak = num(inputs, "loss_Leak") || 0;
    const loss_Fric = num(inputs, "loss_Fric") || 0;
    const loss_Valve = num(inputs, "loss_Valve") || 0;
    return nonNegative(assertFinite(loss_Leak + loss_Fric + loss_Valve));
  },
  },
  {
    id: "user.hydraulic_system_loss_4",
    family: "cost",
    label: "HYDRAULIC SYSTEM KAYIP - Eff",
    fn: (inputs) => {
    const p = num(inputs, "p");
    const Out = num(inputs, "Out");
    const In = num(inputs, "In");
    const p_Out = num(inputs, "p_Out") || 0;
    const p_In = num(inputs, "p_In") || 0;
    return nonNegative(assertFinite((p_Out / p_In) * 100));
  },
  },
  {
    id: "user.hydraulic_system_loss_5",
    family: "cost",
    label: "HYDRAULIC SYSTEM KAYIP - Cost_Loss",
    fn: (inputs) => {
    const heat = num(inputs, "heat");
    const hours = num(inputs, "hours");
    const elecRate = num(inputs, "elecRate");
    return nonNegative(assertFinite(heat * hours * elecRate));
  },
  },
  {
    id: "user.hydraulic_system_loss_6",
    family: "cost",
    label: "HYDRAULIC SYSTEM KAYIP - Degrade",
    fn: (inputs) => {
    const t = num(inputs, "t");
    const Avg = num(inputs, "Avg");
    const thresh = num(inputs, "thresh");
    const fluidCost = num(inputs, "fluidCost");
    const t_Avg = num(inputs, "t_Avg") || 0;
    return nonNegative(assertFinite((t_Avg - thresh) * fluidCost));
  },
  },
  {
    id: "user.hydraulic_system_loss_7",
    family: "cost",
    label: "HYDRAULIC SYSTEM KAYIP - Cool",
    fn: (inputs) => {
    const heat = num(inputs, "heat");
    const cOP = num(inputs, "cOP");
    const elecRate = num(inputs, "elecRate");
    return nonNegative(assertFinite(heat * cOP * elecRate));
  },
  },

  // ── ISI EXCHANGER FOULING (8 formulas) ──,
  {
    id: "user.heat_exchanger_fouling_0",
    family: "cost",
    label: "ISI EXCHANGER FOULING - R_foul",
    fn: (inputs) => {
    const u = num(inputs, "u");
    const dirty = num(inputs, "dirty");
    const clean = num(inputs, "clean");
    const u_dirty = num(inputs, "u_dirty") || 0;
    const u_clean = num(inputs, "u_clean") || 0;
    return nonNegative(assertFinite((1 / u_dirty) - (1 / u_clean)));
  },
  },
  {
    id: "user.heat_exchanger_fouling_1",
    family: "cost",
    label: "ISI EXCHANGER FOULING - Loss",
    fn: (inputs) => {
    const area = num(inputs, "area");
    const u = num(inputs, "u");
    const clean = num(inputs, "clean");
    const lMTD = num(inputs, "lMTD");
    const dirty = num(inputs, "dirty");
    const u_clean = num(inputs, "u_clean") || 0;
    const u_dirty = num(inputs, "u_dirty") || 0;
    return nonNegative(assertFinite(area * u_clean * lMTD - area * u_dirty * lMTD));
  },
  },
  {
    id: "user.heat_exchanger_fouling_2",
    family: "cost",
    label: "ISI EXCHANGER FOULING - EnergyPen",
    fn: (inputs) => {
    const loss = num(inputs, "loss");
    const hours = num(inputs, "hours");
    const boilEff = num(inputs, "boilEff");
    return nonNegative(assertFinite(loss * hours / boilEff));
  },
  },
  {
    id: "user.heat_exchanger_fouling_3",
    family: "cost",
    label: "ISI EXCHANGER FOULING - Cost_Energy",
    fn: (inputs) => {
    const energyPen = num(inputs, "energyPen");
    const fuelCost = num(inputs, "fuelCost");
    return nonNegative(assertFinite(energyPen * fuelCost));
  },
  },
  {
    id: "user.heat_exchanger_fouling_4",
    family: "cost",
    label: "ISI EXCHANGER FOULING - DP_Inc",
    fn: (inputs) => {
    const deltaP = num(inputs, "deltaP");
    const dirty = num(inputs, "dirty");
    const clean = num(inputs, "clean");
    const deltaP_dirty = num(inputs, "deltaP_dirty") || 0;
    const deltaP_clean = num(inputs, "deltaP_clean") || 0;
    return nonNegative(assertFinite(deltaP_dirty - deltaP_clean));
  },
  },
  {
    id: "user.heat_exchanger_fouling_5",
    family: "cost",
    label: "ISI EXCHANGER FOULING - PumpInc",
    fn: (inputs) => {
    const dP = num(inputs, "dP");
    const Inc = num(inputs, "Inc");
    const flow = num(inputs, "flow");
    const hours = num(inputs, "hours");
    const pumpEff = num(inputs, "pumpEff");
    const dP_Inc = num(inputs, "dP_Inc") || 0;
    return nonNegative(assertFinite(dP_Inc * flow * hours / pumpEff));
  },
  }
];
