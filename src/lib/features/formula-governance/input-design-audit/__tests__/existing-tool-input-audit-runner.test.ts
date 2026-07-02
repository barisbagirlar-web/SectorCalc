/**
 * Phase 5H-C - existing tool input audit runner tests.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/features/formula-governance/contracts";
import { auditExistingToolInputDesign } from "@/lib/features/formula-governance/input-design-audit/existing-tool-input-audit-runner";

const ROOFING_SLUG = "roofing-contract-margin-guard";
const CNC_SLUG = "cnc-quote-risk-analyzer";

describe("auditExistingToolInputDesign", () => {
  test("produces roofing audit result", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const result = auditExistingToolInputDesign({ contract });

    expect(result.slug).toBe(ROOFING_SLUG);
    expect(result.inputSufficiencyScore).toBeGreaterThan(0);
    expect(result.professionalDepthScore).toBeGreaterThan(0);
  });

  test("returns roofing input sufficiency score", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const result = auditExistingToolInputDesign({ contract });

    expect(typeof result.inputSufficiencyScore).toBe("number");
    expect(result.inputSufficiencyScore).toBeGreaterThanOrEqual(50);
  });

  test("carries roofing alignment summary", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const result = auditExistingToolInputDesign({ contract });

    expect(result.alignmentStatus).toBe("needs_review");
    expect(result.migrationRiskScore).toBeGreaterThan(0);
  });

  test("CNC clears production metadata blocker and returns usable audit", () => {
    const contract = getFormulaContractBySlug(CNC_SLUG)!;
    const result = auditExistingToolInputDesign({ contract });

    expect(result.status).toBe("usable");
    expect(result.blockers.some((blocker) => blocker.includes("Production:"))).toBe(false);
    expect(result.alignmentStatus).toBe("needs_review");
    expect(result.recommendedPatchLevel).not.toBe("blocked");
  });

  test("contract without fixture produces contract-only audit", () => {
    const contract = getFormulaContractBySlug("rent-vs-buy-calculator")!;
    const result = auditExistingToolInputDesign({ contract });

    expect(result.alignmentStatus).toBe("contract_only_analysis");
    expect(result.warnings.some((warning) => warning.includes("contract-only"))).toBe(true);
  });

  test("does not import or execute production calculators", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/lib/formula-governance/input-design-audit/existing-tool-input-audit-runner.ts",
      ),
      "utf8",
    );

    expect(source).not.toContain("calculatePremiumDecisionReport");
    expect(source).not.toContain("premium-decision-engine");
    expect(source).toContain("runRequirementEngineForContract");
  });
});
