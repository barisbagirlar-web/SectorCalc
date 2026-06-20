// Auto-generated from vineyard-calculator-schema.json
import * as z from 'zod';

export interface Vineyard_calculatorInput {
  area: number;
  vineDensity: number;
  yieldPerVine: number;
  grapePrice: number;
  costPerHectare: number;
  wasteRate: number;
  dataConfidence?: number;
}

export const Vineyard_calculatorInputSchema = z.object({
  area: z.number().default(5),
  vineDensity: z.number().default(4000),
  yieldPerVine: z.number().default(2.5),
  grapePrice: z.number().default(1.2),
  costPerHectare: z.number().default(5000),
  wasteRate: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Vineyard_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.area * input.vineDensity; results["totalVines"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalVines"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalVines"])) * input.yieldPerVine; results["totalGrapesGross"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalGrapesGross"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalGrapesGross"])) * (input.wasteRate / 100); results["wasteAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wasteAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalGrapesGross"])) - (toNumericFormulaValue(results["wasteAmount"])); results["totalGrapesNet"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalGrapesNet"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalGrapesNet"])) * input.grapePrice; results["totalRevenue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalRevenue"] = Number.NaN; }
  try { const v = input.area * input.costPerHectare; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalRevenue"])) - (toNumericFormulaValue(results["totalCost"])); results["netProfit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netProfit"] = Number.NaN; }
  return results;
}


export function calculateVineyard_calculator(input: Vineyard_calculatorInput): Vineyard_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netProfit"]);
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


export interface Vineyard_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
