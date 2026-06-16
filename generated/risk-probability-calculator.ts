// Auto-generated from risk-probability-calculator-schema.json
import * as z from 'zod';

export interface Risk_probability_calculatorInput {
  failureRate: number;
  missionTime: number;
  stressFactor: number;
  maintenanceFactor: number;
  detectionProbability: number;
  redundancyLevel: number;
}

export const Risk_probability_calculatorInputSchema = z.object({
  failureRate: z.number().default(0.001),
  missionTime: z.number().default(24),
  stressFactor: z.number().default(1.5),
  maintenanceFactor: z.number().default(0.9),
  detectionProbability: z.number().default(0.8),
  redundancyLevel: z.number().default(1),
});

function evaluateAllFormulas(input: Risk_probability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.failureRate * input.stressFactor / input.maintenanceFactor; results["effectiveFailureRate"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveFailureRate"] = 0; }
  try { const v = 1 - Math.exp(-(results["effectiveFailureRate"] ?? 0) * input.missionTime); results["componentFailureProb"] = Number.isFinite(v) ? v : 0; } catch { results["componentFailureProb"] = 0; }
  try { const v = Math.pow((results["componentFailureProb"] ?? 0), input.redundancyLevel); results["systemFailureProb"] = Number.isFinite(v) ? v : 0; } catch { results["systemFailureProb"] = 0; }
  try { const v = (results["systemFailureProb"] ?? 0) * (1 - input.detectionProbability); results["riskProbability"] = Number.isFinite(v) ? v : 0; } catch { results["riskProbability"] = 0; }
  try { const v = (results["riskProbability"] ?? 0) * 100; results["primaryResult"] = Number.isFinite(v) ? v : 0; } catch { results["primaryResult"] = 0; }
  return results;
}


export function calculateRisk_probability_calculator(input: Risk_probability_calculatorInput): Risk_probability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primaryResult"] ?? 0;
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


export interface Risk_probability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
