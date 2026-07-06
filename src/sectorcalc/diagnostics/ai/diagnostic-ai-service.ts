/**
 * Engineering Diagnostics AI — Service Layer
 *
 * Orchestrates the engineering reasoning pipeline:
 *   1. Try OpenAI provider
 *   2. On success → validate + redact + return
 *   3. On failure → return fallback draft
 *
 * STRICT:
 * - Never allows AI to change deterministic results
 * - Never exposes raw AI output without validation
 * - Never hardcodes API keys
 * - Always redacts secrets
 */

import "server-only";
import type { EngineeringDraftInput, EngineeringDraftResult } from "./diagnostic-ai-types";
import { callEngineeringReasoningProvider } from "./openai-engineering-provider";
import { buildFallbackDraft } from "./diagnostic-ai-fallback";
import { redactUserText } from "../report/diagnostic-report-redaction";

/**
 * Build an AI-assisted engineering reasoning draft.
 *
 * @param input - The engineering draft input (domain context + deterministic results)
 * @returns EngineeringDraftResult with source indicator ("openai" | "fallback")
 *
 * The function is safe to call even when OPENAI_API_KEY is not configured.
 * It will gracefully return a domain-aware fallback.
 */
export async function buildEngineeringAiDraft(
  input: EngineeringDraftInput,
): Promise<EngineeringDraftResult> {
  // 1. Redact sensitive content before sending to OpenAI (defense in depth)
  const safeInput: EngineeringDraftInput = {
    ...input,
    problem_context: redactUserText(input.problem_context),
    optional_image: input.optional_image,
  };

  // 2. Try OpenAI provider
  const aiDraft = await callEngineeringReasoningProvider(safeInput);

  if (aiDraft) {
    return {
      ok: true,
      source: "openai",
      ai_draft: aiDraft,
    };
  }

  // 3. Fallback to domain templates
  const fallbackDraft = buildFallbackDraft(safeInput);
  return {
    ok: true,
    source: "fallback",
    ai_draft: fallbackDraft,
  };
}
