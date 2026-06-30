/**
 * Industrial Formula Tools — Input Types & Validation.
 *
 * 18 premium calculators: Tier 1-4 industrial engineering & financial formulas.
 * Every input is SI-unit based with finite number guards.
 */

/* ────────────────────────────────────────────────────────────────────────────
 * SHARED UTILITIES
 * ──────────────────────────────────────────────────────────────────────────── */

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectRequiredNumeric(
  inputs: Record<string, unknown>,
  keys: readonly string[],
  labels: Record<string, string>,
): { values: Record<string, number>; errors: string[] } {
  const values: Record<string, number> = {};
  const errors: string[] = [];
  for (const key of keys) {
    const v = inputs[key];
    if (v === undefined || v === null) {
      errors.push(`${labels[key] ?? key} is required.`);
      continue;
    }
    const n = typeof v === "number" ? v : Number(v);
    if (!isValidNumber(n)) {
      errors.push(`${labels[key] ?? key} must be a finite number.`);
      continue;
    }
    values[key] = n;
  }
  return { values, errors };
}

function nonNegativeGuard(
  values: Record<string, number>,
  keys: readonly string[],
  labels: Record<string, string>,
): string[] {
  const warnings: string[] = [];
  for (const key of keys) {
    if (values[key] < 0) {
      warnings.push(`${labels[key] ?? key} is negative; clamped to zero.`);
    }
  }
  return warnings;
}

/* ────────────────────────────────────────────────────────────────────────────
 * 1. IRR — Internal Rate of Return
 * ──────────────────────────────────────────────────────────────────────────── */

export type IrrInputs = {
  initialInvestment: number;
  cashFlows: readonly number[]; // years 1-10
};

export const IRR_INPUT_KEYS = [
  "initialInvestment",
  "cashFlowYear1", "cashFlowYear2", "cashFlowYear3", "cashFlowYear4", "cashFlowYear5",
  "cashFlowYear6", "cashFlowYear7", "cashFlowYear8", "cashFlowYear9", "cashFlowYear10",
] as const;

const IRR_LABELS: Record<string, string> = {
  initialInvestment: "Initial investment",
  cashFlowYear1: "Cash flow year 1",
  cashFlowYear2: "Cash flow year 2",
  cashFlowYear3: "Cash flow year 3",
  cashFlowYear4: "Cash flow year 4",
  cashFlowYear5: "Cash flow year 5",
  cashFlowYear6: "Cash flow year 6",
  cashFlowYear7: "Cash flow year 7",
  cashFlowYear8: "Cash flow year 8",
  cashFlowYear9: "Cash flow year 9",
  cashFlowYear10: "Cash flow year 10",
};

export type IrrValidationResult =
  | { ok: true; inputs: IrrInputs; errors: []; warnings: string[] }
  | { ok: false; inputs: null; errors: string[]; warnings: string[] };

export function validateIrrInputs(raw: Record<string, unknown>): IrrValidationResult {
  const { values, errors } = collectRequiredNumeric(raw, IRR_INPUTS_REQUIRED, IRR_LABELS);
  if (errors.length > 0) return { ok: false, inputs: null, errors, warnings: [] };
  const warnings = nonNegativeGuard(values, ["initialInvestment"], IRR_LABELS);

  const cashFlows = (["cashFlowYear1","cashFlowYear2","cashFlowYear3","cashFlowYear4","cashFlowYear5",
    "cashFlowYear6","cashFlowYear7","cashFlowYear8","cashFlowYear9","cashFlowYear10"] as const)
    .map((k) => values[k] ?? 0);

  const hasPos = cashFlows.some((c) => c > 0);
  const hasNeg = values.initialInvestment < 0 || cashFlows.some((c) => c < 0);
  if (!hasPos || !hasNeg) {
    return { ok: false, inputs: null, errors: ["At least one positive and one negative cash flow required for IRR."], warnings: [] };
  }
  return {
    ok: true,
    inputs: { initialInvestment: values.initialInvestment, cashFlows },
    errors: [],
    warnings,
  };
}

const IRR_INPUTS_REQUIRED: readonly string[] = IRR_INPUT_KEYS;

/* ────────────────────────────────────────────────────────────────────────────
 * 2. NPV — Net Present Value
 * ──────────────────────────────────────────────────────────────────────────── */

export type NpvInputs = {
  initialCost: number;
  cashFlowYears1to5: number;
  cashFlowYears6to10: number;
  discountRate: number;        // decimal (10% → 0.10)
  projectLifeYears: number;
  probabilityBase: number;     // decimal
  probabilityOptimistic: number;
  terminalGrowthRate: number;  // decimal
};

export const NPV_INPUT_KEYS = [
  "initialCost", "cashFlowYears1to5", "cashFlowYears6to10",
  "discountRate", "projectLifeYears", "probabilityBase",
  "probabilityOptimistic", "terminalGrowthRate",
] as const;

const NPV_LABELS: Record<string, string> = {
  initialCost: "Initial investment",
  cashFlowYears1to5: "Avg cash flow years 1-5",
  cashFlowYears6to10: "Avg cash flow years 6-10",
  discountRate: "Discount rate",
  projectLifeYears: "Project life",
  probabilityBase: "Probability of base case",
  probabilityOptimistic: "Probability of optimistic",
  terminalGrowthRate: "Terminal growth rate",
};

export type NpvValidationResult =
  | { ok: true; inputs: NpvInputs; errors: []; warnings: string[] }
  | { ok: false; inputs: null; errors: string[]; warnings: string[] };

