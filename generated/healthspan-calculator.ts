// Auto-generated from healthspan-calculator-schema.json
import * as z from 'zod';

export interface Healthspan_calculatorInput {
  currentAge: number;
  smokingYears: number;
  bmi: number;
  exerciseHoursPerWeek: number;
  dietQualityScore: number;
  alcoholUnitsPerWeek: number;
  dataConfidence?: number;
}

export const Healthspan_calculatorInputSchema = z.object({
  currentAge: z.number().default(30),
  smokingYears: z.number().default(0),
  bmi: z.number().default(25),
  exerciseHoursPerWeek: z.number().default(3),
  dietQualityScore: z.number().default(70),
  alcoholUnitsPerWeek: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Healthspan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 80 - input.currentAge; results["baseRemainingYears"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["baseRemainingYears"] = 0; }
  try { const v = (input.dietQualityScore - 50) / 10; results["dietGain"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dietGain"] = 0; }
  try { const v = input.alcoholUnitsPerWeek * 0.5; results["alcoholLoss"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["alcoholLoss"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHealthspan_calculator(input: Healthspan_calculatorInput): Healthspan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["alcoholLoss"]));
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


export interface Healthspan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
