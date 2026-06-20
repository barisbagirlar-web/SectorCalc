// Auto-generated from plaster-calculator-schema.json
import * as z from 'zod';

export interface Plaster_calculatorInput {
  wallLength: number;
  wallHeight: number;
  plasterThickness: number;
  mixRatioCement: number;
  mixRatioSand: number;
  cementBagWeight: number;
  wastageFactor: number;
  dataConfidence?: number;
}

export const Plaster_calculatorInputSchema = z.object({
  wallLength: z.number().default(5),
  wallHeight: z.number().default(2.5),
  plasterThickness: z.number().default(2),
  mixRatioCement: z.number().default(1),
  mixRatioSand: z.number().default(4),
  cementBagWeight: z.number().default(50),
  wastageFactor: z.number().default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Plaster_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wallLength * input.wallHeight; results["wallArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wallArea"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["wallArea"])) * (input.plasterThickness / 100); results["wetVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wetVolume"] = Number.NaN; }
  try { const v = input.mixRatioCement + input.mixRatioSand; results["totalMixParts"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMixParts"] = Number.NaN; }
  return results;
}


export function calculatePlaster_calculator(input: Plaster_calculatorInput): Plaster_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalMixParts"]);
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


export interface Plaster_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
