// Auto-generated from kwh-cost-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface KwhCostCalculatorInput {
  powerConsumption: number;
  operatingHours: number;
  electricityRate: number;
  demandCharge: number;
  peakDemand: number;
  timePeriod: 'daily' | 'weekly' | 'monthly' | 'annually';
  dataConfidence: number;
}

export const KwhCostCalculatorInputSchema = z.object({
  powerConsumption: z.number().min(0).default(0),
  operatingHours: z.number().min(0).default(0),
  electricityRate: z.number().min(0).default(0.12),
  demandCharge: z.number().min(0).default(0),
  peakDemand: z.number().min(0).default(0),
  timePeriod: z.enum(['daily', 'weekly', 'monthly', 'annually']).default('monthly'),
  dataConfidence: z.number().min(0).max(100).default(100),
});

export interface KwhCostCalculatorOutput {
  totalCost: number;
  breakdown: {
    energyCost: number;
    demandCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: KwhCostCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.energyCost = ((): number => { try { const __v = input.powerConsumption * input.operatingHours * input.electricityRate; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.demandCost = ((): number => { try { const __v = input.peakDemand * input.demandCharge; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.energyCost + results.demandCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedTotalCost = ((): number => { try { const __v = results.totalCost * (input.dataConfidence / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateKwhCostCalculator(input: KwhCostCalculatorInput): KwhCostCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    energyCost: results.energyCost,
    demandCost: results.demandCost,
  };

  // rule: powerConsumption >= 0
  // rule: operatingHours >= 0
  // rule: electricityRate >= 0
  // rule: demandCharge >= 0
  // rule: peakDemand >= 0
  // rule: dataConfidence >= 0 and dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High electricity rate alert
  // threshold skipped (non-JS): High peak demand alert
  // threshold skipped (non-JS): Low data confidence warning

  const dataConfidenceAdjusted = (() => { try { return results.adjustedTotalCost; } catch { return totalCost; } })();

  return {
    totalCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Comparison with benchmarks","Detailed report with breakdown"],
  };
}
