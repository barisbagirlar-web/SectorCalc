// Auto-generated from ipf-gl-calculator-schema.json
import * as z from 'zod';

export interface Ipf_gl_calculatorInput {
  productionVolume: number;
  materialCostPerUnit: number;
  laborCostPerUnit: number;
  overheadCostPerUnit: number;
  defectRate: number;
  sellingPricePerUnit: number;
}

export const Ipf_gl_calculatorInputSchema = z.object({
  productionVolume: z.number().default(1000),
  materialCostPerUnit: z.number().default(5),
  laborCostPerUnit: z.number().default(3),
  overheadCostPerUnit: z.number().default(2),
  defectRate: z.number().default(5),
  sellingPricePerUnit: z.number().default(15),
});

function evaluateAllFormulas(input: Ipf_gl_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.productionVolume * (input.materialCostPerUnit + input.laborCostPerUnit + input.overheadCostPerUnit); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = input.productionVolume * input.defectRate / 100; results["defectiveUnits"] = Number.isFinite(v) ? v : 0; } catch { results["defectiveUnits"] = 0; }
  try { const v = (results["defectiveUnits"] ?? 0) * (input.materialCostPerUnit + input.laborCostPerUnit + input.overheadCostPerUnit); results["defectLoss"] = Number.isFinite(v) ? v : 0; } catch { results["defectLoss"] = 0; }
  try { const v = input.productionVolume * input.sellingPricePerUnit; results["grossRevenue"] = Number.isFinite(v) ? v : 0; } catch { results["grossRevenue"] = 0; }
  try { const v = (results["totalCost"] ?? 0) + (results["defectLoss"] ?? 0) - (results["grossRevenue"] ?? 0); results["grossLoss"] = Number.isFinite(v) ? v : 0; } catch { results["grossLoss"] = 0; }
  return results;
}


export function calculateIpf_gl_calculator(input: Ipf_gl_calculatorInput): Ipf_gl_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["grossLoss"] ?? 0;
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


export interface Ipf_gl_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
