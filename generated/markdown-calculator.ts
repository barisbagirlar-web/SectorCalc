// Auto-generated from markdown-calculator-schema.json
import * as z from 'zod';

export interface Markdown_calculatorInput {
  originalPrice: number;
  markdownPercentage: number;
  fixedDiscount: number;
  quantity: number;
  vatRate: number;
  dataConfidence?: number;
}

export const Markdown_calculatorInputSchema = z.object({
  originalPrice: z.number().default(100),
  markdownPercentage: z.number().default(20),
  fixedDiscount: z.number().default(5),
  quantity: z.number().default(10),
  vatRate: z.number().default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Markdown_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.originalPrice * (1 - input.markdownPercentage/100); results["unitPriceAfterPercentage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["unitPriceAfterPercentage"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["unitPriceAfterPercentage"])) - input.fixedDiscount; results["unitPriceAfterFixed"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["unitPriceAfterFixed"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["unitPriceAfterFixed"])) * input.quantity; results["totalExclVat"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalExclVat"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalExclVat"])) * input.vatRate/100; results["vatAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vatAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalExclVat"])) + (toNumericFormulaValue(results["vatAmount"])); results["totalInclVat"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalInclVat"] = Number.NaN; }
  try { const v = (input.originalPrice * input.quantity) - (toNumericFormulaValue(results["totalExclVat"])); results["totalSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalSavings"] = Number.NaN; }
  return results;
}


export function calculateMarkdown_calculator(input: Markdown_calculatorInput): Markdown_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalInclVat"]);
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


export interface Markdown_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
