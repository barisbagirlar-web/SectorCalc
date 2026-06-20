// Auto-generated from cholesterol-calculator-schema.json
import * as z from 'zod';

export interface Cholesterol_calculatorInput {
  totalCholesterol: number;
  hdlCholesterol: number;
  triglycerides: number;
  ldlCholesterol: number;
  dataConfidence?: number;
}

export const Cholesterol_calculatorInputSchema = z.object({
  totalCholesterol: z.number().default(200),
  hdlCholesterol: z.number().default(50),
  triglycerides: z.number().default(150),
  ldlCholesterol: z.number(),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cholesterol_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ldlCholesterol == null ? input.totalCholesterol - input.hdlCholesterol - input.triglycerides / 5 : input.ldlCholesterol; results["ldl"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ldl"] = Number.NaN; }
  try { const v = input.triglycerides / 5; results["vldl"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vldl"] = Number.NaN; }
  try { const v = input.totalCholesterol - input.hdlCholesterol; results["nonHDL"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["nonHDL"] = Number.NaN; }
  return results;
}


export function calculateCholesterol_calculator(input: Cholesterol_calculatorInput): Cholesterol_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ldl"]);
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


export interface Cholesterol_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
