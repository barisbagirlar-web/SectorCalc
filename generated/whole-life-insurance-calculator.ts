// Auto-generated from whole-life-insurance-calculator-schema.json
import * as z from 'zod';

export interface Whole_life_insurance_calculatorInput {
  sumAssured: number;
  mortalityRate: number;
  interestRate: number;
  expenseLoading: number;
  dataConfidence?: number;
}

export const Whole_life_insurance_calculatorInputSchema = z.object({
  sumAssured: z.number().default(100000),
  mortalityRate: z.number().default(0.01),
  interestRate: z.number().default(0.05),
  expenseLoading: z.number().default(0.1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Whole_life_insurance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sumAssured * input.mortalityRate / (input.interestRate + input.mortalityRate); results["Net Single Premium"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["Net Single Premium"] = 0; }
  try { const v = input.sumAssured * input.mortalityRate / (1 + input.interestRate); results["Annual Net Premium"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["Annual Net Premium"] = 0; }
  try { const v = input.sumAssured * input.mortalityRate / (input.interestRate + input.mortalityRate) * (1 + input.expenseLoading); results["Gross Single Premium"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["Gross Single Premium"] = 0; }
  try { const v = input.sumAssured * input.mortalityRate / (1 + input.interestRate) * (1 + input.expenseLoading); results["Gross Annual Premium"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["Gross Annual Premium"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWhole_life_insurance_calculator(input: Whole_life_insurance_calculatorInput): Whole_life_insurance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["Gross"]));
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


export interface Whole_life_insurance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
