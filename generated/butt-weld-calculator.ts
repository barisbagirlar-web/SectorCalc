// Auto-generated from butt-weld-calculator-schema.json
import * as z from 'zod';

export interface Butt_weld_calculatorInput {
  plateThickness: number;
  rootGap: number;
  includedAngle: number;
  weldLength: number;
  metalDensity: number;
}

export const Butt_weld_calculatorInputSchema = z.object({
  plateThickness: z.number().default(10),
  rootGap: z.number().default(2),
  includedAngle: z.number().default(60),
  weldLength: z.number().default(1),
  metalDensity: z.number().default(7850),
});

function evaluateAllFormulas(input: Butt_weld_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.plateThickness * input.rootGap) + (Math.pow(input.plateThickness, 2) * Math.tan((input.includedAngle / 2) * Math.PI / 180)); results["crossSectionalArea"] = Number.isFinite(v) ? v : 0; } catch { results["crossSectionalArea"] = 0; }
  try { const v = (results["crossSectionalArea"] ?? 0) / 1e6 * input.weldLength; results["fillerVolume"] = Number.isFinite(v) ? v : 0; } catch { results["fillerVolume"] = 0; }
  try { const v = (results["fillerVolume"] ?? 0) * input.metalDensity; results["totalFillerWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalFillerWeight"] = 0; }
  return results;
}


export function calculateButt_weld_calculator(input: Butt_weld_calculatorInput): Butt_weld_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalFillerWeight"] ?? 0;
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


export interface Butt_weld_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
