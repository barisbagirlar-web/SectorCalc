/**
 * Tool factory demo flow fixture - Phase 5I-N deterministic ToolIdea.
 */

import type { ToolFactoryIdea } from "@/lib/features/formula-governance/tool-factory-orchestrator/tool-factory-types";

export const DEMO_TOOL_IDEA: ToolFactoryIdea = {
  title: "Margin Leak Verdict Demo",
  sector: "manufacturing",
  targetUser: "shop owner",
  calculationGoal: "Detect bid margin leak before quote submission",
  notes: "Demo fixture only - no calculator import or LLM formula.",
};
