// Auto-generated from gross-margin-calculator-schema.json
import * as z from 'zod';

export interface Gross_margin_calculatorInput {
  sellingPricePerUnit: number;
  costPerUnit: number;
  unitsSold: number;
  additionalVariableCostPerUnit: number;
  discountPercentage: number;
  dataConfidence?: number;
}

export const Gross_margin_calculatorInputSchema = z.object({
  sellingPricePerUnit: z.number().default(100),
  costPerUnit: z.number().default(70),
  unitsSold: z.number().default(1000),
  additionalVariableCostPerUnit: z.number().default(5),
  discountPercentage: z.number().default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Gross_margin_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.sellingPricePerUnit * (1 - input.discountPercentage / 100)) - (input.costPerUnit + input.additionalVariableCostPerUnit)) * input.unitsSold; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.sellingPricePerUnit * input.unitsSold * (1 - input.discountPercentage / 100); results["totalRevenue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalRevenue"] = Number.NaN; }
  try { const v = (input.costPerUnit + input.additionalVariableCostPerUnit) * input.unitsSold; results["totalCOGS"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCOGS"] = Number.NaN; }
  return results;
}


export function calculateGross_margin_calculator(input: Gross_margin_calculatorInput): Gross_margin_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Discount erosion on high-volume items","Uncaptured variable cost increases"];
  const suggestedActions: string[] = ["Review discount tiers to minimize margin leakage","Negotiate bulk purchase discounts for high-cost materials"];
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


export interface Gross_margin_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
