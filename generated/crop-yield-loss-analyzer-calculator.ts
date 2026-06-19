// Auto-generated from crop-yield-loss-analyzer-calculator-schema.json
import * as z from 'zod';

export interface Crop_yield_loss_analyzer_calculatorInput {
  expected_yield: number;
  actual_yield: number;
  harvest_loss_pct: number;
  post_harvest_loss_pct: number;
  field_condition: string;
  irrigation_type: string;
  pest_pressure: number;
  disease_index: number;
  dataConfidence?: number;
}

export const Crop_yield_loss_analyzer_calculatorInputSchema = z.object({
  expected_yield: z.number().min(0).max(20000).default(8000),
  actual_yield: z.number().min(0).max(20000).default(6500),
  harvest_loss_pct: z.number().min(0).max(30).default(5),
  post_harvest_loss_pct: z.number().min(0).max(20).default(3),
  field_condition: z.enum(['excellent', 'good', 'fair', 'poor']).default('good'),
  irrigation_type: z.enum(['drip', 'sprinkler', 'flood', 'rainfed']).default('drip'),
  pest_pressure: z.number().min(0).max(10).default(3),
  disease_index: z.number().min(0).max(10).default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Crop_yield_loss_analyzer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.expected_yield * input.actual_yield * (input.harvest_loss_pct / 100) * (input.post_harvest_loss_pct / 100); results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.expected_yield * input.actual_yield * (input.harvest_loss_pct / 100) * (input.post_harvest_loss_pct / 100) * (input.pest_pressure * input.disease_index); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.pest_pressure * input.disease_index; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCrop_yield_loss_analyzer_calculator(input: Crop_yield_loss_analyzer_calculatorInput): Crop_yield_loss_analyzer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-field comparison","Custom threshold configuration"],
  };
}


export interface Crop_yield_loss_analyzer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
