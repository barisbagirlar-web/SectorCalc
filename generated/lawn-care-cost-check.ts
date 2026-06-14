// Auto-generated from lawn-care-cost-check-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface LawnCareCostCheckInput {
  lawnArea: number;
  serviceFrequency: 'weekly' | 'biweekly' | 'monthly';
  laborRate: number;
  equipmentCost: number;
  materialCost: number;
  overheadRate: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const LawnCareCostCheckInputSchema = z.object({
  lawnArea: z.number().min(10).max(100000).default(500),
  serviceFrequency: z.enum(['weekly', 'biweekly', 'monthly']).default('weekly'),
  laborRate: z.number().min(7.25).max(100).default(25),
  equipmentCost: z.number().min(0).max(10000).default(500),
  materialCost: z.number().min(0).max(5000).default(200),
  overheadRate: z.number().min(0).max(50).default(15),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface LawnCareCostCheckOutput {
  totalAnnualCost: number;
  breakdown: {
    laborCost: number;
    equipmentCost: number;
    materialCost: number;
    overheadCost: number;
    costPerM2: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: LawnCareCostCheckInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.annualVisits = ((): number => { try { const __v = input.serviceFrequency === 'weekly' ? 52 : (input.serviceFrequency === 'biweekly' ? 26 : 12); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.laborCost = ((): number => { try { const __v = input.lawnArea * 0.01 * input.laborRate * results.annualVisits; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalDirectCost = ((): number => { try { const __v = results.laborCost + input.equipmentCost + input.materialCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.overheadCost = ((): number => { try { const __v = results.totalDirectCost * (input.overheadRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalAnnualCost = ((): number => { try { const __v = results.totalDirectCost + results.overheadCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerM2 = ((): number => { try { const __v = results.totalAnnualCost / input.lawnArea; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = input.dataConfidence === 'low' ? results.totalAnnualCost * 1.2 : (input.dataConfidence === 'medium' ? results.totalAnnualCost * 1.1 : results.totalAnnualCost); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateLawnCareCostCheck(input: LawnCareCostCheckInput): LawnCareCostCheckOutput {
  const results = evaluateFormulas(input);
  const totalAnnualCost = results.totalAnnualCost ?? 0;
  const breakdown = {
    laborCost: results.laborCost,
    equipmentCost: results.equipmentCost,
    materialCost: results.materialCost,
    overheadCost: results.overheadCost,
    costPerM2: results.costPerM2,
  };

  // rule: lawnArea must be between 10 and 100000 m²
  // rule: laborRate must be >= 7.25 USD/hour
  // rule: equipmentCost must be >= 0
  // rule: materialCost must be >= 0
  // rule: overheadRate must be between 0 and 50
  // rule: If serviceFrequency is 'weekly', then annual visits = 52; if 'biweekly', 26; if 'monthly', 12
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): If laborRate > 50, warning: 'High labor rate may indicate premium service'
  // threshold skipped (non-JS): If overheadRate > 30, warning: 'Overhead rate exceeds typical range'
  // threshold skipped (non-JS): If equipmentCost > 5000, warning: 'Equipment cost is high; consider leasing'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalAnnualCost; } })();

  return {
    totalAnnualCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report with Charts"],
  };
}
