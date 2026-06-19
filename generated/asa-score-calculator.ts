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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Asa_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.scrapRate / 100 * input.materialCost; results["scrapCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["scrapCost"] = 0; }
  try { const v = input.reworkFactor * input.materialCost * input.batchSize; results["reworkCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["reworkCost"] = 0; }
  try { const v = (asFormulaNumber(results["scrapCost"])) + (asFormulaNumber(results["reworkCost"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = 100 - ((asFormulaNumber(results["totalCost"])) / (input.materialCost * input.batchSize) * 100); results["score"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["score"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateAsa_score_calculator(input: Asa_score_calculatorInput): Asa_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["score"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Asa_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
