// Auto-generated from snells-law-calculator-schema.json
import * as z from 'zod';

export interface Snells_law_calculatorInput {
  n1: number;
  theta1: number;
  n2: number;
  theta2: number;
}

export const Snells_law_calculatorInputSchema = z.object({
  n1: z.number().default(1),
  theta1: z.number().default(30),
  n2: z.number().default(1.5),
  theta2: z.number().default(19.47),
});

function evaluateAllFormulas(input: Snells_law_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.asin(input.n1 * Math.sin(input.theta1 * Math.PI / 180) / input.n2); results["theta2_rad"] = Number.isFinite(v) ? v : 0; } catch { results["theta2_rad"] = 0; }
  try { const v = (results["theta2_rad"] ?? 0) * 180 / Math.PI; results["theta2_deg"] = Number.isFinite(v) ? v : 0; } catch { results["theta2_deg"] = 0; }
  try { const v = Math.asin(input.n2 / input.n1); results["critical_angle_rad"] = Number.isFinite(v) ? v : 0; } catch { results["critical_angle_rad"] = 0; }
  try { const v = (results["critical_angle_rad"] ?? 0) * 180 / Math.PI; results["critical_angle_deg"] = Number.isFinite(v) ? v : 0; } catch { results["critical_angle_deg"] = 0; }
  try { const v = input.n1 > input.n2 && input.theta1 > (results["critical_angle_deg"] ?? 0); results["is_total_internal_reflection"] = Number.isFinite(v) ? v : 0; } catch { results["is_total_internal_reflection"] = 0; }
  return results;
}


export function calculateSnells_law_calculator(input: Snells_law_calculatorInput): Snells_law_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["theta2_deg"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Snells_law_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
