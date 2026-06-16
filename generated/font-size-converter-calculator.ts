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

function evaluateAllFormulas(input: Font_size_converter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fontSizePt * input.ppi / 72; results["px"] = Number.isFinite(v) ? v : 0; } catch { results["px"] = 0; }
  try { const v = (results["px"] ?? 0) / input.baseFontSizePx; results["em"] = Number.isFinite(v) ? v : 0; } catch { results["em"] = 0; }
  try { const v = (results["px"] ?? 0) / input.rootFontSizePx; results["rem"] = Number.isFinite(v) ? v : 0; } catch { results["rem"] = 0; }
  try { const v = ((results["px"] ?? 0) / input.baseFontSizePx) * 100; results["percentage"] = Number.isFinite(v) ? v : 0; } catch { results["percentage"] = 0; }
  try { const v = input.fontSizePt * 0.3528; results["mm"] = Number.isFinite(v) ? v : 0; } catch { results["mm"] = 0; }
  try { const v = input.fontSizePt / 72; results["inches"] = Number.isFinite(v) ? v : 0; } catch { results["inches"] = 0; }
  try { const v = (results["px"] ?? 0) * input.customScale; results["customPx"] = Number.isFinite(v) ? v : 0; } catch { results["customPx"] = 0; }
  return results;
}


export function calculateFont_size_converter_calculator(input: Font_size_converter_calculatorInput): Font_size_converter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["px"] ?? 0;
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


export interface Font_size_converter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
