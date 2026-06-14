// Auto-generated from return-profit-erosion-tool-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface ReturnProfitErosionToolInput {
  revenue: number;
  costOfGoodsSold: number;
  operatingExpenses: number;
  defectRate: number;
  reworkCostPerUnit: number;
  unitsProduced: number;
  inventoryHoldingCostRate: number;
  averageInventoryValue: number;
  dataConfidence: number;
}

export const ReturnProfitErosionToolInputSchema = z.object({
  revenue: z.number().min(0).default(1000000),
  costOfGoodsSold: z.number().min(0).default(600000),
  operatingExpenses: z.number().min(0).default(200000),
  defectRate: z.number().min(0).max(1).default(0.02),
  reworkCostPerUnit: z.number().min(0).default(50),
  unitsProduced: z.number().min(0).default(10000),
  inventoryHoldingCostRate: z.number().min(0).max(1).default(0.25),
  averageInventoryValue: z.number().min(0).default(500000),
  dataConfidence: z.number().min(0).max(1).default(0.9),
});

export interface ReturnProfitErosionToolOutput {
  adjustedProfit: number;
  breakdown: {
    grossProfit: number;
    operatingProfit: number;
    defectCost: number;
    inventoryHoldingCost: number;
    totalErosion: number;
    erosionRatio: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: ReturnProfitErosionToolInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.grossProfit = ((): number => { try { const __v = input.revenue - input.costOfGoodsSold; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.operatingProfit = ((): number => { try { const __v = results.grossProfit - input.operatingExpenses; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.defectCost = ((): number => { try { const __v = input.defectRate * input.unitsProduced * input.reworkCostPerUnit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.inventoryHoldingCost = ((): number => { try { const __v = input.inventoryHoldingCostRate * input.averageInventoryValue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalErosion = ((): number => { try { const __v = results.defectCost + results.inventoryHoldingCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.erosionRatio = ((): number => { try { const __v = results.totalErosion / input.revenue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedProfit = ((): number => { try { const __v = results.operatingProfit - results.totalErosion; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.adjustedProfit * input.dataConfidence; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateReturnProfitErosionTool(input: ReturnProfitErosionToolInput): ReturnProfitErosionToolOutput {
  const results = evaluateFormulas(input);
  const adjustedProfit = results.adjustedProfit ?? 0;
  const breakdown = {
    grossProfit: results.grossProfit,
    operatingProfit: results.operatingProfit,
    defectCost: results.defectCost,
    inventoryHoldingCost: results.inventoryHoldingCost,
    totalErosion: results.totalErosion,
    erosionRatio: results.erosionRatio,
  };

  // rule: revenue > 0
  // rule: costOfGoodsSold >= 0
  // rule: operatingExpenses >= 0
  // rule: defectRate >= 0 and defectRate <= 1
  // rule: reworkCostPerUnit >= 0
  // rule: unitsProduced > 0
  // rule: inventoryHoldingCostRate >= 0 and inventoryHoldingCostRate <= 1
  // rule: averageInventoryValue >= 0
  // rule: dataConfidence >= 0 and dataConfidence <= 1
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): 0.05

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return adjustedProfit; } })();

  return {
    adjustedProfit,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report with Charts"],
  };
}
