// Auto-generated from risk-probability-calculator-schema.json
import * as z from 'zod';

export interface Risk_probability_calculatorInput {
  failureRate: number;
  missionTime: number;
  stressFactor: number;
  maintenanceFactor: number;
  detectionProbability: number;
  redundancyLevel: number;
  dataConfidence?: number;
}

export const Risk_probability_calculatorInputSchema = z.object({
  failureRate: z.number().default(0.001),
  missionTime: z.number().default(24),
  stressFactor: z.number().default(1.5),
  maintenanceFactor: z.number().default(0.9),
  detectionProbability: z.number().default(0.8),
  redundancyLevel: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Risk_probability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.failureRate * input.stressFactor / input.maintenanceFactor; results["effectiveFailureRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveFailureRate"] = Number.NaN; }
  try { const v = input.failureRate * input.stressFactor / input.maintenanceFactor; results["effectiveFailureRate_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveFailureRate_aux"] = Number.NaN; }
  return results;
}


export function calculateRisk_probability_calculator(input: Risk_probability_calculatorInput): Risk_probability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["effectiveFailureRate_aux"]);
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


export interface Risk_probability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
