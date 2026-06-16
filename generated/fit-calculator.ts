// Auto-generated from fit-calculator-schema.json
import * as z from 'zod';

export interface Fit_calculatorInput {
  nominalDiameter: number;
  holeUpperDev: number;
  holeLowerDev: number;
  shaftUpperDev: number;
  shaftLowerDev: number;
}

export const Fit_calculatorInputSchema = z.object({
  nominalDiameter: z.number().default(50),
  holeUpperDev: z.number().default(0.025),
  holeLowerDev: z.number().default(0),
  shaftUpperDev: z.number().default(0),
  shaftLowerDev: z.number().default(-0.016),
});

function evaluateAllFormulas(input: Fit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.nominalDiameter + input.holeUpperDev; results["holeMax"] = Number.isFinite(v) ? v : 0; } catch { results["holeMax"] = 0; }
  try { const v = input.nominalDiameter + input.holeLowerDev; results["holeMin"] = Number.isFinite(v) ? v : 0; } catch { results["holeMin"] = 0; }
  try { const v = input.nominalDiameter + input.shaftUpperDev; results["shaftMax"] = Number.isFinite(v) ? v : 0; } catch { results["shaftMax"] = 0; }
  try { const v = input.nominalDiameter + input.shaftLowerDev; results["shaftMin"] = Number.isFinite(v) ? v : 0; } catch { results["shaftMin"] = 0; }
  try { const v = (results["holeMax"] ?? 0) - (results["shaftMin"] ?? 0); results["maxClearance"] = Number.isFinite(v) ? v : 0; } catch { results["maxClearance"] = 0; }
  try { const v = (results["holeMin"] ?? 0) - (results["shaftMax"] ?? 0); results["minClearance"] = Number.isFinite(v) ? v : 0; } catch { results["minClearance"] = 0; }
  try { const v = (results["minClearance"] ?? 0) > 0 ? 1 : ((results["maxClearance"] ?? 0) < 0 ? 3 : 2); results["fitTypeCode"] = Number.isFinite(v) ? v : 0; } catch { results["fitTypeCode"] = 0; }
  return results;
}


export function calculateFit_calculator(input: Fit_calculatorInput): Fit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["maxClearance"] ?? 0;
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


export interface Fit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
