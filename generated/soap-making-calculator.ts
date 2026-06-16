// Auto-generated from soap-making-calculator-schema.json
import * as z from 'zod';

export interface Soap_making_calculatorInput {
  oilWeight: number;
  sapValue: number;
  superfat: number;
  waterPercent: number;
}

export const Soap_making_calculatorInputSchema = z.object({
  oilWeight: z.number().default(1000),
  sapValue: z.number().default(135.5),
  superfat: z.number().default(5),
  waterPercent: z.number().default(38),
});

function evaluateAllFormulas(input: Soap_making_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.oilWeight * input.sapValue / 1000) * (1 - input.superfat / 100); results["lyeWeight"] = Number.isFinite(v) ? v : 0; } catch { results["lyeWeight"] = 0; }
  try { const v = input.oilWeight * (input.waterPercent / 100); results["waterWeight"] = Number.isFinite(v) ? v : 0; } catch { results["waterWeight"] = 0; }
  try { const v = input.oilWeight + (results["lyeWeight"] ?? 0) + (results["waterWeight"] ?? 0); results["totalWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  return results;
}


export function calculateSoap_making_calculator(input: Soap_making_calculatorInput): Soap_making_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["lyeWeight"] ?? 0;
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


export interface Soap_making_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
