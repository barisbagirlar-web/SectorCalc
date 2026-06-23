/**
 * Dynamic tool counter — computes total tools at build/render time.
 * Uses static imports (resolved by Next.js/webpack at build time).
 */


import { FREE_TOOLS, PREMIUM_TOOLS } from "@/data/tools";
import { FREE_TRAFFIC_TOOLS } from "@/lib/tools/free-traffic-catalog";

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
  const freeCount = FREE_TOOLS.length + FREE_TRAFFIC_TOOLS.length;
  const premiumCount = PREMIUM_TOOLS.length;
  _cachedFree = freeCount;
  _cachedPremium = premiumCount;
  _cachedTotal = freeCount + premiumCount;
}

export function resetToolCountCache(): void {
  _cachedTotal = null;
  _cachedFree = null;
  _cachedPremium = null;
}

