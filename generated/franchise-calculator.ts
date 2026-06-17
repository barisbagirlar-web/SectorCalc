// @ts-nocheck
// Auto-generated from franchise-calculator-schema.json
import * as z from 'zod';

export interface Franchise_calculatorInput {
  initialInvestment: number;
  monthlyRevenue: number;
  royaltyRate: number;
  marketingFeeRate: number;
  operationalCosts: number;
  otherFeesMonthly: number;
}

export const Franchise_calculatorInputSchema = z.object({
  initialInvestment: z.number().default(100000),
  monthlyRevenue: z.number().default(50000),
  royaltyRate: z.number().default(5),
  marketingFeeRate: z.number().default(2),
  operationalCosts: z.number().default(20000),
  otherFeesMonthly: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Franchise_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.monthlyRevenue * input.royaltyRate / 100; results["royaltyAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["royaltyAmount"] = 0; }
  try { const v = input.monthlyRevenue * input.marketingFeeRate / 100; results["marketingAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["marketingAmount"] = 0; }
  try { const v = input.otherFeesMonthly + (input.monthlyRevenue * input.royaltyRate / 100) + (input.monthlyRevenue * input.marketingFeeRate / 100); results["totalFeesMonthly"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalFeesMonthly"] = 0; }
  try { const v = input.monthlyRevenue - input.operationalCosts - (input.otherFeesMonthly + input.monthlyRevenue * input.royaltyRate / 100 + input.monthlyRevenue * input.marketingFeeRate / 100); results["monthlyNetProfit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyNetProfit"] = 0; }
  try { const v = input.initialInvestment / (input.monthlyRevenue - input.operationalCosts - (input.otherFeesMonthly + input.monthlyRevenue * input.royaltyRate / 100 + input.monthlyRevenue * input.marketingFeeRate / 100)); results["breakEvenMonths"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["breakEvenMonths"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateFranchise_calculator(input: Franchise_calculatorInput): Franchise_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["monthlyNetProfit"]);
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


export interface Franchise_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
