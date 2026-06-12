export type VerificationIssueType =
  | "wrong-result"
  | "formula-suggestion"
  | "unit-error"
  | "translation-error"
  | "other";

export type VerificationQueueStatus = "open" | "reviewing" | "resolved" | "rejected";

export type VerificationQueueItem = {
  readonly toolSlug: string;
  readonly locale: string;
  readonly region?: string;
  readonly issueType: VerificationIssueType;
  readonly message: string;
  readonly email?: string;
  readonly inputSnapshot?: Record<string, unknown>;
  readonly resultSnapshot?: Record<string, unknown>;
  readonly status: VerificationQueueStatus;
  readonly createdAt: string;
  readonly pageUrl: string;
  readonly userAgent?: string;
};

export type VerificationQueueSubmitInput = Omit<VerificationQueueItem, "status" | "createdAt"> & {
  readonly honeypot?: string;
};

export const VERIFICATION_QUEUE_COLLECTION = "verification_queue";

export const VERIFICATION_ISSUE_TYPES: readonly VerificationIssueType[] = [
  "wrong-result",
  "formula-suggestion",
  "unit-error",
  "translation-error",
  "other",
];
