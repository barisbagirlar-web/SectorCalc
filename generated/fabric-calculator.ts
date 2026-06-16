// Auto-generated from fabric-calculator-schema.json
import * as z from 'zod';

export interface Fabric_calculatorInput {
  itemLength: number;
  itemWidth: number;
  quantity: number;
  fabricWidth: number;
  wasteFactor: number;
  patternRepeat: number;
}

export const Fabric_calculatorInputSchema = z.object({
  itemLength: z.number().default(50),
  itemWidth: z.number().default(30),
  quantity: z.number().default(10),
  fabricWidth: z.number().default(150),
  wasteFactor: z.number().default(5),
  patternRepeat: z.number().default(0),
});

function evaluateAllFormulas(input: Fabric_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.floor(input.fabricWidth / input.itemWidth); results["piecesPerWidth"] = Number.isFinite(v) ? v : 0; } catch { results["piecesPerWidth"] = 0; }
  try { const v = Math.ceil(input.quantity / (results["piecesPerWidth"] ?? 0)); results["rowsNeeded"] = Number.isFinite(v) ? v : 0; } catch { results["rowsNeeded"] = 0; }
  try { const v = (results["rowsNeeded"] ?? 0) * (input.itemLength + (input.patternRepeat > 0 ? input.patternRepeat : 0)); results["totalLengthBeforeWasteCm"] = Number.isFinite(v) ? v : 0; } catch { results["totalLengthBeforeWasteCm"] = 0; }
  try { const v = (results["totalLengthBeforeWasteCm"] ?? 0) * (1 + input.wasteFactor / 100); results["totalFabricLengthCm"] = Number.isFinite(v) ? v : 0; } catch { results["totalFabricLengthCm"] = 0; }
  try { const v = (results["totalFabricLengthCm"] ?? 0) / 100; results["totalFabricLengthMeters"] = Number.isFinite(v) ? v : 0; } catch { results["totalFabricLengthMeters"] = 0; }
  return results;
}


export function calculateFabric_calculator(input: Fabric_calculatorInput): Fabric_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalFabricLengthMeters"] ?? 0;
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


export interface Fabric_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
