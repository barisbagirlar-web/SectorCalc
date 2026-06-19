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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Alvarado_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.migrationPain * input.anorexia * input.nauseaVomiting * input.rlqTenderness; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.migrationPain * input.anorexia * input.nauseaVomiting * input.rlqTenderness * (input.reboundTenderness * input.tempElevated * input.leukocytosis * input.leftShift); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.reboundTenderness * input.tempElevated * input.leukocytosis * input.leftShift; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateAlvarado_score_calculator(input: Alvarado_score_calculatorInput): Alvarado_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Alvarado_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
