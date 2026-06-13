/**
 * DeepSeek JSON client — server/script only. Never import from client components.
 */
import {
  DEEPSEEK_TASK_CONFIG,
  type DeepSeekChatMessage,
  type DeepSeekClientConfig,
  type DeepSeekErrorCode,
  type DeepSeekJsonResult,
  type DeepSeekTaskType,
} from "@/lib/ai/deepseek/deepseek-types";
import {
  logSanitizedJsonFailure,
  parseExpectedJson,
  writeRawDebugOnFailure,
  type JsonGuardResult,
} from "@/lib/ai/deepseek/deepseek-json-guard";
import { redactSecretsLite } from "@/lib/ai/deepseek/deepseek-redaction-lite";

const DEFAULT_MODEL = "deepseek-chat";
const DEFAULT_TIMEOUT_MS = 20_000;
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

export function getDeepSeekClientConfig(): DeepSeekClientConfig {
  return {
    apiKey: process.env.DEEPSEEK_API_KEY?.trim() || undefined,
    model: process.env.DEEPSEEK_MODEL?.trim() || DEFAULT_MODEL,
    timeoutMs: Number(process.env.DEEPSEEK_TIMEOUT_MS || DEFAULT_TIMEOUT_MS),
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

type DeepSeekApiResponse = {
  choices?: Array<{
    finish_reason?: string | null;
    message?: { content?: string | null };
  }>;
  error?: { message?: string };
};

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

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
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
  const redactedMessages = messages.map((message) => ({
    ...message,
    content: redactSecretsLite(message.content),
  }));

  let lastError: string | undefined;

  for (let attempt = 0; attempt <= taskConfig.maxRetries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

    try {
      const response = await fetch(DEEPSEEK_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: config.model,
          temperature: taskConfig.temperature,
          messages: redactedMessages,
          response_format: { type: "json_object" },
        }),
        signal: controller.signal,
      });

      const payload = (await response.json()) as DeepSeekApiResponse;

      if (!response.ok) {
        lastError = payload.error?.message || `HTTP ${response.status}`;
        if (attempt < taskConfig.maxRetries) {
          await sleep(400);
          continue;
        }
        return failure("api_error", lastError);
      }

      const finishReason = payload.choices?.[0]?.finish_reason ?? null;
      const rawText = payload.choices?.[0]?.message?.content ?? "";
      const parsed = parseExpectedJson(rawText, finishReason, validate);

      if (!parsed.ok) {
        lastError = parsed.message || parsed.reason;
        if (parsed.reason === "invalid_json" || parsed.reason === "truncated") {
          logSanitizedJsonFailure(rawText, parsed.reason);
        }
        if (attempt < taskConfig.maxRetries) {
          await sleep(400);
          continue;
        }
        const debugPath =
          parsed.reason === "invalid_json" || parsed.reason === "truncated"
            ? writeRawDebugOnFailure(rawText, parsed.reason)
            : undefined;
        return failure("invalid_json", lastError, debugPath);
      }

      return { ok: true, data: parsed.data };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        lastError = "Request timed out";
        if (attempt < taskConfig.maxRetries) {
          await sleep(400);
          continue;
        }
        return failure("timeout", lastError);
      }

      lastError = error instanceof Error ? error.message : String(error);
      if (attempt < taskConfig.maxRetries) {
        await sleep(400);
        continue;
      }
      return failure("api_error", lastError);
    } finally {
      clearTimeout(timeout);
    }
  }

  return failure("api_error", lastError);
}

export async function callDeepSeekHealthcheck(): Promise<
  DeepSeekJsonResult<{ ok: true; service: string }>
> {
  const { buildHealthcheckSystemPrompt, buildHealthcheckUserPrompt } = await import(
    "@/lib/ai/deepseek/deepseek-prompts"
  );

  return callDeepSeekJson(
    "formula_audit",
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
