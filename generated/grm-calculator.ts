// Auto-generated from grm-calculator-schema.json
import * as z from 'zod';

export interface Grm_calculatorInput {
  propertyPrice: number;
  annualRentalIncome: number;
  auto_input_3: number;
  dataConfidence?: number;
}

export const Grm_calculatorInputSchema = z.object({
  propertyPrice: z.number().default(500000),
  annualRentalIncome: z.number().default(60000),
  auto_input_3: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Grm_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.propertyPrice / input.annualRentalIncome; results["grm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grm"] = Number.NaN; }
  try { const v = input.propertyPrice / input.annualRentalIncome; results["grm_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grm_aux"] = Number.NaN; }
  return results;
}


export function calculateGrm_calculator(input: Grm_calculatorInput): Grm_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["grm"]);
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


export interface Grm_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
