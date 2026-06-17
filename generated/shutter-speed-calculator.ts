// Auto-generated from shutter-speed-calculator-schema.json
import * as z from 'zod';

export interface Shutter_speed_calculatorInput {
  objectSpeed: number;
  distance: number;
  focalLength: number;
  pixelSize: number;
  allowableBlur: number;
}

export const Shutter_speed_calculatorInputSchema = z.object({
  objectSpeed: z.number().default(1),
  distance: z.number().default(5),
  focalLength: z.number().default(50),
  pixelSize: z.number().default(5),
  allowableBlur: z.number().default(1),
});

function evaluateAllFormulas(input: Shutter_speed_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.objectSpeed; results["shutterSpeed"] = Number.isFinite(v) ? v : 0; } catch { results["shutterSpeed"] = 0; }
  try { const v = input.objectSpeed; results["shutterSpeed_ms"] = Number.isFinite(v) ? v : 0; } catch { results["shutterSpeed_ms"] = 0; }
  try { const v = input.objectSpeed; results["shutterSpeed_us"] = Number.isFinite(v) ? v : 0; } catch { results["shutterSpeed_us"] = 0; }
  return results;
}


export function calculateShutter_speed_calculator(input: Shutter_speed_calculatorInput): Shutter_speed_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["shutterSpeed"] ?? 0;
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


export interface Shutter_speed_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
