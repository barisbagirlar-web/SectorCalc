// Auto-generated from oat-score-calculator-schema.json
import * as z from 'zod';

export interface Oat_score_calculatorInput {
  torqueReading: number;
  angleReading: number;
  vibrationLevel: number;
  defectCount: number;
  calibrationFactor: number;
}

export const Oat_score_calculatorInputSchema = z.object({
  torqueReading: z.number().default(50),
  angleReading: z.number().default(5),
  vibrationLevel: z.number().default(0.5),
  defectCount: z.number().default(2),
  calibrationFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Oat_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.torqueReading * Math.cos(input.angleReading * 0.01745329252); results["torqueScore"] = Number.isFinite(v) ? v : 0; } catch { results["torqueScore"] = 0; }
  try { const v = Math.log(input.vibrationLevel + 1) * 10; results["vibrationImpact"] = Number.isFinite(v) ? v : 0; } catch { results["vibrationImpact"] = 0; }
  try { const v = input.defectCount * 5; results["defectPenalty"] = Number.isFinite(v) ? v : 0; } catch { results["defectPenalty"] = 0; }
  try { const v = input.calibrationFactor * ((results["torqueScore"] ?? 0) * 0.6 + (100 - (results["vibrationImpact"] ?? 0)) * 0.3 + (100 - (results["defectPenalty"] ?? 0)) * 0.1); results["rawScore"] = Number.isFinite(v) ? v : 0; } catch { results["rawScore"] = 0; }
  try { const v = (results["rawScore"] ?? 0); results["oatScore"] = Number.isFinite(v) ? v : 0; } catch { results["oatScore"] = 0; }
  return results;
}


export function calculateOat_score_calculator(input: Oat_score_calculatorInput): Oat_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["oatScore"] ?? 0;
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


export interface Oat_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
