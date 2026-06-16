// Auto-generated from pregnancy-test-calculator-schema.json
import * as z from 'zod';

export interface Pregnancy_test_calculatorInput {
  lmpDayOfYear: number;
  currentDayOfYear: number;
  cycleLength: number;
  gestationOverride: number;
}

export const Pregnancy_test_calculatorInputSchema = z.object({
  lmpDayOfYear: z.number().default(1),
  currentDayOfYear: z.number().default(1),
  cycleLength: z.number().default(28),
  gestationOverride: z.number().default(280),
});

function evaluateAllFormulas(input: Pregnancy_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.floor((input.currentDayOfYear - input.lmpDayOfYear) / 7); results["weeksPregnant"] = Number.isFinite(v) ? v : 0; } catch { results["weeksPregnant"] = 0; }
  try { const v = (input.lmpDayOfYear + input.gestationOverride + (input.cycleLength - 28)) % 365; results["estimatedDueDay"] = Number.isFinite(v) ? v : 0; } catch { results["estimatedDueDay"] = 0; }
  try { const v = ((results["estimatedDueDay"] ?? 0) - input.currentDayOfYear + 365) % 365; results["daysUntilDue"] = Number.isFinite(v) ? v : 0; } catch { results["daysUntilDue"] = 0; }
  return results;
}


export function calculatePregnancy_test_calculator(input: Pregnancy_test_calculatorInput): Pregnancy_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["weeksPregnant"] ?? 0;
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


export interface Pregnancy_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
