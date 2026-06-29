/**
 * Phase 5H-D-C — food / margin / welding / sample / HVAC batch metadata hygiene.
 */

import { describe, expect, test } from "vitest";
import { buildOntologyDraftFromFormulaContract } from "@/lib/formula-governance/calculation-ontology/contract-ontology-bridge";
import { buildOntologyDraftWithProductionSource } from "@/lib/formula-governance/calculation-ontology/production-source-reference";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { runBatchInputDesignAudit } from "@/lib/formula-governance/input-design-audit/batch-input-design-audit";
import { FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts";
import { getAnyProductionFormulaLocator } from "@/lib/formula-governance/oracle/production-formula-locator";

const FOOD_MARGIN_WELDING_BATCH = [
  "food-cost-calculator",
  "menu-profit-leak-detector",
  "product-margin-calculator",
  "return-profit-erosion-tool",
  "welding-cost-estimator",
  "welding-bid-risk-analyzer",
  "sample-size-calculator",
  "hvac-tonnage-rule-check",
] as const;

describe("food margin welding HVAC batch metadata hygiene (Phase 5H-D-C)", () => {
  test("target batch contracts declare Production assumption line", () => {
    for (const slug of FOOD_MARGIN_WELDING_BATCH) {
      const contract = getFormulaContractBySlug(slug);
      expect(contract?.assumptions.some((line) => line.startsWith("Production:"))).toBe(true);
    }
  });

  test("target batch contracts have limitations and future extensions coverage", () => {
    for (const slug of FOOD_MARGIN_WELDING_BATCH) {
      const contract = getFormulaContractBySlug(slug)!;

      expect((contract.warningPolicy?.modelLimitations.length ?? 0) > 0).toBe(true);
      expect((contract.warningPolicy?.futureExtensions.length ?? 0) > 0).toBe(true);
      expect((contract.warningPolicy?.acceptedAssumptions.length ?? 0) > 0).toBe(true);
    }
  });

  test("target batch contracts have dimensional or purpose validation metadata", () => {
    for (const slug of FOOD_MARGIN_WELDING_BATCH) {
      const contract = getFormulaContractBySlug(slug)!;
      expect(contract.validationRules.length).toBeGreaterThanOrEqual(3);
      expect(
        contract.validationRules.some(
          (rule) => rule.kind === "dimensional" || rule.kind === "purpose",
        ),
      ).toBe(true);
    }
  });

  test("target batch contracts clear ontology production and target blockers", () => {
    for (const slug of FOOD_MARGIN_WELDING_BATCH) {
      const contract = getFormulaContractBySlug(slug)!;
      const draft = buildOntologyDraftFromFormulaContract(contract);
      const withSource = buildOntologyDraftWithProductionSource(slug, draft);

      expect(getAnyProductionFormulaLocator(slug)).toBeDefined();
      expect(draft.blockers.some((blocker) => blocker.includes("Production:"))).toBe(false);
      expect(draft.blockers.some((blocker) => blocker.includes("target output"))).toBe(false);
      expect(withSource.blockers).toHaveLength(0);
    }
  });

  test("target batch contracts are not blocked in input design audit", () => {
    const result = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });

    for (const slug of FOOD_MARGIN_WELDING_BATCH) {
      const summary = result.summaries.find((entry) => entry.slug === slug);
      expect(summary?.alignmentStatus).not.toBe("blocked");
    }

    expect(result.blocked).toBeGreaterThanOrEqual(0);
  });
});
