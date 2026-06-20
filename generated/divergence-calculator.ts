// Auto-generated from divergence-calculator-schema.json
import * as z from 'zod';

export interface Divergence_calculatorInput {
  dFx_dx: number;
  dFy_dy: number;
  dFz_dz: number;
  x: number;
  y: number;
  z: number;
  dataConfidence?: number;
}

export const Divergence_calculatorInputSchema = z.object({
  dFx_dx: z.number().default(0),
  dFy_dy: z.number().default(0),
  dFz_dz: z.number().default(0),
  x: z.number().default(0),
  y: z.number().default(0),
  z: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Divergence_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dFx_dx + input.dFy_dy + input.dFz_dz; results["divergence"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["divergence"] = Number.NaN; }
  try { const v = input.dFx_dx; results["contributionX"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["contributionX"] = Number.NaN; }
  try { const v = input.dFy_dy; results["contributionY"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["contributionY"] = Number.NaN; }
  try { const v = input.dFz_dz; results["contributionZ"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["contributionZ"] = Number.NaN; }
  return results;
}


export function calculateDivergence_calculator(input: Divergence_calculatorInput): Divergence_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["divergence"]);
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


export interface Divergence_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
