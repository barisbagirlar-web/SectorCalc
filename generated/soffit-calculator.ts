// Auto-generated from soffit-calculator-schema.json
import * as z from 'zod';

export interface Soffit_calculatorInput {
  runLength: number;
  overhangWidth: number;
  panelLength: number;
  panelWidth: number;
  wasteFactor: number;
}

export const Soffit_calculatorInputSchema = z.object({
  runLength: z.number().default(10),
  overhangWidth: z.number().default(0.5),
  panelLength: z.number().default(2.44),
  panelWidth: z.number().default(0.3),
  wasteFactor: z.number().default(5),
});

function evaluateAllFormulas(input: Soffit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.runLength * input.overhangWidth; results["total_area"] = Number.isFinite(v) ? v : 0; } catch { results["total_area"] = 0; }
  try { const v = input.runLength * input.overhangWidth * (1 + input.wasteFactor / 100); results["area_with_waste"] = Number.isFinite(v) ? v : 0; } catch { results["area_with_waste"] = 0; }
  try { const v = (input.runLength * input.overhangWidth * (1 + input.wasteFactor / 100)) / (input.panelLength * input.panelWidth); results["panels_exact"] = Number.isFinite(v) ? v : 0; } catch { results["panels_exact"] = 0; }
  try { const v = Math.ceil((input.runLength * input.overhangWidth * (1 + input.wasteFactor / 100)) / (input.panelLength * input.panelWidth)); results["panels_rounded_up"] = Number.isFinite(v) ? v : 0; } catch { results["panels_rounded_up"] = 0; }
  try { const v = Math.ceil((input.runLength * input.overhangWidth * (1 + input.wasteFactor / 100)) / (input.panelLength * input.panelWidth)); results["total_panels"] = Number.isFinite(v) ? v : 0; } catch { results["total_panels"] = 0; }
  return results;
}


export function calculateSoffit_calculator(input: Soffit_calculatorInput): Soffit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_panels"] ?? 0;
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


export interface Soffit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
