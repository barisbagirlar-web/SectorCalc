/**
 * Component kind resolver — Phase 5H-G-C governance (no UI imports).
 */

import type { SmartFormRenderField } from "@/lib/formula-governance/smart-form-rendering/smart-form-render-types";
import type { SmartFormComponentKind } from "@/lib/formula-governance/smart-form-ui-bridge/smart-form-ui-bridge-types";

export function resolveComponentKindForRenderField(
  field: SmartFormRenderField,
): SmartFormComponentKind {
  if (field.role === "validation_only" || field.inputType === "hidden_validation_anchor") {
    return "validation_message";
  }

  if (field.assumptionBadge || field.inputType === "assumption_display" || field.role === "assumption") {
    return "assumption_callout";
  }

  if (!field.editable && (field.role === "derived" || field.inputType === "readonly_display")) {
    return "field_readonly";
  }

  if (field.advancedBadge || field.role === "advanced") {
    return "advanced_toggle";
  }

  if (field.editable) {
    return "field_input";
  }

  return "field_readonly";
}

export function resolveComponentKindForSection(
  sectionType: string,
  fields: readonly SmartFormRenderField[],
): SmartFormComponentKind {
  if (sectionType === "trust_trace") {
    return "trust_trace_panel";
  }

  if (sectionType === "advanced_professional_inputs") {
    return "advanced_toggle";
  }

  if (fields.some((field) => field.role === "assumption")) {
    return "assumption_callout";
  }

  return "section_shell";
}
