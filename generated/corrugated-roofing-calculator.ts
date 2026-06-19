// Auto-generated from corrugated-roofing-calculator-schema.json
import * as z from 'zod';

export interface Corrugated_roofing_calculatorInput {
  roofWidth: number;
  roofLength: number;
  sheetWidth: number;
  sheetLength: number;
  overlapLength: number;
  pricePerSheet: number;
  dataConfidence?: number;
}

export const Corrugated_roofing_calculatorInputSchema = z.object({
  roofWidth: z.number().default(10),
  roofLength: z.number().default(5),
  sheetWidth: z.number().default(0.76),
  sheetLength: z.number().default(2.5),
  overlapLength: z.number().default(0.15),
  pricePerSheet: z.number().default(25),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Corrugated_roofing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.roofWidth) * (input.roofLength) * (input.sheetWidth) * (input.sheetLength) * (input.overlapLength) * (input.pricePerSheet); results["roofArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["roofArea"] = 0; }
  try { const v = (input.roofWidth) * (input.roofLength) * (input.sheetWidth); results["roofArea_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["roofArea_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCorrugated_roofing_calculator(input: Corrugated_roofing_calculatorInput): Corrugated_roofing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["roofArea_aux"]));
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


export interface Corrugated_roofing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
