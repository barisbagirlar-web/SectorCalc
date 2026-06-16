// Auto-generated from rewards-calculator-schema.json
import * as z from 'zod';

export interface Rewards_calculatorInput {
  baseSalary: number;
  performanceScore: number;
  bonusPercent: number;
  teamMultiplier: number;
  tenureYears: number;
  safetyRating: number;
}

export const Rewards_calculatorInputSchema = z.object({
  baseSalary: z.number().default(5000),
  performanceScore: z.number().default(80),
  bonusPercent: z.number().default(20),
  teamMultiplier: z.number().default(1),
  tenureYears: z.number().default(2),
  safetyRating: z.number().default(95),
});

function evaluateAllFormulas(input: Rewards_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.baseSalary + (results["bonus"] ?? 0) + (results["loyalty"] ?? 0) + (results["safety"] ?? 0); results["total"] = Number.isFinite(v) ? v : 0; } catch { results["total"] = 0; }
  try { const v = input.baseSalary * (input.bonusPercent / 100) * (input.performanceScore / 100) * input.teamMultiplier; results["bonus"] = Number.isFinite(v) ? v : 0; } catch { results["bonus"] = 0; }
  try { const v = input.baseSalary * 0.01 * input.tenureYears; results["loyalty"] = Number.isFinite(v) ? v : 0; } catch { results["loyalty"] = 0; }
  try { const v = input.baseSalary * (input.safetyRating / 100) * 0.05; results["safety"] = Number.isFinite(v) ? v : 0; } catch { results["safety"] = 0; }
  return results;
}


export function calculateRewards_calculator(input: Rewards_calculatorInput): Rewards_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total"] ?? 0;
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


export interface Rewards_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
