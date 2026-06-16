// Auto-generated from alvarado-score-calculator-schema.json
import * as z from 'zod';

export interface Alvarado_score_calculatorInput {
  migrationPain: number;
  anorexia: number;
  nauseaVomiting: number;
  rlqTenderness: number;
  reboundTenderness: number;
  tempElevated: number;
  leukocytosis: number;
  leftShift: number;
}

export const Alvarado_score_calculatorInputSchema = z.object({
  migrationPain: z.number().default(0),
  anorexia: z.number().default(0),
  nauseaVomiting: z.number().default(0),
  rlqTenderness: z.number().default(0),
  reboundTenderness: z.number().default(0),
  tempElevated: z.number().default(0),
  leukocytosis: z.number().default(0),
  leftShift: z.number().default(0),
});

function evaluateAllFormulas(input: Alvarado_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.migrationPain + input.anorexia + input.nauseaVomiting + input.rlqTenderness + input.reboundTenderness + input.tempElevated + input.leukocytosis + input.leftShift; results["totalScore"] = Number.isFinite(v) ? v : 0; } catch { results["totalScore"] = 0; }
  try { const v = (results["totalScore"] ?? 0) <= 4 ? 'Low risk' : (results["totalScore"] ?? 0) <= 6 ? 'Equivocal' : (results["totalScore"] ?? 0) <= 8 ? 'Probable appendicitis' : 'Very probable appendicitis'; results["interpretation"] = Number.isFinite(v) ? v : 0; } catch { results["interpretation"] = 0; }
  return results;
}


export function calculateAlvarado_score_calculator(input: Alvarado_score_calculatorInput): Alvarado_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalScore"] ?? 0;
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


export interface Alvarado_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
