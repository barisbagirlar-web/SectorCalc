// Auto-generated from image-size-calculator-schema.json
import * as z from 'zod';

export interface Image_size_calculatorInput {
  widthPx: number;
  heightPx: number;
  bitDepth: number;
  channels: number;
  dpi: number;
}

export const Image_size_calculatorInputSchema = z.object({
  widthPx: z.number().default(1920),
  heightPx: z.number().default(1080),
  bitDepth: z.number().default(8),
  channels: z.number().default(3),
  dpi: z.number().default(72),
});

function evaluateAllFormulas(input: Image_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.widthPx * input.heightPx * (input.bitDepth * input.channels) / 8; results["fileSizeBytes"] = Number.isFinite(v) ? v : 0; } catch { results["fileSizeBytes"] = 0; }
  try { const v = (input.widthPx * input.heightPx * (input.bitDepth * input.channels) / 8) / 1024; results["fileSizeKB"] = Number.isFinite(v) ? v : 0; } catch { results["fileSizeKB"] = 0; }
  try { const v = ((input.widthPx * input.heightPx * (input.bitDepth * input.channels) / 8) / 1024) / 1024; results["fileSizeMB"] = Number.isFinite(v) ? v : 0; } catch { results["fileSizeMB"] = 0; }
  try { const v = input.widthPx / input.dpi; results["printWidthInches"] = Number.isFinite(v) ? v : 0; } catch { results["printWidthInches"] = 0; }
  try { const v = input.heightPx / input.dpi; results["printHeightInches"] = Number.isFinite(v) ? v : 0; } catch { results["printHeightInches"] = 0; }
  return results;
}


export function calculateImage_size_calculator(input: Image_size_calculatorInput): Image_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["fileSizeMB"] ?? 0;
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


export interface Image_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
