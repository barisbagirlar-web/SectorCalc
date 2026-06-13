/** DeepSeek quality factory — server/script-only types (DSK-0A). */

export type DeepSeekTaskType =
  | "formula_audit"
  | "schema_review"
  | "guide_spec"
  | "content_draft";

export type DeepSeekErrorCode =
  | "missing_api_key"
  | "timeout"
  | "api_error"
  | "invalid_json";

export type DeepSeekTaskConfig = {
  readonly temperature: number;
  readonly maxRetries: number;
};

export const DEEPSEEK_TASK_CONFIG: Readonly<Record<DeepSeekTaskType, DeepSeekTaskConfig>> = {
  formula_audit: { temperature: 0.1, maxRetries: 1 },
  schema_review: { temperature: 0.2, maxRetries: 1 },
  guide_spec: { temperature: 0.4, maxRetries: 1 },
  content_draft: { temperature: 0.5, maxRetries: 1 },
};

export type DeepSeekClientConfig = {
  readonly apiKey: string | undefined;
  readonly model: string;
  readonly timeoutMs: number;
};

export type DeepSeekJsonSuccess<T> = {
  readonly ok: true;
  readonly data: T;
};

export type DeepSeekJsonFailure = {
  readonly ok: false;
  readonly errorCode: DeepSeekErrorCode;
  readonly suggestionUnavailable: true;
  readonly message?: string;
};

export type DeepSeekJsonResult<T> = DeepSeekJsonSuccess<T> | DeepSeekJsonFailure;

export type DeepSeekChatMessage = {
  readonly role: "system" | "user" | "assistant";
  readonly content: string;
};

export type DeepSeekCompletionMeta = {
  readonly finishReason: string | null;
  readonly rawText: string;
};

export type DeepSeekRepairChangeType =
  | "label_fix"
  | "input_schema_fix"
  | "validation_rule"
  | "formula_review"
  | "unit_check"
  | "safe_state";

export type DeepSeekRepairSuggestion = {
  readonly slug: string;
  readonly riskLevel: "low" | "medium" | "high" | "critical";
  readonly rootCause: string;
  readonly findings: string[];
  readonly suggestedFiles: string[];
  readonly suggestedChanges: Array<{
    readonly type: DeepSeekRepairChangeType;
    readonly description: string;
    readonly confidence: "low" | "medium" | "high";
  }>;
};

export type DeepSeekSuggestionEnvelope = {
  readonly taskType: "formula_audit";
  readonly generatedAt: string;
  readonly mustNotAutoApply: true;
  readonly items: DeepSeekRepairSuggestion[];
};

export type DeepSeekSuggestionEnvelopeMeta = DeepSeekSuggestionEnvelope & {
  readonly status?: "ok" | "unavailable" | "api_error";
  readonly suggestionUnavailable?: boolean;
  readonly errorCode?: DeepSeekErrorCode;
  readonly auditedSlugs?: string[];
  readonly message?: string;
};

export type FormulaAuditToolContext = {
  readonly slug: string;
  readonly p24Verdict: string | null;
  readonly ertStatus: string | null;
  readonly ertFindings: string[];
  readonly formulaContract: Record<string, unknown> | null;
  readonly inputSchema: Record<string, unknown> | null;
  readonly p24Findings: string[];
};
