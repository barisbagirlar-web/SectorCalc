// Auto-generated from inhg-to-psi-calculator-schema.json
import * as z from 'zod';

export interface Inhg_to_psi_calculatorInput {
  pressure_inhg: number;
  conversion_factor: number;
  decimal_places: number;
  altitude_ft: number;
  temperature_f: number;
  dataConfidence?: number;
}

export const Inhg_to_psi_calculatorInputSchema = z.object({
  pressure_inhg: z.number().default(29.92),
  conversion_factor: z.number().default(0.491154),
  decimal_places: z.number().default(4),
  altitude_ft: z.number().default(0),
  temperature_f: z.number().default(32),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Inhg_to_psi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.pressure_inhg) * (input.conversion_factor) * (input.decimal_places) * (input.altitude_ft) * (input.temperature_f); results["pressure_psi_raw"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pressure_psi_raw"] = Number.NaN; }
  try { const v = (input.pressure_inhg) * (input.conversion_factor) * (input.decimal_places); results["pressure_psi_raw_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pressure_psi_raw_aux"] = Number.NaN; }
  return results;
}


export function calculateInhg_to_psi_calculator(input: Inhg_to_psi_calculatorInput): Inhg_to_psi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["pressure_psi_raw_aux"]);
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


export interface Inhg_to_psi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
