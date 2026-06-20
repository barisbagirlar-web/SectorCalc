// Auto-generated from image-size-calculator-schema.json
import * as z from 'zod';

export interface Image_size_calculatorInput {
  widthPx: number;
  heightPx: number;
  bitDepth: number;
  channels: number;
  dpi: number;
  dataConfidence?: number;
}

export const Image_size_calculatorInputSchema = z.object({
  widthPx: z.number().default(1920),
  heightPx: z.number().default(1080),
  bitDepth: z.number().default(8),
  channels: z.number().default(3),
  dpi: z.number().default(72),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Image_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.widthPx * input.heightPx * (input.bitDepth * input.channels) / 8; results["fileSizeBytes"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fileSizeBytes"] = Number.NaN; }
  try { const v = (input.widthPx * input.heightPx * (input.bitDepth * input.channels) / 8) / 1024; results["fileSizeKB"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fileSizeKB"] = Number.NaN; }
  try { const v = ((input.widthPx * input.heightPx * (input.bitDepth * input.channels) / 8) / 1024) / 1024; results["fileSizeMB"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fileSizeMB"] = Number.NaN; }
  try { const v = input.widthPx / input.dpi; results["printWidthInches"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["printWidthInches"] = Number.NaN; }
  try { const v = input.heightPx / input.dpi; results["printHeightInches"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["printHeightInches"] = Number.NaN; }
  return results;
}


export function calculateImage_size_calculator(input: Image_size_calculatorInput): Image_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["fileSizeMB"]);
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


export interface Image_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
