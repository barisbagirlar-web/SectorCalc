// Auto-generated from box-fill-calculator-schema.json
import * as z from 'zod';

export interface Box_fill_calculatorInput {
  number14AWG: number;
  number12AWG: number;
  number10AWG: number;
  numberOfDevices: number;
  numberOfClamps: number;
  equipmentGroundPresent: number;
}

export const Box_fill_calculatorInputSchema = z.object({
  number14AWG: z.number().default(0),
  number12AWG: z.number().default(0),
  number10AWG: z.number().default(0),
  numberOfDevices: z.number().default(0),
  numberOfClamps: z.number().default(0),
  equipmentGroundPresent: z.number().default(1),
});

function evaluateAllFormulas(input: Box_fill_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.number10AWG > 0 ? 2.5 : (input.number12AWG > 0 ? 2.25 : (input.number14AWG > 0 ? 2.0 : 0))); results["volumeLargest"] = Number.isFinite(v) ? v : 0; } catch { results["volumeLargest"] = 0; }
  try { const v = input.number14AWG * 2.0 + input.number12AWG * 2.25 + input.number10AWG * 2.5; results["conductorVolume"] = Number.isFinite(v) ? v : 0; } catch { results["conductorVolume"] = 0; }
  try { const v = input.numberOfDevices * 2 * (results["volumeLargest"] ?? 0); results["deviceVolume"] = Number.isFinite(v) ? v : 0; } catch { results["deviceVolume"] = 0; }
  try { const v = input.numberOfClamps * (results["volumeLargest"] ?? 0); results["clampVolume"] = Number.isFinite(v) ? v : 0; } catch { results["clampVolume"] = 0; }
  try { const v = input.equipmentGroundPresent * (results["volumeLargest"] ?? 0); results["groundVolume"] = Number.isFinite(v) ? v : 0; } catch { results["groundVolume"] = 0; }
  try { const v = (results["conductorVolume"] ?? 0) + (results["deviceVolume"] ?? 0) + (results["clampVolume"] ?? 0) + (results["groundVolume"] ?? 0); results["totalVolume"] = Number.isFinite(v) ? v : 0; } catch { results["totalVolume"] = 0; }
  return results;
}


export function calculateBox_fill_calculator(input: Box_fill_calculatorInput): Box_fill_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalVolume"] ?? 0;
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


export interface Box_fill_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
