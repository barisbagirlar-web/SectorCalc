// Auto-generated from energy-peak-cost-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface EnergyPeakCostInput {
  peakDemand: number;
  peakRate: number;
  billingPeriod: 'monthly' | 'quarterly' | 'annually';
  peakHours: number;
  operatingDays: number;
  energyPrice: number;
  loadFactor: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const EnergyPeakCostInputSchema = z.object({
  peakDemand: z.number().min(0).max(100000).default(100),
  peakRate: z.number().min(0).max(1000).default(10),
  billingPeriod: z.enum(['monthly', 'quarterly', 'annually']).default('monthly'),
  peakHours: z.number().min(0).max(24).default(4),
  operatingDays: z.number().min(1).max(365).default(22),
  energyPrice: z.number().min(0).max(10).default(0.12),
  loadFactor: z.number().min(0).max(100).default(70),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface EnergyPeakCostOutput {
  totalCost: number;
  breakdown: {
    peakCost: number;
    energyCost: number;
    costPerUnit: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: EnergyPeakCostInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.peakCost = ((): number => { try { const __v = input.peakDemand * input.peakRate * (input.billingPeriod === 'monthly' ? 1 : input.billingPeriod === 'quarterly' ? 3 : 12); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.energyCost = ((): number => { try { const __v = input.peakDemand * input.loadFactor / 100 * input.peakHours * input.operatingDays * input.energyPrice * (input.billingPeriod === 'monthly' ? 1 : input.billingPeriod === 'quarterly' ? 3 : 12); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.peakCost + results.energyCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerUnit = ((): number => { try { const __v = results.totalCost / (input.peakDemand * input.loadFactor / 100 * input.peakHours * input.operatingDays); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.totalCost * (input.dataConfidence === 'low' ? 1.2 : input.dataConfidence === 'medium' ? 1.0 : 0.9); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateEnergyPeakCost(input: EnergyPeakCostInput): EnergyPeakCostOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    peakCost: results.peakCost,
    energyCost: results.energyCost,
    costPerUnit: results.costPerUnit,
  };

  // rule: peakDemand > 0
  // rule: peakRate > 0
  // rule: peakHours >= 0 and peakHours <= 24
  // rule: operatingDays > 0
  // rule: energyPrice > 0
  // rule: loadFactor >= 0 and loadFactor <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Low load factor indicates inefficient peak usage; consider demand reduction strategies.
  // threshold skipped (non-JS): High peak demand may trigger additional utility surcharges.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalCost; } })();

  return {
    totalCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis over multiple periods","Comparison with industry benchmarks","Detailed breakdown report"],
  };
}
