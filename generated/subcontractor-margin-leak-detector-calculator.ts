// Auto-generated from subcontractor-margin-leak-detector-calculator-schema.json
import * as z from 'zod';

export interface Subcontractor_margin_leak_detector_calculatorInput {
  contract_value: number;
  actual_labor_cost: number;
  actual_material_cost: number;
  actual_equipment_cost: number;
  overhead_percentage: number;
  quality_rework_cost: number;
  schedule_delay_penalty: number;
  waste_factor: number;
  dataConfidence?: number;
}

export const Subcontractor_margin_leak_detector_calculatorInputSchema = z.object({
  contract_value: z.number().min(0).max(100000000).default(1000000),
  actual_labor_cost: z.number().min(0).max(50000000).default(350000),
  actual_material_cost: z.number().min(0).max(50000000).default(250000),
  actual_equipment_cost: z.number().min(0).max(20000000).default(100000),
  overhead_percentage: z.number().min(0).max(50).default(15),
  quality_rework_cost: z.number().min(0).max(10000000).default(50000),
  schedule_delay_penalty: z.number().min(0).max(5000000).default(20000),
  waste_factor: z.number().min(0).max(30).default(8),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Subcontractor_margin_leak_detector_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.contract_value * input.actual_labor_cost * input.actual_material_cost * input.actual_equipment_cost; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.contract_value * input.actual_labor_cost * input.actual_material_cost * input.actual_equipment_cost * ((input.overhead_percentage / 100) * input.quality_rework_cost * input.schedule_delay_penalty * (input.waste_factor / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = (input.overhead_percentage / 100) * input.quality_rework_cost * input.schedule_delay_penalty * (input.waste_factor / 100); results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSubcontractor_margin_leak_detector_calculator(input: Subcontractor_margin_leak_detector_calculatorInput): Subcontractor_margin_leak_detector_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Real-time dashboard","Benchmarking against industry standards"],
  };
}


export interface Subcontractor_margin_leak_detector_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
