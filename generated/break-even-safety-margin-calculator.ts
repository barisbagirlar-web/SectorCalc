// Auto-generated from break-even-safety-margin-calculator-schema.json
import * as z from 'zod';

export interface Break_even_safety_margin_calculatorInput {
  fixedCosts: number;
  variableCostPerUnit: number;
  sellingPricePerUnit: number;
  actualSalesVolume: number;
  capacityVolume: number;
  demandUncertainty: number;
  costEscalationRate: number;
  includeTax: boolean;
  taxRate: number;
}

export const Break_even_safety_margin_calculatorInputSchema = z.object({
  fixedCosts: z.number().min(0).max(100000000).default(500000),
  variableCostPerUnit: z.number().min(0).max(10000).default(15),
  sellingPricePerUnit: z.number().min(0).max(100000).default(25),
  actualSalesVolume: z.number().min(0).max(10000000).default(80000),
  capacityVolume: z.number().min(0).max(20000000).default(120000),
  demandUncertainty: z.number().min(0).max(100).default(10),
  costEscalationRate: z.number().min(0).max(50).default(3),
  includeTax: z.boolean().default(false),
  taxRate: z.number().min(0).max(60).default(25),
});

function evaluateAllFormulas(input: Break_even_safety_margin_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sellingPricePerUnit - input.variableCostPerUnit; results["contributionMarginPerUnit"] = Number.isFinite(v) ? v : 0; } catch { results["contributionMarginPerUnit"] = 0; }
  try { const v = (results["contributionMarginPerUnit"] ?? 0) / input.sellingPricePerUnit; results["contributionMarginRatio"] = Number.isFinite(v) ? v : 0; } catch { results["contributionMarginRatio"] = 0; }
  try { const v = input.fixedCosts / (results["contributionMarginPerUnit"] ?? 0); results["breakEvenUnits"] = Number.isFinite(v) ? v : 0; } catch { results["breakEvenUnits"] = 0; }
  try { const v = (results["breakEvenUnits"] ?? 0) * input.sellingPricePerUnit; results["breakEvenRevenue"] = Number.isFinite(v) ? v : 0; } catch { results["breakEvenRevenue"] = 0; }
  try { const v = input.actualSalesVolume - (results["breakEvenUnits"] ?? 0); results["safetyMarginUnits"] = Number.isFinite(v) ? v : 0; } catch { results["safetyMarginUnits"] = 0; }
  try { const v = ((results["safetyMarginUnits"] ?? 0) / input.actualSalesVolume) * 100; results["safetyMarginPercent"] = Number.isFinite(v) ? v : 0; } catch { results["safetyMarginPercent"] = 0; }
  try { const v = input.fixedCosts / (input.sellingPricePerUnit - input.variableCostPerUnit * (1 + input.costEscalationRate/100)) * (1 + input.demandUncertainty/100); results["adjustedBreakEvenUnits"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedBreakEvenUnits"] = 0; }
  return results;
}


export function calculateBreak_even_safety_margin_calculator(input: Break_even_safety_margin_calculatorInput): Break_even_safety_margin_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["safetyMarginPercent"] ?? 0;
  const breakdown = {
    contributionMarginPerUnit: values["contributionMarginPerUnit"] ?? 0,
    contributionMarginRatio: values["contributionMarginRatio"] ?? 0,
    breakEvenUnits: values["breakEvenUnits"] ?? 0,
    breakEvenRevenue: values["breakEvenRevenue"] ?? 0,
    safetyMarginUnits: values["safetyMarginUnits"] ?? 0,
    adjustedBreakEvenUnits: values["adjustedBreakEvenUnits"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excess Fixed Cost Burden","Variable Cost Volatility","Capacity Underutilization"];
  const suggestedActions: string[] = ["Reduce Fixed Costs","Increase Selling Price","Improve Variable Cost Efficiency","Boost Sales Volume","Hedge Cost Escalation"];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Automated alerting"],
  };
}


export interface Break_even_safety_margin_calculatorOutput {
  totalWasteCost: number;
  breakdown: { contributionMarginPerUnit: number; contributionMarginRatio: number; breakEvenUnits: number; breakEvenRevenue: number; safetyMarginUnits: number; adjustedBreakEvenUnits: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
