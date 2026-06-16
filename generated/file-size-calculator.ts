// Auto-generated from file-size-calculator-schema.json
import * as z from 'zod';

export interface File_size_calculatorInput {
  numberOfFiles: number;
  sizePerFileMB: number;
  redundancyFactor: number;
  compressionRatio: number;
  overheadPerFileKB: number;
  transferSpeedMbps: number;
}

export const File_size_calculatorInputSchema = z.object({
  numberOfFiles: z.number().default(100),
  sizePerFileMB: z.number().default(10),
  redundancyFactor: z.number().default(1.2),
  compressionRatio: z.number().default(0.8),
  overheadPerFileKB: z.number().default(4),
  transferSpeedMbps: z.number().default(100),
});

function evaluateAllFormulas(input: File_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfFiles * input.sizePerFileMB; results["totalUncompressedMB"] = Number.isFinite(v) ? v : 0; } catch { results["totalUncompressedMB"] = 0; }
  try { const v = (input.overheadPerFileKB / 1024) * input.numberOfFiles; results["overheadTotalMB"] = Number.isFinite(v) ? v : 0; } catch { results["overheadTotalMB"] = 0; }
  try { const v = (results["totalUncompressedMB"] ?? 0) + (results["overheadTotalMB"] ?? 0); results["totalWithOverheadMB"] = Number.isFinite(v) ? v : 0; } catch { results["totalWithOverheadMB"] = 0; }
  try { const v = (results["totalWithOverheadMB"] ?? 0) * input.compressionRatio; results["totalCompressedMB"] = Number.isFinite(v) ? v : 0; } catch { results["totalCompressedMB"] = 0; }
  try { const v = (results["totalCompressedMB"] ?? 0) * input.redundancyFactor / 1024; results["storageRequiredGB"] = Number.isFinite(v) ? v : 0; } catch { results["storageRequiredGB"] = 0; }
  try { const v = ((results["storageRequiredGB"] ?? 0) * (1024**3) * 8) / (input.transferSpeedMbps * (10**6)); results["downloadTimeSeconds"] = Number.isFinite(v) ? v : 0; } catch { results["downloadTimeSeconds"] = 0; }
  try { const v = (results["downloadTimeSeconds"] ?? 0) / 60; results["downloadTimeMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["downloadTimeMinutes"] = 0; }
  return results;
}


export function calculateFile_size_calculator(input: File_size_calculatorInput): File_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["storageRequiredGB"] ?? 0;
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


export interface File_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
