// Auto-generated from bar-to-atm-calculator-schema.json
import * as z from 'zod';

export interface Bar_to_atm_calculatorInput {
  pressure_bar: number;
  calibration_offset_bar: number;
  uncertainty_percent: number;
  decimal_places: number;
  dataConfidence?: number;
}

export const Bar_to_atm_calculatorInputSchema = z.object({
  pressure_bar: z.number().default(1),
  calibration_offset_bar: z.number().default(0),
  uncertainty_percent: z.number().default(0),
  decimal_places: z.number().default(4),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Bar_to_atm_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pressure_bar + input.calibration_offset_bar; results["adjusted_pressure"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_pressure"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["adjusted_pressure"])) * 0.986923; results["pressure_atm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pressure_atm"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["pressure_atm"])) * input.uncertainty_percent / 100; results["uncertainty_atm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["uncertainty_atm"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["pressure_atm"])) - (toNumericFormulaValue(results["uncertainty_atm"])); results["result_min"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result_min"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["pressure_atm"])) + (toNumericFormulaValue(results["uncertainty_atm"])); results["result_max"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result_max"] = Number.NaN; }
  return results;
}


export function calculateBar_to_atm_calculator(input: Bar_to_atm_calculatorInput): Bar_to_atm_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["pressure_atm"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Bar_to_atm_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
