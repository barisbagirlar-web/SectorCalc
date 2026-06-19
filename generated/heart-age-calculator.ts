// Auto-generated from heart-age-calculator-schema.json
import * as z from 'zod';

export interface Heart_age_calculatorInput {
  age: number;
  systolicBP: number;
  totalCholesterol: number;
  hdl: number;
  smoker: number;
  diabetes: number;
  treatedBP: number;
  dataConfidence?: number;
}

export const Heart_age_calculatorInputSchema = z.object({
  age: z.number().default(40),
  systolicBP: z.number().default(120),
  totalCholesterol: z.number().default(200),
  hdl: z.number().default(50),
  smoker: z.number().default(0),
  diabetes: z.number().default(0),
  treatedBP: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Heart_age_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.age + 0.2*(input.systolicBP-120) + 0.1*(input.totalCholesterol-200) - 0.1*(input.hdl-50) + 5*input.smoker + 3*input.diabetes + 2*input.treatedBP; results["heartAge"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["heartAge"] = 0; }
  try { const v = input.age; results["baseAge"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["baseAge"] = 0; }
  try { const v = 0.2*(input.systolicBP-120) + 0.1*(input.totalCholesterol-200) - 0.1*(input.hdl-50) + 5*input.smoker + 3*input.diabetes + 2*input.treatedBP; results["adjustment"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHeart_age_calculator(input: Heart_age_calculatorInput): Heart_age_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["heartAge"]));
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


export interface Heart_age_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
