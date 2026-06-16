// Auto-generated from fire-maliyet-hesaplayici-calculator-schema.json
import * as z from 'zod';

export interface Fire_maliyet_hesaplayici_calculatorInput {
  totalMaterial: number;
  goodProduct: number;
  reworkMaterial: number;
  scrapPrice: number;
  materialCost: number;
  laborOverhead: number;
}

export const Fire_maliyet_hesaplayici_calculatorInputSchema = z.object({
  totalMaterial: z.number().default(100),
  goodProduct: z.number().default(85),
  reworkMaterial: z.number().default(10),
  scrapPrice: z.number().default(2.5),
  materialCost: z.number().default(12),
  laborOverhead: z.number().default(5),
});

function evaluateAllFormulas(input: Fire_maliyet_hesaplayici_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalMaterial - input.goodProduct - input.reworkMaterial; results["totalWasteMaterial"] = Number.isFinite(v) ? v : 0; } catch { results["totalWasteMaterial"] = 0; }
  try { const v = ((results["totalWasteMaterial"] ?? 0) / input.totalMaterial) * 100; results["wastePercentage"] = Number.isFinite(v) ? v : 0; } catch { results["wastePercentage"] = 0; }
  try { const v = (results["totalWasteMaterial"] ?? 0) * input.materialCost; results["materialCostLoss"] = Number.isFinite(v) ? v : 0; } catch { results["materialCostLoss"] = 0; }
  try { const v = (results["totalWasteMaterial"] ?? 0) * input.laborOverhead; results["laborCostLoss"] = Number.isFinite(v) ? v : 0; } catch { results["laborCostLoss"] = 0; }
  try { const v = input.reworkMaterial * input.laborOverhead; results["reworkLaborCost"] = Number.isFinite(v) ? v : 0; } catch { results["reworkLaborCost"] = 0; }
  try { const v = (results["materialCostLoss"] ?? 0) + (results["laborCostLoss"] ?? 0) + (results["reworkLaborCost"] ?? 0); results["totalCostLoss"] = Number.isFinite(v) ? v : 0; } catch { results["totalCostLoss"] = 0; }
  try { const v = (results["totalWasteMaterial"] ?? 0) * input.scrapPrice; results["scrapRevenue"] = Number.isFinite(v) ? v : 0; } catch { results["scrapRevenue"] = 0; }
  try { const v = (results["totalCostLoss"] ?? 0) - (results["scrapRevenue"] ?? 0); results["netLoss"] = Number.isFinite(v) ? v : 0; } catch { results["netLoss"] = 0; }
  return results;
}


export function calculateFire_maliyet_hesaplayici_calculator(input: Fire_maliyet_hesaplayici_calculatorInput): Fire_maliyet_hesaplayici_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netLoss"] ?? 0;
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


export interface Fire_maliyet_hesaplayici_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
