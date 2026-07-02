/**
 * Human approval gate - Phase 5I-G scope and forbidden operation validation.
 */

import {
  isApprovalExpired,
} from "@/lib/features/formula-governance/tool-factory-orchestrator/human-approval/human-approval-record";
import type {
  HumanApprovalRecord,
  HumanApprovalScope,
} from "@/lib/features/formula-governance/tool-factory-orchestrator/human-approval/human-approval-types";

const FORBIDDEN_OPERATION_PATTERNS = [
  "modify_calculators",
  "modify_firebase_config",
  "modify_deploy_config",
  "modify_auth_pricing_mail",
  "execute_deploy_command",
] as const;

export function validateHumanApprovalRecord(
  record: HumanApprovalRecord,
  expectedScope: HumanApprovalScope,
): string[] {
  const blockers: string[] = [];

  if (record.approvalScope !== expectedScope) {
    blockers.push(
      `${record.linkedToolSlug}: wrong approval scope ${record.approvalScope}, expected ${expectedScope}.`,
    );
  }

  if (isApprovalExpired(record)) {
    blockers.push(`${record.linkedToolSlug}: human approval expired.`);
  }

  if (record.status === "rejected" || record.status === "blocked") {
    blockers.push(`${record.linkedToolSlug}: human approval status ${record.status}.`);
  }

  for (const forbidden of FORBIDDEN_OPERATION_PATTERNS) {
    if (!record.forbiddenOperations.includes(forbidden)) {
      blockers.push(`${record.linkedToolSlug}: forbidden operation ${forbidden} must be listed.`);
    }
  }

  for (const operation of record.allowedOperations) {
    if ((FORBIDDEN_OPERATION_PATTERNS as readonly string[]).includes(operation)) {
      blockers.push(`${record.linkedToolSlug}: forbidden operation listed as allowed: ${operation}.`);
    }
  }

  return blockers;
}

export function resolveEffectiveApprovalStatus(
  record: HumanApprovalRecord,
): HumanApprovalRecord["status"] {
  if (isApprovalExpired(record)) {
    return "expired";
  }
  return record.status;
}
