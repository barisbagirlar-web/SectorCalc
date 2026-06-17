// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Paint_cost_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.surfaceArea / input.paintCoverage * input.coats * (1 + input.wasteFactor / 100); results["totalPaintNeeded"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalPaintNeeded"] = 0; }
  try { const v = (asFormulaNumber(results["totalPaintNeeded"])) * input.paintPrice; results["totalPaintCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalPaintCost"] = 0; }
  try { const v = input.laborHours * input.laborRate; results["totalLaborCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalLaborCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalPaintCost"])) + (asFormulaNumber(results["totalLaborCost"])); results["totalCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePaint_cost_calculator(input: Paint_cost_calculatorInput): Paint_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
