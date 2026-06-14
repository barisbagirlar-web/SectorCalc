// Auto-generated from downtime-minute-cost-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface DowntimeMinuteCostCalculatorInput {
  annualOperatingHours: number;
  totalDowntimeMinutes: number;
  hourlyCostRate: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const DowntimeMinuteCostCalculatorInputSchema = z.object({
  annualOperatingHours: z.number().min(0).max(8760).default(8760),
  totalDowntimeMinutes: z.number().min(0).default(1000),
  hourlyCostRate: z.number().min(0).default(100),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface DowntimeMinuteCostCalculatorOutput {
  totalDowntimeCost: number;
  breakdown: {
    costPerMinute: number;
    downtimeRatio: number;
    annualOperatingMinutes: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: DowntimeMinuteCostCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.costPerMinute = ((): number => { try { const __v = input.hourlyCostRate / 60; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalDowntimeCost = ((): number => { try { const __v = input.totalDowntimeMinutes * results.costPerMinute; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.downtimeRatio = ((): number => { try { const __v = input.totalDowntimeMinutes / (input.annualOperatingHours * 60); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedCost = ((): number => { try { const __v = results.totalDowntimeCost * (input.dataConfidence == 'low' ? 1.2 : (input.dataConfidence == 'medium' ? 1.0 : 0.8)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateDowntimeMinuteCostCalculator(input: DowntimeMinuteCostCalculatorInput): DowntimeMinuteCostCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalDowntimeCost = results.totalDowntimeCost ?? 0;
  const breakdown = {
    costPerMinute: results.costPerMinute,
    downtimeRatio: results.downtimeRatio,
    annualOperatingMinutes: results.annualOperatingMinutes,
  };

  // rule: annualOperatingHours must be between 0 and 8760
  // rule: totalDowntimeMinutes must be >= 0
  // rule: hourlyCostRate must be > 0
  // rule: dataConfidence must be one of: low, medium, high
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): totalDowntimeMinutes / (annualOperatingHours * 60) > 0.1 => 'Critical: Downtime exceeds 10% of operating time'
  // threshold skipped (non-JS): hourlyCostRate / 60 > 10 => 'High cost per minute; consider reducing hourly cost rate'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedCost; } catch { return totalDowntimeCost; } })();

  return {
    totalDowntimeCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analysis over multiple periods","Benchmarking against industry standards","Detailed breakdown report with visualizations"],
  };
}
