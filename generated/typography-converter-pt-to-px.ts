// Auto-generated from typography-converter-pt-to-px-schema.json
import * as z from 'zod';

export interface Typography_converter_pt_to_pxInput {
  pointSize: number;
  ppi: number;
  baseFontSize: number;
  scaleFactor: number;
  dataConfidence?: number;
}

export const Typography_converter_pt_to_pxInputSchema = z.object({
  pointSize: z.number().default(12),
  ppi: z.number().default(96),
  baseFontSize: z.number().default(16),
  scaleFactor: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Typography_converter_pt_to_pxInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pointSize * input.ppi / 72; results["pxFromPt"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pxFromPt"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["pxFromPt"])) * input.scaleFactor; results["scaledPx"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scaledPx"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["scaledPx"])) / input.baseFontSize; results["remValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["remValue"] = Number.NaN; }
  try { const v = input.pointSize * input.ppi / 72; results["pxFromPt___pointSize___ppi___72"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pxFromPt___pointSize___ppi___72"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["pxFromPt"])) * input.scaleFactor; results["scaledPx___pxFromPt___scaleFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scaledPx___pxFromPt___scaleFactor"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["scaledPx"])) / input.baseFontSize; results["remValue___scaledPx___baseFontSize"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["remValue___scaledPx___baseFontSize"] = Number.NaN; }
  return results;
}


export function calculateTypography_converter_pt_to_px(input: Typography_converter_pt_to_pxInput): Typography_converter_pt_to_pxOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["scaledPx"]);
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


export interface Typography_converter_pt_to_pxOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
