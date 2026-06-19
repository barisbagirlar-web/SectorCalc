// Auto-generated from quick-ratio-calculator-schema.json
import * as z from 'zod';

export interface Quick_ratio_calculatorInput {
  cashEquivalents: number;
  marketableSecurities: number;
  accountsReceivable: number;
  currentLiabilities: number;
  dataConfidence?: number;
}

export const Quick_ratio_calculatorInputSchema = z.object({
  cashEquivalents: z.number().default(0),
  marketableSecurities: z.number().default(0),
  accountsReceivable: z.number().default(0),
  currentLiabilities: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Quick_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cashEquivalents * input.marketableSecurities * input.accountsReceivable * input.currentLiabilities; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.cashEquivalents * input.marketableSecurities * input.accountsReceivable * input.currentLiabilities; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateQuick_ratio_calculator(input: Quick_ratio_calculatorInput): Quick_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Quick_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
