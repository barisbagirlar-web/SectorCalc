// Auto-generated from symmetrical-components-schema.json
import * as z from 'zod';

export interface Symmetrical_componentsInput {
  va: number;
  vb: number;
  vc: number;
  angle_a: number;
  angle_b: number;
  angle_c: number;
  dataConfidence?: number;
}

export const Symmetrical_componentsInputSchema = z.object({
  va: z.number().default(100),
  vb: z.number().default(100),
  vc: z.number().default(100),
  angle_a: z.number().default(0),
  angle_b: z.number().default(-120),
  angle_c: z.number().default(120),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Symmetrical_componentsInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.angle_a * Math.PI / 180; results["a_rad"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["a_rad"] = 0; }
  try { const v = input.angle_b * Math.PI / 180; results["b_rad"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["b_rad"] = 0; }
  try { const v = input.angle_c * Math.PI / 180; results["c_rad"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["c_rad"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSymmetrical_components(input: Symmetrical_componentsInput): Symmetrical_componentsOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["c_rad"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Symmetrical_componentsOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
