/**
 * Remediation batch builder tests — Phase 5I-D.
 */

import { describe, expect, test } from "vitest";
import { FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts";
import { runFullExistingToolAudit } from "@/lib/formula-governance/full-tool-audit/full-tool-audit-runner";
import { buildRemediationBatch1 } from "@/lib/formula-governance/full-tool-audit/remediation/remediation-batch-builder";
import { runRemediationBatch1Audit } from "@/lib/formula-governance/full-tool-audit/remediation/remediation-audit";
import { runBatchPatchPlanAudit } from "@/lib/formula-governance/tool-factory-orchestrator/patch-plan/batch-patch-plan-audit";
import { runBatchTrustTraceAudit } from "@/lib/formula-governance/trust-trace-report/batch-trust-trace-audit";
import { runBatchTrustTraceExportAudit } from "@/lib/formula-governance/trust-trace-report/export-contract/batch-trust-trace-export-audit";
import {
  ROLLOUT_BATCH_H_PRODUCTION_DEPLOYED_GOVERNANCE_SLUGS,
} from "@/components/tools/smart-form/rollout-batch-h-catalog";

describe("remediation batch builder — Phase 5I-D", () => {
  test("selects max 8 tools", () => {
    const batch = runRemediationBatch1Audit(process.cwd());
    expect(batch.selectedTools.length).toBeLessThanOrEqual(8);
  });

  test("excludes live smart form pilots", () => {
    const batch = runRemediationBatch1Audit(process.cwd());

    for (const slug of ROLLOUT_BATCH_H_PRODUCTION_DEPLOYED_GOVERNANCE_SLUGS) {
      expect(batch.selectedTools).not.toContain(slug);
    }
  });

  test("requires human approval and forbids calculators/**", () => {
    const batch = runRemediationBatch1Audit(process.cwd());
    expect(batch.requiresHumanApproval).toBe(true);
    expect(batch.canRunWithoutCalculatorChange).toBe(true);

    for (const action of batch.actions) {
      expect(action.forbiddenFiles).toContain("src/lib/calculators/**");
    }
  });

  test("deterministic batch order", () => {
    const first = runRemediationBatch1Audit(process.cwd());
    const second = runRemediationBatch1Audit(process.cwd());
    expect(first.selectedTools).toEqual(second.selectedTools);
  });

  test("expected impact is calculated", () => {
    const fullAudit = runFullExistingToolAudit(FORMULA_CONTRACTS, process.cwd());
    const patchAudit = runBatchPatchPlanAudit(fullAudit);
    const trustAudit = runBatchTrustTraceAudit({ contracts: FORMULA_CONTRACTS });
    const exportAudit = runBatchTrustTraceExportAudit(trustAudit.reports);
    const batch = buildRemediationBatch1({
      fullToolAudit: fullAudit,
      patchPlanAudit: patchAudit,
      trustTraceAudit: trustAudit,
      exportAudit,
    });

    expect(batch.expectedImpact).toContain("score lift");
  });
});
