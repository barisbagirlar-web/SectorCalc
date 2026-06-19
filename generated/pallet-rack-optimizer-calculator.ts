// Auto-generated from pallet-rack-optimizer-calculator-schema.json
import * as z from 'zod';

export interface Pallet_rack_optimizer_calculatorInput {
  rack_height_mm: number;
  pallet_depth_mm: number;
  pallet_width_mm: number;
  pallet_height_mm: number;
  beam_thickness_mm: number;
  clearance_vertical_mm: number;
  aisle_width_mm: number;
  rack_length_mm: number;
  dataConfidence?: number;
}

export const Pallet_rack_optimizer_calculatorInputSchema = z.object({
  rack_height_mm: z.number().min(3000).max(18000).default(12000),
  pallet_depth_mm: z.number().min(800).max(1500).default(1200),
  pallet_width_mm: z.number().min(800).max(1200).default(1000),
  pallet_height_mm: z.number().min(500).max(2500).default(1500),
  beam_thickness_mm: z.number().min(50).max(200).default(100),
  clearance_vertical_mm: z.number().min(50).max(300).default(100),
  aisle_width_mm: z.number().min(2000).max(5000).default(3000),
  rack_length_mm: z.number().min(1800).max(3600).default(2700),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pallet_rack_optimizer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.rack_height_mm * input.pallet_depth_mm * input.pallet_width_mm * input.pallet_height_mm; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.rack_height_mm * input.pallet_depth_mm * input.pallet_width_mm * input.pallet_height_mm * (input.beam_thickness_mm * input.clearance_vertical_mm * input.aisle_width_mm * input.rack_length_mm); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.beam_thickness_mm * input.clearance_vertical_mm * input.aisle_width_mm * input.rack_length_mm; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePallet_rack_optimizer_calculator(input: Pallet_rack_optimizer_calculatorInput): Pallet_rack_optimizer_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Real-time structural load monitoring"],
  };
}


export interface Pallet_rack_optimizer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
