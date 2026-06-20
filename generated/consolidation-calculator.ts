// Auto-generated from consolidation-calculator-schema.json
import * as z from 'zod';

export interface Consolidation_calculatorInput {
  currentTotalDebt: number;
  currentMonthlyPayment: number;
  currentRemainingMonths: number;
  newInterestRate: number;
  newTermMonths: number;
  consolidationFee: number;
  dataConfidence?: number;
}

export const Consolidation_calculatorInputSchema = z.object({
  currentTotalDebt: z.number().default(100000),
  currentMonthlyPayment: z.number().default(2000),
  currentRemainingMonths: z.number().default(60),
  newInterestRate: z.number().default(15),
  newTermMonths: z.number().default(48),
  consolidationFee: z.number().default(500),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Consolidation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentMonthlyPayment * input.currentRemainingMonths; results["currentTotalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["currentTotalCost"] = Number.NaN; }
  try { const v = input.currentTotalDebt + input.consolidationFee; results["newLoanAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["newLoanAmount"] = Number.NaN; }
  try { const v = input.newInterestRate / 100 / 12; results["monthlyRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyRate"] = Number.NaN; }
  return results;
}


export function calculateConsolidation_calculator(input: Consolidation_calculatorInput): Consolidation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["monthlyRate"]);
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


export interface Consolidation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
