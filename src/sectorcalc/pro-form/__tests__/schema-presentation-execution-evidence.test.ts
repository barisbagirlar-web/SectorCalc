import { describe, expect, it, vi } from "vitest";
import type { ConversionRegistryItem, ServerOutput, SuperV4Input } from "../contract-types";
import { allowEnteredValueAsExecutionEvidence } from "@/sectorcalc/runtime/schema-presentation-overrides";
import { buildUniversalResult } from "@/sectorcalc/result-perspectives/universal-result-adapter";

vi.mock("server-only", () => ({}));

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

  it("registers every Break-Even currency dimensional base unit", async () => {
    const { clearSchemaCache, resolveApprovedToolSchema } = await import(
      "@/sectorcalc/runtime/resolve-approved-tool-schema"
    );
    clearSchemaCache();
    const resolved = resolveApprovedToolSchema("break-even-survival-cash-calculator");
    expect(resolved.ok).toBe(true);
    if (!resolved.ok) return;

    const currencyEntry = resolved.schema.unit_conversion_contract
      .conversion_registry.currency as ConversionRegistryItem;
    const registered = new Set(currencyEntry.units.map((entry) => entry.unit));
    const required = resolved.schema.inputs
      .filter((input) => input.quantity_kind === "currency" && input.base_unit)
      .map((input) => input.base_unit as string);

    expect(registered).toContain("display_currency");
    expect(registered).toContain("currency_unit");
    expect(registered).toContain("currency_unit/month");
    for (const unit of required) expect(registered).toContain(unit);
  });

  it("routes CNC hourly-rate outputs to visible generic result cards while preserving the public category", async () => {
    const { clearSchemaCache, resolveApprovedToolSchema } = await import(
      "@/sectorcalc/runtime/resolve-approved-tool-schema"
    );
    clearSchemaCache();
    const resolved = resolveApprovedToolSchema("cnc-shop-hourly-rate");
    expect(resolved.ok).toBe(true);
    if (!resolved.ok) return;

    expect(resolved.schema.category).toBe("Production Operations");
    expect((resolved.schema as typeof resolved.schema & { category_label?: string }).category_label)
      .toBe("Machining & CNC");

    const values: Record<string, number> = {
      true_hourly_rate: 711,
      fixed_hourly_burden: 600,
      variable_hourly_burden: 110,
      annual_underpricing_exposure: 701,
    };
    const outputs: ServerOutput[] = resolved.schema.outputs.map((output) => ({
      ...output,
      value: values[output.id] ?? 0,
      status: "OK",
    }));
    const result = buildUniversalResult(resolved.schema, {}, outputs);

    expect(result).not.toBeNull();
    expect(result?.cards.length).toBeGreaterThan(0);
    expect(result?.cards.some((card) => card.id === "true_hourly_rate")).toBe(true);
    expect(result?.primary.label).toBe("True Hourly Rate");
    expect(result?.decisionState.label).not.toBe("");
  });
});
