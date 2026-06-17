// Auto-generated from beehive-tank-calculator-schema.json
import * as z from 'zod';

export interface Beehive_tank_calculatorInput {
  diameter: number;
  heightCylinder: number;
  wallThickness: number;
  materialDensity: number;
  materialCost: number;
}

export const Beehive_tank_calculatorInputSchema = z.object({
  diameter: z.number().default(2),
  heightCylinder: z.number().default(3),
  wallThickness: z.number().default(5),
  materialDensity: z.number().default(7850),
  materialCost: z.number().default(10),
});

function evaluateAllFormulas(input: Beehive_tank_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.diameter / 2; results["radius"] = Number.isFinite(v) ? v : 0; } catch { results["radius"] = 0; }
  try { const v = Math.PI * (input.diameter/2)**2 * input.heightCylinder; results["volumeCylinder"] = Number.isFinite(v) ? v : 0; } catch { results["volumeCylinder"] = 0; }
  try { const v = (2/3) * Math.PI * (input.diameter/2)**3; results["volumeHemisphere"] = Number.isFinite(v) ? v : 0; } catch { results["volumeHemisphere"] = 0; }
  try { const v = (results["volumeCylinder"] ?? 0) + (results["volumeHemisphere"] ?? 0); results["totalVolume"] = Number.isFinite(v) ? v : 0; } catch { results["totalVolume"] = 0; }
  try { const v = 2 * Math.PI * (input.diameter/2) * input.heightCylinder; results["surfaceAreaCylinder"] = Number.isFinite(v) ? v : 0; } catch { results["surfaceAreaCylinder"] = 0; }
  try { const v = 2 * Math.PI * (input.diameter/2)**2; results["surfaceAreaHemisphere"] = Number.isFinite(v) ? v : 0; } catch { results["surfaceAreaHemisphere"] = 0; }
  try { const v = (results["surfaceAreaCylinder"] ?? 0) + (results["surfaceAreaHemisphere"] ?? 0); results["totalSurfaceArea"] = Number.isFinite(v) ? v : 0; } catch { results["totalSurfaceArea"] = 0; }
  try { const v = (results["totalSurfaceArea"] ?? 0) * (input.wallThickness / 1000); results["materialVolume"] = Number.isFinite(v) ? v : 0; } catch { results["materialVolume"] = 0; }
  try { const v = (results["materialVolume"] ?? 0) * input.materialDensity; results["materialWeight"] = Number.isFinite(v) ? v : 0; } catch { results["materialWeight"] = 0; }
  try { const v = (results["materialWeight"] ?? 0) * input.materialCost; results["materialCostTotal"] = Number.isFinite(v) ? v : 0; } catch { results["materialCostTotal"] = 0; }
  results["Silindir_Hacmi__m__"] = 0;
  results["Kubbe_Hacmi__m__"] = 0;
  results["Y_zey_Alan___m__"] = 0;
  results["Malzeme_A__rl_____kg_"] = 0;
  results["Malzeme_Maliyeti__TRY_"] = 0;
  results["result"] = 0;
  return results;
}


export function calculateBeehive_tank_calculator(input: Beehive_tank_calculatorInput): Beehive_tank_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Beehive_tank_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
