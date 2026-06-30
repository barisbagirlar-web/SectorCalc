/**
 * P3 — Tool feedback & formula objection queue types.
 */

export const FEEDBACK_KINDS = [
  "formula_objection",
  "wrong_result",
  "missing_input",
  "improvement_request",
  "sector_adjustment",
  "data_source_suggestion",
  "usability_issue",
  "other",
] as const;

export type FeedbackKind = (typeof FEEDBACK_KINDS)[number];

export const FEEDBACK_STATUSES = [
  "new",
  "triaged",
  "in_review",
  "accepted",
  "rejected",
  "implemented",
  "closed",
] as const;

export type FeedbackStatus = (typeof FEEDBACK_STATUSES)[number];

export const FEEDBACK_SEVERITIES = ["low", "medium", "high", "critical"] as const;

export type FeedbackSeverity = (typeof FEEDBACK_SEVERITIES)[number];

export const FEEDBACK_SOURCES = [
  "premium_tool",
  "free_tool",
  "smart_form",
  "report",
  "verify",
  "unknown",
] as const;

export type FeedbackSource = (typeof FEEDBACK_SOURCES)[number];

export type FeedbackToolType = "free" | "premium" | "unknown";

export type FeedbackSnapshotValue = number | string | boolean;

export const TOOL_FEEDBACK_COLLECTION = "toolFeedback";

export const FEEDBACK_MESSAGE_MIN_LENGTH = 10;
export const FEEDBACK_MESSAGE_MAX_LENGTH = 2000;
export const FEEDBACK_SNAPSHOT_MAX_KEYS = 40;

export type ToolFeedbackSubmitInput = {
  readonly kind: FeedbackKind | "";
  readonly message: string;
  readonly expectedBehavior?: string;
  readonly actualBehavior?: string;
  readonly sectorContext?: string;
  readonly suggestedFormulaChange?: string;
  readonly suggestedInput?: string;
  readonly dataSourceUrl?: string;
  readonly toolSlug: string;
  readonly toolType: FeedbackToolType;
  readonly locale: string;
  readonly routePath: string;
  readonly source: FeedbackSource;
  readonly formulaVersion?: string;
  readonly formulaContractId?: string;
  readonly calculationHash?: string;
  readonly reportId?: string;
  readonly inputSnapshot?: Readonly<Record<string, FeedbackSnapshotValue>>;
  readonly resultSnapshot?: Readonly<Record<string, FeedbackSnapshotValue>>;
  readonly userId?: string | null;
  readonly userEmail?: string | null;
  readonly sessionId?: string | null;
  readonly companyWebsiteHidden?: string;
};

export type ToolFeedbackDocument = {
  readonly id: string;
  readonly kind: FeedbackKind;
  readonly status: FeedbackStatus;
  readonly severity: FeedbackSeverity;
  readonly source: FeedbackSource;
  readonly toolSlug: string;
  readonly toolType: FeedbackToolType;
  readonly locale: string;
  readonly routePath: string;
  readonly message: string;
  readonly expectedBehavior?: string;
  readonly actualBehavior?: string;
  readonly sectorContext?: string;
  readonly suggestedFormulaChange?: string;
  readonly suggestedInput?: string;
  readonly dataSourceUrl?: string;
  readonly formulaVersion?: string;
  readonly formulaContractId?: string;
  readonly calculationHash?: string;
  readonly reportId?: string;
  readonly inputSnapshot?: Readonly<Record<string, FeedbackSnapshotValue>>;
  readonly resultSnapshot?: Readonly<Record<string, FeedbackSnapshotValue>>;
  readonly userId?: string | null;
  readonly userEmail?: string | null;
  readonly sessionId?: string | null;
  readonly userAgent?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type ToolFeedbackFieldErrors = Partial<
  Record<
    | "kind"
    | "message"
    | "expectedBehavior"
    | "actualBehavior"
    | "sectorContext"
    | "suggestedFormulaChange"
    | "suggestedInput"
    | "dataSourceUrl"
    | "toolSlug"
    | "locale"
    | "routePath"
    | "inputSnapshot"
    | "resultSnapshot"
    | "form",
    string
  >
>;

export type ToolFeedbackSubmitResult = {
  readonly ok: boolean;
  readonly id?: string;
  readonly firestoreSaved?: boolean;
  readonly errors?: ToolFeedbackFieldErrors;
  readonly rateLimited?: boolean;
  readonly honeypot?: boolean;
};
