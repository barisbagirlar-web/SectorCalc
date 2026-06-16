// Auto-generated from vineyard-calculator-schema.json
import * as z from 'zod';

export interface Vineyard_calculatorInput {
  area: number;
  vineDensity: number;
  yieldPerVine: number;
  grapePrice: number;
  costPerHectare: number;
  wasteRate: number;
}

export const Vineyard_calculatorInputSchema = z.object({
  area: z.number().default(5),
  vineDensity: z.number().default(4000),
  yieldPerVine: z.number().default(2.5),
  grapePrice: z.number().default(1.2),
  costPerHectare: z.number().default(5000),
  wasteRate: z.number().default(5),
});

function evaluateAllFormulas(input: Vineyard_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.area * input.vineDensity; results["totalVines"] = Number.isFinite(v) ? v : 0; } catch { results["totalVines"] = 0; }
  try { const v = (results["totalVines"] ?? 0) * input.yieldPerVine; results["totalGrapesGross"] = Number.isFinite(v) ? v : 0; } catch { results["totalGrapesGross"] = 0; }
  try { const v = (results["totalGrapesGross"] ?? 0) * (input.wasteRate / 100); results["wasteAmount"] = Number.isFinite(v) ? v : 0; } catch { results["wasteAmount"] = 0; }
  try { const v = (results["totalGrapesGross"] ?? 0) - (results["wasteAmount"] ?? 0); results["totalGrapesNet"] = Number.isFinite(v) ? v : 0; } catch { results["totalGrapesNet"] = 0; }
  try { const v = (results["totalGrapesNet"] ?? 0) * input.grapePrice; results["totalRevenue"] = Number.isFinite(v) ? v : 0; } catch { results["totalRevenue"] = 0; }
  try { const v = input.area * input.costPerHectare; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["totalRevenue"] ?? 0) - (results["totalCost"] ?? 0); results["netProfit"] = Number.isFinite(v) ? v : 0; } catch { results["netProfit"] = 0; }
  return results;
}


export function calculateVineyard_calculator(input: Vineyard_calculatorInput): Vineyard_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netProfit"] ?? 0;
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


export interface Vineyard_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
