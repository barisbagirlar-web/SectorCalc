// Auto-generated premium calculator: ai-token-maliyet
import * as z from 'zod';

export interface AiTokenMaliyetInput {
  gunlukRequest: number;
  promptToken: number;
  completionToken: number;
  cacheHitRatio: number;
  modelTier: string;
  buyumeOranı: number;
  guvenTamponu: number;
}

export const AiTokenMaliyetInputSchema = z.object({
  gunlukRequest: z.number().min(0).default(0),
  promptToken: z.number().min(0).default(0),
  completionToken: z.number().min(0).default(0),
  cacheHitRatio: z.number().min(0).default(0),
  modelTier: z.number().min(0).default(0),
  buyumeOranı: z.number().min(0).default(0),
  guvenTamponu: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.promptTokens * input.promptPrice; results["basePromptCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["basePromptCost"] = Number.NaN; }
  try { const v = input.completionTokens * input.completionPrice; results["baseCompletionCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseCompletionCost"] = Number.NaN; }
  try { const v = input.cachedTokens * input.cacheReadPrice; results["cacheReadCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cacheReadCost"] = Number.NaN; }
  try { const v = input.dailyBaseCost * input.growthRate; results["monthlyProjection"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyProjection"] = Number.NaN; }
  try { const v = input.monthlyProjection * input.infraOverhead * input.fallbackCost; results["tCO"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tCO"] = Number.NaN; }
  return results;
}

export function calculateAiTokenMaliyet(input) {
  return evaluateAllFormulas(input);
}
