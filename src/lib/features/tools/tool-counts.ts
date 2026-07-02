/**
 * Dynamic tool counter - computes total tools at build/render time.
 * Uses static imports (resolved by Next.js/webpack at build time).
 */
import { getFreeTools, getPremiumTools } from "@/lib/features/tools/all-tools-data";

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
  _cachedFree = getFreeTools("en").length;
  _cachedPremium = getPremiumTools("en").length;
  _cachedTotal = _cachedFree + _cachedPremium;
}

export function resetToolCountCache(): void {
  _cachedTotal = null;
  _cachedFree = null;
  _cachedPremium = null;
}
