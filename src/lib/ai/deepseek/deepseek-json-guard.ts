import fs from "node:fs";
import path from "node:path";
import type { DeepSeekCoreResponse, DeepSeekSuggestionEnvelope, DeepSeekRepairSuggestion } from "@/lib/ai/deepseek/deepseek-types";
import { redactSecretsLite } from "@/lib/ai/deepseek/deepseek-redaction-lite";

export type JsonGuardRejectReason =
  | "empty"
  | "invalid_json"
  | "truncated"
  | "missing_keys"
  | "must_not_auto_apply"
  | "contains_secrets";

export type JsonGuardResult<T> =
  | { readonly ok: true; readonly data: T; readonly unknownFields?: Record<string, unknown> }
  | { readonly ok: false; readonly reason: JsonGuardRejectReason; readonly message?: string };

const MARKDOWN_FENCE_PATTERN = /^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/i;
const INLINE_FENCE_PATTERN = /```(?:json)?\s*\n?([\s\S]*?)\n?```/gi;

const SECRET_SUBSTRINGS = [
  "BEGIN PRIVATE KEY",
  "sk_live_",
  "sk_test_",
  "xkeysib-",
  "DEEPSEEK_API_KEY",
  "STRIPE_SECRET",
  "service_account",
] as const;

export function stripMarkdownFences(raw: string): string {
  let cleaned = raw.trim();
  const fullMatch = cleaned.match(MARKDOWN_FENCE_PATTERN);
  if (fullMatch?.[1]) {
    return fullMatch[1].trim();
  }

  const inlineMatches = [...cleaned.matchAll(INLINE_FENCE_PATTERN)];
  if (inlineMatches.length > 0) {
    const last = inlineMatches[inlineMatches.length - 1];
    if (last?.[1]) {
      cleaned = last[1].trim();
    }
  }

  return cleaned;
}

/** @deprecated Use stripMarkdownFences */
export function stripMarkdownJsonFence(raw: string): string {
  return stripMarkdownFences(raw);
}

export function normalizeSmartQuotes(text: string): string {
  return text
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/\u00A0/g, " ");
}

export function removeTrailingCommas(json: string): string {
  return json.replace(/,\s*([}\]])/g, "$1");
}

export function extractFirstJsonObjectOrArray(raw: string): string | null {
  const cleaned = stripMarkdownFences(normalizeSmartQuotes(raw.trim()));
  if (!cleaned) {
    return null;
  }

  const startObject = cleaned.indexOf("{");
  const startArray = cleaned.indexOf("[");
  let start = -1;
  let openChar = "{";
  let closeChar = "}";

  if (startObject >= 0 && (startArray < 0 || startObject < startArray)) {
    start = startObject;
    openChar = "{";
    closeChar = "}";
  } else if (startArray >= 0) {
    start = startArray;
    openChar = "[";
    closeChar = "]";
  }

  if (start < 0) {
    return null;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < cleaned.length; i += 1) {
    const ch = cleaned[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === openChar) {
      depth += 1;
    } else if (ch === closeChar) {
      depth -= 1;
      if (depth === 0) {
        return cleaned.slice(start, i + 1);
      }
    }
  }

  return null;
}

export function rejectIfContainsSecrets(raw: string): JsonGuardResult<string> {
  const normalized = raw.toLowerCase();
  for (const marker of SECRET_SUBSTRINGS) {
    if (normalized.includes(marker.toLowerCase())) {
      return {
        ok: false,
        reason: "contains_secrets",
        message: `Response contains secret marker: ${marker}`,
      };
    }
  }

  return { ok: true, data: raw };
}

export function repairJsonText(raw: string): string {
  const extracted = extractFirstJsonObjectOrArray(raw) ?? stripMarkdownFences(raw);
  return removeTrailingCommas(normalizeSmartQuotes(extracted));
}

export function writeRawDebugOnFailure(
  raw: string,
  reason: string,
  cacheDir = path.join(process.cwd(), "scripts/.cache/deepseek"),
): string {
  fs.mkdirSync(cacheDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filePath = path.join(cacheDir, `raw-invalid-json-${timestamp}.txt`);
  const payload = [
    `reason: ${reason}`,
    `timestamp: ${new Date().toISOString()}`,
    "--- raw response (redacted) ---",
    redactSecretsLite(raw),
  ].join("\n");
  fs.writeFileSync(filePath, payload, "utf8");
  return filePath;
}

export function logSanitizedJsonFailure(raw: string, reason: string, maxChars = 500): void {
  const sanitized = redactSecretsLite(raw).slice(0, maxChars);
  console.error(`[deepseek-json-guard] ${reason}: ${sanitized}`);
}

export function parseJsonText(raw: string): JsonGuardResult<unknown> {
  const secretCheck = rejectIfContainsSecrets(raw);
  if (!secretCheck.ok) {
    return secretCheck;
  }

  const cleaned = repairJsonText(raw);

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

export { validateBulkRepairEnvelope as validateRepairEnvelope } from "@/lib/ai/deepseek/bulk-tool-repair-json-guard";

/* ── Standardised JSON pipeline ── */

/**
 * Full pipeline: raw string -> cleaned -> parsed -> validated.
 * Single entry point for all DeepSeek JSON responses.
 */
export function parseDeepSeekResponse<T>(
  raw: string,
  finishReason: string | null | undefined,
  validate: (parsed: unknown) => JsonGuardResult<T>,
): JsonGuardResult<T> {
  const finishCheck = assertFinishReasonAllowsJson(finishReason);
  if (!finishCheck.ok) {
    return finishCheck;
  }

  const secretCheck = rejectIfContainsSecrets(raw);
  if (!secretCheck.ok) {
    return secretCheck;
  }

  const cleaned = extractFirstJsonObjectOrArray(raw);
  if (!cleaned) {
    return { ok: false, reason: "invalid_json", message: "Could not extract JSON from response." };
  }

  const stripped = removeTrailingCommas(cleaned);

  let parsed: unknown;
  try {
    parsed = JSON.parse(stripped);
  } catch (error) {
    logSanitizedJsonFailure(raw, "invalid_json");
    return {
      ok: false,
      reason: "invalid_json",
      message: error instanceof Error ? error.message : "JSON parse failed.",
    };
  }

  return validate(parsed);
}

/**
 * Convenience wrapper: takes a DeepSeekCoreResponse and validates it.
 * Handles both ok and !ok paths uniformly.
 */
export function parseCoreResponse<T>(
  coreResponse: DeepSeekCoreResponse,
  validate: (parsed: unknown) => JsonGuardResult<T>,
): JsonGuardResult<T> {
  if (!coreResponse.ok) {
    return {
      ok: false,
      reason: "invalid_json",
      message: coreResponse.message,
    };
  }

  return parseDeepSeekResponse(
    coreResponse.data.content,
    coreResponse.data.finishReason,
    validate,
  );
}
