/**
 * Dynamic tool counter — computes total tools at build/render time.
 * Uses static imports (resolved by Next.js/webpack at build time).
 */
import titles from "@/data/generated-tool-titles-i18n.generated.json";
import { listPremiumSchemaIds } from "@/lib/premium-schema/schema-registry";

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
  const en = (titles as Record<string, Record<string, unknown>>).en;
  _cachedFree = en ? Object.keys(en).length : 0;
  _cachedPremium = listPremiumSchemaIds().length;
  _cachedTotal = _cachedFree + _cachedPremium;
}

export function resetToolCountCache(): void {
  _cachedTotal = null;
  _cachedFree = null;
  _cachedPremium = null;
}
