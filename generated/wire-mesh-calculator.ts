// Auto-generated from wire-mesh-calculator-schema.json
import * as z from 'zod';

export interface Wire_mesh_calculatorInput {
  wireDiameter: number;
  meshOpening: number;
  sheetWidth: number;
  sheetLength: number;
  quantity: number;
  materialDensity: number;
}

export const Wire_mesh_calculatorInputSchema = z.object({
  wireDiameter: z.number().default(1),
  meshOpening: z.number().default(10),
  sheetWidth: z.number().default(1),
  sheetLength: z.number().default(2),
  quantity: z.number().default(10),
  materialDensity: z.number().default(7850),
});

function evaluateAllFormulas(input: Wire_mesh_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI * Math.pow(input.wireDiameter, 2) * input.materialDensity / (2000 * (input.wireDiameter + input.meshOpening)); results["weightPerSquareMeter"] = Number.isFinite(v) ? v : 0; } catch { results["weightPerSquareMeter"] = 0; }
  try { const v = (results["weightPerSquareMeter"] ?? 0) * input.sheetWidth * input.sheetLength; results["weightPerSheet"] = Number.isFinite(v) ? v : 0; } catch { results["weightPerSheet"] = 0; }
  try { const v = (results["weightPerSheet"] ?? 0) * input.quantity; results["totalWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  try { const v = input.sheetWidth * input.sheetLength * input.quantity; results["totalArea"] = Number.isFinite(v) ? v : 0; } catch { results["totalArea"] = 0; }
  try { const v = (2000 / (input.wireDiameter + input.meshOpening)) * (input.sheetWidth * input.sheetLength) * input.quantity; results["totalWireLength"] = Number.isFinite(v) ? v : 0; } catch { results["totalWireLength"] = 0; }
  return results;
}


export function calculateWire_mesh_calculator(input: Wire_mesh_calculatorInput): Wire_mesh_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalWeight"] ?? 0;
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


export interface Wire_mesh_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
