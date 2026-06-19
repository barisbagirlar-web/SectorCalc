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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Grm_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.propertyPrice / input.annualRentalIncome; results["grm"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["grm"] = 0; }
  try { const v = input.propertyPrice / input.annualRentalIncome; results["grm_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["grm_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGrm_calculator(input: Grm_calculatorInput): Grm_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["grm"]));
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


export interface Grm_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
