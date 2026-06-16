// Auto-generated from cbd-calculator-schema.json
import * as z from 'zod';

export interface Cbd_calculatorInput {
  materialUnitCost: number;
  laborUnitCost: number;
  overheadUnitCost: number;
  quantity: number;
  profitMarginPercent: number;
}

export const Cbd_calculatorInputSchema = z.object({
  materialUnitCost: z.number().default(10),
  laborUnitCost: z.number().default(5),
  overheadUnitCost: z.number().default(3),
  quantity: z.number().default(1000),
  profitMarginPercent: z.number().default(20),
});

function evaluateAllFormulas(input: Cbd_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.materialUnitCost * input.quantity; results["totalMaterialCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalMaterialCost"] = 0; }
  try { const v = input.laborUnitCost * input.quantity; results["totalLaborCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalLaborCost"] = 0; }
  try { const v = input.overheadUnitCost * input.quantity; results["totalOverheadCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalOverheadCost"] = 0; }
  try { const v = (input.materialUnitCost + input.laborUnitCost + input.overheadUnitCost) * input.quantity; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (input.materialUnitCost + input.laborUnitCost + input.overheadUnitCost) * input.quantity * (input.profitMarginPercent / 100); results["profit"] = Number.isFinite(v) ? v : 0; } catch { results["profit"] = 0; }
  try { const v = (input.materialUnitCost + input.laborUnitCost + input.overheadUnitCost) * input.quantity * (1 + input.profitMarginPercent / 100); results["sellingPrice"] = Number.isFinite(v) ? v : 0; } catch { results["sellingPrice"] = 0; }
  return results;
}


export function calculateCbd_calculator(input: Cbd_calculatorInput): Cbd_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["sellingPrice"] ?? 0;
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


export interface Cbd_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
