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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Spearman_correlation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sampleSize; results["n"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["n"] = Number.NaN; }
  try { const v = input.sumSquaredDifferences; results["sumd2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sumd2"] = Number.NaN; }
  try { const v = input.tieCorrectionX; results["Tx"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Tx"] = Number.NaN; }
  try { const v = input.tieCorrectionY; results["Ty"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Ty"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["Tx"])) + (toNumericFormulaValue(results["Ty"]))) / 12; results["correction"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["correction"] = Number.NaN; }
  try { const v = 6 * ((toNumericFormulaValue(results["sumd2"])) + (toNumericFormulaValue(results["correction"]))); results["sixTerm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sixTerm"] = Number.NaN; }
  return results;
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
