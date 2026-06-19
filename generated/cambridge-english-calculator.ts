// Auto-generated from cambridge-english-calculator-schema.json
import * as z from 'zod';

export interface Cambridge_english_calculatorInput {
  readingScore: number;
  writingScore: number;
  listeningScore: number;
  speakingScore: number;
  useOfEnglishScore: number;
  dataConfidence?: number;
}

export const Cambridge_english_calculatorInputSchema = z.object({
  readingScore: z.number().default(0),
  writingScore: z.number().default(0),
  listeningScore: z.number().default(0),
  speakingScore: z.number().default(0),
  useOfEnglishScore: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cambridge_english_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.readingScore * input.writingScore * input.listeningScore * input.speakingScore; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.readingScore * input.writingScore * input.listeningScore * input.speakingScore * (input.useOfEnglishScore); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.useOfEnglishScore; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCambridge_english_calculator(input: Cambridge_english_calculatorInput): Cambridge_english_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
