// Auto-generated from data-transfer-calculator-schema.json
import * as z from 'zod';

export interface Data_transfer_calculatorInput {
  dataSize: number;
  transferSpeed: number;
  overheadPercent: number;
  numberOfFiles: number;
  latencyPerFile: number;
}

export const Data_transfer_calculatorInputSchema = z.object({
  dataSize: z.number().default(10),
  transferSpeed: z.number().default(100),
  overheadPercent: z.number().default(5),
  numberOfFiles: z.number().default(1),
  latencyPerFile: z.number().default(0),
});

function evaluateAllFormulas(input: Data_transfer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.max(0.000001, input.transferSpeed * (1 - input.overheadPercent / 100)); results["effectiveSpeedMbps"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveSpeedMbps"] = 0; }
  try { const v = (input.dataSize * 8000) / (results["effectiveSpeedMbps"] ?? 0); results["dataTransferSeconds"] = Number.isFinite(v) ? v : 0; } catch { results["dataTransferSeconds"] = 0; }
  try { const v = (results["dataTransferSeconds"] ?? 0) + (input.latencyPerFile * input.numberOfFiles / 1000); results["totalTimeSeconds"] = Number.isFinite(v) ? v : 0; } catch { results["totalTimeSeconds"] = 0; }
  try { const v = (results["totalTimeSeconds"] ?? 0) / 60; results["totalTimeMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["totalTimeMinutes"] = 0; }
  try { const v = (results["totalTimeSeconds"] ?? 0) / 3600; results["totalTimeHours"] = Number.isFinite(v) ? v : 0; } catch { results["totalTimeHours"] = 0; }
  return results;
}


export function calculateData_transfer_calculator(input: Data_transfer_calculatorInput): Data_transfer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalTimeMinutes"] ?? 0;
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


export interface Data_transfer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
