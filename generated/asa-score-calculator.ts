// Auto-generated from asa-score-calculator-schema.json
import * as z from 'zod';

export interface Asa_score_calculatorInput {
  scrapRate: number;
  materialCost: number;
  batchSize: number;
  reworkFactor: number;
  dataConfidence?: number;
}

export const Asa_score_calculatorInputSchema = z.object({
  scrapRate: z.number().default(5),
  materialCost: z.number().default(1000),
  batchSize: z.number().default(100),
  reworkFactor: z.number().default(0.1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Asa_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.scrapRate / 100 * input.materialCost; results["scrapCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scrapCost"] = Number.NaN; }
  try { const v = input.reworkFactor * input.materialCost * input.batchSize; results["reworkCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["reworkCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["scrapCost"])) + (toNumericFormulaValue(results["reworkCost"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = 100 - ((toNumericFormulaValue(results["totalCost"])) / (input.materialCost * input.batchSize) * 100); results["score"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["score"] = Number.NaN; }
  return results;
}


export function calculateAsa_score_calculator(input: Asa_score_calculatorInput): Asa_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["score"]);
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


export interface Asa_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
