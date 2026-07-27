/** Same-origin returnTo validation (prevent open redirects). */
export function sanitizeReturnTo(returnTo: unknown, allowedOrigins: string[]): string | null {
  if (returnTo == null || returnTo === '') return null;
  if (typeof returnTo !== 'string') return null;
  const trimmed = returnTo.trim();
  if (!trimmed.startsWith('/')) return null;
  if (trimmed.startsWith('//')) return null;
  if (trimmed.includes('\\') || trimmed.includes('@')) return null;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) return null;
  // Absolute URLs rejected unless same-origin path-only.
  for (const origin of allowedOrigins) {
    if (trimmed.startsWith(origin)) {
      try {
        const u = new URL(trimmed);
        if (allowedOrigins.includes(u.origin)) return `${u.pathname}${u.search}${u.hash}`;
      } catch {
        return null;
      }
    }
  }
  if (trimmed.length > 512) return null;
  return trimmed;
}
