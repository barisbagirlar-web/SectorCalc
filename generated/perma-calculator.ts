// Auto-generated from perma-calculator-schema.json
import * as z from 'zod';

export interface Perma_calculatorInput {
  positiveEmotion: number;
  engagement: number;
  relationships: number;
  meaning: number;
  accomplishment: number;
  dataConfidence?: number;
}

export const Perma_calculatorInputSchema = z.object({
  positiveEmotion: z.number().default(5),
  engagement: z.number().default(5),
  relationships: z.number().default(5),
  meaning: z.number().default(5),
  accomplishment: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Perma_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.positiveEmotion + input.engagement + input.relationships + input.meaning + input.accomplishment) / 5; results["overallScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overallScore"] = Number.NaN; }
  try { const v = input.positiveEmotion; results["positiveEmotionOutput"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["positiveEmotionOutput"] = Number.NaN; }
  try { const v = input.engagement; results["engagementOutput"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["engagementOutput"] = Number.NaN; }
  try { const v = input.relationships; results["relationshipsOutput"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["relationshipsOutput"] = Number.NaN; }
  try { const v = input.meaning; results["meaningOutput"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["meaningOutput"] = Number.NaN; }
  try { const v = input.accomplishment; results["accomplishmentOutput"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["accomplishmentOutput"] = Number.NaN; }
  return results;
}


export function calculatePerma_calculator(input: Perma_calculatorInput): Perma_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["overallScore"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
