// Auto-generated from home-renovation-m2-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface HomeRenovationM2Input {
  area: number;
  conditionFactor: 'poor' | 'average' | 'good';
  qualityLevel: 'economy' | 'standard' | 'premium';
  laborRate: number;
  materialCostPerM2: number;
  contingencyPercent: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const HomeRenovationM2InputSchema = z.object({
  area: z.number().min(1).max(10000).default(100),
  conditionFactor: z.enum(['poor', 'average', 'good']).default('average'),
  qualityLevel: z.enum(['economy', 'standard', 'premium']).default('standard'),
  laborRate: z.number().min(10).max(200).default(50),
  materialCostPerM2: z.number().min(20).max(500).default(100),
  contingencyPercent: z.number().min(0).max(30).default(10),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface HomeRenovationM2Output {
  totalCost: number;
  breakdown: {
    baseCost: number;
    conditionAdjustment: number;
    qualityAdjustment: number;
    contingency: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: HomeRenovationM2Input): Record<string, number> {
  const results: Record<string, number> = {};
  results.conditionMultiplier = ((): number => { try { const __v = input.conditionFactor === 'poor' ? 1.5 : input.conditionFactor === 'average' ? 1.0 : 0.8; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.qualityMultiplier = ((): number => { try { const __v = input.qualityLevel === 'economy' ? 0.8 : input.qualityLevel === 'standard' ? 1.0 : 1.3; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.baseCostPerM2 = ((): number => { try { const __v = input.laborRate + input.materialCostPerM2; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedCostPerM2 = ((): number => { try { const __v = results.baseCostPerM2 * results.conditionMultiplier * results.qualityMultiplier; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = input.area * results.adjustedCostPerM2 * (1 + input.contingencyPercent / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCostPerM2 = ((): number => { try { const __v = results.totalCost / input.area; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = input.dataConfidence === 'low' ? results.totalCost * 1.2 : input.dataConfidence === 'medium' ? results.totalCost * 1.1 : results.totalCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateHomeRenovationM2(input: HomeRenovationM2Input): HomeRenovationM2Output {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    baseCost: results.baseCostPerM2,
    conditionAdjustment: results.conditionAdjustment,
    qualityAdjustment: results.qualityAdjustment,
    contingency: results.contingency,
  };

  // rule: area must be between 1 and 10000
  // rule: laborRate must be between 10 and 200
  // rule: materialCostPerM2 must be between 20 and 500
  // rule: contingencyPercent must be between 0 and 30
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High cost alert: Consider value engineering.
  // threshold skipped (non-JS): High contingency: Review risk assessment.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalCost; } })();

  return {
    totalCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Benchmarks","Detailed Report with Breakdown"],
  };
}
