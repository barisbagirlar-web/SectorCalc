// Auto-generated from sleep-cycle-calculator-schema.json
import * as z from 'zod';

export interface Sleep_cycle_calculatorInput {
  wake_time: number;
  sleep_debt_hours: number;
  cycle_length_minutes: number;
  fall_asleep_minutes: number;
  recovery_efficiency: number;
  shift_worker: boolean;
}

export const Sleep_cycle_calculatorInputSchema = z.object({
  wake_time: z.number().min(0).max(24).default(7),
  sleep_debt_hours: z.number().min(0).max(24).default(2),
  cycle_length_minutes: z.number().min(60).max(120).default(90),
  fall_asleep_minutes: z.number().min(0).max(60).default(15),
  recovery_efficiency: z.number().min(0.5).max(1.5).default(1),
  shift_worker: z.boolean().default(false),
});

function evaluateAllFormulas(input: Sleep_cycle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["actual_sleep_start"] = input.wake_time - ((results["total_sleep_minutes"] ?? 0) / 60); } catch { results["actual_sleep_start"] = 0; }
  try { results["total_sleep_minutes"] = Math.max(5 * input.cycle_length_minutes, (5 * input.cycle_length_minutes) + (input.sleep_debt_hours * 60 / input.recovery_efficiency)); } catch { results["total_sleep_minutes"] = 0; }
  try { results["optimal_bedtime"] = input.wake_time - ((results["total_sleep_minutes"] ?? 0) / 60) - (input.fall_asleep_minutes / 60); } catch { results["optimal_bedtime"] = 0; }
  try { results["circadian_penalty"] = input.shift_worker ? 0.5 : 0.0; } catch { results["circadian_penalty"] = 0; }
  try { results["adjusted_sleep_debt"] = input.sleep_debt_hours + (results["circadian_penalty"] ?? 0); } catch { results["adjusted_sleep_debt"] = 0; }
  try { results["cycle_count"] = Math.floor((results["total_sleep_minutes"] ?? 0) / input.cycle_length_minutes); } catch { results["cycle_count"] = 0; }
  try { results["sleep_quality_index"] = Math.min(100, Math.max(0, ((results["cycle_count"] ?? 0) / 6) * 50 + (1 - ((results["adjusted_sleep_debt"] ?? 0) / 8)) * 30 + (input.recovery_efficiency - 0.5) * 40)); } catch { results["sleep_quality_index"] = 0; }
  return results;
}


export function calculateSleep_cycle_calculator(input: Sleep_cycle_calculatorInput): Sleep_cycle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["optimal_bedtime"] ?? 0;
  const breakdown = {
    total_sleep_minutes: values["total_sleep_minutes"] ?? 0,
    cycle_count: values["cycle_count"] ?? 0,
    adjusted_sleep_debt: values["adjusted_sleep_debt"] ?? 0,
    sleep_quality_index: values["sleep_quality_index"] ?? 0,
    actual_sleep_start: values["actual_sleep_start"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Caffeine consumed within 6h of bedtime can increase sleep onset latency by 30–60 min, not modeled here.","Blue light suppresses melatonin; can reduce recovery efficiency by up to 20%.","Undiagnosed sleep apnea can reduce recovery efficiency by 40% or more."];
  const suggestedActions: string[] = ["Maintain same wake time every day (including weekends) to stabilize circadian rhythm.","If adjusted sleep debt > 2h, add one extra sleep cycle (90 min) for 2–3 nights.","Begin wind-down 30 min before optimal bedtime: dim lights, no screens, cool room (18–20°C).","Use blackout curtains and scheduled naps (20 min) to offset circadian penalty."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis"],
  };
}


export interface Sleep_cycle_calculatorOutput {
  totalWasteCost: number;
  breakdown: { total_sleep_minutes: number; cycle_count: number; adjusted_sleep_debt: number; sleep_quality_index: number; actual_sleep_start: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
