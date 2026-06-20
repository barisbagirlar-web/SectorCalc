// Auto-generated from vertical-curve-calculator-schema.json
import * as z from 'zod';

export interface Vertical_curve_calculatorInput {
  g1: number;
  g2: number;
  L: number;
  station_PVC: number;
  elevation_PVC: number;
  target_station: number;
  dataConfidence?: number;
}

export const Vertical_curve_calculatorInputSchema = z.object({
  g1: z.number().default(-2),
  g2: z.number().default(1),
  L: z.number().default(200),
  station_PVC: z.number().default(0),
  elevation_PVC: z.number().default(100),
  target_station: z.number().default(100),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Vertical_curve_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.g1 / 100) * (input.g2 / 100) * input.L * input.station_PVC; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = (input.g1 / 100) * (input.g2 / 100) * input.L * input.station_PVC * (input.elevation_PVC * input.target_station); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.elevation_PVC * input.target_station; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateVertical_curve_calculator(input: Vertical_curve_calculatorInput): Vertical_curve_calculatorOutput {
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
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Vertical_curve_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
