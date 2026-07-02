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
export const CHUNK_48_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.robot_vs_manual_1",
    family: "cost",
    label: "Robot Kol vs. Manuel Isci - RobotCost_Annual",
    fn: (inputs) => {
    const robotCapex = num(inputs, "robotCapex");
    const depreciationLife = num(inputs, "depreciationLife");
    const maintenance = num(inputs, "maintenance");
    const energy = num(inputs, "energy");
    const programmerCost = num(inputs, "programmerCost");
    return nonNegative(assertFinite((robotCapex / depreciationLife) + maintenance + energy + programmerCost));
  },
  },
  {
    id: "user.robot_vs_manual_2",
    family: "cost",
    label: "Robot Kol vs. Manuel Isci - RobotOutput",
    fn: (inputs) => {
    const cycleTime = num(inputs, "cycleTime");
    const Robot = num(inputs, "Robot");
    const uptime = num(inputs, "uptime");
    const cycleTime_Robot = num(inputs, "cycleTime_Robot") || 0;
    return nonNegative(assertFinite(cycleTime_Robot**-1 * uptime));
  },
  },
  {
    id: "user.robot_vs_manual_3",
    family: "cost",
    label: "Robot Kol vs. Manuel Isci - ManualOutput",
    fn: (inputs) => {
    const cycleTime = num(inputs, "cycleTime");
    const Manual = num(inputs, "Manual");
    const efficiency = num(inputs, "efficiency");
    const cycleTime_Manual = num(inputs, "cycleTime_Manual") || 0;
    return nonNegative(assertFinite(cycleTime_Manual**-1 * efficiency));
  },
  },
  {
    id: "user.robot_vs_manual_4",
    family: "cost",
    label: "Robot Kol vs. Manuel Isci - CostPerUnit_Manual",
    fn: (inputs) => {
    const manualCost = num(inputs, "manualCost");
    const Annual = num(inputs, "Annual");
    const manualOutput = num(inputs, "manualOutput");
    const manualCost_Annual = num(inputs, "manualCost_Annual") || 0;
    return nonNegative(assertFinite(manualCost_Annual / manualOutput));
  },
  },
  {
    id: "user.robot_vs_manual_5",
    family: "cost",
    label: "Robot Kol vs. Manuel Isci - CostPerUnit_Robot",
    fn: (inputs) => {
    const robotCost = num(inputs, "robotCost");
    const Annual = num(inputs, "Annual");
    const robotOutput = num(inputs, "robotOutput");
    const robotCost_Annual = num(inputs, "robotCost_Annual") || 0;
    return nonNegative(assertFinite(robotCost_Annual / robotOutput));
  },
  },
  {
    id: "user.robot_vs_manual_6",
    family: "cost",
    label: "Robot Kol vs. Manuel Isci - ROI",
    fn: (inputs) => {
    const manualCost = num(inputs, "manualCost");
    const robotCost = num(inputs, "robotCost");
    const robotCapex = num(inputs, "robotCapex");
    return nonNegative(assertFinite((manualCost - robotCost) / robotCapex));
  },
  },
  {
    id: "user.robot_vs_manual_7",
    family: "cost",
    label: "Robot Kol vs. Manuel Isci - Payback",
    fn: (inputs) => {
    const robotCapex = num(inputs, "robotCapex");
    const manualCost = num(inputs, "manualCost");
    const Annual = num(inputs, "Annual");
    const robotCost = num(inputs, "robotCost");
    const manualCost_Annual = num(inputs, "manualCost_Annual") || 0;
    const robotCost_Annual = num(inputs, "robotCost_Annual") || 0;
    return nonNegative(assertFinite(robotCapex / (manualCost_Annual - robotCost_Annual)));
  },
  },

  // ── Rota Maliyet (8 formulas) ──,
  {
    id: "user.route_cost_0",
    family: "cost",
    label: "Rota Maliyet - DistanceCost",
    fn: (inputs) => {
    const totalDistance = num(inputs, "totalDistance");
    const fuelConsumption = num(inputs, "fuelConsumption");
    const fuelPrice = num(inputs, "fuelPrice");
    return nonNegative(assertFinite(totalDistance * fuelConsumption * fuelPrice));
  },
  },
  {
    id: "user.route_cost_1",
    family: "cost",
    label: "Rota Maliyet - TimeCost",
    fn: (inputs) => {
    const totalTime = num(inputs, "totalTime");
    const driverWage = num(inputs, "driverWage");
    const vehicleDepreciation = num(inputs, "vehicleDepreciation");
    return nonNegative(assertFinite(totalTime * (driverWage + vehicleDepreciation)));
  },
  },
  {
    id: "user.route_cost_2",
    family: "cost",
    label: "Rota Maliyet - TollCost",
    fn: (inputs) => {
    const tolls = num(inputs, "tolls");
    const i = num(inputs, "i");
    const tolls_i = num(inputs, "tolls_i") || 0;
    return nonNegative(assertFinite(SUM(tolls_i)));
  },
  },
  {
    id: "user.route_cost_3",
    family: "cost",
    label: "Rota Maliyet - MaintenanceCost",
    fn: (inputs) => {
    const totalDistance = num(inputs, "totalDistance");
    const maintRatePerKm = num(inputs, "maintRatePerKm");
    return nonNegative(assertFinite(totalDistance * maintRatePerKm));
  },
  },
  {
    id: "user.route_cost_4",
    family: "cost",
    label: "Rota Maliyet - Overhead",
    fn: (inputs) => {
    const distanceCost = num(inputs, "distanceCost");
    const timeCost = num(inputs, "timeCost");
    const overheadPct = num(inputs, "overheadPct");
    return nonNegative(assertFinite((distanceCost + timeCost) * overheadPct));
  },
  },
  {
    id: "user.route_cost_5",
    family: "cost",
    label: "Rota Maliyet - TotalRouteCost",
    fn: (inputs) => {
    const distanceCost = num(inputs, "distanceCost");
    const timeCost = num(inputs, "timeCost");
    const tollCost = num(inputs, "tollCost");
    const maintenanceCost = num(inputs, "maintenanceCost");
    const overhead = num(inputs, "overhead");
    return nonNegative(assertFinite(distanceCost + timeCost + tollCost + maintenanceCost + overhead));
  },
  },
  {
    id: "user.route_cost_6",
    family: "cost",
    label: "Rota Maliyet - CostPerKm",
    fn: (inputs) => {
    const totalRouteCost = num(inputs, "totalRouteCost");
    const totalDistance = num(inputs, "totalDistance");
    return nonNegative(assertFinite(totalRouteCost / totalDistance));
  },
  },
  {
    id: "user.route_cost_7",
    family: "cost",
    label: "Rota Maliyet - CostPerDrop",
    fn: (inputs) => {
    const totalRouteCost = num(inputs, "totalRouteCost");
    const numberOfDrops = num(inputs, "numberOfDrops");
    return nonNegative(assertFinite(totalRouteCost / numberOfDrops));
  },
  },

  // ── Rota Optimizasyonu Analizoru (7 formulas) ──
];
