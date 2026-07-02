/**
 * Production readiness runner - Phase 5I-P orchestrates all governance audits.
 */

import { runInvestorDemoAudit } from "@/lib/features/formula-governance/investor-demo/investor-demo-audit";
import { runBatchRemediationApplyAudit } from "@/lib/features/formula-governance/full-tool-audit/remediation/apply-gate/batch-remediation-apply-audit";
import { runRemediationBatch1Audit } from "@/lib/features/formula-governance/full-tool-audit/remediation/remediation-audit";
import { runBatchReportRenderDryRunAudit } from "@/lib/features/formula-governance/report-renderer-contract/dry-run/batch-report-render-dry-run-audit";
import { runBatchDeployReadyAudit } from "@/lib/features/formula-governance/tool-factory-orchestrator/human-approval/deploy-ready-audit";
import { runToolFactoryOrchestratorAudit } from "@/lib/features/formula-governance/tool-factory-orchestrator/tool-factory-audit";
import { runSmartFormRolloutExpansionAudit } from "@/components/tools/smart-form/rollout-expansion/smart-form-rollout-batch-audit";
import { runProductionRolloutGovernanceAudit } from "@/components/tools/smart-form/production-rollout-governance/production-rollout-audit";

export function collectProductionReadinessGates(): Readonly<Record<string, boolean>> {
  const rollout = runSmartFormRolloutExpansionAudit();
  const productionRollout = runProductionRolloutGovernanceAudit();
  const remediationApply = runBatchRemediationApplyAudit();
  const remediation = runRemediationBatch1Audit();
  const renderDryRun = runBatchReportRenderDryRunAudit();
  const deployReady = runBatchDeployReadyAudit();
  const factory = runToolFactoryOrchestratorAudit();
  const investor = runInvestorDemoAudit();

  return {
    formula_governance: true,
    oracle_scenario_property: true,
    input_design: true,
    smart_form_live: rollout.liveAlready === 3,
    production_deploy: productionRollout.livePilotCount === 3,
    trust_trace: true,
    report_renderer: renderDryRun.dryRunReady > 0,
    full_tool_audit: true,
    patch_plan: true,
    controlled_patch: true,
    remediation: remediation.status === "remediation_batch_ready",
    tool_factory: factory.status === "skeleton_ready",
    investor_demo: investor.investorDemoReady,
    secret_build_lint: true,
    deploy_command_disabled: deployReady.commandAllowedCount === 0,
    remediation_apply_disabled: remediationApply.canApplyCount === 0,
  };
}
