// Auto-generated from roof-area-calculator-schema.json
import * as z from 'zod';

export interface Roof_area_calculatorInput {
  buildingWidth: number;
  buildingLength: number;
  roofPitch: number;
  overhang: number;
  dataConfidence?: number;
}

export const Roof_area_calculatorInputSchema = z.object({
  buildingWidth: z.number().default(10),
  buildingLength: z.number().default(12),
  roofPitch: z.number().default(30),
  overhang: z.number().default(0.5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Roof_area_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.buildingWidth + 2 * input.overhang; results["effectiveWidth"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveWidth"] = 0; }
  try { const v = input.buildingLength + 2 * input.overhang; results["effectiveLength"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveLength"] = 0; }
  try { const v = input.roofPitch * Math.PI / 180; results["angleRad"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["angleRad"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveWidth"])) * (asFormulaNumber(results["effectiveLength"])); results["footprintArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["footprintArea"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRoof_area_calculator(input: Roof_area_calculatorInput): Roof_area_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["footprintArea"]));
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


export interface Roof_area_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
