import { assertValidGlobalCategorySlug } from "@/lib/catalog/global-tool-category-taxonomy";
import {
  FORCE_FREE_SIMPLE_FINANCE_SLUGS,
  FREE_TO_PREMIUM_CATEGORY_OVERRIDES,
  FREE_TO_PREMIUM_KNOWN_SLUG_ALIASES,
  FREE_TO_PREMIUM_TITLE_LIST_TR,
  FREE_TO_PREMIUM_WAVE_2,
  type FreeToPremiumMigrationTitle,
  type FreeToPremiumWave2Item,
} from "@/lib/freemium/free-to-premium-migration-list";
import { resolveFreeToolLocalizedCopy } from "@/lib/i18n/free-tool-i18n";
import { getLocalizedRevenueToolTitle } from "@/data/revenue-tools-i18n";
import { FREE_TRAFFIC_TOOLS } from "@/lib/tools/free-traffic-catalog";
import { revenueTools } from "@/lib/tools/revenue-tools";
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

const TITLE_SUFFIXES =
  /\b(hesaplama|hesaplayici|hesabi|hesabı|kontrolu|kontrolü|kontrol|panosu|panos|calculation|calculator|rechner)\b/gi;

const FORCE_FREE_SLUG_SET = new Set<string>(FORCE_FREE_SIMPLE_FINANCE_SLUGS);

