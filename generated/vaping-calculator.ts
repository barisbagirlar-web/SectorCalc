// Auto-generated from vaping-calculator-schema.json
import * as z from 'zod';

export interface Vaping_calculatorInput {
  wireDiameter: number;
  innerDiameter: number;
  numberOfWraps: number;
  legLength: number;
  resistivity: number;
  voltage: number;
  dataConfidence?: number;
}

export const Vaping_calculatorInputSchema = z.object({
  wireDiameter: z.number().default(0.4),
  innerDiameter: z.number().default(3),
  numberOfWraps: z.number().default(6),
  legLength: z.number().default(5),
  resistivity: z.number().default(0.00000145),
  voltage: z.number().default(4.2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Vaping_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wireDiameter * input.innerDiameter * input.numberOfWraps * input.legLength; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.wireDiameter * input.innerDiameter * input.numberOfWraps * input.legLength * (input.resistivity * input.voltage); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.resistivity * input.voltage; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateVaping_calculator(input: Vaping_calculatorInput): Vaping_calculatorOutput {
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


export interface Vaping_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
