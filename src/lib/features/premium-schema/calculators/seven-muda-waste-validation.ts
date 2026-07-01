export type WaitingOpportunityCostMode = "margin" | "manual";

export type SevenMudaEngineeringInputs = {
  analysisPeriodDays: number;
  annualWorkingDays: number;
  productionUnits: number;

  currency: string;
  unitVariableCost: number;
  unitSellingPrice: number;
  grossMarginPercent: number;

  overproductionUnits: number;
  waitingHours: number;
  waitingOpportunityCostMode: WaitingOpportunityCostMode;
  manualHourlyOpportunityCost: number;
  unnecessaryTransportCost: number;
  excessInventoryValue: number;
  inventoryCarryingRatePercent: number;
  unnecessaryMotionHours: number;
  motionHourlyCost: number;
  defectUnits: number;
  reworkCostPerDefect: number;
  overprocessingHours: number;
  overprocessingHourlyCost: number;

  dataConfidencePercent: number;
  implementationDifficulty: number;
};

export type SevenMudaValidationResult = {
  readonly ok: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
};

export const SEVEN_MUDA_ENGINEERING_INPUT_KEYS: readonly (keyof SevenMudaEngineeringInputs)[] = [
  "analysisPeriodDays",
  "annualWorkingDays",
  "productionUnits",
  "currency",
  "unitVariableCost",
  "unitSellingPrice",
  "grossMarginPercent",
  "overproductionUnits",
  "waitingHours",
  "waitingOpportunityCostMode",
  "manualHourlyOpportunityCost",
  "unnecessaryTransportCost",
  "excessInventoryValue",
  "inventoryCarryingRatePercent",
  "unnecessaryMotionHours",
  "motionHourlyCost",
  "defectUnits",
  "reworkCostPerDefect",
  "overprocessingHours",
  "overprocessingHourlyCost",
  "dataConfidencePercent",
  "implementationDifficulty",
];

export const WAITING_OPPORTUNITY_COST_MODE_VALUES: readonly WaitingOpportunityCostMode[] = [
  "margin",
  "manual",
];

const CURRENCY_CODE_PATTERN = /^[A-Z]{3}$/;

const REQUIRED_NUMBER_FIELDS: readonly (keyof SevenMudaEngineeringInputs)[] = [
  "analysisPeriodDays",
  "annualWorkingDays",
  "productionUnits",
  "unitVariableCost",
  "unitSellingPrice",
  "grossMarginPercent",
  "dataConfidencePercent",
  "implementationDifficulty",
];

const PERCENTAGE_FIELDS: readonly (keyof SevenMudaEngineeringInputs)[] = [
  "grossMarginPercent",
  "inventoryCarryingRatePercent",
  "dataConfidencePercent",
];

const WASTE_DRIVER_FIELDS: readonly (keyof SevenMudaEngineeringInputs)[] = [
  "overproductionUnits",
  "waitingHours",
  "manualHourlyOpportunityCost",
  "unnecessaryTransportCost",
  "excessInventoryValue",
  "unnecessaryMotionHours",
  "motionHourlyCost",
  "defectUnits",
  "reworkCostPerDefect",
  "overprocessingHours",
  "overprocessingHourlyCost",
];

