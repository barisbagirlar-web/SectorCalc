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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Paint_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.surfaceArea / input.paintCoverage * input.coats * (1 + input.wasteFactor / 100); results["totalPaintNeeded"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalPaintNeeded"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalPaintNeeded"])) * input.paintPrice; results["totalPaintCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalPaintCost"] = Number.NaN; }
  try { const v = input.laborHours * input.laborRate; results["totalLaborCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalLaborCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalPaintCost"])) + (toNumericFormulaValue(results["totalLaborCost"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}


export function calculatePaint_cost_calculator(input: Paint_cost_calculatorInput): Paint_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
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


export interface Paint_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
