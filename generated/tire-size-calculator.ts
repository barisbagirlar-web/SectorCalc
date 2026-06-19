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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Tire_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.tireWidth * input.aspectRatio / 100) - input.treadLoss; results["sidewallHeightMm"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sidewallHeightMm"] = 0; }
  try { const v = (asFormulaNumber(results["sidewallHeightMm"])) / 25.4; results["sidewallHeightIn"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sidewallHeightIn"] = 0; }
  try { const v = input.rimDiameter + 2 * (asFormulaNumber(results["sidewallHeightIn"])); results["overallDiameterIn"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["overallDiameterIn"] = 0; }
  try { const v = (asFormulaNumber(results["overallDiameterIn"])) * 25.4; results["overallDiameterMm"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["overallDiameterMm"] = 0; }
  try { const v = Math.PI * (asFormulaNumber(results["overallDiameterIn"])); results["circumferenceIn"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["circumferenceIn"] = 0; }
  try { const v = Math.PI * (asFormulaNumber(results["overallDiameterMm"])); results["circumferenceMm"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["circumferenceMm"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTire_size_calculator(input: Tire_size_calculatorInput): Tire_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["overallDiameterIn"]));
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


export interface Tire_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
