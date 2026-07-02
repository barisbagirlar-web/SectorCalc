/**
 * Regeneration baseline - no free→premium migration layer (canonical slug lists only).
 */

import type { GlobalToolCategorySlug } from "@/lib/catalog/global-tool-category-taxonomy";

export type FreeToolCandidate = {
  readonly slug: string;
  readonly titleTr: string;
  readonly titleEn: string;
  readonly source: "traffic" | "revenue";
};

export type FreeToPremiumMigrationMatchMethod =
  | "exact-slug"
  | "exact-title"
  | "normalized-title"
  | "slug-alias"
  | "slug-similarity";

export type FreeToPremiumMigrationMatch = {
  readonly listTitle: string;
  readonly wave: 1 | 2;
  readonly slug: string;
  readonly matchedTitle: string;
  readonly matchMethod: FreeToPremiumMigrationMatchMethod;
  readonly categorySlug: GlobalToolCategorySlug;
};

export type FreeToPremiumMigrationReport = {
  readonly listTotal: number;
  readonly wave1Total: number;
  readonly wave2Total: number;
  readonly matched: readonly FreeToPremiumMigrationMatch[];
  readonly notFoundInFreeTools: readonly string[];
  readonly duplicateSlugWarnings: readonly string[];
};

const EMPTY_REPORT: FreeToPremiumMigrationReport = {
  listTotal: 0,
  wave1Total: 0,
  wave2Total: 0,
  matched: [],
  notFoundInFreeTools: [],
  duplicateSlugWarnings: [],
};

export function normalizeMigrationTitle(value: string): string {
  return value.trim().toLowerCase();
}

export function listFreeToolCandidates(): readonly FreeToolCandidate[] {
  return [];
}

export function buildFreeToPremiumMigrationReport(): FreeToPremiumMigrationReport {
  return EMPTY_REPORT;
}

export function listMigratedPremiumSlugs(): ReadonlySet<string> {
  return new Set();
}

export function isFreeToolMigratedToPremium(_slug: string): boolean {
  return false;
}

export function getFreeToPremiumMigrationMatch(
  _slug: string,
): FreeToPremiumMigrationMatch | undefined {
  return undefined;
}

export function listMigratedPremiumRouteSlugs(): readonly string[] {
  return [];
}

export function listUnmigratedFreeTrafficTools(): readonly string[] {
  return [];
}
