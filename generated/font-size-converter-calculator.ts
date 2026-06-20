// Auto-generated from font-size-converter-calculator-schema.json
import * as z from 'zod';

export interface Font_size_converter_calculatorInput {
  fontSizePt: number;
  ppi: number;
  baseFontSizePx: number;
  rootFontSizePx: number;
  customScale: number;
  dataConfidence?: number;
}

export const Font_size_converter_calculatorInputSchema = z.object({
  fontSizePt: z.number().default(12),
  ppi: z.number().default(96),
  baseFontSizePx: z.number().default(16),
  rootFontSizePx: z.number().default(16),
  customScale: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Font_size_converter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fontSizePt * input.ppi / 72; results["px"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["px"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["px"])) / input.baseFontSizePx; results["em"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["em"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["px"])) / input.rootFontSizePx; results["rem"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rem"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["px"])) / input.baseFontSizePx) * 100; results["percentage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["percentage"] = Number.NaN; }
  try { const v = input.fontSizePt * 0.3528; results["mm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["mm"] = Number.NaN; }
  try { const v = input.fontSizePt / 72; results["inches"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["inches"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["px"])) * input.customScale; results["customPx"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["customPx"] = Number.NaN; }
  return results;
}


export function calculateFont_size_converter_calculator(input: Font_size_converter_calculatorInput): Font_size_converter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["px"]);
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


export interface Font_size_converter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
