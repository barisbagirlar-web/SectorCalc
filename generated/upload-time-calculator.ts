// Auto-generated from upload-time-calculator-schema.json
import * as z from 'zod';

export interface Upload_time_calculatorInput {
  fileSize: number;
  uploadSpeed: number;
  overheadFactor: number;
  numConnections: number;
}

export const Upload_time_calculatorInputSchema = z.object({
  fileSize: z.number().default(100),
  uploadSpeed: z.number().default(10),
  overheadFactor: z.number().default(1.1),
  numConnections: z.number().default(1),
});

function evaluateAllFormulas(input: Upload_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.fileSize * 8) / input.uploadSpeed; results["rawTimeSeconds"] = Number.isFinite(v) ? v : 0; } catch { results["rawTimeSeconds"] = 0; }
  try { const v = (input.fileSize * 8 * input.overheadFactor) / (input.uploadSpeed * input.numConnections); results["uploadTimeSeconds"] = Number.isFinite(v) ? v : 0; } catch { results["uploadTimeSeconds"] = 0; }
  try { const v = (input.fileSize * 8 * (input.overheadFactor - 1)) / (input.uploadSpeed * input.numConnections); results["overheadTimeSeconds"] = Number.isFinite(v) ? v : 0; } catch { results["overheadTimeSeconds"] = 0; }
  try { const v = (input.uploadSpeed * input.numConnections) / input.overheadFactor; results["effectiveSpeedMbps"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveSpeedMbps"] = 0; }
  try { const v = (function(){ let sec = (fileSize * 8 * overheadFactor) / (uploadSpeed * numConnections); let hrs = Math.floor(sec / 3600); let mins = Math.floor((sec % 3600) / 60); let secs = Math.round(sec % 60); return hrs > 0 ? hrs + 'h ' + mins + 'm ' + secs + 's' : mins > 0 ? mins + 'm ' + secs + 's' : secs + 's'; })(); results["formattedTime"] = Number.isFinite(v) ? v : 0; } catch { results["formattedTime"] = 0; }
  return results;
}


export function calculateUpload_time_calculator(input: Upload_time_calculatorInput): Upload_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["uploadTimeSeconds"] ?? 0;
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


export interface Upload_time_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
