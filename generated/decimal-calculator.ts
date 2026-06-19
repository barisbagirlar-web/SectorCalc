// Auto-generated from decimal-calculator-schema.json
import * as z from 'zod';

export interface Decimal_calculatorInput {
  operandA: number;
  operandB: number;
  operation: number;
  precision: number;
  roundingMode: number;
  dataConfidence?: number;
}

export const Decimal_calculatorInputSchema = z.object({
  operandA: z.number().default(0),
  operandB: z.number().default(0),
  operation: z.number().default(1),
  precision: z.number().default(2),
  roundingMode: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Decimal_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.operation==1 ? input.operandA+input.operandB : input.operation==2 ? input.operandA-input.operandB : input.operation==3 ? input.operandA*input.operandB : input.operation==4 ? input.operandA/input.operandB : 0; results["unroundedResult"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["unroundedResult"] = 0; }
  try { const v = input.operation==1 ? input.operandA+input.operandB : input.operation==2 ? input.operandA-input.operandB : input.operation==3 ? input.operandA*input.operandB : input.operation==4 ? input.operandA/input.operandB : 0; results["unroundedResult_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["unroundedResult_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDecimal_calculator(input: Decimal_calculatorInput): Decimal_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["unroundedResult_aux"]));
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


export interface Decimal_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
