/**
 * Human approval record factory — Phase 5I-G default pending.
 */

import type {
  HumanApprovalRecord,
  HumanApprovalScope,
} from "@/lib/formula-governance/tool-factory-orchestrator/human-approval/human-approval-types";

export const DEFAULT_FORBIDDEN_OPERATIONS = [
  "modify_calculators",
  "modify_tools_production_behavior",
  "modify_app_routes",
  "modify_firebase_config",
  "modify_deploy_config",
  "modify_auth_pricing_mail",
  "execute_deploy_command",
] as const;

export function buildDefaultHumanApprovalRecord(input: {
  readonly toolSlug: string;
  readonly linkedPlanId: string;
  readonly linkedPatchId?: string | null;
  readonly approvalScope?: HumanApprovalScope;
  readonly expiresAt?: string | null;
}): HumanApprovalRecord {
  return {
    approvedBy: null,
    approvedAt: null,
    approvalScope: input.approvalScope ?? "patch_plan",
    linkedPlanId: input.linkedPlanId,
    linkedPatchId: input.linkedPatchId ?? null,
    linkedToolSlug: input.toolSlug,
    allowedOperations: ["dry_run_review", "audit_verification"],
    forbiddenOperations: [...DEFAULT_FORBIDDEN_OPERATIONS],
    expiresAt: input.expiresAt ?? null,
    status: "pending",
    notes: "Awaiting human approval — Phase 5I-G gate only.",
  };
}

export function buildApprovedHumanApprovalRecord(
  record: HumanApprovalRecord,
  input: {
    readonly approvedBy: string;
    readonly approvedAt: string;
    readonly expiresAt: string;
    readonly notes?: string;
  },
): HumanApprovalRecord {
  return {
    ...record,
    approvedBy: input.approvedBy,
    approvedAt: input.approvedAt,
    expiresAt: input.expiresAt,
    status: "approved",
    notes: input.notes ?? "Human approval granted for deploy-ready gate evaluation.",
  };
}

export function isApprovalExpired(record: HumanApprovalRecord, now: Date = new Date()): boolean {
  if (!record.expiresAt) {
    return false;
  }
  return new Date(record.expiresAt).getTime() < now.getTime();
}
