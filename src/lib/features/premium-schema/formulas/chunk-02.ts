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
export const CHUNK_02_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.aql_sampling_risk_4",
    family: "cost",
    label: "AQL SAMPLING RISK & COST — Alpha",
    fn: (inputs) => {
    const pa = num(inputs, "pa");
    const producer = num(inputs, "producer");
    const pa_producer = num(inputs, "pa_producer") || 0;
    return nonNegative(assertFinite(1 - pa_producer));
  },
  },
  {
    id: "user.aql_sampling_risk_5",
    family: "cost",
    label: "AQL SAMPLING RISK & COST — Pa_consumer",
    fn: (inputs) => {
      // COMPLEX: Pa_consumer = BINOMDIST(Ac, n, p_LTPD, TRUE)
      // Requires external implementation
      return 0;
    },
  },
  {
    id: "user.aql_sampling_risk_6",
    family: "cost",
    label: "AQL SAMPLING RISK & COST — Beta",
    fn: (inputs) => {
    const pa = num(inputs, "pa");
    const consumer = num(inputs, "consumer");
    const pa_consumer = num(inputs, "pa_consumer") || 0;
    return nonNegative(assertFinite(pa_consumer));
  },
  },
  {
    id: "user.aql_sampling_risk_7",
    family: "cost",
    label: "AQL SAMPLING RISK & COST — ATI",
    fn: (inputs) => {
    const n = num(inputs, "n");
    const pa = num(inputs, "pa");
    return nonNegative(assertFinite(n + (1 - pa) * (n - n)));
  },
  },
  {
    id: "user.aql_sampling_risk_8",
    family: "cost",
    label: "AQL SAMPLING RISK & COST — TotalRiskCost",
    fn: (inputs) => {
    const n = num(inputs, "n");
    const p = num(inputs, "p");
    const pa = num(inputs, "pa");
    const detectionRate = num(inputs, "detectionRate");
    const costPerDefect = num(inputs, "costPerDefect");
    return nonNegative(assertFinite((n * p * (1 - pa) * (1 - detectionRate)) * costPerDefect));
  },
  },

  // ── VEHICLE DEPRECIATION (7 formulas) ──,
  {
    id: "user.vehicle_depreciation_tco_0",
    family: "cost",
    label: "VEHICLE DEPRECIATION — SL_Annual",
    fn: (inputs) => {
    const cost = num(inputs, "cost");
    const salvageValue = num(inputs, "salvageValue");
    const usefulLife = num(inputs, "usefulLife");
    return nonNegative(assertFinite((cost - salvageValue) / usefulLife));
  },
  },
  {
    id: "user.vehicle_depreciation_tco_1",
    family: "cost",
    label: "VEHICLE DEPRECIATION — DB_Rate",
    fn: (inputs) => {
    const usefulLife = num(inputs, "usefulLife");
    return nonNegative(assertFinite(2 / usefulLife));
  },
  },
  {
    id: "user.vehicle_depreciation_tco_2",
    family: "cost",
    label: "VEHICLE DEPRECIATION — DB_Year_t",
    fn: (inputs) => {
    const bookValue = num(inputs, "bookValue");
    const t = num(inputs, "t");
    const dB = num(inputs, "dB");
    const Rate = num(inputs, "Rate");
    const bookValue_ = num(inputs, "bookValue_") || 0;
    const dB_Rate = num(inputs, "dB_Rate") || 0;
    return nonNegative(assertFinite(bookValue_ * dB_Rate));
  },
  },
  {
    id: "user.vehicle_depreciation_tco_3",
    family: "cost",
    label: "VEHICLE DEPRECIATION — MACRS_Year_t",
    fn: (inputs) => {
    const cost = num(inputs, "cost");
    const mACRS = num(inputs, "mACRS");
    const Table = num(inputs, "Table");
    const assetClass = num(inputs, "assetClass");
    const year = num(inputs, "year");
    const mACRS_Table = num(inputs, "mACRS_Table") || 0;
    return nonNegative(assertFinite(cost * mACRS_Table * assetClass * year));
  },
  },
  {
    id: "user.vehicle_depreciation_tco_4",
    family: "cost",
    label: "VEHICLE DEPRECIATION — UoP_PerUnit",
    fn: (inputs) => {
    const cost = num(inputs, "cost");
    const salvageValue = num(inputs, "salvageValue");
    const totalExpectedUnits = num(inputs, "totalExpectedUnits");
    return nonNegative(assertFinite((cost - salvageValue) / totalExpectedUnits));
  },
  },
  {
    id: "user.vehicle_depreciation_tco_5",
    family: "cost",
    label: "VEHICLE DEPRECIATION — TCO",
    fn: (inputs) => {
    const acquisitionCost = num(inputs, "acquisitionCost");
    const opCost = num(inputs, "opCost");
    const t = num(inputs, "t");
    const maintCost = num(inputs, "maintCost");
    const salvage = num(inputs, "salvage");
    const discountRate = num(inputs, "discountRate");
    const opCost_t = num(inputs, "opCost_t") || 0;
    const maintCost_t = num(inputs, "maintCost_t") || 0;
    const salvage_t = num(inputs, "salvage_t") || 0;
    return nonNegative(assertFinite(acquisitionCost + SUM((opCost_t + maintCost_t - salvage_t) / (1 + discountRate)**t)));
  },
  },
  {
    id: "user.vehicle_depreciation_tco_6",
    family: "cost",
    label: "VEHICLE DEPRECIATION — TaxShield",
    fn: (inputs) => {
    const depreciation = num(inputs, "depreciation");
    const taxRate = num(inputs, "taxRate");
    return nonNegative(assertFinite(depreciation * taxRate));
  },
  },

  // ── DOWNTIME COSTI (5 formulas) ──,
  {
    id: "user.downtime_cost_0",
    family: "cost",
    label: "DOWNTIME COSTI — DirectLaborLoss",
    fn: (inputs) => {
    const downtimeHours = num(inputs, "downtimeHours");
    const affectedWorkers = num(inputs, "affectedWorkers");
    const avgHourlyRate = num(inputs, "avgHourlyRate");
    const burdenRate = num(inputs, "burdenRate");
    return nonNegative(assertFinite(downtimeHours * affectedWorkers * avgHourlyRate * (1 + burdenRate)));
  },
  },
  {
    id: "user.downtime_cost_1",
    family: "cost",
    label: "DOWNTIME COSTI — ProductionLoss",
    fn: (inputs) => {
    const downtimeHours = num(inputs, "downtimeHours");
    const lineCapacity = num(inputs, "lineCapacity");
    const contributionMargin = num(inputs, "contributionMargin");
    return nonNegative(assertFinite(downtimeHours * lineCapacity * contributionMargin));
  },
  },
  {
    id: "user.downtime_cost_2",
    family: "cost",
    label: "DOWNTIME COSTI — EnergyWaste",
    fn: (inputs) => {
    const idlePowerKW = num(inputs, "idlePowerKW");
    const downtimeHours = num(inputs, "downtimeHours");
    const electricityRate = num(inputs, "electricityRate");
    return nonNegative(assertFinite(idlePowerKW * downtimeHours * electricityRate));
  },
  }
];
