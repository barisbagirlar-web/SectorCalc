// Auto-generated from feed-cost-estimator-schema.json
import * as z from 'zod';

export interface Feed_cost_estimatorInput {
  feed_intake_kg: number;
  raw_material_cost_per_kg: number;
  processing_loss_percent: number;
  moisture_adjustment_factor: number;
  quality_grade: string;
  include_transport_cost: boolean;
}

export const Feed_cost_estimatorInputSchema = z.object({
  feed_intake_kg: z.number().min(0.1).max(50).default(10),
  raw_material_cost_per_kg: z.number().min(0.01).max(5).default(0.35),
  processing_loss_percent: z.number().min(0).max(15).default(3),
  moisture_adjustment_factor: z.number().min(0.85).max(1.15).default(1),
  quality_grade: z.enum(['premium', 'standard', 'economy']).default('standard'),
  include_transport_cost: z.boolean().default(false),
});

function evaluateAllFormulas(input: Feed_cost_estimatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["effective_raw_material_cost"] = input.raw_material_cost_per_kg * input.moisture_adjustment_factor / (1 - input.processing_loss_percent / 100); } catch { results["effective_raw_material_cost"] = 0; }
  try { results["transport_surcharge"] = input.include_transport_cost ? 0.02 : 0; } catch { results["transport_surcharge"] = 0; }
  try { results["quality_multiplier"] = input.quality_grade == 'premium' ? 1.15 : (input.quality_grade == 'economy' ? 0.90 : 1.0); } catch { results["quality_multiplier"] = 0; }
  try { results["adjusted_feed_cost_per_kg"] = ((results["effective_raw_material_cost"] ?? 0) + (results["transport_surcharge"] ?? 0)) * (results["quality_multiplier"] ?? 0); } catch { results["adjusted_feed_cost_per_kg"] = 0; }
  try { results["total_feed_cost_per_animal_per_day"] = (results["adjusted_feed_cost_per_kg"] ?? 0) * input.feed_intake_kg; } catch { results["total_feed_cost_per_animal_per_day"] = 0; }
  try { results["annual_feed_cost_per_animal"] = (results["total_feed_cost_per_animal_per_day"] ?? 0) * 365; } catch { results["annual_feed_cost_per_animal"] = 0; }
  try { results["cost_per_kg_gain"] = (results["adjusted_feed_cost_per_kg"] ?? 0) * 2.5; } catch { results["cost_per_kg_gain"] = 0; }
  return results;
}


export function calculateFeed_cost_estimator(input: Feed_cost_estimatorInput): Feed_cost_estimatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_feed_cost_per_animal_per_day"] ?? 0;
  const breakdown = {
    raw_material_base_cost: values["raw_material_base_cost"] ?? 0,
    moisture_adjusted_cost: values["moisture_adjusted_cost"] ?? 0,
    processing_loss_cost: values["processing_loss_cost"] ?? 0,
    transport_cost: values["transport_cost"] ?? 0,
    quality_adjustment: values["quality_adjustment"] ?? 0,
    daily_feed_cost: values["daily_feed_cost"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excessive processing loss","Moisture variation","Quality grade mismatch"];
  const suggestedActions: string[] = ["Implement preventive maintenance on mills and pellet mills to reduce processing loss below 3%.","Negotiate with suppliers for consistent moisture content or install on-line moisture sensors.","Evaluate if standard grade feed meets animal performance targets before using premium.","Consolidate raw material purchases to achieve volume discounts."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-plant comparison","Real-time commodity price feed"],
  };
}


export interface Feed_cost_estimatorOutput {
  totalWasteCost: number;
  breakdown: { raw_material_base_cost: number; moisture_adjusted_cost: number; processing_loss_cost: number; transport_cost: number; quality_adjustment: number; daily_feed_cost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
