/**
 * Tool factory demo flow types - Phase 5I-N deterministic fixture.
 */

import type { ToolFactoryPipelineStage } from "@/lib/features/formula-governance/tool-factory-orchestrator/tool-factory-types";

export type DemoFlowStageResult = {
  readonly stage: ToolFactoryPipelineStage;
  readonly completed: boolean;
  readonly blockers: readonly string[];
};

export type ToolFactoryDemoFlowResult = {
  readonly demoFlowReady: boolean;
  readonly completedStages: number;
  readonly blockedStages: readonly string[];
  readonly humanApprovalRequired: true;
  readonly deployCommandDisabled: true;
  readonly stages: readonly DemoFlowStageResult[];
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
};
