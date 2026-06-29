/**
 * AI Token Cost Analyzer — Premium Calculator Schema
 *
 * Formulas: BasePromptCost → BaseCompletionCost → CacheReadCost →
 *           MonthlyProjection → TCO
 * Personas: DevOps, ML Mühendisi, CFO
 */

import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

const MODEL_TIER_OPTIONS = [
  { value: "standard", label: "Standard", label_i18n: {"en":"Standard","tr":"Standard"} },
  { value: "pro", label: "Pro", label_i18n: {"en":"Pro","tr":"Pro"} },
  { value: "enterprise", label: "Enterprise", label_i18n: {"en":"Enterprise","tr":"Enterprise"} },
] as const;

export const AI_TOKEN_COST_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "ai-token-cost-analyzer",
  legacyPaidSlug: "ai-token-cost-analyzer",
  name: "AI Token Cost Analyzer", name_i18n: {"en":"AI Token Cost Analyzer","tr":"AI Token Maliyet Analizcisi"},
  sectorSlug: "it-cloud",
  category: "cost",
  painStatement:
    "LLM API costs grow silently with usage. Without a structured TCO model, teams miss cache savings and seasonal spikes — leading to budget overruns.", painStatement_i18n: {"en":"LLM API costs grow silently with usage. Without a structured TCO model, teams miss cache savings and seasonal spikes — leading to budget overruns.","tr":"LLM API maliyetleri kullanımla birlikte sessizce büyür. Yapılandırılmış bir TCO modeli olmadan ekipler önbellek tasarruflarını ve mevsimsel artışları kaçırır — bütçe aşımlarına yol açar."},
  inputs: [
    { id: "dailyRequests", label: "Günlük API Request", label_i18n: {"en":"Daily inference request count","tr":"Günlük API Request"}, type: "number", unit: "adet", required: true, smartDefault: 10000, validation: { min: 1, max: 100_000_000 }, helper: "Total LLM API calls per day.", helper_i18n: {"en":"Total LLM API calls per day.","tr":"Günlük API Request"}, expertMeaning: "Daily inference request count", expertMeaning_i18n: {"en":"Daily inference request count","tr":"Günlük API Request"} },
    { id: "promptTokens", label: "Ortalama Prompt Token", label_i18n: {"en":"Ortalama Prompt Token","tr":"Ortalama Prompt Token"}, type: "number", unit: "token", required: true, smartDefault: 2000, validation: { min: 1, max: 1_000_000 }, helper: "Average input token count per request.", helper_i18n: {"en":"Average input token count per request.","tr":"Average input token count per request."}, expertMeaning: "Prompt tokens per request", expertMeaning_i18n: {"en":"Prompt tokens per request","tr":"Prompt tokens per request" },
    { id: "completionTokens", label: "Ortalama Completion Token", label_i18n: {"en":"Ortalama Completion Token","tr":"Ortalama Completion Token"}, type: "number", unit: "token", required: true, smartDefault: 500, validation: { min: 1, max: 1_000_000 }, helper: "Average output token count per request.", helper_i18n: {"en":"Average output token count per request.","tr":"Average output token count per request."}, expertMeaning: "Completion tokens per request", expertMeaning_i18n: {"en":"Completion tokens per request","tr":"Completion tokens per request" },
    { id: "cacheHitRatio", label: "Cache Hit Ratio", label_i18n: {"en":"Cache Hit Ratio","tr":"Cache Hit Ratio"}, type: "number", unit: "%", required: true, smartDefault: 25, validation: { min: 0, max: 100 }, helper: "% of tokens served from prompt cache.", helper_i18n: {"en":"% of tokens served from prompt cache.","tr":"% of tokens served from prompt cache."}, expertMeaning: "Reduces effective cost", expertMeaning_i18n: {"en":"Reduces effective cost","tr":"Reduces effective cost" },
    { id: "promptPrice", label: "Model Prompt Price", label_i18n: {"en":"Model Prompt Price","tr":"Model Prompt Price"}, type: "number", unit: "USD/1M tok", required: true, smartDefault: 15, validation: { min: 0.1, max: 500 }, helper: "Price per million prompt tokens.", helper_i18n: {"en":"Price per million prompt tokens.","tr":"Price per million prompt tokens."}, expertMeaning: "Per-model input token price", expertMeaning_i18n: {"en":"Per-model input token price","tr":"Per-model input token price" },
    { id: "completionPrice", label: "Model Completion Price", label_i18n: {"en":"Model Completion Price","tr":"Model Completion Price"}, type: "number", unit: "USD/1M tok", required: true, smartDefault: 60, validation: { min: 0.1, max: 500 }, helper: "Price per million completion tokens.", helper_i18n: {"en":"Price per million completion tokens.","tr":"Price per million completion tokens."}, expertMeaning: "Per-model output token price", expertMeaning_i18n: {"en":"Per-model output token price","tr":"Per-model output token price" },
    { id: "cacheReadPrice", label: "Cache Read Price", label_i18n: {"en":"Cache Read Price","tr":"Cache Read Price"}, type: "number", unit: "USD/1M tok", required: false, smartDefault: 7.5, validation: { min: 0, max: 500 }, helper: "Price per million cached read tokens.", helper_i18n: {"en":"Price per million cached read tokens.","tr":"Price per million cached read tokens."}, expertMeaning: "Typically 50% of prompt price", expertMeaning_i18n: {"en":"Typically 50% of prompt price","tr":"Typically 50% of prompt price" },
    { id: "monthlyGrowthRate", label: "Aylık Büyüme Oranı", label_i18n: {"en":"Monthly Growth Rate","tr":"Aylık Büyüme Oranı", type: "number", unit: "%", required: true, smartDefault: 10, validation: { min: 0, max: 500 }, helper: "Month-over-month volume growth.", helper_i18n: {"en":"Month-over-month volume growth.","tr":"Month-over-month volume growth."}, expertMeaning: "MoM growth rate", expertMeaning_i18n: {"en":"MoM growth rate","tr":"MoM growth rate" },
    { id: "confidenceBuffer", label: "Güven Tamponu", label_i18n: {"en":"Safety Buffer","tr":"Güven Tamponu", type: "number", unit: "%", required: false, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "Safety margin on projection.", helper_i18n: {"en":"Safety margin on projection.","tr":"Safety margin on projection."}, expertMeaning: "Contingency buffer", expertMeaning_i18n: {"en":"Contingency buffer","tr":"Contingency buffer" },
    { id: "infraOverhead", label: "Altyapı Overhead", label_i18n: {"en":"Infrastructure Overhead","tr":"Altyapı Overhead", type: "number", unit: "USD/ay", required: false, smartDefault: 500, validation: { min: 0, max: 1_000_000 }, helper: "GPU/server/orchestration costs.", helper_i18n: {"en":"GPU/server/orchestration costs.","tr":"GPU/server/orchestration costs."}, expertMeaning: "Non-API monthly infra cost", expertMeaning_i18n: {"en":"Non-API monthly infra cost","tr":"Non-API monthly infra cost" },
    { id: "fallbackCost", label: "Fallback Model Maliyeti", label_i18n: {"en":"Fallback Model Cost","tr":"Fallback Model Maliyeti", type: "number", unit: "USD/ay", required: false, smartDefault: 300, validation: { min: 0, max: 1_000_000 }, helper: "Backup model API spend.", helper_i18n: {"en":"Backup model API spend.","tr":"Backup model API spend."}, expertMeaning: "Secondary model cost", expertMeaning_i18n: {"en":"Secondary model cost","tr":"Secondary model cost" },
  ],
  outputs: [
    { id: "dailyBasePromptCost", label: "Günlük Prompt Maliyeti", label_i18n: {"en":"Günlük Prompt Maliyeti","tr":"Günlük Prompt Maliyeti"}, unit: "USD", format: "currency" },
    { id: "dailyBaseCompletionCost", label: "Günlük Completion Maliyeti", label_i18n: {"en":"Günlük Completion Maliyeti","tr":"Günlük Completion Maliyeti"}, unit: "USD", format: "currency" },
    { id: "dailyCacheNetCost", label: "Günlük Cache Net Maliyeti", label_i18n: {"en":"Günlük Cache Net Maliyeti","tr":"Günlük Cache Net Maliyeti"}, unit: "USD", format: "currency" },
    { id: "dailyBaseCost", label: "Günlük Toplam Baz Maliyet", label_i18n: {"en":"Günlük Toplam Baz Maliyet","tr":"Günlük Toplam Baz Maliyet"}, unit: "USD", format: "currency" },
    { id: "monthlyProjection", label: "Aylık Projeksiyon", label_i18n: {"en":"Aylık Projeksiyon","tr":"Aylık Projeksiyon"}, unit: "USD", format: "currency" },
    { id: "tco", label: "TCO (Aylık)", label_i18n: {"en":"TCO (Aylık)","tr":"TCO (Aylık)"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "tco", warning: 5000, critical: 25000, direction: "higher_is_bad", warningMessage: "TCO > $5K/ay — caching veya model optimizasyonu değerlendir.", warningMessage_i18n: {"en":"TCO > $5K/mo — evaluate caching or model optimization.","tr":"TCO > $5K/ay — caching veya model optimizasyonu değerlendir."}, criticalMessage: "TCO > $25K/ay — acil maliyet optimizasyonu gerekiyor.", criticalMessage_i18n: {"en":"TCO > $25K/ay — acil maliyet optimizasyonu gerekiyor.","tr":"TCO > $25K/ay — acil maliyet optimizasyonu gerekiyor."} },
  ],
  formulaPipeline: [
    { formulaId: "cost.ai_daily_prompt", inputMap: { dailyRequests: "dailyRequests", promptTokens: "promptTokens", pricePerMToken: "promptPrice" }, outputId: "dailyBasePromptCost" },
    { formulaId: "cost.ai_daily_completion", inputMap: { dailyRequests: "dailyRequests", completionTokens: "completionTokens", pricePerMToken: "completionPrice" }, outputId: "dailyBaseCompletionCost" },
    { formulaId: "cost.ai_daily_cache", inputMap: { dailyRequests: "dailyRequests", completionTokens: "completionTokens", cacheHitRatio: "cacheHitRatio", cacheReadPrice: "cacheReadPrice" }, outputId: "dailyCacheNetCost" },
    { formulaId: "cost.ai_daily_total", inputMap: { dailyPromptCost: "dailyBasePromptCost", dailyCompletionCost: "dailyBaseCompletionCost", dailyCacheCost: "dailyCacheNetCost" }, outputId: "dailyBaseCost" },
    { formulaId: "cost.ai_monthly_projection", inputMap: { dailyTotalCost: "dailyBaseCost", growthRate: "monthlyGrowthRate" }, outputId: "monthlyProjection" },
    { formulaId: "cost.ai_tco", inputMap: { monthlyProjection: "monthlyProjection", confidenceBuffer: "confidenceBuffer", infraOverhead: "infraOverhead", fallbackModelCost: "fallbackCost" }, outputId: "tco" },
  ],
  reportTemplate: { title: "AI Token Cost Report", title_i18n: {"en":"AI Token Cost Report","tr":"AI Token Maliyet Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Token prices based on public API pricing as of mid-2026.", "Cached tokens charged at cache read price (typically 50% of prompt price).", "Growth rate is month-over-month, compounding not modeled.", "TCO excludes: data egress, fine-tuning, human-in-the-loop."],assumptionNotes_i18n:[{"en":"Token prices based on public API pricing as of mid-2026.","tr":"Token fiyatları 2026 ortası itibarıyla genel API fiyatlandırmasına dayanmaktadır."},{"en":"Cached tokens charged at cache read price (typically 50% of prompt price).","tr":"Önbelleklenmiş tokenlar önbellek okuma fiyatından (genellikle prompt fiyatının %50si) ücretlendirilir."},{"en":"Growth rate is month-over-month, compounding not modeled.","tr":"Büyüme oranı aylıktır, bileşik etki modellenmemiştir."},{"en":"TCO excludes: data egress, fine-tuning, human-in-the-loop.","tr":"TCO hariç tutar: veri çıkışı, ince ayar, insan döngüsü."}] },
};
