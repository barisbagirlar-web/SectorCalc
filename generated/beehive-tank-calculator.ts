// Auto-generated from beehive-tank-calculator-schema.json
import * as z from 'zod';

export interface Beehive_tank_calculatorInput {
  diameter: number;
  heightCylinder: number;
  wallThickness: number;
  materialDensity: number;
  materialCost: number;
  dataConfidence?: number;
}

export const Beehive_tank_calculatorInputSchema = z.object({
  diameter: z.number().default(2),
  heightCylinder: z.number().default(3),
  wallThickness: z.number().default(5),
  materialDensity: z.number().default(7850),
  materialCost: z.number().default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Beehive_tank_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.diameter / 2; results["radius"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["radius"] = Number.NaN; }
  try { const v = Math.PI * (input.diameter/2)**2 * input.heightCylinder; results["volumeCylinder"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volumeCylinder"] = Number.NaN; }
  try { const v = (2/3) * Math.PI * (input.diameter/2)**3; results["volumeHemisphere"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volumeHemisphere"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["volumeCylinder"])) + (toNumericFormulaValue(results["volumeHemisphere"])); results["totalVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalVolume"] = Number.NaN; }
  try { const v = 2 * Math.PI * (input.diameter/2) * input.heightCylinder; results["surfaceAreaCylinder"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["surfaceAreaCylinder"] = Number.NaN; }
  try { const v = 2 * Math.PI * (input.diameter/2)**2; results["surfaceAreaHemisphere"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["surfaceAreaHemisphere"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["surfaceAreaCylinder"])) + (toNumericFormulaValue(results["surfaceAreaHemisphere"])); results["totalSurfaceArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalSurfaceArea"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalSurfaceArea"])) * (input.wallThickness / 1000); results["materialVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["materialVolume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["materialVolume"])) * input.materialDensity; results["materialWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["materialWeight"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["materialWeight"])) * input.materialCost; results["materialCostTotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["materialCostTotal"] = Number.NaN; }
  return results;
}


export function calculateBeehive_tank_calculator(input: Beehive_tank_calculatorInput): Beehive_tank_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["materialCostTotal"]);
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


export interface Beehive_tank_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
