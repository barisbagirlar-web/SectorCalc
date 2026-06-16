// Auto-generated from rv-calculator-schema.json
import * as z from 'zod';

export interface Rv_calculatorInput {
  failureRate: number;
  downtimeHours: number;
  costPerHour: number;
  detectionProbability: number;
}

export const Rv_calculatorInputSchema = z.object({
  failureRate: z.number().default(0.5),
  downtimeHours: z.number().default(8),
  costPerHour: z.number().default(1000),
  detectionProbability: z.number().default(0.7),
});

function evaluateAllFormulas(input: Rv_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.failureRate * input.downtimeHours * input.costPerHour; results["grossExpectedLoss"] = Number.isFinite(v) ? v : 0; } catch { results["grossExpectedLoss"] = 0; }
  try { const v = (results["grossExpectedLoss"] ?? 0) * input.detectionProbability; results["detectionSavings"] = Number.isFinite(v) ? v : 0; } catch { results["detectionSavings"] = 0; }
  try { const v = (results["grossExpectedLoss"] ?? 0) - (results["detectionSavings"] ?? 0); results["annualExpectedLoss"] = Number.isFinite(v) ? v : 0; } catch { results["annualExpectedLoss"] = 0; }
  return results;
}


export function calculateRv_calculator(input: Rv_calculatorInput): Rv_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["annualExpectedLoss"] ?? 0;
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


export interface Rv_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
