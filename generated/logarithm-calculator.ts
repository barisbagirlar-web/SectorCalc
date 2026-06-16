// Auto-generated from logarithm-calculator-schema.json
import * as z from 'zod';

export interface Logarithm_calculatorInput {
  value_x: number;
  base: string;
  unit_type: string;
  reference_value: number;
  enable_threshold_alerts: boolean;
}

export const Logarithm_calculatorInputSchema = z.object({
  value_x: z.number().min(0.0001).max(1000000).default(100),
  base: z.enum(['2', 'e', '10']).default('10'),
  unit_type: z.enum(['dimensionless', 'power_ratio', 'amplitude_ratio']).default('dimensionless'),
  reference_value: z.number().min(0.0001).max(1000000).default(1),
  enable_threshold_alerts: z.boolean().default(true),
});

function evaluateAllFormulas(input: Logarithm_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["log_raw"] = 0;
  results["log_ratio"] = 0;
  try { const v = 10 * Math.log10(input.value_x / input.reference_value); results["decibel_power"] = Number.isFinite(v) ? v : 0; } catch { results["decibel_power"] = 0; }
  try { const v = 20 * Math.log10(input.value_x / input.reference_value); results["decibel_amplitude"] = Number.isFinite(v) ? v : 0; } catch { results["decibel_amplitude"] = 0; }
  try { const v = - (input.value_x / (input.value_x + input.reference_value)) * log2(input.value_x / (input.value_x + input.reference_value)); results["log_entropy_contribution"] = Number.isFinite(v) ? v : 0; } catch { results["log_entropy_contribution"] = 0; }
  try { const v = Math.log(input.value_x / input.reference_value); results["log_growth_rate"] = Number.isFinite(v) ? v : 0; } catch { results["log_growth_rate"] = 0; }
  results["primary_result"] = 0;
  return results;
}


export function calculateLogarithm_calculator(input: Logarithm_calculatorInput): Logarithm_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primaryResult"] ?? values["primary_result"] ?? 0;
  const breakdown = {
    id: values["id"] ?? 0,
    label: values["label"] ?? 0,
    description: values["description"] ?? 0,
    properties: values["properties"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Numerical Precision Loss","Base Mismatch in Decibel Context","Reference Value Drift"];
  const suggestedActions: string[] = ["Scale Inputs to Moderate Range","Verify Unit Type Selection","Use Base 10 for Decibel Calculations","Perform Entropy Analysis for Process Variation"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-variable scenario simulation","Automated report generation"],
  };
}


export interface Logarithm_calculatorOutput {
  totalWasteCost: number;
  breakdown: { id: number; label: number; description: number; properties: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