const OPTIONAL_NUMBER_FIELDS = SEVEN_MUDA_ENGINEERING_INPUT_KEYS.filter(
  (key): key is Exclude<
    keyof SevenMudaEngineeringInputs,
    | "currency"
    | "waitingOpportunityCostMode"
    | "analysisPeriodDays"
    | "annualWorkingDays"
    | "productionUnits"
    | "unitVariableCost"
    | "unitSellingPrice"
    | "grossMarginPercent"
    | "dataConfidencePercent"
    | "implementationDifficulty"
  > =>
    key !== "currency" &&
    key !== "waitingOpportunityCostMode" &&
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

function parseWaitingOpportunityCostMode(
  raw: unknown,
  errors: string[],
): WaitingOpportunityCostMode | null {
  if (raw === undefined || raw === null || raw === "") {
    errors.push("waitingOpportunityCostMode is required.");
    return null;
  }

  if (raw === "margin" || raw === "manual") {
    return raw;
  }

  errors.push("waitingOpportunityCostMode must be margin or manual.");
  return null;
}

function parseCurrency(raw: unknown, errors: string[]): string | null {
  const trimmed = trimString(raw);
  if (!trimmed) {
    errors.push("currency is required. Enter all monetary inputs in the same ISO 4217 currency.");
    return null;
  }

  if (!CURRENCY_CODE_PATTERN.test(trimmed)) {
    errors.push("currency must match ISO 4217 format (three uppercase letters, e.g. USD, EUR, TRY).");
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

function validatePositivePeriod(
  field: "analysisPeriodDays" | "annualWorkingDays",
  value: number | null,
  errors: string[],
) {
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
    errors.push("implementationDifficulty must be between 1 and 5.");
  }
}

export function validateSevenMudaEngineeringInputs(
  raw: Partial<Record<keyof SevenMudaEngineeringInputs, unknown>>,
): SevenMudaValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const analysisPeriodDays = parseNumberField("analysisPeriodDays", raw.analysisPeriodDays, true, errors);
  const annualWorkingDays = parseNumberField("annualWorkingDays", raw.annualWorkingDays, true, errors);
  parseNumberField("productionUnits", raw.productionUnits, true, errors);
  parseNumberField("unitVariableCost", raw.unitVariableCost, true, errors);
  parseNumberField("unitSellingPrice", raw.unitSellingPrice, true, errors);
  parseNumberField("dataConfidencePercent", raw.dataConfidencePercent, true, errors);
  const implementationDifficulty = parseNumberField(
    "implementationDifficulty",
    raw.implementationDifficulty,
    true,
    errors,
  );

  parseCurrency(raw.currency, errors);
  const waitingOpportunityCostMode = parseWaitingOpportunityCostMode(raw.waitingOpportunityCostMode, errors);

  validatePositivePeriod("analysisPeriodDays", analysisPeriodDays, errors);
  validatePositivePeriod("annualWorkingDays", annualWorkingDays, errors);

  if (
    analysisPeriodDays !== null &&
    annualWorkingDays !== null &&
    analysisPeriodDays > annualWorkingDays
  ) {
    warnings.push(
      "Analiz donemi yillik calisma gununden buyuk. Yilliklandirilmis sonuc ters olceklenebilir.",
    );
  }

  const productionUnits = validateProvidedNumber("productionUnits", raw.productionUnits, errors);
  if (productionUnits !== null && productionUnits <= 0) {
    errors.push("productionUnits must be greater than zero.");
  }

  for (const field of REQUIRED_NUMBER_FIELDS) {
    const value = validateProvidedNumber(field, raw[field], errors);
    if (field === "analysisPeriodDays" || field === "annualWorkingDays") {
      continue;
    }
    if (field === "implementationDifficulty") {
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

  if (waitingOpportunityCostMode === "manual") {
    const manualRate = validateProvidedNumber("manualHourlyOpportunityCost", raw.manualHourlyOpportunityCost, errors);
    if (manualRate === null || manualRate <= 0) {
      warnings.push(
        "Manuel firsat maliyeti modu secildi ancak saatlik firsat maliyeti sifir. Bekleme maliyeti sifir kabul edilir.",
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
  const annualWorkingDays = parseNumberField("annualWorkingDays", raw.annualWorkingDays, true, errors);
  const productionUnits = parseNumberField("productionUnits", raw.productionUnits, true, errors);
  const currency = parseCurrency(raw.currency, errors);
  const unitVariableCost = parseNumberField("unitVariableCost", raw.unitVariableCost, true, errors);
  const unitSellingPrice = parseNumberField("unitSellingPrice", raw.unitSellingPrice, true, errors);
  const grossMarginPercent = parseNumberField("grossMarginPercent", raw.grossMarginPercent, true, errors);
  const waitingOpportunityCostMode = parseWaitingOpportunityCostMode(raw.waitingOpportunityCostMode, errors);
  const dataConfidencePercent = parseNumberField("dataConfidencePercent", raw.dataConfidencePercent, true, errors);
  const implementationDifficulty = parseNumberField(
    "implementationDifficulty",
    raw.implementationDifficulty,
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
    annualWorkingDays === null ||
    productionUnits === null ||
    currency === null ||
    unitVariableCost === null ||
    unitSellingPrice === null ||
    grossMarginPercent === null ||
    waitingOpportunityCostMode === null ||
    dataConfidencePercent === null ||
    implementationDifficulty === null
  ) {
    throw new Error(errors.join(" ") || "Seven muda engineering inputs could not be resolved.");
  }

  return {
    analysisPeriodDays,
    annualWorkingDays,
    productionUnits,
    currency,
    unitVariableCost,
    unitSellingPrice,
    grossMarginPercent,
    waitingOpportunityCostMode,
    dataConfidencePercent,
    implementationDifficulty,
    ...optionalValues,
  };
}

export function hasSevenMudaWasteDriverInput(input: SevenMudaEngineeringInputs): boolean {
  return WASTE_DRIVER_FIELDS.some((field) => {
    const value = input[field];
    return typeof value === "number" && value > 0;
  });
}
