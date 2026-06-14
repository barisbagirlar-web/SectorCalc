export type TakimTutucuVeBaglamaAparatiSetupSuresiCalculatorInputs = {
  numberOfTools: number;
  numberOfFixtureChanges: number;
  baseTimePerTool: number;
  baseTimePerFixtureChange: number;
  complexityFactor: number;
  operatorSkillFactor: number;
};

export type TakimTutucuVeBaglamaAparatiSetupSuresiCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const TAKIM_TUTUCU_VE_BAGLAMA_APARATI_SETUP_SURESI_CALCULATOR_INPUT_KEYS: readonly (keyof TakimTutucuVeBaglamaAparatiSetupSuresiCalculatorInputs)[] = [
  "numberOfTools",
  "numberOfFixtureChanges",
  "baseTimePerTool",
  "baseTimePerFixtureChange",
  "complexityFactor",
  "operatorSkillFactor",
];

const INPUT_LABELS: Record<keyof TakimTutucuVeBaglamaAparatiSetupSuresiCalculatorInputs, string> = {
  numberOfTools: "numberOfTools",
  numberOfFixtureChanges: "numberOfFixtureChanges",
  baseTimePerTool: "baseTimePerTool",
  baseTimePerFixtureChange: "baseTimePerFixtureChange",
  complexityFactor: "complexityFactor",
  operatorSkillFactor: "operatorSkillFactor",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: TakimTutucuVeBaglamaAparatiSetupSuresiCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of TAKIM_TUTUCU_VE_BAGLAMA_APARATI_SETUP_SURESI_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.numberOfTools < 1 || inputs.numberOfTools > 100) {
    errors.push("numberOfTools must be between 1 and 100.");
  }

  if (inputs.numberOfTools <= 0) {
    errors.push("numberOfTools must be greater than zero.");
  }

  if (inputs.numberOfFixtureChanges < 0 || inputs.numberOfFixtureChanges > 50) {
    errors.push("numberOfFixtureChanges must be between 0 and 50.");
  }

  if (inputs.baseTimePerTool < 0.5 || inputs.baseTimePerTool > 60) {
    errors.push("baseTimePerTool must be between 0.5 and 60.");
  }

  if (inputs.baseTimePerTool <= 0) {
    errors.push("baseTimePerTool must be greater than zero.");
  }

  if (inputs.baseTimePerFixtureChange < 0.5 || inputs.baseTimePerFixtureChange > 120) {
    errors.push("baseTimePerFixtureChange must be between 0.5 and 120.");
  }

  if (inputs.baseTimePerFixtureChange <= 0) {
    errors.push("baseTimePerFixtureChange must be greater than zero.");
  }

  if (inputs.complexityFactor < 0.5 || inputs.complexityFactor > 3) {
    errors.push("complexityFactor must be between 0.5 and 3.");
  }

  if (inputs.complexityFactor <= 0) {
    errors.push("complexityFactor must be greater than zero.");
  }

  if (inputs.operatorSkillFactor < 0.8 || inputs.operatorSkillFactor > 1.2) {
    errors.push("operatorSkillFactor must be between 0.8 and 1.2.");
  }

  if (inputs.operatorSkillFactor <= 0) {
    errors.push("operatorSkillFactor must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: TakimTutucuVeBaglamaAparatiSetupSuresiCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateTakimTutucuVeBaglamaAparatiSetupSuresiCalculatorInputs(inputs: TakimTutucuVeBaglamaAparatiSetupSuresiCalculatorInputs): TakimTutucuVeBaglamaAparatiSetupSuresiCalculatorValidationResult {
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
