// Auto-generated from laminate-flooring-calculator-schema.json
import * as z from 'zod';

export interface Laminate_flooring_calculatorInput {
  roomLength: number;
  roomWidth: number;
  plankLength: number;
  plankWidth: number;
  wastePercentage: number;
  dataConfidence?: number;
}

export const Laminate_flooring_calculatorInputSchema = z.object({
  roomLength: z.number().default(5),
  roomWidth: z.number().default(4),
  plankLength: z.number().default(1.29),
  plankWidth: z.number().default(0.192),
  wastePercentage: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Laminate_flooring_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.roomLength * input.roomWidth; results["roomArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["roomArea"] = 0; }
  try { const v = input.plankLength * input.plankWidth; results["plankArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["plankArea"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLaminate_flooring_calculator(input: Laminate_flooring_calculatorInput): Laminate_flooring_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["plankArea"]);
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


export interface Laminate_flooring_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
