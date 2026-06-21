/**
 * Dynamic tool counter — computes total tools at build/render time.
 * Uses static imports (resolved by Next.js/webpack at build time).
 */
import titles from "@/data/generated-tool-titles-i18n.generated.json";
import { listPremiumSchemaIds } from "@/lib/premium-schema/schema-registry";

let _cachedTotal: number | null = null;

export function getTotalToolCount(): number {
  if (_cachedTotal !== null) return _cachedTotal;

  const en = (titles as Record<string, Record<string, unknown>>).en;
  const freeCount = en ? Object.keys(en).length : 0;
  const premiumCount = listPremiumSchemaIds().length;

  _cachedTotal = freeCount + premiumCount;
  return _cachedTotal;
}

export function resetToolCountCache(): void {
  _cachedTotal = null;
}
