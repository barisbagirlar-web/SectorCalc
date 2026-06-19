// Auto-generated from pregnancy-test-calculator-schema.json
import * as z from 'zod';

export interface Pregnancy_test_calculatorInput {
  lmpDayOfYear: number;
  currentDayOfYear: number;
  cycleLength: number;
  gestationOverride: number;
  dataConfidence?: number;
}

export const Pregnancy_test_calculatorInputSchema = z.object({
  lmpDayOfYear: z.number().default(1),
  currentDayOfYear: z.number().default(1),
  cycleLength: z.number().default(28),
  gestationOverride: z.number().default(280),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pregnancy_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.lmpDayOfYear + input.gestationOverride + (input.cycleLength - 28)) % 365; results["estimatedDueDay"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["estimatedDueDay"] = 0; }
  try { const v = ((asFormulaNumber(results["estimatedDueDay"])) - input.currentDayOfYear + 365) % 365; results["daysUntilDue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["daysUntilDue"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePregnancy_test_calculator(input: Pregnancy_test_calculatorInput): Pregnancy_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["daysUntilDue"]);
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


export interface Pregnancy_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
