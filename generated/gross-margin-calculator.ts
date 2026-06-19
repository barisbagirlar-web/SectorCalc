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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Gross_margin_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sellingPricePerUnit * input.unitsSold * (1 - input.discountPercentage / 100); results["totalRevenue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalRevenue"] = 0; }
  try { const v = (input.costPerUnit + input.additionalVariableCostPerUnit) * input.unitsSold; results["totalCOGS"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCOGS"] = 0; }
  try { const v = (asFormulaNumber(results["totalRevenue"])) - (asFormulaNumber(results["totalCOGS"])); results["grossMarginAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["grossMarginAmount"] = 0; }
  try { const v = ((asFormulaNumber(results["grossMarginAmount"])) / (asFormulaNumber(results["totalRevenue"]))) * 100; results["grossMarginPercentage"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["grossMarginPercentage"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGross_margin_calculator(input: Gross_margin_calculatorInput): Gross_margin_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["grossMarginPercentage"]);
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


export interface Gross_margin_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
