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
export const CHUNK_57_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.repair_shop_quote_1",
    family: "cost",
    label: "Tamirhane Parça ve İşçilik Teklif — PartMargin",
    fn: (inputs) => {
    const partCost = num(inputs, "partCost");
    const partMarkupPct = num(inputs, "partMarkupPct");
    return nonNegative(assertFinite(partCost * partMarkupPct));
  },
  },
  {
    id: "user.repair_shop_quote_2",
    family: "cost",
    label: "Tamirhane Parça ve İşçilik Teklif — LaborCost",
    fn: (inputs) => {
    const flatRateHours = num(inputs, "flatRateHours");
    const shopHourlyRate = num(inputs, "shopHourlyRate");
    return nonNegative(assertFinite(flatRateHours * shopHourlyRate));
  },
  },
  {
    id: "user.repair_shop_quote_3",
    family: "cost",
    label: "Tamirhane Parça ve İşçilik Teklif — SubletCost",
    fn: (inputs) => {
    const subletInvoices = num(inputs, "subletInvoices");
    return nonNegative(assertFinite(SUM(subletInvoices)));
  },
  },
  {
    id: "user.repair_shop_quote_4",
    family: "cost",
    label: "Tamirhane Parça ve İşçilik Teklif — TotalQuote",
    fn: (inputs) => {
    const partCost = num(inputs, "partCost");
    const partMargin = num(inputs, "partMargin");
    const laborCost = num(inputs, "laborCost");
    const subletCost = num(inputs, "subletCost");
    const shopSuppliesFee = num(inputs, "shopSuppliesFee");
    const environmentalFee = num(inputs, "environmentalFee");
    return nonNegative(assertFinite(partCost + partMargin + laborCost + subletCost + shopSuppliesFee + environmentalFee));
  },
  },
  {
    id: "user.repair_shop_quote_5",
    family: "cost",
    label: "Tamirhane Parça ve İşçilik Teklif — EffectiveLaborRate",
    fn: (inputs) => {
    const laborCost = num(inputs, "laborCost");
    const partMargin = num(inputs, "partMargin");
    const actualHours = num(inputs, "actualHours");
    return nonNegative(assertFinite((laborCost + partMargin) / actualHours));
  },
  },
  {
    id: "user.repair_shop_quote_6",
    family: "cost",
    label: "Tamirhane Parça ve İşçilik Teklif — GrossProfitPct",
    fn: (inputs) => {
    const totalQuote = num(inputs, "totalQuote");
    const partCost = num(inputs, "partCost");
    const actualLaborCost = num(inputs, "actualLaborCost");
    return nonNegative(assertFinite((totalQuote - partCost - actualLaborCost) / totalQuote));
  },
  },

  // ── Taşeron Marj Sızıntı Dedektörü (6 formulas) ──,
  {
    id: "user.subcontractor_margin_leak_0",
    family: "cost",
    label: "Taşeron Marj Sızıntı Dedektörü — QuotedMargin",
    fn: (inputs) => {
    const contractValue = num(inputs, "contractValue");
    const estimatedSubcontractorCost = num(inputs, "estimatedSubcontractorCost");
    return nonNegative(assertFinite((contractValue - estimatedSubcontractorCost) / contractValue));
  },
  },
  {
    id: "user.subcontractor_margin_leak_1",
    family: "cost",
    label: "Taşeron Marj Sızıntı Dedektörü — ActualMargin",
    fn: (inputs) => {
    const contractValue = num(inputs, "contractValue");
    const actualSubcontractorCost = num(inputs, "actualSubcontractorCost");
    const reworkCost = num(inputs, "reworkCost");
    const delayPenalties = num(inputs, "delayPenalties");
    return nonNegative(assertFinite((contractValue - actualSubcontractorCost - reworkCost - delayPenalties) / contractValue));
  },
  },
  {
    id: "user.subcontractor_margin_leak_2",
    family: "cost",
    label: "Taşeron Marj Sızıntı Dedektörü — MarginLeak",
    fn: (inputs) => {
    const quotedMargin = num(inputs, "quotedMargin");
    const actualMargin = num(inputs, "actualMargin");
    return nonNegative(assertFinite(quotedMargin - actualMargin));
  },
  },
  {
    id: "user.subcontractor_margin_leak_3",
    family: "cost",
    label: "Taşeron Marj Sızıntı Dedektörü — ChangeOrderCost",
    fn: (inputs) => {
    const changeOrderAmount = num(inputs, "changeOrderAmount");
    const i = num(inputs, "i");
    const changeOrderAmount_i = num(inputs, "changeOrderAmount_i") || 0;
    return nonNegative(assertFinite(SUM(changeOrderAmount_i)));
  },
  },
  {
    id: "user.subcontractor_margin_leak_4",
    family: "cost",
    label: "Taşeron Marj Sızıntı Dedektörü — UnbilledWork",
    fn: (inputs) => {
    const actualWorkCompleted = num(inputs, "actualWorkCompleted");
    const billedAmount = num(inputs, "billedAmount");
    return nonNegative(assertFinite(actualWorkCompleted - billedAmount));
  },
  },
  {
    id: "user.subcontractor_margin_leak_5",
    family: "cost",
    label: "Taşeron Marj Sızıntı Dedektörü — LeakagePct",
    fn: (inputs) => {
    const marginLeak = num(inputs, "marginLeak");
    const quotedMargin = num(inputs, "quotedMargin");
    return nonNegative(assertFinite(marginLeak / quotedMargin));
  },
  },

  // ── Taşıma Mode Maliyet risk (7 formulas) ──,
  {
    id: "user.transport_mode_risk_0",
    family: "cost",
    label: "Taşıma Mode Maliyet risk — Cost_Air",
    fn: (inputs) => {
    const weight = num(inputs, "weight");
    const airRate = num(inputs, "airRate");
    const handling = num(inputs, "handling");
    return nonNegative(assertFinite(weight * airRate + handling));
  },
  },
  {
    id: "user.transport_mode_risk_1",
    family: "cost",
    label: "Taşıma Mode Maliyet risk — Cost_Sea",
    fn: (inputs) => {
    const volume = num(inputs, "volume");
    const seaRate = num(inputs, "seaRate");
    const portFees = num(inputs, "portFees");
    const customs = num(inputs, "customs");
    return nonNegative(assertFinite(volume * seaRate + portFees + customs));
  },
  },
  {
    id: "user.transport_mode_risk_2",
    family: "cost",
    label: "Taşıma Mode Maliyet risk — Cost_Road",
    fn: (inputs) => {
    const distance = num(inputs, "distance");
    const roadRate = num(inputs, "roadRate");
    const tolls = num(inputs, "tolls");
    return nonNegative(assertFinite(distance * roadRate + tolls));
  },
  }
];
