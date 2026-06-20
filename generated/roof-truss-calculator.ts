// Auto-generated from roof-truss-calculator-schema.json
import * as z from 'zod';

export interface Roof_truss_calculatorInput {
  span: number;
  rise: number;
  overhang: number;
  length: number;
  spacing: number;
  dataConfidence?: number;
}

export const Roof_truss_calculatorInputSchema = z.object({
  span: z.number().default(10),
  rise: z.number().default(3),
  overhang: z.number().default(0.6),
  length: z.number().default(12),
  spacing: z.number().default(0.6),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Roof_truss_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.span) * (input.rise) * (input.overhang) * (input.length) * (input.spacing); results["halfRun"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["halfRun"] = Number.NaN; }
  try { const v = (input.span) * (input.rise) * (input.overhang); results["halfRun_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["halfRun_aux"] = Number.NaN; }
  return results;
}


export function calculateRoof_truss_calculator(input: Roof_truss_calculatorInput): Roof_truss_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["halfRun"]);
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


export interface Roof_truss_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
