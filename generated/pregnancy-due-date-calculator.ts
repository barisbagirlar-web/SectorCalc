// Auto-generated from pregnancy-due-date-calculator-schema.json
import * as z from 'zod';

export interface Pregnancy_due_date_calculatorInput {
  lmp_date: number;
  cycle_length: number;
  luteal_phase_length: number;
  ultrasound_ga_weeks: number;
  ultrasound_ga_days: number;
  cycle_variability: number;
  parity: number;
  risk_factors: string;
  dataConfidence?: number;
}

export const Pregnancy_due_date_calculatorInputSchema = z.object({
  lmp_date: z.number().min(946684800).max(1893456000),
  cycle_length: z.number().min(21).max(45).default(28),
  luteal_phase_length: z.number().min(10).max(17).default(14),
  ultrasound_ga_weeks: z.number().min(5).max(42),
  ultrasound_ga_days: z.number().min(0).max(6).default(0),
  cycle_variability: z.number().min(0).max(10).default(2),
  parity: z.number().min(0).max(10).default(0),
  risk_factors: z.enum(['none', 'hypertension', 'diabetes', 'multiple_gestation', 'previous_preterm', 'other']).default('none'),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pregnancy_due_date_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.lmp_date * input.cycle_length * input.luteal_phase_length * input.ultrasound_ga_weeks; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.lmp_date * input.cycle_length * input.luteal_phase_length * input.ultrasound_ga_weeks * (input.ultrasound_ga_days * input.cycle_variability * input.parity); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.ultrasound_ga_days * input.cycle_variability * input.parity; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculatePregnancy_due_date_calculator(input: Pregnancy_due_date_calculatorInput): Pregnancy_due_date_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Cycle history dashboard","Automated alerts"],
  };
}


export interface Pregnancy_due_date_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
