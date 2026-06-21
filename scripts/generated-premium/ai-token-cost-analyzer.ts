/**
 * AI TOKEN MALİYET — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const AITOKENCOST_SCHEMA: PremiumCalculatorSchema = {
  id: "ai-token-cost-analyzer",
  legacyPaidSlug: "ai-token-cost-analyzer",
  name: "AI TOKEN MALİYET",
  sectorSlug: "general",
  category: "cost",
  painStatement: "AI TOKEN MALİYET — premium analysis tool.",
  inputs: [
    { id: "gunluk_request", label: "Günlük Request", type: "number", required: true },
    { id: "prompt_token", label: "Prompt Token", type: "number", required: true },
    { id: "completion_token", label: "Completion Token", type: "number", required: true },
    { id: "cache_hit_ratio", label: "Cache Hit Ratio", type: "number", required: true },
    { id: "model_tier", label: "Model Tier", type: "text", required: true },
    { id: "buyume_orani", label: "Büyüme Oranı", type: "number", required: true },
    { id: "guven_tamponu", label: "Güven Tamponu", type: "number", required: true },
  ],
  outputs: [
    { id: "base_prompt_cost", label: "Base Prompt Cost", unit: "currency", format: "currency" },
    { id: "base_completion_cost", label: "Base Completion Cost", unit: "currency", format: "currency" },
    { id: "cache_read_cost", label: "Cache Read Cost", unit: "currency", format: "currency" },
    { id: "monthly_projection", label: "Monthly Projection", unit: "currency", format: "currency" },
    { id: "t_c_o", label: "T C O", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.ai_token_maliyet_analyzer_0", inputMap: { PromptTokens: "prompt_token", PromptPrice: "prompt_price" }, outputId: "base_prompt_cost" },
    { formulaId: "custom.ai_token_maliyet_analyzer_1", inputMap: { CompletionTokens: "completion_token", CompletionPrice: "completion_price" }, outputId: "base_completion_cost" },
    { formulaId: "custom.ai_token_maliyet_analyzer_2", inputMap: { CachedTokens: "cached_tokens", CacheReadPrice: "cache_read_price" }, outputId: "cache_read_cost" },
    { formulaId: "custom.ai_token_maliyet_analyzer_3", inputMap: { DailyBaseCost: "daily_base_cost", GrowthRate: "growth_rate" }, outputId: "monthly_projection" },
    { formulaId: "custom.ai_token_maliyet_analyzer_4", inputMap: { MonthlyProjection: "monthly_projection", InfraOverhead: "infra_overhead", FallbackCost: "fallback_cost" }, outputId: "t_c_o" },
  ],
  reportTemplate: {
    title: "AI TOKEN MALİYET Report",
    sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan"],
    exportFormats: ["pdf"],
  },
  assumptions: {
    hiddenLossMultiplier: 1.0,
    volatilityPercent: 10,
    targetMarginPercent: 20,
    assumptionNotes: ["Based on user-provided formulas.", "Verify constants periodically."],
  },
};
