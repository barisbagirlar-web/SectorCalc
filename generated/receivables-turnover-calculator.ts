// Auto-generated from receivables-turnover-calculator-schema.json
import * as z from 'zod';

export interface Receivables_turnover_calculatorInput {
  netCreditSales: number;
  beginningAR: number;
  endingAR: number;
  daysInPeriod: number;
  dataConfidence?: number;
}

export const Receivables_turnover_calculatorInputSchema = z.object({
  netCreditSales: z.number().default(100000),
  beginningAR: z.number().default(20000),
  endingAR: z.number().default(25000),
  daysInPeriod: z.number().default(365),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Receivables_turnover_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.beginningAR + input.endingAR) / 2; results["averageAccountsReceivable"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["averageAccountsReceivable"] = 0; }
  try { const v = input.netCreditSales / (asFormulaNumber(results["averageAccountsReceivable"])); results["receivablesTurnoverRatio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["receivablesTurnoverRatio"] = 0; }
  try { const v = input.daysInPeriod / (asFormulaNumber(results["receivablesTurnoverRatio"])); results["daysSalesOutstanding"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["daysSalesOutstanding"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateReceivables_turnover_calculator(input: Receivables_turnover_calculatorInput): Receivables_turnover_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["receivablesTurnoverRatio"]));
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


export interface Receivables_turnover_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
