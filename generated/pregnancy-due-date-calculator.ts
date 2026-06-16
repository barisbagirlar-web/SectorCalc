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

function evaluateAllFormulas(input: Pregnancy_due_date_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (current_timestamp - input.lmp_date) / 86400; results["lmp_gestational_age_days"] = Number.isFinite(v) ? v : 0; } catch { results["lmp_gestational_age_days"] = 0; }
  try { const v = input.cycle_length - input.luteal_phase_length; results["ovulation_offset"] = Number.isFinite(v) ? v : 0; } catch { results["ovulation_offset"] = 0; }
  try { const v = input.lmp_date + 280 * 86400 + (input.cycle_length - 28) * 86400; results["edd_lmp"] = Number.isFinite(v) ? v : 0; } catch { results["edd_lmp"] = 0; }
  try { const v = current_timestamp + (40 - input.ultrasound_ga_weeks) * 7 * 86400 - input.ultrasound_ga_days * 86400; results["edd_ultrasound"] = Number.isFinite(v) ? v : 0; } catch { results["edd_ultrasound"] = 0; }
  try { const v = (input.ultrasound_ga_weeks != null) ? (results["edd_ultrasound"] ?? 0) : (results["edd_lmp"] ?? 0); results["edd_primary"] = Number.isFinite(v) ? v : 0; } catch { results["edd_primary"] = 0; }
  try { const v = 40 * 7; results["gestational_age_at_edd"] = Number.isFinite(v) ? v : 0; } catch { results["gestational_age_at_edd"] = 0; }
  try { const v = 1.96 * input.cycle_variability * Math.sqrt(280 / input.cycle_length); results["confidence_interval_days"] = Number.isFinite(v) ? v : 0; } catch { results["confidence_interval_days"] = 0; }
  return results;
}


export function calculatePregnancy_due_date_calculator(input: Pregnancy_due_date_calculatorInput): Pregnancy_due_date_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["edd"] ?? 0;
  const breakdown = {
    edd_lmp: values["edd_lmp"] ?? 0,
    edd_ultrasound: values["edd_ultrasound"] ?? 0,
    gestational_age_days: values["gestational_age_days"] ?? 0,
    ovulation_offset: values["ovulation_offset"] ?? 0,
    confidence_interval_days: values["confidence_interval_days"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Cycle Variability Impact","Luteal Phase Variation","Ultrasound Timing Error"];
  const suggestedActions: string[] = ["Schedule ultrasound for dating confirmation","Initiate high-risk pregnancy monitoring protocol","Reconcile LMP and ultrasound dates if discrepancy > 2 weeks","Encourage cycle tracking for future cycle variability reduction"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Cycle history dashboard","Automated alerts"],
  };
}


export interface Pregnancy_due_date_calculatorOutput {
  totalWasteCost: number;
  breakdown: { edd_lmp: number; edd_ultrasound: number; gestational_age_days: number; ovulation_offset: number; confidence_interval_days: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
