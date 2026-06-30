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
export const CHUNK_64_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.vsm_financial_converter_3",
    family: "cost",
    label: "Vsm finansal Dönüştürücü — InventoryReductionSavings",
    fn: (inputs) => {
    const oldWIP = num(inputs, "oldWIP");
    const newWIP = num(inputs, "newWIP");
    const carryingRate = num(inputs, "carryingRate");
    return nonNegative(assertFinite((oldWIP - newWIP) * carryingRate));
  },
  },
  {
    id: "user.vsm_financial_converter_4",
    family: "cost",
    label: "Vsm finansal Dönüştürücü — ProductivityGain",
    fn: (inputs) => {
    const oldCycleTime = num(inputs, "oldCycleTime");
    const newCycleTime = num(inputs, "newCycleTime");
    const annualVolume = num(inputs, "annualVolume");
    const laborRate = num(inputs, "laborRate");
    return nonNegative(assertFinite((oldCycleTime - newCycleTime) * annualVolume * laborRate));
  },
  },
  {
    id: "user.vsm_financial_converter_5",
    family: "cost",
    label: "Vsm finansal Dönüştürücü — TotalFinancialImpact",
    fn: (inputs) => {
    const inventoryReductionSavings = num(inputs, "inventoryReductionSavings");
    const productivityGain = num(inputs, "productivityGain");
    const qualityImprovementSavings = num(inputs, "qualityImprovementSavings");
    return nonNegative(assertFinite(inventoryReductionSavings + productivityGain + qualityImprovementSavings));
  },
  },

  // ── WPS Preheat Sıcaklık (5 formulas) ──,
  {
    id: "user.wps_preheat_temperature_0",
    family: "cost",
    label: "WPS Preheat Sıcaklık — CarbonEquivalent_CE",
    fn: (inputs) => {
    const c = num(inputs, "c");
    const mn = num(inputs, "mn");
    const cr = num(inputs, "cr");
    const mo = num(inputs, "mo");
    const v = num(inputs, "v");
    const ni = num(inputs, "ni");
    const cu = num(inputs, "cu");
    return nonNegative(assertFinite(c + (mn/6) + ((cr+mo+v)/5) + ((ni+cu)/15)));
  },
  },
  {
    id: "user.wps_preheat_temperature_1",
    family: "cost",
    label: "WPS Preheat Sıcaklık — PreheatTemp",
    fn: (inputs) => {
    const f = num(inputs, "f");
    const cE = num(inputs, "cE");
    const thickness = num(inputs, "thickness");
    const hydrogenLevel = num(inputs, "hydrogenLevel");
    const heatInput = num(inputs, "heatInput");
    return nonNegative(assertFinite(cE * thickness * hydrogenLevel * heatInput));
  },
  },
  {
    id: "user.wps_preheat_temperature_2",
    family: "cost",
    label: "WPS Preheat Sıcaklık — CriticalCoolingTime",
    fn: (inputs) => {
    const t = num(inputs, "t");
    const thickness = num(inputs, "thickness");
    const heatInput = num(inputs, "heatInput");
    const constant = num(inputs, "constant");
    return nonNegative(assertFinite((thickness**2 / heatInput) * constant));
  },
  },
  {
    id: "user.wps_preheat_temperature_3",
    family: "cost",
    label: "WPS Preheat Sıcaklık — HydrogenCrackingRisk",
    fn: (inputs) => {
    const preheatTemp = num(inputs, "preheatTemp");
    const requiredPreheat = num(inputs, "requiredPreheat");
    const hIGH = num(inputs, "hIGH");
    const lOW = num(inputs, "lOW");
    return nonNegative(assertFinite(((preheatTemp < requiredPreheat) ? 1 : 0)));
  },
  },
  {
    id: "user.wps_preheat_temperature_4",
    family: "cost",
    label: "WPS Preheat Sıcaklık — EnergyCost",
    fn: (inputs) => {
    const mass = num(inputs, "mass");
    const specificHeat = num(inputs, "specificHeat");
    const preheatTemp = num(inputs, "preheatTemp");
    const ambientTemp = num(inputs, "ambientTemp");
    const heaterEfficiency = num(inputs, "heaterEfficiency");
    const energyPrice = num(inputs, "energyPrice");
    return nonNegative(assertFinite(mass * specificHeat * (preheatTemp - ambientTemp) / heaterEfficiency * energyPrice));
  },
  },

  // ── Yakıt Rota Sapma (7 formulas) ──,
  {
    id: "user.fuel_route_drift_0",
    family: "cost",
    label: "Yakıt Rota Sapma — PlannedFuel",
    fn: (inputs) => {
    const plannedDistance = num(inputs, "plannedDistance");
    const fuelEfficiency = num(inputs, "fuelEfficiency");
    return nonNegative(assertFinite(plannedDistance * fuelEfficiency));
  },
  },
  {
    id: "user.fuel_route_drift_1",
    family: "cost",
    label: "Yakıt Rota Sapma — ActualFuel",
    fn: (inputs) => {
    const actualDistance = num(inputs, "actualDistance");
    const actualFuelEfficiency = num(inputs, "actualFuelEfficiency");
    return nonNegative(assertFinite(actualDistance * actualFuelEfficiency));
  },
  },
  {
    id: "user.fuel_route_drift_2",
    family: "cost",
    label: "Yakıt Rota Sapma — RouteDrift",
    fn: (inputs) => {
    const actualDistance = num(inputs, "actualDistance");
    const plannedDistance = num(inputs, "plannedDistance");
    return nonNegative(assertFinite(actualDistance - plannedDistance));
  },
  },
  {
    id: "user.fuel_route_drift_3",
    family: "cost",
    label: "Yakıt Rota Sapma — FuelWaste_Distance",
    fn: (inputs) => {
    const routeDrift = num(inputs, "routeDrift");
    const fuelEfficiency = num(inputs, "fuelEfficiency");
    const fuelPrice = num(inputs, "fuelPrice");
    return nonNegative(assertFinite(routeDrift * fuelEfficiency * fuelPrice));
  },
  },
  {
    id: "user.fuel_route_drift_4",
    family: "cost",
    label: "Yakıt Rota Sapma — FuelWaste_Efficiency",
    fn: (inputs) => {
    const plannedDistance = num(inputs, "plannedDistance");
    const actualFuelEfficiency = num(inputs, "actualFuelEfficiency");
    const fuelEfficiency = num(inputs, "fuelEfficiency");
    const fuelPrice = num(inputs, "fuelPrice");
    return nonNegative(assertFinite(plannedDistance * (actualFuelEfficiency - fuelEfficiency) * fuelPrice));
  },
  },
  {
    id: "user.fuel_route_drift_5",
    family: "cost",
    label: "Yakıt Rota Sapma — IdleFuelCost",
    fn: (inputs) => {
    const idleTime = num(inputs, "idleTime");
    const idleConsumptionRate = num(inputs, "idleConsumptionRate");
    const fuelPrice = num(inputs, "fuelPrice");
    return nonNegative(assertFinite(idleTime * idleConsumptionRate * fuelPrice));
  },
  },
  {
    id: "user.fuel_route_drift_6",
    family: "cost",
    label: "Yakıt Rota Sapma — TotalDriftCost",
    fn: (inputs) => {
    const fuelWaste = num(inputs, "fuelWaste");
    const Distance = num(inputs, "Distance");
    const Efficiency = num(inputs, "Efficiency");
    const idleFuelCost = num(inputs, "idleFuelCost");
    const fuelWaste_Distance = num(inputs, "fuelWaste_Distance") || 0;
    const fuelWaste_Efficiency = num(inputs, "fuelWaste_Efficiency") || 0;
    return nonNegative(assertFinite(fuelWaste_Distance + fuelWaste_Efficiency + idleFuelCost));
  },
  },

  // ── Yangın Hidrantı Akış (6 formulas) ──
];
