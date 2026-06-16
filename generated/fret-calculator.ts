// Auto-generated from fret-calculator-schema.json
import * as z from 'zod';

export interface Fret_calculatorInput {
  scaleLength: number;
  fretNumber: number;
  totalFrets: number;
  compensation: number;
}

export const Fret_calculatorInputSchema = z.object({
  scaleLength: z.number().default(648),
  fretNumber: z.number().default(1),
  totalFrets: z.number().default(24),
  compensation: z.number().default(0),
});

function evaluateAllFormulas(input: Fret_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.scaleLength + input.compensation) - ((input.scaleLength + input.compensation) / Math.pow(2, input.fretNumber / 12))); results["distanceToFret"] = Number.isFinite(v) ? v : 0; } catch { results["distanceToFret"] = 0; }
  try { const v = input.fretNumber < input.totalFrets ? ((input.scaleLength + input.compensation) - ((input.scaleLength + input.compensation) / Math.pow(2, (input.fretNumber + 1) / 12))) : 0; results["distanceToNextFret"] = Number.isFinite(v) ? v : 0; } catch { results["distanceToNextFret"] = 0; }
  try { const v = (input.scaleLength + input.compensation) / 2; results["distanceTo12thFret"] = Number.isFinite(v) ? v : 0; } catch { results["distanceTo12thFret"] = 0; }
  try { const v = input.fretNumber > 1 ? (((input.scaleLength + input.compensation) - ((input.scaleLength + input.compensation) / Math.pow(2, input.fretNumber / 12))) - ((input.scaleLength + input.compensation) - ((input.scaleLength + input.compensation) / Math.pow(2, (input.fretNumber - 1) / 12)))) : ((input.scaleLength + input.compensation) - ((input.scaleLength + input.compensation) / Math.pow(2, input.fretNumber / 12))); results["fretSpacing"] = Number.isFinite(v) ? v : 0; } catch { results["fretSpacing"] = 0; }
  return results;
}


export function calculateFret_calculator(input: Fret_calculatorInput): Fret_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["distanceToFret"] ?? 0;
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


export interface Fret_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
