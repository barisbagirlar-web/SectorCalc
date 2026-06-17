// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Markdown_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.originalPrice * (1 - input.markdownPercentage/100); results["unitPriceAfterPercentage"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["unitPriceAfterPercentage"] = 0; }
  try { const v = (asFormulaNumber(results["unitPriceAfterPercentage"])) - input.fixedDiscount; results["unitPriceAfterFixed"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["unitPriceAfterFixed"] = 0; }
  try { const v = (asFormulaNumber(results["unitPriceAfterFixed"])) * input.quantity; results["totalExclVat"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalExclVat"] = 0; }
  try { const v = (asFormulaNumber(results["totalExclVat"])) * input.vatRate/100; results["vatAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["vatAmount"] = 0; }
  try { const v = (asFormulaNumber(results["totalExclVat"])) + (asFormulaNumber(results["vatAmount"])); results["totalInclVat"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalInclVat"] = 0; }
  try { const v = (input.originalPrice * input.quantity) - (asFormulaNumber(results["totalExclVat"])); results["totalSavings"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalSavings"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMarkdown_calculator(input: Markdown_calculatorInput): Markdown_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalInclVat"]);
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


export interface Markdown_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
