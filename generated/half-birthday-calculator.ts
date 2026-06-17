// @ts-nocheck
// Auto-generated from half-birthday-calculator-schema.json
import * as z from 'zod';

export interface Half_birthday_calculatorInput {
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  monthOffset: number;
}

export const Half_birthday_calculatorInputSchema = z.object({
  birthDay: z.number().default(1),
  birthMonth: z.number().default(1),
  birthYear: z.number().default(2000),
  monthOffset: z.number().default(6),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Half_birthday_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.birthMonth + input.monthOffset - 1; results["totalMonths"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalMonths"] = 0; }
  try { const v = input.birthMonth + input.monthOffset - 1; results["totalMonths_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalMonths_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateHalf_birthday_calculator(input: Half_birthday_calculatorInput): Half_birthday_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalMonths_aux"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
