// Auto-generated from franchise-calculator-schema.json
import * as z from 'zod';

export interface Franchise_calculatorInput {
  initialInvestment: number;
  monthlyRevenue: number;
  royaltyRate: number;
  marketingFeeRate: number;
  operationalCosts: number;
  otherFeesMonthly: number;
  dataConfidence?: number;
}

export const Franchise_calculatorInputSchema = z.object({
  initialInvestment: z.number().default(100000),
  monthlyRevenue: z.number().default(50000),
  royaltyRate: z.number().default(5),
  marketingFeeRate: z.number().default(2),
  operationalCosts: z.number().default(20000),
  otherFeesMonthly: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Franchise_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.monthlyRevenue * input.royaltyRate / 100; results["royaltyAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["royaltyAmount"] = Number.NaN; }
  try { const v = input.monthlyRevenue * input.marketingFeeRate / 100; results["marketingAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["marketingAmount"] = Number.NaN; }
  try { const v = input.otherFeesMonthly + (input.monthlyRevenue * input.royaltyRate / 100) + (input.monthlyRevenue * input.marketingFeeRate / 100); results["totalFeesMonthly"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalFeesMonthly"] = Number.NaN; }
  try { const v = input.monthlyRevenue - input.operationalCosts - (input.otherFeesMonthly + input.monthlyRevenue * input.royaltyRate / 100 + input.monthlyRevenue * input.marketingFeeRate / 100); results["monthlyNetProfit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyNetProfit"] = Number.NaN; }
  try { const v = input.initialInvestment / (input.monthlyRevenue - input.operationalCosts - (input.otherFeesMonthly + input.monthlyRevenue * input.royaltyRate / 100 + input.monthlyRevenue * input.marketingFeeRate / 100)); results["breakEvenMonths"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["breakEvenMonths"] = Number.NaN; }
  return results;
}


export function calculateFranchise_calculator(input: Franchise_calculatorInput): Franchise_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["monthlyNetProfit"]);
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


export interface Franchise_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
