// Auto-generated from asa-score-calculator-schema.json
import * as z from 'zod';

export interface Asa_score_calculatorInput {
  scrapRate: number;
  materialCost: number;
  batchSize: number;
  reworkFactor: number;
}

export const Asa_score_calculatorInputSchema = z.object({
  scrapRate: z.number().default(5),
  materialCost: z.number().default(1000),
  batchSize: z.number().default(100),
  reworkFactor: z.number().default(0.1),
});

function evaluateAllFormulas(input: Asa_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.scrapRate / 100 * input.materialCost; results["scrapCost"] = Number.isFinite(v) ? v : 0; } catch { results["scrapCost"] = 0; }
  try { const v = input.reworkFactor * input.materialCost * input.batchSize; results["reworkCost"] = Number.isFinite(v) ? v : 0; } catch { results["reworkCost"] = 0; }
  try { const v = (results["scrapCost"] ?? 0) + (results["reworkCost"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = 100 - ((results["totalCost"] ?? 0) / (input.materialCost * input.batchSize) * 100); results["score"] = Number.isFinite(v) ? v : 0; } catch { results["score"] = 0; }
  return results;
}


export function calculateAsa_score_calculator(input: Asa_score_calculatorInput): Asa_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["score"] ?? 0;
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


export interface Asa_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