export function validateNpvInputs(raw: Record<string, unknown>): NpvValidationResult {
  const { values, errors } = collectRequiredNumeric(raw, NPV_INPUT_KEYS, NPV_LABELS);
  if (errors.length > 0) return { ok: false, inputs: null, errors, warnings: [] };
  const warnings: string[] = [];

  if (values.discountRate <= -1 || values.discountRate >= 100) {
    return { ok: false, inputs: null, errors: ["Discount rate must be > -100% and < 100%."], warnings: [] };
  }
  if (values.discountRate !== -1 && (values.discountRate <= -1 || values.discountRate === -1)) {
    // discountRate ≠ -1 handled above
  }
  const dr = values.discountRate / 100;
  const tg = values.terminalGrowthRate / 100;
  if (tg >= dr) {
    warnings.push("Terminal growth rate >= discount rate. Terminal value is undefined (r ≤ g).");
  }
  if (values.probabilityBase + values.probabilityOptimistic > 100) {
    warnings.push("Base + optimistic probabilities exceed 100%. Remaining probability treated as pessimistic.");
  }

  return {
    ok: true,
    inputs: {
      initialCost: values.initialCost,
      cashFlowYears1to5: values.cashFlowYears1to5,
      cashFlowYears6to10: values.cashFlowYears6to10,
      discountRate: dr,
      projectLifeYears: values.projectLifeYears,
      probabilityBase: values.probabilityBase / 100,
      probabilityOptimistic: values.probabilityOptimistic / 100,
      terminalGrowthRate: tg,
    },
    errors: [],
    warnings,
  };
}

/* ────────────────────────────────────────────────────────────────────────────
 * 3. DCF — Discounted Cash Flow
 * ──────────────────────────────────────────────────────────────────────────── */

export type DcfInputs = {
  freeCashFlows: readonly number[]; // years 1-5
  equityValue: number;
  debtValue: number;
  costOfEquity: number;     // decimal
  costOfDebt: number;       // decimal
  taxRate: number;          // decimal
  terminalGrowthRate: number; // decimal
  sharesOutstanding: number;
};

export const DCF_INPUT_KEYS = [
  "freeCashFlowYear1", "freeCashFlowYear2", "freeCashFlowYear3",
  "freeCashFlowYear4", "freeCashFlowYear5",
  "equityValue", "debtValue", "costOfEquity", "costOfDebt",
  "taxRate", "terminalGrowthRate", "sharesOutstanding",
] as const;

const DCF_LABELS: Record<string, string> = {
  freeCashFlowYear1: "FCFF year 1",
  freeCashFlowYear2: "FCFF year 2",
  freeCashFlowYear3: "FCFF year 3",
  freeCashFlowYear4: "FCFF year 4",
  freeCashFlowYear5: "FCFF year 5",
  equityValue: "Equity market value",
  debtValue: "Debt market value",
  costOfEquity: "Cost of equity (Re)",
  costOfDebt: "Cost of debt (Rd)",
  taxRate: "Corporate tax rate",
  terminalGrowthRate: "Terminal growth rate",
  sharesOutstanding: "Shares outstanding",
};

export type DcfValidationResult =
  | { ok: true; inputs: DcfInputs; errors: []; warnings: string[] }
  | { ok: false; inputs: null; errors: string[]; warnings: string[] };

export function validateDcfInputs(raw: Record<string, unknown>): DcfValidationResult {
  const { values, errors } = collectRequiredNumeric(raw, DCF_INPUT_KEYS, DCF_LABELS);
  if (errors.length > 0) return { ok: false, inputs: null, errors, warnings: [] };
  const warnings: string[] = [];

  const fcf = [values.freeCashFlowYear1, values.freeCashFlowYear2, values.freeCashFlowYear3,
    values.freeCashFlowYear4, values.freeCashFlowYear5];
  const ce = values.costOfEquity / 100;
  const cd = values.costOfDebt / 100;
  const tr = values.taxRate / 100;
  const tg = values.terminalGrowthRate / 100;

  const wacc = (values.equityValue / (values.equityValue + values.debtValue)) * ce +
    (values.debtValue / (values.equityValue + values.debtValue)) * cd * (1 - tr);

  if (wacc <= tg) {
    warnings.push(`WACC (${(wacc * 100).toFixed(2)}%) <= terminal growth rate. Terminal value is undefined.`);
  }
  if (values.sharesOutstanding <= 0) {
    return { ok: false, inputs: null, errors: ["Shares outstanding must be > 0."], warnings: [] };
  }

  return {
    ok: true,
    inputs: {
      freeCashFlows: fcf,
      equityValue: values.equityValue,
      debtValue: values.debtValue,
      costOfEquity: ce,
      costOfDebt: cd,
      taxRate: tr,
      terminalGrowthRate: tg,
      sharesOutstanding: values.sharesOutstanding,
    },
    errors: [],
    warnings,
  };
}

/* ────────────────────────────────────────────────────────────────────────────
 * 4. Lease vs Buy
 * ──────────────────────────────────────────────────────────────────────────── */

export type LeaseVsBuyInputs = {
  purchasePrice: number;
  leaseTermMonths: number;
  monthlyLeasePayment: number;
  taxRate: number;            // decimal
  salvageValuePercent: number; // decimal
  costOfDebt: number;         // decimal
  maintenanceDeltaYearly?: number;
  includeOpportunityCost?: boolean;
};

export const LEASE_VS_BUY_INPUT_KEYS = [
  "purchasePrice", "leaseTermMonths", "monthlyLeasePayment",
  "taxRate", "salvageValuePercent", "costOfDebt",
] as const;

const LvB_LABELS: Record<string, string> = {
  purchasePrice: "Purchase price",
  leaseTermMonths: "Lease term",
  monthlyLeasePayment: "Monthly lease payment",
  taxRate: "Tax rate",
  salvageValuePercent: "Salvage value",
  costOfDebt: "Cost of debt",
};

export type LeaseVsBuyValidationResult =
  | { ok: true; inputs: LeaseVsBuyInputs; errors: []; warnings: string[] }
  | { ok: false; inputs: null; errors: string[]; warnings: string[] };

export function validateLeaseVsBuyInputs(raw: Record<string, unknown>): LeaseVsBuyValidationResult {
  const { values, errors } = collectRequiredNumeric(raw, LEASE_VS_BUY_INPUT_KEYS, LvB_LABELS);
  if (errors.length > 0) return { ok: false, inputs: null, errors, warnings: [] };
  const warnings: string[] = [];

  if (values.leaseTermMonths <= 0) errors.push("Lease term must be > 0 months.");
  if (values.monthlyLeasePayment <= 0) errors.push("Monthly lease payment must be > 0.");
  if (values.taxRate < 0 || values.taxRate > 100) errors.push("Tax rate must be 0-100%.");

  return {
    ok: true,
    inputs: {
      purchasePrice: values.purchasePrice,
      leaseTermMonths: values.leaseTermMonths,
      monthlyLeasePayment: values.monthlyLeasePayment,
      taxRate: values.taxRate / 100,
      salvageValuePercent: values.salvageValuePercent / 100,
      costOfDebt: values.costOfDebt / 100,
    },
    errors: [],
    warnings,
  };
}

