// Auto-generated from therms-to-btu-calculator-schema.json
import * as z from 'zod';

export interface Therms_to_btu_calculatorInput {
  quantity: number;
  conversionFactor: number;
  energyContentAdjustment: number;
  precision: number;
  outputUnitFactor: number;
}

export const Therms_to_btu_calculatorInputSchema = z.object({
  quantity: z.number().default(1),
  conversionFactor: z.number().default(100000),
  energyContentAdjustment: z.number().default(0),
  precision: z.number().default(0),
  outputUnitFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Therms_to_btu_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.conversionFactor + input.energyContentAdjustment; results["adjustedFactor"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedFactor"] = 0; }
  try { const v = input.quantity * (input.conversionFactor + input.energyContentAdjustment); results["rawBtu"] = Number.isFinite(v) ? v : 0; } catch { results["rawBtu"] = 0; }
  try { const v = (results["rawBtu"] ?? 0) * input.outputUnitFactor; results["scaledOutput"] = Number.isFinite(v) ? v : 0; } catch { results["scaledOutput"] = 0; }
  try { const v = Math.round((results["scaledOutput"] ?? 0) * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["primaryResult"] = Number.isFinite(v) ? v : 0; } catch { results["primaryResult"] = 0; }
  return results;
}


export function calculateTherms_to_btu_calculator(input: Therms_to_btu_calculatorInput): Therms_to_btu_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primaryResult"] ?? 0;
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


export interface Therms_to_btu_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
