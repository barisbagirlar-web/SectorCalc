// Auto-generated from chair-rail-calculator-schema.json
import * as z from 'zod';

export interface Chair_rail_calculatorInput {
  roomLength: number;
  roomWidth: number;
  doorCount: number;
  doorWidth: number;
  windowCount: number;
  windowWidth: number;
  wasteFactor: number;
  pricePerFoot: number;
}

export const Chair_rail_calculatorInputSchema = z.object({
  roomLength: z.number().default(0),
  roomWidth: z.number().default(0),
  doorCount: z.number().default(0),
  doorWidth: z.number().default(3),
  windowCount: z.number().default(0),
  windowWidth: z.number().default(4),
  wasteFactor: z.number().default(10),
  pricePerFoot: z.number().default(0),
});

function evaluateAllFormulas(input: Chair_rail_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2 * (input.roomLength + input.roomWidth); results["perimeter"] = Number.isFinite(v) ? v : 0; } catch { results["perimeter"] = 0; }
  try { const v = input.doorCount * input.doorWidth + input.windowCount * input.windowWidth; results["openings"] = Number.isFinite(v) ? v : 0; } catch { results["openings"] = 0; }
  try { const v = (results["perimeter"] ?? 0) - (results["openings"] ?? 0); results["netLength"] = Number.isFinite(v) ? v : 0; } catch { results["netLength"] = 0; }
  try { const v = (results["netLength"] ?? 0) * (input.wasteFactor / 100); results["wasteAmount"] = Number.isFinite(v) ? v : 0; } catch { results["wasteAmount"] = 0; }
  try { const v = (results["netLength"] ?? 0) + (results["wasteAmount"] ?? 0); results["totalLength"] = Number.isFinite(v) ? v : 0; } catch { results["totalLength"] = 0; }
  try { const v = (results["totalLength"] ?? 0) * input.pricePerFoot; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateChair_rail_calculator(input: Chair_rail_calculatorInput): Chair_rail_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalLength"] ?? 0;
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


export interface Chair_rail_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
