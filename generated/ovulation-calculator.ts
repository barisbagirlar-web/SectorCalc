// Auto-generated from ovulation-calculator-schema.json
import * as z from 'zod';

export interface Ovulation_calculatorInput {
  cycle_length: number;
  luteal_phase_length: number;
  last_period_start: number;
  cycle_variability: number;
  age_group: string;
  has_irregular_cycles: boolean;
  dataConfidence?: number;
}

export const Ovulation_calculatorInputSchema = z.object({
  cycle_length: z.number().min(20).max(45).default(28),
  luteal_phase_length: z.number().min(10).max(16).default(14),
  last_period_start: z.number().min(0).max(2000000000).default(0),
  cycle_variability: z.number().min(0).max(10).default(2),
  age_group: z.enum(['<20', '20-30', '31-40', '>40']).default('20-30'),
  has_irregular_cycles: z.boolean().default(false),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ovulation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cycle_length * input.luteal_phase_length * input.last_period_start * input.cycle_variability; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.cycle_length * input.luteal_phase_length * input.last_period_start * input.cycle_variability; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateOvulation_calculator(input: Ovulation_calculatorInput): Ovulation_calculatorOutput {
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
    premiumRequired: false,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Cycle variability control chart","Multi-cycle overlay"],
  };
}


export interface Ovulation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
