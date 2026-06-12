import { assertValidGlobalCategorySlug } from "@/lib/catalog/global-tool-category-taxonomy";
import {
  FREE_TO_PREMIUM_CATEGORY_OVERRIDES,
  FREE_TO_PREMIUM_KNOWN_SLUG_ALIASES,
  FREE_TO_PREMIUM_TITLE_LIST_TR,
  type FreeToPremiumMigrationTitle,
} from "@/lib/freemium/free-to-premium-migration-list";
import { resolveFreeToolLocalizedCopy } from "@/lib/i18n/free-tool-i18n";
import { getLocalizedRevenueToolTitle } from "@/data/revenue-tools-i18n";
import { FREE_TRAFFIC_TOOLS } from "@/lib/tools/free-traffic-catalog";
import { revenueTools } from "@/lib/tools/revenue-tools";

export type FreeToolCandidate = {
  readonly slug: string;
  readonly titleTr: string;
  readonly titleEn: string;
  readonly source: "traffic" | "revenue";
};

export type FreeToPremiumMigrationMatch = {
  readonly listTitle: FreeToPremiumMigrationTitle;
  readonly slug: string;
  readonly matchedTitle: string;
  readonly matchMethod: "exact-title" | "normalized-title" | "slug-alias" | "slug-similarity";
  readonly categorySlug: ReturnType<typeof resolveMigrationCategorySlug>;
};

export type FreeToPremiumMigrationReport = {
  readonly listTotal: number;
  readonly matched: readonly FreeToPremiumMigrationMatch[];
  readonly notFoundInFreeTools: readonly FreeToPremiumMigrationTitle[];
  readonly duplicateSlugWarnings: readonly string[];
};

const TITLE_SUFFIXES =
  /\b(hesaplama|hesaplayici|hesabi|hesabı|kontrolu|kontrolü|kontrol|panosu|panos|calculation|calculator|rechner)\b/gi;

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

function findMatchForTitle(
  listTitle: FreeToPremiumMigrationTitle,
  candidates: readonly FreeToolCandidate[],
): FreeToPremiumMigrationMatch | null {
  const exact = candidates.find((candidate) => candidate.titleTr === listTitle);
  if (exact) {
    return {
      listTitle,
      slug: exact.slug,
      matchedTitle: exact.titleTr,
      matchMethod: "exact-title",
      categorySlug: resolveMigrationCategorySlug(listTitle),
    };
  }

  const normalizedTarget = normalizeMigrationTitle(listTitle);
  const normalized = candidates.find(
    (candidate) => normalizeMigrationTitle(candidate.titleTr) === normalizedTarget,
  );
  if (normalized) {
    return {
      listTitle,
      slug: normalized.slug,
      matchedTitle: normalized.titleTr,
      matchMethod: "normalized-title",
      categorySlug: resolveMigrationCategorySlug(listTitle),
    };
  }

  for (const [aliasSlug, canonicalSlug] of Object.entries(FREE_TO_PREMIUM_KNOWN_SLUG_ALIASES)) {
    const candidate = candidates.find((entry) => entry.slug === canonicalSlug || entry.slug === aliasSlug);
    if (candidate && normalizeMigrationTitle(candidate.titleTr) === normalizedTarget) {
      return {
        listTitle,
        slug: candidate.slug,
        matchedTitle: candidate.titleTr,
        matchMethod: "slug-alias",
        categorySlug: resolveMigrationCategorySlug(listTitle),
      };
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
    return {
      listTitle,
      slug: best.slug,
      matchedTitle: best.titleTr,
      matchMethod: "slug-similarity",
      categorySlug: resolveMigrationCategorySlug(listTitle),
    };
  }

  return null;
}

let cachedReport: FreeToPremiumMigrationReport | null = null;

export function buildFreeToPremiumMigrationReport(): FreeToPremiumMigrationReport {
  if (cachedReport) {
    return cachedReport;
  }

  const candidates = listFreeToolCandidates();
  const matched: FreeToPremiumMigrationMatch[] = [];
  const notFoundInFreeTools: FreeToPremiumMigrationTitle[] = [];
  const slugCounts = new Map<string, number>();

  for (const listTitle of FREE_TO_PREMIUM_TITLE_LIST_TR) {
    const match = findMatchForTitle(listTitle, candidates);
    if (!match) {
      notFoundInFreeTools.push(listTitle);
      continue;
    }
    matched.push(match);
    slugCounts.set(match.slug, (slugCounts.get(match.slug) ?? 0) + 1);
  }

  const duplicateSlugWarnings = [...slugCounts.entries()]
    .filter(([, count]) => count > 1)
    .map(([slug]) => slug);

  cachedReport = {
    listTotal: FREE_TO_PREMIUM_TITLE_LIST_TR.length,
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
