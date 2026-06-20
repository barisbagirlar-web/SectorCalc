// Auto-generated from half-birthday-calculator-schema.json
import * as z from 'zod';

export interface Half_birthday_calculatorInput {
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  monthOffset: number;
  dataConfidence?: number;
}

export const Half_birthday_calculatorInputSchema = z.object({
  birthDay: z.number().default(1),
  birthMonth: z.number().default(1),
  birthYear: z.number().default(2000),
  monthOffset: z.number().default(6),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Half_birthday_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.birthMonth + input.monthOffset - 1; results["totalMonths"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMonths"] = Number.NaN; }
  try { const v = input.birthMonth + input.monthOffset - 1; results["totalMonths_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMonths_aux"] = Number.NaN; }
  return results;
}


export function calculateHalf_birthday_calculator(input: Half_birthday_calculatorInput): Half_birthday_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalMonths_aux"]);
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


export interface Half_birthday_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
