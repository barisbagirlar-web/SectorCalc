// Auto-generated from margin-calculator-schema.json
import * as z from 'zod';

export interface Margin_calculatorInput {
  cost: number;
  sellingPrice: number;
  quantity: number;
  discount: number;
  dataConfidence?: number;
}

export const Margin_calculatorInputSchema = z.object({
  cost: z.number().default(0),
  sellingPrice: z.number().default(0),
  quantity: z.number().default(1),
  discount: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Margin_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sellingPrice * (1 - input.discount / 100); results["netPrice"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netPrice"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["netPrice"])) - input.cost) * input.quantity; results["profitAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["profitAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["netPrice"])) * input.quantity; results["totalRevenue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalRevenue"] = Number.NaN; }
  try { const v = input.cost * input.quantity; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = (((toNumericFormulaValue(results["netPrice"])) - input.cost) / (toNumericFormulaValue(results["netPrice"]))) * 100; results["profitMargin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["profitMargin"] = Number.NaN; }
  return results;
}


export function calculateMargin_calculator(input: Margin_calculatorInput): Margin_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["profitMargin"]);
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


export interface Margin_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
