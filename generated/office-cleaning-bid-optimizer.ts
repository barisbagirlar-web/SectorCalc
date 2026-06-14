// Auto-generated from office-cleaning-bid-optimizer-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface OfficeCleaningBidOptimizerInput {
  totalSquareFeet: number;
  frequencyPerWeek: number;
  laborRatePerHour: number;
  productivityFactor: number;
  suppliesCostPerSqFt: number;
  equipmentCostPerSqFt: number;
  overheadPercentage: number;
  profitMarginTarget: number;
  dataConfidence: number;
  serviceLevel: 'basic' | 'standard' | 'premium';
}

export const OfficeCleaningBidOptimizerInputSchema = z.object({
  totalSquareFeet: z.number().min(100).max(1000000).default(10000),
  frequencyPerWeek: z.number().min(1).max(7).default(5),
  laborRatePerHour: z.number().min(7.25).max(50).default(15),
  productivityFactor: z.number().min(500).max(5000).default(2000),
  suppliesCostPerSqFt: z.number().min(0.005).max(0.1).default(0.02),
  equipmentCostPerSqFt: z.number().min(0.001).max(0.05).default(0.01),
  overheadPercentage: z.number().min(0).max(50).default(20),
  profitMarginTarget: z.number().min(0).max(50).default(15),
  dataConfidence: z.number().min(50).max(100).default(90),
  serviceLevel: z.enum(['basic', 'standard', 'premium']).default('standard'),
});

export interface OfficeCleaningBidOptimizerOutput {
  bidPricePerWeek: number;
  breakdown: {
    laborCostPerWeek: number;
    suppliesCostPerWeek: number;
    equipmentCostPerWeek: number;
    overheadCostPerWeek: number;
    totalCostPerWeek: number;
    profitMargin: number;
    costPerSqFt: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: OfficeCleaningBidOptimizerInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.laborHoursPerWeek = ((): number => { try { const __v = input.totalSquareFeet * input.frequencyPerWeek / input.productivityFactor; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.laborCostPerWeek = ((): number => { try { const __v = results.laborHoursPerWeek * input.laborRatePerHour; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.suppliesCostPerWeek = ((): number => { try { const __v = input.totalSquareFeet * input.suppliesCostPerSqFt * input.frequencyPerWeek; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.equipmentCostPerWeek = ((): number => { try { const __v = input.totalSquareFeet * input.equipmentCostPerSqFt * input.frequencyPerWeek; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.directCostPerWeek = ((): number => { try { const __v = results.laborCostPerWeek + results.suppliesCostPerWeek + results.equipmentCostPerWeek; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.overheadCostPerWeek = ((): number => { try { const __v = results.directCostPerWeek * (input.overheadPercentage / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCostPerWeek = ((): number => { try { const __v = results.directCostPerWeek + results.overheadCostPerWeek; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.bidPricePerWeek = ((): number => { try { const __v = results.totalCostPerWeek * (1 + input.profitMarginTarget / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.bidPricePerMonth = ((): number => { try { const __v = results.bidPricePerWeek * 4.33; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.bidPricePerYear = ((): number => { try { const __v = results.bidPricePerWeek * 52; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerSqFt = ((): number => { try { const __v = results.totalCostPerWeek / (input.totalSquareFeet * input.frequencyPerWeek); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedBid = ((): number => { try { const __v = results.bidPricePerWeek * (1 + (100 - input.dataConfidence) / 100 * 0.1); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateOfficeCleaningBidOptimizer(input: OfficeCleaningBidOptimizerInput): OfficeCleaningBidOptimizerOutput {
  const results = evaluateFormulas(input);
  const bidPricePerWeek = results.bidPricePerWeek ?? 0;
  const breakdown = {
    laborCostPerWeek: results.laborCostPerWeek,
    suppliesCostPerWeek: results.suppliesCostPerWeek,
    equipmentCostPerWeek: results.equipmentCostPerWeek,
    overheadCostPerWeek: results.overheadCostPerWeek,
    totalCostPerWeek: results.totalCostPerWeek,
    profitMargin: results.profitMargin,
    costPerSqFt: results.costPerSqFt,
  };

  // rule: totalSquareFeet >= 100
  // rule: frequencyPerWeek >= 1 and frequencyPerWeek <= 7
  // rule: laborRatePerHour >= 7.25
  // rule: productivityFactor >= 500
  // rule: suppliesCostPerSqFt >= 0.005
  // rule: equipmentCostPerSqFt >= 0.001
  // rule: overheadPercentage >= 0 and overheadPercentage <= 50
  // rule: profitMarginTarget >= 0 and profitMarginTarget <= 50
  // rule: dataConfidence >= 50 and dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if laborRatePerHour < 10 then 'Low wage alert: may affect quality'
  // threshold skipped (non-JS): if productivityFactor > 3000 then 'High productivity may indicate insufficient cleaning'
  // threshold skipped (non-JS): if profitMarginTarget > 30 then 'High margin may reduce competitiveness'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedBid; } catch { return bidPricePerWeek; } })();

  return {
    bidPricePerWeek,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Competitive Comparison","Detailed Report with Charts"],
  };
}
