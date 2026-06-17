// Auto-generated from hearing-test-calculator-schema.json
import * as z from 'zod';

export interface Hearing_test_calculatorInput {
  threshold500: number;
  threshold1000: number;
  threshold2000: number;
  threshold4000: number;
}

export const Hearing_test_calculatorInputSchema = z.object({
  threshold500: z.number().default(0),
  threshold1000: z.number().default(0),
  threshold2000: z.number().default(0),
  threshold4000: z.number().default(0),
});

function evaluateAllFormulas(input: Hearing_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.threshold500 + input.threshold1000 + input.threshold2000 + input.threshold4000) / 4; results["pureToneAverage"] = Number.isFinite(v) ? v : 0; } catch { results["pureToneAverage"] = 0; }
  results["Pure_Tone_Average__PTA__is_the_arithmeti"] = 0;
  results["PTA_is_commonly_used_to_classify_the_deg"] = 0;
  return results;
}


export function calculateHearing_test_calculator(input: Hearing_test_calculatorInput): Hearing_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["pureToneAverage"] ?? 0;
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


export interface Hearing_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
