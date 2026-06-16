// Auto-generated from cholesterol-calculator-schema.json
import * as z from 'zod';

export interface Cholesterol_calculatorInput {
  totalCholesterol: number;
  hdlCholesterol: number;
  triglycerides: number;
  ldlCholesterol: number;
}

export const Cholesterol_calculatorInputSchema = z.object({
  totalCholesterol: z.number().default(200),
  hdlCholesterol: z.number().default(50),
  triglycerides: z.number().default(150),
  ldlCholesterol: z.number(),
});

function evaluateAllFormulas(input: Cholesterol_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ldlCholesterol == null ? input.totalCholesterol - input.hdlCholesterol - input.triglycerides / 5 : input.ldlCholesterol; results["ldl"] = Number.isFinite(v) ? v : 0; } catch { results["ldl"] = 0; }
  try { const v = input.triglycerides / 5; results["vldl"] = Number.isFinite(v) ? v : 0; } catch { results["vldl"] = 0; }
  try { const v = input.totalCholesterol - input.hdlCholesterol; results["nonHDL"] = Number.isFinite(v) ? v : 0; } catch { results["nonHDL"] = 0; }
  return results;
}


export function calculateCholesterol_calculator(input: Cholesterol_calculatorInput): Cholesterol_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["ldl"] ?? 0;
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


export interface Cholesterol_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
