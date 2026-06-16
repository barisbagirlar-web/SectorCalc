// Auto-generated from receivables-turnover-calculator-schema.json
import * as z from 'zod';

export interface Receivables_turnover_calculatorInput {
  netCreditSales: number;
  beginningAR: number;
  endingAR: number;
  daysInPeriod: number;
}

export const Receivables_turnover_calculatorInputSchema = z.object({
  netCreditSales: z.number().default(100000),
  beginningAR: z.number().default(20000),
  endingAR: z.number().default(25000),
  daysInPeriod: z.number().default(365),
});

function evaluateAllFormulas(input: Receivables_turnover_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.beginningAR + input.endingAR) / 2; results["averageAccountsReceivable"] = Number.isFinite(v) ? v : 0; } catch { results["averageAccountsReceivable"] = 0; }
  try { const v = input.netCreditSales / (results["averageAccountsReceivable"] ?? 0); results["receivablesTurnoverRatio"] = Number.isFinite(v) ? v : 0; } catch { results["receivablesTurnoverRatio"] = 0; }
  try { const v = input.daysInPeriod / (results["receivablesTurnoverRatio"] ?? 0); results["daysSalesOutstanding"] = Number.isFinite(v) ? v : 0; } catch { results["daysSalesOutstanding"] = 0; }
  return results;
}


export function calculateReceivables_turnover_calculator(input: Receivables_turnover_calculatorInput): Receivables_turnover_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["receivablesTurnoverRatio"] ?? 0;
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


export interface Receivables_turnover_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
