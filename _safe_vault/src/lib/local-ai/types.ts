/**
 * SectorCalc Local AI Knowledge & Routing Types
 */

import type { AppLocale } from "@/i18n/locales";

export type SectorcalcAiIntent =
  | "free_tool_lookup"
  | "premium_tool_lookup"
  | "calculation_guidance"
  | "pricing_question"
  | "account_question"
  | "legal_or_compliance_question"
  | "technical_engineering_question"
  | "energy_carbon_question"
  | "sector_specific_question"
  | "general_platform_question"
  | "unknown";

export type ToolAccessType = "free" | "premium" | "roadmap" | "unknown";

export type KnowledgeAnswerMode =
  | "direct_answer"
  | "guide_to_free_tool"
  | "guide_to_premium_tool"
  | "explain_then_route"
  | "safe_decline"
  | "ask_minimal_clarifying_question";

export type CTA_Type =
  | "open_free_tool"
  | "open_premium_tool"
  | "open_free_tools"
  | "open_premium_tools"
  | "open_calculator_library"
  | "no_link";

export interface SectorcalcAiKnowledgeItem {
  id: string;
  locale: AppLocale;
  sourceSection: string;
  question: string;
  normalizedQuestion: string;
  answerDraft?: string;
  safeAnswer: string;
  intent: SectorcalcAiIntent;
  accessType: ToolAccessType;
  relatedToolSlugs: string[];
  relatedCategoryIds: string[];
  status: "live" | "planned" | "unknown";
  ctaType: CTA_Type;
  riskLevel: "low" | "medium" | "high";
  forbiddenClaimRemoved: boolean;
}

export interface SectorcalcIntentRouterResult {
  intent: SectorcalcAiIntent;
  confidence: number;
  matchedKnowledgeIds: string[];
  matchedToolSlugs: string[];
  accessType: ToolAccessType;
  recommendedAction: "answer_directly" | "route_to_tool" | "ask_clarification" | "decline";
}

export interface SectorcalcAnswerBuilderInput {
  input: string;
  locale: AppLocale;
  routeResult: SectorcalcIntentRouterResult;
}

export interface SectorcalcAnswerBuilderOutput {
  answer: string;
  ctaLabel: string;
  ctaUrl?: string;
  relatedTools: Array<{
    slug: string;
    title: string;
    accessType: ToolAccessType;
  }>;
  sourceIds: string[];
  confidence: number;
  disclaimer?: string;
}

export interface LocalAiApiRequest {
  message: string;
  locale: AppLocale;
}

export interface LocalAiApiResponse {
  answer: string;
  ctaLabel: string;
  ctaUrl?: string;
  relatedTools?: Array<{
    slug: string;
    title: string;
  }>;
  confidence: number;
  sourceIds?: string[];
}
