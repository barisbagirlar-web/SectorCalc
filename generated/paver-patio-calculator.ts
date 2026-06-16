// Auto-generated from paver-patio-calculator-schema.json
import * as z from 'zod';

export interface Paver_patio_calculatorInput {
  patioLength: number;
  patioWidth: number;
  paverLength: number;
  paverWidth: number;
  gap: number;
  wasteFactor: number;
  paverCostPerUnit: number;
}

export const Paver_patio_calculatorInputSchema = z.object({
  patioLength: z.number().default(5),
  patioWidth: z.number().default(4),
  paverLength: z.number().default(0.2),
  paverWidth: z.number().default(0.1),
  gap: z.number().default(0.005),
  wasteFactor: z.number().default(0.05),
  paverCostPerUnit: z.number().default(1),
});

function evaluateAllFormulas(input: Paver_patio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.patioLength * input.patioWidth; results["patioArea"] = Number.isFinite(v) ? v : 0; } catch { results["patioArea"] = 0; }
  try { const v = Math.ceil( (input.patioLength * input.patioWidth) / ((input.paverLength + input.gap) * (input.paverWidth + input.gap)) * (1 + input.wasteFactor) ); results["numberOfPavers"] = Number.isFinite(v) ? v : 0; } catch { results["numberOfPavers"] = 0; }
  try { const v = Math.ceil( (input.patioLength * input.patioWidth) / ((input.paverLength + input.gap) * (input.paverWidth + input.gap)) * (1 + input.wasteFactor) ) * input.paverCostPerUnit; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = input.patioLength * input.patioWidth / ((input.paverLength + input.gap) * (input.paverWidth + input.gap)) * input.wasteFactor; results["wastePavers"] = Number.isFinite(v) ? v : 0; } catch { results["wastePavers"] = 0; }
  return results;
}


export function calculatePaver_patio_calculator(input: Paver_patio_calculatorInput): Paver_patio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCost"] ?? 0;
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


export interface Paver_patio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
