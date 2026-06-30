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
export const CHUNK_50_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.saas_shelfware_0",
    family: "cost",
    label: "SaaS Shelfware Maliyet — TotalLicenses",
    fn: (inputs) => {
    const purchasedLicenses = num(inputs, "purchasedLicenses");
    return nonNegative(assertFinite(purchasedLicenses));
  },
  },
  {
    id: "user.saas_shelfware_1",
    family: "cost",
    label: "SaaS Shelfware Maliyet — ActiveUsers",
    fn: (inputs) => {
    const usersLoggedInLast30Days = num(inputs, "usersLoggedInLast30Days");
    return nonNegative(assertFinite(usersLoggedInLast30Days));
  },
  },
  {
    id: "user.saas_shelfware_2",
    family: "cost",
    label: "SaaS Shelfware Maliyet — ShelfwarePct",
    fn: (inputs) => {
    const totalLicenses = num(inputs, "totalLicenses");
    const activeUsers = num(inputs, "activeUsers");
    return nonNegative(assertFinite((totalLicenses - activeUsers) / totalLicenses));
  },
  },
  {
    id: "user.saas_shelfware_3",
    family: "cost",
    label: "SaaS Shelfware Maliyet — ShelfwareCost",
    fn: (inputs) => {
    const shelfwarePct = num(inputs, "shelfwarePct");
    const totalContractValue = num(inputs, "totalContractValue");
    return nonNegative(assertFinite(shelfwarePct * totalContractValue));
  },
  },
  {
    id: "user.saas_shelfware_4",
    family: "cost",
    label: "SaaS Shelfware Maliyet — UtilizationRate",
    fn: (inputs) => {
    const activeUsers = num(inputs, "activeUsers");
    const totalLicenses = num(inputs, "totalLicenses");
    return nonNegative(assertFinite(activeUsers / totalLicenses));
  },
  },
  {
    id: "user.saas_shelfware_5",
    family: "cost",
    label: "SaaS Shelfware Maliyet — FeatureAdoption",
    fn: (inputs) => {
    const featuresUsed = num(inputs, "featuresUsed");
    const totalFeatures = num(inputs, "totalFeatures");
    return nonNegative(assertFinite(featuresUsed / totalFeatures));
  },
  },
  {
    id: "user.saas_shelfware_6",
    family: "cost",
    label: "SaaS Shelfware Maliyet — OptimizationSavings",
    fn: (inputs) => {
    const shelfwareCost = num(inputs, "shelfwareCost");
    const underutilizedTierPriceDiff = num(inputs, "underutilizedTierPriceDiff");
    const users = num(inputs, "users");
    return nonNegative(assertFinite(shelfwareCost + (underutilizedTierPriceDiff * users)));
  },
  },
  {
    id: "user.saas_shelfware_7",
    family: "cost",
    label: "SaaS Shelfware Maliyet — TrueUpCost",
    fn: (inputs) => {
    const actualUsage = num(inputs, "actualUsage");
    const contractedUsage = num(inputs, "contractedUsage");
    const overageRate = num(inputs, "overageRate");
    const max = num(inputs, "max") || 0;
    return nonNegative(assertFinite(Math.max(0, actualUsage - contractedUsage) * overageRate));
  },
  },

  // ── Saatlik Ücret (7 formulas) ──,
  {
    id: "user.hourly_rate_0",
    family: "cost",
    label: "Saatlik Ücret — GrossAnnualSalary",
    fn: (inputs) => {
    const baseSalary = num(inputs, "baseSalary");
    const bonuses = num(inputs, "bonuses");
    return nonNegative(assertFinite(baseSalary + bonuses));
  },
  },
  {
    id: "user.hourly_rate_1",
    family: "cost",
    label: "Saatlik Ücret — EmployerTaxes",
    fn: (inputs) => {
    const grossAnnualSalary = num(inputs, "grossAnnualSalary");
    const taxRate = num(inputs, "taxRate");
    return nonNegative(assertFinite(grossAnnualSalary * taxRate));
  },
  },
  {
    id: "user.hourly_rate_2",
    family: "cost",
    label: "Saatlik Ücret — Benefits",
    fn: (inputs) => {
    const healthInsurance = num(inputs, "healthInsurance");
    const retirementMatch = num(inputs, "retirementMatch");
    const paidTimeOffCost = num(inputs, "paidTimeOffCost");
    return nonNegative(assertFinite(healthInsurance + retirementMatch + paidTimeOffCost));
  },
  },
  {
    id: "user.hourly_rate_3",
    family: "cost",
    label: "Saatlik Ücret — TotalLaborCost",
    fn: (inputs) => {
    const grossAnnualSalary = num(inputs, "grossAnnualSalary");
    const employerTaxes = num(inputs, "employerTaxes");
    const benefits = num(inputs, "benefits");
    return nonNegative(assertFinite(grossAnnualSalary + employerTaxes + benefits));
  },
  },
  {
    id: "user.hourly_rate_4",
    family: "cost",
    label: "Saatlik Ücret — ProductiveHours",
    fn: (inputs) => {
    const weeksPerYear = num(inputs, "weeksPerYear");
    const vacationWeeks = num(inputs, "vacationWeeks");
    const hoursPerWeek = num(inputs, "hoursPerWeek");
    const idleTimePct = num(inputs, "idleTimePct");
    return nonNegative(assertFinite((weeksPerYear - vacationWeeks) * hoursPerWeek * (1 - idleTimePct)));
  },
  },
  {
    id: "user.hourly_rate_5",
    family: "cost",
    label: "Saatlik Ücret — FullyBurdenedHourlyRate",
    fn: (inputs) => {
    const totalLaborCost = num(inputs, "totalLaborCost");
    const productiveHours = num(inputs, "productiveHours");
    return nonNegative(assertFinite(totalLaborCost / productiveHours));
  },
  },
  {
    id: "user.hourly_rate_6",
    family: "cost",
    label: "Saatlik Ücret — MarginRate",
    fn: (inputs) => {
    const fullyBurdenedHourlyRate = num(inputs, "fullyBurdenedHourlyRate");
    const targetMargin = num(inputs, "targetMargin");
    return nonNegative(assertFinite(fullyBurdenedHourlyRate * (1 + targetMargin)));
  },
  },

  // ── SMED Değişim Optimize Edici (7 formulas) ──
];
