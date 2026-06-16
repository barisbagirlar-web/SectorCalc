// Auto-generated from markdown-calculator-schema.json
import * as z from 'zod';

export interface Markdown_calculatorInput {
  originalPrice: number;
  markdownPercentage: number;
  fixedDiscount: number;
  quantity: number;
  vatRate: number;
}

export const Markdown_calculatorInputSchema = z.object({
  originalPrice: z.number().default(100),
  markdownPercentage: z.number().default(20),
  fixedDiscount: z.number().default(5),
  quantity: z.number().default(10),
  vatRate: z.number().default(20),
});

function evaluateAllFormulas(input: Markdown_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.originalPrice * (1 - input.markdownPercentage/100); results["unitPriceAfterPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["unitPriceAfterPercentage"] = 0; }
  try { const v = (results["unitPriceAfterPercentage"] ?? 0) - input.fixedDiscount; results["unitPriceAfterFixed"] = Number.isFinite(v) ? v : 0; } catch { results["unitPriceAfterFixed"] = 0; }
  try { const v = (results["unitPriceAfterFixed"] ?? 0) * input.quantity; results["totalExclVat"] = Number.isFinite(v) ? v : 0; } catch { results["totalExclVat"] = 0; }
  try { const v = (results["totalExclVat"] ?? 0) * input.vatRate/100; results["vatAmount"] = Number.isFinite(v) ? v : 0; } catch { results["vatAmount"] = 0; }
  try { const v = (results["totalExclVat"] ?? 0) + (results["vatAmount"] ?? 0); results["totalInclVat"] = Number.isFinite(v) ? v : 0; } catch { results["totalInclVat"] = 0; }
  try { const v = (input.originalPrice * input.quantity) - (results["totalExclVat"] ?? 0); results["totalSavings"] = Number.isFinite(v) ? v : 0; } catch { results["totalSavings"] = 0; }
  return results;
}


export function calculateMarkdown_calculator(input: Markdown_calculatorInput): Markdown_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalInclVat"] ?? 0;
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


export interface Markdown_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
