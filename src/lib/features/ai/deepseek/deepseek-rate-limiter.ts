/**
 * DeepSeek token-bucket rate limiter - industrial-grade.
 * Server/script only. Thread-safe via module-level state.
 */
import { DEEPSEEK_RATE_LIMITS, type DeepSeekRateLimitConfig } from "./deepseek-types";

/* ── Token bucket state ── */

type TokenBucket = {
  readonly tokens: number;
  readonly lastRefillAt: number;
};

const buckets = new Map<string, TokenBucket>();

function getBucketConfig(bucketKey: string): DeepSeekRateLimitConfig {
  return DEEPSEEK_RATE_LIMITS[bucketKey] ?? DEEPSEEK_RATE_LIMITS.production;
}

function refillBucket(bucket: TokenBucket, config: DeepSeekRateLimitConfig, now: number): TokenBucket {
  const elapsed = now - bucket.lastRefillAt;
  const refillAmount = (elapsed / 60_000) * config.requestsPerMinute;
  const newTokens = Math.min(bucket.tokens + refillAmount, config.burstCapacity);
  return { tokens: newTokens, lastRefillAt: now };
}

/* ── Public API ── */

/**
 * Try to consume a token from the named bucket.
 * Returns `true` if allowed, `false` if rate limited.
 */
export function tryConsumeToken(bucketKey: string = "production"): boolean {
  const now = Date.now();
  const config = getBucketConfig(bucketKey);
  let bucket = buckets.get(bucketKey);

  if (!bucket) {
    bucket = { tokens: config.burstCapacity, lastRefillAt: now };
    buckets.set(bucketKey, bucket);
  }

  bucket = refillBucket(bucket, config, now);
  buckets.set(bucketKey, bucket);

  if (bucket.tokens >= 1) {
    buckets.set(bucketKey, { tokens: bucket.tokens - 1, lastRefillAt: bucket.lastRefillAt });
    return true;
  }

  return false;
}

/**
 * Wait until a token is available.
 * Polls every 100ms up to `maxWaitMs`.
 */
export async function waitForToken(
  bucketKey: string = "production",
  maxWaitMs: number = 30_000,
): Promise<boolean> {
  if (tryConsumeToken(bucketKey)) {
    return true;
  }

  const deadline = Date.now() + maxWaitMs;

  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (tryConsumeToken(bucketKey)) {
      return true;
    }
  }

  return false;
}

/**
 * Reset all buckets (useful for testing / circuit breaker reset).
 */
export function resetAllBuckets(): void {
  buckets.clear();
}

/**
 * Get current bucket state snapshot (for diagnostics).
 */
export function getBucketState(bucketKey: string): { tokens: number; lastRefillAt: number } | null {
  const bucket = buckets.get(bucketKey);
  if (!bucket) return null;
  const config = getBucketConfig(bucketKey);
  const refilled = refillBucket(bucket, config, Date.now());
  return { tokens: refilled.tokens, lastRefillAt: refilled.lastRefillAt };
}
