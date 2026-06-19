// Auto-generated from horizontal-curve-calculator-schema.json
import * as z from 'zod';

export interface Horizontal_curve_calculatorInput {
  designSpeed: number;
  superelevation: number;
  frictionFactor: number;
  centralAngle: number;
  stationPI: number;
  dataConfidence?: number;
}

export const Horizontal_curve_calculatorInputSchema = z.object({
  designSpeed: z.number().default(60),
  superelevation: z.number().default(6),
  frictionFactor: z.number().default(0.15),
  centralAngle: z.number().default(90),
  stationPI: z.number().default(1000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Horizontal_curve_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.designSpeed * (input.superelevation / 100) * input.frictionFactor * input.centralAngle; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.designSpeed * (input.superelevation / 100) * input.frictionFactor * input.centralAngle * (input.stationPI); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.stationPI; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHorizontal_curve_calculator(input: Horizontal_curve_calculatorInput): Horizontal_curve_calculatorOutput {
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


export interface Horizontal_curve_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
