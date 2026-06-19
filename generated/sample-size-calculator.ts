// Auto-generated from sample-size-calculator-schema.json
import * as z from 'zod';

export interface Sample_size_calculatorInput {
  populationSize: number;
  proportion: number;
  marginOfError: number;
  zScore: number;
  dataConfidence?: number;
}

export const Sample_size_calculatorInputSchema = z.object({
  populationSize: z.number().default(10000),
  proportion: z.number().default(0.5),
  marginOfError: z.number().default(0.05),
  zScore: z.number().default(1.96),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sample_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.zScore**2 * input.proportion * (1 - input.proportion)) / (input.marginOfError**2); results["sampleSizeInfinite"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sampleSizeInfinite"] = 0; }
  try { const v = (asFormulaNumber(results["sampleSizeInfinite"])) / (1 + ((asFormulaNumber(results["sampleSizeInfinite"])) - 1) / input.populationSize); results["sampleSizeFinite"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sampleSizeFinite"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSample_size_calculator(input: Sample_size_calculatorInput): Sample_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sampleSizeFinite"]);
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


export interface Sample_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
