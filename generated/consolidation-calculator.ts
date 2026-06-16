// Auto-generated from consolidation-calculator-schema.json
import * as z from 'zod';

export interface Consolidation_calculatorInput {
  currentTotalDebt: number;
  currentMonthlyPayment: number;
  currentRemainingMonths: number;
  newInterestRate: number;
  newTermMonths: number;
  consolidationFee: number;
}

export const Consolidation_calculatorInputSchema = z.object({
  currentTotalDebt: z.number().default(100000),
  currentMonthlyPayment: z.number().default(2000),
  currentRemainingMonths: z.number().default(60),
  newInterestRate: z.number().default(15),
  newTermMonths: z.number().default(48),
  consolidationFee: z.number().default(500),
});

function evaluateAllFormulas(input: Consolidation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentMonthlyPayment * input.currentRemainingMonths; results["currentTotalCost"] = Number.isFinite(v) ? v : 0; } catch { results["currentTotalCost"] = 0; }
  try { const v = input.currentTotalDebt + input.consolidationFee; results["newLoanAmount"] = Number.isFinite(v) ? v : 0; } catch { results["newLoanAmount"] = 0; }
  try { const v = input.newInterestRate / 100 / 12; results["monthlyRate"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyRate"] = 0; }
  try { const v = (results["monthlyRate"] ?? 0) === 0 ? (results["newLoanAmount"] ?? 0) / input.newTermMonths : (results["newLoanAmount"] ?? 0) * (results["monthlyRate"] ?? 0) * Math.pow(1 + (results["monthlyRate"] ?? 0), input.newTermMonths) / (Math.pow(1 + (results["monthlyRate"] ?? 0), input.newTermMonths) - 1); results["newMonthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["newMonthlyPayment"] = 0; }
  try { const v = (results["newMonthlyPayment"] ?? 0) * input.newTermMonths; results["newTotalCost"] = Number.isFinite(v) ? v : 0; } catch { results["newTotalCost"] = 0; }
  try { const v = (results["currentTotalCost"] ?? 0) - (results["newTotalCost"] ?? 0); results["savings"] = Number.isFinite(v) ? v : 0; } catch { results["savings"] = 0; }
  return results;
}


export function calculateConsolidation_calculator(input: Consolidation_calculatorInput): Consolidation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["savings"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
