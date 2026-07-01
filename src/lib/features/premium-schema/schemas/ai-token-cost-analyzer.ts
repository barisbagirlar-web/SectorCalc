/**
 * AI Token Cost Analyzer — Premium Calculator Schema
 *
 * Formulas: BasePromptCost → BaseCompletionCost → CacheReadCost →
 *           MonthlyProjection → TCO
 * Personas: DevOps, ML Engineer, CFO
 */

import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

const MODEL_TIER_OPTIONS = [
  { value: "standard", label: "Standard", label_i18n: {"en":"Standard"} },
  { value: "pro", label: "Pro", label_i18n: {"en":"Pro"} },
  { value: "enterprise", label: "Enterprise", label_i18n: {"en":"Enterprise"} },
] as const;

export const AI_TOKEN_COST_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "ai-token-cost-analyzer",
  legacyPaidSlug: "ai-token-cost-analyzer",
  name: "AI Token Cost Analyzer", name_i18n: {"en":"AI Token Cost Analyzer"},
  sectorSlug: "it-cloud",
  category: "cost",
  painStatement:
    "LLM API costs grow silently with usage. Without a structured TCO model, teams miss cache savings and seasonal spikes — leading to budget overruns.", painStatement_i18n: {"en":"LLM API costs grow silently with usage. Without a structured TCO model, teams miss cache savings and seasonal spikes — leading to budget overruns."},
  inputs: [
    { id: "dailyRequests", label: "Gunluk API Request", label_i18n: {"en":"Daily API Requests"}, type: "number", unit: "adet", required: true, smartDefault: 10000, validation: { min: 1, max: 100_000_000 }, helper: "Total LLM API calls per day.", helper_i18n: {"en":"Total LLM API calls per day."}, expertMeaning: "Daily inference request count", expertMeaning_i18n: {"en":"Daily inference request count"} },
    { id: "promptTokens", label: "Ortalama Prompt Token", label_i18n: {"en":"Avg Prompt Tokens"}, type: "number", unit: "token", required: true, smartDefault: 2000, validation: { min: 1, max: 1_000_000 }, helper: "Average input token count per request.", helper_i18n: {"en":"Average input token count per request."}, expertMeaning: "Prompt tokens per request", expertMeaning_i18n: {"en":"Prompt tokens per request"} },
    { id: "completionTokens", label: "Ortalama Completion Token", label_i18n: {"en":"Avg Completion Tokens"}, type: "number", unit: "token", required: true, smartDefault: 500, validation: { min: 1, max: 1_000_000 }, helper: "Average output token count per request.", helper_i18n: {"en":"Average output token count per request."}, expertMeaning: "Completion tokens per request", expertMeaning_i18n: {"en":"Completion tokens per request"} },
    { id: "cacheHitRatio", label: "Cache Hit Ratio", label_i18n: {"en":"Cache Hit Ratio"}, type: "number", unit: "%", required: true, smartDefault: 25, validation: { min: 0, max: 100 }, helper: "% of tokens served from prompt cache.", helper_i18n: {"en":"% of tokens served from prompt cache."}, expertMeaning: "Reduces effective cost", expertMeaning_i18n: {"en":"Reduces effective cost"} },
    { id: "promptPrice", label: "Model Prompt Price", label_i18n: {"en":"Model Prompt Price"}, type: "number", unit: "USD/1M tok", required: true, smartDefault: 15, validation: { min: 0.1, max: 500 }, helper: "Price per million prompt tokens.", helper_i18n: {"en":"Price per million prompt tokens."}, expertMeaning: "Per-model input token price", expertMeaning_i18n: {"en":"Per-model input token price"} },
    { id: "completionPrice", label: "Model Completion Price", label_i18n: {"en":"Model Completion Price"}, type: "number", unit: "USD/1M tok", required: true, smartDefault: 60, validation: { min: 0.1, max: 500 }, helper: "Price per million completion tokens.", helper_i18n: {"en":"Price per million completion tokens."}, expertMeaning: "Per-model output token price", expertMeaning_i18n: {"en":"Per-model output token price"} },
    { id: "cacheReadPrice", label: "Cache Read Price", label_i18n: {"en":"Cache Read Price"}, type: "number", unit: "USD/1M tok", required: false, smartDefault: 7.5, validation: { min: 0, max: 500 }, helper: "Price per million cached read tokens.", helper_i18n: {"en":"Price per million cached read tokens."}, expertMeaning: "Typically 50% of prompt price", expertMeaning_i18n: {"en":"Typically 50% of prompt price"} },
    { id: "monthlyGrowthRate", label: "Monthly Growth Rate", label_i18n: {"en":"Monthly Growth Rate"}, type: "number", unit: "%", required: true, smartDefault: 10, validation: { min: 0, max: 500 }, helper: "Month-over-month volume growth.", helper_i18n: {"en":"Month-over-month volume growth."}, expertMeaning: "MoM growth rate", expertMeaning_i18n: {"en":"MoM growth rate"} },
    { id: "confidenceBuffer", label: "Guven Tamponu", label_i18n: {"en":"Safety Buffer"}, type: "number", unit: "%", required: false, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "Safety margin on projection.", helper_i18n: {"en":"Safety margin on projection."}, expertMeaning: "Contingency buffer", expertMeaning_i18n: {"en":"Contingency buffer"} },
    { id: "infraOverhead", label: "Infrastructure Overhead", label_i18n: {"en":"Infrastructure Overhead"}, type: "number", unit: "USD/ay", required: false, smartDefault: 500, validation: { min: 0, max: 1_000_000 }, helper: "GPU/server/orchestration costs.", helper_i18n: {"en":"GPU/server/orchestration costs."}, expertMeaning: "Non-API monthly infra cost", expertMeaning_i18n: {"en":"Non-API monthly infra cost"} },
    { id: "fallbackCost", label: "Fallback Model Maliyeti", label_i18n: {"en":"Fallback Model Cost"}, type: "number", unit: "USD/ay", required: false, smartDefault: 300, validation: { min: 0, max: 1_000_000 }, helper: "Backup model API spend.", helper_i18n: {"en":"Backup model API spend."}, expertMeaning: "Secondary model cost", expertMeaning_i18n: {"en":"Secondary model cost"} },
  ],
  outputs: [
    { id: "dailyBasePromptCost", label: "Gunluk Prompt Maliyeti", label_i18n: {"en":"Daily Prompt Cost"}, unit: "USD", format: "currency" },
    { id: "dailyBaseCompletionCost", label: "Gunluk Completion Maliyeti", label_i18n: {"en":"Daily Completion Cost"}, unit: "USD", format: "currency" },
    { id: "dailyCacheNetCost", label: "Gunluk Cache Net Maliyeti", label_i18n: {"en":"Daily Cache Net Cost"}, unit: "USD", format: "currency" },
    { id: "dailyBaseCost", label: "Gunluk Toplam Baz Maliyet", label_i18n: {"en":"Daily Total Base Cost"}, unit: "USD", format: "currency" },
    { id: "monthlyProjection", label: "Aylk Projeksiyon", label_i18n: {"en":"Aylk Projeksiyon"}, unit: "USD", format: "currency" },
    { id: "tco", label: "TCO (Aylk)", label_i18n: {"en":"TCO (Aylk)"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "tco", warning: 5000, critical: 25000, direction: "higher_is_bad", warningMessage: "TCO > $5K/ay — caching veya model optimizasyonu degerlendir.", warningMessage_i18n: {"en":"TCO > $5K/month — evaluate caching or model optimization."}, criticalMessage: "TCO > $25K/ay — acil maliyet optimizasyonu gerekiyor.", criticalMessage_i18n: {"en":"TCO > $25K/ay — urgent Cost optimizasyonu gerekiyor."} },
  ],
  formulaPipeline: [
    { formulaId: "cost.ai_daily_prompt", inputMap: { dailyRequests: "dailyRequests", promptTokens: "promptTokens", pricePerMToken: "promptPrice" }, outputId: "dailyBasePromptCost" },
    { formulaId: "cost.ai_daily_completion", inputMap: { dailyRequests: "dailyRequests", completionTokens: "completionTokens", pricePerMToken: "completionPrice" }, outputId: "dailyBaseCompletionCost" },
    { formulaId: "cost.ai_daily_cache", inputMap: { dailyRequests: "dailyRequests", completionTokens: "completionTokens", cacheHitRatio: "cacheHitRatio", cacheReadPrice: "cacheReadPrice" }, outputId: "dailyCacheNetCost" },
    { formulaId: "cost.ai_daily_total", inputMap: { dailyPromptCost: "dailyBasePromptCost", dailyCompletionCost: "dailyBaseCompletionCost", dailyCacheCost: "dailyCacheNetCost" }, outputId: "dailyBaseCost" },
    { formulaId: "cost.ai_monthly_projection", inputMap: { dailyTotalCost: "dailyBaseCost", growthRate: "monthlyGrowthRate" }, outputId: "monthlyProjection" },
    { formulaId: "cost.ai_tco", inputMap: { monthlyProjection: "monthlyProjection", confidenceBuffer: "confidenceBuffer", infraOverhead: "infraOverhead", fallbackModelCost: "fallbackCost" }, outputId: "tco" },
  ],
  reportTemplate: { title: "AI Token Cost Report", title_i18n: {"en":"AI Token Cost Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Token prices based on public API pricing as of mid-2026.", "Cached tokens charged at cache read price (typically 50% of prompt price).", "Growth rate is month-over-month, compounding not modeled.", "TCO excludes: data egress, fine-tuning, human-in-the-loop."],assumptionNotes_i18n:[{"en":"Token prices based on public API pricing as of mid-2026."},{"en":"Cached tokens charged at cache read price (typically 50% of prompt price)."},{"en":"Growth rate is month-over-month, compounding not modeled."},{"en":"TCO excludes: data egress, fine-tuning, human-in-the-loop."}]},
};
