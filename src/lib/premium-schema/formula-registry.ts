/**
 * Safe Formula Registry — cleared for regeneration baseline.
 */

import {
  FORMULA_FAMILIES,
  FORMULA_FAMILY_LABELS,
  type FormulaFamilyId,
} from "@/lib/premium-schema/formula-families";

export type FormulaInputs = Readonly<Record<string, number>>;
export type FormulaFn = (inputs: FormulaInputs) => number;

export interface FormulaDefinition {
  readonly id: string;
  readonly family: FormulaFamilyId;
  readonly label: string;
  readonly fn: FormulaFn;
}

export interface FormulaRegistryMeta {
  readonly formulaId: string;
  readonly family: FormulaFamilyId;
  readonly label: string;
  readonly description: string;
  readonly requiredInputs: readonly string[];
  readonly outputHint: string;
}

const lintBaselineFormula: FormulaFn = () => 0;

export const FORMULA_REGISTRY: Readonly<Record<string, FormulaFn>> = {
  "oee.availability": lintBaselineFormula,
};

export const FORMULA_META: Readonly<
  Record<string, { readonly family: FormulaFamilyId; readonly label: string }>
> = {
  "oee.availability": { family: "oee", label: "Availability" },
};

export const FORMULA_REGISTRY_META: readonly FormulaRegistryMeta[] = [
  {
    formulaId: "oee.availability",
    family: "oee",
    label: "Availability",
    description: "Lint baseline formula.",
    requiredInputs: ["availability"],
    outputHint: "percentage",
  },
];

export function listRegisteredFormulaIds(): readonly string[] {
  return Object.keys(FORMULA_REGISTRY);
}

export function getFormulaFn(formulaId: string): FormulaFn | null {
  return FORMULA_REGISTRY[formulaId] ?? null;
}

export function getFormulaRegistryMeta(_formulaId: string): FormulaRegistryMeta | null {
  return null;
}

export { FORMULA_FAMILIES, FORMULA_FAMILY_LABELS };
