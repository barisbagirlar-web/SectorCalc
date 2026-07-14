import { describe, expect, it } from "vitest";
import type { SuperV4Input } from "../contract-types";
import { allowEnteredValueAsExecutionEvidence } from "@/sectorcalc/runtime/schema-presentation-overrides";

function inputWithEvidence(acceptedEvidence: string[]): SuperV4Input {
  return {
    id: "verified_cost",
    name: "Verified Cost",
    symbol: "C",
    quantity_kind: "currency",
    unit_selectable: false,
    base_unit: "currency_unit",
    allowed_display_units: [],
    normalized_id: "n_verified_cost",
    type: "number",
    required: true,
    criticality: "CRITICAL",
    default_policy: "NO_DEFAULT",
    default_value: null,
    reference_values: {
      reference_value_type: "USER_VERIFIED",
      source: "controlled source",
      reference_status: "NEEDS_SOURCE_VERIFICATION",
      user_must_verify: true,
      public_note: "Project-specific input.",
    },
    evidence_requirement: {
      required: true,
      accepted_evidence: acceptedEvidence,
      missing_evidence_behavior: "BLOCK",
      public_help_text: "Enter a controlled value.",
    },
    formula_bindings: [],
    output_bindings: [],
  };
}

describe("entered value execution evidence", () => {
  it("adds the exact client-precheck evidence token while retaining BLOCK governance", () => {
    const result = allowEnteredValueAsExecutionEvidence(
      inputWithEvidence(["vendor quote", "signed engineering note"]),
    );
    const requirement = result.evidence_requirement;
    expect(typeof requirement).not.toBe("string");
    if (typeof requirement === "string") return;

    expect(requirement.accepted_evidence).toContain("user-provided value");
    expect(requirement.accepted_evidence).toContain("vendor quote");
    expect(requirement.required).toBe(true);
    expect(requirement.missing_evidence_behavior).toBe("BLOCK");
  });

  it("is idempotent and does not duplicate the evidence token", () => {
    const once = allowEnteredValueAsExecutionEvidence(
      inputWithEvidence(["user-provided value"]),
    );
    const twice = allowEnteredValueAsExecutionEvidence(once);
    const requirement = twice.evidence_requirement;
    expect(typeof requirement).not.toBe("string");
    if (typeof requirement === "string") return;

    expect(requirement.accepted_evidence.filter(
      (value) => value.toLowerCase() === "user-provided value",
    )).toHaveLength(1);
  });
});
