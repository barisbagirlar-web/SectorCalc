// Auto-generated from drywall-calculator-schema.json
import * as z from 'zod';

export interface Drywall_calculatorInput {
  roomLength: number;
  roomWidth: number;
  roomHeight: number;
  numberOfDoors: number;
  numberOfWindows: number;
  panelArea: number;
  wasteFactor: number;
}

export const Drywall_calculatorInputSchema = z.object({
  roomLength: z.number().default(5),
  roomWidth: z.number().default(4),
  roomHeight: z.number().default(2.5),
  numberOfDoors: z.number().default(1),
  numberOfWindows: z.number().default(2),
  panelArea: z.number().default(2.88),
  wasteFactor: z.number().default(10),
});

function evaluateAllFormulas(input: Drywall_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (2 * (input.roomLength + input.roomWidth)) * input.roomHeight; results["totalWallArea"] = Number.isFinite(v) ? v : 0; } catch { results["totalWallArea"] = 0; }
  try { const v = input.numberOfDoors * 2 + input.numberOfWindows * 1.5; results["totalOpenings"] = Number.isFinite(v) ? v : 0; } catch { results["totalOpenings"] = 0; }
  try { const v = (results["totalWallArea"] ?? 0) - (results["totalOpenings"] ?? 0); results["netArea"] = Number.isFinite(v) ? v : 0; } catch { results["netArea"] = 0; }
  try { const v = (results["netArea"] ?? 0) * (1 + input.wasteFactor / 100); results["totalAreaWithWaste"] = Number.isFinite(v) ? v : 0; } catch { results["totalAreaWithWaste"] = 0; }
  try { const v = Math.ceil((results["totalAreaWithWaste"] ?? 0) / input.panelArea); results["totalPanels"] = Number.isFinite(v) ? v : 0; } catch { results["totalPanels"] = 0; }
  try { const v = (results["totalAreaWithWaste"] ?? 0) * 0.4; results["compound_kg"] = Number.isFinite(v) ? v : 0; } catch { results["compound_kg"] = 0; }
  try { const v = (results["totalAreaWithWaste"] ?? 0) * 1.5; results["tape_m"] = Number.isFinite(v) ? v : 0; } catch { results["tape_m"] = 0; }
  try { const v = Math.ceil((results["totalAreaWithWaste"] ?? 0) * 15); results["screws"] = Number.isFinite(v) ? v : 0; } catch { results["screws"] = 0; }
  return results;
}


export function calculateDrywall_calculator(input: Drywall_calculatorInput): Drywall_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalPanels"] ?? 0;
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


export interface Drywall_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
