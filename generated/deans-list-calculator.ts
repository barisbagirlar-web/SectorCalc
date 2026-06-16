// Auto-generated from deans-list-calculator-schema.json
import * as z from 'zod';

export interface Deans_list_calculatorInput {
  totalCredits: number;
  earnedCredits: number;
  gpa: number;
  minGpa: number;
  minCredits: number;
}

export const Deans_list_calculatorInputSchema = z.object({
  totalCredits: z.number().default(30),
  earnedCredits: z.number().default(30),
  gpa: z.number().default(3.5),
  minGpa: z.number().default(3.5),
  minCredits: z.number().default(12),
});

function evaluateAllFormulas(input: Deans_list_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.gpa >= input.minGpa; results["meetsGpaRequirement"] = Number.isFinite(v) ? v : 0; } catch { results["meetsGpaRequirement"] = 0; }
  try { const v = input.earnedCredits >= input.minCredits; results["meetsCreditRequirement"] = Number.isFinite(v) ? v : 0; } catch { results["meetsCreditRequirement"] = 0; }
  try { const v = (results["meetsGpaRequirement"] ?? 0) && (results["meetsCreditRequirement"] ?? 0); results["isEligible"] = Number.isFinite(v) ? v : 0; } catch { results["isEligible"] = 0; }
  try { const v = input.gpa - input.minGpa; results["gpaDifference"] = Number.isFinite(v) ? v : 0; } catch { results["gpaDifference"] = 0; }
  try { const v = input.minCredits - input.earnedCredits; results["creditDeficit"] = Number.isFinite(v) ? v : 0; } catch { results["creditDeficit"] = 0; }
  return results;
}


export function calculateDeans_list_calculator(input: Deans_list_calculatorInput): Deans_list_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["isEligible"] ?? 0;
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


export interface Deans_list_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
