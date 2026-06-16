// Auto-generated from spc-signal-delay-cost-calculator-schema.json
import * as z from 'zod';

export interface Spc_signal_delay_cost_calculatorInput {
  process_cycle_time_min: number;
  units_per_cycle: number;
  defect_rate_out_of_control: number;
  defect_rate_in_control: number;
  cost_per_defect: number;
  detection_delay_hours: number;
  response_delay_hours: number;
  shift_hours: number;
  shifts_per_day: number;
  operating_days_per_year: number;
  signal_frequency_per_year: number;
  cost_of_correction_per_event: number;
  include_hidden_losses: boolean;
  hidden_loss_multiplier: number;
}

export const Spc_signal_delay_cost_calculatorInputSchema = z.object({
  process_cycle_time_min: z.number().min(1).max(1440).default(60),
  units_per_cycle: z.number().min(1).max(100000).default(100),
  defect_rate_out_of_control: z.number().min(0.1).max(100).default(5),
  defect_rate_in_control: z.number().min(0).max(100).default(0.5),
  cost_per_defect: z.number().min(0.01).max(100000).default(50),
  detection_delay_hours: z.number().min(0).max(720).default(4),
  response_delay_hours: z.number().min(0).max(720).default(2),
  shift_hours: z.number().min(1).max(24).default(8),
  shifts_per_day: z.number().min(1).max(3).default(3),
  operating_days_per_year: z.number().min(1).max(365).default(250),
  signal_frequency_per_year: z.number().min(0).max(1000).default(12),
  cost_of_correction_per_event: z.number().min(0).max(100000).default(500),
  include_hidden_losses: z.boolean().default(true),
  hidden_loss_multiplier: z.number().min(1).max(10).default(1.5),
});

function evaluateAllFormulas(input: Spc_signal_delay_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.units_per_cycle / (input.process_cycle_time_min / 60); results["units_produced_per_hour"] = Number.isFinite(v) ? v : 0; } catch { results["units_produced_per_hour"] = 0; }
  try { const v = input.detection_delay_hours + input.response_delay_hours; results["total_delay_hours"] = Number.isFinite(v) ? v : 0; } catch { results["total_delay_hours"] = 0; }
  try { const v = (results["units_produced_per_hour"] ?? 0) * (results["total_delay_hours"] ?? 0) * (input.defect_rate_out_of_control / 100); results["defective_units_during_delay"] = Number.isFinite(v) ? v : 0; } catch { results["defective_units_during_delay"] = 0; }
  try { const v = (results["defective_units_during_delay"] ?? 0) * input.cost_per_defect; results["direct_defect_cost_per_event"] = Number.isFinite(v) ? v : 0; } catch { results["direct_defect_cost_per_event"] = 0; }
  try { const v = input.include_hidden_losses ? (results["direct_defect_cost_per_event"] ?? 0) * (input.hidden_loss_multiplier - 1) : 0; results["hidden_loss_cost_per_event"] = Number.isFinite(v) ? v : 0; } catch { results["hidden_loss_cost_per_event"] = 0; }
  try { const v = (results["direct_defect_cost_per_event"] ?? 0) + (results["hidden_loss_cost_per_event"] ?? 0) + input.cost_of_correction_per_event; results["total_delay_cost_per_event"] = Number.isFinite(v) ? v : 0; } catch { results["total_delay_cost_per_event"] = 0; }
  try { const v = (results["total_delay_cost_per_event"] ?? 0) * input.signal_frequency_per_year; results["annual_delay_cost"] = Number.isFinite(v) ? v : 0; } catch { results["annual_delay_cost"] = 0; }
  return results;
}


export function calculateSpc_signal_delay_cost_calculator(input: Spc_signal_delay_cost_calculatorInput): Spc_signal_delay_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["annual_delay_cost"] ?? 0;
  const breakdown = {
    direct_defect_cost_per_event: values["direct_defect_cost_per_event"] ?? 0,
    hidden_loss_cost_per_event: values["hidden_loss_cost_per_event"] ?? 0,
    cost_of_correction_per_event: values["cost_of_correction_per_event"] ?? 0,
    total_delay_cost_per_event: values["total_delay_cost_per_event"] ?? 0,
    defective_units_during_delay: values["defective_units_during_delay"] ?? 0,
    annual_signal_events: values["annual_signal_events"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Detection Delay","Response Delay","Defect Rate Spread","Production Rate"];
  const suggestedActions: string[] = ["Reduce Detection Delay","Improve Response Time","Enhance Process Capability","Automate Correction"];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Real-time dashboard","Multi-plant comparison"],
  };
}


export interface Spc_signal_delay_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: { direct_defect_cost_per_event: number; hidden_loss_cost_per_event: number; cost_of_correction_per_event: number; total_delay_cost_per_event: number; defective_units_during_delay: number; annual_signal_events: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
