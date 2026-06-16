// Auto-generated from hair-loss-calculator-schema.json
import * as z from 'zod';

export interface Hair_loss_calculatorInput {
  age: number;
  dailyShedding: number;
  geneticScore: number;
  stressLevel: number;
  nutritionScore: number;
  hormoneIndex: number;
}

export const Hair_loss_calculatorInputSchema = z.object({
  age: z.number().default(30),
  dailyShedding: z.number().default(100),
  geneticScore: z.number().default(50),
  stressLevel: z.number().default(5),
  nutritionScore: z.number().default(70),
  hormoneIndex: z.number().default(3),
});

function evaluateAllFormulas(input: Hair_loss_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.25 * (input.age / 100) + 0.2 * (input.dailyShedding / 200) + 0.2 * (input.geneticScore / 100) + 0.15 * (input.stressLevel / 10) + 0.1 * ((100 - input.nutritionScore) / 100) + 0.1 * (input.hormoneIndex / 10); results["riskScore"] = Number.isFinite(v) ? v : 0; } catch { results["riskScore"] = 0; }
  try { const v = Math.min(100, Math.max(0, (results["riskScore"] ?? 0) * 100)); results["probability"] = Number.isFinite(v) ? v : 0; } catch { results["probability"] = 0; }
  try { const v = input.dailyShedding * 365; results["hairLossRate"] = Number.isFinite(v) ? v : 0; } catch { results["hairLossRate"] = 0; }
  return results;
}


export function calculateHair_loss_calculator(input: Hair_loss_calculatorInput): Hair_loss_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["probability"] ?? 0;
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


export interface Hair_loss_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
