// Auto-generated from hourly-rate-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface HourlyRateCalculatorInput {
  annualSalary: number;
  benefitsPercent: number;
  overheadPercent: number;
  profitMarginPercent: number;
  paidHoursPerYear: number;
  billableHoursPerYear: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const HourlyRateCalculatorInputSchema = z.object({
  annualSalary: z.number().min(0).default(60000),
  benefitsPercent: z.number().min(0).max(100).default(30),
  overheadPercent: z.number().min(0).max(200).default(50),
  profitMarginPercent: z.number().min(0).max(100).default(20),
  paidHoursPerYear: z.number().min(0).max(8760).default(2080),
  billableHoursPerYear: z.number().min(0).max(8760).default(1800),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface HourlyRateCalculatorOutput {
  hourlyRate: number;
  breakdown: {
    totalAnnualCost: number;
    costPerBillableHour: number;
    hourlyRate: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: HourlyRateCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalAnnualCost = ((): number => { try { const __v = input.annualSalary * (1 + input.benefitsPercent/100) * (1 + input.overheadPercent/100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerBillableHour = ((): number => { try { const __v = results.totalAnnualCost / input.billableHoursPerYear; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.hourlyRate = ((): number => { try { const __v = results.costPerBillableHour * (1 + input.profitMarginPercent/100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.hourlyRate * (1 + (input.dataConfidence == 'low' ? 0.1 : input.dataConfidence == 'medium' ? 0.05 : 0)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateHourlyRateCalculator(input: HourlyRateCalculatorInput): HourlyRateCalculatorOutput {
  const results = evaluateFormulas(input);
  const hourlyRate = results.hourlyRate ?? 0;
  const breakdown = {
    totalAnnualCost: results.totalAnnualCost,
    costPerBillableHour: results.costPerBillableHour,
    hourlyRate: results.hourlyRate,
  };

  // rule: annualSalary > 0
  // rule: benefitsPercent >= 0 AND benefitsPercent <= 100
  // rule: overheadPercent >= 0 AND overheadPercent <= 200
  // rule: profitMarginPercent >= 0 AND profitMarginPercent <= 100
  // rule: paidHoursPerYear > 0
  // rule: billableHoursPerYear > 0 AND billableHoursPerYear <= paidHoursPerYear
  // rule: dataConfidence in ['low','medium','high']
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Low utilization warning: billable hours less than 80% of paid hours.
  // threshold skipped (non-JS): High overhead warning: overhead exceeds 100% of direct costs.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return hourlyRate; } })();

  return {
    hourlyRate,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Benchmarks","Detailed Report with Charts"],
  };
}
