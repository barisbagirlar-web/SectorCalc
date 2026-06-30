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
export const CHUNK_15_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.sewing_line_balance_analyzer_pro_7",
    family: "cost",
    label: "DİKİŞ HATTI DENGELEYİCİ — WIP",
    fn: (inputs) => {
    const bottleneck = num(inputs, "bottleneck");
    const takt = num(inputs, "takt");
    const demand = num(inputs, "demand");
    return nonNegative(assertFinite((bottleneck - takt) * demand));
  },
  },

  // ── DYE REÇETE MALİYET (8 formulas) ──,
  {
    id: "user.dye_recipe_cost_0",
    family: "cost",
    label: "DYE REÇETE MALİYET — Cost_Dye",
    fn: (inputs) => {
    const conc = num(inputs, "conc");
    const price = num(inputs, "price");
    const bathRatio = num(inputs, "bathRatio");
    return nonNegative(assertFinite(SUM(conc * price) / bathRatio));
  },
  },
  {
    id: "user.dye_recipe_cost_1",
    family: "cost",
    label: "DYE REÇETE MALİYET — Cost_Chem",
    fn: (inputs) => {
    const dosage = num(inputs, "dosage");
    const price = num(inputs, "price");
    return nonNegative(assertFinite(SUM(dosage * price)));
  },
  },
  {
    id: "user.dye_recipe_cost_2",
    family: "cost",
    label: "DYE REÇETE MALİYET — Cost_Water",
    fn: (inputs) => {
    const liquorRatio = num(inputs, "liquorRatio");
    const weight = num(inputs, "weight");
    const waterTariff = num(inputs, "waterTariff");
    return nonNegative(assertFinite(liquorRatio * weight * waterTariff));
  },
  },
  {
    id: "user.dye_recipe_cost_3",
    family: "cost",
    label: "DYE REÇETE MALİYET — Cost_Energy",
    fn: (inputs) => {
    const heating = num(inputs, "heating");
    const holding = num(inputs, "holding");
    const drying = num(inputs, "drying");
    return nonNegative(assertFinite(heating + holding + drying));
  },
  },
  {
    id: "user.dye_recipe_cost_4",
    family: "cost",
    label: "DYE REÇETE MALİYET — Cost_Waste",
    fn: (inputs) => {
    const effluent = num(inputs, "effluent");
    const treatCost = num(inputs, "treatCost");
    const surcharge = num(inputs, "surcharge");
    return nonNegative(assertFinite(effluent * treatCost + surcharge));
  },
  },
  {
    id: "user.dye_recipe_cost_5",
    family: "cost",
    label: "DYE REÇETE MALİYET — TotalBatch",
    fn: (inputs) => {
    const dye = num(inputs, "dye");
    const chem = num(inputs, "chem");
    const water = num(inputs, "water");
    const energy = num(inputs, "energy");
    const waste = num(inputs, "waste");
    return nonNegative(assertFinite(dye + chem + water + energy + waste));
  },
  },
  {
    id: "user.dye_recipe_cost_6",
    family: "cost",
    label: "DYE REÇETE MALİYET — RFT_Savings",
    fn: (inputs) => {
    const rework = num(inputs, "rework");
    const rFT = num(inputs, "rFT");
    return nonNegative(assertFinite(rework * (1 - rFT)));
  },
  },
  {
    id: "user.dye_recipe_cost_7",
    family: "cost",
    label: "DYE REÇETE MALİYET — CostPerKg",
    fn: (inputs) => {
    const totalBatch = num(inputs, "totalBatch");
    const rFT = num(inputs, "rFT");
    const Savings = num(inputs, "Savings");
    const weight = num(inputs, "weight");
    const rFT_Savings = num(inputs, "rFT_Savings") || 0;
    return nonNegative(assertFinite((totalBatch + rFT_Savings) / weight));
  },
  },

  // ── ENERJİ TÜKETİM RAPORU (8 formulas) ──,
  {
    id: "user.energy_consumption_report_0",
    family: "cost",
    label: "ENERJİ TÜKETİM RAPORU — Active",
    fn: (inputs) => {
    const kWh = num(inputs, "kWh");
    return nonNegative(assertFinite(SUM(kWh)));
  },
  },
  {
    id: "user.energy_consumption_report_1",
    family: "cost",
    label: "ENERJİ TÜKETİM RAPORU — Reactive",
    fn: (inputs) => {
    const kVArh = num(inputs, "kVArh");
    return nonNegative(assertFinite(SUM(kVArh)));
  },
  },
  {
    id: "user.energy_consumption_report_2",
    family: "cost",
    label: "ENERJİ TÜKETİM RAPORU — PF",
    fn: (inputs) => {
    const active = num(inputs, "active");
    const reactive = num(inputs, "reactive");
    const sqrt = num(inputs, "sqrt") || 0;
    return nonNegative(assertFinite(active / Math.sqrt(active**2 + reactive**2)));
  },
  },
  {
    id: "user.energy_consumption_report_3",
    family: "cost",
    label: "ENERJİ TÜKETİM RAPORU — ReactivePenalty",
    fn: (inputs) => {
    const pF = num(inputs, "pF");
    const thresh = num(inputs, "thresh");
    const reactive = num(inputs, "reactive");
    const active = num(inputs, "active");
    const tariff = num(inputs, "tariff");
    const tan = num(inputs, "tan") || 0;
    const acos = num(inputs, "acos") || 0;
    return nonNegative(assertFinite(((pF < thresh) ? ((reactive - active * Math.tan(Math.acos(thresh))) * tariff) : (0))));
  },
  },
  {
    id: "user.energy_consumption_report_4",
    family: "cost",
    label: "ENERJİ TÜKETİM RAPORU — DemandCharge",
    fn: (inputs) => {
    const peak = num(inputs, "peak");
    const kW = num(inputs, "kW");
    const demandRate = num(inputs, "demandRate");
    const peak_kW = num(inputs, "peak_kW") || 0;
    return nonNegative(assertFinite(peak_kW * demandRate));
  },
  },
  {
    id: "user.energy_consumption_report_5",
    family: "cost",
    label: "ENERJİ TÜKETİM RAPORU — TOU",
    fn: (inputs) => {
    const kWh = num(inputs, "kWh");
    const tOU = num(inputs, "tOU");
    const Rate = num(inputs, "Rate");
    const tOU_Rate = num(inputs, "tOU_Rate") || 0;
    return nonNegative(assertFinite(SUM(kWh * tOU_Rate)));
  },
  }
];