/* ────────────────────────────────────────────────────────────────────────────
 * 5. Darcy-Weisbach Pressure Drop
 * ──────────────────────────────────────────────────────────────────────────── */

export type DarcyWeisbachInputs = {
  flowRate: number;            // m³/h
  pipeLength: number;          // m
  pipeDiameter: number;        // mm
  fluidDensity: number;        // kg/m³
  fluidViscosity: number;      // Pa·s
  pipeRoughness: number;       // mm (from material)
  elbow90Count: number;
  gateValveCount: number;
  teeCount: number;
};

export const DW_INPUT_KEYS = [
  "flowRate", "pipeLength", "pipeDiameter", "fluidDensity", "fluidViscosity",
  "pipeMaterial",
] as const;

const DW_LABELS: Record<string, string> = {
  flowRate: "Flow rate",
  pipeLength: "Pipe length",
  pipeDiameter: "Pipe inner diameter",
  fluidDensity: "Fluid density",
  fluidViscosity: "Dynamic viscosity",
  pipeMaterial: "Pipe material",
};

const PIPE_ROUGHNESS: Record<string, number> = {
  drawn_tubing: 0.0015,
  steel: 0.046,
  galvanized: 0.15,
  cast_iron: 0.26,
  concrete: 0.6,
  pvc: 0.0015,
};

export type DarcyWeisbachValidationResult =
  | { ok: true; inputs: DarcyWeisbachInputs; errors: []; warnings: string[] }
  | { ok: false; inputs: null; errors: string[]; warnings: string[] };

export function validateDarcyWeisbachInputs(raw: Record<string, unknown>): DarcyWeisbachValidationResult {
  const { values, errors } = collectRequiredNumeric(raw, ["flowRate","pipeLength","pipeDiameter","fluidDensity","fluidViscosity"], DW_LABELS);
  if (errors.length > 0) return { ok: false, inputs: null, errors, warnings: [] };
  const warnings: string[] = [];

  if (values.flowRate <= 0) errors.push("Flow rate must be > 0 m³/h.");
  if (values.pipeDiameter <= 0) errors.push("Pipe diameter must be > 0 mm.");
  if (values.fluidDensity <= 0) errors.push("Fluid density must be > 0 kg/m³.");
  if (values.fluidViscosity <= 0) errors.push("Dynamic viscosity must be > 0 Pa·s.");

  const material = String(raw.pipeMaterial ?? "steel");
  const roughness = PIPE_ROUGHNESS[material] ?? 0.046;

  return {
    ok: true,
    inputs: {
      flowRate: values.flowRate,
      pipeLength: values.pipeLength,
      pipeDiameter: values.pipeDiameter,
      fluidDensity: values.fluidDensity,
      fluidViscosity: values.fluidViscosity,
      pipeRoughness: roughness,
      elbow90Count: typeof raw.elbow90Count === "number" ? raw.elbow90Count : 0,
      gateValveCount: typeof raw.gateValveCount === "number" ? raw.gateValveCount : 0,
      teeCount: typeof raw.teeCount === "number" ? raw.teeCount : 0,
    },
    errors: [],
    warnings,
  };
}

/* ────────────────────────────────────────────────────────────────────────────
 * 6. LMTD Heat Exchanger
 * ──────────────────────────────────────────────────────────────────────────── */

export type LmtdInputs = {
  heatDuty: number;             // kW
  hotInletTemp: number;         // °C
  hotOutletTemp: number;        // °C
  coldInletTemp: number;        // °C
  coldOutletTemp: number;       // °C
  hConvInside: number;          // W/m²K
  hConvOutside: number;         // W/m²K
  wallConductivity: number;     // W/mK
  tubeInnerRadius: number;      // mm
  tubeOuterRadius: number;      // mm
  foulingInside: number;        // m²K/W
  foulingOutside: number;       // m²K/W
  flowArrangement: "counter" | "parallel";
};

export const LMTD_INPUT_KEYS = [
  "heatDuty", "hotInletTemp", "hotOutletTemp", "coldInletTemp", "coldOutletTemp",
  "hConvInside", "hConvOutside",
] as const;

const LMTD_LABELS: Record<string, string> = {
  heatDuty: "Required heat duty",
  hotInletTemp: "Hot fluid inlet T_h,in",
  hotOutletTemp: "Hot fluid outlet T_h,out",
  coldInletTemp: "Cold fluid inlet T_c,in",
  coldOutletTemp: "Cold fluid outlet T_c,out",
  hConvInside: "Inside convection h_i",
  hConvOutside: "Outside convection h_o",
};

export type LmtdValidationResult =
  | { ok: true; inputs: LmtdInputs; errors: []; warnings: string[] }
  | { ok: false; inputs: null; errors: string[]; warnings: string[] };

export function validateLmtdInputs(raw: Record<string, unknown>): LmtdValidationResult {
  const { values, errors } = collectRequiredNumeric(raw, LMTD_INPUT_KEYS, LMTD_LABELS);
  if (errors.length > 0) return { ok: false, inputs: null, errors, warnings: [] };
  const warnings: string[] = [];

  if (values.heatDuty <= 0) errors.push("Heat duty must be > 0 kW.");
  if (values.hotInletTemp <= values.hotOutletTemp) warnings.push("Hot inlet should be > hot outlet for valid heat exchange.");
  if (values.coldOutletTemp <= values.coldInletTemp) warnings.push("Cold outlet should be > cold inlet for valid heat exchange.");

  const arrangement = raw.flowArrangement === "parallel" ? "parallel" : "counter";

  return {
    ok: true,
    inputs: {
      heatDuty: values.heatDuty,
      hotInletTemp: values.hotInletTemp,
      hotOutletTemp: values.hotOutletTemp,
      coldInletTemp: values.coldInletTemp,
      coldOutletTemp: values.coldOutletTemp,
      hConvInside: values.hConvInside,
      hConvOutside: values.hConvOutside,
      wallConductivity: typeof raw.wallThermalConductivity === "number" ? raw.wallThermalConductivity : 50,
      tubeInnerRadius: typeof raw.tubeInnerRadius === "number" ? raw.tubeInnerRadius : 8,
      tubeOuterRadius: typeof raw.tubeOuterRadius === "number" ? raw.tubeOuterRadius : 10,
      foulingInside: typeof raw.foulingFactorInside === "number" ? raw.foulingFactorInside : 0.0001,
      foulingOutside: typeof raw.foulingFactorOutside === "number" ? raw.foulingFactorOutside : 0.0002,
      flowArrangement: arrangement,
    },
    errors: [],
    warnings,
  };
}

