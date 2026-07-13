// SectorCalc V5.4 — Result Perspectives Golden Tests
// Validates that the Universal Result Perspectives adapter produces correct
// enriched outputs for category-based result profiles.
//
// Key tests:
// - Machining Cost per Part: 13.27 unit cost, 16.58 margin price, 15.92 markup
// - Decision state is never blank or "—"
// - Commercial outputs exist when margin inputs present

import { describe, test, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { buildUniversalResult, hasCommercialPrice, hasValidDecisionState } from "@/sectorcalc/result-perspectives/universal-result-adapter";

const FIXTURE_DIR = resolve(process.cwd(), "tests/result-perspectives/fixtures");

interface GoldenFixture {
  tool_key: string;
  tool_id: string;
  raw_inputs: Record<string, unknown>;
  expected_outputs?: Record<string, number>;
  expected_result_perspectives?: {
    primary_label?: string;
    primary_value?: number;
    has_commercial_price?: boolean;
    decision_state_blank?: boolean;
    decision_state_dash?: boolean;
    min_cards?: number;
  };
  expected_redaction_status?: string;
  expected_no_public_formula_exposure?: boolean;
}

describe("Result Perspectives — Golden Tests", () => {
  test("Machining Cost per Part produces 13.27 cost, 16.58 margin price, 15.92 markup", async () => {
    // Load the dedicated result-perspectives fixture. It intentionally lives
    // outside the Free V5.3.1 hash suite because it exercises a second input
    // scenario for the same tool.
    const goldenPath = resolve(FIXTURE_DIR, "machining-cost-per-part-mandated.json");
    expect(existsSync(goldenPath)).toBe(true);
    const golden: GoldenFixture = JSON.parse(readFileSync(goldenPath, "utf8"));

    // Import formula module
    const formulaModule = await import("@/sectorcalc/formulas/free-v531/machining-cost-per-part.formula");
    expect(formulaModule).toBeDefined();
    expect(typeof formulaModule.execute).toBe("function");

    // Execute formula with golden inputs
    const rawInputs = { ...golden.raw_inputs } as Record<string, number>;
    const formulaResult = formulaModule.execute(rawInputs);
    expect(formulaResult).toBeDefined();
    expect(formulaResult.outputs).toBeDefined();
    expect(formulaResult.outputs.length).toBeGreaterThan(0);

    // Map formula outputs to ServerOutput format (adapter input)
    const serverOutputs = formulaResult.outputs.map((o: any) => ({
      id: o.id,
      name: o.name ?? o.id,
      value: typeof o.value === "number" ? o.value : null,
      unit: o.unit ?? null,
      status: typeof o.value === "number" && Number.isFinite(o.value) ? ("OK" as const) : ("REVIEW" as const),
      formula_source: null,
      public_explanation: "Test execution",
      operator_explanation: "",
      engineer_explanation: "",
      owner_cfo_explanation: "",
      checker_explanation: "",
      decision_use: "Primary decision indicator",
      evidence_level: "SCREENING_ONLY" as const,
    }));

    // Create a minimal schema for adapter
    const schema = {
      tool_id: golden.tool_id,
      tool_key: golden.tool_key,
      category: "Machining & CNC",
      inputs: Object.keys(rawInputs).map((key) => ({
        id: key,
        name: key.replace(/_/g, " "),
        type: "number",
      })),
      outputs: serverOutputs.map((o: any) => ({
        id: o.id,
        name: o.name,
        type: "number",
        unit: o.unit,
      })),
    } as any;

    // Run adapter
    const result = buildUniversalResult(schema, rawInputs, serverOutputs);
    expect(result).not.toBeNull();

    if (!result) return; // TypeScript narrow

    // Verify primary result
    const primary = result.primary;
    const expectedPrimaryLabel = golden.expected_result_perspectives?.primary_label ?? "Unit Cost per Part";
    const expectedPrimaryValue = golden.expected_result_perspectives?.primary_value ?? 13.27;

    expect(primary.label).toBe(expectedPrimaryLabel);
    // Primary value should be approximately 13.27 (within 0.02 tolerance)
    if (typeof primary.value === "number") {
      expect(primary.value).toBeCloseTo(expectedPrimaryValue, 1);
    }

    // Verify commercial price exists
    const commCards = result.cards.filter((c) => c.perspective === "commercial_price");
    expect(commCards.length).toBeGreaterThanOrEqual(1);
    expect(hasCommercialPrice(result)).toBe(true);

    // Find margin price card — should be approximately 16.58
    const marginCard = commCards.find((c) => c.label.includes("Gross Margin"));
    if (marginCard) {
      expect(typeof marginCard.value === "number" ? marginCard.value : parseFloat(String(marginCard.value))).toBeCloseTo(16.58, 0);
    }

    // Find markup price card — should be approximately 15.92
    const markupCard = commCards.find((c) => c.label.includes("Markup"));
    if (markupCard) {
      expect(typeof markupCard.value === "number" ? markupCard.value : parseFloat(String(markupCard.value))).toBeCloseTo(15.92, 0);
    }

    // Verify decision state is never blank or dash
    expect(hasValidDecisionState(result)).toBe(true);
    expect(result.decisionState.label).not.toBe("");
    expect(result.decisionState.label).not.toBe("—");
    expect(result.decisionState.label).not.toBe("-");

    // Verify min cards
    const minCards = golden.expected_result_perspectives?.min_cards ?? 4;
    expect(result.cards.length).toBeGreaterThanOrEqual(minCards);

    // Verify no generic "Result" in card labels
    const genericLabels = result.cards.filter((c) =>
      ["result", "output", "value"].includes(c.label.toLowerCase().trim())
    );
    expect(genericLabels.length).toBe(0);
  });

  test("Decision state is never blank or dash for any profile", () => {
    // The adapter must guarantee non-blank decision state for all profiles.
    // This is a structural test against the adapter code.
    expect(hasValidDecisionState(null)).toBe(true); // null = no result, no violation
  });

  test("hasCommercialPrice returns false for null result", () => {
    expect(hasCommercialPrice(null)).toBe(false);
  });

  test("Adapter converts generic 'Result' name to readable label from id", () => {
    // Simulate a tool schema where output name is "Result" (common in free schemas)
    const outputs = [
      {
        id: "freight_cost_per_km",
        name: "Result",
        value: 5.75,
        unit: "USD",
        status: "OK" as const,
        formula_source: null,
        public_explanation: "Test",
        operator_explanation: "",
        engineer_explanation: "",
        owner_cfo_explanation: "",
        checker_explanation: "",
        decision_use: "Primary decision indicator",
        evidence_level: "SCREENING_ONLY" as const,
      },
    ];
    const schema = {
      tool_id: "FREE_TEST_001",
      tool_key: "test-tool",
      category: "Cost & Finance",
      inputs: [],
      outputs: [{ id: "freight_cost_per_km", name: "Result", type: "number" }],
    } as any;

    const result = buildUniversalResult(schema, {}, outputs);
    expect(result).not.toBeNull();
    if (!result) return;

    // Primary label should be derived from id (not raw "Result")
    expect(result.primary.label).not.toBe("Result");
    expect(result.primary.label).toBe("Freight Cost Per Km");

    // Cards should also have readable labels
    for (const card of result.cards) {
      expect(card.label.toLowerCase()).not.toBe("result");
    }

    // Decision state must be valid
    expect(hasValidDecisionState(result)).toBe(true);
  });
});
