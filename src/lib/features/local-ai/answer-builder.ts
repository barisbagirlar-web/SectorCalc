import type { AppLocale } from "@/i18n/locales";
import { getDefaultKnowledgeItems } from "./knowledge";
import { buildDisclaimer, sanitizeKnowledgeItem } from "./safety-filter";
import type {
  CTA_Type,
  SectorcalcAnswerBuilderInput,
  SectorcalcAnswerBuilderOutput,
  SectorcalcAiKnowledgeItem,
} from "./types";

function resolveCtaUrl(ctaType: CTA_Type, locale: AppLocale): string | undefined {
  switch (ctaType) {
    case "open_free_tools":
      return locale === "en" ? "/tools/free" : `/${locale}/tools/free`;
    case "open_premium_tools":
      return locale === "en" ? "/pricing" : `/${locale}/pricing`;
    case "open_calculator_library":
      return locale === "en" ? "/industries" : `/${locale}/industries`;
    default:
      return undefined;
  }
}

function pickKnowledgeItem(
  items: readonly SectorcalcAiKnowledgeItem[],
  matchedIds: readonly string[],
): SectorcalcAiKnowledgeItem | undefined {
  if (matchedIds.length === 0) {
    return items[0];
  }
  return items.find((item) => matchedIds.includes(item.id)) ?? items[0];
}

export function buildLocalAiAnswer(params: SectorcalcAnswerBuilderInput): SectorcalcAnswerBuilderOutput {
  const knowledgeItems = getDefaultKnowledgeItems(params.locale);
  const routeResult = params.routeResult;
  const knowledge = pickKnowledgeItem(knowledgeItems, routeResult.matchedKnowledgeIds);
  const safeItem = knowledge ? sanitizeKnowledgeItem(knowledge) : undefined;

  if (routeResult.recommendedAction === "ask_clarification") {
    return {
      answer: "Which sector or calculator are you looking for? Try mentioning an industry or free vs premium.",
      ctaLabel: "Explore calculators",
      ctaUrl: resolveCtaUrl("open_calculator_library", params.locale),
      relatedTools: [],
      sourceIds: [],
      confidence: routeResult.confidence,
      disclaimer: buildDisclaimer(params.locale),
    };
  }

  const answer = safeItem?.safeAnswer ?? "SectorCalc helps you run sector calculators and premium decision reports.";
  const ctaType = safeItem?.ctaType ?? "open_calculator_library";

  return {
    answer,
    ctaLabel:
      ctaType === "open_free_tools"
        ? "Browse free tools"
        : ctaType === "open_premium_tools"
          ? "View premium tools"
          : "Explore calculators",
    ctaUrl: resolveCtaUrl(ctaType, params.locale),
    relatedTools: routeResult.matchedToolSlugs.map((slug) => ({
      slug,
      title: slug,
      accessType: routeResult.accessType,
    })),
    sourceIds: safeItem ? [safeItem.id] : [],
    confidence: routeResult.confidence,
    disclaimer: buildDisclaimer(params.locale),
  };
}
