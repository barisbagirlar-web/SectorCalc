// Auto-generated from feed-cost-estimator-calculator-schema.json
import * as z from 'zod';

export interface Feed_cost_estimator_calculatorInput {
  feed_intake_kg: number;
  raw_material_cost_per_kg: number;
  processing_loss_percent: number;
  moisture_adjustment_factor: number;
  quality_grade: string;
  include_transport_cost: boolean;
  dataConfidence?: number;
}

export const Feed_cost_estimator_calculatorInputSchema = z.object({
  feed_intake_kg: z.number().min(0.1).max(50).default(10),
  raw_material_cost_per_kg: z.number().min(0.01).max(5).default(0.35),
  processing_loss_percent: z.number().min(0).max(15).default(3),
  moisture_adjustment_factor: z.number().min(0.85).max(1.15).default(1),
  quality_grade: z.enum(['premium', 'standard', 'economy']).default('standard'),
  include_transport_cost: z.boolean().default(false),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Feed_cost_estimator_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.raw_material_cost_per_kg * (1 + input.processing_loss_percent / 100) * input.moisture_adjustment_factor; results["effective_cost_per_kg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effective_cost_per_kg"] = Number.NaN; }
  try { const v = input.quality_grade === 'premium' ? 1.15 : (input.quality_grade === 'standard' ? 1.0 : 0.85); results["quality_adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["quality_adjustment_factor"] = Number.NaN; }
  try { const v = input.include_transport_cost ? 0.05 : 0; results["transport_surcharge"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["transport_surcharge"] = Number.NaN; }
  try { const v = input.feed_intake_kg * (toNumericFormulaValue(results["effective_cost_per_kg"])) * (toNumericFormulaValue(results["quality_adjustment_factor"])) + input.feed_intake_kg * (toNumericFormulaValue(results["transport_surcharge"])); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateFeed_cost_estimator_calculator(input: Feed_cost_estimator_calculatorInput): Feed_cost_estimator_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    effective_cost_per_kg: toNumericFormulaValue(values["effective_cost_per_kg"]),
    quality_adjustment_factor: toNumericFormulaValue(values["quality_adjustment_factor"]),
    transport_surcharge: toNumericFormulaValue(values["transport_surcharge"])
  };
  const hiddenLossDrivers: string[] = ["Moisture variation in raw materials","Processing loss due to equipment wear"];
  const suggestedActions: string[] = ["Implement moisture sensors for real-time adjustment","Schedule regular maintenance to reduce processing losses"];
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
    unit: "USD",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-plant comparison","Real-time commodity price feed"],
  };
}


export interface Feed_cost_estimator_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { effective_cost_per_kg: number; quality_adjustment_factor: number; transport_surcharge: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Feed_cost_estimator_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["effective_cost_per_kg","quality_adjustment_factor","transport_surcharge"],
} as const;

