// Auto-generated from storage-calculator-video-calculator-schema.json
import * as z from 'zod';

export interface Storage_calculator_video_calculatorInput {
  numCameras: number;
  bitrate: number;
  recordingHours: number;
  retentionDays: number;
  overheadPercent: number;
}

export const Storage_calculator_video_calculatorInputSchema = z.object({
  numCameras: z.number().default(4),
  bitrate: z.number().default(4),
  recordingHours: z.number().default(24),
  retentionDays: z.number().default(30),
  overheadPercent: z.number().default(10),
});

function evaluateAllFormulas(input: Storage_calculator_video_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bitrate * input.recordingHours * 3600 / (8 * 1024); results["dailyGBPerCamera"] = Number.isFinite(v) ? v : 0; } catch { results["dailyGBPerCamera"] = 0; }
  try { const v = (results["dailyGBPerCamera"] ?? 0) * input.numCameras; results["dailyGBTotal"] = Number.isFinite(v) ? v : 0; } catch { results["dailyGBTotal"] = 0; }
  try { const v = input.numCameras * input.bitrate * input.recordingHours * 3600 * input.retentionDays / (8 * 1024); results["totalGB"] = Number.isFinite(v) ? v : 0; } catch { results["totalGB"] = 0; }
  try { const v = (results["totalGB"] ?? 0) * (1 + input.overheadPercent / 100); results["totalWithOverhead"] = Number.isFinite(v) ? v : 0; } catch { results["totalWithOverhead"] = 0; }
  try { const v = (results["totalWithOverhead"] ?? 0) / 1024; results["totalTB"] = Number.isFinite(v) ? v : 0; } catch { results["totalTB"] = 0; }
  return results;
}


export function calculateStorage_calculator_video_calculator(input: Storage_calculator_video_calculatorInput): Storage_calculator_video_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalTB"] ?? 0;
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


export interface Storage_calculator_video_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
