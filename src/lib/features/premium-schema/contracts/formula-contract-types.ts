export type FormulaValueKind =
  | "number"
  | "ratio"
  | "currency"
  | "percentage"
  | "integer"
  | "boolean"
  | "text"
  | "array"
  | "object";

export type FormulaUnit =
  | "none"
  | "ratio"
  | "percent"
  | "currency"
  | "currency_per_hour"
  | "currency_per_unit"
  | "minutes"
  | "hours"
  | "days"
  | "kg"
  | "m"
  | "mm"
  | "m2"
  | "m3"
  | "kwh"
  | "kpa"
  | "mpa"
  | "kn"
  | "kn_m"
  | "custom";

export interface FormulaInputContract {
  readonly id: string;
  readonly kind: FormulaValueKind;
  readonly unit: FormulaUnit;
  readonly required: true;
}

export interface FormulaOutputContract {
  readonly id: string;
  readonly kind: FormulaValueKind;
  readonly unit: FormulaUnit;
  readonly internal?: boolean;
}

export interface FormulaContract {
  readonly formulaId: string;
  readonly requiredInputs: readonly FormulaInputContract[];
  readonly outputs: readonly FormulaOutputContract[];
  readonly deterministic: true;
  readonly notes?: readonly string[];
}
