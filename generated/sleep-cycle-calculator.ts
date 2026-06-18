// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sleep_cycle_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.wake_time * input.sleep_debt_hours * input.cycle_length_minutes * input.fall_asleep_minutes; results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.wake_time * input.sleep_debt_hours * input.cycle_length_minutes * input.fall_asleep_minutes * ((input.recovery_efficiency / 100)); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = (input.recovery_efficiency / 100); results["adjustment_factor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSleep_cycle_calculator(input: Sleep_cycle_calculatorInput): Sleep_cycle_calculatorOutput {
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


export interface Sleep_cycle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
