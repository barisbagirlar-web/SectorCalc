// @ts-nocheck
// Auto-generated from font-size-converter-calculator-schema.json
import * as z from 'zod';

export interface Font_size_converter_calculatorInput {
  fontSizePt: number;
  ppi: number;
  baseFontSizePx: number;
  rootFontSizePx: number;
  customScale: number;
}

export const Font_size_converter_calculatorInputSchema = z.object({
  fontSizePt: z.number().default(12),
  ppi: z.number().default(96),
  baseFontSizePx: z.number().default(16),
  rootFontSizePx: z.number().default(16),
  customScale: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Font_size_converter_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.fontSizePt * input.ppi / 72; results["px"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["px"] = 0; }
  try { const v = (asFormulaNumber(results["px"])) / input.baseFontSizePx; results["em"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["em"] = 0; }
  try { const v = (asFormulaNumber(results["px"])) / input.rootFontSizePx; results["rem"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rem"] = 0; }
  try { const v = ((asFormulaNumber(results["px"])) / input.baseFontSizePx) * 100; results["percentage"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["percentage"] = 0; }
  try { const v = input.fontSizePt * 0.3528; results["mm"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["mm"] = 0; }
  try { const v = input.fontSizePt / 72; results["inches"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["inches"] = 0; }
  try { const v = (asFormulaNumber(results["px"])) * input.customScale; results["customPx"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["customPx"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateFont_size_converter_calculator(input: Font_size_converter_calculatorInput): Font_size_converter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["px"]);
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


export interface Font_size_converter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
