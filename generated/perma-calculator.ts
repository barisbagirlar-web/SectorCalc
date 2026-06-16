// Auto-generated from perma-calculator-schema.json
import * as z from 'zod';

export interface Perma_calculatorInput {
  positiveEmotion: number;
  engagement: number;
  relationships: number;
  meaning: number;
  accomplishment: number;
}

export const Perma_calculatorInputSchema = z.object({
  positiveEmotion: z.number().default(5),
  engagement: z.number().default(5),
  relationships: z.number().default(5),
  meaning: z.number().default(5),
  accomplishment: z.number().default(5),
});

function evaluateAllFormulas(input: Perma_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.positiveEmotion + input.engagement + input.relationships + input.meaning + input.accomplishment) / 5; results["overallScore"] = Number.isFinite(v) ? v : 0; } catch { results["overallScore"] = 0; }
  try { const v = input.positiveEmotion; results["positiveEmotionOutput"] = Number.isFinite(v) ? v : 0; } catch { results["positiveEmotionOutput"] = 0; }
  try { const v = input.engagement; results["engagementOutput"] = Number.isFinite(v) ? v : 0; } catch { results["engagementOutput"] = 0; }
  try { const v = input.relationships; results["relationshipsOutput"] = Number.isFinite(v) ? v : 0; } catch { results["relationshipsOutput"] = 0; }
  try { const v = input.meaning; results["meaningOutput"] = Number.isFinite(v) ? v : 0; } catch { results["meaningOutput"] = 0; }
  try { const v = input.accomplishment; results["accomplishmentOutput"] = Number.isFinite(v) ? v : 0; } catch { results["accomplishmentOutput"] = 0; }
  return results;
}


export function calculatePerma_calculator(input: Perma_calculatorInput): Perma_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["overallScore"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Perma_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
