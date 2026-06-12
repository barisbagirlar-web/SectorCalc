import type { RepairSuggestionOutput } from "./repair-schema";

export type RepairScope =
  | "formula"
  | "category"
  | "locale"
  | "llm-seo"
  | "public-status"
  | "build"
  | "typescript"
  | "lint"
  | "security"
  | "payment"
  | "auth"
  | "unknown";

export type RepairModelTier = "flash" | "pro" | "human-review";

export type RepairOutcomeStatus = "success" | "failure";

/**
 * Persisted repair outcome row. Intentionally minimal.
 * Never store raw output, env values, API keys or full logs here.
 */
export type RepairHistoryEntry = {
  repairId: string;
  fingerprint: string;
  scope: string;
  command: string;
  modelTier: "flash" | "pro" | "human-review";
  modelName: string | null;
  outcome: RepairOutcomeStatus;
  deterministicGate: "pass" | "fail" | "not-run";
  /** Short sanitized reason only. No secrets or full build logs. */
  failureReason?: string;
  createdAt: string;
};

export type RepairHistorySummary = {
  fingerprint: string;
  flashAttempts: number;
  flashFailures: number;
  flashSuccesses: number;
  proAttempts: number;
  proFailures: number;
  proSuccesses: number;
  humanReviewCount: number;
  lastOutcome?: RepairOutcomeStatus;
};

export type RepairRoutingDecision = {
  tier: RepairModelTier;
  model: string | null;
  reason: string;
  requiresHumanReview: boolean;
  deterministicGateRequired: true;
  fingerprint: string;
  historySummary: RepairHistorySummary;
};

export type RepairAnalysisResult = {
  repairId: string;
  fingerprint: string;
  suggestion: RepairSuggestionOutput;
};

export type RepairRequestPayload = {
  scope: RepairScope | string;
  command: string;
  output: string;
  changedFiles?: string[];
  retryCount?: number;
};