export function normalizeMigrationTitle(value: string): string {
  return value
    .toLowerCase()
    .replace(/[ıİ]/g, "i")
    .replace(/[şŞ]/g, "s")
    .replace(/[ğĞ]/g, "g")
    .replace(/[üÜ]/g, "u")
    .replace(/[öÖ]/g, "o")
    .replace(/[çÇ]/g, "c")
    .replace(/[–—−-]/g, " ")
    .replace(/[()]/g, " ")
    .replace(/[²]/g, "2")
    .replace(/\s+/g, " ")
    .replace(TITLE_SUFFIXES, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugTokens(slug: string): string[] {
  return slug.split("-").filter(Boolean);
}

function slugSimilarity(left: string, right: string): number {
  const a = new Set(slugTokens(left));
  const b = new Set(slugTokens(right));
  let overlap = 0;
  for (const token of a) {
    if (b.has(token)) overlap += 1;
  }
  return overlap / Math.max(a.size, b.size, 1);
}

export function listFreeToolCandidates(): readonly FreeToolCandidate[] {
  const candidates: FreeToolCandidate[] = [];

  for (const tool of FREE_TRAFFIC_TOOLS) {
    const copy = resolveFreeToolLocalizedCopy(tool.slug, "tr");
    candidates.push({
      slug: tool.slug,
      titleTr: copy.title || tool.title,
      titleEn: tool.title,
      source: "traffic",
    });
  }

  for (const tool of revenueTools) {
    candidates.push({
      slug: tool.freeSlug,
      titleTr: getLocalizedRevenueToolTitle(tool.freeSlug, "free", "tr", tool.freeTitle),
      titleEn: tool.freeTitle,
      source: "revenue",
    });
  }

  return candidates;
}

export function resolveMigrationCategorySlug(title: FreeToPremiumMigrationTitle) {
  const slug = FREE_TO_PREMIUM_CATEGORY_OVERRIDES[title];
  return assertValidGlobalCategorySlug(slug);
}

export function resolveWave2CategorySlug(categorySlug: GlobalToolCategorySlug) {
  return assertValidGlobalCategorySlug(categorySlug);
}

function buildMatch(
  listTitle: string,
  wave: 1 | 2,
  candidate: FreeToolCandidate,
  matchMethod: FreeToPremiumMigrationMatchMethod,
  categorySlug: GlobalToolCategorySlug,
): FreeToPremiumMigrationMatch {
  return {
    listTitle,
    wave,
    slug: candidate.slug,
    matchedTitle: candidate.titleTr,
    matchMethod,
    categorySlug,
  };
}

function findMatchForTitle(
  listTitle: FreeToPremiumMigrationTitle,
  candidates: readonly FreeToolCandidate[],
): FreeToPremiumMigrationMatch | null {
  const exact = candidates.find((candidate) => candidate.titleTr === listTitle);
  if (exact) {
    return buildMatch(
      listTitle,
      1,
      exact,
      "exact-title",
      resolveMigrationCategorySlug(listTitle),
    );
  }

  const normalizedTarget = normalizeMigrationTitle(listTitle);
  const normalized = candidates.find(
    (candidate) => normalizeMigrationTitle(candidate.titleTr) === normalizedTarget,
  );
  if (normalized) {
    return buildMatch(
      listTitle,
      1,
      normalized,
      "normalized-title",
      resolveMigrationCategorySlug(listTitle),
    );
  }

  for (const [aliasSlug, canonicalSlug] of Object.entries(FREE_TO_PREMIUM_KNOWN_SLUG_ALIASES)) {
    const candidate = candidates.find((entry) => entry.slug === canonicalSlug || entry.slug === aliasSlug);
    if (candidate && normalizeMigrationTitle(candidate.titleTr) === normalizedTarget) {
      return buildMatch(
        listTitle,
        1,
        candidate,
        "slug-alias",
        resolveMigrationCategorySlug(listTitle),
      );
    }
  }

  let best: FreeToolCandidate | null = null;
  let bestScore = 0;
  for (const candidate of candidates) {
    const titleScore =
      normalizeMigrationTitle(candidate.titleTr).includes(normalizedTarget.slice(0, 18)) ||
      normalizedTarget.includes(normalizeMigrationTitle(candidate.titleTr).slice(0, 18))
        ? 0.75
        : 0;
    const slugScore = slugSimilarity(candidate.slug, listTitle);
    const score = Math.max(titleScore, slugScore);
    if (score > bestScore) {
      bestScore = score;
      best = candidate;
    }
  }

  if (best && bestScore >= 0.55) {
    return buildMatch(
      listTitle,
      1,
      best,
      "slug-similarity",
      resolveMigrationCategorySlug(listTitle),
    );
  }

  return null;
}

function findMatchForWave2Item(
  item: FreeToPremiumWave2Item,
  candidates: readonly FreeToolCandidate[],
): FreeToPremiumMigrationMatch | null {
  const categorySlug = resolveWave2CategorySlug(item.categorySlug);

  for (const slugCandidate of item.slugCandidates) {
    const exactSlug = candidates.find((candidate) => candidate.slug === slugCandidate);
    if (exactSlug) {
      return buildMatch(item.titleTr, 2, exactSlug, "exact-slug", categorySlug);
    }
  }

  const exactTitle = candidates.find(
    (candidate) => candidate.titleTr === item.titleTr || candidate.titleEn === item.titleTr,
  );
  if (exactTitle) {
    return buildMatch(item.titleTr, 2, exactTitle, "exact-title", categorySlug);
  }

  const normalizedTarget = normalizeMigrationTitle(item.titleTr);
  const normalized = candidates.find(
    (candidate) => normalizeMigrationTitle(candidate.titleTr) === normalizedTarget,
  );
  if (normalized) {
    return buildMatch(item.titleTr, 2, normalized, "normalized-title", categorySlug);
  }

  for (const slugCandidate of item.slugCandidates) {
    for (const [aliasSlug, canonicalSlug] of Object.entries(FREE_TO_PREMIUM_KNOWN_SLUG_ALIASES)) {
      if (slugCandidate !== aliasSlug && slugCandidate !== canonicalSlug) {
        continue;
      }
      const candidate = candidates.find(
        (entry) => entry.slug === canonicalSlug || entry.slug === aliasSlug,
      );
      if (candidate) {
        return buildMatch(item.titleTr, 2, candidate, "slug-alias", categorySlug);
      }
    }
  }

  return null;
}

function isForcedFreeSlug(slug: string): boolean {
  return FORCE_FREE_SLUG_SET.has(slug);
}

let cachedReport: FreeToPremiumMigrationReport | null = null;

export function buildFreeToPremiumMigrationReport(): FreeToPremiumMigrationReport {
  if (cachedReport) {
    return cachedReport;
  }

  const candidates = listFreeToolCandidates();
  const matchedBySlug = new Map<string, FreeToPremiumMigrationMatch>();
  const notFoundInFreeTools: string[] = [];
  const categoryConflicts = new Set<string>();

  const registerMatch = (match: FreeToPremiumMigrationMatch) => {
    const existing = matchedBySlug.get(match.slug);
    if (existing && existing.categorySlug !== match.categorySlug) {
      categoryConflicts.add(match.slug);
    }
    if (!existing) {
      matchedBySlug.set(match.slug, match);
    }
  };

  for (const listTitle of FREE_TO_PREMIUM_TITLE_LIST_TR) {
    const match = findMatchForTitle(listTitle, candidates);
    if (!match) {
      notFoundInFreeTools.push(listTitle);
      continue;
    }
    if (isForcedFreeSlug(match.slug)) {
      continue;
    }
    registerMatch(match);
  }

  for (const item of FREE_TO_PREMIUM_WAVE_2) {
    const match = findMatchForWave2Item(item, candidates);
    if (!match) {
      notFoundInFreeTools.push(item.titleTr);
      continue;
    }
    if (isForcedFreeSlug(match.slug)) {
      continue;
    }
    registerMatch(match);
  }

  const matched = [...matchedBySlug.values()].sort((a, b) => a.slug.localeCompare(b.slug));
  const duplicateSlugWarnings = [...categoryConflicts];

  cachedReport = {
    listTotal: FREE_TO_PREMIUM_TITLE_LIST_TR.length + FREE_TO_PREMIUM_WAVE_2.length,
    wave1Total: FREE_TO_PREMIUM_TITLE_LIST_TR.length,
    wave2Total: FREE_TO_PREMIUM_WAVE_2.length,
    matched,
    notFoundInFreeTools,
    duplicateSlugWarnings,
  };
  return cachedReport;
}

export function getMigratedFreeToolSlugSet(): ReadonlySet<string> {
  return new Set(buildFreeToPremiumMigrationReport().matched.map((entry) => entry.slug));
}

export function isFreeToolMigratedToPremium(slug: string): boolean {
  return getMigratedFreeToolSlugSet().has(slug);
}

export function getMigrationMatchBySlug(slug: string): FreeToPremiumMigrationMatch | undefined {
  return buildFreeToPremiumMigrationReport().matched.find((entry) => entry.slug === slug);
}

export function listMigratedPremiumRouteSlugs(): readonly string[] {
  return [...getMigratedFreeToolSlugSet()].sort((a, b) => a.localeCompare(b));
}

export function listPublicFreeToolSlugsExcludingMigrated(): readonly string[] {
  const migrated = getMigratedFreeToolSlugSet();
  const slugs = new Set<string>();
  for (const tool of revenueTools) {
    if (!migrated.has(tool.freeSlug)) {
      slugs.add(tool.freeSlug);
    }
  }
  for (const tool of FREE_TRAFFIC_TOOLS) {
    if (!migrated.has(tool.slug)) {
      slugs.add(tool.slug);
    }
  }
  return [...slugs].sort((a, b) => a.localeCompare(b));
}

export function listPublicFreeTrafficTools() {
  const migrated = getMigratedFreeToolSlugSet();
  return FREE_TRAFFIC_TOOLS.filter((tool) => !migrated.has(tool.slug));
}

export function listForcedFreeSimpleFinanceSlugs(): readonly string[] {
  return [...FORCE_FREE_SIMPLE_FINANCE_SLUGS];
}
