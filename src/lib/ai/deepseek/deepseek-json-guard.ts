import type { DeepSeekSuggestionEnvelope, DeepSeekRepairSuggestion } from "@/lib/ai/deepseek/deepseek-types";

export type JsonGuardRejectReason =
  | "empty"
  | "invalid_json"
  | "truncated"
  | "missing_keys"
  | "must_not_auto_apply";

export type JsonGuardResult<T> =
  | { readonly ok: true; readonly data: T; readonly unknownFields?: Record<string, unknown> }
  | { readonly ok: false; readonly reason: JsonGuardRejectReason; readonly message?: string };

const MARKDOWN_FENCE_PATTERN = /^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/i;

export function stripMarkdownJsonFence(raw: string): string {
  const trimmed = raw.trim();
  const match = trimmed.match(MARKDOWN_FENCE_PATTERN);

  if (match?.[1]) {
    return match[1].trim();
  }

  return trimmed;
}

export function parseJsonText(raw: string): JsonGuardResult<unknown> {
  const cleaned = stripMarkdownJsonFence(raw);

  if (!cleaned) {
    return { ok: false, reason: "empty", message: "Response text is empty." };
  }

  try {
    return { ok: true, data: JSON.parse(cleaned) as unknown };
  } catch (error) {
    return {
      ok: false,
      reason: "invalid_json",
      message: error instanceof Error ? error.message : "JSON parse failed.",
    };
  }
}

export function assertFinishReasonAllowsJson(finishReason: string | null | undefined): JsonGuardResult<true> {
  if (finishReason === "length") {
    return {
      ok: false,
      reason: "truncated",
      message: "Model finish_reason=length — JSON likely truncated.",
    };
  }

  return { ok: true, data: true };
}

export function pickKnownKeys<T extends Record<string, unknown>>(
  input: Record<string, unknown>,
  allowedKeys: readonly (keyof T)[],
): { known: T; unknown: Record<string, unknown> } {
  const known = {} as Record<string, unknown>;
  const unknown: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input)) {
    if ((allowedKeys as readonly string[]).includes(key)) {
      known[key] = value;
    } else {
      unknown[key] = value;
    }
  }

  return { known: known as T, unknown };
}

function isRepairSuggestion(value: unknown): value is DeepSeekRepairSuggestion {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Record<string, unknown>;
  return typeof record.slug === "string" && typeof record.rootCause === "string";
}

export function validateSuggestionEnvelope(input: unknown): JsonGuardResult<DeepSeekSuggestionEnvelope> {
  if (!input || typeof input !== "object") {
    return { ok: false, reason: "missing_keys", message: "Envelope must be an object." };
  }

  const record = input as Record<string, unknown>;

  if (record.mustNotAutoApply !== true) {
    return {
      ok: false,
      reason: "must_not_auto_apply",
      message: "mustNotAutoApply must be true.",
    };
  }

  const requiredKeys = ["taskType", "generatedAt", "mustNotAutoApply", "items"] as const;
  for (const key of requiredKeys) {
    if (!(key in record)) {
      return { ok: false, reason: "missing_keys", message: `Missing top-level key: ${key}` };
    }
  }

  if (record.taskType !== "formula_audit") {
    return { ok: false, reason: "missing_keys", message: "taskType must be formula_audit." };
  }

  if (typeof record.generatedAt !== "string") {
    return { ok: false, reason: "missing_keys", message: "generatedAt must be a string." };
  }

  if (!Array.isArray(record.items)) {
    return { ok: false, reason: "missing_keys", message: "items must be an array." };
  }

  const items = record.items.filter(isRepairSuggestion);

  const { known, unknown } = pickKnownKeys<DeepSeekSuggestionEnvelope>(record, [
    "taskType",
    "generatedAt",
    "mustNotAutoApply",
    "items",
  ]);

  return {
    ok: true,
    data: {
      ...known,
      items,
    },
    unknownFields: Object.keys(unknown).length > 0 ? unknown : undefined,
  };
}

export function parseExpectedJson<T>(
  raw: string,
  finishReason: string | null | undefined,
  validate: (parsed: unknown) => JsonGuardResult<T>,
): JsonGuardResult<T> {
  const finishCheck = assertFinishReasonAllowsJson(finishReason);
  if (!finishCheck.ok) {
    return finishCheck;
  }

  const parsed = parseJsonText(raw);
  if (!parsed.ok) {
    return parsed;
  }

  return validate(parsed.data);
}
