// Auto-generated from normal-distribution-calculator-schema.json
import * as z from 'zod';

export interface Normal_distribution_calculatorInput {
  mean: number;
  stdDev: number;
  x: number;
}

export const Normal_distribution_calculatorInputSchema = z.object({
  mean: z.number().default(0),
  stdDev: z.number().default(1),
  x: z.number().default(0),
});

function evaluateAllFormulas(input: Normal_distribution_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.x - input.mean) / input.stdDev; results["zScore"] = Number.isFinite(v) ? v : 0; } catch { results["zScore"] = 0; }
  try { const v = Math.exp(-0.5 * Math.pow((input.x - input.mean) / input.stdDev, 2)) / (input.stdDev * Math.sqrt(2 * Math.PI)); results["probabilityDensity"] = Number.isFinite(v) ? v : 0; } catch { results["probabilityDensity"] = 0; }
  try { const v = ((input.x - input.mean) / input.stdDev) > 0 ? 1 - (0.3989423 * Math.exp(-Math.pow((input.x - input.mean) / input.stdDev, 2) / 2) * (1 / (1 + 0.2316419 * Math.abs((input.x - input.mean) / input.stdDev))) * (0.3193815 + (1 / (1 + 0.2316419 * Math.abs((input.x - input.mean) / input.stdDev))) * (-0.3565638 + (1 / (1 + 0.2316419 * Math.abs((input.x - input.mean) / input.stdDev))) * (1.781478 + (1 / (1 + 0.2316419 * Math.abs((input.x - input.mean) / input.stdDev))) * (-1.821256 + (1 / (1 + 0.2316419 * Math.abs((input.x - input.mean) / input.stdDev))) * 1.330274)))) ) : (0.3989423 * Math.exp(-Math.pow((input.x - input.mean) / input.stdDev, 2) / 2) * (1 / (1 + 0.2316419 * Math.abs((input.x - input.mean) / input.stdDev))) * (0.3193815 + (1 / (1 + 0.2316419 * Math.abs((input.x - input.mean) / input.stdDev))) * (-0.3565638 + (1 / (1 + 0.2316419 * Math.abs((input.x - input.mean) / input.stdDev))) * (1.781478 + (1 / (1 + 0.2316419 * Math.abs((input.x - input.mean) / input.stdDev))) * (-1.821256 + (1 / (1 + 0.2316419 * Math.abs((input.x - input.mean) / input.stdDev))) * 1.330274)))) ); results["cumulativeProbability"] = Number.isFinite(v) ? v : 0; } catch { results["cumulativeProbability"] = 0; }
  return results;
}


export function calculateNormal_distribution_calculator(input: Normal_distribution_calculatorInput): Normal_distribution_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cumulativeProbability"] ?? 0;
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


export interface Normal_distribution_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
