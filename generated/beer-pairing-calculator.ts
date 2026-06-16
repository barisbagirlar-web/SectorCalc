// Auto-generated from beer-pairing-calculator-schema.json
import * as z from 'zod';

export interface Beer_pairing_calculatorInput {
  beerIBU: number;
  beerABV: number;
  foodRichness: number;
  foodSpiciness: number;
  foodAcidity: number;
}

export const Beer_pairing_calculatorInputSchema = z.object({
  beerIBU: z.number().default(30),
  beerABV: z.number().default(5),
  foodRichness: z.number().default(5),
  foodSpiciness: z.number().default(3),
  foodAcidity: z.number().default(3),
});

function evaluateAllFormulas(input: Beer_pairing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.abs(input.beerIBU - input.foodRichness * 10) * 0.2; results["bitternessMatch"] = Number.isFinite(v) ? v : 0; } catch { results["bitternessMatch"] = 0; }
  try { const v = Math.abs(input.beerABV - input.foodRichness) * 5; results["alcoholMatch"] = Number.isFinite(v) ? v : 0; } catch { results["alcoholMatch"] = 0; }
  try { const v = Math.abs(input.foodSpiciness - 5) * 3; results["spiceMatch"] = Number.isFinite(v) ? v : 0; } catch { results["spiceMatch"] = 0; }
  try { const v = Math.abs(input.foodAcidity - 3) * 2; results["acidityMatch"] = Number.isFinite(v) ? v : 0; } catch { results["acidityMatch"] = 0; }
  try { const v = Math.max(0, 100 - ((results["bitternessMatch"] ?? 0) + (results["alcoholMatch"] ?? 0) + (results["spiceMatch"] ?? 0) + (results["acidityMatch"] ?? 0))); results["pairingScore"] = Number.isFinite(v) ? v : 0; } catch { results["pairingScore"] = 0; }
  return results;
}


export function calculateBeer_pairing_calculator(input: Beer_pairing_calculatorInput): Beer_pairing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["pairingScore"] ?? 0;
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


export interface Beer_pairing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
