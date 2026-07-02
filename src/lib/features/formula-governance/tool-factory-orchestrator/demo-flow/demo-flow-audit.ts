/**
 * Tool factory demo flow audit - Phase 5I-N read-only.
 */

import { runToolFactoryDemoFlow } from "@/lib/features/formula-governance/tool-factory-orchestrator/demo-flow/demo-flow-runner";
import type { ToolFactoryDemoFlowResult } from "@/lib/features/formula-governance/tool-factory-orchestrator/demo-flow/demo-flow-types";

export function runToolFactoryDemoFlowAudit(): ToolFactoryDemoFlowResult {
  return runToolFactoryDemoFlow();
}

export function formatToolFactoryDemoFlowReport(result: ToolFactoryDemoFlowResult): string {
  return [
    "Tool Factory Demo Flow Audit",
    `Demo flow ready: ${result.demoFlowReady}`,
    `Completed stages: ${result.completedStages}/${result.stages.length}`,
    `Human approval required: ${result.humanApprovalRequired}`,
    `Deploy command disabled: ${result.deployCommandDisabled}`,
    "",
    "Blocked stages:",
    ...result.blockedStages.map((stage) => `- ${stage}`),
  ].join("\n");
}
