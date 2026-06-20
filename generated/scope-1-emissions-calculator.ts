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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Scope_1_emissions_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.natgas_volume * 1.95 / 1000; results["natgas_emissions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["natgas_emissions"] = Number.NaN; }
  try { const v = input.diesel_stationary * 2.68 / 1000; results["diesel_stat_emissions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["diesel_stat_emissions"] = Number.NaN; }
  try { const v = input.gasoline_mobile * 2.31 / 1000; results["gasoline_emissions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["gasoline_emissions"] = Number.NaN; }
  try { const v = input.diesel_mobile * 2.68 / 1000; results["diesel_mob_emissions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["diesel_mob_emissions"] = Number.NaN; }
  try { const v = input.lpg_volume * 3.0 / 1000; results["lpg_emissions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lpg_emissions"] = Number.NaN; }
  try { const v = input.coal_ton * 2.5; results["coal_emissions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["coal_emissions"] = Number.NaN; }
  try { const v = input.refrigerant_leak * 2.088; results["refrigerant_emissions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["refrigerant_emissions"] = Number.NaN; }
  try { const v = input.process_emissions; results["process_emissions_total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["process_emissions_total"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["natgas_emissions"])) + (toNumericFormulaValue(results["diesel_stat_emissions"])) + (toNumericFormulaValue(results["gasoline_emissions"])) + (toNumericFormulaValue(results["diesel_mob_emissions"])) + (toNumericFormulaValue(results["lpg_emissions"])) + (toNumericFormulaValue(results["coal_emissions"])) + (toNumericFormulaValue(results["refrigerant_emissions"])) + (toNumericFormulaValue(results["process_emissions_total"])); results["total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total"] = Number.NaN; }
  return results;
}


export function calculateScope_1_emissions_calculator(input: Scope_1_emissions_calculatorInput): Scope_1_emissions_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["total"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
