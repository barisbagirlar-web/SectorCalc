// Auto-generated from spearman-correlation-calculator-schema.json
import * as z from 'zod';

export interface Spearman_correlation_calculatorInput {
  sampleSize: number;
  sumSquaredDifferences: number;
  tieCorrectionX: number;
  tieCorrectionY: number;
}

export const Spearman_correlation_calculatorInputSchema = z.object({
  sampleSize: z.number().default(5),
  sumSquaredDifferences: z.number().default(2),
  tieCorrectionX: z.number().default(0),
  tieCorrectionY: z.number().default(0),
});

function evaluateAllFormulas(input: Spearman_correlation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sampleSize; results["n"] = Number.isFinite(v) ? v : 0; } catch { results["n"] = 0; }
  try { const v = input.sumSquaredDifferences; results["sumd2"] = Number.isFinite(v) ? v : 0; } catch { results["sumd2"] = 0; }
  try { const v = input.tieCorrectionX; results["Tx"] = Number.isFinite(v) ? v : 0; } catch { results["Tx"] = 0; }
  try { const v = input.tieCorrectionY; results["Ty"] = Number.isFinite(v) ? v : 0; } catch { results["Ty"] = 0; }
  try { const v = ((results["Tx"] ?? 0) + (results["Ty"] ?? 0)) / 12; results["correction"] = Number.isFinite(v) ? v : 0; } catch { results["correction"] = 0; }
  try { const v = 6 * ((results["sumd2"] ?? 0) + (results["correction"] ?? 0)); results["sixTerm"] = Number.isFinite(v) ? v : 0; } catch { results["sixTerm"] = 0; }
  try { const v = (results["n"] ?? 0) * (Math.pow((results["n"] ?? 0), 2) - 1); results["denominator"] = Number.isFinite(v) ? v : 0; } catch { results["denominator"] = 0; }
  try { const v = (results["denominator"] ?? 0) !== 0 ? 1 - (results["sixTerm"] ?? 0) / (results["denominator"] ?? 0) : 0; results["spearmanCoefficient"] = Number.isFinite(v) ? v : 0; } catch { results["spearmanCoefficient"] = 0; }
  return results;
}


export function calculateSpearman_correlation_calculator(input: Spearman_correlation_calculatorInput): Spearman_correlation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["spearmanCoefficient"] ?? 0;
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


export interface Spearman_correlation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
