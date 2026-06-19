// Auto-generated from minutes-to-hours-calculator-schema.json
import * as z from 'zod';

export interface Minutes_to_hours_calculatorInput {
  inputMinutes: number;
  decPlaces: number;
  fmt: number;
  rndMode: number;
  dataConfidence?: number;
}

export const Minutes_to_hours_calculatorInputSchema = z.object({
  inputMinutes: z.number().default(60),
  decPlaces: z.number().default(2),
  fmt: z.number().default(0),
  rndMode: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Minutes_to_hours_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.inputMinutes; results["breakdown"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["breakdown"] = 0; }
  try { const v = input.inputMinutes; results["breakdown_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["breakdown_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMinutes_to_hours_calculator(input: Minutes_to_hours_calculatorInput): Minutes_to_hours_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["breakdown_aux"]);
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


export interface Minutes_to_hours_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
