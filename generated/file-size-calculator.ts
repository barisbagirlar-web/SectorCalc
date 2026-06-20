// Auto-generated from file-size-calculator-schema.json
import * as z from 'zod';

export interface File_size_calculatorInput {
  numberOfFiles: number;
  sizePerFileMB: number;
  redundancyFactor: number;
  compressionRatio: number;
  overheadPerFileKB: number;
  transferSpeedMbps: number;
  dataConfidence?: number;
}

export const File_size_calculatorInputSchema = z.object({
  numberOfFiles: z.number().default(100),
  sizePerFileMB: z.number().default(10),
  redundancyFactor: z.number().default(1.2),
  compressionRatio: z.number().default(0.8),
  overheadPerFileKB: z.number().default(4),
  transferSpeedMbps: z.number().default(100),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: File_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfFiles * input.sizePerFileMB; results["totalUncompressedMB"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalUncompressedMB"] = Number.NaN; }
  try { const v = (input.overheadPerFileKB / 1024) * input.numberOfFiles; results["overheadTotalMB"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overheadTotalMB"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalUncompressedMB"])) + (toNumericFormulaValue(results["overheadTotalMB"])); results["totalWithOverheadMB"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWithOverheadMB"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalWithOverheadMB"])) * input.compressionRatio; results["totalCompressedMB"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCompressedMB"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCompressedMB"])) * input.redundancyFactor / 1024; results["storageRequiredGB"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["storageRequiredGB"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["storageRequiredGB"])) * (1024**3) * 8) / (input.transferSpeedMbps * (10**6)); results["downloadTimeSeconds"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["downloadTimeSeconds"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["downloadTimeSeconds"])) / 60; results["downloadTimeMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["downloadTimeMinutes"] = Number.NaN; }
  return results;
}


export function calculateFile_size_calculator(input: File_size_calculatorInput): File_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["storageRequiredGB"]);
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


export interface File_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
