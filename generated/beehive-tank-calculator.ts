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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Beehive_tank_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.diameter / 2; results["radius"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["radius"] = 0; }
  try { const v = Math.PI * (input.diameter/2)**2 * input.heightCylinder; results["volumeCylinder"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["volumeCylinder"] = 0; }
  try { const v = (2/3) * Math.PI * (input.diameter/2)**3; results["volumeHemisphere"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["volumeHemisphere"] = 0; }
  try { const v = (asFormulaNumber(results["volumeCylinder"])) + (asFormulaNumber(results["volumeHemisphere"])); results["totalVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalVolume"] = 0; }
  try { const v = 2 * Math.PI * (input.diameter/2) * input.heightCylinder; results["surfaceAreaCylinder"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["surfaceAreaCylinder"] = 0; }
  try { const v = 2 * Math.PI * (input.diameter/2)**2; results["surfaceAreaHemisphere"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["surfaceAreaHemisphere"] = 0; }
  try { const v = (asFormulaNumber(results["surfaceAreaCylinder"])) + (asFormulaNumber(results["surfaceAreaHemisphere"])); results["totalSurfaceArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalSurfaceArea"] = 0; }
  try { const v = (asFormulaNumber(results["totalSurfaceArea"])) * (input.wallThickness / 1000); results["materialVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["materialVolume"] = 0; }
  try { const v = (asFormulaNumber(results["materialVolume"])) * input.materialDensity; results["materialWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["materialWeight"] = 0; }
  try { const v = (asFormulaNumber(results["materialWeight"])) * input.materialCost; results["materialCostTotal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["materialCostTotal"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
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
