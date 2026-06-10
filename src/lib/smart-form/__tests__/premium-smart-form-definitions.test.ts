import { describe, expect, test } from "vitest";
import {
  assertPremiumSmartFormCoverage,
  getPremiumSmartFormDefinition,
  getPremiumSmartFormSlugs,
} from "@/lib/smart-form/premium-smart-form-definitions";
import {
  assertAllPremiumSmartFormsRuntimeCompatible,
  buildCanonicalRuntimeInputs,
  getFormulaContractInputKeys,
  validateSmartFormRuntimeCompatibility,
} from "@/lib/smart-form/runtime-compatibility";
import { listPremiumContractSlugs } from "@/lib/tools/premium-decision-engine";

describe("premium smart form definitions registry", () => {
  test("returns 27 premium slugs", () => {
    expect(getPremiumSmartFormSlugs().length).toBe(27);
    expect(listPremiumContractSlugs().length).toBe(27);
  });

  test("registry matches expected premium slug list", () => {
    assertPremiumSmartFormCoverage(listPremiumContractSlugs());
  });

  test("each tool has at least 2 scenarios", () => {
    for (const slug of getPremiumSmartFormSlugs()) {
      const definition = getPremiumSmartFormDefinition(slug);
      expect(definition?.scenarios.length).toBeGreaterThanOrEqual(2);
    }
  });

  test("each tool has simple and advanced fields and required inputs", () => {
    for (const slug of getPremiumSmartFormSlugs()) {
      const definition = getPremiumSmartFormDefinition(slug);
      expect(definition).not.toBeNull();
      expect(definition!.inputs.some((input) => input.required)).toBe(true);
      expect(definition!.inputs.some((input) => input.mode !== "advanced")).toBe(true);
      expect(definition!.inputs.some((input) => input.mode === "advanced")).toBe(true);
    }
  });

  test("all premium smart forms pass runtime compatibility registry audit", () => {
    expect(() => assertAllPremiumSmartFormsRuntimeCompatible()).not.toThrow();
  });
});

describe("premium smart form runtime compatibility", () => {
  test("blocks missing required CNC inputs", () => {
    const definition = getPremiumSmartFormDefinition("cnc-quote-risk-analyzer");
    expect(definition).not.toBeNull();
    const result = validateSmartFormRuntimeCompatibility(
      "cnc-quote-risk-analyzer",
      definition!,
      {
        setupTime: 30,
        cycleTime: 5,
        quantity: 10,
        machineRate: 75,
        riskMargin: 15,
      },
      "simple",
      "quick_quote_check",
    );
    expect(result.ok).toBe(false);
  });

  test("blocks hidden contract-required fields in simple mode when advanced-only", () => {
    const definition = getPremiumSmartFormDefinition("cnc-quote-risk-analyzer");
    expect(definition).not.toBeNull();
    const hiddenRequired = definition!.inputs
      .filter((input) => input.mode === "advanced" && input.required)
      .map((input) => input.key);
    const contractRequired = getFormulaContractInputKeys("cnc-quote-risk-analyzer");
    const advancedRequiredInContract = hiddenRequired.filter((key) => contractRequired.includes(key));
    if (advancedRequiredInContract.length === 0) {
      return;
    }
    const filled: Record<string, number> = {
      setupTime: 30,
      cycleTime: 5,
      quantity: 10,
      machineRate: 75,
      riskMargin: 15,
    };
    const result = validateSmartFormRuntimeCompatibility(
      "cnc-quote-risk-analyzer",
      definition!,
      filled,
      "simple",
      "quick_quote_check",
    );
    expect(result.ok).toBe(false);
  });

  test("does not pass NaN or empty values to canonical runtime inputs", () => {
    const definition = getPremiumSmartFormDefinition("welding-bid-risk-analyzer");
    expect(definition).not.toBeNull();
    const result = buildCanonicalRuntimeInputs(
      "welding-bid-risk-analyzer",
      definition!,
      {
        materialCost: "",
        laborHours: Number.NaN,
        laborRate: 50,
        fitUpHours: 1,
        targetMargin: 25,
        gasConsumableCost: 20,
        reworkRiskPercent: 10,
      },
      "advanced",
      "field_repair",
    );
    expect(result.ok).toBe(false);
  });
});
