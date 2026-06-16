// Auto-generated from rebar-spacing-calculator-schema.json
import * as z from 'zod';

export interface Rebar_spacing_calculatorInput {
  concreteWidth: number;
  leftCover: number;
  rightCover: number;
  rebarDiameter: number;
  numberOfBars: number;
}

export const Rebar_spacing_calculatorInputSchema = z.object({
  concreteWidth: z.number().default(1000),
  leftCover: z.number().default(40),
  rightCover: z.number().default(40),
  rebarDiameter: z.number().default(12),
  numberOfBars: z.number().default(5),
});

function evaluateAllFormulas(input: Rebar_spacing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.concreteWidth - input.leftCover - input.rightCover - input.rebarDiameter) / (input.numberOfBars - 1); results["centerToCenterSpacing"] = Number.isFinite(v) ? v : 0; } catch { results["centerToCenterSpacing"] = 0; }
  try { const v = (results["centerToCenterSpacing"] ?? 0) - input.rebarDiameter; results["clearSpacing"] = Number.isFinite(v) ? v : 0; } catch { results["clearSpacing"] = 0; }
  try { const v = input.leftCover + input.rebarDiameter / 2; results["firstBarEdgeDistance"] = Number.isFinite(v) ? v : 0; } catch { results["firstBarEdgeDistance"] = 0; }
  try { const v = input.rightCover + input.rebarDiameter / 2; results["lastBarEdgeDistance"] = Number.isFinite(v) ? v : 0; } catch { results["lastBarEdgeDistance"] = 0; }
  return results;
}


export function calculateRebar_spacing_calculator(input: Rebar_spacing_calculatorInput): Rebar_spacing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["centerToCenterSpacing"] ?? 0;
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


export interface Rebar_spacing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
