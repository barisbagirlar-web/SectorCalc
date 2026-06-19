// Auto-generated from wps-preheat-temperature-calculator-schema.json
import * as z from 'zod';

export interface Wps_preheat_temperature_calculatorInput {
  material_thickness: number;
  carbon_equivalent: number;
  hydrogen_level: string;
  heat_input: number;
  joint_restraint: string;
  preheat_method: string;
  dataConfidence?: number;
}

export const Wps_preheat_temperature_calculatorInputSchema = z.object({
  material_thickness: z.number().min(1).max(300).default(25),
  carbon_equivalent: z.number().min(0.1).max(1.2).default(0.45),
  hydrogen_level: z.enum(['low', 'medium', 'high']).default('medium'),
  heat_input: z.number().min(0.5).max(5).default(1.5),
  joint_restraint: z.enum(['low', 'moderate', 'high']).default('moderate'),
  preheat_method: z.enum(['electric', 'gas', 'induction']).default('electric'),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Wps_preheat_temperature_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.material_thickness * (input.carbon_equivalent / 100) * input.heat_input; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.material_thickness * (input.carbon_equivalent / 100) * input.heat_input; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWps_preheat_temperature_calculator(input: Wps_preheat_temperature_calculatorInput): Wps_preheat_temperature_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-user collaboration","Custom material database"],
  };
}


export interface Wps_preheat_temperature_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
