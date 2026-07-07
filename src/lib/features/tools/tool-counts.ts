/**
 * Dynamic tool counter - computes total tools at build/render time.
 * Uses compile-time constants (NOT server-only modules) so it works
 * when imported through client component chains (PageLayout→SiteHeader).
 *
 * Real active counts from production allowlists (active-tool-allowlist.ts).
 * These reflect the actual tools rendered on public pages — not registry totals.
 */
import { ACTIVE_FREE_TOOL_SLUGS, ACTIVE_PRO_TOOL_SLUGS } from "@/sectorcalc/runtime/active-tool-allowlist";

let _cachedTotal: number | null = null;
let _cachedFree: number | null = null;
let _cachedPremium: number | null = null;

export function getTotalToolCount(): number {
  if (_cachedTotal !== null) return _cachedTotal;
  compute();
  return _cachedTotal!;
}

export function getFreeToolCount(): number {
  if (_cachedFree !== null) return _cachedFree;
  compute();
  return _cachedFree!;
}

export function getPremiumToolCount(): number {
  if (_cachedPremium !== null) return _cachedPremium;
  compute();
  return _cachedPremium!;
}

function compute(): void {
  // Active tool counts from production allowlists — these match what renders on public pages
  const freeCount = ACTIVE_FREE_TOOL_SLUGS.length;
  const proCount = ACTIVE_PRO_TOOL_SLUGS.length;

  _cachedFree = freeCount;
  _cachedPremium = proCount;
  _cachedTotal = freeCount + proCount;
}

export function resetToolCountCache(): void {
  _cachedTotal = null;
  _cachedFree = null;
  _cachedPremium = null;
}
