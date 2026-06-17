// Auto-generated from soccer-vo2-max-calculator-schema.json
import * as z from 'zod';

export interface Soccer_vo2_max_calculatorInput {
  testType: number;
  maxSpeed: number;
  age: number;
  distance: number;
}

export const Soccer_vo2_max_calculatorInputSchema = z.object({
  testType: z.number().default(0),
  maxSpeed: z.number().default(12),
  age: z.number().default(25),
  distance: z.number().default(2000),
});

function evaluateAllFormulas(input: Soccer_vo2_max_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.testType === 0 ? (31.025 + 3.238 * input.maxSpeed - 3.248 * input.age + 0.1536 * input.maxSpeed * input.age) : (input.distance * 0.0084 + 36.4); results["vo2max"] = Number.isFinite(v) ? v : 0; } catch { results["vo2max"] = 0; }
  try { const v = 31.025 + 3.238 * input.maxSpeed - 3.248 * input.age + 0.1536 * input.maxSpeed * input.age; results["VO2max___31_025___3_238___maxSpeed___3_2"] = Number.isFinite(v) ? v : 0; } catch { results["VO2max___31_025___3_238___maxSpeed___3_2"] = 0; }
  try { const v = input.distance * 0.0084 + 36.4; results["VO2max___distance___0_0084___36_4"] = Number.isFinite(v) ? v : 0; } catch { results["VO2max___distance___0_0084___36_4"] = 0; }
  return results;
}


export function calculateSoccer_vo2_max_calculator(input: Soccer_vo2_max_calculatorInput): Soccer_vo2_max_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["vo2max"] ?? 0;
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


export interface Soccer_vo2_max_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
