// Auto-generated from og-fg-calculator-schema.json
import * as z from 'zod';

export interface Og_fg_calculatorInput {
  ogReading: number;
  fgReading: number;
  ogTemp: number;
  fgTemp: number;
  calibTemp: number;
}

export const Og_fg_calculatorInputSchema = z.object({
  ogReading: z.number().default(1.05),
  fgReading: z.number().default(1.01),
  ogTemp: z.number().default(20),
  fgTemp: z.number().default(20),
  calibTemp: z.number().default(20),
});

function evaluateAllFormulas(input: Og_fg_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ogReading * (1.00130346 - 0.000134722124 * input.ogTemp + 0.00000204052596 * input.ogTemp**2 - 0.00000000232820948 * input.ogTemp**3) / (1.00130346 - 0.000134722124 * input.calibTemp + 0.00000204052596 * input.calibTemp**2 - 0.00000000232820948 * input.calibTemp**3); results["correctedOg"] = Number.isFinite(v) ? v : 0; } catch { results["correctedOg"] = 0; }
  try { const v = input.fgReading * (1.00130346 - 0.000134722124 * input.fgTemp + 0.00000204052596 * input.fgTemp**2 - 0.00000000232820948 * input.fgTemp**3) / (1.00130346 - 0.000134722124 * input.calibTemp + 0.00000204052596 * input.calibTemp**2 - 0.00000000232820948 * input.calibTemp**3); results["correctedFg"] = Number.isFinite(v) ? v : 0; } catch { results["correctedFg"] = 0; }
  try { const v = ((results["correctedOg"] ?? 0) - (results["correctedFg"] ?? 0)) * 131.25; results["abv"] = Number.isFinite(v) ? v : 0; } catch { results["abv"] = 0; }
  return results;
}


export function calculateOg_fg_calculator(input: Og_fg_calculatorInput): Og_fg_calculatorOutput {
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


export interface Og_fg_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
