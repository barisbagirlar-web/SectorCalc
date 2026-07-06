const API_KEY_PATTERN = /sk-[A-Za-z0-9_-]{20,}/g;
const OPENAI_PATTERN = /OPENAI_API_KEY\s*=\s*\S+/g;
const DEEPSEEK_PATTERN = /DEEPSEEK_API_KEY\s*=\s*\S+/g;
const PASSWORD_PATTERN = /password\s*=\s*\S+/gi;
const BEARER_PATTERN = /\bbearer\s+[A-Za-z0-9._-]+\b/gi;

const REDACTED = "[REDACTED]";
const MAX_LENGTH = 5000;

export function redactUserText(input: string): string {
  let text = input ?? "";
  text = text.trim();
  text = text.replace(/\s{3,}/g, "  ");
  if (text.length > MAX_LENGTH) {
    text = text.slice(0, MAX_LENGTH);
  }
  text = text.replace(API_KEY_PATTERN, REDACTED);
  text = text.replace(OPENAI_PATTERN, "OPENAI_API_KEY=" + REDACTED);
  text = text.replace(DEEPSEEK_PATTERN, "DEEPSEEK_API_KEY=" + REDACTED);
  text = text.replace(PASSWORD_PATTERN, "password=[REDACTED]");
  text = text.replace(BEARER_PATTERN, "bearer [REDACTED]");
  return text;
}

export interface RedactableFields {
  problem_context: string;
  notes?: string;
  customer_name?: string;
  project_name?: string;
}

export function redactReportFields(fields: RedactableFields): RedactableFields {
  const result: RedactableFields = {
    problem_context: redactUserText(fields.problem_context),
  };
  if (fields.notes !== undefined) {
    result.notes = redactUserText(fields.notes);
  }
  if (fields.customer_name !== undefined) {
    result.customer_name = redactUserText(fields.customer_name);
  }
  if (fields.project_name !== undefined) {
    result.project_name = redactUserText(fields.project_name);
  }
  return result;
}
