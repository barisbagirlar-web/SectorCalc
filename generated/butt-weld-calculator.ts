// Auto-generated from butt-weld-calculator-schema.json
import * as z from 'zod';

export interface Butt_weld_calculatorInput {
  plateThickness: number;
  rootGap: number;
  includedAngle: number;
  weldLength: number;
  metalDensity: number;
  dataConfidence?: number;
}

export const Butt_weld_calculatorInputSchema = z.object({
  plateThickness: z.number().default(10),
  rootGap: z.number().default(2),
  includedAngle: z.number().default(60),
  weldLength: z.number().default(1),
  metalDensity: z.number().default(7850),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Butt_weld_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.plateThickness * input.rootGap * input.includedAngle * input.weldLength; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.plateThickness * input.rootGap * input.includedAngle * input.weldLength * (input.metalDensity); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.metalDensity; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateButt_weld_calculator(input: Butt_weld_calculatorInput): Butt_weld_calculatorOutput {
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
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Butt_weld_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
