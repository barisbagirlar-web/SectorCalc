// Auto-generated from data-transfer-calculator-schema.json
import * as z from 'zod';

export interface Data_transfer_calculatorInput {
  dataSize: number;
  transferSpeed: number;
  overheadPercent: number;
  numberOfFiles: number;
  latencyPerFile: number;
  dataConfidence?: number;
}

export const Data_transfer_calculatorInputSchema = z.object({
  dataSize: z.number().default(10),
  transferSpeed: z.number().default(100),
  overheadPercent: z.number().default(5),
  numberOfFiles: z.number().default(1),
  latencyPerFile: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Data_transfer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dataSize * input.transferSpeed * (input.overheadPercent / 100) * input.numberOfFiles; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.dataSize * input.transferSpeed * (input.overheadPercent / 100) * input.numberOfFiles * (input.latencyPerFile); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.latencyPerFile; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateData_transfer_calculator(input: Data_transfer_calculatorInput): Data_transfer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Data_transfer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
