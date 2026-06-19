// Auto-generated from kelly-criterion-calculator-schema.json
import * as z from 'zod';

export interface Kelly_criterion_calculatorInput {
  p: number;
  b: number;
  bankroll: number;
  fraction: number;
  dataConfidence?: number;
}

export const Kelly_criterion_calculatorInputSchema = z.object({
  p: z.number().default(0.5),
  b: z.number().default(2),
  bankroll: z.number().default(1000),
  fraction: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Kelly_criterion_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.b * input.p - (1 - input.p)) / input.b; results["f_star"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["f_star"] = 0; }
  try { const v = input.fraction * (input.b * input.p - (1 - input.p)) / input.b; results["f"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["f"] = 0; }
  try { const v = input.bankroll * input.fraction * (input.b * input.p - (1 - input.p)) / input.b; results["bet_amount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bet_amount"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateKelly_criterion_calculator(input: Kelly_criterion_calculatorInput): Kelly_criterion_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["bet_amount"]);
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


export interface Kelly_criterion_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
