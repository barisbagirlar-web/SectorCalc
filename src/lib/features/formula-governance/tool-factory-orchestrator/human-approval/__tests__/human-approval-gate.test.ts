/**
 * Human approval gate tests — Phase 5I-G.
 */

import { describe, expect, test } from "vitest";
import { validateHumanApprovalRecord } from "@/lib/features/formula-governance/tool-factory-orchestrator/human-approval/human-approval-gate";
import {
  buildApprovedHumanApprovalRecord,
  buildDefaultHumanApprovalRecord,
} from "@/lib/features/formula-governance/tool-factory-orchestrator/human-approval/human-approval-record";

describe("human approval gate — Phase 5I-G", () => {
  test("wrong scope is blocked", () => {
    const record = buildDefaultHumanApprovalRecord({
      toolSlug: "scope-tool",
      linkedPlanId: "plan-1",
      approvalScope: "production_deploy",
    });
    const blockers = validateHumanApprovalRecord(record, "patch_plan");
    expect(blockers.some((b) => b.includes("wrong approval scope"))).toBe(true);
  });

  test("expired approval is blocked", () => {
    const record = buildApprovedHumanApprovalRecord(
      buildDefaultHumanApprovalRecord({ toolSlug: "expired-tool", linkedPlanId: "plan-1" }),
      {
        approvedBy: "tester",
        approvedAt: "2020-01-01T00:00:00.000Z",
        expiresAt: "2020-01-02T00:00:00.000Z",
      },
    );
    const blockers = validateHumanApprovalRecord(record, "patch_plan");
    expect(blockers.some((b) => b.includes("expired"))).toBe(true);
  });

  test("forbidden operation in allowed list is blocked", () => {
    const record = {
      ...buildDefaultHumanApprovalRecord({ toolSlug: "forbidden-tool", linkedPlanId: "plan-1" }),
      allowedOperations: ["execute_deploy_command"],
    };
    const blockers = validateHumanApprovalRecord(record, "patch_plan");
    expect(blockers.some((b) => b.includes("forbidden operation listed as allowed"))).toBe(true);
  });
});
