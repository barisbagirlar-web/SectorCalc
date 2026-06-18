// @ts-nocheck
// Auto-generated from bar-to-atm-calculator-schema.json
import * as z from 'zod';

export interface Bar_to_atm_calculatorInput {
  pressure_bar: number;
  calibration_offset_bar: number;
  uncertainty_percent: number;
  decimal_places: number;
}

export const Bar_to_atm_calculatorInputSchema = z.object({
  pressure_bar: z.number().default(1),
  calibration_offset_bar: z.number().default(0),
  uncertainty_percent: z.number().default(0),
  decimal_places: z.number().default(4),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Bar_to_atm_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.pressure_bar + input.calibration_offset_bar; results["adjusted_pressure"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjusted_pressure"] = 0; }
  try { const v = (asFormulaNumber(results["adjusted_pressure"])) * 0.986923; results["pressure_atm"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["pressure_atm"] = 0; }
  try { const v = (asFormulaNumber(results["pressure_atm"])) * input.uncertainty_percent / 100; results["uncertainty_atm"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["uncertainty_atm"] = 0; }
  try { const v = (asFormulaNumber(results["pressure_atm"])) - (asFormulaNumber(results["uncertainty_atm"])); results["result_min"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_min"] = 0; }
  try { const v = (asFormulaNumber(results["pressure_atm"])) + (asFormulaNumber(results["uncertainty_atm"])); results["result_max"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_max"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBar_to_atm_calculator(input: Bar_to_atm_calculatorInput): Bar_to_atm_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["pressure_atm"]);
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
