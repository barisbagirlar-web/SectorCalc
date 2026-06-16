// Auto-generated from beading-calculator-schema.json
import * as z from 'zod';

export interface Beading_calculatorInput {
  plateThickness: number;
  rootGap: number;
  bevelAngle: number;
  reinforcementHeight: number;
  weldLength: number;
  materialDensity: number;
}

export const Beading_calculatorInputSchema = z.object({
  plateThickness: z.number().default(10),
  rootGap: z.number().default(2),
  bevelAngle: z.number().default(60),
  reinforcementHeight: z.number().default(1.5),
  weldLength: z.number().default(500),
  materialDensity: z.number().default(7.85),
});

function evaluateAllFormulas(input: Beading_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.rootGap + 2 * input.plateThickness * (Math.sin((input.bevelAngle/2) * Math.PI / 180) / Math.cos((input.bevelAngle/2) * Math.PI / 180)); results["weldWidth"] = Number.isFinite(v) ? v : 0; } catch { results["weldWidth"] = 0; }
  try { const v = input.rootGap * input.plateThickness + input.plateThickness * input.plateThickness * (Math.sin((input.bevelAngle/2) * Math.PI / 180) / Math.cos((input.bevelAngle/2) * Math.PI / 180)); results["grooveArea"] = Number.isFinite(v) ? v : 0; } catch { results["grooveArea"] = 0; }
  try { const v = 0.67 * input.reinforcementHeight * (results["weldWidth"] ?? 0); results["reinforcementArea"] = Number.isFinite(v) ? v : 0; } catch { results["reinforcementArea"] = 0; }
  try { const v = (results["grooveArea"] ?? 0) + (results["reinforcementArea"] ?? 0); results["crossSectionalArea"] = Number.isFinite(v) ? v : 0; } catch { results["crossSectionalArea"] = 0; }
  try { const v = (results["crossSectionalArea"] ?? 0) * input.weldLength; results["volume"] = Number.isFinite(v) ? v : 0; } catch { results["volume"] = 0; }
  try { const v = (results["volume"] ?? 0) * input.materialDensity / 1000000; results["weldWeight"] = Number.isFinite(v) ? v : 0; } catch { results["weldWeight"] = 0; }
  return results;
}


export function calculateBeading_calculator(input: Beading_calculatorInput): Beading_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["weldWeight"] ?? 0;
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


export interface Beading_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
