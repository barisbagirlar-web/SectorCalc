/**
 * SectorCalc Assistant — shared types (P10).
 *
 * The assistant is deterministic and guardrailed. It never calculates
 * formulas, never invents benchmark data, and never accesses private data.
 * Localized user-facing copy is rendered client-side from the `assistant`
 * i18n namespace keyed by `topic`; the server returns structured data only.
 */

export type AssistantTopic =
  | "findTool"
  | "explainTool"
  | "inputs"
  | "results"
  | "approvedReports"
  | "trustTrace"
  | "regionalUnits"
  | "benchmarks"
  | "pricing"
  | "enterprise"
  | "about"
  | "blockedFormula"
  | "blockedPrivate"
  | "fallback";

export type AssistantSuggestion = {
  readonly slug: string;
  readonly label: string;
  /** Locale-agnostic path; the client localizes the link prefix. */
  readonly href: string;
};

export type AssistantResult = {
  readonly topic: AssistantTopic;
  /** True when a guardrail blocked the request. */
  readonly blocked: boolean;
  /** Tool / page suggestions, already deduped and capped. */
  readonly suggestions: readonly AssistantSuggestion[];
  /** English diagnostic fallback; UI renders localized copy by topic. */
  readonly reply: string;
};

export type AssistantRequestBody = {
  readonly message?: unknown;
};
