import type { AiToolIndexRecord, AiToolSearchResult } from "@/lib/ai/tool-retrieval-types";
import { normalizeAiQuery, tokenizeAiQuery } from "@/lib/ai/normalize-ai-query";
import type { SupportedLocale } from "@/lib/i18n/locale-config";

export const AI_SEARCH_RANKING_WEIGHTS = {
  exactSlug: 100,
  exactTitle: 95,
  normalizedTitle: 88,
  aliasMatch: 84,
  categoryMatch: 72,
  intentMatch: 68,
  keywordMatch: 64,
  industryMatch: 52,
  descriptionMatch: 36,
  formulaMatch: 24,
  painMatch: 24,
  localeBoost: 12,
  tierFilterBoost: 8,
  embeddingSimilarity: 0,
} as const;

type RankCandidate = {
  readonly tool: AiToolIndexRecord;
  readonly score: number;
  readonly matchReasons: string[];
};

function normalizeComparable(value: string): string {
  return normalizeAiQuery(value).replace(/\s+/g, " ");
}

function pushMatch(candidate: RankCandidate, weight: number, reason: string, multiplier = 1): RankCandidate {
  return {
    tool: candidate.tool,
    score: candidate.score + weight * multiplier,
    matchReasons: candidate.matchReasons.includes(reason)
      ? candidate.matchReasons
      : [...candidate.matchReasons, reason],
  };
}

function resolveLocalizedText(record: Record<string, string>, locale: SupportedLocale): string {
  return record[locale] ?? record.en ?? record.tr ?? Object.values(record)[0] ?? "";
}

export function rankToolResults(input: {
  readonly tools: readonly AiToolIndexRecord[];
  readonly query: string;
  readonly locale: SupportedLocale;
  readonly limit: number;
}): readonly AiToolSearchResult[] {
  const normalizedQuery = normalizeAiQuery(input.query);
  const tokens = tokenizeAiQuery(input.query);
  const ranked: RankCandidate[] = [];

  for (const tool of input.tools) {
    let candidate: RankCandidate = { tool, score: 0, matchReasons: [] };
    const title = resolveLocalizedText(tool.title, input.locale);
    const description = resolveLocalizedText(tool.description, input.locale);
    const categoryTitle = resolveLocalizedText(tool.categoryTitle, input.locale);
    const normalizedTitle = normalizeComparable(title);
    const normalizedSlug = normalizeComparable(tool.slug.replace(/-/g, " "));

    if (normalizedQuery && normalizedQuery === normalizeComparable(tool.slug)) {
      candidate = pushMatch(candidate, AI_SEARCH_RANKING_WEIGHTS.exactSlug, "exact-slug");
    }

    if (normalizedQuery && normalizedTitle === normalizedQuery) {
      candidate = pushMatch(candidate, AI_SEARCH_RANKING_WEIGHTS.exactTitle, "exact-title");
    } else if (normalizedQuery && normalizedTitle.includes(normalizedQuery)) {
      candidate = pushMatch(candidate, AI_SEARCH_RANKING_WEIGHTS.normalizedTitle, "normalized-title");
    }

    if (normalizedQuery && normalizedSlug.includes(normalizedQuery.replace(/\s+/g, " "))) {
      candidate = pushMatch(candidate, AI_SEARCH_RANKING_WEIGHTS.aliasMatch, "slug-alias");
    }

    if (normalizedQuery && normalizeComparable(categoryTitle).includes(normalizedQuery)) {
      candidate = pushMatch(candidate, AI_SEARCH_RANKING_WEIGHTS.categoryMatch, "category-match");
    }

    for (const intent of tool.intent) {
      if (normalizedQuery && normalizeComparable(intent).includes(normalizedQuery)) {
        candidate = pushMatch(candidate, AI_SEARCH_RANKING_WEIGHTS.intentMatch, "intent-match");
      }
      for (const token of tokens) {
        if (normalizeComparable(intent).includes(token)) {
          candidate = pushMatch(candidate, AI_SEARCH_RANKING_WEIGHTS.intentMatch, "intent-token", 0.35);
        }
      }
    }

    const localeKeywords = tool.keywords[input.locale] ?? tool.keywords.en ?? [];
    for (const keyword of localeKeywords) {
      const normalizedKeyword = normalizeComparable(keyword);
      if (normalizedQuery && normalizedKeyword.includes(normalizedQuery)) {
        candidate = pushMatch(candidate, AI_SEARCH_RANKING_WEIGHTS.keywordMatch, "keyword-match");
      }
      for (const token of tokens) {
        if (normalizedKeyword.includes(token)) {
          candidate = pushMatch(candidate, AI_SEARCH_RANKING_WEIGHTS.keywordMatch, "keyword-token", 0.4);
        }
      }
    }

    for (const industry of tool.industries) {
      const normalizedIndustry = normalizeComparable(industry);
      if (normalizedQuery && normalizedIndustry.includes(normalizedQuery)) {
        candidate = pushMatch(candidate, AI_SEARCH_RANKING_WEIGHTS.industryMatch, "industry-match");
      }
      for (const token of tokens) {
        if (normalizedIndustry.includes(token)) {
          candidate = pushMatch(candidate, AI_SEARCH_RANKING_WEIGHTS.industryMatch, "industry-token", 0.35);
        }
      }
    }

    if (normalizedQuery && normalizeComparable(description).includes(normalizedQuery)) {
      candidate = pushMatch(candidate, AI_SEARCH_RANKING_WEIGHTS.descriptionMatch, "description-match");
    }

    if (tool.formula && normalizedQuery && normalizeComparable(tool.formula).includes(normalizedQuery)) {
      candidate = pushMatch(candidate, AI_SEARCH_RANKING_WEIGHTS.formulaMatch, "formula-match");
    }

    if (tool.pain && normalizedQuery && normalizeComparable(tool.pain).includes(normalizedQuery)) {
      candidate = pushMatch(candidate, AI_SEARCH_RANKING_WEIGHTS.painMatch, "pain-match");
    }

    for (const token of tokens) {
      if (normalizedTitle.includes(token)) {
        candidate = pushMatch(candidate, AI_SEARCH_RANKING_WEIGHTS.normalizedTitle, "title-token", 0.45);
      }
      if (normalizeComparable(tool.slug).includes(token)) {
        candidate = pushMatch(candidate, AI_SEARCH_RANKING_WEIGHTS.aliasMatch, "slug-token", 0.35);
      }
    }

    if (input.locale === "tr" && (tool.title.tr || tool.keywords.tr?.length)) {
      candidate = pushMatch(candidate, AI_SEARCH_RANKING_WEIGHTS.localeBoost, "locale-boost", 0.5);
    }

    if (candidate.score > 0) {
      ranked.push(candidate);
    }
  }

  return ranked
    .sort((a, b) => b.score - a.score || a.tool.slug.localeCompare(b.tool.slug))
    .slice(0, input.limit)
    .map((entry) => ({
      slug: entry.tool.slug,
      title: resolveLocalizedText(entry.tool.title, input.locale),
      description: resolveLocalizedText(entry.tool.description, input.locale),
      canonicalUrl: entry.tool.localeUrls[input.locale] ?? entry.tool.canonicalUrl,
      categorySlug: entry.tool.categorySlug,
      categoryTitle: resolveLocalizedText(entry.tool.categoryTitle, input.locale),
      tier: entry.tool.tier,
      routeStatus: entry.tool.routeStatus,
      score: Math.round(entry.score),
      matchReasons: entry.matchReasons,
    }));
}
