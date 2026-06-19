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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Scope_1_emissions_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.natgas_volume * 1.95 / 1000; results["natgas_emissions"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["natgas_emissions"] = 0; }
  try { const v = input.diesel_stationary * 2.68 / 1000; results["diesel_stat_emissions"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["diesel_stat_emissions"] = 0; }
  try { const v = input.gasoline_mobile * 2.31 / 1000; results["gasoline_emissions"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["gasoline_emissions"] = 0; }
  try { const v = input.diesel_mobile * 2.68 / 1000; results["diesel_mob_emissions"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["diesel_mob_emissions"] = 0; }
  try { const v = input.lpg_volume * 3.0 / 1000; results["lpg_emissions"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["lpg_emissions"] = 0; }
  try { const v = input.coal_ton * 2.5; results["coal_emissions"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["coal_emissions"] = 0; }
  try { const v = input.refrigerant_leak * 2.088; results["refrigerant_emissions"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["refrigerant_emissions"] = 0; }
  try { const v = input.process_emissions; results["process_emissions_total"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["process_emissions_total"] = 0; }
  try { const v = (asFormulaNumber(results["natgas_emissions"])) + (asFormulaNumber(results["diesel_stat_emissions"])) + (asFormulaNumber(results["gasoline_emissions"])) + (asFormulaNumber(results["diesel_mob_emissions"])) + (asFormulaNumber(results["lpg_emissions"])) + (asFormulaNumber(results["coal_emissions"])) + (asFormulaNumber(results["refrigerant_emissions"])) + (asFormulaNumber(results["process_emissions_total"])); results["total"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateScope_1_emissions_calculator(input: Scope_1_emissions_calculatorInput): Scope_1_emissions_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["total"]));
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


export interface Scope_1_emissions_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