/* ────────────────────────────────────────────────────────────────────────────
 * 7. OEE — Overall Equipment Effectiveness
 * ──────────────────────────────────────────────────────────────────────────── */

export type OeeInputs = {
  plannedProductionTime: number; // hr/month
  downtimeHours: number;        // hr/month
  idealCycleTime: number;       // min/unit
  totalUnitsProduced: number;
  goodUnitsProduced: number;
  smallStopsMinutes: number;    // min/month
  setupHours: number;           // hr/month
};

export const OEE_INPUT_KEYS = [
  "plannedProductionTime", "downtimeHours", "idealCycleTime",
  "totalUnitsProduced", "goodUnitsProduced",
] as const;

const OEE_LABELS: Record<string, string> = {
  plannedProductionTime: "Planned production time",
  downtimeHours: "Downtime",
  idealCycleTime: "Ideal cycle time",
  totalUnitsProduced: "Total units produced",
  goodUnitsProduced: "Good units produced",
};

export type OeeValidationResult =
  | { ok: true; inputs: OeeInputs; errors: []; warnings: string[] }
  | { ok: false; inputs: null; errors: string[]; warnings: string[] };

export function validateOeeInputs(raw: Record<string, unknown>): OeeValidationResult {
  const { values, errors } = collectRequiredNumeric(raw, OEE_INPUT_KEYS, OEE_LABELS);
  if (errors.length > 0) return { ok: false, inputs: null, errors, warnings: [] };
  const warnings: string[] = [];

  if (values.plannedProductionTime <= 0) errors.push("Planned production time must be > 0.");
  if (values.idealCycleTime <= 0) errors.push("Ideal cycle time must be > 0 min.");
  if (values.totalUnitsProduced <= 0) errors.push("Total units produced must be > 0.");
  if (values.goodUnitsProduced > values.totalUnitsProduced) {
    return { ok: false, inputs: null, errors: ["Good units cannot exceed total units produced."], warnings: [] };
  }

  return {
    ok: true,
    inputs: {
      plannedProductionTime: values.plannedProductionTime,
      downtimeHours: values.downtimeHours,
      idealCycleTime: values.idealCycleTime,
      totalUnitsProduced: values.totalUnitsProduced,
      goodUnitsProduced: values.goodUnitsProduced,
      smallStopsMinutes: typeof raw.smallStopsMinutes === "number" ? raw.smallStopsMinutes : 0,
      setupHours: typeof raw.setupHours === "number" ? raw.setupHours : 0,
    },
    errors: [],
    warnings,
  };
}

/* ────────────────────────────────────────────────────────────────────────────
 * 8. Line Balancing
 * ──────────────────────────────────────────────────────────────────────────── */

export type LineBalancingInputs = {
  totalWorkContent: number;  // min
  taktTime: number;          // min/unit
  actualStations: number;
  availableTimePerShift?: number; // min
  customerDemandPerShift?: number;
};

export const LB_INPUT_KEYS = [
  "totalWorkContent", "taktTime", "actualStations",
] as const;

const LB_LABELS: Record<string, string> = {
  totalWorkContent: "Total work content Σ(t_i)",
  taktTime: "Takt time",
  actualStations: "Actual stations (N_real)",
};

export type LineBalancingValidationResult =
  | { ok: true; inputs: LineBalancingInputs; errors: []; warnings: string[] }
  | { ok: false; inputs: null; errors: string[]; warnings: string[] };

export function validateLineBalancingInputs(raw: Record<string, unknown>): LineBalancingValidationResult {
  const { values, errors } = collectRequiredNumeric(raw, LB_INPUT_KEYS, LB_LABELS);
  if (errors.length > 0) return { ok: false, inputs: null, errors, warnings: [] };
  const warnings: string[] = [];

  if (values.totalWorkContent <= 0) errors.push("Total work content must be > 0 min.");
  if (values.taktTime <= 0) errors.push("Takt time must be > 0 min/unit.");
  if (values.actualStations < 1) errors.push("Actual stations must be >= 1.");

  return {
    ok: true,
    inputs: {
      totalWorkContent: values.totalWorkContent,
      taktTime: values.taktTime,
      actualStations: Math.round(values.actualStations),
    },
    errors: [],
    warnings,
  };
}

/* ────────────────────────────────────────────────────────────────────────────
 * 9. Standard Time / Work Study
 * ──────────────────────────────────────────────────────────────────────────── */

export type StandardTimeInputs = {
  observedTime: number;        // min
  sampleStdDev: number;        // min
  sampleSize: number;
  ratingFactor: number;        // decimal (1.00 = normal)
  personalAllowance: number;   // decimal
  fatigueAllowance: number;    // decimal
  delayAllowance: number;      // decimal
  confidenceLevel: number;     // decimal (0.95)
  errorMargin: number;         // decimal (0.05)
};

export const ST_INPUT_KEYS = [
  "observedTime", "sampleStdDev", "sampleSize", "ratingFactor",
  "personalAllowance", "fatigueAllowance", "delayAllowance",
] as const;

const ST_LABELS: Record<string, string> = {
  observedTime: "Observed mean time OT",
  sampleStdDev: "Sample std dev s",
  sampleSize: "Sample size n",
  ratingFactor: "Rating factor RF",
  personalAllowance: "Personal allowance",
  fatigueAllowance: "Fatigue allowance",
  delayAllowance: "Delay allowance",
};

