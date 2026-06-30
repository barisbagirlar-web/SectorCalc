import type { AppLocale } from "@/i18n/locales";
import type { SectorcalcAiKnowledgeItem } from "./types";

const BASE_KNOWLEDGE: readonly Omit<SectorcalcAiKnowledgeItem, "locale">[] = [
  {
    id: "platform-overview",
    sourceSection: "platform",
    question: "What is SectorCalc?",
    normalizedQuestion: "what is sectorcalc platform calculators",
    safeAnswer:
      "SectorCalc offers sector-specific free calculators and premium decision reports for margin, cost, and operational risk.",
    intent: "general_platform_question",
    accessType: "unknown",
    relatedToolSlugs: [],
    relatedCategoryIds: [],
    status: "live",
    ctaType: "open_calculator_library",
    riskLevel: "low",
    forbiddenClaimRemoved: false,
  },
  {
    id: "free-tools",
    sourceSection: "catalog",
    question: "Where are free calculators?",
    normalizedQuestion: "free calculator tools catalog",
    safeAnswer:
      "Browse free calculators by industry from the catalog. Each tool runs in your browser for quick checks.",
    intent: "free_tool_lookup",
    accessType: "free",
    relatedToolSlugs: ["machine-time-calculator"],
    relatedCategoryIds: ["manufacturing"],
    status: "live",
    ctaType: "open_free_tools",
    riskLevel: "low",
    forbiddenClaimRemoved: false,
  },
  {
    id: "premium-reports",
    sourceSection: "pricing",
    question: "What are premium decision reports?",
    normalizedQuestion: "premium decision report pricing",
    safeAnswer:
      "Premium tools provide structured decision reports with hidden drivers, thresholds, and suggested actions. They are technical simulations, not legal or financial advice.",
    intent: "premium_tool_lookup",
    accessType: "premium",
    relatedToolSlugs: [],
    relatedCategoryIds: [],
    status: "live",
    ctaType: "open_premium_tools",
    riskLevel: "medium",
    forbiddenClaimRemoved: false,
  },
  {
    id: "legal-disclaimer",
    sourceSection: "legal",
    question: "Is this legal or financial advice?",
    normalizedQuestion: "legal financial engineering advice disclaimer",
    safeAnswer:
      "No. Outputs are technical simulations. Verify results before business, legal, or engineering decisions.",
    intent: "legal_or_compliance_question",
    accessType: "unknown",
    relatedToolSlugs: [],
    relatedCategoryIds: [],
    status: "live",
    ctaType: "no_link",
    riskLevel: "high",
    forbiddenClaimRemoved: false,
  },
];

export function getDefaultKnowledgeItems(locale: AppLocale): SectorcalcAiKnowledgeItem[] {
  return BASE_KNOWLEDGE.map((item) => ({ ...item, locale }));
}
