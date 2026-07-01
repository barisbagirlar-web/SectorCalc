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
export const CHUNK_61_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.delivery_cost_3",
    family: "cost",
    label: "Teslimat Maliyeti — FuelSurcharge",
    fn: (inputs) => {
    const baseFreight = num(inputs, "baseFreight");
    const fuelIndexPct = num(inputs, "fuelIndexPct");
    return nonNegative(assertFinite(baseFreight * fuelIndexPct));
  },
  },
  {
    id: "user.delivery_cost_4",
    family: "cost",
    label: "Teslimat Maliyeti — TotalDeliveryCost",
    fn: (inputs) => {
    const linehaul = num(inputs, "linehaul");
    const lastMile = num(inputs, "lastMile");
    const failedDeliveryCost = num(inputs, "failedDeliveryCost");
    const surcharges = num(inputs, "surcharges");
    return nonNegative(assertFinite(linehaul + lastMile + failedDeliveryCost + surcharges));
  },
  },
  {
    id: "user.delivery_cost_5",
    family: "cost",
    label: "Teslimat Maliyeti — DeliveryEfficiency",
    fn: (inputs) => {
    const successfulDrops = num(inputs, "successfulDrops");
    const totalPlannedDrops = num(inputs, "totalPlannedDrops");
    return nonNegative(assertFinite(successfulDrops / totalPlannedDrops));
  },
  },

  // ── Tohum Orani (7 formulas) ──,
  {
    id: "user.seed_rate_0",
    family: "cost",
    label: "Tohum Orani — TargetPlantPopulation",
    fn: (inputs) => {
    const area = num(inputs, "area");
    const desiredPlantsPerSqm = num(inputs, "desiredPlantsPerSqm");
    return nonNegative(assertFinite(area * desiredPlantsPerSqm));
  },
  },
  {
    id: "user.seed_rate_1",
    family: "cost",
    label: "Tohum Orani — SeedRequirement",
    fn: (inputs) => {
    const targetPlantPopulation = num(inputs, "targetPlantPopulation");
    const germinationRate = num(inputs, "germinationRate");
    const fieldEmergenceRate = num(inputs, "fieldEmergenceRate");
    return nonNegative(assertFinite(targetPlantPopulation / (germinationRate * fieldEmergenceRate)));
  },
  },
  {
    id: "user.seed_rate_2",
    family: "cost",
    label: "Tohum Orani — SeedCost",
    fn: (inputs) => {
    const seedRequirement = num(inputs, "seedRequirement");
    const pricePerKg = num(inputs, "pricePerKg");
    return nonNegative(assertFinite(seedRequirement * pricePerKg));
  },
  },
  {
    id: "user.seed_rate_3",
    family: "cost",
    label: "Tohum Orani — OptimalYield",
    fn: (inputs) => {
    const f = num(inputs, "f");
    const plantPopulation = num(inputs, "plantPopulation");
    const soilFertility = num(inputs, "soilFertility");
    const water = num(inputs, "water");
    return nonNegative(assertFinite(plantPopulation * soilFertility * water));
  },
  },
  {
    id: "user.seed_rate_4",
    family: "cost",
    label: "Tohum Orani — FinancialLoss_Under",
    fn: (inputs) => {
    const targetYield = num(inputs, "targetYield");
    const actualYield = num(inputs, "actualYield");
    const cropPrice = num(inputs, "cropPrice");
    return nonNegative(assertFinite((targetYield - actualYield) * cropPrice));
  },
  },
  {
    id: "user.seed_rate_5",
    family: "cost",
    label: "Tohum Orani — FinancialLoss_Over",
    fn: (inputs) => {
    const actualSeed = num(inputs, "actualSeed");
    const optimalSeed = num(inputs, "optimalSeed");
    const seedCost = num(inputs, "seedCost");
    return nonNegative(assertFinite((actualSeed - optimalSeed) * seedCost));
  },
  },
  {
    id: "user.seed_rate_6",
    family: "cost",
    label: "Tohum Orani — ROI_Seed",
    fn: (inputs) => {
    const optimalYield = num(inputs, "optimalYield");
    const cropPrice = num(inputs, "cropPrice");
    const seedCost = num(inputs, "seedCost");
    return nonNegative(assertFinite((optimalYield * cropPrice - seedCost) / seedCost));
  },
  },

  // ── Toplam Calisan Maliyeti (7 formulas) ──,
  {
    id: "user.total_employee_cost_0",
    family: "cost",
    label: "Toplam Calisan Maliyeti — GrossSalary",
    fn: (inputs) => {
    const basePay = num(inputs, "basePay");
    const bonuses = num(inputs, "bonuses");
    const overtime = num(inputs, "overtime");
    return nonNegative(assertFinite(basePay + bonuses + overtime));
  },
  },
  {
    id: "user.total_employee_cost_1",
    family: "cost",
    label: "Toplam Calisan Maliyeti — StatutoryCosts",
    fn: (inputs) => {
    const grossSalary = num(inputs, "grossSalary");
    const socialSecurity = num(inputs, "socialSecurity");
    const unemployment = num(inputs, "unemployment");
    const taxes = num(inputs, "taxes");
    return nonNegative(assertFinite(grossSalary * (socialSecurity + unemployment + taxes)));
  },
  },
  {
    id: "user.total_employee_cost_2",
    family: "cost",
    label: "Toplam Calisan Maliyeti — Benefits",
    fn: (inputs) => {
    const healthInsurance = num(inputs, "healthInsurance");
    const retirement = num(inputs, "retirement");
    const meals = num(inputs, "meals");
    const transport = num(inputs, "transport");
    return nonNegative(assertFinite(healthInsurance + retirement + meals + transport));
  },
  },
  {
    id: "user.total_employee_cost_3",
    family: "cost",
    label: "Toplam Calisan Maliyeti — AbsenteeismCost",
    fn: (inputs) => {
    const absentHours = num(inputs, "absentHours");
    const fullyBurdenedRate = num(inputs, "fullyBurdenedRate");
    return nonNegative(assertFinite(absentHours * fullyBurdenedRate));
  },
  },
  {
    id: "user.total_employee_cost_4",
    family: "cost",
    label: "Toplam Calisan Maliyeti — TurnoverCost",
    fn: (inputs) => {
    const recruitment = num(inputs, "recruitment");
    const training = num(inputs, "training");
    const turnoverRate = num(inputs, "turnoverRate");
    return nonNegative(assertFinite((recruitment + training) * turnoverRate));
  },
  }
];
