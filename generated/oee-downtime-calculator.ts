// Auto-generated from oee-downtime-calculator-schema.json
import * as z from 'zod';

export interface Oee_downtime_calculatorInput {
  planned_production_time: number;
  downtime_minutes: number;
  ideal_cycle_time: number;
  total_parts_produced: number;
  defective_parts: number;
  shift_type: string;
  include_micro_stops: boolean;
}

export const Oee_downtime_calculatorInputSchema = z.object({
  planned_production_time: z.number().min(0).max(1440).default(480),
  downtime_minutes: z.number().min(0).max(1440).default(60),
  ideal_cycle_time: z.number().min(0.001).max(100).default(0.5),
  total_parts_produced: z.number().min(0).max(100000).default(800),
  defective_parts: z.number().min(0).max(100000).default(20),
  shift_type: z.enum(['day', 'night', 'rotating']).default('day'),
  include_micro_stops: z.boolean().default(true),
});

function evaluateAllFormulas(input: Oee_downtime_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.planned_production_time - input.downtime_minutes; results["operating_time"] = Number.isFinite(v) ? v : 0; } catch { results["operating_time"] = 0; }
  try { const v = (results["operating_time"] ?? 0) / input.planned_production_time; results["availability"] = Number.isFinite(v) ? v : 0; } catch { results["availability"] = 0; }
  try { const v = input.total_parts_produced * input.ideal_cycle_time; results["net_operating_time"] = Number.isFinite(v) ? v : 0; } catch { results["net_operating_time"] = 0; }
  try { const v = (results["net_operating_time"] ?? 0) / (results["operating_time"] ?? 0); results["performance"] = Number.isFinite(v) ? v : 0; } catch { results["performance"] = 0; }
  try { const v = input.total_parts_produced - input.defective_parts; results["good_parts"] = Number.isFinite(v) ? v : 0; } catch { results["good_parts"] = 0; }
  try { const v = (results["good_parts"] ?? 0) / input.total_parts_produced; results["quality"] = Number.isFinite(v) ? v : 0; } catch { results["quality"] = 0; }
  try { const v = (results["availability"] ?? 0) * (results["performance"] ?? 0) * (results["quality"] ?? 0); results["oee"] = Number.isFinite(v) ? v : 0; } catch { results["oee"] = 0; }
  return results;
}


export function calculateOee_downtime_calculator(input: Oee_downtime_calculatorInput): Oee_downtime_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["oee"] ?? 0;
  const breakdown = {
    availability: values["availability"] ?? 0,
    performance: values["performance"] ?? 0,
    quality: values["quality"] ?? 0,
    operating_time: values["operating_time"] ?? 0,
    net_operating_time: values["net_operating_time"] ?? 0,
    good_parts: values["good_parts"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Speed Loss","Downtime Loss","Quality Loss"];
  const suggestedActions: string[] = ["Implement Total Productive Maintenance (TPM) and SMED to reduce setup and breakdown times.","Analyze cycle time variances, reduce micro-stops, and standardize operator methods.","Apply Six Sigma DMAIC to identify root causes of defects and implement poka-yoke (mistake-proofing).","Conduct a full OEE improvement kaizen event focusing on all three loss categories."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Real-time dashboard","Multi-plant comparison","Historical data storage"],
  };
}


export interface Oee_downtime_calculatorOutput {
  totalWasteCost: number;
  breakdown: { availability: number; performance: number; quality: number; operating_time: number; net_operating_time: number; good_parts: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
