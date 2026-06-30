/**
 * Patch plan risk classifier tests — Phase 5I-B.
 */

import { describe, expect, test } from "vitest";
import {
  classifyPatchPlanRisk,
  mapRecommendedActionToPatchType,
} from "@/lib/features/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-risk-classifier";

describe("patch plan risk classifier — Phase 5I-B", () => {
  test("maps all recommended actions deterministically", () => {
    expect(mapRecommendedActionToPatchType("metadata_patch")).toBe("metadata_only");
    expect(mapRecommendedActionToPatchType("fixture_ontology")).toBe("fixture_ontology");
    expect(mapRecommendedActionToPatchType("smart_form_patch")).toBe("smart_form_patch");
    expect(mapRecommendedActionToPatchType("trust_trace_patch")).toBe("trust_trace_patch");
    expect(mapRecommendedActionToPatchType("report_layer_patch")).toBe("report_export_contract");
    expect(mapRecommendedActionToPatchType("blocked_manual_review")).toBe("blocked_manual_review");
  });

  test("metadata patch is low risk", () => {
    const risk = classifyPatchPlanRisk(
      { score: 80, blockers: [], recommendedAction: "metadata_patch", oracleStatus: "PASS" },
      "metadata_only",
    );
    expect(risk).toBe("low");
  });

  test("blocked manual review is critical risk", () => {
    const risk = classifyPatchPlanRisk(
      { score: 40, blockers: ["blocked"], recommendedAction: "blocked_manual_review", oracleStatus: "FAIL" },
      "blocked_manual_review",
    );
    expect(risk).toBe("critical");
  });
});
