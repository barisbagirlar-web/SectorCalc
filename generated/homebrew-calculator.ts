// Auto-generated from homebrew-calculator-schema.json
import * as z from 'zod';

export interface Homebrew_calculatorInput {
  grainWeight: number;
  hopWeight: number;
  alphaAcid: number;
  boilVolume: number;
  boilTime: number;
  attenuation: number;
  efficiency: number;
}

export const Homebrew_calculatorInputSchema = z.object({
  grainWeight: z.number().default(5),
  hopWeight: z.number().default(50),
  alphaAcid: z.number().default(5),
  boilVolume: z.number().default(20),
  boilTime: z.number().default(60),
  attenuation: z.number().default(75),
  efficiency: z.number().default(75),
});

function evaluateAllFormulas(input: Homebrew_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 + (input.grainWeight * 300 * (input.efficiency / 100)) / (input.boilVolume * 1000); results["originalGravity"] = Number.isFinite(v) ? v : 0; } catch { results["originalGravity"] = 0; }
  try { const v = (results["originalGravity"] ?? 0) - ((results["originalGravity"] ?? 0) - 1) * (input.attenuation / 100); results["finalGravity"] = Number.isFinite(v) ? v : 0; } catch { results["finalGravity"] = 0; }
  try { const v = ((results["originalGravity"] ?? 0) - (results["finalGravity"] ?? 0)) * 131.25; results["abv"] = Number.isFinite(v) ? v : 0; } catch { results["abv"] = 0; }
  try { const v = (input.hopWeight * input.alphaAcid * (1.65 * Math.pow(0.000125, ((results["originalGravity"] ?? 0) - 1) * 1000) * (1 - Math.exp(-0.04 * input.boilTime)) / 4.15) * 1000) / input.boilVolume; results["ibu"] = Number.isFinite(v) ? v : 0; } catch { results["ibu"] = 0; }
  return results;
}


export function calculateHomebrew_calculator(input: Homebrew_calculatorInput): Homebrew_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["abv"] ?? 0;
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


export interface Homebrew_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
