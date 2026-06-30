import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const hits = new Map<string, number[]>();

type RateLimitResult = { ok: true } | { ok: false };

let upstashRatelimit: Ratelimit | null | undefined;

function resolveUpstashRatelimit(): Ratelimit | null {
  if (upstashRatelimit !== undefined) {
    return upstashRatelimit;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) {
    upstashRatelimit = null;
    return null;
  }

  const limit = Number(process.env.PUBLIC_CALCULATE_RATE_LIMIT || 60);
  const windowSeconds = Math.max(
    1,
    Math.ceil(Number(process.env.PUBLIC_CALCULATE_RATE_WINDOW_MS || 60_000) / 1000),
  );
  const refillRate = Math.max(1, Math.ceil(limit / windowSeconds));

  upstashRatelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.tokenBucket(refillRate, `${windowSeconds} s`, limit),
    prefix: "sectorcalc:public-calculate",
    analytics: false,
  });

  return upstashRatelimit;
}

function checkInMemoryRateLimit(
  key: string,
  limit = Number(process.env.PUBLIC_CALCULATE_RATE_LIMIT || 60),
  windowMs = Number(process.env.PUBLIC_CALCULATE_RATE_WINDOW_MS || 60_000),
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;
  const requests = hits.get(key) ?? [];
  const recent = requests.filter((timestamp) => timestamp > windowStart);

  if (recent.length >= limit) {
    return { ok: false };
  }

  recent.push(now);
  hits.set(key, recent);
  return { ok: true };
}

export async function checkPublicCalculateRateLimit(key: string): Promise<RateLimitResult> {
  const ratelimit = resolveUpstashRatelimit();
  if (!ratelimit) {
    return checkInMemoryRateLimit(key);
  }

  try {
    const result = await ratelimit.limit(key);
    return result.success ? { ok: true } : { ok: false };
  } catch (error) {
    console.error("Upstash rate limit fallback:", error);
    return checkInMemoryRateLimit(key);
  }
}
