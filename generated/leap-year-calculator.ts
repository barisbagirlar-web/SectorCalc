// Auto-generated from leap-year-calculator-schema.json
import * as z from 'zod';

export interface Leap_year_calculatorInput {
  year: number;
  divisor4: number;
  divisor100: number;
  divisor400: number;
  dataConfidence?: number;
}

export const Leap_year_calculatorInputSchema = z.object({
  year: z.number().default(2024),
  divisor4: z.number().default(4),
  divisor100: z.number().default(100),
  divisor400: z.number().default(400),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Leap_year_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (((input.year % input.divisor4 === 0 && input.year % input.divisor100 !== 0) || (input.year % input.divisor400 === 0)) ? 1 : 0); results["isLeapYear"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["isLeapYear"] = 0; }
  try { const v = ((input.year % input.divisor4 === 0) ? 1 : 0); results["divBy4"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["divBy4"] = 0; }
  try { const v = ((input.year % input.divisor100 === 0) ? 1 : 0); results["divBy100"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["divBy100"] = 0; }
  try { const v = ((input.year % input.divisor400 === 0) ? 1 : 0); results["divBy400"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["divBy400"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLeap_year_calculator(input: Leap_year_calculatorInput): Leap_year_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["isLeapYear"]);
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


export interface Leap_year_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
