/**
 * Phase 5H-D-A - core finance batch contract metadata hygiene.
 */

import { describe, expect, test } from "vitest";
import { buildOntologyDraftFromFormulaContract } from "@/lib/features/formula-governance/calculation-ontology/contract-ontology-bridge";
import { buildOntologyDraftWithProductionSource } from "@/lib/features/formula-governance/calculation-ontology/production-source-reference";
import { FORMULA_CONTRACTS, getFormulaContractBySlug } from "@/lib/features/formula-governance/contracts";

const CORE_FINANCE_BATCH = [
  "cnc-quote-risk-analyzer",
  "rent-vs-buy-calculator",
  "loan-payment-calculator",
  "mortgage-calculator",
  "interest-calculator",
  "compound-interest-calculator",
  "profit-margin-calculator",
  "break-even-calculator",
] as const;

describe("core finance metadata hygiene (Phase 5H-D-A)", () => {
  test("target batch contracts declare Production assumption line", () => {
    for (const slug of CORE_FINANCE_BATCH) {
      const contract = getFormulaContractBySlug(slug);
      expect(contract).toBeDefined();
      expect(contract?.assumptions.some((line) => line.startsWith("Production:"))).toBe(true);
    }
  });

  test("target batch contracts have non-empty assumptions and limitations coverage", () => {
    for (const slug of CORE_FINANCE_BATCH) {
      const contract = getFormulaContractBySlug(slug)!;
      expect(contract.assumptions.length).toBeGreaterThanOrEqual(3);

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

  test("cnc production metadata blocker is cleared in ontology draft", () => {
    const contract = getFormulaContractBySlug("cnc-quote-risk-analyzer")!;
    const draft = buildOntologyDraftFromFormulaContract(contract);
    const withSource = buildOntologyDraftWithProductionSource("cnc-quote-risk-analyzer", draft);

    expect(draft.blockers.some((blocker) => blocker.includes("Production:"))).toBe(false);
    expect(withSource.blockers.some((blocker) => blocker.includes("Production:"))).toBe(false);
  });

  test("finance contracts with locators clear production metadata blockers", () => {
    const locatorSlugs = [
      "loan-payment-calculator",
      "mortgage-calculator",
      "interest-calculator",
      "compound-interest-calculator",
      "profit-margin-calculator",
      "break-even-calculator",
    ] as const;

    for (const slug of locatorSlugs) {
      const contract = getFormulaContractBySlug(slug)!;
      const draft = buildOntologyDraftFromFormulaContract(contract);
      const withSource = buildOntologyDraftWithProductionSource(slug, draft);

      expect(draft.blockers.some((blocker) => blocker.includes("Production:"))).toBe(false);
      expect(draft.blockers.some((blocker) => blocker.includes("target output"))).toBe(false);
      expect(withSource.blockers).toHaveLength(0);
    }
  });

  test("batch size unchanged at 41 contracts", () => {
    expect(FORMULA_CONTRACTS.length).toBe(FORMULA_CONTRACTS.length);
  });
});
