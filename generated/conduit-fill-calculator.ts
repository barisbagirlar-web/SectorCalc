// Auto-generated from conduit-fill-calculator-schema.json
import * as z from 'zod';

export interface Conduit_fill_calculatorInput {
  conduitInnerDiameter: number;
  cableOuterDiameter: number;
  numberOfConductors: number;
  conduitFillLimitPercent: number;
  safetyMarginPercent: number;
  dataConfidence?: number;
}

export const Conduit_fill_calculatorInputSchema = z.object({
  conduitInnerDiameter: z.number().default(1),
  cableOuterDiameter: z.number().default(0.25),
  numberOfConductors: z.number().default(3),
  conduitFillLimitPercent: z.number().default(0),
  safetyMarginPercent: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Conduit_fill_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.conduitFillLimitPercent > 0 ? input.conduitFillLimitPercent - input.safetyMarginPercent : (input.numberOfConductors === 1 ? 53 : input.numberOfConductors === 2 ? 31 : 40) - input.safetyMarginPercent; results["allowedFillPercent"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["allowedFillPercent"] = 0; }
  try { const v = input.conduitFillLimitPercent > 0 ? input.conduitFillLimitPercent - input.safetyMarginPercent : (input.numberOfConductors === 1 ? 53 : input.numberOfConductors === 2 ? 31 : 40) - input.safetyMarginPercent; results["allowedFillPercent_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["allowedFillPercent_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateConduit_fill_calculator(input: Conduit_fill_calculatorInput): Conduit_fill_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["allowedFillPercent_aux"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
