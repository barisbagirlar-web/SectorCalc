export type DovizPozisyonuKurFarkiRiskiHesabiInputs = {
  foreignAssets: number;
  foreignLiabilities: number;
  currentExchangeRate: number;
  expectedExchangeRate: number;
  hedgingRatio: number;
};

export type DovizPozisyonuKurFarkiRiskiHesabiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const DOVIZ_POZISYONU_KUR_FARKI_RISKI_HESABI_INPUT_KEYS: readonly (keyof DovizPozisyonuKurFarkiRiskiHesabiInputs)[] = [
  "foreignAssets",
  "foreignLiabilities",
  "currentExchangeRate",
  "expectedExchangeRate",
  "hedgingRatio",
];

const INPUT_LABELS: Record<keyof DovizPozisyonuKurFarkiRiskiHesabiInputs, string> = {
  foreignAssets: "foreignAssets",
  foreignLiabilities: "foreignLiabilities",
  currentExchangeRate: "currentExchangeRate",
  expectedExchangeRate: "expectedExchangeRate",
  hedgingRatio: "hedgingRatio",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: DovizPozisyonuKurFarkiRiskiHesabiInputs): string[] {
  const errors: string[] = [];
  for (const key of DOVIZ_POZISYONU_KUR_FARKI_RISKI_HESABI_INPUT_KEYS) {
    const value = inputs[key];
    if (value === undefined || value === null) {
      errors.push(`${INPUT_LABELS[key]} is required.`);
      continue;
    }
    if (!isValidNumber(value)) {
      errors.push(`${INPUT_LABELS[key]} must be a finite number.`);
    }
  }
  return errors;
}

function collectWarnings(inputs: DovizPozisyonuKurFarkiRiskiHesabiInputs): string[] {
  const warnings: string[] = [];
  return warnings;
}

export function validateDovizPozisyonuKurFarkiRiskiHesabiInputs(inputs: DovizPozisyonuKurFarkiRiskiHesabiInputs): DovizPozisyonuKurFarkiRiskiHesabiValidationResult {
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
