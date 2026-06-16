// Auto-generated from quadratic-formula-calculator-schema.json
import * as z from 'zod';

export interface Quadratic_formula_calculatorInput {
  coefficient_a: number;
  coefficient_b: number;
  coefficient_c: number;
  precision_mode: string;
  use_complex_roots: boolean;
}

export const Quadratic_formula_calculatorInputSchema = z.object({
  coefficient_a: z.number().min(-1000).max(1000).default(1),
  coefficient_b: z.number().min(-10000).max(10000).default(0),
  coefficient_c: z.number().min(-10000).max(10000).default(0),
  precision_mode: z.enum(['standard', 'high', 'engineering']).default('standard'),
  use_complex_roots: z.boolean().default(false),
});

function evaluateAllFormulas(input: Quadratic_formula_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.coefficient_b * input.coefficient_b - 4 * input.coefficient_a * input.coefficient_c; results["discriminant"] = Number.isFinite(v) ? v : 0; } catch { results["discriminant"] = 0; }
  try { const v = Math.sqrt(Math.abs((results["discriminant"] ?? 0))); results["sqrt_discriminant"] = Number.isFinite(v) ? v : 0; } catch { results["sqrt_discriminant"] = 0; }
  try { const v = (-input.coefficient_b + (results["sqrt_discriminant"] ?? 0)) / (2 * input.coefficient_a); results["root1"] = Number.isFinite(v) ? v : 0; } catch { results["root1"] = 0; }
  try { const v = (-input.coefficient_b - (results["sqrt_discriminant"] ?? 0)) / (2 * input.coefficient_a); results["root2"] = Number.isFinite(v) ? v : 0; } catch { results["root2"] = 0; }
  try { const v = -input.coefficient_b / (2 * input.coefficient_a); results["vertex_x"] = Number.isFinite(v) ? v : 0; } catch { results["vertex_x"] = 0; }
  try { const v = input.coefficient_a * (results["vertex_x"] ?? 0) * (results["vertex_x"] ?? 0) + input.coefficient_b * (results["vertex_x"] ?? 0) + input.coefficient_c; results["vertex_y"] = Number.isFinite(v) ? v : 0; } catch { results["vertex_y"] = 0; }
  try { const v = -input.coefficient_b / input.coefficient_a; results["sum_of_roots"] = Number.isFinite(v) ? v : 0; } catch { results["sum_of_roots"] = 0; }
  return results;
}


export function calculateQuadratic_formula_calculator(input: Quadratic_formula_calculatorInput): Quadratic_formula_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primary_result"] ?? 0;
  const breakdown = {
    id: values["id"] ?? 0,
    label: values["label"] ?? 0,
    description: values["description"] ?? 0,
    type: values["type"] ?? 0,
    properties: values["properties"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Loss of Significance Risk","Near-Zero Discriminant","Large |a| Coefficient"];
  const suggestedActions: string[] = ["Scale Inputs","Verify Roots by Substitution","Switch to High Precision Mode","Enable Complex Roots for Negative Discriminant"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Root cause analysis report","Monte Carlo simulation"],
  };
}


export interface Quadratic_formula_calculatorOutput {
  totalWasteCost: number;
  breakdown: { id: number; label: number; description: number; type: number; properties: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
