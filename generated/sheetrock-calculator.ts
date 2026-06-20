// Auto-generated from sheetrock-calculator-schema.json
import * as z from 'zod';

export interface Sheetrock_calculatorInput {
  roomLength: number;
  roomWidth: number;
  roomHeight: number;
  sheetLength: number;
  sheetWidth: number;
  wasteFactor: number;
  deductionArea: number;
  dataConfidence?: number;
}

export const Sheetrock_calculatorInputSchema = z.object({
  roomLength: z.number().default(12),
  roomWidth: z.number().default(12),
  roomHeight: z.number().default(8),
  sheetLength: z.number().default(8),
  sheetWidth: z.number().default(4),
  wasteFactor: z.number().default(10),
  deductionArea: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sheetrock_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.roomLength * input.roomWidth * input.roomHeight * input.sheetLength; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.roomLength * input.roomWidth * input.roomHeight * input.sheetLength * (input.sheetWidth * (input.wasteFactor / 100) * input.deductionArea); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.sheetWidth * (input.wasteFactor / 100) * input.deductionArea; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateSheetrock_calculator(input: Sheetrock_calculatorInput): Sheetrock_calculatorOutput {
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


export interface Sheetrock_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
