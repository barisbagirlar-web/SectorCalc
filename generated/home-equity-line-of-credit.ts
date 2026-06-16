// Auto-generated from home-equity-line-of-credit-schema.json
import * as z from 'zod';

export interface Home_equity_line_of_creditInput {
  homeValue: number;
  mortgageBalance: number;
  lvrLimit: number;
  interestRate: number;
  drawAmount: number;
  loanTerm: number;
}

export const Home_equity_line_of_creditInputSchema = z.object({
  homeValue: z.number().default(300000),
  mortgageBalance: z.number().default(150000),
  lvrLimit: z.number().default(80),
  interestRate: z.number().default(5.5),
  drawAmount: z.number().default(50000),
  loanTerm: z.number().default(10),
});

function evaluateAllFormulas(input: Home_equity_line_of_creditInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.homeValue * (input.lvrLimit / 100)) - input.mortgageBalance; results["maxHeloc"] = Number.isFinite(v) ? v : 0; } catch { results["maxHeloc"] = 0; }
  try { const v = Math.min(input.drawAmount, (results["maxHeloc"] ?? 0)); results["usableHeloc"] = Number.isFinite(v) ? v : 0; } catch { results["usableHeloc"] = 0; }
  try { const v = ((results["usableHeloc"] ?? 0) * (input.interestRate / 100 / 12)) / (1 - Math.pow(1 + (input.interestRate / 100 / 12), -input.loanTerm * 12)); results["monthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyPayment"] = 0; }
  try { const v = ((results["monthlyPayment"] ?? 0) * input.loanTerm * 12) - (results["usableHeloc"] ?? 0); results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  return results;
}


export function calculateHome_equity_line_of_credit(input: Home_equity_line_of_creditInput): Home_equity_line_of_creditOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["usableHeloc"] ?? 0;
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


export interface Home_equity_line_of_creditOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
