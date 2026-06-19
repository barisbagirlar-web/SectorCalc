// Auto-generated from simple-interest-calculator-schema.json
import * as z from 'zod';

export interface Simple_interest_calculatorInput {
  principal: number;
  rate: number;
  startYear: number;
  endYear: number;
  dataConfidence?: number;
}

export const Simple_interest_calculatorInputSchema = z.object({
  principal: z.number().default(1000),
  rate: z.number().default(5),
  startYear: z.number().default(2025),
  endYear: z.number().default(2030),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Simple_interest_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.endYear - input.startYear; results["timeInYears"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["timeInYears"] = 0; }
  try { const v = input.principal * (input.rate / 100) * (asFormulaNumber(results["timeInYears"])); results["simpleInterest"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["simpleInterest"] = 0; }
  try { const v = input.principal + (asFormulaNumber(results["simpleInterest"])); results["totalAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalAmount"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSimple_interest_calculator(input: Simple_interest_calculatorInput): Simple_interest_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["simpleInterest"]));
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


export interface Simple_interest_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
