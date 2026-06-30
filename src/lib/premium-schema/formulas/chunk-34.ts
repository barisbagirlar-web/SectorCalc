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
export const CHUNK_34_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.compressed_air_leak_4",
    family: "cost",
    label: "Kompresör Kaçağı Maliyet — TotalLeakCost",
    fn: (inputs) => {
    const cost = num(inputs, "cost");
    const Leak = num(inputs, "Leak");
    const i = num(inputs, "i");
    const cost_Leak_i = num(inputs, "cost_Leak_i") || 0;
    return nonNegative(assertFinite(SUM(cost_Leak_i)));
  },
  },
  {
    id: "user.compressed_air_leak_5",
    family: "cost",
    label: "Kompresör Kaçağı Maliyet — CarbonEmissions",
    fn: (inputs) => {
    const annualEnergyLoss = num(inputs, "annualEnergyLoss");
    const gridEmissionFactor = num(inputs, "gridEmissionFactor");
    return nonNegative(assertFinite(annualEnergyLoss * gridEmissionFactor));
  },
  },
  {
    id: "user.compressed_air_leak_6",
    family: "cost",
    label: "Kompresör Kaçağı Maliyet — Payback_Repair",
    fn: (inputs) => {
    const repairCost = num(inputs, "repairCost");
    const cost = num(inputs, "cost");
    const Leak = num(inputs, "Leak");
    const cost_Leak = num(inputs, "cost_Leak") || 0;
    return nonNegative(assertFinite(repairCost / cost_Leak));
  },
  },

  // ── Kompresör Tankı Boyutlandırma (9 formulas) ──,
  {
    id: "user.compressor_tank_sizing_0",
    family: "cost",
    label: "Kompresör Tankı Boyutlandırma — V_Tank",
    fn: (inputs) => {
    const t = num(inputs, "t");
    const q = num(inputs, "q");
    const p = num(inputs, "p");
    const atm = num(inputs, "atm");
    const Max = num(inputs, "Max");
    const Min = num(inputs, "Min");
    const p_atm = num(inputs, "p_atm") || 0;
    const p_Max = num(inputs, "p_Max") || 0;
    const p_Min = num(inputs, "p_Min") || 0;
    return nonNegative(assertFinite((t * q * p_atm) / (p_Max - p_Min)));
  },
  },
  {
    id: "user.compressor_tank_sizing_1",
    family: "cost",
    label: "Kompresör Tankı Boyutlandırma — t",
    fn: (inputs) => {
    const timeToFill = num(inputs, "timeToFill");
    return nonNegative(assertFinite(timeToFill));
  },
  },
  {
    id: "user.compressor_tank_sizing_2",
    family: "cost",
    label: "Kompresör Tankı Boyutlandırma — Q",
    fn: (inputs) => {
    const freeAirDelivery = num(inputs, "freeAirDelivery");
    return nonNegative(assertFinite(freeAirDelivery));
  },
  },
  {
    id: "user.compressor_tank_sizing_3",
    family: "cost",
    label: "Kompresör Tankı Boyutlandırma — P_Max",
    fn: (inputs) => {
    const cutOutPressure = num(inputs, "cutOutPressure");
    return nonNegative(assertFinite(cutOutPressure));
  },
  },
  {
    id: "user.compressor_tank_sizing_4",
    family: "cost",
    label: "Kompresör Tankı Boyutlandırma — P_Min",
    fn: (inputs) => {
    const cutInPressure = num(inputs, "cutInPressure");
    return nonNegative(assertFinite(cutInPressure));
  },
  },
  {
    id: "user.compressor_tank_sizing_5",
    family: "cost",
    label: "Kompresör Tankı Boyutlandırma — CycleTime",
    fn: (inputs) => {
    const v = num(inputs, "v");
    const Tank = num(inputs, "Tank");
    const p = num(inputs, "p");
    const Max = num(inputs, "Max");
    const Min = num(inputs, "Min");
    const q = num(inputs, "q");
    const atm = num(inputs, "atm");
    const v_Tank = num(inputs, "v_Tank") || 0;
    const p_Max = num(inputs, "p_Max") || 0;
    const p_Min = num(inputs, "p_Min") || 0;
    const p_atm = num(inputs, "p_atm") || 0;
    return nonNegative(assertFinite(v_Tank * (p_Max - p_Min) / (q * p_atm)));
  },
  },
  {
    id: "user.compressor_tank_sizing_6",
    family: "cost",
    label: "Kompresör Tankı Boyutlandırma — CyclesPerHour",
    fn: (inputs) => {
    const cycleTime = num(inputs, "cycleTime");
    return nonNegative(assertFinite(60 / cycleTime));
  },
  },
  {
    id: "user.compressor_tank_sizing_7",
    family: "cost",
    label: "Kompresör Tankı Boyutlandırma — MotorStartLimit",
    fn: (inputs) => {
    const cyclesPerHour = num(inputs, "cyclesPerHour");
    const maxStarts = num(inputs, "maxStarts");
    const fAIL = num(inputs, "fAIL");
    const pASS = num(inputs, "pASS");
    return nonNegative(assertFinite(((cyclesPerHour > maxStarts) ? 1 : 0)));
  },
  },
  {
    id: "user.compressor_tank_sizing_8",
    family: "cost",
    label: "Kompresör Tankı Boyutlandırma — Cost_Tank",
    fn: (inputs) => {
    const volume = num(inputs, "volume");
    const pricePerLiter = num(inputs, "pricePerLiter");
    return nonNegative(assertFinite(volume * pricePerLiter));
  },
  },

  // ── Konteyner Yükü (7 formulas) ──,
  {
    id: "user.container_load_0",
    family: "cost",
    label: "Konteyner Yükü — Volume_Utilization",
    fn: (inputs) => {
    const itemVolume = num(inputs, "itemVolume");
    const i = num(inputs, "i");
    const containerMaxVolume = num(inputs, "containerMaxVolume");
    const itemVolume_i = num(inputs, "itemVolume_i") || 0;
    return nonNegative(assertFinite(SUM(itemVolume_i) / containerMaxVolume));
  },
  },
  {
    id: "user.container_load_1",
    family: "cost",
    label: "Konteyner Yükü — Weight_Utilization",
    fn: (inputs) => {
    const itemWeight = num(inputs, "itemWeight");
    const i = num(inputs, "i");
    const containerMaxPayload = num(inputs, "containerMaxPayload");
    const itemWeight_i = num(inputs, "itemWeight_i") || 0;
    return nonNegative(assertFinite(SUM(itemWeight_i) / containerMaxPayload));
  },
  },
  {
    id: "user.container_load_2",
    family: "cost",
    label: "Konteyner Yükü — ChargeableWeight",
    fn: (inputs) => {
    const grossWeight = num(inputs, "grossWeight");
    const volumetricWeight = num(inputs, "volumetricWeight");
    const max = num(inputs, "max") || 0;
    return nonNegative(assertFinite(Math.max(grossWeight, volumetricWeight)));
  },
  }
];
