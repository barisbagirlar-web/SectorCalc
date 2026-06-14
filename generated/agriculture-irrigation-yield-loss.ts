// Auto-generated from agriculture-irrigation-yield-loss-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AgricultureIrrigationYieldLossInput {
  cropType: 'wheat' | 'corn' | 'rice' | 'soybean' | 'cotton';
  irrigationMethod: 'drip' | 'sprinkler' | 'furrow' | 'flood';
  waterApplied: number;
  cropWaterRequirement: number;
  yieldPotential: number;
  pricePerTon: number;
  waterCost: number;
  dataConfidence: number;
}

export const AgricultureIrrigationYieldLossInputSchema = z.object({
  cropType: z.enum(['wheat', 'corn', 'rice', 'soybean', 'cotton']).default('wheat'),
  irrigationMethod: z.enum(['drip', 'sprinkler', 'furrow', 'flood']).default('drip'),
  waterApplied: z.number().min(0).max(2000).default(500),
  cropWaterRequirement: z.number().min(0).max(2000).default(600),
  yieldPotential: z.number().min(0).max(20).default(8),
  pricePerTon: z.number().min(0).max(1000).default(200),
  waterCost: z.number().min(0).max(10).default(0.5),
  dataConfidence: z.number().min(0).max(100).default(80),
});

export interface AgricultureIrrigationYieldLossOutput {
  netLoss: number;
  breakdown: {
    waterUseEfficiency: number;
    actualYield: number;
    yieldLoss: number;
    revenueLoss: number;
    waterCostTotal: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AgricultureIrrigationYieldLossInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.waterUseEfficiency = ((): number => { try { const __v = input.waterApplied / input.cropWaterRequirement; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yieldResponseFactor = ((): number => { try { const __v = 1 - (1 - results.waterUseEfficiency) * 1.25; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.actualYield = ((): number => { try { const __v = input.yieldPotential * results.yieldResponseFactor; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yieldLoss = ((): number => { try { const __v = input.yieldPotential - results.actualYield; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.revenueLoss = ((): number => { try { const __v = results.yieldLoss * input.pricePerTon; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.waterCostTotal = ((): number => { try { const __v = input.waterApplied * input.waterCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netLoss = ((): number => { try { const __v = results.revenueLoss + results.waterCostTotal; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.netLoss * (1 + (100 - input.dataConfidence) / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateAgricultureIrrigationYieldLoss(input: AgricultureIrrigationYieldLossInput): AgricultureIrrigationYieldLossOutput {
  const results = evaluateFormulas(input);
  const netLoss = results.netLoss ?? 0;
  const breakdown = {
    waterUseEfficiency: results.waterUseEfficiency,
    actualYield: results.actualYield,
    yieldLoss: results.yieldLoss,
    revenueLoss: results.revenueLoss,
    waterCostTotal: results.waterCostTotal,
  };

  // rule: waterApplied must be >= 0
  // rule: cropWaterRequirement must be > 0
  // rule: yieldPotential must be > 0
  // rule: pricePerTon must be > 0
  // rule: waterCost must be >= 0
  // rule: dataConfidence must be between 0 and 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if (waterApplied / cropWaterRequirement) < 0.8 then 'Critical water deficit'
  // threshold skipped (non-JS): if (1 - actualYield / yieldPotential) > 0.2 then 'High yield loss'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return netLoss; } })();

  return {
    netLoss,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis over multiple seasons","Comparison with benchmarks","Detailed report with recommendations"],
  };
}
