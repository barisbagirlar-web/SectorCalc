/**
 * Investor demo system map — Phase 5I-O operating system layer.
 */

import { TOOL_FACTORY_GATES, TOOL_FACTORY_PIPELINE_STAGES } from "@/lib/features/formula-governance/tool-factory-orchestrator/tool-factory-types";
import { ROLLOUT_BATCH_H_LIVE_GOVERNANCE_SLUGS } from "@/components/tools/smart-form/rollout-batch-h-catalog";

export function buildInvestorSystemMap(): Readonly<Record<string, unknown>> {
  return {
    livePilotTools: [...ROLLOUT_BATCH_H_LIVE_GOVERNANCE_SLUGS],
    toolFactoryPipelineStages: [...TOOL_FACTORY_PIPELINE_STAGES],
    automationGates: TOOL_FACTORY_GATES.filter((gate) => gate !== "human_approval_gate" && gate !== "deploy_gate"),
    humanApprovalGates: ["human_approval_gate", "deploy_gate"],
    deploymentSafetyGates: ["secret_gate", "build_gate", "deploy_gate"],
  };
}
