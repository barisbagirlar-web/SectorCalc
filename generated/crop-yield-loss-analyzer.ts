// Auto-generated from crop-yield-loss-analyzer-schema.json
import * as z from 'zod';

export interface Crop_yield_loss_analyzerInput {
  expected_yield: number;
  actual_yield: number;
  harvest_loss_pct: number;
  post_harvest_loss_pct: number;
  field_condition: string;
  irrigation_type: string;
  pest_pressure: number;
  disease_index: number;
  weed_cover_pct: number;
  soil_quality_score: number;
  labor_efficiency: number;
  equipment_reliability: number;
}

export const Crop_yield_loss_analyzerInputSchema = z.object({
  expected_yield: z.number().min(0).max(20000).default(8000),
  actual_yield: z.number().min(0).max(20000).default(6500),
  harvest_loss_pct: z.number().min(0).max(30).default(5),
  post_harvest_loss_pct: z.number().min(0).max(20).default(3),
  field_condition: z.enum(['excellent', 'good', 'fair', 'poor']).default('good'),
  irrigation_type: z.enum(['drip', 'sprinkler', 'flood', 'rainfed']).default('drip'),
  pest_pressure: z.number().min(0).max(10).default(3),
  disease_index: z.number().min(0).max(10).default(2),
  weed_cover_pct: z.number().min(0).max(100).default(5),
  soil_quality_score: z.number().min(0).max(100).default(75),
  labor_efficiency: z.number().min(0).max(100).default(80),
  equipment_reliability: z.number().min(0).max(100).default(85),
});

function evaluateAllFormulas(input: Crop_yield_loss_analyzerInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["gross_loss"] = input.expected_yield - input.actual_yield; } catch { results["gross_loss"] = 0; }
  try { results["harvest_loss_kg"] = input.actual_yield * (input.harvest_loss_pct / 100); } catch { results["harvest_loss_kg"] = 0; }
  try { results["post_harvest_loss_kg"] = input.actual_yield * (input.post_harvest_loss_pct / 100); } catch { results["post_harvest_loss_kg"] = 0; }
  try { results["field_condition_factor"] = (input.field_condition === 'excellent' ? 0.95 : (input.field_condition === 'good' ? 1.00 : (input.field_condition === 'fair' ? 1.10 : (input.field_condition === 'poor' ? 1.25 : 0)))); } catch { results["field_condition_factor"] = 0; }
  try { results["irrigation_efficiency_factor"] = (input.irrigation_type === 'drip' ? 0.90 : (input.irrigation_type === 'sprinkler' ? 1.00 : (input.irrigation_type === 'flood' ? 1.15 : (input.irrigation_type === 'rainfed' ? 1.20 : 0)))); } catch { results["irrigation_efficiency_factor"] = 0; }
  try { results["biotic_loss_index"] = (input.pest_pressure * 0.4 + input.disease_index * 0.4 + (input.weed_cover_pct / 10) * 0.2) / 10; } catch { results["biotic_loss_index"] = 0; }
  try { results["operational_efficiency_score"] = (input.labor_efficiency * 0.5 + input.equipment_reliability * 0.5) / 100; } catch { results["operational_efficiency_score"] = 0; }
  try { results["total_yield_loss_pct"] = (((results["gross_loss"] ?? 0) / input.expected_yield) * 100) * (results["field_condition_factor"] ?? 0) * (results["irrigation_efficiency_factor"] ?? 0) * (1 + (results["biotic_loss_index"] ?? 0)) * (1 + (1 - (results["operational_efficiency_score"] ?? 0))); } catch { results["total_yield_loss_pct"] = 0; }
  return results;
}


export function calculateCrop_yield_loss_analyzer(input: Crop_yield_loss_analyzerInput): Crop_yield_loss_analyzerOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_yield_loss_pct"] ?? 0;
  const breakdown = {
    gross_loss_kg: values["gross_loss_kg"] ?? 0,
    harvest_loss_kg: values["harvest_loss_kg"] ?? 0,
    post_harvest_loss_kg: values["post_harvest_loss_kg"] ?? 0,
    biotic_loss_index: values["biotic_loss_index"] ?? 0,
    operational_efficiency_score: values["operational_efficiency_score"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Microclimate Variation","Nutrient Imbalance","Timing Delays","Genetic Variability"];
  const suggestedActions: string[] = ["Optimize Harvest Settings","Implement Integrated Pest Management","Soil Health Improvement","Irrigation System Audit","Operator Training","Preventive Maintenance Schedule"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-field comparison","Custom threshold configuration"],
  };
}


export interface Crop_yield_loss_analyzerOutput {
  totalWasteCost: number;
  breakdown: { gross_loss_kg: number; harvest_loss_kg: number; post_harvest_loss_kg: number; biotic_loss_index: number; operational_efficiency_score: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
