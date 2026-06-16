// Auto-generated from scope-1-emissions-calculator-schema.json
import * as z from 'zod';

export interface Scope_1_emissions_calculatorInput {
  natgas_volume: number;
  diesel_stationary: number;
  gasoline_mobile: number;
  diesel_mobile: number;
  lpg_volume: number;
  coal_ton: number;
  refrigerant_leak: number;
  process_emissions: number;
}

export const Scope_1_emissions_calculatorInputSchema = z.object({
  natgas_volume: z.number().default(0),
  diesel_stationary: z.number().default(0),
  gasoline_mobile: z.number().default(0),
  diesel_mobile: z.number().default(0),
  lpg_volume: z.number().default(0),
  coal_ton: z.number().default(0),
  refrigerant_leak: z.number().default(0),
  process_emissions: z.number().default(0),
});

function evaluateAllFormulas(input: Scope_1_emissions_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.natgas_volume * 1.95 / 1000; results["natgas_emissions"] = Number.isFinite(v) ? v : 0; } catch { results["natgas_emissions"] = 0; }
  try { const v = input.diesel_stationary * 2.68 / 1000; results["diesel_stat_emissions"] = Number.isFinite(v) ? v : 0; } catch { results["diesel_stat_emissions"] = 0; }
  try { const v = input.gasoline_mobile * 2.31 / 1000; results["gasoline_emissions"] = Number.isFinite(v) ? v : 0; } catch { results["gasoline_emissions"] = 0; }
  try { const v = input.diesel_mobile * 2.68 / 1000; results["diesel_mob_emissions"] = Number.isFinite(v) ? v : 0; } catch { results["diesel_mob_emissions"] = 0; }
  try { const v = input.lpg_volume * 3.0 / 1000; results["lpg_emissions"] = Number.isFinite(v) ? v : 0; } catch { results["lpg_emissions"] = 0; }
  try { const v = input.coal_ton * 2.5; results["coal_emissions"] = Number.isFinite(v) ? v : 0; } catch { results["coal_emissions"] = 0; }
  try { const v = input.refrigerant_leak * 2.088; results["refrigerant_emissions"] = Number.isFinite(v) ? v : 0; } catch { results["refrigerant_emissions"] = 0; }
  try { const v = input.process_emissions; results["process_emissions_total"] = Number.isFinite(v) ? v : 0; } catch { results["process_emissions_total"] = 0; }
  try { const v = (results["natgas_emissions"] ?? 0) + (results["diesel_stat_emissions"] ?? 0) + (results["gasoline_emissions"] ?? 0) + (results["diesel_mob_emissions"] ?? 0) + (results["lpg_emissions"] ?? 0) + (results["coal_emissions"] ?? 0) + (results["refrigerant_emissions"] ?? 0) + (results["process_emissions_total"] ?? 0); results["total"] = Number.isFinite(v) ? v : 0; } catch { results["total"] = 0; }
  return results;
}


export function calculateScope_1_emissions_calculator(input: Scope_1_emissions_calculatorInput): Scope_1_emissions_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total"] ?? 0;
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


export interface Scope_1_emissions_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
