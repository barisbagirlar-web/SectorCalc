// Auto-generated from scope-2-emissions-calculator-schema.json
import * as z from 'zod';

export interface Scope_2_emissions_calculatorInput {
  electricityKwh: number;
  locationFactor: number;
  marketFactor: number;
  heatMwh: number;
  heatFactor: number;
}

export const Scope_2_emissions_calculatorInputSchema = z.object({
  electricityKwh: z.number().default(0),
  locationFactor: z.number().default(0.5),
  marketFactor: z.number().default(0.4),
  heatMwh: z.number().default(0),
  heatFactor: z.number().default(200),
});

function evaluateAllFormulas(input: Scope_2_emissions_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.electricityKwh * input.locationFactor + input.heatMwh * input.heatFactor; results["totalLocationBased"] = Number.isFinite(v) ? v : 0; } catch { results["totalLocationBased"] = 0; }
  try { const v = input.electricityKwh * input.marketFactor + input.heatMwh * input.heatFactor; results["totalMarketBased"] = Number.isFinite(v) ? v : 0; } catch { results["totalMarketBased"] = 0; }
  try { const v = input.electricityKwh * input.locationFactor; results["electricityLocationBased"] = Number.isFinite(v) ? v : 0; } catch { results["electricityLocationBased"] = 0; }
  try { const v = input.electricityKwh * input.marketFactor; results["electricityMarketBased"] = Number.isFinite(v) ? v : 0; } catch { results["electricityMarketBased"] = 0; }
  try { const v = input.heatMwh * input.heatFactor; results["heatEmissions"] = Number.isFinite(v) ? v : 0; } catch { results["heatEmissions"] = 0; }
  return results;
}


export function calculateScope_2_emissions_calculator(input: Scope_2_emissions_calculatorInput): Scope_2_emissions_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalLocationBased"] ?? 0;
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


export interface Scope_2_emissions_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
