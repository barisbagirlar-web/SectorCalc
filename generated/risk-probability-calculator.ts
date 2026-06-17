// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Risk_probability_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.failureRate * input.stressFactor / input.maintenanceFactor; results["effectiveFailureRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["effectiveFailureRate"] = 0; }
  try { const v = input.failureRate * input.stressFactor / input.maintenanceFactor; results["effectiveFailureRate_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["effectiveFailureRate_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRisk_probability_calculator(input: Risk_probability_calculatorInput): Risk_probability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["effectiveFailureRate_aux"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
