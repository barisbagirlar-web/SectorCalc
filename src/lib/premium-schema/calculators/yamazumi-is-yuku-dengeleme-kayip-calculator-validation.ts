export type YamazumiIsYukuDengelemeKayipCalculatorInputs = {
  availableWorkTimePerShift: number;
  requiredQuantityPerShift: number;
  numberOfStations: number;
  stationCycleTimes: number;
};

export type YamazumiIsYukuDengelemeKayipCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const YAMAZUMI_IS_YUKU_DENGELEME_KAYIP_CALCULATOR_INPUT_KEYS: readonly (keyof YamazumiIsYukuDengelemeKayipCalculatorInputs)[] = [
  "availableWorkTimePerShift",
  "requiredQuantityPerShift",
  "numberOfStations",
  "stationCycleTimes",
];

const INPUT_LABELS: Record<keyof YamazumiIsYukuDengelemeKayipCalculatorInputs, string> = {
  availableWorkTimePerShift: "availableWorkTimePerShift",
  requiredQuantityPerShift: "requiredQuantityPerShift",
  numberOfStations: "numberOfStations",
  stationCycleTimes: "stationCycleTimes",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: YamazumiIsYukuDengelemeKayipCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of YAMAZUMI_IS_YUKU_DENGELEME_KAYIP_CALCULATOR_INPUT_KEYS) {
    const value = inputs[key];
    if (value === undefined || value === null) {
      errors.push(`${INPUT_LABELS[key]} is required.`);
      continue;
    }
    if (!isValidNumber(value)) {
      errors.push(`${INPUT_LABELS[key]} must be a finite number.`);
    }
  }

  if (errors.length > 0) {
    return errors;
  }

  if (inputs.availableWorkTimePerShift < 1 || inputs.availableWorkTimePerShift > 1440) {
    errors.push("availableWorkTimePerShift must be between 1 and 1440.");
  }

  if (inputs.availableWorkTimePerShift <= 0) {
    errors.push("availableWorkTimePerShift must be greater than zero.");
  }

  if (inputs.requiredQuantityPerShift < 1 || inputs.requiredQuantityPerShift > 100000) {
    errors.push("requiredQuantityPerShift must be between 1 and 100000.");
  }

  if (inputs.requiredQuantityPerShift <= 0) {
    errors.push("requiredQuantityPerShift must be greater than zero.");
  }

  if (inputs.numberOfStations < 1 || inputs.numberOfStations > 100) {
    errors.push("numberOfStations must be between 1 and 100.");
  }

  if (inputs.numberOfStations <= 0) {
    errors.push("numberOfStations must be greater than zero.");
  }

  if (inputs.stationCycleTimes < 0 || inputs.stationCycleTimes > 3600) {
    errors.push("stationCycleTimes must be between 0 and 3600.");
  }

  return errors;
}

function collectWarnings(inputs: YamazumiIsYukuDengelemeKayipCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateYamazumiIsYukuDengelemeKayipCalculatorInputs(inputs: YamazumiIsYukuDengelemeKayipCalculatorInputs): YamazumiIsYukuDengelemeKayipCalculatorValidationResult {
  const errors = collectInputErrors(inputs);
  if (errors.length > 0) {
    return { ok: false, errors, warnings: [] };
  }

  return {
    ok: true,
    errors: [],
    warnings: collectWarnings(inputs),
  };
}
