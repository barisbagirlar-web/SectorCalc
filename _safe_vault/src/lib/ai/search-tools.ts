import { rankToolResults } from "@/lib/ai/rank-tool-results";
import { listAiToolIndexRecords } from "@/lib/ai/tool-search-index";
import type { AiToolSearchOptions, AiToolSearchResult } from "@/lib/ai/tool-retrieval-types";
import type { SupportedLocale } from "@/lib/i18n/locale-config";
import { normalizeAiQuery } from "@/lib/ai/normalize-ai-query";

function filterTools(
  tools: ReturnType<typeof listAiToolIndexRecords>,
  options?: AiToolSearchOptions,
) {
  return tools.filter((tool) => {
    if (options?.tier && options.tier !== "all") {
      const tierMatch =
        options.tier === "free"
          ? tool.tier === "free"
          : tool.tier === "premium" || tool.tier === "premium-schema";
      if (!tierMatch) {
        return false;
      }
    }
    if (options?.categorySlug && tool.categorySlug !== options.categorySlug) {
      return false;
    }
    if (options?.routeStatus && options.routeStatus !== "all") {
      if (tool.routeStatus !== options.routeStatus) {
        return false;
      }
    }
    return true;
  });
}

export function searchSectorCalcTools(
  query: string,
  locale: SupportedLocale,
  options?: AiToolSearchOptions,
): AiToolSearchResult[] {
  const normalizedQuery = normalizeAiQuery(query);
  const limit = Math.min(Math.max(options?.limit ?? 8, 3), 8);
  const tools = filterTools(listAiToolIndexRecords(), options);

  if (!normalizedQuery) {
    return [];
  }

  return [...rankToolResults({ tools, query, locale, limit })];
}
