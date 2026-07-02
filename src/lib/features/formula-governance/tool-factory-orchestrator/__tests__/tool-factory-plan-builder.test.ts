/**
 * Tool factory plan builder tests - Phase 5I-A.
 */

import { describe, expect, test } from "vitest";
import {
  buildDraftToolFactoryPlan,
  SAMPLE_TOOL_FACTORY_IDEA,
} from "@/lib/features/formula-governance/tool-factory-orchestrator/tool-factory-fixtures";
import { runToolFactoryOrchestratorAudit } from "@/lib/features/formula-governance/tool-factory-orchestrator/tool-factory-audit";
import { buildToolFactoryPlan } from "@/lib/features/formula-governance/tool-factory-orchestrator/tool-factory-plan-builder";
import { TOOL_FACTORY_GATES } from "@/lib/features/formula-governance/tool-factory-orchestrator/tool-factory-types";

describe("tool factory plan builder - Phase 5I-A", () => {
  test("deterministic fixture plan is produced", () => {
    const first = buildDraftToolFactoryPlan();
    const second = buildDraftToolFactoryPlan();

    expect(first.idea).toEqual(second.idea);
    expect(first.gates).toEqual([...TOOL_FACTORY_GATES]);
  });

  test("draft plan includes sector and goal from idea", () => {
    const plan = buildToolFactoryPlan({ idea: SAMPLE_TOOL_FACTORY_IDEA });
    expect(plan.sector).toBe("hvac");
    expect(plan.calculationGoal).toContain("margin");
  });

  test("skeleton audit reports skeleton_ready for orchestrator infrastructure", () => {
    const audit = runToolFactoryOrchestratorAudit();
    expect(audit.autoDeployEnabled).toBe(false);
    expect(audit.humanApprovalRequired).toBe(true);
    expect(audit.pipelineStageCount).toBe(14);
    expect(audit.gateCount).toBe(11);
    expect(audit.status).toBe("skeleton_ready");
  });
});
