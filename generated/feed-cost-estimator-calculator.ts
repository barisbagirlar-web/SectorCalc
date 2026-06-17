// @ts-nocheck
// Auto-generated from feed-cost-estimator-calculator-schema.json
import * as z from 'zod';

export interface Feed_cost_estimator_calculatorInput {
  feed_intake_kg: number;
  raw_material_cost_per_kg: number;
  processing_loss_percent: number;
  moisture_adjustment_factor: number;
  quality_grade: string;
  include_transport_cost: boolean;
}

export const Feed_cost_estimator_calculatorInputSchema = z.object({
  feed_intake_kg: z.number().min(0.1).max(50).default(10),
  raw_material_cost_per_kg: z.number().min(0.01).max(5).default(0.35),
  processing_loss_percent: z.number().min(0).max(15).default(3),
  moisture_adjustment_factor: z.number().min(0.85).max(1.15).default(1),
  quality_grade: z.enum(['premium', 'standard', 'economy']).default('standard'),
  include_transport_cost: z.boolean().default(false),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Feed_cost_estimator_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.feed_intake_kg + input.raw_material_cost_per_kg + input.processing_loss_percent; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.feed_intake_kg + input.raw_material_cost_per_kg + input.processing_loss_percent; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateFeed_cost_estimator_calculator(input: Feed_cost_estimator_calculatorInput): Feed_cost_estimator_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-plant comparison","Real-time commodity price feed"],
  };
}


export interface Feed_cost_estimator_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
