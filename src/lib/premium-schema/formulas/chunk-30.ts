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
export const CHUNK_30_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.quality_cost_paf_1",
    family: "cost",
    label: "Kalite Maliyeti PAF — AppraisalCost",
    fn: (inputs) => {
    const inspection = num(inputs, "inspection");
    const testing = num(inputs, "testing");
    const calibration = num(inputs, "calibration");
    const audit = num(inputs, "audit");
    return nonNegative(assertFinite(inspection + testing + calibration + audit));
  },
  },
  {
    id: "user.quality_cost_paf_2",
    family: "cost",
    label: "Kalite Maliyeti PAF — InternalFailure",
    fn: (inputs) => {
    const scrap = num(inputs, "scrap");
    const rework = num(inputs, "rework");
    const reinspection = num(inputs, "reinspection");
    const downtime = num(inputs, "downtime");
    return nonNegative(assertFinite(scrap + rework + reinspection + downtime));
  },
  },
  {
    id: "user.quality_cost_paf_3",
    family: "cost",
    label: "Kalite Maliyeti PAF — ExternalFailure",
    fn: (inputs) => {
    const warranty = num(inputs, "warranty");
    const returns = num(inputs, "returns");
    const recall = num(inputs, "recall");
    const liability = num(inputs, "liability");
    const lostSales = num(inputs, "lostSales");
    return nonNegative(assertFinite(warranty + returns + recall + liability + lostSales));
  },
  },
  {
    id: "user.quality_cost_paf_4",
    family: "cost",
    label: "Kalite Maliyeti PAF — TotalCOQ",
    fn: (inputs) => {
    const preventionCost = num(inputs, "preventionCost");
    const appraisalCost = num(inputs, "appraisalCost");
    const internalFailure = num(inputs, "internalFailure");
    const externalFailure = num(inputs, "externalFailure");
    return nonNegative(assertFinite(preventionCost + appraisalCost + internalFailure + externalFailure));
  },
  },
  {
    id: "user.quality_cost_paf_5",
    family: "cost",
    label: "Kalite Maliyeti PAF — COQ_Ratio",
    fn: (inputs) => {
    const totalCOQ = num(inputs, "totalCOQ");
    const totalRevenue = num(inputs, "totalRevenue");
    return nonNegative(assertFinite(totalCOQ / totalRevenue));
  },
  },
  {
    id: "user.quality_cost_paf_6",
    family: "cost",
    label: "Kalite Maliyeti PAF — PAF_Ratio",
    fn: (inputs) => {
    const preventionCost = num(inputs, "preventionCost");
    const totalCOQ = num(inputs, "totalCOQ");
    return nonNegative(assertFinite(preventionCost / totalCOQ));
  },
  },

  // ── Karbon Ayak izi Check (7 formulas) ──,
  {
    id: "user.carbon_footprint_check_0",
    family: "cost",
    label: "Karbon Ayak izi Check — Scope1",
    fn: (inputs) => {
    const fuelConsumption = num(inputs, "fuelConsumption");
    const i = num(inputs, "i");
    const emissionFactor = num(inputs, "emissionFactor");
    const fugitiveEmissions = num(inputs, "fugitiveEmissions");
    const fuelConsumption_i = num(inputs, "fuelConsumption_i") || 0;
    const emissionFactor_i = num(inputs, "emissionFactor_i") || 0;
    return nonNegative(assertFinite(SUM(fuelConsumption_i * emissionFactor_i) + fugitiveEmissions));
  },
  },
  {
    id: "user.carbon_footprint_check_1",
    family: "cost",
    label: "Karbon Ayak izi Check — Scope2_Location",
    fn: (inputs) => {
    const electricityConsumption = num(inputs, "electricityConsumption");
    const gridEmissionFactor = num(inputs, "gridEmissionFactor");
    return nonNegative(assertFinite(electricityConsumption * gridEmissionFactor));
  },
  },
  {
    id: "user.carbon_footprint_check_2",
    family: "cost",
    label: "Karbon Ayak izi Check — Scope2_Market",
    fn: (inputs) => {
    const electricityConsumption = num(inputs, "electricityConsumption");
    const gridFactor = num(inputs, "gridFactor");
    const rEC = num(inputs, "rEC");
    const Factor = num(inputs, "Factor");
    const rEC_Factor = num(inputs, "rEC_Factor") || 0;
    return nonNegative(assertFinite(electricityConsumption * (gridFactor - rEC_Factor)));
  },
  },
  {
    id: "user.carbon_footprint_check_3",
    family: "cost",
    label: "Karbon Ayak izi Check — Scope3_Upstream",
    fn: (inputs) => {
    const material = num(inputs, "material");
    const i = num(inputs, "i");
    const materialEF = num(inputs, "materialEF");
    const logistics = num(inputs, "logistics");
    const Emissions = num(inputs, "Emissions");
    const material_i = num(inputs, "material_i") || 0;
    const materialEF_i = num(inputs, "materialEF_i") || 0;
    const logistics_Emissions = num(inputs, "logistics_Emissions") || 0;
    return nonNegative(assertFinite(SUM(material_i * materialEF_i) + logistics_Emissions));
  },
  },
  {
    id: "user.carbon_footprint_check_4",
    family: "cost",
    label: "Karbon Ayak izi Check — TotalCarbon",
    fn: (inputs) => {
    const scope1 = num(inputs, "scope1");
    const scope2 = num(inputs, "scope2");
    const Market = num(inputs, "Market");
    const scope3 = num(inputs, "scope3");
    const Upstream = num(inputs, "Upstream");
    const scope2_Market = num(inputs, "scope2_Market") || 0;
    const scope3_Upstream = num(inputs, "scope3_Upstream") || 0;
    return nonNegative(assertFinite(scope1 + scope2_Market + scope3_Upstream));
  },
  },
  {
    id: "user.carbon_footprint_check_5",
    family: "cost",
    label: "Karbon Ayak izi Check — CarbonIntensity",
    fn: (inputs) => {
    const totalCarbon = num(inputs, "totalCarbon");
    const productionVolume = num(inputs, "productionVolume");
    return nonNegative(assertFinite(totalCarbon / productionVolume));
  },
  },
  {
    id: "user.carbon_footprint_check_6",
    family: "cost",
    label: "Karbon Ayak izi Check — FinancialRisk",
    fn: (inputs) => {
    const totalCarbon = num(inputs, "totalCarbon");
    const forecastedCarbonPrice = num(inputs, "forecastedCarbonPrice");
    return nonNegative(assertFinite(totalCarbon * forecastedCarbonPrice));
  },
  },

  // ── Kaynak Hacmi ve Maliyeti (8 formulas) ──,
  {
    id: "user.weld_volume_cost_0",
    family: "cost",
    label: "Kaynak Hacmi ve Maliyeti — Area_Weld",
    fn: (inputs) => {
    const leg = num(inputs, "leg");
    return nonNegative(assertFinite((leg**2) / 2));
  },
  },
  {
    id: "user.weld_volume_cost_1",
    family: "cost",
    label: "Kaynak Hacmi ve Maliyeti — Volume_Weld",
    fn: (inputs) => {
    const area = num(inputs, "area");
    const Weld = num(inputs, "Weld");
    const length = num(inputs, "length");
    const area_Weld = num(inputs, "area_Weld") || 0;
    return nonNegative(assertFinite(area_Weld * length));
  },
  }
];
