/**
 * Smart form input type resolver — Phase 5H-G-B governance (no UI).
 */

import type { SmartFormFieldSpec } from "@/lib/formula-governance/smart-form-architecture/smart-form-types";
import type { SmartFormInputType } from "@/lib/formula-governance/smart-form-rendering/smart-form-render-types";

export type ResolvedSmartFormInputType = {
  readonly inputType: SmartFormInputType;
  readonly unitLabel?: string;
};

export function resolveSmartFormInputType(field: SmartFormFieldSpec): ResolvedSmartFormInputType {
  if (field.role === "derived") {
    return { inputType: "readonly_display", unitLabel: field.unit };
  }

  if (field.role === "assumption") {
    return { inputType: "assumption_display" };
  }

  if (field.role === "validation_only") {
    return { inputType: "hidden_validation_anchor" };
  }

  const dimension = field.dimension ?? "dimensionless";

  if (dimension === "percent") {
    return { inputType: "number", unitLabel: "%" };
  }

  if (dimension === "currency") {
    return { inputType: "number", unitLabel: field.unit ?? "USD" };
  }

  if (dimension === "time") {
    return { inputType: "number", unitLabel: field.unit ?? "hr" };
  }

  if (dimension === "count") {
    return { inputType: "number", unitLabel: field.unit ?? "count" };
  }

  return { inputType: "number", unitLabel: field.unit };
}
