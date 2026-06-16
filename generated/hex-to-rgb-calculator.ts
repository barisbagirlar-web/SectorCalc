// Auto-generated from hex-to-rgb-calculator-schema.json
import * as z from 'zod';

export interface Hex_to_rgb_calculatorInput {
  rHigh: number;
  rLow: number;
  gHigh: number;
  gLow: number;
  bHigh: number;
  bLow: number;
}

export const Hex_to_rgb_calculatorInputSchema = z.object({
  rHigh: z.number().default(0),
  rLow: z.number().default(0),
  gHigh: z.number().default(0),
  gLow: z.number().default(0),
  bHigh: z.number().default(0),
  bLow: z.number().default(0),
});

function evaluateAllFormulas(input: Hex_to_rgb_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.rHigh * 16 + input.rLow; results["red"] = Number.isFinite(v) ? v : 0; } catch { results["red"] = 0; }
  try { const v = input.gHigh * 16 + input.gLow; results["green"] = Number.isFinite(v) ? v : 0; } catch { results["green"] = 0; }
  try { const v = input.bHigh * 16 + input.bLow; results["blue"] = Number.isFinite(v) ? v : 0; } catch { results["blue"] = 0; }
  try { const v = 'rgb(' + (results["red"] ?? 0) + ', ' + (results["green"] ?? 0) + ', ' + (results["blue"] ?? 0) + ')'; results["rgbString"] = Number.isFinite(v) ? v : 0; } catch { results["rgbString"] = 0; }
  return results;
}


export function calculateHex_to_rgb_calculator(input: Hex_to_rgb_calculatorInput): Hex_to_rgb_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total"] ?? 0;
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


export interface Hex_to_rgb_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
