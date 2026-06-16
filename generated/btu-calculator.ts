// Auto-generated from btu-calculator-schema.json
import * as z from 'zod';

export interface Btu_calculatorInput {
  roomLength: number;
  roomWidth: number;
  ceilingHeight: number;
  insulationFactor: number;
  windowArea: number;
  occupants: number;
  applianceHeat: number;
}

export const Btu_calculatorInputSchema = z.object({
  roomLength: z.number().default(20),
  roomWidth: z.number().default(15),
  ceilingHeight: z.number().default(8),
  insulationFactor: z.number().default(1),
  windowArea: z.number().default(20),
  occupants: z.number().default(2),
  applianceHeat: z.number().default(1000),
});

function evaluateAllFormulas(input: Btu_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.roomLength * input.roomWidth * input.ceilingHeight * 5 * input.insulationFactor + input.windowArea * 30 + input.occupants * 600 + input.applianceHeat; results["totalBTU"] = Number.isFinite(v) ? v : 0; } catch { results["totalBTU"] = 0; }
  try { const v = input.roomLength * input.roomWidth * input.ceilingHeight * 5 * input.insulationFactor; results["baseBTU"] = Number.isFinite(v) ? v : 0; } catch { results["baseBTU"] = 0; }
  try { const v = input.windowArea * 30; results["windowBTU"] = Number.isFinite(v) ? v : 0; } catch { results["windowBTU"] = 0; }
  try { const v = input.occupants * 600; results["occupantBTU"] = Number.isFinite(v) ? v : 0; } catch { results["occupantBTU"] = 0; }
  try { const v = input.applianceHeat; results["applianceBTU"] = Number.isFinite(v) ? v : 0; } catch { results["applianceBTU"] = 0; }
  return results;
}


export function calculateBtu_calculator(input: Btu_calculatorInput): Btu_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalBTU"] ?? 0;
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


export interface Btu_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
