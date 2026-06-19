// Auto-generated from fire-maliyet-hesaplayici-calculator-schema.json
import * as z from 'zod';

export interface Fire_maliyet_hesaplayici_calculatorInput {
  totalMaterial: number;
  goodProduct: number;
  reworkMaterial: number;
  scrapPrice: number;
  materialCost: number;
  laborOverhead: number;
  dataConfidence?: number;
}

export const Fire_maliyet_hesaplayici_calculatorInputSchema = z.object({
  totalMaterial: z.number().default(100),
  goodProduct: z.number().default(85),
  reworkMaterial: z.number().default(10),
  scrapPrice: z.number().default(2.5),
  materialCost: z.number().default(12),
  laborOverhead: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fire_maliyet_hesaplayici_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalMaterial - input.goodProduct - input.reworkMaterial; results["totalWasteMaterial"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalWasteMaterial"] = 0; }
  try { const v = ((asFormulaNumber(results["totalWasteMaterial"])) / input.totalMaterial) * 100; results["wastePercentage"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wastePercentage"] = 0; }
  try { const v = (asFormulaNumber(results["totalWasteMaterial"])) * input.materialCost; results["materialCostLoss"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["materialCostLoss"] = 0; }
  try { const v = (asFormulaNumber(results["totalWasteMaterial"])) * input.laborOverhead; results["laborCostLoss"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["laborCostLoss"] = 0; }
  try { const v = input.reworkMaterial * input.laborOverhead; results["reworkLaborCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["reworkLaborCost"] = 0; }
  try { const v = (asFormulaNumber(results["materialCostLoss"])) + (asFormulaNumber(results["laborCostLoss"])) + (asFormulaNumber(results["reworkLaborCost"])); results["totalCostLoss"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCostLoss"] = 0; }
  try { const v = (asFormulaNumber(results["totalWasteMaterial"])) * input.scrapPrice; results["scrapRevenue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["scrapRevenue"] = 0; }
  try { const v = (asFormulaNumber(results["totalCostLoss"])) - (asFormulaNumber(results["scrapRevenue"])); results["netLoss"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netLoss"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFire_maliyet_hesaplayici_calculator(input: Fire_maliyet_hesaplayici_calculatorInput): Fire_maliyet_hesaplayici_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netLoss"]);
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


export interface Fire_maliyet_hesaplayici_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
