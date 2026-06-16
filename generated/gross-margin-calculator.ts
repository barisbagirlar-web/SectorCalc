// Auto-generated from gross-margin-calculator-schema.json
import * as z from 'zod';

export interface Gross_margin_calculatorInput {
  sellingPricePerUnit: number;
  costPerUnit: number;
  unitsSold: number;
  additionalVariableCostPerUnit: number;
  discountPercentage: number;
}

export const Gross_margin_calculatorInputSchema = z.object({
  sellingPricePerUnit: z.number().default(100),
  costPerUnit: z.number().default(70),
  unitsSold: z.number().default(1000),
  additionalVariableCostPerUnit: z.number().default(5),
  discountPercentage: z.number().default(10),
});

function evaluateAllFormulas(input: Gross_margin_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sellingPricePerUnit * input.unitsSold * (1 - input.discountPercentage / 100); results["totalRevenue"] = Number.isFinite(v) ? v : 0; } catch { results["totalRevenue"] = 0; }
  try { const v = (input.costPerUnit + input.additionalVariableCostPerUnit) * input.unitsSold; results["totalCOGS"] = Number.isFinite(v) ? v : 0; } catch { results["totalCOGS"] = 0; }
  try { const v = (results["totalRevenue"] ?? 0) - (results["totalCOGS"] ?? 0); results["grossMarginAmount"] = Number.isFinite(v) ? v : 0; } catch { results["grossMarginAmount"] = 0; }
  try { const v = ((results["grossMarginAmount"] ?? 0) / (results["totalRevenue"] ?? 0)) * 100; results["grossMarginPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["grossMarginPercentage"] = 0; }
  return results;
}


export function calculateGross_margin_calculator(input: Gross_margin_calculatorInput): Gross_margin_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["grossMarginPercentage"] ?? 0;
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


export interface Gross_margin_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
