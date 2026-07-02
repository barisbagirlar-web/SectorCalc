/**
 * Calculator feedback loop - types for full-loop runtime result corrections.
 */

export const CALCULATOR_FEEDBACK_CATEGORIES = [
  "formula_not_matching_field",
  "missing_input",
  "wrong_unit",
  "result_unrealistic",
  "industry_assumption_wrong",
  "other",
] as const;

export type CalculatorFeedbackCategory =
  (typeof CALCULATOR_FEEDBACK_CATEGORIES)[number];

export type CalculatorFeedbackTier = "free" | "premium" | "traffic";

export type CalculatorFeedbackSnapshotValue = number | string | boolean;

export const CALCULATOR_FEEDBACK_COLLECTION = "calculator_feedback";

export const CALCULATOR_FEEDBACK_COMMENT_MAX_LENGTH = 800;

export const CALCULATOR_FEEDBACK_SNAPSHOT_MAX_KEYS = 40;

export interface CalculatorFeedbackInput {
  toolSlug: string;
  tier: CalculatorFeedbackTier;
  category: CalculatorFeedbackCategory | "";
  comment: string;
  pagePath: string;
  inputSnapshot?: Readonly<Record<string, CalculatorFeedbackSnapshotValue>>;
  resultSnapshot?: Readonly<Record<string, CalculatorFeedbackSnapshotValue>>;
}

export interface CalculatorFeedback {
  readonly id: string;
  readonly createdAt: string;
  readonly toolSlug: string;
  readonly tier: CalculatorFeedbackTier;
  readonly category: CalculatorFeedbackCategory;
  readonly comment: string;
  readonly pagePath: string;
  readonly inputSnapshot?: Readonly<Record<string, CalculatorFeedbackSnapshotValue>>;
  readonly resultSnapshot?: Readonly<Record<string, CalculatorFeedbackSnapshotValue>>;
}

export type CalculatorFeedbackFieldErrors = Partial<
  Record<
    | "toolSlug"
    | "tier"
    | "category"
    | "comment"
    | "pagePath"
    | "inputSnapshot"
    | "resultSnapshot"
    | "form",
    string
  >
>;

export interface CalculatorFeedbackSubmitResult {
  success: boolean;
  rateLimited?: boolean;
  errors?: CalculatorFeedbackFieldErrors;
  firestoreSaved?: boolean;
}

export const CALCULATOR_FEEDBACK_CATEGORY_LABELS: Record<
  CalculatorFeedbackCategory,
  string
> = {
  formula_not_matching_field: "Formula does not match my field",
  missing_input: "Missing input I need",
  wrong_unit: "Wrong unit or scale",
  result_unrealistic: "Result looks unrealistic",
  industry_assumption_wrong: "Industry assumption is wrong",
  other: "Other issue",
};
