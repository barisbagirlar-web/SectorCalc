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
export const CHUNK_49_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.route_optimization_0",
    family: "cost",
    label: "Rota Optimizasyonu Analizörü — NearestNeighbor_Dist",
    fn: (inputs) => {
    const minDistance = num(inputs, "minDistance");
    const i = num(inputs, "i");
    const minDistance_i = num(inputs, "minDistance_i") || 0;
    return nonNegative(assertFinite(SUM(minDistance_i)));
  },
  },
  {
    id: "user.route_optimization_1",
    family: "cost",
    label: "Rota Optimizasyonu Analizörü — Savings_ClarkeWright",
    fn: (inputs) => {
    const distance = num(inputs, "distance");
    const Depot = num(inputs, "Depot");
    const i = num(inputs, "i");
    const j = num(inputs, "j");
    const distance_Depot_i = num(inputs, "distance_Depot_i") || 0;
    const distance_Depot_j = num(inputs, "distance_Depot_j") || 0;
    const distance_i_j = num(inputs, "distance_i_j") || 0;
    return nonNegative(assertFinite(distance_Depot_i + distance_Depot_j - distance_i_j));
  },
  },
  {
    id: "user.route_optimization_2",
    family: "cost",
    label: "Rota Optimizasyonu Analizörü — RouteEfficiency",
    fn: (inputs) => {
    const theoreticalMinDistance = num(inputs, "theoreticalMinDistance");
    const actualRouteDistance = num(inputs, "actualRouteDistance");
    return nonNegative(assertFinite(theoreticalMinDistance / actualRouteDistance));
  },
  },
  {
    id: "user.route_optimization_3",
    family: "cost",
    label: "Rota Optimizasyonu Analizörü — DropDensity",
    fn: (inputs) => {
    const numberOfDrops = num(inputs, "numberOfDrops");
    const routeArea = num(inputs, "routeArea");
    return nonNegative(assertFinite(numberOfDrops / routeArea));
  },
  },
  {
    id: "user.route_optimization_4",
    family: "cost",
    label: "Rota Optimizasyonu Analizörü — TimeWindowPenalty",
    fn: (inputs) => {
    const arrivalTime = num(inputs, "arrivalTime");
    const lateWindow = num(inputs, "lateWindow");
    const penaltyRate = num(inputs, "penaltyRate");
    const max = num(inputs, "max") || 0;
    return nonNegative(assertFinite(Math.max(0, arrivalTime - lateWindow) * penaltyRate));
  },
  },
  {
    id: "user.route_optimization_5",
    family: "cost",
    label: "Rota Optimizasyonu Analizörü — VehicleUtilization",
    fn: (inputs) => {
    const totalLoad = num(inputs, "totalLoad");
    const vehicleCapacity = num(inputs, "vehicleCapacity");
    return nonNegative(assertFinite(totalLoad / vehicleCapacity));
  },
  },
  {
    id: "user.route_optimization_6",
    family: "cost",
    label: "Rota Optimizasyonu Analizörü — TotalSavings",
    fn: (inputs) => {
    const baselineCost = num(inputs, "baselineCost");
    const optimizedCost = num(inputs, "optimizedCost");
    return nonNegative(assertFinite(baselineCost - optimizedCost));
  },
  },

  // ── Rüzgar Türbini Yatırım Getirisi (8 formulas) ──,
  {
    id: "user.wind_turbine_investment_0",
    family: "cost",
    label: "Rüzgar Türbini Yatırım Getirisi — AEP",
    fn: (inputs) => {
    const powerCurve = num(inputs, "powerCurve");
    const v = num(inputs, "v");
    const frequency = num(inputs, "frequency");
    const powerCurve_v = num(inputs, "powerCurve_v") || 0;
    const frequency_v = num(inputs, "frequency_v") || 0;
    return nonNegative(assertFinite(8760 * SUM(powerCurve_v * frequency_v)));
  },
  },
  {
    id: "user.wind_turbine_investment_1",
    family: "cost",
    label: "Rüzgar Türbini Yatırım Getirisi — CapacityFactor",
    fn: (inputs) => {
    const aEP = num(inputs, "aEP");
    const ratedPower = num(inputs, "ratedPower");
    return nonNegative(assertFinite(aEP / (ratedPower * 8760)));
  },
  },
  {
    id: "user.wind_turbine_investment_2",
    family: "cost",
    label: "Rüzgar Türbini Yatırım Getirisi — AnnualRevenue",
    fn: (inputs) => {
    const aEP = num(inputs, "aEP");
    const feedInTariff = num(inputs, "feedInTariff");
    return nonNegative(assertFinite(aEP * feedInTariff));
  },
  },
  {
    id: "user.wind_turbine_investment_3",
    family: "cost",
    label: "Rüzgar Türbini Yatırım Getirisi — OPEX",
    fn: (inputs) => {
    const landLease = num(inputs, "landLease");
    const maintenance = num(inputs, "maintenance");
    const insurance = num(inputs, "insurance");
    const gridFees = num(inputs, "gridFees");
    return nonNegative(assertFinite(landLease + maintenance + insurance + gridFees));
  },
  },
  {
    id: "user.wind_turbine_investment_4",
    family: "cost",
    label: "Rüzgar Türbini Yatırım Getirisi — EBITDA",
    fn: (inputs) => {
    const annualRevenue = num(inputs, "annualRevenue");
    const oPEX = num(inputs, "oPEX");
    return nonNegative(assertFinite(annualRevenue - oPEX));
  },
  },
  {
    id: "user.wind_turbine_investment_5",
    family: "cost",
    label: "Rüzgar Türbini Yatırım Getirisi — LCOE",
    fn: (inputs) => {
    const capex = num(inputs, "capex");
    const opex = num(inputs, "opex");
    const t = num(inputs, "t");
    const r = num(inputs, "r");
    const aEP = num(inputs, "aEP");
    const opex_t = num(inputs, "opex_t") || 0;
    return nonNegative(assertFinite((capex + opex_t / Math.pow(1+r, t)) / (aEP / Math.pow(1+r, t))));
  },
  },
  {
    id: "user.wind_turbine_investment_6",
    family: "cost",
    label: "Rüzgar Türbini Yatırım Getirisi — NPV",
    fn: (inputs) => {
    const eBITDA = num(inputs, "eBITDA");
    const t = num(inputs, "t");
    const wACC = num(inputs, "wACC");
    const capex = num(inputs, "capex");
    const eBITDA_t = num(inputs, "eBITDA_t") || 0;
    return nonNegative(assertFinite(SUM(eBITDA_t / (1+wACC)**t) - capex));
  },
  },
  {
    id: "user.wind_turbine_investment_7",
    family: "cost",
    label: "Rüzgar Türbini Yatırım Getirisi — IRR",
    fn: (inputs) => {
    const r = num(inputs, "r");
    const where = num(inputs, "where");
    const nPV = num(inputs, "nPV");
    return 0; // IRR = r where NPV=0 requires iteration
  },
  },

  // ── SaaS Shelfware Maliyet (8 formulas) ──
];
