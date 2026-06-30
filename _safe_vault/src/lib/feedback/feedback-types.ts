export type VerificationIssueType =
  | "wrong_result"
  | "missing_input"
  | "unit_issue"
  | "unclear_explanation"
  | "sector_assumption_issue"
  | "improvement_request"
  | "other";

export type VerificationQueueTier = "free" | "premium" | "unknown";

export type VerificationQueueStatus = "open" | "reviewing" | "resolved" | "rejected";

export type VerificationQueueItem = {
  readonly toolSlug: string;
  readonly locale: string;
  readonly tier: VerificationQueueTier;
  readonly region?: string;
  readonly issueType: VerificationIssueType;
  readonly message: string;
  readonly email?: string;
  readonly userId?: string;
  readonly inputSnapshot?: Record<string, string | number | boolean>;
  readonly resultSnapshot?: Record<string, string | number | boolean>;
  readonly status: VerificationQueueStatus;
  readonly createdAt: string;
  readonly pageUrl: string;
  readonly userAgent?: string;
};

export type VerificationQueueSubmitInput = Omit<
  VerificationQueueItem,
  "status" | "createdAt"
> & {
  readonly honeypot?: string;
};

export const VERIFICATION_QUEUE_COLLECTION = "verification_queue";

export const VERIFICATION_ISSUE_TYPES: readonly VerificationIssueType[] = [
  "wrong_result",
  "missing_input",
  "unit_issue",
  "unclear_explanation",
  "sector_assumption_issue",
  "improvement_request",
  "other",
];

export const VERIFICATION_MESSAGE_MIN_LENGTH = 10;
export const VERIFICATION_MESSAGE_MAX_LENGTH = 2000;
export const VERIFICATION_SNAPSHOT_MAX_KEYS = 40;
export const VERIFICATION_SNAPSHOT_VALUE_MAX_LENGTH = 500;
