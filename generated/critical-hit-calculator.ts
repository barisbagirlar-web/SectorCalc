// Auto-generated from critical-hit-calculator-schema.json
import * as z from 'zod';

export interface Critical_hit_calculatorInput {
  base_critical_rate: number;
  critical_modifier: number;
  crit_damage_multiplier: number;
  number_of_attacks: number;
  dataConfidence?: number;
}

export const Critical_hit_calculatorInputSchema = z.object({
  base_critical_rate: z.number().default(5),
  critical_modifier: z.number().default(0),
  crit_damage_multiplier: z.number().default(1.5),
  number_of_attacks: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Critical_hit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.base_critical_rate / 100) * (input.critical_modifier / 100) * input.crit_damage_multiplier * input.number_of_attacks; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = (input.base_critical_rate / 100) * (input.critical_modifier / 100) * input.crit_damage_multiplier * input.number_of_attacks; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCritical_hit_calculator(input: Critical_hit_calculatorInput): Critical_hit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Critical_hit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
