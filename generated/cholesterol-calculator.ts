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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cholesterol_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ldlCholesterol == null ? input.totalCholesterol - input.hdlCholesterol - input.triglycerides / 5 : input.ldlCholesterol; results["ldl"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ldl"] = 0; }
  try { const v = input.triglycerides / 5; results["vldl"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["vldl"] = 0; }
  try { const v = input.totalCholesterol - input.hdlCholesterol; results["nonHDL"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["nonHDL"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCholesterol_calculator(input: Cholesterol_calculatorInput): Cholesterol_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["ldl"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