export type StandardTimeValidationResult =
  | { ok: true; inputs: StandardTimeInputs; errors: []; warnings: string[] }
  | { ok: false; inputs: null; errors: string[]; warnings: string[] };

export function validateStandardTimeInputs(raw: Record<string, unknown>): StandardTimeValidationResult {
  const { values, errors } = collectRequiredNumeric(raw, ST_INPUT_KEYS, ST_LABELS);
  if (errors.length > 0) return { ok: false, inputs: null, errors, warnings: [] };
  const warnings: string[] = [];

  if (values.observedTime <= 0) errors.push("Observed time must be > 0 min.");
  if (values.ratingFactor < 50 || values.ratingFactor > 150) warnings.push("Rating factor outside 50-150% range.");
  if (values.sampleSize < 1) errors.push("Sample size must be >= 1.");

  return {
    ok: true,
    inputs: {
      observedTime: values.observedTime,
      sampleStdDev: values.sampleStdDev,
      sampleSize: Math.round(values.sampleSize),
      ratingFactor: values.ratingFactor / 100,
      personalAllowance: values.personalAllowance / 100,
      fatigueAllowance: values.fatigueAllowance / 100,
      delayAllowance: values.delayAllowance / 100,
      confidenceLevel: 0.95,
      errorMargin: 0.05,
    },
    errors: [],
    warnings,
  };
}

/* ────────────────────────────────────────────────────────────────────────────
 * 10. Learning Curve
 * ──────────────────────────────────────────────────────────────────────────── */

export type LearningCurveInputs = {
  firstUnitTime: number;         // hr
  learningRate: number;          // decimal (0.80 = 80%)
  cumulativeQuantity: number;
  hourlyCost: number;            // USD/hr
  unitMaterialCost: number;      // USD
  targetUnitCost?: number;       // USD
  learningModel: "wright" | "crawford";
};

export const LC_INPUT_KEYS = [
  "firstUnitTime", "learningRate", "cumulativeQuantity",
  "hourlyCost", "unitMaterialCost",
] as const;

const LC_LABELS: Record<string, string> = {
  firstUnitTime: "First unit time a",
  learningRate: "Learning rate p",
  cumulativeQuantity: "Cumulative quantity N",
  hourlyCost: "Hourly cost",
  unitMaterialCost: "Unit material cost",
};

export type LearningCurveValidationResult =
  | { ok: true; inputs: LearningCurveInputs; errors: []; warnings: string[] }
  | { ok: false; inputs: null; errors: string[]; warnings: string[] };

export function validateLearningCurveInputs(raw: Record<string, unknown>): LearningCurveValidationResult {
  const { values, errors } = collectRequiredNumeric(raw, LC_INPUT_KEYS, LC_LABELS);
  if (errors.length > 0) return { ok: false, inputs: null, errors, warnings: [] };
  const warnings: string[] = [];

  if (values.firstUnitTime <= 0) errors.push("First unit time must be > 0 hr.");
  if (values.learningRate < 50 || values.learningRate > 100) warnings.push("Learning rate outside 50-100% range.");
  if (values.cumulativeQuantity < 1) errors.push("Cumulative quantity must be >= 1.");

  const model = raw.learningModel === "crawford" ? "crawford" : "wright";

  return {
    ok: true,
    inputs: {
      firstUnitTime: values.firstUnitTime,
      learningRate: values.learningRate / 100,
      cumulativeQuantity: Math.round(values.cumulativeQuantity),
      hourlyCost: values.hourlyCost,
      unitMaterialCost: values.unitMaterialCost,
      targetUnitCost: typeof raw.targetUnitCost === "number" ? raw.targetUnitCost : undefined,
      learningModel: model,
    },
    errors: [],
    warnings,
  };
}

/* ────────────────────────────────────────────────────────────────────────────
 * 11. Spring Design
 * ──────────────────────────────────────────────────────────────────────────── */

export type SpringDesignInputs = {
  wireDiameter: number;        // mm
  meanCoilDiameter: number;    // mm
  activeCoils: number;
  totalCoils: number;
  springFreeLength: number;    // mm
  springLoad: number;          // N
  minLoad: number;             // N
  endCondition: "both_free" | "one_fixed_one_free";
  material: "steel" | "stainless";
  loadType: "static" | "fatigue";
};

export const SPRING_INPUT_KEYS = [
  "wireDiameter", "meanCoilDiameter", "activeCoils",
  "totalCoils", "springFreeLength", "springLoad",
] as const;

const SPRING_LABELS: Record<string, string> = {
  wireDiameter: "Wire diameter d",
  meanCoilDiameter: "Mean coil diameter D",
  activeCoils: "Active coils N_a",
  totalCoils: "Total coils N_t",
  springFreeLength: "Free length L₀",
  springLoad: "Applied load F",
};

export type SpringDesignValidationResult =
  | { ok: true; inputs: SpringDesignInputs; errors: []; warnings: string[] }
  | { ok: false; inputs: null; errors: string[]; warnings: string[] };

export function validateSpringDesignInputs(raw: Record<string, unknown>): SpringDesignValidationResult {
  const { values, errors } = collectRequiredNumeric(raw, SPRING_INPUT_KEYS, SPRING_LABELS);
  if (errors.length > 0) return { ok: false, inputs: null, errors, warnings: [] };
  const warnings: string[] = [];

  if (values.wireDiameter <= 0) errors.push("Wire diameter must be > 0 mm.");
  if (values.meanCoilDiameter <= 0) errors.push("Mean coil diameter must be > 0 mm.");
  if (values.activeCoils < 1) errors.push("Active coils must be >= 1.");
  if (values.springLoad <= 0) errors.push("Applied load must be > 0 N.");

  const C = values.meanCoilDiameter / values.wireDiameter;
  if (C < 4) warnings.push(`Spring index C=${C.toFixed(1)} < 4: manufacturing difficulty.`);
  if (C > 12) warnings.push(`Spring index C=${C.toFixed(1)} > 12: buckling risk.`);

  return {
    ok: true,
    inputs: {
      wireDiameter: values.wireDiameter,
      meanCoilDiameter: values.meanCoilDiameter,
      activeCoils: Math.round(values.activeCoils),
      totalCoils: Math.round(typeof raw.totalCoils === "number" ? raw.totalCoils : values.activeCoils + 2),
      springFreeLength: values.springFreeLength,
      springLoad: values.springLoad,
      minLoad: typeof raw.minLoadFmin === "number" ? raw.minLoadFmin : 0,
      endCondition: raw.endCondition === "one_fixed_one_free" ? "one_fixed_one_free" : "both_free",
      material: raw.material === "stainless" ? "stainless" : "steel",
      loadType: raw.loadType === "fatigue" ? "fatigue" : "static",
    },
    errors: [],
    warnings,
  };
}

