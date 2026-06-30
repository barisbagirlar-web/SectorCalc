/**
 * AI assistant boundary policy — ADIM 6 (interface-only; no LLM calls).
 *
 * Enforces dual-core separation: assistant is not a calculation, oracle,
 * validation, or formula authority.
 */

import type { AssistantAllowedAction } from "@/lib/features/ai-assistant/assistant-actions";
import { ASSISTANT_ALLOWED_ACTIONS } from "@/lib/features/ai-assistant/assistant-actions";

export type AssistantForbiddenAction =
  | "calculate_result"
  | "choose_formula"
  | "override_oracle"
  | "bypass_validation"
  | "create_formula"
  | "final_decision";

export type AssistantAction = AssistantAllowedAction | AssistantForbiddenAction;

export const ASSISTANT_FORBIDDEN_ACTIONS: readonly AssistantForbiddenAction[] = [
  "calculate_result",
  "choose_formula",
  "override_oracle",
  "bypass_validation",
  "create_formula",
  "final_decision",
];

const FORBIDDEN_SET = new Set<string>(ASSISTANT_FORBIDDEN_ACTIONS);

export class AssistantBoundaryViolationError extends Error {
  readonly action: AssistantForbiddenAction;

  constructor(action: AssistantForbiddenAction) {
    super(
      `Assistant action "${action}" is forbidden by SectorCalc dual-core boundary policy.`,
    );
    this.name = "AssistantBoundaryViolationError";
    this.action = action;
  }
}

export function isAssistantActionAllowed(
  action: string,
): action is AssistantAllowedAction {
  return (ASSISTANT_ALLOWED_ACTIONS as readonly string[]).includes(action);
}

export function isAssistantActionForbidden(
  action: string,
): action is AssistantForbiddenAction {
  return FORBIDDEN_SET.has(action);
}

export function assertAssistantActionAllowed(
  action: string,
): asserts action is AssistantAllowedAction {
  if (FORBIDDEN_SET.has(action)) {
    throw new AssistantBoundaryViolationError(action as AssistantForbiddenAction);
  }
  if (!isAssistantActionAllowed(action)) {
    throw new Error(`Unknown assistant action "${action}".`);
  }
}
