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
export const CHUNK_40_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.muda_waste_cost_2",
    family: "cost",
    label: "Muda Atik Maliyet — Transport",
    fn: (inputs) => {
    const transportDistance = num(inputs, "transportDistance");
    const costPerMeter = num(inputs, "costPerMeter");
    const trips = num(inputs, "trips");
    return nonNegative(assertFinite(transportDistance * costPerMeter * trips));
  },
  },
  {
    id: "user.muda_waste_cost_3",
    family: "cost",
    label: "Muda Atik Maliyet — Overprocessing",
    fn: (inputs) => {
    const actualTime = num(inputs, "actualTime");
    const standardTime = num(inputs, "standardTime");
    const laborRate = num(inputs, "laborRate");
    return nonNegative(assertFinite((actualTime - standardTime) * laborRate));
  },
  },
  {
    id: "user.muda_waste_cost_4",
    family: "cost",
    label: "Muda Atik Maliyet — Inventory",
    fn: (inputs) => {
    const excessInventory = num(inputs, "excessInventory");
    const holdingCostRate = num(inputs, "holdingCostRate");
    const time = num(inputs, "time");
    return nonNegative(assertFinite(excessInventory * holdingCostRate * time));
  },
  },
  {
    id: "user.muda_waste_cost_5",
    family: "cost",
    label: "Muda Atik Maliyet — Motion",
    fn: (inputs) => {
    const unnecessaryMotionTime = num(inputs, "unnecessaryMotionTime");
    const laborRate = num(inputs, "laborRate");
    return nonNegative(assertFinite(unnecessaryMotionTime * laborRate));
  },
  },
  {
    id: "user.muda_waste_cost_6",
    family: "cost",
    label: "Muda Atik Maliyet — Defects",
    fn: (inputs) => {
    const defectUnits = num(inputs, "defectUnits");
    const materialCost = num(inputs, "materialCost");
    const reworkCost = num(inputs, "reworkCost");
    return nonNegative(assertFinite(defectUnits * (materialCost + reworkCost)));
  },
  },
  {
    id: "user.muda_waste_cost_7",
    family: "cost",
    label: "Muda Atik Maliyet — TotalMudaCost",
    fn: (inputs) => {
    const overproduction = num(inputs, "overproduction");
    const waiting = num(inputs, "waiting");
    const transport = num(inputs, "transport");
    const overprocessing = num(inputs, "overprocessing");
    const inventory = num(inputs, "inventory");
    const motion = num(inputs, "motion");
    const defects = num(inputs, "defects");
    return nonNegative(assertFinite(overproduction + waiting + transport + overprocessing + inventory + motion + defects));
  },
  },

  // ── Nakit Akisi Acigi (10 formulas) ──,
  {
    id: "user.cash_flow_gap_0",
    family: "cost",
    label: "Nakit Akisi Acigi — CashInflow",
    fn: (inputs) => {
    const receipts = num(inputs, "receipts");
    const t = num(inputs, "t");
    const receipts_t = num(inputs, "receipts_t") || 0;
    return nonNegative(assertFinite(SUM(receipts_t)));
  },
  },
  {
    id: "user.cash_flow_gap_1",
    family: "cost",
    label: "Nakit Akisi Acigi — CashOutflow",
    fn: (inputs) => {
    const payments = num(inputs, "payments");
    const t = num(inputs, "t");
    const payments_t = num(inputs, "payments_t") || 0;
    return nonNegative(assertFinite(SUM(payments_t)));
  },
  },
  {
    id: "user.cash_flow_gap_2",
    family: "cost",
    label: "Nakit Akisi Acigi — NetCashFlow_t",
    fn: (inputs) => {
    const cashInflow = num(inputs, "cashInflow");
    const t = num(inputs, "t");
    const cashOutflow = num(inputs, "cashOutflow");
    const cashInflow_t = num(inputs, "cashInflow_t") || 0;
    const cashOutflow_t = num(inputs, "cashOutflow_t") || 0;
    return nonNegative(assertFinite(cashInflow_t - cashOutflow_t));
  },
  },
  {
    id: "user.cash_flow_gap_3",
    family: "cost",
    label: "Nakit Akisi Acigi — CumulativeCashFlow",
    fn: (inputs) => {
    const netCashFlow = num(inputs, "netCashFlow");
    const t = num(inputs, "t");
    const netCashFlow_t = num(inputs, "netCashFlow_t") || 0;
    return nonNegative(assertFinite(SUM(netCashFlow_t)));
  },
  },
  {
    id: "user.cash_flow_gap_4",
    family: "cost",
    label: "Nakit Akisi Acigi — CashGap",
    fn: (inputs) => {
    const cumulativeCashFlow = num(inputs, "cumulativeCashFlow");
    const max = num(inputs, "max") || 0;
    const min = num(inputs, "min") || 0;
    return nonNegative(assertFinite(Math.max(0, -Math.min(cumulativeCashFlow))));
  },
  },
  {
    id: "user.cash_flow_gap_5",
    family: "cost",
    label: "Nakit Akisi Acigi — DSO",
    fn: (inputs) => {
    const accountsReceivable = num(inputs, "accountsReceivable");
    const totalCreditSales = num(inputs, "totalCreditSales");
    const days = num(inputs, "days");
    return nonNegative(assertFinite((accountsReceivable / totalCreditSales) * days));
  },
  },
  {
    id: "user.cash_flow_gap_6",
    family: "cost",
    label: "Nakit Akisi Acigi — DPO",
    fn: (inputs) => {
    const accountsPayable = num(inputs, "accountsPayable");
    const totalCreditPurchases = num(inputs, "totalCreditPurchases");
    const days = num(inputs, "days");
    return nonNegative(assertFinite((accountsPayable / totalCreditPurchases) * days));
  },
  },
  {
    id: "user.cash_flow_gap_7",
    family: "cost",
    label: "Nakit Akisi Acigi — DIO",
    fn: (inputs) => {
    const inventory = num(inputs, "inventory");
    const cOGS = num(inputs, "cOGS");
    const days = num(inputs, "days");
    return nonNegative(assertFinite((inventory / cOGS) * days));
  },
  },
  {
    id: "user.cash_flow_gap_8",
    family: "cost",
    label: "Nakit Akisi Acigi — CashConversionCycle",
    fn: (inputs) => {
    const dSO = num(inputs, "dSO");
    const dIO = num(inputs, "dIO");
    const dPO = num(inputs, "dPO");
    return nonNegative(assertFinite(dSO + dIO - dPO));
  },
  }
];
