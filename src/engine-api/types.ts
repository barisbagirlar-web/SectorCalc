export type ToolId = 'SC-001' | 'SC-008' | 'SC-010' | 'SC-012';
export type NumericInput = number | string;
export type Severity = 'CRITICAL' | 'WARNING' | 'INFO' | 'TIP';

export interface EngineStep {
  step: number;
  description: string;
  formula?: string;
  result: string;
}

export interface EngineWarning {
  code: string;
  severity: Severity;
  message: string;
  action: string;
  reference: string | null;
}

export type RiskLevel = 'CRITICAL' | 'WARNING' | 'PASS';
export interface RiskItem {
  level: RiskLevel;
  code: string;
  message: string;
  recommendation: string;
}
export interface StackReportData {
  verdict: string;
  cpk: string;
  ppm: string;
  riskAnalysis: RiskItem[];
  insights: string[];
  standards: string[];
}

export interface EngineResponse<TResult> {
  result: TResult;
  engineVersion: string;
  requestId: string;
}

export interface WeldInput {
  designLoadN: NumericInput;
  weldLengthMm: NumericInput;
  weldStrengthMpa: NumericInput;
  safetyFactor: NumericInput;
  materialThicknessMm: NumericInput;
  jointType?: 'fillet' | 'butt';
}

export interface WeldResult {
  finalLegMm: string;
  finalLegIn: string;
  requiredThroatMm: string;
  minLegMm: string;
  legFromLoadMm: string;
  utilization: string;
  jointType: 'fillet' | 'butt';
  steps: EngineStep[];
  warnings: EngineWarning[];
  sensitivity: Array<{ label: string; finalLegMm: string; utilization: string }>;
}

export interface StackComponent {
  name: string;
  nominal: NumericInput;
  tol: NumericInput;
  distribution: 'normal' | 'uniform' | 'truncated_normal' | 'triangular';
  cpk?: NumericInput;
}

export interface StackInput {
  components: StackComponent[];
  usl: NumericInput;
  lsl: NumericInput;
  target?: NumericInput;
  seed?: number;
  iterations?: number;
}

export interface StackResult {
  nominalSum: string;
  worstPlus: string;
  rssPlus: string;
  mcMean: string;
  mcStd: string;
  mcMin: string;
  mcMax: string;
  mcP0013: string;
  mcP9987: string;
  cp: string;
  cpk: string;
  ppm: string;
  pareto: Array<{ name: string; pct: string }>;
  iterations: number;
  seed: number;
  steps: EngineStep[];
  warnings: EngineWarning[];
  samples: number[];
  specHalf: string;
  rssInSpec: boolean;
  ppmCiLow: string;
  ppmCiHigh: string;
  reportData: StackReportData;
  sensitivity: Array<{ name: string; cpk: string; ppm: string }>;
}

export interface LaborCostInput {
  country: string;
  netSalary: NumericInput;
  payFrequency: 'hourly' | 'weekly' | 'biweekly' | 'monthly';
  hoursPerWeek?: NumericInput;
  employeeRate?: NumericInput;
  employerSSRate?: NumericInput;
  employerUnempRate?: NumericInput;
  healthMonthly?: NumericInput;
  mealMonthly?: NumericInput;
  transportMonthly?: NumericInput;
  annualBonus?: NumericInput;
  severanceRate?: NumericInput;
  overtimeHoursMonthly?: NumericInput;
  overtimeMultiplier?: NumericInput;
  recruitmentCost?: NumericInput;
  tenureYears?: NumericInput;
  currency?: string;
}

export interface CostRow {
  item: string;
  amount: string;
  pct: string;
}

export interface LaborCostResult {
  trueMonthlyCost: string;
  trueHourlyCost: string;
  costMultiplier: string;
  hiddenCostPct: string;
  annualTrueCost: string;
  grossMonthly: string;
  currency: string;
  breakdown: CostRow[];
  steps: EngineStep[];
  warnings: EngineWarning[];
  sensitivity: Array<{ label: string; trueMonthlyCost: string }>;
}

export interface QuoteInput {
  materialCost: NumericInput;
  scrapRate: NumericInput;
  laborHours: NumericInput;
  laborHourlyCost: NumericInput;
  machineHours: NumericInput;
  machineHourlyCost: NumericInput;
  setupMinutes?: NumericInput;
  setupHourlyCost?: NumericInput;
  overheadRate?: NumericInput;
  energyCost?: NumericInput;
  consumablesCost?: NumericInput;
  shippingCost?: NumericInput;
  paymentDays?: NumericInput;
  monthlyInterestRate?: NumericInput;
  targetMargin: NumericInput;
  quantity: NumericInput;
  currency?: string;
}

export interface QuoteResult {
  sellPrice: string;
  unitPrice: string;
  totalCost: string;
  profit: string;
  profitPerUnit: string;
  effectiveMaterial: string;
  financeCharge: string;
  currency: string;
  breakdown: CostRow[];
  steps: EngineStep[];
  warnings: EngineWarning[];
  sensitivity: Array<{ label: string; unitPrice: string; sellPrice: string }>;
}

export interface ToolContract {
  'SC-001': { input: WeldInput; result: WeldResult };
  'SC-008': { input: StackInput; result: StackResult };
  'SC-010': { input: LaborCostInput; result: LaborCostResult };
  'SC-012': { input: QuoteInput; result: QuoteResult };
}
