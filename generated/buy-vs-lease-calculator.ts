// Auto-generated from buy-vs-lease-calculator-schema.json
import * as z from 'zod';

export interface Buy_vs_lease_calculatorInput {
  purchasePrice: number;
  leasePayment: number;
  leaseTerm: number;
  residualValue: number;
  discountRate: number;
  dataConfidence?: number;
}

export const Buy_vs_lease_calculatorInputSchema = z.object({
  purchasePrice: z.number().default(50000),
  leasePayment: z.number().default(1000),
  leaseTerm: z.number().default(36),
  residualValue: z.number().default(20000),
  discountRate: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Buy_vs_lease_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.discountRate / 100 / 12; results["monthlyRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyRate"] = Number.NaN; }
  try { const v = input.purchasePrice - input.residualValue / (1 + (toNumericFormulaValue(results["monthlyRate"]))) ^ input.leaseTerm; results["npvBuying"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["npvBuying"] = Number.NaN; }
  try { const v = input.leasePayment * (1 - (1 + (toNumericFormulaValue(results["monthlyRate"]))) ^ -input.leaseTerm) / (toNumericFormulaValue(results["monthlyRate"])); results["npvLeasing"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["npvLeasing"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["npvBuying"])) - (toNumericFormulaValue(results["npvLeasing"])); results["netAdvantage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netAdvantage"] = Number.NaN; }
  return results;
}


export function calculateBuy_vs_lease_calculator(input: Buy_vs_lease_calculatorInput): Buy_vs_lease_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netAdvantage"]);
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


export interface Buy_vs_lease_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
