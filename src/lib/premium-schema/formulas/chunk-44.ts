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

// @ts-expect-error TS2590 - chunk to avoid OOM
export const CHUNK_44_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.learning_curve_time_2",
    family: "cost",
    label: "Öğrenme Eğrisi Süre Tahmincisi — Time_N",
    fn: (inputs) => {
    const time = num(inputs, "time");
    const n = num(inputs, "n");
    const b = num(inputs, "b");
    const time_1 = num(inputs, "time_1") || 0;
    return nonNegative(assertFinite(time_1 * (n**b)));
  },
  },
  {
    id: "user.learning_curve_time_3",
    family: "cost",
    label: "Öğrenme Eğrisi Süre Tahmincisi — CumulativeTime_N",
    fn: (inputs) => {
    const time = num(inputs, "time");
    const n = num(inputs, "n");
    const b = num(inputs, "b");
    const time_1 = num(inputs, "time_1") || 0;
    return nonNegative(assertFinite(time_1 * (n**(b+1)) / (b+1)));
  },
  },
  {
    id: "user.learning_curve_time_4",
    family: "cost",
    label: "Öğrenme Eğrisi Süre Tahmincisi — AverageTime_N",
    fn: (inputs) => {
    const cumulativeTime = num(inputs, "cumulativeTime");
    const n = num(inputs, "n");
    const cumulativeTime_N = num(inputs, "cumulativeTime_N") || 0;
    return nonNegative(assertFinite(cumulativeTime_N / n));
  },
  },
  {
    id: "user.learning_curve_time_5",
    family: "cost",
    label: "Öğrenme Eğrisi Süre Tahmincisi — Cost_N",
    fn: (inputs) => {
    const time = num(inputs, "time");
    const laborRate = num(inputs, "laborRate");
    const time_N = num(inputs, "time_N") || 0;
    return nonNegative(assertFinite(time_N * laborRate));
  },
  },
  {
    id: "user.learning_curve_time_6",
    family: "cost",
    label: "Öğrenme Eğrisi Süre Tahmincisi — BreakevenUnit",
    fn: (inputs) => {
    return 0; // BreakevenUnit = N where StandardTime is reached — requires iteration
  },
  },
  {
    id: "user.learning_curve_time_7",
    family: "cost",
    label: "Öğrenme Eğrisi Süre Tahmincisi — TotalLaborCost",
    fn: (inputs) => {
    const cumulativeTime = num(inputs, "cumulativeTime");
    const laborRate = num(inputs, "laborRate");
    const cumulativeTime_N = num(inputs, "cumulativeTime_N") || 0;
    return nonNegative(assertFinite(cumulativeTime_N * laborRate));
  },
  },

  // ── Palet Rafı Optimize Edici (7 formulas) ──,
  {
    id: "user.pallet_rack_optimizer_0",
    family: "cost",
    label: "Palet Rafı Optimize Edici — RackCapacity",
    fn: (inputs) => {
    const bays = num(inputs, "bays");
    const levels = num(inputs, "levels");
    const palletsPerBay = num(inputs, "palletsPerBay");
    return nonNegative(assertFinite(bays * levels * palletsPerBay));
  },
  },
  {
    id: "user.pallet_rack_optimizer_1",
    family: "cost",
    label: "Palet Rafı Optimize Edici — FloorUtilization",
    fn: (inputs) => {
    const rackFootprint = num(inputs, "rackFootprint");
    const totalFloorArea = num(inputs, "totalFloorArea");
    return nonNegative(assertFinite(rackFootprint / totalFloorArea));
  },
  },
  {
    id: "user.pallet_rack_optimizer_2",
    family: "cost",
    label: "Palet Rafı Optimize Edici — Throughput",
    fn: (inputs) => {
    const aisles = num(inputs, "aisles");
    const forkliftSpeed = num(inputs, "forkliftSpeed");
    const travelDistance = num(inputs, "travelDistance");
    return nonNegative(assertFinite(aisles * forkliftSpeed * travelDistance**-1));
  },
  },
  {
    id: "user.pallet_rack_optimizer_3",
    family: "cost",
    label: "Palet Rafı Optimize Edici — Deflection",
    fn: (inputs) => {
    const load = num(inputs, "load");
    const beamLength = num(inputs, "beamLength");
    const e = num(inputs, "e");
    const i = num(inputs, "i");
    return nonNegative(assertFinite((5 * load * beamLength**3) / (384 * e * i)));
  },
  },
  {
    id: "user.pallet_rack_optimizer_4",
    family: "cost",
    label: "Palet Rafı Optimize Edici — SafetyFactor",
    fn: (inputs) => {
    const maxLoadCapacity = num(inputs, "maxLoadCapacity");
    const actualLoad = num(inputs, "actualLoad");
    return nonNegative(assertFinite(maxLoadCapacity / actualLoad));
  },
  },
  {
    id: "user.pallet_rack_optimizer_5",
    family: "cost",
    label: "Palet Rafı Optimize Edici — CostPerPosition",
    fn: (inputs) => {
    const totalRackCost = num(inputs, "totalRackCost");
    const rackCapacity = num(inputs, "rackCapacity");
    return nonNegative(assertFinite(totalRackCost / rackCapacity));
  },
  },
  {
    id: "user.pallet_rack_optimizer_6",
    family: "cost",
    label: "Palet Rafı Optimize Edici — RetrievalTime",
    fn: (inputs) => {
    const travelTime = num(inputs, "travelTime");
    const Horizontal = num(inputs, "Horizontal");
    const Vertical = num(inputs, "Vertical");
    const pickTime = num(inputs, "pickTime");
    const travelTime_Horizontal = num(inputs, "travelTime_Horizontal") || 0;
    const travelTime_Vertical = num(inputs, "travelTime_Vertical") || 0;
    return nonNegative(assertFinite(travelTime_Horizontal + travelTime_Vertical + pickTime));
  },
  },

  // ── Poka-Yoke ROI (7 formulas) ──,
  {
    id: "user.poka_yoke_roi_0",
    family: "cost",
    label: "Poka-Yoke ROI — CurrentDefectRate",
    fn: (inputs) => {
    const defects = num(inputs, "defects");
    const totalUnits = num(inputs, "totalUnits");
    return nonNegative(assertFinite(defects / totalUnits));
  },
  },
  {
    id: "user.poka_yoke_roi_1",
    family: "cost",
    label: "Poka-Yoke ROI — DefectCost_Annual",
    fn: (inputs) => {
    const currentDefectRate = num(inputs, "currentDefectRate");
    const totalUnits = num(inputs, "totalUnits");
    const costPerDefect = num(inputs, "costPerDefect");
    return nonNegative(assertFinite(currentDefectRate * totalUnits * costPerDefect));
  },
  }
];
