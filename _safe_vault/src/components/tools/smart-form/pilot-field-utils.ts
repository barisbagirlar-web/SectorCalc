/**
 * Slug-aware smart form pilot field helpers — Phase 5H-G-G.
 */

import type { SmartFormFieldComponentProps } from "@/lib/formula-governance/smart-form-ui-bridge/smart-form-ui-bridge-types";
import { getPilotMappedSubmitKeys } from "@/lib/formula-governance/smart-form-ui-bridge/pilot-calculation-bridge-registry";
import type { PilotFieldValues } from "@/components/tools/smart-form/pilot-calculation-payload";

export function isPilotMappedCalculationField(
  field: SmartFormFieldComponentProps,
  governanceSlug: string,
): boolean {
  const mappedKeys = getPilotMappedSubmitKeys(governanceSlug);
  return (
    field.componentKind === "field_input" &&
    field.editable &&
    mappedKeys.includes(field.key)
  );
}

export function isPilotSubmitDisabled(
  fieldValues: PilotFieldValues,
  governanceSlug: string,
): boolean {
  const mappedKeys = getPilotMappedSubmitKeys(governanceSlug);
  return mappedKeys.some((key) => (fieldValues[key] ?? "").trim().length === 0);
}

export function isEditablePilotField(field: SmartFormFieldComponentProps): boolean {
  return field.componentKind === "field_input" && field.editable;
}
