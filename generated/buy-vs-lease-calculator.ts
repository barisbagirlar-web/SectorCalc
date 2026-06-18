// @ts-nocheck
// Auto-generated from buy-vs-lease-calculator-schema.json
import * as z from 'zod';

export interface Buy_vs_lease_calculatorInput {
  purchasePrice: number;
  leasePayment: number;
  leaseTerm: number;
  residualValue: number;
  discountRate: number;
}

export const Buy_vs_lease_calculatorInputSchema = z.object({
  purchasePrice: z.number().default(50000),
  leasePayment: z.number().default(1000),
  leaseTerm: z.number().default(36),
  residualValue: z.number().default(20000),
  discountRate: z.number().default(5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Buy_vs_lease_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.discountRate / 100 / 12; results["monthlyRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyRate"] = 0; }
  try { const v = input.purchasePrice - input.residualValue / (1 + (asFormulaNumber(results["monthlyRate"]))) ^ input.leaseTerm; results["npvBuying"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["npvBuying"] = 0; }
  try { const v = input.leasePayment * (1 - (1 + (asFormulaNumber(results["monthlyRate"]))) ^ -input.leaseTerm) / (asFormulaNumber(results["monthlyRate"])); results["npvLeasing"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["npvLeasing"] = 0; }
  try { const v = (asFormulaNumber(results["npvBuying"])) - (asFormulaNumber(results["npvLeasing"])); results["netAdvantage"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netAdvantage"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBuy_vs_lease_calculator(input: Buy_vs_lease_calculatorInput): Buy_vs_lease_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netAdvantage"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
