// Auto-generated from typography-converter-pt-to-px-schema.json
import * as z from 'zod';

export interface Typography_converter_pt_to_pxInput {
  pointSize: number;
  ppi: number;
  baseFontSize: number;
  scaleFactor: number;
}

export const Typography_converter_pt_to_pxInputSchema = z.object({
  pointSize: z.number().default(12),
  ppi: z.number().default(96),
  baseFontSize: z.number().default(16),
  scaleFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Typography_converter_pt_to_pxInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pointSize * input.ppi / 72; results["pxFromPt"] = Number.isFinite(v) ? v : 0; } catch { results["pxFromPt"] = 0; }
  try { const v = (results["pxFromPt"] ?? 0) * input.scaleFactor; results["scaledPx"] = Number.isFinite(v) ? v : 0; } catch { results["scaledPx"] = 0; }
  try { const v = (results["scaledPx"] ?? 0) / input.baseFontSize; results["remValue"] = Number.isFinite(v) ? v : 0; } catch { results["remValue"] = 0; }
  return results;
}


export function calculateTypography_converter_pt_to_px(input: Typography_converter_pt_to_pxInput): Typography_converter_pt_to_pxOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["scaledPx"] ?? 0;
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


export interface Typography_converter_pt_to_pxOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
