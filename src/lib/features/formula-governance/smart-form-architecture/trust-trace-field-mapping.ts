/**
 * Trust trace field mapping — Phase 5H-G-A governance mapping (no report output).
 */

import type {
  SmartFormPlan,
  SmartFormTrustTraceMapping,
} from "@/lib/features/formula-governance/smart-form-architecture/smart-form-types";

export function buildTrustTraceFieldMapping(plan: SmartFormPlan): SmartFormTrustTraceMapping {
  const usedInputs = plan.fields
    .filter((field) => field.role === "required" || field.role === "optional")
    .map((field) => field.key);

  const professionalInputs = plan.fields
    .filter((field) => field.role === "advanced")
    .map((field) => field.key);

  const derivedValues = plan.fields
    .filter((field) => field.role === "derived")
    .map((field) => field.key);

  const hiddenNonEditableValues = plan.fields
    .filter((field) => !field.userEditable)
    .map((field) => field.key);

  const defaultAssumptions = plan.defaultAssumptionDisplays.map((entry) => entry.text);

  const validationSources = plan.validationMessagePlan.map(
    (entry) => `${entry.ruleId}:${entry.kind}`,
  );

  const modelLimitationsSource = plan.fields
    .filter((field) => field.role === "assumption" && field.professionalNote?.includes("limitation"))
    .map((field) => field.key);

  return {
    usedInputs,
    defaultAssumptions,
    derivedValues,
    validationSources,
    professionalInputs,
    hiddenNonEditableValues,
    modelLimitationsSource,
  };
}
