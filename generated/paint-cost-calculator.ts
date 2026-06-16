// Auto-generated from paint-cost-calculator-schema.json
import * as z from 'zod';

export interface Paint_cost_calculatorInput {
  surfaceArea: number;
  paintCoverage: number;
  paintPrice: number;
  coats: number;
  laborHours: number;
  laborRate: number;
  wasteFactor: number;
}

export const Paint_cost_calculatorInputSchema = z.object({
  surfaceArea: z.number().default(100),
  paintCoverage: z.number().default(10),
  paintPrice: z.number().default(30),
  coats: z.number().default(2),
  laborHours: z.number().default(8),
  laborRate: z.number().default(50),
  wasteFactor: z.number().default(5),
});

function evaluateAllFormulas(input: Paint_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.surfaceArea / input.paintCoverage * input.coats * (1 + input.wasteFactor / 100); results["totalPaintNeeded"] = Number.isFinite(v) ? v : 0; } catch { results["totalPaintNeeded"] = 0; }
  try { const v = (results["totalPaintNeeded"] ?? 0) * input.paintPrice; results["totalPaintCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalPaintCost"] = 0; }
  try { const v = input.laborHours * input.laborRate; results["totalLaborCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalLaborCost"] = 0; }
  try { const v = (results["totalPaintCost"] ?? 0) + (results["totalLaborCost"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculatePaint_cost_calculator(input: Paint_cost_calculatorInput): Paint_cost_calculatorOutput {
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


export interface Paint_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
