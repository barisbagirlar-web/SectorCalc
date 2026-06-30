/**
 * SectorCalc Assistant — static knowledge layer (P10).
 *
 * Builds a lightweight keyword index over the canonical premium tool registry
 * so the assistant can recommend the right tool deterministically, with no
 * external AI and no calculation.
 */

import { getAllRevenueToolSpecs } from "@/lib/tools/revenue-tools";
import type { AssistantSuggestion } from "@/lib/assistant/types";

type ToolIndexEntry = {
  readonly slug: string;
  readonly label: string;
  readonly href: string;
  readonly keywords: ReadonlySet<string>;
};

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "for", "to", "of", "in", "on", "my", "your",
  "tool", "calculator", "analyzer", "help", "need", "want", "how", "do", "i",
  "is", "are", "what", "with", "me", "can", "best", "good",
  "bir", "ve", "bu", "ile", "icin", "ben", "sen", "o", "biz",
  "siz", "onlar", "araci", "hesaplama", "hesaplayici", "analiz",
  "araç", "veya", "ama", "cok", "daha", "kadar", "gibi", "sonra",
  "once", "yani", "ancak", "ise", "mi", "mu", "de", "da",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s\u00C0-\u024F\u0600-\u06FF\-]/g, " ")
    .split(/[\s-]+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

const TOOL_INDEX: readonly ToolIndexEntry[] = getAllRevenueToolSpecs().map((tool) => {
  const keywordSource = [
    tool.sector,
    tool.paidTitle,
    tool.freeTitle,
    ...(tool.seoKeywords ?? []),
  ].join(" ");
  return {
    slug: tool.paidSlug,
    label: tool.paidTitle,
    href: `/tools/premium/${tool.paidSlug}`,
    keywords: new Set(tokenize(keywordSource)),
  };
});

const MAX_SUGGESTIONS = 3;

/** Rank premium tools by keyword overlap with the user message. */
export function matchTools(message: string): AssistantSuggestion[] {
  const tokens = new Set(tokenize(message));
  if (tokens.size === 0) {
    return [];
  }

  const scored = TOOL_INDEX.map((entry) => {
    let score = 0;
    for (const token of tokens) {
      if (entry.keywords.has(token)) {
        score += 1;
      }
    }
    return { entry, score };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_SUGGESTIONS);

  return scored.map(({ entry }) => ({
    slug: entry.slug,
    label: entry.label,
    href: entry.href,
  }));
}

/** Default navigation suggestions used by the fallback topic. */
export function defaultNavigationSuggestions(): AssistantSuggestion[] {
  return [
    { slug: "free-tools", label: "Free Calculators", href: "/free-tools" },
    { slug: "premium-tools", label: "Pro Calculators", href: "/pro-tools" },
    { slug: "pricing", label: "Pricing", href: "/pricing" },
  ];
}
