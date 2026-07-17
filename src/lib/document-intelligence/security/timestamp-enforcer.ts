/**
 * Server Timestamp Enforcement Helper
 *
 * Provides server-authoritative timestamp generation and validation utilities.
 * MUST ONLY be called from server-side code (API routes, server actions, edge functions).
 * Client components must NEVER import or call these functions for authoritative state.
 *
 * @module timestamp-enforcer
 */

export interface ServerTimestamp {
  utcIso: string;
  epochMs: number;
}

/**
 * Generate a server-authoritative timestamp.
 * Must ONLY be called from server-side code (API routes, server actions, edge functions).
 */
export function serverNow(): ServerTimestamp {
  return {
    utcIso: new Date().toISOString(),
    epochMs: Date.now(),
  };
}

/**
 * Validate that a timestamp string is ISO 8601 UTC.
 */
export function isValidUtcIso(value: string): boolean {
  const parsed = new Date(value);
  return !isNaN(parsed.getTime()) && value.endsWith("Z");
}

/**
 * Validate retention deadline (server-derived).
 */
export function computeRetentionDeadline(
  serverCompletionTime: string,
  retentionDays: number,
): string {
  const completed = new Date(serverCompletionTime);
  const deadline = new Date(completed.getTime() + retentionDays * 24 * 60 * 60 * 1000);
  return deadline.toISOString();
}

/**
 * Check if a value appears to be a client-generated timestamp (not authoritative).
 */
export function isSuspiciousClientTimestamp(value: string): boolean {
  // Client timestamps often lack "Z" suffix or use non-UTC offsets
  if (!value.endsWith("Z") && !value.endsWith("+00:00")) return true;
  // Future timestamps more than 1 hour ahead are suspicious
  const ts = new Date(value).getTime();
  if (ts > Date.now() + 3600000) return true;
  return false;
}
