// Auto-generated from skewness-calculator-schema.json
import * as z from 'zod';

export interface Skewness_calculatorInput {
  dataPoint1: number;
  dataPoint2: number;
  dataPoint3: number;
  dataPoint4: number;
  dataPoint5: number;
  dataPoint6: number;
  dataPoint7: number;
  dataPoint8: number;
}

export const Skewness_calculatorInputSchema = z.object({
  dataPoint1: z.number().default(1),
  dataPoint2: z.number().default(2),
  dataPoint3: z.number().default(3),
  dataPoint4: z.number().default(4),
  dataPoint5: z.number().default(5),
  dataPoint6: z.number().default(6),
  dataPoint7: z.number().default(7),
  dataPoint8: z.number().default(8),
});

function evaluateAllFormulas(input: Skewness_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.dataPoint1 + input.dataPoint2 + input.dataPoint3 + input.dataPoint4 + input.dataPoint5 + input.dataPoint6 + input.dataPoint7 + input.dataPoint8) / 8; results["mean"] = Number.isFinite(v) ? v : 0; } catch { results["mean"] = 0; }
  try { const v = Math.pow(input.dataPoint1 - (results["mean"] ?? 0), 2) + Math.pow(input.dataPoint2 - (results["mean"] ?? 0), 2) + Math.pow(input.dataPoint3 - (results["mean"] ?? 0), 2) + Math.pow(input.dataPoint4 - (results["mean"] ?? 0), 2) + Math.pow(input.dataPoint5 - (results["mean"] ?? 0), 2) + Math.pow(input.dataPoint6 - (results["mean"] ?? 0), 2) + Math.pow(input.dataPoint7 - (results["mean"] ?? 0), 2) + Math.pow(input.dataPoint8 - (results["mean"] ?? 0), 2); results["ss"] = Number.isFinite(v) ? v : 0; } catch { results["ss"] = 0; }
  try { const v = (results["ss"] ?? 0) / (n - 1); results["variance"] = Number.isFinite(v) ? v : 0; } catch { results["variance"] = 0; }
  try { const v = Math.sqrt((results["variance"] ?? 0)); results["stdDev"] = Number.isFinite(v) ? v : 0; } catch { results["stdDev"] = 0; }
  try { const v = Math.pow((input.dataPoint1 - (results["mean"] ?? 0)) / (results["stdDev"] ?? 0), 3) + Math.pow((input.dataPoint2 - (results["mean"] ?? 0)) / (results["stdDev"] ?? 0), 3) + Math.pow((input.dataPoint3 - (results["mean"] ?? 0)) / (results["stdDev"] ?? 0), 3) + Math.pow((input.dataPoint4 - (results["mean"] ?? 0)) / (results["stdDev"] ?? 0), 3) + Math.pow((input.dataPoint5 - (results["mean"] ?? 0)) / (results["stdDev"] ?? 0), 3) + Math.pow((input.dataPoint6 - (results["mean"] ?? 0)) / (results["stdDev"] ?? 0), 3) + Math.pow((input.dataPoint7 - (results["mean"] ?? 0)) / (results["stdDev"] ?? 0), 3) + Math.pow((input.dataPoint8 - (results["mean"] ?? 0)) / (results["stdDev"] ?? 0), 3); results["sumCubedDev"] = Number.isFinite(v) ? v : 0; } catch { results["sumCubedDev"] = 0; }
  try { const v = (n / ((n - 1) * (n - 2))) * (results["sumCubedDev"] ?? 0); results["skewness"] = Number.isFinite(v) ? v : 0; } catch { results["skewness"] = 0; }
  return results;
}


export function calculateSkewness_calculator(input: Skewness_calculatorInput): Skewness_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["skewness"] ?? 0;
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


export interface Skewness_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
