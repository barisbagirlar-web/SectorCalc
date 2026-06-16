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

function evaluateAllFormulas(input: Sheetrock_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2 * (input.roomLength + input.roomWidth) * input.roomHeight - input.deductionArea; results["wallArea"] = Number.isFinite(v) ? v : 0; } catch { results["wallArea"] = 0; }
  try { const v = input.roomLength * input.roomWidth; results["ceilingArea"] = Number.isFinite(v) ? v : 0; } catch { results["ceilingArea"] = 0; }
  try { const v = (results["wallArea"] ?? 0) + (results["ceilingArea"] ?? 0); results["totalArea"] = Number.isFinite(v) ? v : 0; } catch { results["totalArea"] = 0; }
  try { const v = Math.ceil((results["wallArea"] ?? 0) / (input.sheetLength * input.sheetWidth) * (1 + input.wasteFactor / 100)); results["sheetsWalls"] = Number.isFinite(v) ? v : 0; } catch { results["sheetsWalls"] = 0; }
  try { const v = Math.ceil((results["ceilingArea"] ?? 0) / (input.sheetLength * input.sheetWidth) * (1 + input.wasteFactor / 100)); results["sheetsCeiling"] = Number.isFinite(v) ? v : 0; } catch { results["sheetsCeiling"] = 0; }
  try { const v = (results["sheetsWalls"] ?? 0) + (results["sheetsCeiling"] ?? 0); results["totalSheets"] = Number.isFinite(v) ? v : 0; } catch { results["totalSheets"] = 0; }
  try { const v = (results["totalArea"] ?? 0) / 150; results["jointCompoundGallons"] = Number.isFinite(v) ? v : 0; } catch { results["jointCompoundGallons"] = 0; }
  try { const v = (results["totalArea"] ?? 0) * 0.37; results["jointTapeFeet"] = Number.isFinite(v) ? v : 0; } catch { results["jointTapeFeet"] = 0; }
  try { const v = (results["totalSheets"] ?? 0) * 32; results["screwsCount"] = Number.isFinite(v) ? v : 0; } catch { results["screwsCount"] = 0; }
  return results;
}


export function calculateSheetrock_calculator(input: Sheetrock_calculatorInput): Sheetrock_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalSheets"] ?? 0;
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


export interface Sheetrock_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
