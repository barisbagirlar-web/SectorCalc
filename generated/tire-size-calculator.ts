// Auto-generated from tire-size-calculator-schema.json
import * as z from 'zod';

export interface Tire_size_calculatorInput {
  tireWidth: number;
  aspectRatio: number;
  rimDiameter: number;
  treadLoss: number;
  dataConfidence?: number;
}

export const Tire_size_calculatorInputSchema = z.object({
  tireWidth: z.number().default(225),
  aspectRatio: z.number().default(45),
  rimDiameter: z.number().default(17),
  treadLoss: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Tire_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.tireWidth * input.aspectRatio / 100) - input.treadLoss; results["sidewallHeightMm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sidewallHeightMm"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["sidewallHeightMm"])) / 25.4; results["sidewallHeightIn"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sidewallHeightIn"] = Number.NaN; }
  try { const v = input.rimDiameter + 2 * (toNumericFormulaValue(results["sidewallHeightIn"])); results["overallDiameterIn"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overallDiameterIn"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["overallDiameterIn"])) * 25.4; results["overallDiameterMm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overallDiameterMm"] = Number.NaN; }
  try { const v = Math.PI * (toNumericFormulaValue(results["overallDiameterIn"])); results["circumferenceIn"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["circumferenceIn"] = Number.NaN; }
  try { const v = Math.PI * (toNumericFormulaValue(results["overallDiameterMm"])); results["circumferenceMm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["circumferenceMm"] = Number.NaN; }
  return results;
}


export function calculateTire_size_calculator(input: Tire_size_calculatorInput): Tire_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["overallDiameterIn"]);
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


export interface Tire_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
