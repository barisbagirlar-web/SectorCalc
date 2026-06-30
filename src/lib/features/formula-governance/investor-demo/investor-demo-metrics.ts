/**
 * Investor demo metrics — Phase 5I-O coverage signals.
 */

import { FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts";
import { runFullExistingToolAudit } from "@/lib/features/formula-governance/full-tool-audit/full-tool-audit-runner";
import { ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS } from "@/lib/features/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";
import { runBatchTrustTraceAudit } from "@/lib/features/formula-governance/trust-trace-report/batch-trust-trace-audit";
import { runToolFactoryOrchestratorAudit } from "@/lib/features/formula-governance/tool-factory-orchestrator/tool-factory-audit";

export function collectInvestorDemoMetrics(): Readonly<Record<string, number>> {
  const fullAudit = runFullExistingToolAudit(FORMULA_CONTRACTS);
  const trustAudit = runBatchTrustTraceAudit({ contracts: FORMULA_CONTRACTS });
  const factoryAudit = runToolFactoryOrchestratorAudit();

  return {
    formulaGovernanceCoverage: FORMULA_CONTRACTS.length,
    smartFormCoverage: ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS.length,
    trustTraceCoverage: trustAudit.trustTraceReady,
    fullAuditCoverage: fullAudit.items.length,
    toolFactoryPipelineStages: factoryAudit.pipelineStageCount,
    toolFactoryGateCount: factoryAudit.gateCount,
  };
}
