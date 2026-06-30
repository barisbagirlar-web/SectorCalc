/** DeepSeek quality factory — server/script-only types (DSK-0A). */

/* ── Existing types (backward compatible) ── */

export type DeepSeekTaskType =
  | "formula_audit"
  | "schema_review"
  | "guide_spec"
  | "content_draft"
  /* Extended task types */
  | "schema_generation"
  | "batch_scan"
  | "customer_assistant"
  | "repair_analysis"
  | "healthcheck"
  | "engineering_interpretation";

export type DeepSeekErrorCode =
  | "missing_api_key"
  | "timeout"
  | "api_error"
  | "invalid_json"
  /* Extended error codes */
  | "rate_limited"
  | "circuit_breaker_open"
  | "max_retries_exceeded"
  | "model_fallback_exhausted";

export type DeepSeekTaskConfig = {
  readonly temperature: number;
  readonly maxRetries: number;
};

export const DEEPSEEK_TASK_CONFIG: Readonly<Record<DeepSeekTaskType, DeepSeekTaskConfig>> = {
  formula_audit: { temperature: 0.1, maxRetries: 1 },
  schema_review: { temperature: 0.1, maxRetries: 2 },
  guide_spec: { temperature: 0.4, maxRetries: 1 },
  content_draft: { temperature: 0.5, maxRetries: 1 },
  schema_generation: { temperature: 0.1, maxRetries: 3 },
  batch_scan: { temperature: 0.1, maxRetries: 2 },
  customer_assistant: { temperature: 0.1, maxRetries: 1 },
  repair_analysis: { temperature: 0.1, maxRetries: 2 },
  healthcheck: { temperature: 0.1, maxRetries: 1 },
  engineering_interpretation: { temperature: 0.3, maxRetries: 1 },
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
  readonly rawDebugPath?: string;
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

/* ── Industrial-grade extensions ── */

/** Error category for smart retry decisions */
export type DeepSeekErrorCategory =
  | "network"       // fetch failed, DNS, connection refused
  | "rate_limit"    // HTTP 429
  | "server_error"  // HTTP 5xx
  | "client_error"  // HTTP 4xx (excluding 429)
  | "timeout"       // AbortError
  | "parse_failure" // JSON parse or validation failed
  | "unknown";

/** Per-model configuration */
export type DeepSeekModelConfig = {
  readonly primary: string;
  readonly fallback: string;
  readonly timeoutMs: number;
  readonly maxTokens: number;
};

/** Industrial-grade model config map — env override supported */
export const DEEPSEEK_MODEL_CONFIG: Readonly<Record<DeepSeekTaskType, DeepSeekModelConfig>> = {
  formula_audit: {
    primary: "deepseek-chat",
    fallback: "deepseek-coder",
    timeoutMs: 60_000,
    maxTokens: 4096,
  },
  schema_review: {
    primary: "deepseek-chat",
    fallback: "deepseek-coder",
    timeoutMs: 60_000,
    maxTokens: 4096,
  },
  guide_spec: {
    primary: "deepseek-chat",
    fallback: "deepseek-reasoner",
    timeoutMs: 90_000,
    maxTokens: 4096,
  },
  content_draft: {
    primary: "deepseek-chat",
    fallback: "deepseek-coder",
    timeoutMs: 45_000,
    maxTokens: 2048,
  },
  schema_generation: {
    primary: "deepseek-chat",
    fallback: "deepseek-coder",
    timeoutMs: 120_000,
    maxTokens: 4096,
  },
  batch_scan: {
    primary: "deepseek-chat",
    fallback: "deepseek-coder",
    timeoutMs: 60_000,
    maxTokens: 4096,
  },
  customer_assistant: {
    primary: "deepseek-chat",
    fallback: "deepseek-coder",
    timeoutMs: 20_000,
    maxTokens: 2048,
  },
  repair_analysis: {
    primary: "deepseek-chat",
    fallback: "deepseek-reasoner",
    timeoutMs: 90_000,
    maxTokens: 4096,
  },
  healthcheck: {
    primary: "deepseek-chat",
    fallback: "deepseek-coder",
    timeoutMs: 15_000,
    maxTokens: 512,
  },
  engineering_interpretation: {
    primary: "deepseek-chat",
    fallback: "deepseek-reasoner",
    timeoutMs: 120_000,
    maxTokens: 4096,
  },
};

/** Per-task rate limit configuration (requests per minute, burst capacity) */
export type DeepSeekRateLimitConfig = {
  readonly requestsPerMinute: number;
  readonly burstCapacity: number;
};

export const DEEPSEEK_RATE_LIMITS: Readonly<Record<string, DeepSeekRateLimitConfig>> = {
  production: { requestsPerMinute: 30, burstCapacity: 5 },
  batch: { requestsPerMinute: 10, burstCapacity: 3 },
  customer: { requestsPerMinute: 30, burstCapacity: 5 },
  script: { requestsPerMinute: 15, burstCapacity: 3 },
};

/** Circuit breaker state */
export type CircuitBreakerState = {
  readonly isOpen: boolean;
  readonly failureCount: number;
  readonly lastFailureAt: number | null;
  readonly openedAt: number | null;
};

export const CIRCUIT_BREAKER_DEFAULTS = {
  failureThreshold: 3,
  cooldownMs: 60_000,
} as const;

/** Core request options */
export type DeepSeekCoreOptions = {
  readonly taskType: DeepSeekTaskType;
  readonly messages: DeepSeekChatMessage[];
  readonly temperature?: number;
  readonly maxTokens?: number;
  readonly timeoutMs?: number;
  readonly model?: string;
};

/** Core response */
export type DeepSeekCoreResponse =
  | {
      readonly ok: true;
      readonly data: {
        readonly content: string;
        readonly finishReason: string | null;
        readonly modelUsed: string;
        readonly attempts: number;
      };
    }
  | {
      readonly ok: false;
      readonly errorCode: DeepSeekErrorCode;
      readonly errorCategory: DeepSeekErrorCategory;
      readonly message: string;
      readonly attempts: number;
    };
