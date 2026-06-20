// Auto-generated from cbd-calculator-schema.json
import * as z from 'zod';

export interface Cbd_calculatorInput {
  materialUnitCost: number;
  laborUnitCost: number;
  overheadUnitCost: number;
  quantity: number;
  profitMarginPercent: number;
  dataConfidence?: number;
}

export const Cbd_calculatorInputSchema = z.object({
  materialUnitCost: z.number().default(10),
  laborUnitCost: z.number().default(5),
  overheadUnitCost: z.number().default(3),
  quantity: z.number().default(1000),
  profitMarginPercent: z.number().default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cbd_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.materialUnitCost * input.quantity; results["totalMaterialCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMaterialCost"] = Number.NaN; }
  try { const v = input.laborUnitCost * input.quantity; results["totalLaborCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalLaborCost"] = Number.NaN; }
  try { const v = input.overheadUnitCost * input.quantity; results["totalOverheadCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalOverheadCost"] = Number.NaN; }
  try { const v = (input.materialUnitCost + input.laborUnitCost + input.overheadUnitCost) * input.quantity; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = (input.materialUnitCost + input.laborUnitCost + input.overheadUnitCost) * input.quantity * (input.profitMarginPercent / 100); results["profit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["profit"] = Number.NaN; }
  try { const v = (input.materialUnitCost + input.laborUnitCost + input.overheadUnitCost) * input.quantity * (1 + input.profitMarginPercent / 100); results["sellingPrice"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sellingPrice"] = Number.NaN; }
  return results;
}


export function calculateCbd_calculator(input: Cbd_calculatorInput): Cbd_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sellingPrice"]);
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


export interface Cbd_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
