// Auto-generated from turkey-installment-calculator-schema.json
import * as z from 'zod';

export interface Turkey_installment_calculatorInput {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  bsmv: number;
  kkdf: number;
  fee: number;
  dataConfidence?: number;
}

export const Turkey_installment_calculatorInputSchema = z.object({
  loanAmount: z.number().default(10000),
  interestRate: z.number().default(24),
  loanTerm: z.number().default(12),
  bsmv: z.number().default(5),
  kkdf: z.number().default(15),
  fee: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Turkey_installment_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.interestRate / 100 / 12) * (1 + input.bsmv/100 + input.kkdf/100); results["effectiveMonthlyRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveMonthlyRate"] = Number.NaN; }
  try { const v = (input.interestRate / 100 / 12) * (1 + input.bsmv/100 + input.kkdf/100); results["effectiveMonthlyRate_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveMonthlyRate_aux"] = Number.NaN; }
  return results;
}


export function calculateTurkey_installment_calculator(input: Turkey_installment_calculatorInput): Turkey_installment_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["effectiveMonthlyRate_aux"]);
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


export interface Turkey_installment_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
