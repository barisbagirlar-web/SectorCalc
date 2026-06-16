// Auto-generated from quit-smoking-calculator-schema.json
import * as z from 'zod';

export interface Quit_smoking_calculatorInput {
  cigarettesPerDay: number;
  costPerPack: number;
  packSize: number;
  yearsSmoked: number;
  avgCigLifeLost: number;
}

export const Quit_smoking_calculatorInputSchema = z.object({
  cigarettesPerDay: z.number().default(20),
  costPerPack: z.number().default(10),
  packSize: z.number().default(20),
  yearsSmoked: z.number().default(10),
  avgCigLifeLost: z.number().default(11),
});

function evaluateAllFormulas(input: Quit_smoking_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.cigarettesPerDay / input.packSize) * input.costPerPack; results["dailySavings"] = Number.isFinite(v) ? v : 0; } catch { results["dailySavings"] = 0; }
  try { const v = (input.cigarettesPerDay / input.packSize) * input.costPerPack * 30; results["monthlySavings"] = Number.isFinite(v) ? v : 0; } catch { results["monthlySavings"] = 0; }
  try { const v = (input.cigarettesPerDay / input.packSize) * input.costPerPack * 365; results["annualSavings"] = Number.isFinite(v) ? v : 0; } catch { results["annualSavings"] = 0; }
  try { const v = (input.cigarettesPerDay * 365 * input.avgCigLifeLost) / 525600; results["lifeGainedPerYear"] = Number.isFinite(v) ? v : 0; } catch { results["lifeGainedPerYear"] = 0; }
  try { const v = (input.cigarettesPerDay * 365 * input.yearsSmoked * input.avgCigLifeLost) / 525600; results["pastLifeLostYears"] = Number.isFinite(v) ? v : 0; } catch { results["pastLifeLostYears"] = 0; }
  return results;
}


export function calculateQuit_smoking_calculator(input: Quit_smoking_calculatorInput): Quit_smoking_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["annualSavings"] ?? 0;
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


export interface Quit_smoking_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
