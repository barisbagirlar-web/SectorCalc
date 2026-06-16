// Auto-generated from reliability-calculator-schema.json
import * as z from 'zod';

export interface Reliability_calculatorInput {
  failureRate: number;
  missionTime: number;
  seriesCount: number;
  parallelCount: number;
}

export const Reliability_calculatorInputSchema = z.object({
  failureRate: z.number().default(0.0001),
  missionTime: z.number().default(1000),
  seriesCount: z.number().default(1),
  parallelCount: z.number().default(1),
});

function evaluateAllFormulas(input: Reliability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.exp(-input.failureRate * input.missionTime); results["componentReliability"] = Number.isFinite(v) ? v : 0; } catch { results["componentReliability"] = 0; }
  try { const v = Math.pow((results["componentReliability"] ?? 0), input.seriesCount); results["seriesStringReliability"] = Number.isFinite(v) ? v : 0; } catch { results["seriesStringReliability"] = 0; }
  try { const v = input.parallelCount === 1 ? (results["seriesStringReliability"] ?? 0) : 1 - Math.pow(1 - (results["seriesStringReliability"] ?? 0), input.parallelCount); results["systemReliability"] = Number.isFinite(v) ? v : 0; } catch { results["systemReliability"] = 0; }
  return results;
}


export function calculateReliability_calculator(input: Reliability_calculatorInput): Reliability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["systemReliability"] ?? 0;
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


export interface Reliability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
