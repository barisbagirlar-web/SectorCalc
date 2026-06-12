export type WaitingOpportunityMode = "none" | "manualHourly" | "derivedThroughput";

export type SevenMudaEngineeringInputs = {
  analysisPeriodDays: number;
  workingDaysPerYear: number;
  productionUnitsInPeriod: number;

  currencyCode: string;
  unitVariableCost: number;
  unitSellingPrice: number;
  grossMarginPct: number;

  excessUnits: number;
  excessInventoryHoldingDays: number;
  excessWriteDownCostPerUnit: number;

  waitingMinutes: number;
  affectedOperators: number;
  hourlyLaborCost: number;
  affectedMachines: number;
  hourlyMachineCost: number;
  waitingOpportunityMode: WaitingOpportunityMode;
  hourlyOpportunityCost: number;
  plannedUnitsPerHour: number;

  transportDistanceKm: number;
  transportTrips: number;
  transportCostPerKm: number;
  handlingMinutesPerTrip: number;
  handlingHourlyLaborCost: number;
  transportDamageRatePct: number;
  averageLoadValue: number;

  averageExcessInventoryValue: number;
  inventoryHoldingRatePct: number;
  inventoryObsolescenceValue: number;
  inventoryShrinkageRatePct: number;

  unnecessaryMotionMinutes: number;
  motionAffectedOperators: number;
  motionHourlyLaborCost: number;

  overprocessingMinutes: number;
  overprocessingHourlyResourceCost: number;
  extraMaterialCost: number;
  extraEnergyCost: number;
  extraInspectionCost: number;

  scrapUnits: number;
  scrapDisposalCostPerUnit: number;
  reworkMinutes: number;
  reworkHourlyLaborCost: number;
  reworkHourlyMachineCost: number;
  customerReturnCost: number;
  warrantyCost: number;
  expediteCost: number;

  dataConfidencePct: number;
  implementationDifficultyScore: number;
};

export type SevenMudaValidationResult = {
  readonly ok: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
};

export const SEVEN_MUDA_ENGINEERING_INPUT_KEYS: readonly (keyof SevenMudaEngineeringInputs)[] = [
  "analysisPeriodDays",
  "workingDaysPerYear",
  "productionUnitsInPeriod",
  "currencyCode",
  "unitVariableCost",
  "unitSellingPrice",
  "grossMarginPct",
  "excessUnits",
  "excessInventoryHoldingDays",
  "excessWriteDownCostPerUnit",
  "waitingMinutes",
  "affectedOperators",
  "hourlyLaborCost",
  "affectedMachines",
  "hourlyMachineCost",
  "waitingOpportunityMode",
  "hourlyOpportunityCost",
  "plannedUnitsPerHour",
  "transportDistanceKm",
  "transportTrips",
  "transportCostPerKm",
  "handlingMinutesPerTrip",
  "handlingHourlyLaborCost",
  "transportDamageRatePct",
  "averageLoadValue",
  "averageExcessInventoryValue",
  "inventoryHoldingRatePct",
  "inventoryObsolescenceValue",
  "inventoryShrinkageRatePct",
  "unnecessaryMotionMinutes",
  "motionAffectedOperators",
  "motionHourlyLaborCost",
  "overprocessingMinutes",
  "overprocessingHourlyResourceCost",
  "extraMaterialCost",
  "extraEnergyCost",
  "extraInspectionCost",
  "scrapUnits",
  "scrapDisposalCostPerUnit",
  "reworkMinutes",
  "reworkHourlyLaborCost",
  "reworkHourlyMachineCost",
  "customerReturnCost",
  "warrantyCost",
  "expediteCost",
  "dataConfidencePct",
  "implementationDifficultyScore",
];

export const WAITING_OPPORTUNITY_MODE_VALUES: readonly WaitingOpportunityMode[] = [
  "none",
  "manualHourly",
  "derivedThroughput",
];

const CURRENCY_CODE_PATTERN = /^[A-Z]{3}$/;

const REQUIRED_NUMBER_FIELDS: readonly (keyof SevenMudaEngineeringInputs)[] = [
  "analysisPeriodDays",
  "workingDaysPerYear",
  "productionUnitsInPeriod",
  "unitVariableCost",
  "unitSellingPrice",
  "grossMarginPct",
  "dataConfidencePct",
  "implementationDifficultyScore",
];

const PERCENTAGE_FIELDS: readonly (keyof SevenMudaEngineeringInputs)[] = [
  "grossMarginPct",
  "inventoryHoldingRatePct",
  "transportDamageRatePct",
  "inventoryShrinkageRatePct",
  "dataConfidencePct",
];

