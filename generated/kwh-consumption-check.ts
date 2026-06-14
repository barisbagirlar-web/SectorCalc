// Auto-generated from kwh-consumption-check-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface KwhConsumptionCheckInput {
  powerRating: number;
  operatingHours: number;
  loadFactor: number;
  efficiency: number;
  energyCost: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const KwhConsumptionCheckInputSchema = z.object({
  powerRating: z.number().min(0).max(100000).default(0),
  operatingHours: z.number().min(0).max(8760).default(0),
  loadFactor: z.number().min(0).max(100).default(100),
  efficiency: z.number().min(0).max(100).default(100),
  energyCost: z.number().min(0).max(1).default(0.12),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface KwhConsumptionCheckOutput {
  annualCost: number;
  breakdown: {
    annualConsumption: number;
    annualCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: KwhConsumptionCheckInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.annualConsumption = ((): number => { try { const __v = input.powerRating * input.operatingHours * (input.loadFactor / 100) * (100 / input.efficiency); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualCost = ((): number => { try { const __v = results.annualConsumption * input.energyCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.annualCost * (input.dataConfidence == 'low' ? 1.2 : (input.dataConfidence == 'medium' ? 1.0 : 0.9)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateKwhConsumptionCheck(input: KwhConsumptionCheckInput): KwhConsumptionCheckOutput {
  const results = evaluateFormulas(input);
  const annualCost = results.annualCost ?? 0;
  const breakdown = {
    annualConsumption: results.annualConsumption,
    annualCost: results.annualCost,
  };

  // rule: powerRating >= 0
  // rule: operatingHours >= 0 and operatingHours <= 8760
  // rule: loadFactor >= 0 and loadFactor <= 100
  // rule: efficiency >= 0 and efficiency <= 100
  // rule: energyCost >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if annualConsumption > 1000000 then 'High consumption'
  // threshold skipped (non-JS): if efficiency < 80 then 'Low efficiency'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return annualCost; } })();

  return {
    annualCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmark comparison","Detailed report"],
  };
}
