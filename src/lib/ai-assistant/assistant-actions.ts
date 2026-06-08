/**
 * AI assistant allowed actions — ADIM 6 (interface-only; no LLM calls).
 *
 * The assistant may guide, explain, and classify within tool result payloads.
 * It must never calculate, validate, or decide on behalf of the deterministic engine.
 */

export const ASSISTANT_ALLOWED_ACTIONS = [
  "explain_input",
  "suggest_tool",
  "interpret_result",
  "draft_report_language",
  "explain_missing_input",
  "classify_feedback",
] as const;

export type AssistantAllowedAction = (typeof ASSISTANT_ALLOWED_ACTIONS)[number];
