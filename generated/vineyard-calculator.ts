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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Vineyard_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.area * input.vineDensity; results["totalVines"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalVines"] = 0; }
  try { const v = (asFormulaNumber(results["totalVines"])) * input.yieldPerVine; results["totalGrapesGross"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalGrapesGross"] = 0; }
  try { const v = (asFormulaNumber(results["totalGrapesGross"])) * (input.wasteRate / 100); results["wasteAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wasteAmount"] = 0; }
  try { const v = (asFormulaNumber(results["totalGrapesGross"])) - (asFormulaNumber(results["wasteAmount"])); results["totalGrapesNet"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalGrapesNet"] = 0; }
  try { const v = (asFormulaNumber(results["totalGrapesNet"])) * input.grapePrice; results["totalRevenue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalRevenue"] = 0; }
  try { const v = input.area * input.costPerHectare; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalRevenue"])) - (asFormulaNumber(results["totalCost"])); results["netProfit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netProfit"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateVineyard_calculator(input: Vineyard_calculatorInput): Vineyard_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["netProfit"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
