/**
 * Phase 5H-D-D — free-sector batch2 metadata hygiene (remaining blocked contracts).
 */

import { describe, expect, test } from "vitest";
import { buildOntologyDraftFromFormulaContract } from "@/lib/features/formula-governance/calculation-ontology/contract-ontology-bridge";
import { buildOntologyDraftWithProductionSource } from "@/lib/features/formula-governance/calculation-ontology/production-source-reference";
import { getFormulaContractBySlug } from "@/lib/features/formula-governance/contracts";
import { runBatchInputDesignAudit } from "@/lib/features/formula-governance/input-design-audit/batch-input-design-audit";
import { FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts";
import { getAnyProductionFormulaLocator } from "@/lib/features/formula-governance/oracle/production-formula-locator";

const FREE_SECTOR_BATCH2_METADATA_BATCH = [
  "electrical-labor-estimator",
  "lawn-care-cost-check",
  "repair-time-vs-price-check",
  "print-job-cost-check",
  "plumbing-job-margin-verdict",
  "cabinet-cost-estimator",
  "roofing-square-cost-check",
  "laser-cutting-time-check",
] as const;

const EXTRA_BLOCKED_METADATA_BATCH = [
  "auto-shop-margin-leak-detector",
  "3d-print-cost-check",
] as const;

describe("free sector batch2 metadata hygiene (Phase 5H-D-D)", () => {
  test("target batch contracts declare Production assumption line", () => {
    for (const slug of FREE_SECTOR_BATCH2_METADATA_BATCH) {
      const contract = getFormulaContractBySlug(slug);
      expect(contract?.assumptions.some((line) => line.startsWith("Production:"))).toBe(true);
    }
  });

  test("target batch contracts have limitations and future extensions coverage", () => {
    for (const slug of FREE_SECTOR_BATCH2_METADATA_BATCH) {
      const contract = getFormulaContractBySlug(slug)!;

      expect((contract.warningPolicy?.modelLimitations.length ?? 0) > 0).toBe(true);
      expect((contract.warningPolicy?.futureExtensions.length ?? 0) > 0).toBe(true);
      expect((contract.warningPolicy?.acceptedAssumptions.length ?? 0) > 0).toBe(true);
    }
  });

  test("target batch contracts have dimensional or purpose validation metadata", () => {
    for (const slug of FREE_SECTOR_BATCH2_METADATA_BATCH) {
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
    for (const slug of FREE_SECTOR_BATCH2_METADATA_BATCH) {
      const contract = getFormulaContractBySlug(slug)!;
      const draft = buildOntologyDraftFromFormulaContract(contract);
      const withSource = buildOntologyDraftWithProductionSource(slug, draft);

      expect(getAnyProductionFormulaLocator(slug)).toBeDefined();
      expect(draft.blockers.some((blocker) => blocker.includes("Production:"))).toBe(false);
      expect(draft.blockers.some((blocker) => blocker.includes("target output"))).toBe(false);
      expect(withSource.blockers).toHaveLength(0);
    }
  });

  test("extra blocked contracts clear target output blockers", () => {
    for (const slug of EXTRA_BLOCKED_METADATA_BATCH) {
      const contract = getFormulaContractBySlug(slug)!;
      const draft = buildOntologyDraftFromFormulaContract(contract);

      expect(draft.blockers.some((blocker) => blocker.includes("target output"))).toBe(false);
    }
  });

  test("target batch contracts are not blocked in input design audit", () => {
    const result = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });

    for (const slug of [...FREE_SECTOR_BATCH2_METADATA_BATCH, ...EXTRA_BLOCKED_METADATA_BATCH]) {
      const summary = result.summaries.find((entry) => entry.slug === slug);
      expect(summary?.alignmentStatus).not.toBe("blocked");
      expect(summary?.status).not.toBe("blocked");
    }

    expect(result.blocked).toBeGreaterThanOrEqual(0);
  });
});
