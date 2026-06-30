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
export const CHUNK_52_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.contract_incentive_8",
    family: "cost",
    label: "Sözleşme Teşvik — PerformanceBonus",
    fn: (inputs) => {
    const metricWeight = num(inputs, "metricWeight");
    const i = num(inputs, "i");
    const metricScore = num(inputs, "metricScore");
    const bonusPool = num(inputs, "bonusPool");
    const metricWeight_i = num(inputs, "metricWeight_i") || 0;
    const metricScore_i = num(inputs, "metricScore_i") || 0;
    return nonNegative(assertFinite(SUM(metricWeight_i * metricScore_i) * bonusPool));
  },
  },

  // ── SPC Signal Delay Maliyet (7 formulas) ──,
  {
    id: "user.spc_signal_delay_0",
    family: "cost",
    label: "SPC Signal Delay Maliyet — ARL_InControl",
    fn: (inputs) => {
    const alpha = num(inputs, "alpha");
    return nonNegative(assertFinite(1 / alpha));
  },
  },
  {
    id: "user.spc_signal_delay_1",
    family: "cost",
    label: "SPC Signal Delay Maliyet — ARL_OutOfControl",
    fn: (inputs) => {
    const beta = num(inputs, "beta");
    return nonNegative(assertFinite(1 / (1 - beta)));
  },
  },
  {
    id: "user.spc_signal_delay_2",
    family: "cost",
    label: "SPC Signal Delay Maliyet — DetectionDelay_Hours",
    fn: (inputs) => {
    const aRL = num(inputs, "aRL");
    const OutOfControl = num(inputs, "OutOfControl");
    const samplingInterval = num(inputs, "samplingInterval");
    const aRL_OutOfControl = num(inputs, "aRL_OutOfControl") || 0;
    return nonNegative(assertFinite(aRL_OutOfControl * samplingInterval));
  },
  },
  {
    id: "user.spc_signal_delay_3",
    family: "cost",
    label: "SPC Signal Delay Maliyet — DefectsProduced",
    fn: (inputs) => {
    const detectionDelay = num(inputs, "detectionDelay");
    const Hours = num(inputs, "Hours");
    const productionRate = num(inputs, "productionRate");
    const defectRate = num(inputs, "defectRate");
    const detectionDelay_Hours = num(inputs, "detectionDelay_Hours") || 0;
    const defectRate_OOC = num(inputs, "defectRate_OOC") || 0;
    return nonNegative(assertFinite(detectionDelay_Hours * productionRate * defectRate_OOC));
  },
  },
  {
    id: "user.spc_signal_delay_4",
    family: "cost",
    label: "SPC Signal Delay Maliyet — Cost_Delay",
    fn: (inputs) => {
    const defectsProduced = num(inputs, "defectsProduced");
    const costPerDefect = num(inputs, "costPerDefect");
    return nonNegative(assertFinite(defectsProduced * costPerDefect));
  },
  },
  {
    id: "user.spc_signal_delay_5",
    family: "cost",
    label: "SPC Signal Delay Maliyet — InvestigationCost",
    fn: (inputs) => {
    const falseAlarmRate = num(inputs, "falseAlarmRate");
    const samplingFrequency = num(inputs, "samplingFrequency");
    const laborRate = num(inputs, "laborRate");
    return nonNegative(assertFinite(falseAlarmRate * samplingFrequency * laborRate));
  },
  },
  {
    id: "user.spc_signal_delay_6",
    family: "cost",
    label: "SPC Signal Delay Maliyet — OptimalInterval",
    fn: (inputs) => {
    const samplingCost = num(inputs, "samplingCost");
    const productionRate = num(inputs, "productionRate");
    const cost = num(inputs, "cost");
    const Delay = num(inputs, "Delay");
    const shiftMagnitude = num(inputs, "shiftMagnitude");
    const sqrt = num(inputs, "sqrt") || 0;
    const cost_Delay = num(inputs, "cost_Delay") || 0;
    return nonNegative(assertFinite(Math.sqrt((2 * samplingCost * productionRate) / (cost_Delay * shiftMagnitude**2))));
  },
  },

  // ── Steam Trap Enerji kayıp (7 formulas) ──,
  {
    id: "user.steam_trap_energy_loss_0",
    family: "cost",
    label: "Steam Trap Enerji kayıp — OrificeFlow",
    fn: (inputs) => {
    const c = num(inputs, "c");
    const d = num(inputs, "d");
    const a = num(inputs, "a");
    const deltaP = num(inputs, "deltaP");
    const density = num(inputs, "density");
    const c_d = num(inputs, "c_d") || 0;
    const sqrt = num(inputs, "sqrt") || 0;
    return nonNegative(assertFinite(c_d * a * Math.sqrt(2 * deltaP * density)));
  },
  },
  {
    id: "user.steam_trap_energy_loss_1",
    family: "cost",
    label: "Steam Trap Enerji kayıp — SteamLoss_kg_h",
    fn: (inputs) => {
    const orificeFlow = num(inputs, "orificeFlow");
    return nonNegative(assertFinite(orificeFlow * 3600));
  },
  },
  {
    id: "user.steam_trap_energy_loss_2",
    family: "cost",
    label: "Steam Trap Enerji kayıp — EnergyLoss_kW",
    fn: (inputs) => {
    const steamLoss = num(inputs, "steamLoss");
    const kg = num(inputs, "kg");
    const h = num(inputs, "h");
    const enthalpy = num(inputs, "enthalpy");
    const Steam = num(inputs, "Steam");
    const steamLoss_kg_h = num(inputs, "steamLoss_kg_h") || 0;
    const enthalpy_Steam = num(inputs, "enthalpy_Steam") || 0;
    return nonNegative(assertFinite(steamLoss_kg_h * enthalpy_Steam / 3600));
  },
  },
  {
    id: "user.steam_trap_energy_loss_3",
    family: "cost",
    label: "Steam Trap Enerji kayıp — AnnualCost",
    fn: (inputs) => {
    const energyLoss = num(inputs, "energyLoss");
    const kW = num(inputs, "kW");
    const operatingHours = num(inputs, "operatingHours");
    const steamCost = num(inputs, "steamCost");
    const per = num(inputs, "per");
    const kWh = num(inputs, "kWh");
    const energyLoss_kW = num(inputs, "energyLoss_kW") || 0;
    const steamCost_per_kWh = num(inputs, "steamCost_per_kWh") || 0;
    return nonNegative(assertFinite(energyLoss_kW * operatingHours * steamCost_per_kWh));
  },
  },
  {
    id: "user.steam_trap_energy_loss_4",
    family: "cost",
    label: "Steam Trap Enerji kayıp — TrapFailureRate",
    fn: (inputs) => {
    const failedTraps = num(inputs, "failedTraps");
    const totalTraps = num(inputs, "totalTraps");
    return nonNegative(assertFinite(failedTraps / totalTraps));
  },
  },
  {
    id: "user.steam_trap_energy_loss_5",
    family: "cost",
    label: "Steam Trap Enerji kayıp — TotalSystemLoss",
    fn: (inputs) => {
    const annualCost = num(inputs, "annualCost");
    const i = num(inputs, "i");
    const annualCost_i = num(inputs, "annualCost_i") || 0;
    return nonNegative(assertFinite(SUM(annualCost_i)));
  },
  },
  {
    id: "user.steam_trap_energy_loss_6",
    family: "cost",
    label: "Steam Trap Enerji kayıp — RepairROI",
    fn: (inputs) => {
    const totalSystemLoss = num(inputs, "totalSystemLoss");
    const trapCost = num(inputs, "trapCost");
    const laborCost = num(inputs, "laborCost");
    return nonNegative(assertFinite(totalSystemLoss / (trapCost + laborCost)));
  },
  },

  // ── Stok Devir hızı risk (7 formulas) ──
];