const OPTIONAL_NUMBER_FIELDS = SEVEN_MUDA_ENGINEERING_INPUT_KEYS.filter(
  (key): key is Exclude<
    keyof SevenMudaEngineeringInputs,
    | "currencyCode"
    | "waitingOpportunityMode"
    | "analysisPeriodDays"
    | "workingDaysPerYear"
    | "productionUnitsInPeriod"
    | "unitVariableCost"
    | "unitSellingPrice"
    | "grossMarginPct"
    | "dataConfidencePct"
    | "implementationDifficultyScore"
  > =>
    key !== "currencyCode" &&
    key !== "waitingOpportunityMode" &&
    !REQUIRED_NUMBER_FIELDS.includes(key),
);

type SevenMudaOptionalNumberField = (typeof OPTIONAL_NUMBER_FIELDS)[number];

function trimString(raw: unknown): string {
  return typeof raw === "string" ? raw.trim() : "";
}

function parseNumberField(
  field: keyof SevenMudaEngineeringInputs,
  raw: unknown,
  required: boolean,
  errors: string[],
): number | null {
  if (raw === undefined || raw === null || raw === "") {
    if (required) {
      errors.push(`${field} is required.`);
    }
    return null;
  }

  const numeric = typeof raw === "number" ? raw : Number(String(raw).trim());
  if (!Number.isFinite(numeric)) {
    errors.push(`${field} must be a valid number.`);
    return null;
  }

  return numeric;
}

function parseWaitingOpportunityMode(
  raw: unknown,
  errors: string[],
): WaitingOpportunityMode | null {
  if (raw === undefined || raw === null || raw === "") {
    errors.push("waitingOpportunityMode is required.");
    return null;
  }

  if (
    raw === "none" ||
    raw === "manualHourly" ||
    raw === "derivedThroughput"
  ) {
    return raw;
  }

  errors.push("waitingOpportunityMode must be none, manualHourly, or derivedThroughput.");
  return null;
}

function parseCurrencyCode(raw: unknown, errors: string[]): string | null {
  const trimmed = trimString(raw);
  if (!trimmed) {
    errors.push("currencyCode is required. Enter all monetary inputs in the same ISO 4217 currency.");
    return null;
  }

  if (!CURRENCY_CODE_PATTERN.test(trimmed)) {
    errors.push("currencyCode must match ISO 4217 format (three uppercase letters, e.g. USD, EUR, TRY).");
    return null;
  }

  return trimmed;
}

function validateProvidedNumber(
  field: keyof SevenMudaEngineeringInputs,
  raw: unknown,
  errors: string[],
): number | null {
  if (raw === undefined || raw === null || raw === "") {
    return null;
  }

  return parseNumberField(field, raw, false, errors);
}

function validatePositivePeriod(field: "analysisPeriodDays" | "workingDaysPerYear", value: number | null, errors: string[]) {
  if (value === null) {
    return;
  }
  if (value <= 0) {
    errors.push(`${field} must be greater than zero.`);
  }
}

function validateNonNegative(field: keyof SevenMudaEngineeringInputs, value: number | null, errors: string[]) {
  if (value === null) {
    return;
  }
  if (value < 0) {
    errors.push(`${field} must be zero or greater.`);
  }
}

function validatePercent(field: keyof SevenMudaEngineeringInputs, value: number | null, errors: string[]) {
  if (value === null) {
    return;
  }
  if (value < 0 || value > 100) {
    errors.push(`${field} must be between 0 and 100.`);
  }
}

function validateDifficultyScore(value: number | null, errors: string[]) {
  if (value === null) {
    return;
  }
  if (value < 1 || value > 5) {
    errors.push("implementationDifficultyScore must be between 1 and 5.");
  }
}

