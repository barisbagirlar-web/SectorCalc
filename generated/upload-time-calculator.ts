// Auto-generated from upload-time-calculator-schema.json
import * as z from 'zod';

export interface Upload_time_calculatorInput {
  fileSize: number;
  uploadSpeed: number;
  overheadFactor: number;
  numConnections: number;
  dataConfidence?: number;
}

export const Upload_time_calculatorInputSchema = z.object({
  fileSize: z.number().default(100),
  uploadSpeed: z.number().default(10),
  overheadFactor: z.number().default(1.1),
  numConnections: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Upload_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.fileSize * 8) / input.uploadSpeed; results["rawTimeSeconds"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rawTimeSeconds"] = 0; }
  try { const v = (input.fileSize * 8 * input.overheadFactor) / (input.uploadSpeed * input.numConnections); results["uploadTimeSeconds"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["uploadTimeSeconds"] = 0; }
  try { const v = (input.fileSize * 8 * (input.overheadFactor - 1)) / (input.uploadSpeed * input.numConnections); results["overheadTimeSeconds"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["overheadTimeSeconds"] = 0; }
  try { const v = (input.uploadSpeed * input.numConnections) / input.overheadFactor; results["effectiveSpeedMbps"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveSpeedMbps"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateUpload_time_calculator(input: Upload_time_calculatorInput): Upload_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["uploadTimeSeconds"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
