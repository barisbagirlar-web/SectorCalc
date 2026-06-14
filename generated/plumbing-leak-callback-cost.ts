// Auto-generated from plumbing-leak-callback-cost-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface PlumbingLeakCallbackCostInput {
  annualLeakEvents: number;
  averageCallbackCost: number;
  laborRate: number;
  materialCostPerEvent: number;
  downtimeHoursPerEvent: number;
  hourlyFacilityCost: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const PlumbingLeakCallbackCostInputSchema = z.object({
  annualLeakEvents: z.number().min(0).max(1000).default(10),
  averageCallbackCost: z.number().min(0).max(100000).default(500),
  laborRate: z.number().min(0).max(500).default(75),
  materialCostPerEvent: z.number().min(0).max(50000).default(200),
  downtimeHoursPerEvent: z.number().min(0).max(168).default(4),
  hourlyFacilityCost: z.number().min(0).max(100000).default(1000),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface PlumbingLeakCallbackCostOutput {
  totalAnnualCost: number;
  breakdown: {
    callbackCost: number;
    laborCost: number;
    materialCost: number;
    downtimeCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: PlumbingLeakCallbackCostInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalCallbackCost = ((): number => { try { const __v = input.annualLeakEvents * input.averageCallbackCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalLaborCost = ((): number => { try { const __v = input.annualLeakEvents * input.laborRate * input.downtimeHoursPerEvent; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalMaterialCost = ((): number => { try { const __v = input.annualLeakEvents * input.materialCostPerEvent; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalDowntimeCost = ((): number => { try { const __v = input.annualLeakEvents * input.downtimeHoursPerEvent * input.hourlyFacilityCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalAnnualCost = ((): number => { try { const __v = results.totalCallbackCost + results.totalLaborCost + results.totalMaterialCost + results.totalDowntimeCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.totalAnnualCost * (1 + (input.dataConfidence == 'low' ? 0.2 : input.dataConfidence == 'medium' ? 0.1 : 0.05)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculatePlumbingLeakCallbackCost(input: PlumbingLeakCallbackCostInput): PlumbingLeakCallbackCostOutput {
  const results = evaluateFormulas(input);
  const totalAnnualCost = results.totalAnnualCost ?? 0;
  const breakdown = {
    callbackCost: results.totalCallbackCost,
    laborCost: results.totalLaborCost,
    materialCost: results.totalMaterialCost,
    downtimeCost: results.totalDowntimeCost,
  };

  // rule: annualLeakEvents >= 0
  // rule: averageCallbackCost >= 0
  // rule: laborRate >= 0
  // rule: materialCostPerEvent >= 0
  // rule: downtimeHoursPerEvent >= 0
  // rule: hourlyFacilityCost >= 0
  // rule: if dataConfidence == 'low' then annualLeakEvents > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High frequency of leaks indicates systemic issue
  // threshold skipped (non-JS): Callback cost exceeds typical threshold
  // threshold skipped (non-JS): Extended downtime per event

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