export function validateSevenMudaEngineeringInputs(
  raw: Partial<Record<keyof SevenMudaEngineeringInputs, unknown>>,
): SevenMudaValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const analysisPeriodDays = parseNumberField("analysisPeriodDays", raw.analysisPeriodDays, true, errors);
  const workingDaysPerYear = parseNumberField("workingDaysPerYear", raw.workingDaysPerYear, true, errors);
  parseNumberField("productionUnitsInPeriod", raw.productionUnitsInPeriod, true, errors);
  parseNumberField("unitVariableCost", raw.unitVariableCost, true, errors);
  parseNumberField("unitSellingPrice", raw.unitSellingPrice, true, errors);
  parseNumberField("dataConfidencePct", raw.dataConfidencePct, true, errors);
  const implementationDifficultyScore = parseNumberField(
    "implementationDifficultyScore",
    raw.implementationDifficultyScore,
    true,
    errors,
  );

  parseCurrencyCode(raw.currencyCode, errors);
  const waitingOpportunityMode = parseWaitingOpportunityMode(raw.waitingOpportunityMode, errors);

  validatePositivePeriod("analysisPeriodDays", analysisPeriodDays, errors);
  validatePositivePeriod("workingDaysPerYear", workingDaysPerYear, errors);

  for (const field of REQUIRED_NUMBER_FIELDS) {
    const value = validateProvidedNumber(field, raw[field], errors);
    if (field === "analysisPeriodDays" || field === "workingDaysPerYear") {
      continue;
    }
    if (field === "implementationDifficultyScore") {
      validateDifficultyScore(value, errors);
      continue;
    }
    if (PERCENTAGE_FIELDS.includes(field)) {
      validatePercent(field, value, errors);
      continue;
    }
    validateNonNegative(field, value, errors);
  }

  for (const field of OPTIONAL_NUMBER_FIELDS) {
    const value = validateProvidedNumber(field, raw[field], errors);
    if (PERCENTAGE_FIELDS.includes(field)) {
      validatePercent(field, value, errors);
      continue;
    }
    validateNonNegative(field, value, errors);
  }

  if (waitingOpportunityMode === "derivedThroughput") {
    const plannedUnitsPerHour = validateProvidedNumber("plannedUnitsPerHour", raw.plannedUnitsPerHour, errors);
    if (plannedUnitsPerHour === null || plannedUnitsPerHour <= 0) {
      warnings.push(
        "plannedUnitsPerHour must be greater than zero when waitingOpportunityMode is derivedThroughput; waiting opportunity cost will be treated as zero.",
      );
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
  };
}

export function resolveSevenMudaEngineeringInputs(
  raw: Partial<Record<keyof SevenMudaEngineeringInputs, unknown>>,
): SevenMudaEngineeringInputs {
  const validation = validateSevenMudaEngineeringInputs(raw);
  if (!validation.ok) {
    throw new Error(validation.errors.join(" "));
  }

  const errors: string[] = [];
  const analysisPeriodDays = parseNumberField("analysisPeriodDays", raw.analysisPeriodDays, true, errors);
  const workingDaysPerYear = parseNumberField("workingDaysPerYear", raw.workingDaysPerYear, true, errors);
  const productionUnitsInPeriod = parseNumberField(
    "productionUnitsInPeriod",
    raw.productionUnitsInPeriod,
    true,
    errors,
  );
  const currencyCode = parseCurrencyCode(raw.currencyCode, errors);
  const unitVariableCost = parseNumberField("unitVariableCost", raw.unitVariableCost, true, errors);
  const unitSellingPrice = parseNumberField("unitSellingPrice", raw.unitSellingPrice, true, errors);
  const grossMarginPct = parseNumberField("grossMarginPct", raw.grossMarginPct, true, errors);
  const waitingOpportunityMode = parseWaitingOpportunityMode(raw.waitingOpportunityMode, errors);
  const dataConfidencePct = parseNumberField("dataConfidencePct", raw.dataConfidencePct, true, errors);
  const implementationDifficultyScore = parseNumberField(
    "implementationDifficultyScore",
    raw.implementationDifficultyScore,
    true,
    errors,
  );

  const optionalValues = {} as Record<SevenMudaOptionalNumberField, number>;

  for (const field of OPTIONAL_NUMBER_FIELDS) {
    const parsed = parseNumberField(field, raw[field], true, errors);
    if (parsed === null) {
      continue;
    }
    optionalValues[field] = parsed;
  }

  if (
    analysisPeriodDays === null ||
    workingDaysPerYear === null ||
    productionUnitsInPeriod === null ||
    currencyCode === null ||
    unitVariableCost === null ||
    unitSellingPrice === null ||
    grossMarginPct === null ||
    waitingOpportunityMode === null ||
    dataConfidencePct === null ||
    implementationDifficultyScore === null
  ) {
    throw new Error(errors.join(" ") || "Seven muda engineering inputs could not be resolved.");
  }

  return {
    analysisPeriodDays,
    workingDaysPerYear,
    productionUnitsInPeriod,
    currencyCode,
    unitVariableCost,
    unitSellingPrice,
    grossMarginPct,
    waitingOpportunityMode,
    dataConfidencePct,
    implementationDifficultyScore,
    ...optionalValues,
  };
}
