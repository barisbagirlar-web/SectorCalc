// Auto-generated from stere-to-cubic-meters-calculator-schema.json
import * as z from 'zod';

export interface Stere_to_cubic_meters_calculatorInput {
  quantity: number;
  conversionFactor: number;
  stackingFactor: number;
  pricePerStere: number;
  pricePerCubicMeter: number;
  roundingPrecision: number;
}

export const Stere_to_cubic_meters_calculatorInputSchema = z.object({
  quantity: z.number().default(1),
  conversionFactor: z.number().default(1),
  stackingFactor: z.number().default(1),
  pricePerStere: z.number().default(0),
  pricePerCubicMeter: z.number().default(0),
  roundingPrecision: z.number().default(2),
});

function evaluateAllFormulas(input: Stere_to_cubic_meters_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.quantity * input.conversionFactor * input.stackingFactor; results["rawVolume"] = Number.isFinite(v) ? v : 0; } catch { results["rawVolume"] = 0; }
  try { const v = Math.round(input.quantity * input.conversionFactor * input.stackingFactor * Math.pow(10, input.roundingPrecision)) / Math.pow(10, input.roundingPrecision); results["convertedVolume"] = Number.isFinite(v) ? v : 0; } catch { results["convertedVolume"] = 0; }
  try { const v = input.pricePerStere * input.quantity; results["totalCostStere"] = Number.isFinite(v) ? v : 0; } catch { results["totalCostStere"] = 0; }
  try { const v = input.pricePerCubicMeter * input.quantity * input.conversionFactor * input.stackingFactor; results["totalCostCubicMeter"] = Number.isFinite(v) ? v : 0; } catch { results["totalCostCubicMeter"] = 0; }
  return results;
}


export function calculateStere_to_cubic_meters_calculator(input: Stere_to_cubic_meters_calculatorInput): Stere_to_cubic_meters_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["convertedVolume"] ?? 0;
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


export interface Stere_to_cubic_meters_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
