// Auto-generated from crop-yield-loss-analyzer-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface CropYieldLossAnalyzerInput {
  expectedYield: number;
  actualYield: number;
  cropPrice: number;
  productionCost: number;
  areaHarvested: number;
  lossCategory: 'pre-harvest' | 'harvest' | 'post-harvest' | 'storage' | 'transport';
  lossFactor: number;
  dataConfidence: number;
}

export const CropYieldLossAnalyzerInputSchema = z.object({
  expectedYield: z.number().min(0).default(5000),
  actualYield: z.number().min(0).default(4000),
  cropPrice: z.number().min(0).default(0.3),
  productionCost: z.number().min(0).default(1000),
  areaHarvested: z.number().min(0).default(100),
  lossCategory: z.enum(['pre-harvest', 'harvest', 'post-harvest', 'storage', 'transport']).default('pre-harvest'),
  lossFactor: z.number().min(0).max(100).default(10),
  dataConfidence: z.number().min(0).max(1).default(0.8),
});

export interface CropYieldLossAnalyzerOutput {
  totalLoss: number;
  breakdown: {
    yieldLoss: number;
    yieldLossPercent: number;
    revenueLoss: number;
    costLoss: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: CropYieldLossAnalyzerInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.yieldLoss = (() => { try { return input.expectedYield - input.actualYield; } catch { return 0; } })();
  results.yieldLossPercent = (() => { try { return (results.yieldLoss / input.expectedYield) * 100; } catch { return 0; } })();
  results.revenueLoss = (() => { try { return results.yieldLoss * input.cropPrice * input.areaHarvested; } catch { return 0; } })();
  results.costLoss = (() => { try { return input.productionCost * input.areaHarvested * (results.yieldLoss / input.expectedYield); } catch { return 0; } })();
  results.totalLoss = (() => { try { return results.revenueLoss + results.costLoss; } catch { return 0; } })();
  results.dataConfidenceAdjusted = (() => { try { return results.totalLoss * input.dataConfidence; } catch { return 0; } })();
  return results;
}

export function calculateCropYieldLossAnalyzer(input: CropYieldLossAnalyzerInput): CropYieldLossAnalyzerOutput {
  const results = evaluateFormulas(input);
  const totalLoss = results.totalLoss ?? 0;
  const breakdown = {
    yieldLoss: results.yieldLoss,
    yieldLossPercent: results.yieldLossPercent,
    revenueLoss: results.revenueLoss,
    costLoss: results.costLoss,
  };

  // rule: expectedYield > 0
  // rule: actualYield >= 0
  // rule: cropPrice >= 0
  // rule: productionCost >= 0
  // rule: areaHarvested > 0
  // rule: lossFactor >= 0 and lossFactor <= 100
  // rule: dataConfidence >= 0 and dataConfidence <= 1
  // rule: actualYield <= expectedYield
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if yieldLossPercent > 20 then 'High yield loss'
  // threshold skipped (non-JS): if revenueLoss > 10000 then 'Significant revenue loss'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalLoss; } })();

  return {
    totalLoss,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analysis over multiple seasons","Benchmarking against regional averages","Detailed loss breakdown by category"],
  };
}