/* ────────────────────────────────────────────────────────────────────────────
 * 12. Carbon Footprint
 * ──────────────────────────────────────────────────────────────────────────── */

export type CarbonFootprintInputs = {
  naturalGasUsage: number;        // m³/month
  dieselUsage: number;            // L/month
  gasolineUsage: number;          // L/month
  electricityUsage: number;       // kWh/month
  gridEf: number;                 // kgCO₂e/kWh
  businessTravelKm: number;       // km/month
  freightTonKm: number;           // ton-km/month
  wasteTons: number;              // tons/month
  importValueEUR: number;         // EUR
};

export const CF_INPUT_KEYS = [
  "naturalGasUsage", "dieselUsage", "gasolineUsage",
  "electricityUsage", "gridRegion",
] as const;

const CF_LABELS: Record<string, string> = {
  naturalGasUsage: "Natural gas usage",
  dieselUsage: "Diesel usage",
  gasolineUsage: "Gasoline usage",
  electricityUsage: "Electricity usage",
  gridRegion: "Grid region",
};

const GRID_EF: Record<string, number> = {
  turkey: 0.447,
  eu_avg: 0.233,
  renewable: 0.000,
  global_avg: 0.475,
};

export type CarbonFootprintValidationResult =
  | { ok: true; inputs: CarbonFootprintInputs; errors: []; warnings: string[] }
  | { ok: false; inputs: null; errors: string[]; warnings: string[] };

export function validateCarbonFootprintInputs(raw: Record<string, unknown>): CarbonFootprintValidationResult {
  const { values, errors } = collectRequiredNumeric(raw, ["naturalGasUsage","dieselUsage","gasolineUsage","electricityUsage"], CF_LABELS);
  if (errors.length > 0) return { ok: false, inputs: null, errors, warnings: [] };
  const warnings: string[] = [];

  const region = String(raw.gridRegion ?? "turkey");
  const ef = GRID_EF[region] ?? 0.447;
  if (!GRID_EF[region]) warnings.push(`Unknown grid region "${region}", defaulting to Turkey EF (0.447).`);

  return {
    ok: true,
    inputs: {
      naturalGasUsage: values.naturalGasUsage,
      dieselUsage: values.dieselUsage,
      gasolineUsage: values.gasolineUsage,
      electricityUsage: values.electricityUsage,
      gridEf: ef,
      businessTravelKm: typeof raw.businessTravelKm === "number" ? raw.businessTravelKm : 0,
      freightTonKm: typeof raw.freightTonKm === "number" ? raw.freightTonKm : 0,
      wasteTons: typeof raw.wasteTons === "number" ? raw.wasteTons : 0,
      importValueEUR: typeof raw.importValueEUR === "number" ? raw.importValueEUR : 0,
    },
    errors: [],
    warnings,
  };
}

/* ────────────────────────────────────────────────────────────────────────────
 * 13. Regression
 * ──────────────────────────────────────────────────────────────────────────── */

export type RegressionInputs = {
  n: number;
  sumX: number;
  sumY: number;
  sumXY: number;
  sumX2: number;
  sumY2: number;
};

export const REG_INPUT_KEYS = [
  "regressionN", "regressionSumX", "regressionSumY",
  "regressionSumXY", "regressionSumX2", "regressionSumY2",
] as const;

const REG_LABELS: Record<string, string> = {
  regressionN: "Number of data pairs n",
  regressionSumX: "Σx",
  regressionSumY: "Σy",
  regressionSumXY: "Σxy",
  regressionSumX2: "Σx²",
  regressionSumY2: "Σy²",
};

export type RegressionValidationResult =
  | { ok: true; inputs: RegressionInputs; errors: []; warnings: string[] }
  | { ok: false; inputs: null; errors: string[]; warnings: string[] };

export function validateRegressionInputs(raw: Record<string, unknown>): RegressionValidationResult {
  const { values, errors } = collectRequiredNumeric(raw, REG_INPUT_KEYS, REG_LABELS);
  if (errors.length > 0) return { ok: false, inputs: null, errors, warnings: [] };
  const warnings: string[] = [];

  if (values.regressionN < 3) return { ok: false, inputs: null, errors: ["Sample size n must be >= 3 for meaningful regression."], warnings: [] };

  const denom = values.regressionN * values.regressionSumX2 - values.regressionSumX * values.regressionSumX;
  if (Math.abs(denom) < 1e-15) {
    return { ok: false, inputs: null, errors: ["No variance in x (denominator zero). Regression undefined."], warnings: [] };
  }

  return {
    ok: true,
    inputs: {
      n: values.regressionN,
      sumX: values.regressionSumX,
      sumY: values.regressionSumY,
      sumXY: values.regressionSumXY,
      sumX2: values.regressionSumX2,
      sumY2: values.regressionSumY2,
    },
    errors: [],
    warnings,
  };
}

/* ────────────────────────────────────────────────────────────────────────────
 * 14. Sample Size (Power Analysis)
 * ──────────────────────────────────────────────────────────────────────────── */

export type SampleSizeInputs = {
  testType: "proportion" | "mean";
  confidenceLevel: number;       // decimal (0.95)
  errorMargin: number;           // decimal (0.05)
  estimatedProportion: number;   // decimal (0.5)
  estimatedStdDev: number;       // σ
  detectableEffect: number;      // Δ
  powerLevel: number;            // decimal (0.80)
};

export const SS_INPUT_KEYS = [
  "testType", "confidenceLevel", "errorMargin",
  "estimatedProportion", "estimatedStdDev", "detectableEffect", "powerLevel",
] as const;

