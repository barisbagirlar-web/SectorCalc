/**
 * AI Token Cost Analyzer — Premium Calculator Schema
 *
 * Formulas: BasePromptCost → BaseCompletionCost → CacheReadCost →
 *           MonthlyProjection → TCO
 * Personas: DevOps, ML Mühendisi, CFO
 */

import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

const MODEL_TIER_OPTIONS = [
  { value: "standard", label: "Standard" },
  { value: "pro", label: "Pro" },
  { value: "enterprise", label: "Enterprise" },
] as const;

export const AI_TOKEN_COST_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "ai-token-cost-analyzer",
  legacyPaidSlug: "ai-token-cost-analyzer",
  name: "AI Token Cost Analyzer",
  sectorSlug: "it-cloud",
  category: "cost",
  painStatement:
    "LLM API costs grow silently with usage. Without a structured TCO model, teams miss cache savings and seasonal spikes — leading to budget overruns.",
  inputs: [
    { id: "dailyRequests", label: "Günlük API Request", type: "number", unit: "adet", required: true, smartDefault: 10000, validation: { min: 1, max: 100_000_000 }, helper: "Total LLM API calls per day.", expertMeaning: "Daily inference request count" },
    { id: "promptTokens", label: "Ortalama Prompt Token", type: "number", unit: "token", required: true, smartDefault: 2000, validation: { min: 1, max: 1_000_000 }, helper: "Average input token count per request.", expertMeaning: "Prompt tokens per request" },
    { id: "completionTokens", label: "Ortalama Completion Token", type: "number", unit: "token", required: true, smartDefault: 500, validation: { min: 1, max: 1_000_000 }, helper: "Average output token count per request.", expertMeaning: "Completion tokens per request" },
    { id: "cacheHitRatio", label: "Cache Hit Ratio", type: "number", unit: "%", required: true, smartDefault: 25, validation: { min: 0, max: 100 }, helper: "% of tokens served from prompt cache.", expertMeaning: "Reduces effective cost" },
    { id: "promptPrice", label: "Model Prompt Price", type: "number", unit: "USD/1M tok", required: true, smartDefault: 15, validation: { min: 0.1, max: 500 }, helper: "Price per million prompt tokens.", expertMeaning: "Per-model input token price" },
    { id: "completionPrice", label: "Model Completion Price", type: "number", unit: "USD/1M tok", required: true, smartDefault: 60, validation: { min: 0.1, max: 500 }, helper: "Price per million completion tokens.", expertMeaning: "Per-model output token price" },
    { id: "cacheReadPrice", label: "Cache Read Price", type: "number", unit: "USD/1M tok", required: false, smartDefault: 7.5, validation: { min: 0, max: 500 }, helper: "Price per million cached read tokens.", expertMeaning: "Typically 50% of prompt price" },
    { id: "monthlyGrowthRate", label: "Aylık Büyüme Oranı", type: "number", unit: "%", required: true, smartDefault: 10, validation: { min: 0, max: 500 }, helper: "Month-over-month volume growth.", expertMeaning: "MoM growth rate" },
    { id: "confidenceBuffer", label: "Güven Tamponu", type: "number", unit: "%", required: false, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "Safety margin on projection.", expertMeaning: "Contingency buffer" },
    { id: "infraOverhead", label: "Altyapı Overhead", type: "number", unit: "USD/ay", required: false, smartDefault: 500, validation: { min: 0, max: 1_000_000 }, helper: "GPU/server/orchestration costs.", expertMeaning: "Non-API monthly infra cost" },
    { id: "fallbackCost", label: "Fallback Model Maliyeti", type: "number", unit: "USD/ay", required: false, smartDefault: 300, validation: { min: 0, max: 1_000_000 }, helper: "Backup model API spend.", expertMeaning: "Secondary model cost" },
  ],
  outputs: [
    { id: "dailyBasePromptCost", label: "Günlük Prompt Maliyeti", unit: "USD", format: "currency" },
    { id: "dailyBaseCompletionCost", label: "Günlük Completion Maliyeti", unit: "USD", format: "currency" },
    { id: "dailyCacheNetCost", label: "Günlük Cache Net Maliyeti", unit: "USD", format: "currency" },
    { id: "dailyBaseCost", label: "Günlük Toplam Baz Maliyet", unit: "USD", format: "currency" },
    { id: "monthlyProjection", label: "Aylık Projeksiyon", unit: "USD", format: "currency" },
    { id: "tco", label: "TCO (Aylık)", unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "tco", warning: 5000, critical: 25000, direction: "higher_is_bad", warningMessage: "TCO > $5K/ay — caching veya model optimizasyonu değerlendir.", criticalMessage: "TCO > $25K/ay — acil maliyet optimizasyonu gerekiyor." },
  ],
  formulaPipeline: [
    { formulaId: "cost.ai_daily_prompt", inputMap: { dailyRequests: "dailyRequests", promptTokens: "promptTokens", pricePerMToken: "promptPrice" }, outputId: "dailyBasePromptCost" },
    { formulaId: "cost.ai_daily_completion", inputMap: { dailyRequests: "dailyRequests", completionTokens: "completionTokens", pricePerMToken: "completionPrice" }, outputId: "dailyBaseCompletionCost" },
    { formulaId: "cost.ai_daily_cache", inputMap: { dailyRequests: "dailyRequests", completionTokens: "completionTokens", cacheHitRatio: "cacheHitRatio", cacheReadPrice: "cacheReadPrice" }, outputId: "dailyCacheNetCost" },
    { formulaId: "cost.ai_daily_total", inputMap: { dailyPromptCost: "dailyBasePromptCost", dailyCompletionCost: "dailyBaseCompletionCost", dailyCacheCost: "dailyCacheNetCost" }, outputId: "dailyBaseCost" },
    { formulaId: "cost.ai_monthly_projection", inputMap: { dailyTotalCost: "dailyBaseCost", growthRate: "monthlyGrowthRate" }, outputId: "monthlyProjection" },
    { formulaId: "cost.ai_tco", inputMap: { monthlyProjection: "monthlyProjection", confidenceBuffer: "confidenceBuffer", infraOverhead: "infraOverhead", fallbackModelCost: "fallbackCost" }, outputId: "tco" },
  ],
  reportTemplate: { title: "AI Token Cost Report", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Token prices based on public API pricing as of mid-2026.", "Cached tokens charged at cache read price (typically 50% of prompt price).", "Growth rate is month-over-month, compounding not modeled.", "TCO excludes: data egress, fine-tuning, human-in-the-loop."] },
};
