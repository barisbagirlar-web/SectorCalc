// Auto-generated from auto-repair-comeback-cost-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AutoRepairComebackCostInput {
  totalRepairs: number;
  comebackRate: number;
  averageComebackCost: number;
  lostCustomerRate: number;
  averageCustomerLifetimeValue: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const AutoRepairComebackCostInputSchema = z.object({
  totalRepairs: z.number().min(0).default(1000),
  comebackRate: z.number().min(0).max(100).default(5),
  averageComebackCost: z.number().min(0).default(200),
  lostCustomerRate: z.number().min(0).max(100).default(20),
  averageCustomerLifetimeValue: z.number().min(0).default(5000),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface AutoRepairComebackCostOutput {
  totalComebackCost: number;
  breakdown: {
    directComebackCost: number;
    lostRevenue: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AutoRepairComebackCostInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.comebackCount = ((): number => { try { const __v = input.totalRepairs * (input.comebackRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.directComebackCost = ((): number => { try { const __v = results.comebackCount * input.averageComebackCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.lostCustomers = ((): number => { try { const __v = results.comebackCount * (input.lostCustomerRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.lostRevenue = ((): number => { try { const __v = results.lostCustomers * input.averageCustomerLifetimeValue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalComebackCost = ((): number => { try { const __v = results.directComebackCost + results.lostRevenue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.totalComebackCost * (input.dataConfidence == 'low' ? 1.2 : (input.dataConfidence == 'medium' ? 1.0 : 0.9)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateAutoRepairComebackCost(input: AutoRepairComebackCostInput): AutoRepairComebackCostOutput {
  const results = evaluateFormulas(input);
  const totalComebackCost = results.totalComebackCost ?? 0;
  const breakdown = {
    directComebackCost: results.directComebackCost,
    lostRevenue: results.lostRevenue,
  };

  // rule: totalRepairs >= 0
  // rule: comebackRate >= 0 and comebackRate <= 100
  // rule: averageComebackCost >= 0
  // rule: lostCustomerRate >= 0 and lostCustomerRate <= 100
  // rule: averageCustomerLifetimeValue >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Comeback rate exceeds industry benchmark of 5%.
  // threshold skipped (non-JS): Lost customer rate exceeds typical range.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalComebackCost; } })();

  return {
    totalComebackCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report with Charts"],
  };
}
