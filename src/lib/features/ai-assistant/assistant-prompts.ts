/**
 * AI assistant system prompt boundaries — ADIM 6 (interface-only; no LLM calls).
 *
 * Deterministic prompt contract for server-side assistant integration.
 * No API keys or runtime LLM calls in this module.
 */

import {
  ASSISTANT_FORBIDDEN_ACTIONS,
  type AssistantForbiddenAction,
} from "@/lib/features/ai-assistant/assistant-boundary";
import {
  ASSISTANT_ALLOWED_ACTIONS,
  type AssistantAllowedAction,
} from "@/lib/features/ai-assistant/assistant-actions";

export const ASSISTANT_PROMPT_BOUNDARY_VERSION = "1.0.0";

export const ASSISTANT_ROLE_STATEMENT =
  "You are SectorCalc's guided assistant. You help users understand inputs, tools, and results. You are not a calculation engine, oracle, validator, or decision authority.";

export const ASSISTANT_ALLOWED_SCOPE: readonly string[] = [
  "Explain calculator inputs in plain language using only the provided tool context.",
  "Suggest which SectorCalc tool fits the user's stated goal.",
  "Interpret displayed results without inventing numbers or changing verdicts.",
  "Draft report-friendly language from supplied trust-trace or result payloads.",
  "Explain missing inputs in the user's language without choosing formulas.",
  "Classify user feedback into predefined categories.",
];

export const ASSISTANT_FORBIDDEN_SCOPE: readonly string[] = [
  "Never compute, estimate, or replace deterministic calculator outputs.",
  "Never select, invent, or modify formulas or production calculation paths.",
  "Never override oracle comparisons or mark audits as passed.",
  "Never bypass validation, invariants, or blocked-result gates.",
  "Never create new formulas or change production outputs.",
  "Never issue final business, pricing, safety, or compliance decisions.",
  "Never expose secrets, API keys, or data outside the supplied tool payload.",
];

export type AssistantPromptBoundaryContract = {
  readonly version: typeof ASSISTANT_PROMPT_BOUNDARY_VERSION;
  readonly role: typeof ASSISTANT_ROLE_STATEMENT;
  readonly allowedActions: readonly AssistantAllowedAction[];
  readonly forbiddenActions: readonly AssistantForbiddenAction[];
  readonly allowedScope: readonly string[];
  readonly forbiddenScope: readonly string[];
};

export const ASSISTANT_PROMPT_BOUNDARY_CONTRACT: AssistantPromptBoundaryContract =
  {
    version: ASSISTANT_PROMPT_BOUNDARY_VERSION,
    role: ASSISTANT_ROLE_STATEMENT,
    allowedActions: ASSISTANT_ALLOWED_ACTIONS,
    forbiddenActions: ASSISTANT_FORBIDDEN_ACTIONS,
    allowedScope: ASSISTANT_ALLOWED_SCOPE,
    forbiddenScope: ASSISTANT_FORBIDDEN_SCOPE,
  };

export function buildAssistantSystemPromptBoundary(): string {
  const allowedActions = ASSISTANT_ALLOWED_ACTIONS.join(", ");
  const forbiddenActions = ASSISTANT_FORBIDDEN_ACTIONS.join(", ");
  const allowedScope = ASSISTANT_ALLOWED_SCOPE.map((line) => `- ${line}`).join(
    "\n",
  );
  const forbiddenScope = ASSISTANT_FORBIDDEN_SCOPE.map((line) => `- ${line}`).join(
    "\n",
  );

  return [
    ASSISTANT_ROLE_STATEMENT,
    "",
    `Boundary version: ${ASSISTANT_PROMPT_BOUNDARY_VERSION}`,
    "",
    "Allowed actions:",
    allowedActions,
    "",
    "Forbidden actions:",
    forbiddenActions,
    "",
    "Allowed scope:",
    allowedScope,
    "",
    "Forbidden scope:",
    forbiddenScope,
  ].join("\n");
}

export function assertAssistantPromptBoundaryContract(): void {
  if (ASSISTANT_PROMPT_BOUNDARY_CONTRACT.allowedActions.length === 0) {
    throw new Error("Assistant prompt boundary requires at least one allowed action.");
  }
  if (ASSISTANT_PROMPT_BOUNDARY_CONTRACT.forbiddenActions.length === 0) {
    throw new Error("Assistant prompt boundary requires at least one forbidden action.");
  }

  const prompt = buildAssistantSystemPromptBoundary();
  for (const action of ASSISTANT_FORBIDDEN_ACTIONS) {
    if (!prompt.includes(action)) {
      throw new Error(`Assistant system prompt must document forbidden action "${action}".`);
    }
  }
}
