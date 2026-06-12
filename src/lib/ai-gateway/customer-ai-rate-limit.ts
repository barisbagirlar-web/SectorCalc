import "server-only";

const hits = new Map<string, { count: number; resetAt: number }>();

export function checkCustomerAiRateLimit(key: string) {
  const limit = Number(process.env.AI_CUSTOMER_DAILY_LIMIT || 30);
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  const current = hits.get(key);

  if (!current || current.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + day });
    return { ok: true as const };
  }

  if (current.count >= limit) {
    return { ok: false as const };
  }

  current.count += 1;
  return { ok: true as const };
}
