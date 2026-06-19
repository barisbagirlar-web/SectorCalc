// Auto-generated from spearman-correlation-calculator-schema.json
import * as z from 'zod';

export interface Spearman_correlation_calculatorInput {
  sampleSize: number;
  sumSquaredDifferences: number;
  tieCorrectionX: number;
  tieCorrectionY: number;
  dataConfidence?: number;
}

export const Spearman_correlation_calculatorInputSchema = z.object({
  sampleSize: z.number().default(5),
  sumSquaredDifferences: z.number().default(2),
  tieCorrectionX: z.number().default(0),
  tieCorrectionY: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Spearman_correlation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sampleSize; results["n"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["n"] = 0; }
  try { const v = input.sumSquaredDifferences; results["sumd2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sumd2"] = 0; }
  try { const v = input.tieCorrectionX; results["Tx"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["Tx"] = 0; }
  try { const v = input.tieCorrectionY; results["Ty"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["Ty"] = 0; }
  try { const v = ((asFormulaNumber(results["Tx"])) + (asFormulaNumber(results["Ty"]))) / 12; results["correction"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["correction"] = 0; }
  try { const v = 6 * ((asFormulaNumber(results["sumd2"])) + (asFormulaNumber(results["correction"]))); results["sixTerm"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sixTerm"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSpearman_correlation_calculator(input: Spearman_correlation_calculatorInput): Spearman_correlation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sixTerm"]);
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


export interface Spearman_correlation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
