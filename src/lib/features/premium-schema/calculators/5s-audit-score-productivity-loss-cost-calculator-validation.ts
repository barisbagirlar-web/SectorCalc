export type FiveSAuditEfficiencyLossInputs = {
  current5sScore: number;
  target5sScore: number;
  totalEmployees: number;
  avgHourlyCost: number;
  monthlyWorkingHours: number;
};

export type FiveSAuditEfficiencyLossValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const FIVE_S_AUDIT_EFFICIENCY_LOSS_INPUT_KEYS: readonly (keyof FiveSAuditEfficiencyLossInputs)[] = [
  "current5sScore",
  "target5sScore",
  "totalEmployees",
  "avgHourlyCost",
  "monthlyWorkingHours",
];

const INPUT_LABELS: Record<keyof FiveSAuditEfficiencyLossInputs, string> = {
  current5sScore: "current5sScore",
  target5sScore: "target5sScore",
  totalEmployees: "totalEmployees",
  avgHourlyCost: "avgHourlyCost",
  monthlyWorkingHours: "monthlyWorkingHours",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: FiveSAuditEfficiencyLossInputs): string[] {
  const errors: string[] = [];

  for (const key of FIVE_S_AUDIT_EFFICIENCY_LOSS_INPUT_KEYS) {
    const value = inputs[key];
    if (value === undefined || value === null) {
      errors.push(`${INPUT_LABELS[key]} is required.`);
      continue;
    }
    if (!isValidNumber(value)) {
      errors.push(`${INPUT_LABELS[key]} must be a finite number.`);
    }
  }

  if (errors.length > 0) return errors;

  if (inputs.current5sScore < 0 || inputs.current5sScore > 100) {
    errors.push("current5sScore must be between 0 and 100.");
  }
  if (inputs.target5sScore < 0 || inputs.target5sScore > 100) {
    errors.push("target5sScore must be between 0 and 100.");
  }
  if (inputs.totalEmployees < 1) {
    errors.push("totalEmployees must be at least 1.");
  }
  if (inputs.avgHourlyCost < 0) {
    errors.push("avgHourlyCost must be non-negative.");
  }
  if (inputs.monthlyWorkingHours < 1) {
    errors.push("monthlyWorkingHours must be at least 1.");
  }

  return errors;
}

function collectWarnings(inputs: FiveSAuditEfficiencyLossInputs): string[] {
  const warnings: string[] = [];
  if (inputs.current5sScore > inputs.target5sScore) {
    warnings.push("Current 5S score is already above target — review direction.");
  }
  return warnings;
}

export function validateFiveSAuditEfficiencyLossInputs(
  inputs: FiveSAuditEfficiencyLossInputs,
): FiveSAuditEfficiencyLossValidationResult {
  const errors = collectInputErrors(inputs);
  const warnings = collectWarnings(inputs);

  if (errors.length > 0) {
    return { ok: false, errors, warnings };
  }

  return { ok: true, errors: [], warnings };
}

export function validateFiveSAuditEfficiencyLossPartial(
  partial: Partial<FiveSAuditEfficiencyLossInputs>,
): FiveSAuditEfficiencyLossValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const key of FIVE_S_AUDIT_EFFICIENCY_LOSS_INPUT_KEYS) {
    const value = partial[key];
    if (value !== undefined && value !== null && !isValidNumber(value)) {
      errors.push(`${INPUT_LABELS[key]} must be a finite number.`);
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors, warnings };
  }

  return { ok: true, errors: [], warnings };
}
