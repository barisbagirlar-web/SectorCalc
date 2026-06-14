export type ToplantiSaatiMaliyetiHesaplamaInputs = {
  totalAttendees: number;
  hourlyRate: number;
  meetingDurationHours: number;
  overheadRatePercent: number;
  opportunityFactor: number;
};

export type ToplantiSaatiMaliyetiHesaplamaValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const TOPLANTI_SAATI_MALIYETI_HESAPLAMA_INPUT_KEYS: readonly (keyof ToplantiSaatiMaliyetiHesaplamaInputs)[] = [
  "totalAttendees",
  "hourlyRate",
  "meetingDurationHours",
  "overheadRatePercent",
  "opportunityFactor",
];

const INPUT_LABELS: Record<keyof ToplantiSaatiMaliyetiHesaplamaInputs, string> = {
  totalAttendees: "totalAttendees",
  hourlyRate: "hourlyRate",
  meetingDurationHours: "meetingDurationHours",
  overheadRatePercent: "overheadRatePercent",
  opportunityFactor: "opportunityFactor",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: ToplantiSaatiMaliyetiHesaplamaInputs): string[] {
  const errors: string[] = [];

  for (const key of TOPLANTI_SAATI_MALIYETI_HESAPLAMA_INPUT_KEYS) {
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

  if (inputs.totalAttendees < 1 || inputs.totalAttendees > 1000) {
    errors.push("totalAttendees must be between 1 and 1000.");
  }

  if (inputs.totalAttendees <= 0) {
    errors.push("totalAttendees must be greater than zero.");
  }

  if (inputs.hourlyRate < 0 || inputs.hourlyRate > 10000) {
    errors.push("hourlyRate must be between 0 and 10000.");
  }

  if (inputs.meetingDurationHours < 0.25 || inputs.meetingDurationHours > 24) {
    errors.push("meetingDurationHours must be between 0.25 and 24.");
  }

  if (inputs.meetingDurationHours <= 0) {
    errors.push("meetingDurationHours must be greater than zero.");
  }

  if (inputs.overheadRatePercent < 0 || inputs.overheadRatePercent > 100) {
    errors.push("overheadRatePercent must be between 0 and 100.");
  }

  if (inputs.opportunityFactor < 0 || inputs.opportunityFactor > 2) {
    errors.push("opportunityFactor must be between 0 and 2.");
  }

  return errors;
}

function collectWarnings(inputs: ToplantiSaatiMaliyetiHesaplamaInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateToplantiSaatiMaliyetiHesaplamaInputs(inputs: ToplantiSaatiMaliyetiHesaplamaInputs): ToplantiSaatiMaliyetiHesaplamaValidationResult {
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
