/**
 * Phase 5H-G-B — smart form input type resolver tests.
 */

import { describe, expect, test } from "vitest";
import type { SmartFormFieldSpec } from "@/lib/features/formula-governance/smart-form-architecture/smart-form-types";
import { resolveSmartFormInputType } from "@/lib/features/formula-governance/smart-form-rendering/smart-form-input-type-resolver";

function field(partial: Partial<SmartFormFieldSpec> & Pick<SmartFormFieldSpec, "key" | "role">): SmartFormFieldSpec {
  return {
    label: partial.key,
    section: "required_inputs",
    source: "controlled_input_patch",
    userEditable: true,
    requiredForCalculation: partial.role === "required",
    validationMessages: [],
    visibility: "always",
    ...partial,
  };
}

describe("smart form input type resolver", () => {
  test("resolves percent dimension", () => {
    const resolved = resolveSmartFormInputType(
      field({ key: "targetMarginPercent", role: "required", dimension: "percent", unit: "%" }),
    );
    expect(resolved.inputType).toBe("number");
    expect(resolved.unitLabel).toBe("%");
  });

  test("resolves currency dimension", () => {
    const resolved = resolveSmartFormInputType(
      field({ key: "materialCost", role: "required", dimension: "currency", unit: "USD" }),
    );
    expect(resolved.inputType).toBe("number");
    expect(resolved.unitLabel).toBe("USD");
  });

  test("resolves time dimension", () => {
    const resolved = resolveSmartFormInputType(
      field({ key: "laborHours", role: "required", dimension: "time", unit: "hr" }),
    );
    expect(resolved.inputType).toBe("number");
    expect(resolved.unitLabel).toBe("hr");
  });

  test("resolves derived as readonly_display", () => {
    const resolved = resolveSmartFormInputType(
      field({ key: "estimatedCost", role: "derived", userEditable: false }),
    );
    expect(resolved.inputType).toBe("readonly_display");
  });

  test("resolves assumption as assumption_display", () => {
    const resolved = resolveSmartFormInputType(
      field({ key: "assumption-0", role: "assumption", userEditable: false }),
    );
    expect(resolved.inputType).toBe("assumption_display");
  });

  test("resolves validation_only as hidden_validation_anchor", () => {
    const resolved = resolveSmartFormInputType(
      field({ key: "validation-rule", role: "validation_only", userEditable: false }),
    );
    expect(resolved.inputType).toBe("hidden_validation_anchor");
  });
});
