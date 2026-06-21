// Auto-generated from ai-token-maliyet-schema.json
import * as z from 'zod';

export interface Ai_token_maliyetInput {
  PromptTokens: number;
  PromptPrice: number;
  CompletionTokens: number;
  CompletionPrice: number;
  CachedTokens: number;
  CacheReadPrice: number;
  DailyBaseCost: number;
  GrowthRate: number;
  InfraOverhead: number;
  FallbackCost: number;
  dataConfidence?: number;
}

export const Ai_token_maliyetInputSchema = z.object({
  PromptTokens: z.number().min(0).default(0),
  PromptPrice: z.number().min(0).default(0),
  CompletionTokens: z.number().min(0).default(0),
  CompletionPrice: z.number().min(0).default(0),
  CachedTokens: z.number().min(0).default(0),
  CacheReadPrice: z.number().min(0).default(0),
  DailyBaseCost: z.number().min(0).default(0),
  GrowthRate: z.number().min(0).default(0),
  InfraOverhead: z.number().min(0).default(0),
  FallbackCost: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ai_token_maliyetInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.PromptTokens * input.PromptPrice) / 1000000; results["BasePromptCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["BasePromptCost"] = Number.NaN; }
  try { const v = (input.CompletionTokens * input.CompletionPrice) / 1000000; results["BaseCompletionCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["BaseCompletionCost"] = Number.NaN; }
  try { const v = (input.CachedTokens * input.CacheReadPrice) / 1000000; results["CacheReadCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CacheReadCost"] = Number.NaN; }
  try { const v = (input.DailyBaseCost * 30) * (1 + input.GrowthRate); results["MonthlyProjection"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MonthlyProjection"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["MonthlyProjection"])) + input.InfraOverhead + input.FallbackCost; results["TCO"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TCO"] = Number.NaN; }
  return results;
}


export function calculateAi_token_maliyet(input: Ai_token_maliyetInput): Ai_token_maliyetOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["TCO"]);
  const breakdown = {
    BasePromptCost: toNumericFormulaValue(values["BasePromptCost"]),
    BaseCompletionCost: toNumericFormulaValue(values["BaseCompletionCost"]),
    CacheReadCost: toNumericFormulaValue(values["CacheReadCost"]),
    MonthlyProjection: toNumericFormulaValue(values["MonthlyProjection"]),
    TCO: toNumericFormulaValue(values["TCO"])
  };
  const hiddenLossDrivers: string[] = ["Verify assumptions with real data","Cross-check with industry benchmarks"];
  const suggestedActions: string[] = ["Run sensitivity analysis","Review assumptions with domain expert"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "USD",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report","Action plan"],
  };
}


export interface Ai_token_maliyetOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { BasePromptCost: number; BaseCompletionCost: number; CacheReadCost: number; MonthlyProjection: number; TCO: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ai_token_maliyetOutputMeta = {
  primaryKey: "TCO",
  unit: "USD",
  breakdownKeys: ["BasePromptCost","BaseCompletionCost","CacheReadCost","MonthlyProjection","TCO"],
} as const;

