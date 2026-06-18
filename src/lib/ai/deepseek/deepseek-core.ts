/**
 * DeepSeek core client — industrial-grade.
 * Single entry point for ALL DeepSeek API calls.
 * Server/script only. Never import from client components.
 *
 * Features:
 *  - Task-adaptive timeout
 *  - Exponential backoff + jitter
 *  - Rate-limit detection (429) with Retry-After
 *  - Circuit breaker (3 consecutive failures -> 60s cooldown)
 *  - Model fallback (primary -> fallback)
 *  - max_tokens per task type
 */
import {
  DEEPSEEK_MODEL_CONFIG,
  DEEPSEEK_TASK_CONFIG,
  CIRCUIT_BREAKER_DEFAULTS,
  type DeepSeekCoreOptions,
  type DeepSeekCoreResponse,
  type DeepSeekErrorCategory,
  type DeepSeekTaskType,
  type CircuitBreakerState,
} from "./deepseek-types";
import { waitForToken } from "./deepseek-rate-limiter";
import { redactSecretsLite } from "./deepseek-redaction-lite";

/* ── Constants ── */

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const RATE_LIMIT_BUCKET_KEY = "production";

/* ── Circuit breaker state (module-level) ── */

let circuitBreaker: CircuitBreakerState = {
  isOpen: false,
  failureCount: 0,
  lastFailureAt: null,
  openedAt: null,
};

export function getCircuitBreakerState(): Readonly<CircuitBreakerState> {
  return { ...circuitBreaker };
}

export function resetCircuitBreaker(): void {
  circuitBreaker = {
    isOpen: false,
    failureCount: 0,
    lastFailureAt: null,
    openedAt: null,
  };
}

function checkCircuitBreaker(): { allowed: boolean; reason?: string } {
  if (!circuitBreaker.isOpen) {
    return { allowed: true };
  }

  const elapsed = Date.now() - (circuitBreaker.openedAt ?? 0);

  if (elapsed >= CIRCUIT_BREAKER_DEFAULTS.cooldownMs) {
    circuitBreaker = {
      isOpen: false,
      failureCount: 0,
      lastFailureAt: null,
      openedAt: null,
    };
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: `Circuit breaker open for ${Math.ceil((CIRCUIT_BREAKER_DEFAULTS.cooldownMs - elapsed) / 1000)}s more`,
  };
}

function recordFailure(): void {
  circuitBreaker = {
    isOpen: circuitBreaker.failureCount + 1 >= CIRCUIT_BREAKER_DEFAULTS.failureThreshold,
    failureCount: circuitBreaker.failureCount + 1,
    lastFailureAt: Date.now(),
    openedAt:
      circuitBreaker.failureCount + 1 >= CIRCUIT_BREAKER_DEFAULTS.failureThreshold
        ? Date.now()
        : circuitBreaker.openedAt,
  };
}

function recordSuccess(): void {
  if (circuitBreaker.failureCount > 0) {
    circuitBreaker = {
      isOpen: false,
      failureCount: 0,
      lastFailureAt: null,
      openedAt: null,
    };
  }
}

/* ── Error classification ── */

function classifyFetchError(
  status: number | null,
  errorName: string | null,
  _errorMessage: string | null,
): DeepSeekErrorCategory {
  if (errorName === "AbortError") return "timeout";
  if (status === 429) return "rate_limit";
  if (status !== null && status >= 500 && status < 600) return "server_error";
  if (status !== null && status >= 400 && status < 500) return "client_error";
  if (errorName === "TypeError" || errorName === "FetchError") return "network";
  return "unknown";
}

/* ── Backoff computation ── */

function computeBackoffMs(attempt: number, status: number | null): number {
  let baseDelay: number;

  if (status === 429) {
    baseDelay = 10_000; // rate limit: 10s base
  } else if (status !== null && status >= 500) {
    baseDelay = 2_000; // server error: 2s base
  } else {
    baseDelay = 400; // network/timeout: 400ms base
  }

  const exponential = baseDelay * Math.pow(2, attempt);
  const jitter = Math.random() * 1000; // up to 1s jitter
  return Math.min(Math.round(exponential + jitter), 30_000); // cap at 30s
}

/* ── Model resolution ── */

function resolveModel(taskType: DeepSeekTaskType, preferredModel?: string): { primary: string; fallback: string } {
  if (preferredModel) {
    return { primary: preferredModel, fallback: preferredModel };
  }

  const envModel = process.env.DEEPSEEK_MODEL?.trim();
  if (envModel) {
    return { primary: envModel, fallback: envModel };
  }

  const config = DEEPSEEK_MODEL_CONFIG[taskType];
  if (config) {
    return { primary: config.primary, fallback: config.fallback };
  }

  return { primary: "deepseek-chat", fallback: "deepseek-coder" };
}

function resolveTimeoutMs(taskType: DeepSeekTaskType, preferredTimeoutMs?: number): number {
  if (preferredTimeoutMs) return preferredTimeoutMs;

  const envTimeout = Number(process.env.DEEPSEEK_TIMEOUT_MS);
  if (Number.isFinite(envTimeout) && envTimeout > 0) return envTimeout;

  const config = DEEPSEEK_MODEL_CONFIG[taskType];
  if (config) return config.timeoutMs;

  return 20_000;
}

