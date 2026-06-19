// Auto-generated from baby-length-calculator-schema.json
import * as z from 'zod';

export interface Baby_length_calculatorInput {
  ageMonths: number;
  weightKg: number;
  genderCode: number;
  prematureWeeks: number;
  dataConfidence?: number;
}

export const Baby_length_calculatorInputSchema = z.object({
  ageMonths: z.number().default(6),
  weightKg: z.number().default(7.5),
  genderCode: z.number().default(0),
  prematureWeeks: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Baby_length_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ageMonths - (input.prematureWeeks / 4.345); results["correctedAge"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["correctedAge"] = 0; }
  try { const v = 45 + 2.5 * (asFormulaNumber(results["correctedAge"])); results["ageComponent"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ageComponent"] = 0; }
  try { const v = 0.8 * input.weightKg; results["weightComponent"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["weightComponent"] = 0; }
  try { const v = input.genderCode * 1.0; results["genderComponent"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["genderComponent"] = 0; }
  try { const v = (asFormulaNumber(results["ageComponent"])) + (asFormulaNumber(results["weightComponent"])) + (asFormulaNumber(results["genderComponent"])); results["estimatedLength"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["estimatedLength"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBaby_length_calculator(input: Baby_length_calculatorInput): Baby_length_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["estimatedLength"]);
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


export interface Baby_length_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
