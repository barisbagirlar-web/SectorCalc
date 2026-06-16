// Auto-generated from conduit-fill-calculator-schema.json
import * as z from 'zod';

export interface Conduit_fill_calculatorInput {
  conduitInnerDiameter: number;
  cableOuterDiameter: number;
  numberOfConductors: number;
  conduitFillLimitPercent: number;
  safetyMarginPercent: number;
}

export const Conduit_fill_calculatorInputSchema = z.object({
  conduitInnerDiameter: z.number().default(1),
  cableOuterDiameter: z.number().default(0.25),
  numberOfConductors: z.number().default(3),
  conduitFillLimitPercent: z.number().default(0),
  safetyMarginPercent: z.number().default(0),
});

function evaluateAllFormulas(input: Conduit_fill_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI * Math.pow(input.conduitInnerDiameter / 2, 2); results["conduitArea"] = Number.isFinite(v) ? v : 0; } catch { results["conduitArea"] = 0; }
  try { const v = Math.PI * Math.pow(input.cableOuterDiameter / 2, 2); results["cableArea"] = Number.isFinite(v) ? v : 0; } catch { results["cableArea"] = 0; }
  try { const v = input.numberOfConductors * (results["cableArea"] ?? 0); results["totalCableArea"] = Number.isFinite(v) ? v : 0; } catch { results["totalCableArea"] = 0; }
  try { const v = ((results["totalCableArea"] ?? 0) / (results["conduitArea"] ?? 0)) * 100; results["fillPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["fillPercentage"] = 0; }
  try { const v = input.conduitFillLimitPercent > 0 ? input.conduitFillLimitPercent - input.safetyMarginPercent : (input.numberOfConductors === 1 ? 53 : input.numberOfConductors === 2 ? 31 : 40) - input.safetyMarginPercent; results["allowedFillPercent"] = Number.isFinite(v) ? v : 0; } catch { results["allowedFillPercent"] = 0; }
  try { const v = ((results["allowedFillPercent"] ?? 0) / 100) * (results["conduitArea"] ?? 0); results["allowedCableArea"] = Number.isFinite(v) ? v : 0; } catch { results["allowedCableArea"] = 0; }
  try { const v = Math.floor((results["allowedCableArea"] ?? 0) / (results["cableArea"] ?? 0)); results["maxAllowedConductors"] = Number.isFinite(v) ? v : 0; } catch { results["maxAllowedConductors"] = 0; }
  try { const v = (results["fillPercentage"] ?? 0) <= (results["allowedFillPercent"] ?? 0); results["isCompliant"] = Number.isFinite(v) ? v : 0; } catch { results["isCompliant"] = 0; }
  try { const v = (results["allowedCableArea"] ?? 0) - (results["totalCableArea"] ?? 0); results["remainingArea"] = Number.isFinite(v) ? v : 0; } catch { results["remainingArea"] = 0; }
  return results;
}


export function calculateConduit_fill_calculator(input: Conduit_fill_calculatorInput): Conduit_fill_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["fillPercentage"] ?? 0;
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


export interface Conduit_fill_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
