// Auto-generated from step-calculator-schema.json
import * as z from 'zod';

export interface Step_calculatorInput {
  totalHeight: number;
  stepHeight: number;
  stepDepth: number;
  landingWidth: number;
  headroom: number;
  dataConfidence?: number;
}

export const Step_calculatorInputSchema = z.object({
  totalHeight: z.number().default(280),
  stepHeight: z.number().default(18),
  stepDepth: z.number().default(28),
  landingWidth: z.number().default(100),
  headroom: z.number().default(210),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Step_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalHeight * input.stepHeight * input.stepDepth * input.landingWidth; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.totalHeight * input.stepHeight * input.stepDepth * input.landingWidth * (input.headroom); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.headroom; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateStep_calculator(input: Step_calculatorInput): Step_calculatorOutput {
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


export interface Step_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
