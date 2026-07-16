/**
 * Canary Release and Controlled Activation
 *
 * Defines activation stages and automatic rollback triggers.
 * Production activation must proceed through each stage sequentially.
 */

export type CanaryStage = 1 | 2 | 3 | 4;

export interface CanaryConfig {
  stage: CanaryStage;
  name: string;
  description: string;
  maxAccounts: number;
  requireAdminApproval: boolean;
  verificationRequired: string[];
}

export const CANARY_STAGES: Record<CanaryStage, CanaryConfig> = {
  1: {
    stage: 1,
    name: "Internal Synthetic",
    description: "Internal synthetic accounts only. No real users.",
    maxAccounts: 5,
    requireAdminApproval: true,
    verificationRequired: [
      "payment",
      "entitlement",
      "queue",
      "processing",
      "output",
      "download",
      "deletion",
      "remediation",
      "monitoring",
      "regression",
    ],
  },
  2: {
    stage: 2,
    name: "Approved Pilot",
    description: "Allowlisted pilot accounts only.",
    maxAccounts: 20,
    requireAdminApproval: true,
    verificationRequired: [
      "payment",
      "entitlement",
      "processing",
      "output",
      "download",
      "deletion",
      "monitoring",
    ],
  },
  3: {
    stage: 3,
    name: "Limited Public",
    description: "Percentage-based or allowlisted product access.",
    maxAccounts: 100,
    requireAdminApproval: false,
    verificationRequired: [
      "cross_tenant_access_check",
      "duplicate_charge_check",
      "corrupted_workbook_check",
    ],
  },
  4: {
    stage: 4,
    name: "Full Public",
    description: "Full public availability.",
    maxAccounts: Infinity,
    requireAdminApproval: false,
    verificationRequired: [
      "regression_check",
    ],
  },
};

export interface AutoRollbackTrigger {
  condition: string;
  threshold: number;
  windowMinutes: number;
  action: "disable_feature" | "pause_payment" | "alert_only";
  severity: "critical" | "high" | "medium";
}

export const AUTO_ROLLBACK_TRIGGERS: AutoRollbackTrigger[] = [
  {
    condition: "cross_tenant_access",
    threshold: 1,
    windowMinutes: 5,
    action: "disable_feature",
    severity: "critical",
  },
  {
    condition: "duplicate_charge",
    threshold: 1,
    windowMinutes: 5,
    action: "disable_feature",
    severity: "critical",
  },
  {
    condition: "corrupted_workbook",
    threshold: 1,
    windowMinutes: 30,
    action: "pause_payment",
    severity: "critical",
  },
  {
    condition: "critical_false_clean",
    threshold: 1,
    windowMinutes: 60,
    action: "pause_payment",
    severity: "critical",
  },
  {
    condition: "silent_row_loss",
    threshold: 1,
    windowMinutes: 60,
    action: "pause_payment",
    severity: "high",
  },
  {
    condition: "output_manifest_mismatch",
    threshold: 1,
    windowMinutes: 60,
    action: "pause_payment",
    severity: "critical",
  },
  {
    condition: "payment_without_entitlement",
    threshold: 1,
    windowMinutes: 30,
    action: "disable_feature",
    severity: "critical",
  },
  {
    condition: "terminal_failure_spike",
    threshold: 5,
    windowMinutes: 60,
    action: "pause_payment",
    severity: "high",
  },
  {
    condition: "source_deletion_failure",
    threshold: 3,
    windowMinutes: 60,
    action: "alert_only",
    severity: "high",
  },
  {
    condition: "secret_exposure",
    threshold: 1,
    windowMinutes: 5,
    action: "disable_feature",
    severity: "critical",
  },
  {
    condition: "live_sha_mismatch",
    threshold: 1,
    windowMinutes: 10,
    action: "disable_feature",
    severity: "critical",
  },
];

export interface CanaryState {
  currentStage: CanaryStage;
  activeAccounts: string[];
  startTime: string;
  verificationResults: Record<string, boolean>;
  autoRollbackActive: boolean;
  rollbackReason: string | null;
}

export function getNextStage(current: CanaryStage): CanaryStage | null {
  if (current >= 4) return null;
  return (current + 1) as CanaryStage;
}

export function shouldAutoRollback(
  trigger: AutoRollbackTrigger,
  incidentCount: number,
  windowMs: number,
): boolean {
  if (incidentCount < trigger.threshold) return false;
  if (windowMs > trigger.windowMinutes * 60 * 1000) return false;
  return true;
}

export function getRollbackActionDescription(trigger: AutoRollbackTrigger): string {
  switch (trigger.action) {
    case "disable_feature":
      return "Set DOCUMENT_INTELLIGENCE_ENABLED=false. Block new upload/checkout. Existing paid jobs continue.";
    case "pause_payment":
      return "Disable checkout endpoint. Existing queued jobs continue processing.";
    case "alert_only":
      return "Send alert to operators. No automatic action taken.";
  }
}
