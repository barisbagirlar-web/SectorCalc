// Auto-generated from repair-time-vs-price-check-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface RepairTimeVsPriceCheckInput {
  repairTimeHours: number;
  hourlyLaborCost: number;
  partsCost: number;
  downtimeCostPerHour: number;
  repairMode: 'standard' | 'emergency' | 'premium';
  dataConfidence: number;
}

export const RepairTimeVsPriceCheckInputSchema = z.object({
  repairTimeHours: z.number().min(0).max(168).default(1),
  hourlyLaborCost: z.number().min(0).max(500).default(50),
  partsCost: z.number().min(0).max(100000).default(100),
  downtimeCostPerHour: z.number().min(0).max(10000).default(200),
  repairMode: z.enum(['standard', 'emergency', 'premium']).default('standard'),
  dataConfidence: z.number().min(0).max(1).default(0.9),
});

export interface RepairTimeVsPriceCheckOutput {
  totalImpact: number;
  breakdown: {
    laborCost: number;
    partsCost: number;
    downtimeCost: number;
    totalCost: number;
    costPerHourOfRepair: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: RepairTimeVsPriceCheckInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.laborCost = ((): number => { try { const __v = input.repairTimeHours * input.hourlyLaborCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.laborCost + input.partsCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.downtimeCost = ((): number => { try { const __v = input.repairTimeHours * input.downtimeCostPerHour; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalImpact = ((): number => { try { const __v = results.totalCost + results.downtimeCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerHourOfRepair = ((): number => { try { const __v = results.totalImpact / input.repairTimeHours; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.totalImpact * (1 + (1 - input.dataConfidence) * 0.1); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateRepairTimeVsPriceCheck(input: RepairTimeVsPriceCheckInput): RepairTimeVsPriceCheckOutput {
  const results = evaluateFormulas(input);
  const totalImpact = results.totalImpact ?? 0;
  const breakdown = {
    laborCost: results.laborCost,
    partsCost: results.partsCost,
    downtimeCost: results.downtimeCost,
    totalCost: results.totalCost,
    costPerHourOfRepair: results.costPerHourOfRepair,
  };

  // rule: repairTimeHours >= 0
  // rule: hourlyLaborCost >= 0
  // rule: partsCost >= 0
  // rule: downtimeCostPerHour >= 0
  // rule: dataConfidence >= 0 and dataConfidence <= 1
  // rule: if repairMode == 'emergency' then hourlyLaborCost >= 1.5 * defaultHourlyLaborCost
  // rule: if repairMode == 'premium' then hourlyLaborCost >= 2 * defaultHourlyLaborCost
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if totalCost > 10000 then 'High repair cost warning'
  // threshold skipped (non-JS): if repairTimeHours > 24 then 'Extended downtime risk'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalImpact; } })();

  return {
    totalImpact,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report with Charts"],
  };
}
