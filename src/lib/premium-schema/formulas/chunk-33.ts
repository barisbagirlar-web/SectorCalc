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
export const CHUNK_33_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.cut_fill_balance_5",
    family: "cost",
    label: "Kesme-Dolgu Denge — BorrowRequired",
    fn: (inputs) => {
    const volume = num(inputs, "volume");
    const Fill = num(inputs, "Fill");
    const shrinkageFactor = num(inputs, "shrinkageFactor");
    const Cut = num(inputs, "Cut");
    const max = num(inputs, "max") || 0;
    const volume_Fill = num(inputs, "volume_Fill") || 0;
    const volume_Cut = num(inputs, "volume_Cut") || 0;
    return nonNegative(assertFinite(Math.max(0, (volume_Fill * shrinkageFactor) - volume_Cut)));
  },
  },
  {
    id: "user.cut_fill_balance_6",
    family: "cost",
    label: "Kesme-Dolgu Denge — WasteRequired",
    fn: (inputs) => {
    const volume = num(inputs, "volume");
    const Cut = num(inputs, "Cut");
    const Fill = num(inputs, "Fill");
    const shrinkageFactor = num(inputs, "shrinkageFactor");
    const max = num(inputs, "max") || 0;
    const volume_Cut = num(inputs, "volume_Cut") || 0;
    const volume_Fill = num(inputs, "volume_Fill") || 0;
    return nonNegative(assertFinite(Math.max(0, volume_Cut - (volume_Fill * shrinkageFactor))));
  },
  },
  {
    id: "user.cut_fill_balance_7",
    family: "cost",
    label: "Kesme-Dolgu Denge — HaulCost",
    fn: (inputs) => {
    const volume = num(inputs, "volume");
    const i = num(inputs, "i");
    const distance = num(inputs, "distance");
    const unitHaulCost = num(inputs, "unitHaulCost");
    const volume_i = num(inputs, "volume_i") || 0;
    const distance_i = num(inputs, "distance_i") || 0;
    return nonNegative(assertFinite(SUM(volume_i * distance_i * unitHaulCost)));
  },
  },

  // ── Kiriş Ağırlığı (8 formulas) ──,
  {
    id: "user.beam_weight_0",
    family: "cost",
    label: "Kiriş Ağırlığı — Area_Cross",
    fn: (inputs) => {
    const lookupArea = num(inputs, "lookupArea");
    const profileType = num(inputs, "profileType");
    const size = num(inputs, "size");
    return nonNegative(assertFinite(lookupArea * profileType * size));
  },
  },
  {
    id: "user.beam_weight_1",
    family: "cost",
    label: "Kiriş Ağırlığı — Weight_PerMeter",
    fn: (inputs) => {
    const area = num(inputs, "area");
    const Cross = num(inputs, "Cross");
    const density = num(inputs, "density");
    const Steel = num(inputs, "Steel");
    const area_Cross = num(inputs, "area_Cross") || 0;
    const density_Steel = num(inputs, "density_Steel") || 0;
    return nonNegative(assertFinite(area_Cross * density_Steel));
  },
  },
  {
    id: "user.beam_weight_2",
    family: "cost",
    label: "Kiriş Ağırlığı — TotalWeight",
    fn: (inputs) => {
    const weight = num(inputs, "weight");
    const PerMeter = num(inputs, "PerMeter");
    const length = num(inputs, "length");
    const quantity = num(inputs, "quantity");
    const weight_PerMeter = num(inputs, "weight_PerMeter") || 0;
    return nonNegative(assertFinite(weight_PerMeter * length * quantity));
  },
  },
  {
    id: "user.beam_weight_3",
    family: "cost",
    label: "Kiriş Ağırlığı — Cost_Material",
    fn: (inputs) => {
    const totalWeight = num(inputs, "totalWeight");
    const pricePerTon = num(inputs, "pricePerTon");
    return nonNegative(assertFinite(totalWeight * pricePerTon));
  },
  },
  {
    id: "user.beam_weight_4",
    family: "cost",
    label: "Kiriş Ağırlığı — PaintArea",
    fn: (inputs) => {
    const perimeter = num(inputs, "perimeter");
    const length = num(inputs, "length");
    return nonNegative(assertFinite(perimeter * length));
  },
  },
  {
    id: "user.beam_weight_5",
    family: "cost",
    label: "Kiriş Ağırlığı — FireproofingArea",
    fn: (inputs) => {
    const paintArea = num(inputs, "paintArea");
    return nonNegative(assertFinite(paintArea));
  },
  },
  {
    id: "user.beam_weight_6",
    family: "cost",
    label: "Kiriş Ağırlığı — Deflection_Max",
    fn: (inputs) => {
    const w = num(inputs, "w");
    const l = num(inputs, "l");
    const e = num(inputs, "e");
    const i = num(inputs, "i");
    return nonNegative(assertFinite((5 * w * l**4) / (384 * e * i)));
  },
  },
  {
    id: "user.beam_weight_7",
    family: "cost",
    label: "Kiriş Ağırlığı — Moment_Max",
    fn: (inputs) => {
    const w = num(inputs, "w");
    const l = num(inputs, "l");
    return nonNegative(assertFinite((w * l**2) / 8));
  },
  },

  // ── Kompresör Kaçağı Maliyet (7 formulas) ──,
  {
    id: "user.compressed_air_leak_0",
    family: "cost",
    label: "Kompresör Kaçağı Maliyet — LeakFlow_CFM",
    fn: (inputs) => {
    const d = num(inputs, "d");
    const p = num(inputs, "p");
    const Line = num(inputs, "Line");
    const t = num(inputs, "t");
    const Abs = num(inputs, "Abs");
    const p_Line = num(inputs, "p_Line") || 0;
    const sqrt = num(inputs, "sqrt") || 0;
    const t_Abs = num(inputs, "t_Abs") || 0;
    return nonNegative(assertFinite((22.4 * d**2 * p_Line) / Math.sqrt(t_Abs)));
  },
  },
  {
    id: "user.compressed_air_leak_1",
    family: "cost",
    label: "Kompresör Kaçağı Maliyet — Power_Loss_kW",
    fn: (inputs) => {
    const leakFlow = num(inputs, "leakFlow");
    const p = num(inputs, "p");
    const Line = num(inputs, "Line");
    const eff = num(inputs, "eff");
    const Compressor = num(inputs, "Compressor");
    const leakFlow_CFM = num(inputs, "leakFlow_CFM") || 0;
    const p_Line = num(inputs, "p_Line") || 0;
    const eff_Compressor = num(inputs, "eff_Compressor") || 0;
    return nonNegative(assertFinite((leakFlow_CFM * p_Line * 144) / (33000 * eff_Compressor)));
  },
  },
  {
    id: "user.compressed_air_leak_2",
    family: "cost",
    label: "Kompresör Kaçağı Maliyet — AnnualEnergyLoss",
    fn: (inputs) => {
    const power = num(inputs, "power");
    const Loss = num(inputs, "Loss");
    const kW = num(inputs, "kW");
    const operatingHours = num(inputs, "operatingHours");
    const power_Loss_kW = num(inputs, "power_Loss_kW") || 0;
    return nonNegative(assertFinite(power_Loss_kW * operatingHours));
  },
  },
  {
    id: "user.compressed_air_leak_3",
    family: "cost",
    label: "Kompresör Kaçağı Maliyet — Cost_Leak",
    fn: (inputs) => {
    const annualEnergyLoss = num(inputs, "annualEnergyLoss");
    const electricityRate = num(inputs, "electricityRate");
    return nonNegative(assertFinite(annualEnergyLoss * electricityRate));
  },
  }
];
