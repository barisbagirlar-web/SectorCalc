/**
 * Phase 5H-G-C — component kind resolver tests.
 */

import { describe, expect, test } from "vitest";
import type { SmartFormRenderField } from "@/lib/formula-governance/smart-form-rendering/smart-form-render-types";
import { resolveComponentKindForRenderField } from "@/lib/formula-governance/smart-form-ui-bridge/component-kind-resolver";

function field(partial: Partial<SmartFormRenderField> & Pick<SmartFormRenderField, "key" | "role">): SmartFormRenderField {
  return {
    label: partial.key,
    inputType: "number",
    order: 0,
    required: partial.role === "required",
    editable: true,
    visibility: "always",
    validationMessages: [],
    ...partial,
  };
}

describe("component kind resolver", () => {
  test("editable required input resolves to field_input", () => {
    expect(
      resolveComponentKindForRenderField(
        field({ key: "materialCost", role: "required", editable: true }),
      ),
    ).toBe("field_input");
  });

  test("derived readonly resolves to field_readonly", () => {
    expect(
      resolveComponentKindForRenderField(
        field({
          key: "estimatedCost",
          role: "derived",
          editable: false,
          inputType: "readonly_display",
          derivedBadge: "Derived",
        }),
      ),
    ).toBe("field_readonly");
  });

  test("assumption badge resolves to assumption_callout", () => {
    expect(
      resolveComponentKindForRenderField(
        field({
          key: "assumption-0",
          role: "assumption",
          editable: false,
          inputType: "assumption_display",
          assumptionBadge: "Assumption",
        }),
      ),
    ).toBe("assumption_callout");
  });

  test("validation_only resolves to validation_message", () => {
    expect(
      resolveComponentKindForRenderField(
        field({
          key: "validation-rule",
          role: "validation_only",
          editable: false,
          inputType: "hidden_validation_anchor",
        }),
      ),
    ).toBe("validation_message");
  });

  test("advanced badge resolves to advanced_toggle", () => {
    expect(
      resolveComponentKindForRenderField(
        field({
          key: "calibrationRisk",
          role: "advanced",
          editable: true,
          advancedBadge: "Advanced",
        }),
      ),
    ).toBe("advanced_toggle");
  });
});
