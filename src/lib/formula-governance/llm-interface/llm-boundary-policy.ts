/**
 * LLM boundary policy — interface-only actions; calculation forbidden.
 */

export type LlmAllowedAction =
  | "extract_structured_inputs"
  | "normalize_units"
  | "generate_missing_input_question"
  | "classify_user_intent"
  | "draft_user_explanation";

export type LlmForbiddenAction =
  | "calculate_result"
  | "choose_formula"
  | "override_oracle"
  | "bypass_validation"
  | "mutate_production_output"
  | "invent_formula"
  | "mark_audit_passed";

export type LlmAction = LlmAllowedAction | LlmForbiddenAction;

export class LlmBoundaryViolationError extends Error {
  readonly action: LlmForbiddenAction;

  constructor(action: LlmForbiddenAction) {
    super(`LLM action "${action}" is forbidden by dual-core boundary policy.`);
    this.name = "LlmBoundaryViolationError";
    this.action = action;
  }
}

export const LLM_ALLOWED_ACTIONS: readonly LlmAllowedAction[] = [
  "extract_structured_inputs",
  "normalize_units",
  "generate_missing_input_question",
  "classify_user_intent",
  "draft_user_explanation",
];

export const LLM_FORBIDDEN_ACTIONS: readonly LlmForbiddenAction[] = [
  "calculate_result",
  "choose_formula",
  "override_oracle",
  "bypass_validation",
  "mutate_production_output",
  "invent_formula",
  "mark_audit_passed",
];

const FORBIDDEN_SET = new Set<string>(LLM_FORBIDDEN_ACTIONS);

export function isLlmActionAllowed(action: string): action is LlmAllowedAction {
  return (LLM_ALLOWED_ACTIONS as readonly string[]).includes(action);
}

export function assertLlmActionAllowed(action: string): asserts action is LlmAllowedAction {
  if (FORBIDDEN_SET.has(action)) {
    throw new LlmBoundaryViolationError(action as LlmForbiddenAction);
  }
  if (!isLlmActionAllowed(action)) {
    throw new Error(`Unknown LLM action "${action}".`);
  }
}