const SS_LABELS: Record<string, string> = {
  testType: "Test type",
  confidenceLevel: "Confidence level",
  errorMargin: "Error margin",
  estimatedProportion: "Estimated proportion p̂",
  estimatedStdDev: "Estimated std dev σ",
  detectableEffect: "Detectable effect Δ",
  powerLevel: "Power level",
};

export type SampleSizeValidationResult =
  | { ok: true; inputs: SampleSizeInputs; errors: []; warnings: string[] }
  | { ok: false; inputs: null; errors: string[]; warnings: string[] };

export function validateSampleSizeInputs(raw: Record<string, unknown>): SampleSizeValidationResult {
  const { values, errors } = collectRequiredNumeric(raw, ["confidenceLevel","errorMargin","estimatedProportion","estimatedStdDev","detectableEffect"], SS_LABELS);
  if (errors.length > 0) return { ok: false, inputs: null, errors, warnings: [] };
  const warnings: string[] = [];

  const testType = raw.testType === "mean" ? "mean" : "proportion";
  const powerMap: Record<string, number> = { "80": 0.80, "90": 0.90, "95": 0.95 };
  const power = powerMap[String(raw.powerLevel)] ?? 0.80;

  if (values.confidenceLevel < 80 || values.confidenceLevel > 99.9) warnings.push("Confidence level outside 80-99.9% range.");
  if (values.errorMargin <= 0 || values.errorMargin >= 100) errors.push("Error margin must be > 0% and < 100%.");
  if (values.estimatedProportion < 0 || values.estimatedProportion > 100) errors.push("Proportion must be 0-100%.");

  return {
    ok: true,
    inputs: {
      testType,
      confidenceLevel: values.confidenceLevel / 100,
      errorMargin: values.errorMargin / 100,
      estimatedProportion: values.estimatedProportion / 100,
      estimatedStdDev: values.estimatedStdDev,
      detectableEffect: values.detectableEffect,
      powerLevel: power,
    },
    errors: [],
    warnings,
  };
}

/* ────────────────────────────────────────────────────────────────────────────
 * 15. ANOVA
 * ──────────────────────────────────────────────────────────────────────────── */

export type AnovaInputs = {
  k: number;         // number of groups
  N: number;         // total sample
  grandMean: number;
  groupMeans: readonly number[];
  groupSizes: readonly number[];
};

export const ANOVA_INPUT_KEYS = [
  "groupCount", "totalSampleSize", "anovaGrandMean",
] as const;

const ANOVA_LABELS: Record<string, string> = {
  groupCount: "Number of groups k",
  totalSampleSize: "Total sample size N",
  anovaGrandMean: "Grand mean ȳ_grand",
};

export type AnovaValidationResult =
  | { ok: true; inputs: AnovaInputs; errors: []; warnings: string[] }
  | { ok: false; inputs: null; errors: string[]; warnings: string[] };

export function validateAnovaInputs(raw: Record<string, unknown>): AnovaValidationResult {
  const { values, errors } = collectRequiredNumeric(raw, ANOVA_INPUT_KEYS, ANOVA_LABELS);
  if (errors.length > 0) return { ok: false, inputs: null, errors, warnings: [] };
  const warnings: string[] = [];

  const k = Math.round(values.groupCount);
  const N = Math.round(values.totalSampleSize);

  if (k < 2) return { ok: false, inputs: null, errors: ["At least 2 groups required."], warnings: [] };
  if (N <= k) return { ok: false, inputs: null, errors: ["Total sample size N must be > number of groups k."], warnings: [] };

  const groupMeans: number[] = [];
  const groupSizes: number[] = [];
  for (let i = 1; i <= Math.min(k, 5); i++) {
    const mKey = `group${i}Mean`;
    const sKey = `group${i}Size`;
    const m = raw[mKey];
    const s = raw[sKey];
    if (typeof m === "number" && Number.isFinite(m)) groupMeans.push(m);
    if (typeof s === "number" && Number.isFinite(s) && s >= 2) groupSizes.push(Math.round(s));
  }

  if (groupMeans.length < 2) {
    return { ok: false, inputs: null, errors: ["At least 2 valid group means required."], warnings: [] };
  }

  return {
    ok: true,
    inputs: { k, N, grandMean: values.anovaGrandMean, groupMeans, groupSizes },
    errors: [],
    warnings,
  };
}

/* ────────────────────────────────────────────────────────────────────────────
 * 16. ROI
 * ──────────────────────────────────────────────────────────────────────────── */

export type RoiInputs = {
  totalInvestment: number;
  annualReturns: readonly number[]; // years 1-5
  targetDiscountRate: number; // decimal
};

export const ROI_INPUT_KEYS = [
  "totalInvestment", "annualNetReturnYear1", "annualNetReturnYear2",
  "annualNetReturnYear3", "annualNetReturnYear4", "annualNetReturnYear5",
  "targetDiscountRate",
] as const;

const ROI_LABELS: Record<string, string> = {
  totalInvestment: "Total investment",
  annualNetReturnYear1: "Net return year 1",
  annualNetReturnYear2: "Net return year 2",
  annualNetReturnYear3: "Net return year 3",
  annualNetReturnYear4: "Net return year 4",
  annualNetReturnYear5: "Net return year 5",
  targetDiscountRate: "Target discount rate",
};

export type RoiValidationResult =
  | { ok: true; inputs: RoiInputs; errors: []; warnings: string[] }
  | { ok: false; inputs: null; errors: string[]; warnings: string[] };

export function validateRoiInputs(raw: Record<string, unknown>): RoiValidationResult {
  const { values, errors } = collectRequiredNumeric(raw, ROI_INPUT_KEYS, ROI_LABELS);
  if (errors.length > 0) return { ok: false, inputs: null, errors, warnings: [] };
  const warnings: string[] = [];

  if (values.totalInvestment <= 0) errors.push("Total investment must be > 0.");
  if (values.targetDiscountRate <= 0 || values.targetDiscountRate >= 100) {
    warnings.push("Discount rate outside 0-100% range.");
  }

  return {
    ok: true,
    inputs: {
      totalInvestment: values.totalInvestment,
      annualReturns: [values.annualNetReturnYear1, values.annualNetReturnYear2, values.annualNetReturnYear3,
        values.annualNetReturnYear4, values.annualNetReturnYear5],
      targetDiscountRate: values.targetDiscountRate / 100,
    },
    errors: [],
    warnings,
  };
}

