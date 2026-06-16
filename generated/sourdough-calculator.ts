// Auto-generated from sourdough-calculator-schema.json
import * as z from 'zod';

export interface Sourdough_calculatorInput {
  flourWeight: number;
  hydration: number;
  starterPercent: number;
  saltPercent: number;
  loafCount: number;
}

export const Sourdough_calculatorInputSchema = z.object({
  flourWeight: z.number().default(500),
  hydration: z.number().default(70),
  starterPercent: z.number().default(20),
  saltPercent: z.number().default(2),
  loafCount: z.number().default(1),
});

function evaluateAllFormulas(input: Sourdough_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.flourWeight * input.loafCount; results["totalFlour"] = Number.isFinite(v) ? v : 0; } catch { results["totalFlour"] = 0; }
  try { const v = input.flourWeight * input.loafCount * input.hydration / 100; results["water"] = Number.isFinite(v) ? v : 0; } catch { results["water"] = 0; }
  try { const v = input.flourWeight * input.loafCount * input.starterPercent / 100; results["starter"] = Number.isFinite(v) ? v : 0; } catch { results["starter"] = 0; }
  try { const v = input.flourWeight * input.loafCount * input.saltPercent / 100; results["salt"] = Number.isFinite(v) ? v : 0; } catch { results["salt"] = 0; }
  try { const v = input.flourWeight * input.loafCount * (1 + input.hydration/100 + input.starterPercent/100 + input.saltPercent/100); results["totalDough"] = Number.isFinite(v) ? v : 0; } catch { results["totalDough"] = 0; }
  return results;
}


export function calculateSourdough_calculator(input: Sourdough_calculatorInput): Sourdough_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalDough"] ?? 0;
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


export interface Sourdough_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
