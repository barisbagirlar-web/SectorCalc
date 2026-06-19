// Auto-generated from treasury-bond-calculator-schema.json
import * as z from 'zod';

export interface Treasury_bond_calculatorInput {
  faceValue: number;
  couponRate: number;
  yearsToMaturity: number;
  yieldToMaturity: number;
  frequency: number;
  dataConfidence?: number;
}

export const Treasury_bond_calculatorInputSchema = z.object({
  faceValue: z.number().default(1000),
  couponRate: z.number().default(5),
  yearsToMaturity: z.number().default(10),
  yieldToMaturity: z.number().default(4),
  frequency: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Treasury_bond_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.faceValue * (input.couponRate / 100) * input.yearsToMaturity * (input.yieldToMaturity / 100); results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.faceValue * (input.couponRate / 100) * input.yearsToMaturity * (input.yieldToMaturity / 100) * (input.frequency); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.frequency; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTreasury_bond_calculator(input: Treasury_bond_calculatorInput): Treasury_bond_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Treasury_bond_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
