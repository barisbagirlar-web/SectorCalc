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
export const CHUNK_18_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.evm_cost_forecast_5",
    family: "cost",
    label: "EVM MALİYET FORECAST — EAC_CPI_SPI",
    fn: (inputs) => {
    const aC = num(inputs, "aC");
    const bAC = num(inputs, "bAC");
    const eV = num(inputs, "eV");
    const cPI = num(inputs, "cPI");
    const sPI = num(inputs, "sPI");
    return nonNegative(assertFinite(aC + ((bAC - eV) / (cPI * sPI))));
  },
  },
  {
    id: "user.evm_cost_forecast_6",
    family: "cost",
    label: "EVM MALİYET FORECAST — ETC",
    fn: (inputs) => {
    const eAC = num(inputs, "eAC");
    const aC = num(inputs, "aC");
    return nonNegative(assertFinite(eAC - aC));
  },
  },
  {
    id: "user.evm_cost_forecast_7",
    family: "cost",
    label: "EVM MALİYET FORECAST — VAC",
    fn: (inputs) => {
    const bAC = num(inputs, "bAC");
    const eAC = num(inputs, "eAC");
    return nonNegative(assertFinite(bAC - eAC));
  },
  },
  {
    id: "user.evm_cost_forecast_8",
    family: "cost",
    label: "EVM MALİYET FORECAST — TCPI",
    fn: (inputs) => {
    const bAC = num(inputs, "bAC");
    const eV = num(inputs, "eV");
    const aC = num(inputs, "aC");
    return nonNegative(assertFinite((bAC - eV) / (bAC - aC)));
  },
  },

  // ── FABRİKA YERLEŞİM MESAFE (7 formulas) ──,
  {
    id: "user.factory_layout_distance_0",
    family: "cost",
    label: "FABRİKA YERLEŞİM MESAFE — Dist_ij",
    fn: (inputs) => {
    const x = num(inputs, "x");
    const i = num(inputs, "i");
    const j = num(inputs, "j");
    const y = num(inputs, "y");
    const abs = num(inputs, "abs") || 0;
    const x_i = num(inputs, "x_i") || 0;
    const x_j = num(inputs, "x_j") || 0;
    const y_i = num(inputs, "y_i") || 0;
    const y_j = num(inputs, "y_j") || 0;
    return nonNegative(assertFinite(Math.abs(x_i - x_j) + Math.abs(y_i - y_j)));
  },
  },
  {
    id: "user.factory_layout_distance_1",
    family: "cost",
    label: "FABRİKA YERLEŞİM MESAFE — FlowCost",
    fn: (inputs) => {
    const flow = num(inputs, "flow");
    const ij = num(inputs, "ij");
    const dist = num(inputs, "dist");
    const costPerDist = num(inputs, "costPerDist");
    const flow_ij = num(inputs, "flow_ij") || 0;
    const dist_ij = num(inputs, "dist_ij") || 0;
    return nonNegative(assertFinite(SUM(flow_ij * dist_ij * costPerDist)));
  },
  },
  {
    id: "user.factory_layout_distance_2",
    family: "cost",
    label: "FABRİKA YERLEŞİM MESAFE — AdjScore",
    fn: (inputs) => {
    const flow = num(inputs, "flow");
    const ij = num(inputs, "ij");
    const adjFactor = num(inputs, "adjFactor");
    const flow_ij = num(inputs, "flow_ij") || 0;
    const adjFactor_ij = num(inputs, "adjFactor_ij") || 0;
    return nonNegative(assertFinite(SUM(flow_ij * adjFactor_ij)));
  },
  },
  {
    id: "user.factory_layout_distance_3",
    family: "cost",
    label: "FABRİKA YERLEŞİM MESAFE — SpaceUtil",
    fn: (inputs) => {
    const equipArea = num(inputs, "equipArea");
    const facArea = num(inputs, "facArea");
    return nonNegative(assertFinite(equipArea / facArea));
  },
  },
  {
    id: "user.factory_layout_distance_4",
    family: "cost",
    label: "FABRİKA YERLEŞİM MESAFE — MatHandCost",
    fn: (inputs) => {
    const flowCost = num(inputs, "flowCost");
    const handRate = num(inputs, "handRate");
    return nonNegative(assertFinite(flowCost * handRate));
  },
  },
  {
    id: "user.factory_layout_distance_5",
    family: "cost",
    label: "FABRİKA YERLEŞİM MESAFE — Congestion",
    fn: (inputs) => {
    const crossTraffic = num(inputs, "crossTraffic");
    const aisleCap = num(inputs, "aisleCap");
    return nonNegative(assertFinite(1 + (crossTraffic / aisleCap)));
  },
  },
  {
    id: "user.factory_layout_distance_6",
    family: "cost",
    label: "FABRİKA YERLEŞİM MESAFE — TotalCost",
    fn: (inputs) => {
    const matHand = num(inputs, "matHand");
    const space = num(inputs, "space");
    const congestion = num(inputs, "congestion");
    return nonNegative(assertFinite(matHand + space + congestion));
  },
  },

  // ── FAİZ ORANI RİSKİ (8 formulas) ──,
  {
    id: "user.interest_rate_risk_0",
    family: "cost",
    label: "FAİZ ORANI RİSKİ — Exposure",
    fn: (inputs) => {
    const floatingDebt = num(inputs, "floatingDebt");
    const hedgeRatio = num(inputs, "hedgeRatio");
    return nonNegative(assertFinite(floatingDebt * (1 - hedgeRatio)));
  },
  },
  {
    id: "user.interest_rate_risk_1",
    family: "cost",
    label: "FAİZ ORANI RİSKİ — ShockImpact",
    fn: (inputs) => {
    const exposure = num(inputs, "exposure");
    const bpsChange = num(inputs, "bpsChange");
    return nonNegative(assertFinite(exposure * bpsChange / 10000));
  },
  },
  {
    id: "user.interest_rate_risk_2",
    family: "cost",
    label: "FAİZ ORANI RİSKİ — DurGap",
    fn: (inputs) => {
    const assetDur = num(inputs, "assetDur");
    const liabDur = num(inputs, "liabDur");
    return nonNegative(assertFinite(assetDur - liabDur));
  },
  },
  {
    id: "user.interest_rate_risk_3",
    family: "cost",
    label: "FAİZ ORANI RİSKİ — EVE_Change",
    fn: (inputs) => {
    const durGap = num(inputs, "durGap");
    const assetVal = num(inputs, "assetVal");
    const rateChange = num(inputs, "rateChange");
    return nonNegative(assertFinite(-durGap * assetVal * rateChange));
  },
  }
];
