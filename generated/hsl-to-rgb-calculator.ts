// Auto-generated from hsl-to-rgb-calculator-schema.json
import * as z from 'zod';

export interface Hsl_to_rgb_calculatorInput {
  hue: number;
  saturation: number;
  lightness: number;
  max: number;
}

export const Hsl_to_rgb_calculatorInputSchema = z.object({
  hue: z.number().default(0),
  saturation: z.number().default(100),
  lightness: z.number().default(50),
  max: z.number().default(255),
});

function evaluateAllFormulas(input: Hsl_to_rgb_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hue / 360; results["h"] = Number.isFinite(v) ? v : 0; } catch { results["h"] = 0; }
  try { const v = input.saturation / 100; results["s"] = Number.isFinite(v) ? v : 0; } catch { results["s"] = 0; }
  try { const v = input.lightness / 100; results["l"] = Number.isFinite(v) ? v : 0; } catch { results["l"] = 0; }
  try { const v = (results["l"] ?? 0) < 0.5 ? (results["l"] ?? 0) * (1 + (results["s"] ?? 0)) : (results["l"] ?? 0) + (results["s"] ?? 0) - (results["l"] ?? 0) * (results["s"] ?? 0); results["q"] = Number.isFinite(v) ? v : 0; } catch { results["q"] = 0; }
  try { const v = 2 * (results["l"] ?? 0) - (results["q"] ?? 0); results["p"] = Number.isFinite(v) ? v : 0; } catch { results["p"] = 0; }
  try { const v = ((results["h"] ?? 0) + 1/3 < 0 ? (results["h"] ?? 0) + 1/3 + 1 : (results["h"] ?? 0) + 1/3 > 1 ? (results["h"] ?? 0) + 1/3 - 1 : (results["h"] ?? 0) + 1/3); results["adjustR"] = Number.isFinite(v) ? v : 0; } catch { results["adjustR"] = 0; }
  try { const v = ((results["h"] ?? 0) < 0 ? (results["h"] ?? 0) + 1 : (results["h"] ?? 0) > 1 ? (results["h"] ?? 0) - 1 : (results["h"] ?? 0)); results["adjustG"] = Number.isFinite(v) ? v : 0; } catch { results["adjustG"] = 0; }
  try { const v = ((results["h"] ?? 0) - 1/3 < 0 ? (results["h"] ?? 0) - 1/3 + 1 : (results["h"] ?? 0) - 1/3 > 1 ? (results["h"] ?? 0) - 1/3 - 1 : (results["h"] ?? 0) - 1/3); results["adjustB"] = Number.isFinite(v) ? v : 0; } catch { results["adjustB"] = 0; }
  try { const v = (results["s"] ?? 0) === 0 ? (results["l"] ?? 0) : ((results["adjustR"] ?? 0) < 1/6 ? (results["p"] ?? 0) + ((results["q"] ?? 0) - (results["p"] ?? 0)) * 6 * (results["adjustR"] ?? 0) : (results["adjustR"] ?? 0) < 1/2 ? (results["q"] ?? 0) : (results["adjustR"] ?? 0) < 2/3 ? (results["p"] ?? 0) + ((results["q"] ?? 0) - (results["p"] ?? 0)) * (2/3 - (results["adjustR"] ?? 0)) * 6 : (results["p"] ?? 0)); results["r1"] = Number.isFinite(v) ? v : 0; } catch { results["r1"] = 0; }
  try { const v = (results["s"] ?? 0) === 0 ? (results["l"] ?? 0) : ((results["adjustG"] ?? 0) < 1/6 ? (results["p"] ?? 0) + ((results["q"] ?? 0) - (results["p"] ?? 0)) * 6 * (results["adjustG"] ?? 0) : (results["adjustG"] ?? 0) < 1/2 ? (results["q"] ?? 0) : (results["adjustG"] ?? 0) < 2/3 ? (results["p"] ?? 0) + ((results["q"] ?? 0) - (results["p"] ?? 0)) * (2/3 - (results["adjustG"] ?? 0)) * 6 : (results["p"] ?? 0)); results["g1"] = Number.isFinite(v) ? v : 0; } catch { results["g1"] = 0; }
  try { const v = (results["s"] ?? 0) === 0 ? (results["l"] ?? 0) : ((results["adjustB"] ?? 0) < 1/6 ? (results["p"] ?? 0) + ((results["q"] ?? 0) - (results["p"] ?? 0)) * 6 * (results["adjustB"] ?? 0) : (results["adjustB"] ?? 0) < 1/2 ? (results["q"] ?? 0) : (results["adjustB"] ?? 0) < 2/3 ? (results["p"] ?? 0) + ((results["q"] ?? 0) - (results["p"] ?? 0)) * (2/3 - (results["adjustB"] ?? 0)) * 6 : (results["p"] ?? 0)); results["b1"] = Number.isFinite(v) ? v : 0; } catch { results["b1"] = 0; }
  try { const v = Math.round((results["r1"] ?? 0) * input.max); results["r"] = Number.isFinite(v) ? v : 0; } catch { results["r"] = 0; }
  try { const v = Math.round((results["g1"] ?? 0) * input.max); results["g"] = Number.isFinite(v) ? v : 0; } catch { results["g"] = 0; }
  try { const v = Math.round((results["b1"] ?? 0) * input.max); results["b"] = Number.isFinite(v) ? v : 0; } catch { results["b"] = 0; }
  try { const v = "rgb(" + (results["r"] ?? 0) + "," + (results["g"] ?? 0) + "," + (results["b"] ?? 0) + ")"; results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  results["breakdown"] = 0;
  return results;
}


export function calculateHsl_to_rgb_calculator(input: Hsl_to_rgb_calculatorInput): Hsl_to_rgb_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primary"] ?? 0;
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


export interface Hsl_to_rgb_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
