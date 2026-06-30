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
export const CHUNK_36_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.currency_risk_5",
    family: "cost",
    label: "Kur Riski — CostOfHedge",
    fn: (inputs) => {
    const notional = num(inputs, "notional");
    const forwardPoints = num(inputs, "forwardPoints");
    return nonNegative(assertFinite(notional * forwardPoints));
  },
  },
  {
    id: "user.currency_risk_6",
    family: "cost",
    label: "Kur Riski — NetImpact",
    fn: (inputs) => {
    const spotRate = num(inputs, "spotRate");
    const forwardRate = num(inputs, "forwardRate");
    const hedgedExposure = num(inputs, "hedgedExposure");
    return nonNegative(assertFinite((spotRate - forwardRate) * hedgedExposure));
  },
  },

  // ── KWh Maliyet (7 formulas) ──,
  {
    id: "user.kwh_cost_0",
    family: "cost",
    label: "KWh Maliyet — EnergyCharge",
    fn: (inputs) => {
    const activeEnergy = num(inputs, "activeEnergy");
    const energyRate = num(inputs, "energyRate");
    return nonNegative(assertFinite(activeEnergy * energyRate));
  },
  },
  {
    id: "user.kwh_cost_1",
    family: "cost",
    label: "KWh Maliyet — DemandCharge",
    fn: (inputs) => {
    const peakDemand = num(inputs, "peakDemand");
    const demandRate = num(inputs, "demandRate");
    return nonNegative(assertFinite(peakDemand * demandRate));
  },
  },
  {
    id: "user.kwh_cost_2",
    family: "cost",
    label: "KWh Maliyet — ReactivePenalty",
    fn: (inputs) => {
    const powerFactor = num(inputs, "powerFactor");
    const threshold = num(inputs, "threshold");
    const reactiveEnergy = num(inputs, "reactiveEnergy");
    const penaltyRate = num(inputs, "penaltyRate");
    return nonNegative(assertFinite(((powerFactor < threshold) ? (reactiveEnergy * penaltyRate) : (0))));
  },
  },
  {
    id: "user.kwh_cost_3",
    family: "cost",
    label: "KWh Maliyet — TaxesAndFees",
    fn: (inputs) => {
    const energyCharge = num(inputs, "energyCharge");
    const demandCharge = num(inputs, "demandCharge");
    const taxRate = num(inputs, "taxRate");
    return nonNegative(assertFinite((energyCharge + demandCharge) * taxRate));
  },
  },
  {
    id: "user.kwh_cost_4",
    family: "cost",
    label: "KWh Maliyet — TotalBill",
    fn: (inputs) => {
    const energyCharge = num(inputs, "energyCharge");
    const demandCharge = num(inputs, "demandCharge");
    const reactivePenalty = num(inputs, "reactivePenalty");
    const taxesAndFees = num(inputs, "taxesAndFees");
    return nonNegative(assertFinite(energyCharge + demandCharge + reactivePenalty + taxesAndFees));
  },
  },
  {
    id: "user.kwh_cost_5",
    family: "cost",
    label: "KWh Maliyet — UnitCost_kWh",
    fn: (inputs) => {
    const totalBill = num(inputs, "totalBill");
    const activeEnergy = num(inputs, "activeEnergy");
    return nonNegative(assertFinite(totalBill / activeEnergy));
  },
  },
  {
    id: "user.kwh_cost_6",
    family: "cost",
    label: "KWh Maliyet — PeakShavingSavings",
    fn: (inputs) => {
    const oldPeak = num(inputs, "oldPeak");
    const newPeak = num(inputs, "newPeak");
    const demandRate = num(inputs, "demandRate");
    return nonNegative(assertFinite((oldPeak - newPeak) * demandRate));
  },
  },

  // ── Lojistik Rota Kaybı (7 formulas) ──,
  {
    id: "user.logistics_route_loss_0",
    family: "cost",
    label: "Lojistik Rota Kaybı — IdealDistance",
    fn: (inputs) => {
    const pointToPoint = num(inputs, "pointToPoint");
    const Distance = num(inputs, "Distance");
    const pointToPoint_Distance = num(inputs, "pointToPoint_Distance") || 0;
    return nonNegative(assertFinite(pointToPoint_Distance));
  },
  },
  {
    id: "user.logistics_route_loss_1",
    family: "cost",
    label: "Lojistik Rota Kaybı — ActualDistance",
    fn: (inputs) => {
    const routeDistance = num(inputs, "routeDistance");
    return nonNegative(assertFinite(routeDistance));
  },
  },
  {
    id: "user.logistics_route_loss_2",
    family: "cost",
    label: "Lojistik Rota Kaybı — DriftPct",
    fn: (inputs) => {
    const actualDistance = num(inputs, "actualDistance");
    const idealDistance = num(inputs, "idealDistance");
    return nonNegative(assertFinite((actualDistance - idealDistance) / idealDistance));
  },
  },
  {
    id: "user.logistics_route_loss_3",
    family: "cost",
    label: "Lojistik Rota Kaybı — FuelWaste",
    fn: (inputs) => {
    const actualDistance = num(inputs, "actualDistance");
    const idealDistance = num(inputs, "idealDistance");
    const fuelConsumptionRate = num(inputs, "fuelConsumptionRate");
    const fuelPrice = num(inputs, "fuelPrice");
    return nonNegative(assertFinite((actualDistance - idealDistance) * fuelConsumptionRate * fuelPrice));
  },
  },
  {
    id: "user.logistics_route_loss_4",
    family: "cost",
    label: "Lojistik Rota Kaybı — TimeWaste",
    fn: (inputs) => {
    const actualDistance = num(inputs, "actualDistance");
    const idealDistance = num(inputs, "idealDistance");
    const avgSpeed = num(inputs, "avgSpeed");
    const driverHourlyRate = num(inputs, "driverHourlyRate");
    return nonNegative(assertFinite((actualDistance - idealDistance) / avgSpeed * driverHourlyRate));
  },
  },
  {
    id: "user.logistics_route_loss_5",
    family: "cost",
    label: "Lojistik Rota Kaybı — TotalRouteLoss",
    fn: (inputs) => {
    const fuelWaste = num(inputs, "fuelWaste");
    const timeWaste = num(inputs, "timeWaste");
    const vehicleWearCost = num(inputs, "vehicleWearCost");
    return nonNegative(assertFinite(fuelWaste + timeWaste + vehicleWearCost));
  },
  }
];
