/**
 * Structured input schema — LLM output shape (no calculation fields).
 */

export type StructuredInputPayload = {
  readonly action: "extract_structured_inputs" | "normalize_units" | "generate_missing_input_question" | "classify_user_intent" | "draft_user_explanation";
  readonly goalId?: string;
  readonly knownInputs?: Readonly<Record<string, number | string>>;
  readonly missingVariableIds?: readonly string[];
  readonly userText?: string;
  readonly notes?: string;
};

export const STRUCTURED_INPUT_SCHEMA_VERSION = "1.0.0";

export function isStructuredInputPayload(value: unknown): value is StructuredInputPayload {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return typeof record.action === "string";
}
