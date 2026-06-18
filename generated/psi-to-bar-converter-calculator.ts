// @ts-nocheck
// Auto-generated from psi-to-bar-converter-calculator-schema.json
import * as z from 'zod';

export interface Psi_to_bar_converter_calculatorInput {
  pressure_psi: number;
  temperature_celsius: number;
  altitude_meters: number;
  fluid_type: string;
  include_temperature_correction: boolean;
  include_altitude_correction: boolean;
}

export const Psi_to_bar_converter_calculatorInputSchema = z.object({
  pressure_psi: z.number().min(0).max(100000).default(0),
  temperature_celsius: z.number().min(-40).max(200).default(20),
  altitude_meters: z.number().min(-500).max(10000).default(0),
  fluid_type: z.enum(['water', 'oil', 'gas', 'steam']).default('water'),
  include_temperature_correction: z.boolean().default(true),
  include_altitude_correction: z.boolean().default(false),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Psi_to_bar_converter_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.pressure_psi * input.temperature_celsius * input.altitude_meters; results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.pressure_psi * input.temperature_celsius * input.altitude_meters; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePsi_to_bar_converter_calculator(input: Psi_to_bar_converter_calculatorInput): Psi_to_bar_converter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis"],
  };
}


export interface Psi_to_bar_converter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
