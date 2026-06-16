// Auto-generated from ovulation-calculator-schema.json
import * as z from 'zod';

export interface Ovulation_calculatorInput {
  cycle_length: number;
  luteal_phase_length: number;
  last_period_start: number;
  cycle_variability: number;
  age_group: string;
  has_irregular_cycles: boolean;
}

export const Ovulation_calculatorInputSchema = z.object({
  cycle_length: z.number().min(20).max(45).default(28),
  luteal_phase_length: z.number().min(10).max(16).default(14),
  last_period_start: z.number().min(0).max(2000000000).default(0),
  cycle_variability: z.number().min(0).max(10).default(2),
  age_group: z.enum(['<20', '20-30', '31-40', '>40']).default('20-30'),
  has_irregular_cycles: z.boolean().default(false),
});

function evaluateAllFormulas(input: Ovulation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cycle_length - input.luteal_phase_length; results["estimated_ovulation_date"] = Number.isFinite(v) ? v : 0; } catch { results["estimated_ovulation_date"] = 0; }
  try { const v = (results["estimated_ovulation_date"] ?? 0) - 5; results["fertile_window_start"] = Number.isFinite(v) ? v : 0; } catch { results["fertile_window_start"] = 0; }
  try { const v = (results["estimated_ovulation_date"] ?? 0) + 1; results["fertile_window_end"] = Number.isFinite(v) ? v : 0; } catch { results["fertile_window_end"] = 0; }
  try { const v = 1.96 * input.cycle_variability; results["cycle_confidence_interval"] = Number.isFinite(v) ? v : 0; } catch { results["cycle_confidence_interval"] = 0; }
  try { const v = (results["fertile_window_start"] ?? 0) - (results["cycle_confidence_interval"] ?? 0); results["adjusted_fertile_window_start"] = Number.isFinite(v) ? v : 0; } catch { results["adjusted_fertile_window_start"] = 0; }
  try { const v = (results["fertile_window_end"] ?? 0) + (results["cycle_confidence_interval"] ?? 0); results["adjusted_fertile_window_end"] = Number.isFinite(v) ? v : 0; } catch { results["adjusted_fertile_window_end"] = 0; }
  try { const v = Math.max(0, 100 - (input.cycle_variability * 10) - (input.has_irregular_cycles ? 30 : 0)); results["data_confidence_score"] = Number.isFinite(v) ? v : 0; } catch { results["data_confidence_score"] = 0; }
  return results;
}


export function calculateOvulation_calculator(input: Ovulation_calculatorInput): Ovulation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["ovulation_date_absolute"] ?? 0;
  const breakdown = {
    estimated_ovulation_date: values["estimated_ovulation_date"] ?? 0,
    fertile_window_start: values["fertile_window_start"] ?? 0,
    fertile_window_end: values["fertile_window_end"] ?? 0,
    adjusted_fertile_window_start: values["adjusted_fertile_window_start"] ?? 0,
    adjusted_fertile_window_end: values["adjusted_fertile_window_end"] ?? 0,
    cycle_confidence_interval: values["cycle_confidence_interval"] ?? 0,
    data_confidence_score: values["data_confidence_score"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Cycle variability > 5 days","Irregular cycles flag active","Age > 40 with short luteal phase"];
  const suggestedActions: string[] = ["Track basal body temperature (BBT)","Use ovulation predictor kits (OPK)","Consult healthcare provider","Maintain detailed cycle log for 3+ months"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Cycle variability control chart","Multi-cycle overlay"],
  };
}


export interface Ovulation_calculatorOutput {
  totalWasteCost: number;
  breakdown: { estimated_ovulation_date: number; fertile_window_start: number; fertile_window_end: number; adjusted_fertile_window_start: number; adjusted_fertile_window_end: number; cycle_confidence_interval: number; data_confidence_score: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
