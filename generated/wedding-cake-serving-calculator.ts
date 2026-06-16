// Auto-generated from wedding-cake-serving-calculator-schema.json
import * as z from 'zod';

export interface Wedding_cake_serving_calculatorInput {
  shape: number;
  tier1Diameter: number;
  tier2Diameter: number;
  tier3Diameter: number;
  servingSize: number;
  guestCount: number;
}

export const Wedding_cake_serving_calculatorInputSchema = z.object({
  shape: z.number().default(0),
  tier1Diameter: z.number().default(6),
  tier2Diameter: z.number().default(0),
  tier3Diameter: z.number().default(0),
  servingSize: z.number().default(2),
  guestCount: z.number().default(100),
});

function evaluateAllFormulas(input: Wedding_cake_serving_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.tier1Diameter > 0 ? (input.shape == 0 ? Math.PI * Math.pow(input.tier1Diameter, 2) / (4 * input.servingSize) : Math.pow(input.tier1Diameter, 2) / input.servingSize) : 0; results["serv1"] = Number.isFinite(v) ? v : 0; } catch { results["serv1"] = 0; }
  try { const v = input.tier2Diameter > 0 ? (input.shape == 0 ? Math.PI * Math.pow(input.tier2Diameter, 2) / (4 * input.servingSize) : Math.pow(input.tier2Diameter, 2) / input.servingSize) : 0; results["serv2"] = Number.isFinite(v) ? v : 0; } catch { results["serv2"] = 0; }
  try { const v = input.tier3Diameter > 0 ? (input.shape == 0 ? Math.PI * Math.pow(input.tier3Diameter, 2) / (4 * input.servingSize) : Math.pow(input.tier3Diameter, 2) / input.servingSize) : 0; results["serv3"] = Number.isFinite(v) ? v : 0; } catch { results["serv3"] = 0; }
  try { const v = (results["serv1"] ?? 0) + (results["serv2"] ?? 0) + (results["serv3"] ?? 0); results["totalServings"] = Number.isFinite(v) ? v : 0; } catch { results["totalServings"] = 0; }
  try { const v = (results["totalServings"] ?? 0) - input.guestCount; results["surplus"] = Number.isFinite(v) ? v : 0; } catch { results["surplus"] = 0; }
  return results;
}


export function calculateWedding_cake_serving_calculator(input: Wedding_cake_serving_calculatorInput): Wedding_cake_serving_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalServings"] ?? 0;
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


export interface Wedding_cake_serving_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
