import "server-only";

import { getAiToolIndexRecord } from "@/lib/features/ai/tool-search-index";
import { matchTools } from "@/lib/features/assistant/knowledge";
import { routeAssistantSlug } from "@/lib/features/assistant/slug-router";
import { stripLocaleFromPath } from "@/lib/infrastructure/i18n/locale-routing";
import type { AssistantSuggestion } from "@/lib/features/assistant/types";

const MAX_RESULTS = 3;

function dedupeSuggestions(
  suggestions: readonly AssistantSuggestion[],
): AssistantSuggestion[] {
  const seen = new Set<string>();
  const output: AssistantSuggestion[] = [];

  for (const suggestion of suggestions) {
    if (seen.has(suggestion.slug)) {
      continue;
    }
    seen.add(suggestion.slug);
    output.push(suggestion);
    if (output.length >= MAX_RESULTS) {
      break;
    }
  }

  return output;
}

function suggestionFromSlug(slug: string, locale: string): AssistantSuggestion | undefined {
  const indexed = getAiToolIndexRecord(slug);
  if (!indexed) {
    return undefined;
  }

  const localizedUrl = indexed.localeUrls[locale] ?? indexed.localeUrls.en ?? indexed.canonicalUrl;
  const rawHref = localizedUrl.replace(/^https?:\/\/[^/]+/, "") || `/tools/generated/${slug}`;
  const href = stripLocaleFromPath(rawHref);
  const label = indexed.title[locale] ?? indexed.title.en ?? slug;

  return { slug, label, href };
}

/** Keyword + router pipeline — vector search hook point for later Pinecone/Supabase. */
export async function findBestTools(
  query: string,
  locale: string,
): Promise<AssistantSuggestion[]> {
  const keywordMatches = matchTools(query);
  const routed = await routeAssistantSlug(query, locale);
  const routedSuggestion = routed.suggestion ? [routed.suggestion] : [];

  const slugSuggestions = routed.slug
    ? [suggestionFromSlug(routed.slug, locale)].filter(
        (entry): entry is AssistantSuggestion => entry !== undefined,
      )
    : [];

  return dedupeSuggestions([...routedSuggestion, ...slugSuggestions, ...keywordMatches]);
}
