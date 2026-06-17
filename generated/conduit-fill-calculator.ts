// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Conduit_fill_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.conduitFillLimitPercent > 0 ? input.conduitFillLimitPercent - input.safetyMarginPercent : (input.numberOfConductors === 1 ? 53 : input.numberOfConductors === 2 ? 31 : 40) - input.safetyMarginPercent; results["allowedFillPercent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["allowedFillPercent"] = 0; }
  try { const v = input.conduitFillLimitPercent > 0 ? input.conduitFillLimitPercent - input.safetyMarginPercent : (input.numberOfConductors === 1 ? 53 : input.numberOfConductors === 2 ? 31 : 40) - input.safetyMarginPercent; results["allowedFillPercent_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["allowedFillPercent_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateConduit_fill_calculator(input: Conduit_fill_calculatorInput): Conduit_fill_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["allowedFillPercent_aux"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