function resolveMaxTokens(taskType: DeepSeekTaskType, preferredMaxTokens?: number): number {
  if (preferredMaxTokens) return preferredMaxTokens;

  const config = DEEPSEEK_MODEL_CONFIG[taskType];
  if (config) return config.maxTokens;

  return 2048;
}

/* ── API response parser ── */

type RawApiResponse = {
  choices?: Array<{
    finish_reason?: string | null;
    message?: { content?: string | null };
  }>;
  error?: { message?: string };
};

/* ── Core call function ── */

export async function callDeepSeekCore(options: DeepSeekCoreOptions): Promise<DeepSeekCoreResponse> {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) {
    return {
      ok: false,
      errorCode: "missing_api_key",
      errorCategory: "client_error",
      message: "DEEPSEEK_API_KEY is not configured.",
      attempts: 0,
    };
  }

  const { taskType, messages, temperature, maxTokens, timeoutMs, model } = options;
  const taskConfig = DEEPSEEK_TASK_CONFIG[taskType] ?? DEEPSEEK_TASK_CONFIG.formula_audit;
  const models = resolveModel(taskType, model);
  const effectiveTimeoutMs = resolveTimeoutMs(taskType, timeoutMs);
  const effectiveMaxTokens = resolveMaxTokens(taskType, maxTokens);
  const effectiveTemperature = temperature ?? taskConfig.temperature;
  const maxRetries = taskConfig.maxRetries;
  const bucketKey = taskType === "customer_assistant" ? "customer" : RATE_LIMIT_BUCKET_KEY;

  /* ── Rate limit check ── */
  const hasToken = await waitForToken(bucketKey, 5_000);
  if (!hasToken) {
    return {
      ok: false,
      errorCode: "rate_limited",
      errorCategory: "rate_limit",
      message: "Rate limit exceeded — token bucket empty.",
      attempts: 0,
    };
  }

  /* ── Circuit breaker check ── */
  const cb = checkCircuitBreaker();
  if (!cb.allowed) {
    return {
      ok: false,
      errorCode: "circuit_breaker_open",
      errorCategory: "server_error",
      message: cb.reason ?? "Circuit breaker is open.",
      attempts: 0,
    };
  }

  /* ── Redact secrets from messages ── */
  const redactedMessages = messages.map((msg) => ({
    ...msg,
    content: redactSecretsLite(msg.content),
  }));

  /* ── Try primary model, fallback to fallback ── */
  const modelsToTry = models.primary === models.fallback ? [models.primary] : [models.primary, models.fallback];
  let totalAttempts = 0;

  for (const currentModel of modelsToTry) {
    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
      totalAttempts += 1;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), effectiveTimeoutMs);

      try {
        const response = await fetch(DEEPSEEK_API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: currentModel,
            temperature: effectiveTemperature,
            max_tokens: effectiveMaxTokens,
            response_format: { type: "json_object" },
            messages: redactedMessages,
          }),
          signal: controller.signal,
        });

        const payload = (await response.json()) as RawApiResponse;

        if (!response.ok) {
          const errorCategory = classifyFetchError(response.status, null, payload.error?.message ?? null);
          const errorMessage = payload.error?.message || `HTTP ${response.status}`;

          if (errorCategory === "rate_limit") {
            // Read Retry-After header
            const retryAfter = response.headers.get("Retry-After");
            const waitMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : 5_000;
            await new Promise((r) => setTimeout(r, Math.min(waitMs, 30_000)));
          }

          if (attempt < maxRetries && (errorCategory === "rate_limit" || errorCategory === "server_error" || errorCategory === "network")) {
            const backoff = computeBackoffMs(attempt, response.status);
            await new Promise((r) => setTimeout(r, backoff));
            continue;
          }

          recordFailure();
          return {
            ok: false,
            errorCode: errorCategory === "rate_limit" ? "rate_limited" : "api_error",
            errorCategory,
            message: errorMessage,
            attempts: totalAttempts,
          };
        }

        const content = payload.choices?.[0]?.message?.content ?? "";
        const finishReason = payload.choices?.[0]?.finish_reason ?? null;

        recordSuccess();
        return {
          ok: true,
          data: {
            content,
            finishReason,
            modelUsed: currentModel,
            attempts: totalAttempts,
          },
        };
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          if (attempt < maxRetries) {
            const backoff = computeBackoffMs(attempt, null);
            await new Promise((r) => setTimeout(r, backoff));
            continue;
          }
          recordFailure();
          return {
            ok: false,
            errorCode: "timeout",
            errorCategory: "timeout",
            message: `Request timed out after ${effectiveTimeoutMs}ms (model: ${currentModel}, attempt: ${attempt + 1})`,
            attempts: totalAttempts,
          };
        }

        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorCategory: DeepSeekErrorCategory = classifyFetchError(null, error instanceof Error ? error.name : null, errorMessage);

        if (attempt < maxRetries && (errorCategory === "network" || errorCategory === "unknown")) {
          const backoff = computeBackoffMs(attempt, null);
          await new Promise((r) => setTimeout(r, backoff));
          continue;
        }

        recordFailure();
        return {
          ok: false,
          errorCode: "api_error",
          errorCategory,
          message: errorMessage,
          attempts: totalAttempts,
        };
      } finally {
        clearTimeout(timer);
      }
    }
  }

  recordFailure();
  return {
    ok: false,
    errorCode: "max_retries_exceeded",
    errorCategory: "unknown",
    message: "All models and retries exhausted.",
    attempts: totalAttempts,
  };
}
