/**
 * Phase 5H-D-B - next input audit batch metadata and locator hygiene.
 */

import { describe, expect, test } from "vitest";
import { buildOntologyDraftFromFormulaContract } from "@/lib/features/formula-governance/calculation-ontology/contract-ontology-bridge";
import { buildOntologyDraftWithProductionSource } from "@/lib/features/formula-governance/calculation-ontology/production-source-reference";
import { getFormulaContractBySlug } from "@/lib/features/formula-governance/contracts";
import { getAnyProductionFormulaLocator } from "@/lib/features/formula-governance/oracle/production-formula-locator";

const NEXT_INPUT_AUDIT_BATCH = [
  "rent-vs-buy-calculator",
  "salary-cost-calculator",
  "cash-flow-gap-calculator",
  "machine-time-calculator",
  "project-cost-calculator",
  "change-order-impact-analyzer",
  "cleaning-cost-calculator",
  "office-cleaning-bid-optimizer",
] as const;

describe("next input audit batch metadata hygiene (Phase 5H-D-B)", () => {
  test("target batch contracts declare Production assumption line", () => {
    for (const slug of NEXT_INPUT_AUDIT_BATCH) {
      const contract = getFormulaContractBySlug(slug);
      expect(contract?.assumptions.some((line) => line.startsWith("Production:"))).toBe(true);
    }
  });

  test("target batch contracts have limitations and future extensions coverage", () => {
    for (const slug of NEXT_INPUT_AUDIT_BATCH) {
      const contract = getFormulaContractBySlug(slug)!;

      const hasLimitations =
        contract.assumptions.some((line) => line.toLowerCase().includes("limitation")) ||
        (contract.warningPolicy?.modelLimitations.length ?? 0) > 0;
      expect(hasLimitations).toBe(true);

      const hasFutureOrAccepted =
        contract.assumptions.some((line) => line.toLowerCase().includes("future extension")) ||
        (contract.warningPolicy?.futureExtensions.length ?? 0) > 0 ||
        (contract.warningPolicy?.acceptedAssumptions.length ?? 0) > 0 ||
        contract.assumptions.some((line) => line.includes("Governance ontology target"));
      expect(hasFutureOrAccepted).toBe(true);
    }
  });

  test("target batch contracts have dimensional or purpose validation metadata", () => {
    for (const slug of NEXT_INPUT_AUDIT_BATCH) {
      const contract = getFormulaContractBySlug(slug)!;
      expect(contract.validationRules.length).toBeGreaterThanOrEqual(3);
      expect(
        contract.validationRules.some(
          (rule) => rule.kind === "dimensional" || rule.kind === "purpose",
        ),
      ).toBe(true);
    }
  });

  test("rent-vs-buy production formula locator is registered", () => {
    const locator = getAnyProductionFormulaLocator("rent-vs-buy-calculator");
    expect(locator).toBeDefined();
    expect(locator?.productionFilePath).toContain("free-traffic-calculators.ts");
    expect(locator?.comparisonWired).toBe(true);
  });

  test("rent-vs-buy clears production locator blocker in ontology pipeline", () => {
    const contract = getFormulaContractBySlug("rent-vs-buy-calculator")!;
    const draft = buildOntologyDraftFromFormulaContract(contract);
    const withSource = buildOntologyDraftWithProductionSource("rent-vs-buy-calculator", draft);

    expect(draft.blockers).toHaveLength(0);
    expect(withSource.blockers).toHaveLength(0);
    expect(withSource.productionSource?.slug).toBe("rent-vs-buy-calculator");
  });

  test("batch contracts with locators clear ontology production blockers", () => {
    const locatorSlugs = [
      "salary-cost-calculator",
      "cash-flow-gap-calculator",
      "machine-time-calculator",
      "project-cost-calculator",
      "change-order-impact-analyzer",
      "cleaning-cost-calculator",
      "office-cleaning-bid-optimizer",
    ] as const;

    for (const slug of locatorSlugs) {
      const contract = getFormulaContractBySlug(slug)!;
      const draft = buildOntologyDraftFromFormulaContract(contract);
      const withSource = buildOntologyDraftWithProductionSource(slug, draft);

      expect(getAnyProductionFormulaLocator(slug)).toBeDefined();
      expect(draft.blockers.some((blocker) => blocker.includes("Production:"))).toBe(false);
      expect(withSource.blockers.some((blocker) => blocker.includes("Production:"))).toBe(false);
    }
  });
});
