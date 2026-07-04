/**
 * Dynamic tool counter - computes total tools at build/render time.
 * Uses compile-time constants (NOT server-only modules) so it works
 * when imported through client component chains (PageLayout→SiteHeader).
 */
import { GENERATED_CALCULATOR_SLUGS } from "@/lib/features/generated-tools/calculator-registry";
import { listPremiumSchemaIds } from "@/lib/features/premium-schema/schema-registry";
import { CANONICAL_FREE_SLUGS } from "@/lib/features/tools/canonical-tool-slugs";
import { industrialFormulaTools } from "@/lib/features/tools/revenue-tools-industrial-formulas";

let _cachedTotal: number | null = null;
let _cachedFree: number | null = null;
let _cachedPremium: number | null = null;

/** Industrial formula freeSlugs that have no generated schema file */
const INDUSTRIAL_FREE_SLUGS: readonly string[] = industrialFormulaTools
  .map((t) => t.freeSlug)
  .filter((s): s is string => Boolean(s));

/**
 * V5.3.1 PRO tool count — matches JSON files in src/sectorcalc/schemas/v531/.
 * Update when adding/removing PRO schemas.
 * The /pro-tools page loads these via getAllProToolSchemas().
 */
const V531_PRO_TOOL_COUNT = 135;

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

  // Add industrial freeSlugs that aren't already counted via generated schemas
  for (const slug of INDUSTRIAL_FREE_SLUGS) {
    if (!freeSchemaSet.has(slug)) {
      freeSchemaSet.add(slug);
    }
  }

  _cachedFree = freeSchemaSet.size;
  _cachedPremium = V531_PRO_TOOL_COUNT;
  _cachedTotal = _cachedFree + _cachedPremium;
}

export function resetToolCountCache(): void {
  _cachedTotal = null;
  _cachedFree = null;
  _cachedPremium = null;
}
