// Auto-generated from f-distribution-calculator-schema.json
import * as z from 'zod';

export interface F_distribution_calculatorInput {
  ssBetween: number;
  dfBetween: number;
  ssWithin: number;
  dfWithin: number;
  dataConfidence?: number;
}

export const F_distribution_calculatorInputSchema = z.object({
  ssBetween: z.number().default(0),
  dfBetween: z.number().default(1),
  ssWithin: z.number().default(0),
  dfWithin: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: F_distribution_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ssBetween / input.dfBetween; results["meanSquareBetween"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["meanSquareBetween"] = 0; }
  try { const v = input.ssWithin / input.dfWithin; results["meanSquareWithin"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["meanSquareWithin"] = 0; }
  try { const v = (input.ssBetween / input.dfBetween) / (input.ssWithin / input.dfWithin); results["fStatistic"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fStatistic"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateF_distribution_calculator(input: F_distribution_calculatorInput): F_distribution_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["fStatistic"]);
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


export interface F_distribution_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
