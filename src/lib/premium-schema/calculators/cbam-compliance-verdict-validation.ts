export type CbamComplianceVerdictInputs = {
  embeddedEmissionsTon: number;
  declaredEmissionsTon: number;
  certificateCoveragePct: number;
  dataCompletenessPct: number;
  cbamCertificatePrice: number;
  eurTryRate: number;
};

export type CbamComplianceVerdictValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const CBAM_COMPLIANCE_VERDICT_INPUT_KEYS: readonly (keyof CbamComplianceVerdictInputs)[] = [
  "embeddedEmissionsTon",
  "declaredEmissionsTon",
  "certificateCoveragePct",
  "dataCompletenessPct",
  "cbamCertificatePrice",
  "eurTryRate",
];

const INPUT_LABELS: Record<keyof CbamComplianceVerdictInputs, string> = {
  embeddedEmissionsTon: "embeddedEmissionsTon",
  declaredEmissionsTon: "declaredEmissionsTon",
  certificateCoveragePct: "certificateCoveragePct",
  dataCompletenessPct: "dataCompletenessPct",
  cbamCertificatePrice: "cbamCertificatePrice",
  eurTryRate: "eurTryRate",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: CbamComplianceVerdictInputs): string[] {
  const errors: string[] = [];

  for (const key of CBAM_COMPLIANCE_VERDICT_INPUT_KEYS) {
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

  if (inputs.embeddedEmissionsTon < 0) {
    errors.push("embeddedEmissionsTon must be greater than or equal to zero.");
  }

  if (inputs.declaredEmissionsTon < 0) {
    errors.push("declaredEmissionsTon must be greater than or equal to zero.");
  }

  if (inputs.certificateCoveragePct < 0 || inputs.certificateCoveragePct > 100) {
    errors.push("certificateCoveragePct must be between 0 and 100.");
  }

  if (inputs.dataCompletenessPct < 0 || inputs.dataCompletenessPct > 100) {
    errors.push("dataCompletenessPct must be between 0 and 100.");
  }

  if (inputs.cbamCertificatePrice < 0) {
    errors.push("cbamCertificatePrice must be greater than or equal to zero.");
  }

  if (inputs.eurTryRate < 0) {
    errors.push("eurTryRate must be greater than or equal to zero.");
  }

  if (inputs.eurTryRate <= 0) {
    errors.push("eurTryRate must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: CbamComplianceVerdictInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateCbamComplianceVerdictInputs(inputs: CbamComplianceVerdictInputs): CbamComplianceVerdictValidationResult {
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
