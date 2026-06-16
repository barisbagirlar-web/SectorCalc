// Auto-generated from safe-withdrawal-rate-calculator-schema.json
import * as z from 'zod';

export interface Safe_withdrawal_rate_calculatorInput {
  initialPortfolio: number;
  expectedReturnRate: number;
  inflationRate: number;
  retirementYears: number;
}

export const Safe_withdrawal_rate_calculatorInputSchema = z.object({
  initialPortfolio: z.number().default(1000000),
  expectedReturnRate: z.number().default(7),
  inflationRate: z.number().default(3),
  retirementYears: z.number().default(30),
});

function evaluateAllFormulas(input: Safe_withdrawal_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (1 + input.expectedReturnRate/100) / (1 + input.inflationRate/100) - 1; results["realRate"] = Number.isFinite(v) ? v : 0; } catch { results["realRate"] = 0; }
  try { const v = input.initialPortfolio * (results["realRate"] ?? 0) / (1 - Math.pow(1 + (results["realRate"] ?? 0), -input.retirementYears)); results["annualWithdrawalAmount"] = Number.isFinite(v) ? v : 0; } catch { results["annualWithdrawalAmount"] = 0; }
  try { const v = ((results["annualWithdrawalAmount"] ?? 0) / input.initialPortfolio) * 100; results["safeWithdrawalRate"] = Number.isFinite(v) ? v : 0; } catch { results["safeWithdrawalRate"] = 0; }
  return results;
}


export function calculateSafe_withdrawal_rate_calculator(input: Safe_withdrawal_rate_calculatorInput): Safe_withdrawal_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["safeWithdrawalRate"] ?? 0;
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


export interface Safe_withdrawal_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
