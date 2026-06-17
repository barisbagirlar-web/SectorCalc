// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Storage_calculator_video_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.bitrate * input.recordingHours * 3600 / (8 * 1024); results["dailyGBPerCamera"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["dailyGBPerCamera"] = 0; }
  try { const v = (asFormulaNumber(results["dailyGBPerCamera"])) * input.numCameras; results["dailyGBTotal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["dailyGBTotal"] = 0; }
  try { const v = input.numCameras * input.bitrate * input.recordingHours * 3600 * input.retentionDays / (8 * 1024); results["totalGB"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalGB"] = 0; }
  try { const v = (asFormulaNumber(results["totalGB"])) * (1 + input.overheadPercent / 100); results["totalWithOverhead"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalWithOverhead"] = 0; }
  try { const v = (asFormulaNumber(results["totalWithOverhead"])) / 1024; results["totalTB"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalTB"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateStorage_calculator_video_calculator(input: Storage_calculator_video_calculatorInput): Storage_calculator_video_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalTB"]);
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


export interface Storage_calculator_video_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
