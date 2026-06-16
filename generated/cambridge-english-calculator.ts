// Auto-generated from cambridge-english-calculator-schema.json
import * as z from 'zod';

export interface Cambridge_english_calculatorInput {
  readingScore: number;
  writingScore: number;
  listeningScore: number;
  speakingScore: number;
  useOfEnglishScore: number;
}

export const Cambridge_english_calculatorInputSchema = z.object({
  readingScore: z.number().default(0),
  writingScore: z.number().default(0),
  listeningScore: z.number().default(0),
  speakingScore: z.number().default(0),
  useOfEnglishScore: z.number().default(0),
});

function evaluateAllFormulas(input: Cambridge_english_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.readingScore + input.writingScore + input.listeningScore + input.speakingScore + input.useOfEnglishScore; results["totalRawScore"] = Number.isFinite(v) ? v : 0; } catch { results["totalRawScore"] = 0; }
  try { const v = Math.round(((results["totalRawScore"] ?? 0) / 125) * 200); results["cambridgeScore"] = Number.isFinite(v) ? v : 0; } catch { results["cambridgeScore"] = 0; }
  try { const v = (results["cambridgeScore"] ?? 0) >= 180 ? 'C1' : ((results["cambridgeScore"] ?? 0) >= 160 ? 'B2' : ((results["cambridgeScore"] ?? 0) >= 140 ? 'B1' : 'A2')); results["cefrLevel"] = Number.isFinite(v) ? v : 0; } catch { results["cefrLevel"] = 0; }
  return results;
}


export function calculateCambridge_english_calculator(input: Cambridge_english_calculatorInput): Cambridge_english_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cambridgeScore"] ?? 0;
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


export interface Cambridge_english_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
