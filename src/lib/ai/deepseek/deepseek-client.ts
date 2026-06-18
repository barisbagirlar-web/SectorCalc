/**
 * DeepSeek JSON client — server/script only. Never import from client components.
 *
 * Production client wrapping deepseek-core for JSON-parsed responses.
 * Core handles: adaptive timeout, exponential backoff+jitter, rate-limit detection,
 * circuit breaker, model fallback, max_tokens.
 */
import {
  DEEPSEEK_TASK_CONFIG,
  type DeepSeekChatMessage,
  type DeepSeekClientConfig,
  type DeepSeekErrorCode,
  type DeepSeekJsonResult,
  type DeepSeekTaskType,
} from "@/lib/ai/deepseek/deepseek-types";
import { callDeepSeekCore } from "@/lib/ai/deepseek/deepseek-core";
import {
  logSanitizedJsonFailure,
  parseDeepSeekResponse,
  writeRawDebugOnFailure,
  type JsonGuardResult,
} from "@/lib/ai/deepseek/deepseek-json-guard";
import { redactSecretsLite } from "@/lib/ai/deepseek/deepseek-redaction-lite";

const DEFAULT_MODEL = "deepseek-chat";

export function getDeepSeekClientConfig(): DeepSeekClientConfig {
  return {
    apiKey: process.env.DEEPSEEK_API_KEY?.trim() || undefined,
    model: process.env.DEEPSEEK_MODEL?.trim() || DEFAULT_MODEL,
    timeoutMs: Number(process.env.DEEPSEEK_TIMEOUT_MS || 20_000),
  };
}

export function sanitizeDeepSeekErrorMessage(message: string): string {
  const config = getDeepSeekClientConfig();
  let sanitized = redactSecretsLite(message);

  if (config.apiKey) {
    sanitized = sanitized.split(config.apiKey).join("[REDACTED_SECRET]");
  }

  return sanitized;
}

function failure<T>(
  errorCode: DeepSeekErrorCode,
  message?: string,
  rawDebugPath?: string,
): DeepSeekJsonResult<T> {
  return {
    ok: false,
    errorCode,
    suggestionUnavailable: true,
    message: message ? sanitizeDeepSeekErrorMessage(message) : undefined,
    rawDebugPath,
  };
}

export async function callDeepSeekJson<T>(
  taskType: DeepSeekTaskType,
  messages: DeepSeekChatMessage[],
  validate: (parsed: unknown) => JsonGuardResult<T>,
): Promise<DeepSeekJsonResult<T>> {
  const config = getDeepSeekClientConfig();

  if (!config.apiKey) {
    return failure("missing_api_key");
  }

  const taskConfig = DEEPSEEK_TASK_CONFIG[taskType];

  const coreResponse = await callDeepSeekCore({
    taskType,
    messages,
    temperature: taskConfig.temperature,
    model: config.model,
    timeoutMs: config.timeoutMs,
  });

  if (!coreResponse.ok) {
    const errorCode: DeepSeekErrorCode =
      coreResponse.errorCode === "rate_limited" || coreResponse.errorCode === "circuit_breaker_open"
        ? "api_error"
        : coreResponse.errorCode === "timeout"
          ? "timeout"
          : coreResponse.errorCode === "max_retries_exceeded"
            ? "api_error"
            : coreResponse.errorCode;
    const debugPath =
      coreResponse.errorCode === "timeout" && coreResponse.message
        ? writeRawDebugOnFailure(coreResponse.message, coreResponse.errorCategory)
        : undefined;
    return failure(errorCode, coreResponse.message, debugPath);
  }

  const guardResult = parseDeepSeekResponse(
    coreResponse.data.content,
    coreResponse.data.finishReason,
    validate,
  );

  if (!guardResult.ok) {
    if (guardResult.reason === "invalid_json" || guardResult.reason === "truncated") {
      logSanitizedJsonFailure(coreResponse.data.content, guardResult.reason);
    }
    const debugPath =
      guardResult.reason === "invalid_json" || guardResult.reason === "truncated"
        ? writeRawDebugOnFailure(coreResponse.data.content, guardResult.reason)
        : undefined;
    return failure("invalid_json", guardResult.message, debugPath);
  }

  return { ok: true, data: guardResult.data };
}

export async function callDeepSeekHealthcheck(): Promise<
  DeepSeekJsonResult<{ ok: true; service: string }>
> {
  const { buildHealthcheckSystemPrompt, buildHealthcheckUserPrompt } = await import(
    "@/lib/ai/deepseek/deepseek-prompts"
  );

  return callDeepSeekJson(
    "healthcheck",
    [
      { role: "system", content: buildHealthcheckSystemPrompt() },
      { role: "user", content: buildHealthcheckUserPrompt() },
    ],
    (parsed) => {
      if (!parsed || typeof parsed !== "object") {
        return { ok: false, reason: "invalid_json", message: "Health JSON must be an object." };
      }

      const record = parsed as Record<string, unknown>;
      if (record.ok !== true || record.service !== "sectorcalc-deepseek") {
        return {
          ok: false,
          reason: "missing_keys",
          message: "Health JSON shape invalid.",
        };
      }

      return { ok: true, data: { ok: true, service: "sectorcalc-deepseek" } };
    },
  );
}
