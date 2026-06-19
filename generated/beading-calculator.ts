// Auto-generated from beading-calculator-schema.json
import * as z from 'zod';

export interface Beading_calculatorInput {
  plateThickness: number;
  rootGap: number;
  bevelAngle: number;
  reinforcementHeight: number;
  weldLength: number;
  materialDensity: number;
  dataConfidence?: number;
}

export const Beading_calculatorInputSchema = z.object({
  plateThickness: z.number().default(10),
  rootGap: z.number().default(2),
  bevelAngle: z.number().default(60),
  reinforcementHeight: z.number().default(1.5),
  weldLength: z.number().default(500),
  materialDensity: z.number().default(7.85),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Beading_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.plateThickness * input.rootGap * input.bevelAngle * input.reinforcementHeight; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.plateThickness * input.rootGap * input.bevelAngle * input.reinforcementHeight * (input.weldLength * input.materialDensity); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.weldLength * input.materialDensity; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBeading_calculator(input: Beading_calculatorInput): Beading_calculatorOutput {
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


export interface Beading_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