/* ────────────────────────────────────────────────────────────────────────────
 * 17. Belt-Pulley & Gear Ratio
 * ──────────────────────────────────────────────────────────────────────────── */

export type BeltPulleyInputs = {
  driverDiameterMm: number;
  drivenDiameterMm: number;
  driverRpm: number;
  tensionF1: number;      // N
  tensionF2: number;      // N
  frictionMu: number;
  wrapAngleDeg: number;   // degrees
  slipPercent: number;    // decimal
  beltType: "v_belt" | "flat" | "timing";
  gearStageCount: number;
};

export const BP_INPUT_KEYS = [
  "driverPulleyDiameter", "drivenPulleyDiameter", "driverRPM",
] as const;

const BP_LABELS: Record<string, string> = {
  driverPulleyDiameter: "Driver pulley diameter d₁",
  drivenPulleyDiameter: "Driven pulley diameter d₂",
  driverRPM: "Driver speed N₁",
};

export type BeltPulleyValidationResult =
  | { ok: true; inputs: BeltPulleyInputs; errors: []; warnings: string[] }
  | { ok: false; inputs: null; errors: string[]; warnings: string[] };

export function validateBeltPulleyInputs(raw: Record<string, unknown>): BeltPulleyValidationResult {
  const { values, errors } = collectRequiredNumeric(raw, BP_INPUT_KEYS, BP_LABELS);
  if (errors.length > 0) return { ok: false, inputs: null, errors, warnings: [] };
  const warnings: string[] = [];

  if (values.driverPulleyDiameter <= 0) errors.push("Driver pulley diameter must be > 0 mm.");
  if (values.drivenPulleyDiameter <= 0) errors.push("Driven pulley diameter must be > 0 mm.");
  if (values.driverRPM <= 0) errors.push("Driver RPM must be > 0.");

  const slipDefault: Record<string, number> = { v_belt: 2, flat: 3, timing: 0 };
  const beltType = (Object.keys(slipDefault).includes(String(raw.beltType))) ? String(raw.beltType) as BeltPulleyInputs["beltType"] : "v_belt";
  const slip = typeof raw.slipPercent === "number" ? raw.slipPercent : slipDefault[beltType];

  return {
    ok: true,
    inputs: {
      driverDiameterMm: values.driverPulleyDiameter,
      drivenDiameterMm: values.drivenPulleyDiameter,
      driverRpm: values.driverRPM,
      tensionF1: typeof raw.beltTensionF1 === "number" ? raw.beltTensionF1 : 500,
      tensionF2: typeof raw.beltTensionF2 === "number" ? raw.beltTensionF2 : 100,
      frictionMu: typeof raw.coefficientFriction === "number" ? raw.coefficientFriction : 0.35,
      wrapAngleDeg: typeof raw.wrapAngle === "number" ? raw.wrapAngle : 180,
      slipPercent: slip / 100,
      beltType,
      gearStageCount: Math.round(typeof raw.gearStageCount === "number" ? raw.gearStageCount : 1),
    },
    errors: [],
    warnings: warnings.concat(slip > 5 ? [`Belt slip ${slip}% exceeds 5% threshold.`] : []),
  };
}

/* ────────────────────────────────────────────────────────────────────────────
 * 18. Hydraulic Cylinder
 * ──────────────────────────────────────────────────────────────────────────── */

export type HydraulicCylinderInputs = {
  pressureBar: number;
  pistonDiameterMm: number;
  rodDiameterMm: number;
  pumpFlowLmin: number;       // L/min
  strokeLengthMm: number;
  endCondition: "fixed_fixed" | "hinged" | "fixed_free";
  youngModulusGPa: number;    // GPa
};

export const HC_INPUT_KEYS = [
  "systemPressure", "pistonDiameter", "rodDiameter",
  "pumpFlowRate", "cylinderStroke",
] as const;

const HC_LABELS: Record<string, string> = {
  systemPressure: "System pressure P",
  pistonDiameter: "Piston diameter D",
  rodDiameter: "Rod diameter d",
  pumpFlowRate: "Pump flow rate Q",
  cylinderStroke: "Cylinder stroke L",
};

export type HydraulicCylinderValidationResult =
  | { ok: true; inputs: HydraulicCylinderInputs; errors: []; warnings: string[] }
  | { ok: false; inputs: null; errors: string[]; warnings: string[] };

const YOUNG_MODULUS: Record<string, number> = {
  steel: 210,
  stainless: 193,
  aluminum: 69,
};

export function validateHydraulicCylinderInputs(raw: Record<string, unknown>): HydraulicCylinderValidationResult {
  const { values, errors } = collectRequiredNumeric(raw, HC_INPUT_KEYS, HC_LABELS);
  if (errors.length > 0) return { ok: false, inputs: null, errors, warnings: [] };
  const warnings: string[] = [];

  if (values.systemPressure <= 0) errors.push("System pressure must be > 0 bar.");
  if (values.pistonDiameter <= values.rodDiameter) errors.push("Piston diameter must be > rod diameter.");
  if (values.rodDiameter <= 0) errors.push("Rod diameter must be > 0 mm.");
  if (values.pistonDiameter <= 0) errors.push("Piston diameter must be > 0 mm.");

  const ec = raw.endCondition === "fixed_fixed" ? "fixed_fixed" as const :
    raw.endCondition === "fixed_free" ? "fixed_free" as const : "hinged" as const;
  const ymKey = String(raw.youngModulus ?? "steel");
  const ym = YOUNG_MODULUS[ymKey] ?? 210;

  return {
    ok: true,
    inputs: {
      pressureBar: values.systemPressure,
      pistonDiameterMm: values.pistonDiameter,
      rodDiameterMm: values.rodDiameter,
      pumpFlowLmin: values.pumpFlowRate,
      strokeLengthMm: values.cylinderStroke,
      endCondition: ec,
      youngModulusGPa: ym,
    },
    errors: [],
    warnings,
  };
}
