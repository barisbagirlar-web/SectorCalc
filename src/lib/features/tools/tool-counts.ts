/**
 * Dynamic tool counter - computes total tools at build/render time.
 *
 * Uses V5.3.1 PRO schema loader for pro count (matches /pro-tools page)
 * and free tool data from all-tools-data for free count (matches /free-tools page).
 */
import { getAllProToolSchemas } from "@/sectorcalc/runtime/pro-schema-loader";
import { getFreeTools } from "@/lib/features/tools/all-tools-data";

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
  const proEntries = getAllProToolSchemas();
  const freeEntries = getFreeTools("en");

  _cachedFree = freeEntries.length;
  _cachedPremium = proEntries.length;
  _cachedTotal = _cachedFree + _cachedPremium;
}

export function resetToolCountCache(): void {
  _cachedTotal = null;
  _cachedFree = null;
  _cachedPremium = null;
}
