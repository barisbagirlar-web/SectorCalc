// Auto-generated from corrugated-roofing-calculator-schema.json
import * as z from 'zod';

export interface Corrugated_roofing_calculatorInput {
  roofWidth: number;
  roofLength: number;
  sheetWidth: number;
  sheetLength: number;
  overlapLength: number;
  pricePerSheet: number;
}

export const Corrugated_roofing_calculatorInputSchema = z.object({
  roofWidth: z.number().default(10),
  roofLength: z.number().default(5),
  sheetWidth: z.number().default(0.76),
  sheetLength: z.number().default(2.5),
  overlapLength: z.number().default(0.15),
  pricePerSheet: z.number().default(25),
});

function evaluateAllFormulas(input: Corrugated_roofing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.ceil(input.roofWidth / input.sheetWidth); results["rows"] = Number.isFinite(v) ? v : 0; } catch { results["rows"] = 0; }
  try { const v = input.roofLength <= input.sheetLength ? 1 : Math.ceil((input.roofLength - input.sheetLength) / (input.sheetLength - input.overlapLength)) + 1; results["perRow"] = Number.isFinite(v) ? v : 0; } catch { results["perRow"] = 0; }
  try { const v = (results["rows"] ?? 0) * (results["perRow"] ?? 0); results["totalSheets"] = Number.isFinite(v) ? v : 0; } catch { results["totalSheets"] = 0; }
  try { const v = (results["totalSheets"] ?? 0) * input.pricePerSheet; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = input.roofWidth * input.roofLength; results["roofArea"] = Number.isFinite(v) ? v : 0; } catch { results["roofArea"] = 0; }
  return results;
}


export function calculateCorrugated_roofing_calculator(input: Corrugated_roofing_calculatorInput): Corrugated_roofing_calculatorOutput {
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


export interface Corrugated_roofing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
