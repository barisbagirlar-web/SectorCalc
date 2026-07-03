/**
 * Dynamic tool counter - computes total tools at build/render time.
 * Uses static imports (resolved by Next.js/webpack at build time).
 */
import { GENERATED_CALCULATOR_SLUGS } from "@/lib/features/generated-tools/calculator-registry";
import { listPremiumSchemaIds } from "@/lib/features/premium-schema/schema-registry";
import { CANONICAL_FREE_SLUGS } from "@/lib/features/tools/canonical-tool-slugs";

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
  const activePremium = listPremiumSchemaIds();
  const activeAll = new Set([...GENERATED_CALCULATOR_SLUGS, ...activePremium]);
  const activeFree = CANONICAL_FREE_SLUGS.filter((slug) => activeAll.has(slug));
  const freeSchemaSet = new Set(activeFree);

  _cachedFree = activeFree.length;
  _cachedPremium = activePremium.filter((id) => !freeSchemaSet.has(id)).length;
  _cachedTotal = _cachedFree + _cachedPremium;
}

export function resetToolCountCache(): void {
  _cachedTotal = null;
  _cachedFree = null;
  _cachedPremium = null;
}
