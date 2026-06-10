import { describe, expect, test } from "vitest";
import { getPremiumSmartFormDefinition } from "@/lib/smart-form/premium-smart-form-definitions";
import {
  buildCanonicalRuntimeInputs,
  getFormulaContractInputKeys,
  getSmartFormInputKeys,
} from "@/lib/smart-form/runtime-compatibility";
import { getPremiumSmartFormSlugs } from "@/lib/smart-form/premium-smart-form-definitions";

describe("runtime compatibility layer", () => {
  test("every premium tool exposes all contract keys in smart form", () => {
    for (const slug of getPremiumSmartFormSlugs()) {
      const contractKeys = getFormulaContractInputKeys(slug);
      const formKeys = new Set(getSmartFormInputKeys(slug));
      for (const key of contractKeys) {
        expect(formKeys.has(key)).toBe(true);
      }
    }
  });

  test("canonical builder rejects undefined and empty strings", () => {
    const slug = "change-order-impact-analyzer";
    const definition = getPremiumSmartFormDefinition(slug);
    expect(definition).not.toBeNull();
    const result = buildCanonicalRuntimeInputs(
      slug,
      definition!,
      { originalBudget: undefined, changeCost: "", delayDays: 3, crewCostPerDay: 800, targetMargin: 18 },
      "simple",
      definition!.defaultScenarioId,
    );
    expect(result.ok).toBe(false);
  });
});
