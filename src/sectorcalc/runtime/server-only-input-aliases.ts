/**
 * server-only-input-aliases.ts — V5.3.1 Server-Only Input Alias Resolution
 *
 * Rejects Turkish input IDs at the root.
 * Used only in server-side request normalization.
 * Aliases NEVER appear in public schema, UI, audit, PDF, or copy summary.
 *
 * import "server-only";
 */

import { hasTurkishToken } from "@/sectorcalc/governance/forbidden-locale-token-detector";

/**
 * Resolve an input ID from any supported alias to its canonical English form.
 * If a Turkish token is detected, throws a validation error.
 * This is a server-only operation.
 */
export function resolveAliasToCanonical(id: string): string {
  if (!id) return id;
  const found = hasTurkishToken(id);
  if (found) {
    throw new Error(`Turkish input ID rejected: "${id}" (found: "${found}")`);
  }
  return id;
}

export function resolveAliasToCanonicalMap(ids: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const id of ids) {
    const canonical = resolveAliasToCanonical(id);
    if (canonical !== id) {
      result[id] = canonical;
    }
  }
  return result;
}
