// Auto-generated from recomp-calculator-schema.json
import * as z from 'zod';

export interface Recomp_calculatorInput {
  baseAmount: number;
  rate: number;
  time: number;
  expenses: number;
  adjustmentFactor: number;
  dataConfidence?: number;
}

export const Recomp_calculatorInputSchema = z.object({
  baseAmount: z.number().default(1000),
  rate: z.number().default(5),
  time: z.number().default(12),
  expenses: z.number().default(0),
  adjustmentFactor: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Recomp_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.baseAmount * (input.rate / 100) * (input.time / 12); results["interestAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["interestAmount"] = Number.NaN; }
  try { const v = input.baseAmount + (toNumericFormulaValue(results["interestAmount"])) + input.expenses; results["totalBeforeAdjustment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalBeforeAdjustment"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalBeforeAdjustment"])) * input.adjustmentFactor; results["totalCompensation"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCompensation"] = Number.NaN; }
  return results;
}


export function calculateRecomp_calculator(input: Recomp_calculatorInput): Recomp_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCompensation"]);
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


export interface Recomp_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
