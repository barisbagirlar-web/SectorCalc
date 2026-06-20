// Auto-generated from convection-calculator-schema.json
import * as z from 'zod';

export interface Convection_calculatorInput {
  L: number;
  W: number;
  Ts: number;
  Tinf: number;
  k: number;
  nu: number;
  Pr: number;
  dataConfidence?: number;
}

export const Convection_calculatorInputSchema = z.object({
  L: z.number().default(0.5),
  W: z.number().default(0.3),
  Ts: z.number().default(50),
  Tinf: z.number().default(25),
  k: z.number().default(0.0257),
  nu: z.number().default(0.000016),
  Pr: z.number().default(0.7),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Convection_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.Ts - input.Tinf; results["deltaT"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["deltaT"] = Number.NaN; }
  try { const v = input.Tinf + 273.15; results["Tf_K"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Tf_K"] = Number.NaN; }
  try { const v = 1 / (toNumericFormulaValue(results["Tf_K"])); results["beta"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["beta"] = Number.NaN; }
  try { const v = input.L * input.W; results["A"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["A"] = Number.NaN; }
  return results;
}


export function calculateConvection_calculator(input: Convection_calculatorInput): Convection_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["A"]);
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


export interface Convection_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
