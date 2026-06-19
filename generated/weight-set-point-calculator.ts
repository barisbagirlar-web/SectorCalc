// Auto-generated from weight-set-point-calculator-schema.json
import * as z from 'zod';

export interface Weight_set_point_calculatorInput {
  nominalNetWeight: number;
  processStandardDeviation: number;
  minimumLegalNetWeight: number;
  safetyFactorZ: number;
  tareWeight: number;
  dataConfidence?: number;
}

export const Weight_set_point_calculatorInputSchema = z.object({
  nominalNetWeight: z.number().default(500),
  processStandardDeviation: z.number().default(5),
  minimumLegalNetWeight: z.number().default(485),
  safetyFactorZ: z.number().default(1.645),
  tareWeight: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Weight_set_point_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.minimumLegalNetWeight + input.safetyFactorZ * input.processStandardDeviation; results["minFillWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["minFillWeight"] = 0; }
  try { const v = input.minimumLegalNetWeight + input.safetyFactorZ * input.processStandardDeviation; results["minFillWeight_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["minFillWeight_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWeight_set_point_calculator(input: Weight_set_point_calculatorInput): Weight_set_point_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["minFillWeight_aux"]);
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


export interface Weight_set_point_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
