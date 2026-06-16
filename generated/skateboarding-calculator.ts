// Auto-generated from skateboarding-calculator-schema.json
import * as z from 'zod';

export interface Skateboarding_calculatorInput {
  deckLength: number;
  deckWidth: number;
  wheelDiameter: number;
  wheelHardness: number;
  bearingRating: number;
  truckWidth: number;
  riderWeight: number;
  skateStyle: number;
}

export const Skateboarding_calculatorInputSchema = z.object({
  deckLength: z.number().default(32),
  deckWidth: z.number().default(8),
  wheelDiameter: z.number().default(54),
  wheelHardness: z.number().default(99),
  bearingRating: z.number().default(5),
  truckWidth: z.number().default(5.5),
  riderWeight: z.number().default(150),
  skateStyle: z.number().default(1),
});

function evaluateAllFormulas(input: Skateboarding_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.deckLength * input.deckWidth; results["deckArea"] = Number.isFinite(v) ? v : 0; } catch { results["deckArea"] = 0; }
  try { const v = input.wheelDiameter * (100 - input.wheelHardness) / 100; results["wheelPerformance"] = Number.isFinite(v) ? v : 0; } catch { results["wheelPerformance"] = 0; }
  try { const v = input.bearingRating * 10; results["bearingSpeed"] = Number.isFinite(v) ? v : 0; } catch { results["bearingSpeed"] = 0; }
  try { const v = input.truckWidth / input.deckWidth; results["truckStability"] = Number.isFinite(v) ? v : 0; } catch { results["truckStability"] = 0; }
  try { const v = input.riderWeight / 150; results["weightFactor"] = Number.isFinite(v) ? v : 0; } catch { results["weightFactor"] = 0; }
  try { const v = input.skateStyle === 1 ? 1.2 : (input.skateStyle === 2 ? 1.0 : 0.8); results["styleMultiplier"] = Number.isFinite(v) ? v : 0; } catch { results["styleMultiplier"] = 0; }
  try { const v = ((results["deckArea"] ?? 0) * 0.2 + (results["wheelPerformance"] ?? 0) * 0.3 + (results["bearingSpeed"] ?? 0) * 0.25 + (results["truckStability"] ?? 0) * 0.15 + (results["weightFactor"] ?? 0) * 0.1) * (results["styleMultiplier"] ?? 0); results["overallScore"] = Number.isFinite(v) ? v : 0; } catch { results["overallScore"] = 0; }
  return results;
}


export function calculateSkateboarding_calculator(input: Skateboarding_calculatorInput): Skateboarding_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["overallScore"] ?? 0;
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


export interface Skateboarding_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
