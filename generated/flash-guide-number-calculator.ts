// Auto-generated from flash-guide-number-calculator-schema.json
import * as z from 'zod';

export interface Flash_guide_number_calculatorInput {
  distance: number;
  aperture: number;
  iso: number;
  flashPower: number;
}

export const Flash_guide_number_calculatorInputSchema = z.object({
  distance: z.number().default(5),
  aperture: z.number().default(8),
  iso: z.number().default(100),
  flashPower: z.number().default(1),
});

function evaluateAllFormulas(input: Flash_guide_number_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance * input.aperture; results["effectiveGN"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveGN"] = 0; }
  try { const v = (results["effectiveGN"] ?? 0) / Math.sqrt(input.flashPower); results["fullPowerGN"] = Number.isFinite(v) ? v : 0; } catch { results["fullPowerGN"] = 0; }
  try { const v = (results["fullPowerGN"] ?? 0) / Math.sqrt(input.iso / 100); results["requiredGuideNumberISO100"] = Number.isFinite(v) ? v : 0; } catch { results["requiredGuideNumberISO100"] = 0; }
  results["distance___aperture_____effectiveGN_"] = 0;
  results["__effectiveGN____sqrt___flashPower______"] = 0;
  results["__fullPowerGN____sqrt___iso__100______re"] = 0;
  return results;
}


export function calculateFlash_guide_number_calculator(input: Flash_guide_number_calculatorInput): Flash_guide_number_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["requiredGuideNumberISO100"] ?? 0;
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


export interface Flash_guide_number_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
