// Auto-generated from standing-seam-calculator-schema.json
import * as z from 'zod';

export interface Standing_seam_calculatorInput {
  roofLength: number;
  roofWidth: number;
  panelCoverage: number;
  overhang: number;
  clipSpacing: number;
}

export const Standing_seam_calculatorInputSchema = z.object({
  roofLength: z.number().default(30),
  roofWidth: z.number().default(50),
  panelCoverage: z.number().default(16),
  overhang: z.number().default(2),
  clipSpacing: z.number().default(24),
});

function evaluateAllFormulas(input: Standing_seam_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.ceil((input.roofWidth * 12) / input.panelCoverage); results["totalPanels"] = Number.isFinite(v) ? v : 0; } catch { results["totalPanels"] = 0; }
  try { const v = input.roofLength + (input.overhang / 12); results["panelLengthActual"] = Number.isFinite(v) ? v : 0; } catch { results["panelLengthActual"] = 0; }
  try { const v = (results["totalPanels"] ?? 0) * (results["panelLengthActual"] ?? 0); results["totalLinearFeet"] = Number.isFinite(v) ? v : 0; } catch { results["totalLinearFeet"] = 0; }
  try { const v = Math.ceil(((results["panelLengthActual"] ?? 0) * 12) / input.clipSpacing); results["clipsPerSeam"] = Number.isFinite(v) ? v : 0; } catch { results["clipsPerSeam"] = 0; }
  try { const v = ((results["totalPanels"] ?? 0) - 1) * (results["clipsPerSeam"] ?? 0); results["totalClips"] = Number.isFinite(v) ? v : 0; } catch { results["totalClips"] = 0; }
  return results;
}


export function calculateStanding_seam_calculator(input: Standing_seam_calculatorInput): Standing_seam_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalPanels"] ?? 0;
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


export interface Standing_seam_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
