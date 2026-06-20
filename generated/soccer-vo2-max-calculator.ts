// Auto-generated from soccer-vo2-max-calculator-schema.json
import * as z from 'zod';

export interface Soccer_vo2_max_calculatorInput {
  testType: number;
  maxSpeed: number;
  age: number;
  distance: number;
  dataConfidence?: number;
}

export const Soccer_vo2_max_calculatorInputSchema = z.object({
  testType: z.number().default(0),
  maxSpeed: z.number().default(12),
  age: z.number().default(25),
  distance: z.number().default(2000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Soccer_vo2_max_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.testType === 0 ? (31.025 + 3.238 * input.maxSpeed - 3.248 * input.age + 0.1536 * input.maxSpeed * input.age) : (input.distance * 0.0084 + 36.4); results["vo2max"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vo2max"] = Number.NaN; }
  try { const v = 31.025 + 3.238 * input.maxSpeed - 3.248 * input.age + 0.1536 * input.maxSpeed * input.age; results["VO2max___31_025___3_238___maxSpeed___3_2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["VO2max___31_025___3_238___maxSpeed___3_2"] = Number.NaN; }
  try { const v = input.distance * 0.0084 + 36.4; results["VO2max___distance___0_0084___36_4"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["VO2max___distance___0_0084___36_4"] = Number.NaN; }
  return results;
}


export function calculateSoccer_vo2_max_calculator(input: Soccer_vo2_max_calculatorInput): Soccer_vo2_max_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["vo2max"]);
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


export interface Soccer_vo2_max_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
