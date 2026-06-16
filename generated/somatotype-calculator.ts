// Auto-generated from somatotype-calculator-schema.json
import * as z from 'zod';

export interface Somatotype_calculatorInput {
  height: number;
  weight: number;
  skinfold_triceps: number;
  skinfold_subscapular: number;
  skinfold_suprailiac: number;
  skinfold_calf: number;
  humerus_breadth: number;
  femur_breadth: number;
}

export const Somatotype_calculatorInputSchema = z.object({
  height: z.number().default(175),
  weight: z.number().default(70),
  skinfold_triceps: z.number().default(12),
  skinfold_subscapular: z.number().default(15),
  skinfold_suprailiac: z.number().default(10),
  skinfold_calf: z.number().default(8),
  humerus_breadth: z.number().default(6.5),
  femur_breadth: z.number().default(9.5),
});

function evaluateAllFormulas(input: Somatotype_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = -0.7182 + 0.1451 * (input.skinfold_triceps + input.skinfold_subscapular + input.skinfold_suprailiac) - 0.00068 * ((input.skinfold_triceps + input.skinfold_subscapular + input.skinfold_suprailiac) ** 2) + 0.0000014 * ((input.skinfold_triceps + input.skinfold_subscapular + input.skinfold_suprailiac) ** 3); results["endomorphy"] = Number.isFinite(v) ? v : 0; } catch { results["endomorphy"] = 0; }
  try { const v = 0.858 * input.humerus_breadth + 0.601 * input.femur_breadth + 0.188 * (input.skinfold_triceps + input.skinfold_calf) + 0.161 * (input.skinfold_subscapular + input.skinfold_suprailiac) - 0.131 * input.height + 4.5; results["mesomorphy"] = Number.isFinite(v) ? v : 0; } catch { results["mesomorphy"] = 0; }
  results["ectomorphy"] = 0;
  return results;
}


export function calculateSomatotype_calculator(input: Somatotype_calculatorInput): Somatotype_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Somatotype"] ?? 0;
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


export interface Somatotype_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
