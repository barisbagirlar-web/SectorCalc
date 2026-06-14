import "server-only";

const hits = new Map<string, number[]>();

export function checkAssistantRateLimit(
  key: string,
  limit = 10,
  windowMs = 60_000,
): { ok: true } | { ok: false } {
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
