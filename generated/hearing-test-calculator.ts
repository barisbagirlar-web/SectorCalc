// Auto-generated from hearing-test-calculator-schema.json
import * as z from 'zod';

export interface Hearing_test_calculatorInput {
  threshold500: number;
  threshold1000: number;
  threshold2000: number;
  threshold4000: number;
  dataConfidence?: number;
}

export const Hearing_test_calculatorInputSchema = z.object({
  threshold500: z.number().default(0),
  threshold1000: z.number().default(0),
  threshold2000: z.number().default(0),
  threshold4000: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hearing_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.threshold500 + input.threshold1000 + input.threshold2000 + input.threshold4000) / 4; results["pureToneAverage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pureToneAverage"] = Number.NaN; }
  try { const v = (input.threshold500 + input.threshold1000 + input.threshold2000 + input.threshold4000) / 4; results["pureToneAverage_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pureToneAverage_aux"] = Number.NaN; }
  return results;
}


export function calculateHearing_test_calculator(input: Hearing_test_calculatorInput): Hearing_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["pureToneAverage"]);
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


export interface Hearing_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
