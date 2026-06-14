// Auto-generated from annual-leave-severance-notice-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AnnualLeaveSeveranceNoticeCalculatorInput {
  annualSalary: number;
  yearsOfService: number;
  monthsOfService: number;
  leaveDaysAccrued: number;
  leaveDaysTaken: number;
  severanceMultiplier: number;
  noticePeriod: number;
  workingDaysPerWeek: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'TRY' | 'Other';
}

export const AnnualLeaveSeveranceNoticeCalculatorInputSchema = z.object({
  annualSalary: z.number().min(0).default(50000),
  yearsOfService: z.number().min(0).max(50).default(5),
  monthsOfService: z.number().min(0).max(11).default(0),
  leaveDaysAccrued: z.number().min(0).max(365).default(20),
  leaveDaysTaken: z.number().min(0).max(365).default(0),
  severanceMultiplier: z.number().min(0).max(10).default(1),
  noticePeriod: z.number().min(0).max(52).default(4),
  workingDaysPerWeek: z.number().min(1).max(7).default(5),
  currency: z.enum(['USD', 'EUR', 'GBP', 'TRY', 'Other']).default('USD'),
});

export interface AnnualLeaveSeveranceNoticeCalculatorOutput {
  totalPayout: number;
  breakdown: {
    leavePayout: number;
    severancePay: number;
    noticePay: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AnnualLeaveSeveranceNoticeCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.dailyRate = (() => { try { return input.annualSalary / (52 * input.workingDaysPerWeek); } catch { return 0; } })();
  results.totalServiceYears = (() => { try { return input.yearsOfService + input.monthsOfService / 12; } catch { return 0; } })();
  results.unusedLeaveDays = (() => { try { return input.leaveDaysAccrued - input.leaveDaysTaken; } catch { return 0; } })();
  results.leavePayout = (() => { try { return results.unusedLeaveDays * results.dailyRate; } catch { return 0; } })();
  results.severancePay = (() => { try { return results.totalServiceYears * input.severanceMultiplier * results.dailyRate * input.workingDaysPerWeek; } catch { return 0; } })();
  results.noticePay = (() => { try { return input.noticePeriod * results.dailyRate * input.workingDaysPerWeek; } catch { return 0; } })();
  results.totalPayout = (() => { try { return results.leavePayout + results.severancePay + results.noticePay; } catch { return 0; } })();
  return results;
}

export function calculateAnnualLeaveSeveranceNoticeCalculator(input: AnnualLeaveSeveranceNoticeCalculatorInput): AnnualLeaveSeveranceNoticeCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalPayout = results.totalPayout ?? 0;
  const breakdown = {
    leavePayout: results.leavePayout,
    severancePay: results.severancePay,
    noticePay: results.noticePay,
  };

  // rule: annualSalary > 0
  // rule: yearsOfService >= 0
  // rule: monthsOfService >= 0 and monthsOfService <= 11
  // rule: leaveDaysAccrued >= 0
  // rule: leaveDaysTaken >= 0 and leaveDaysTaken <= leaveDaysAccrued
  // rule: severanceMultiplier >= 0
  // rule: noticePeriod >= 0
  // rule: workingDaysPerWeek >= 1 and workingDaysPerWeek <= 7
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High accrued leave days; consider encouraging leave usage.
  // threshold skipped (non-JS): Severance multiplier is high; check contract terms.
  // threshold skipped (non-JS): Notice period exceeds typical maximum; verify.

  const dataConfidenceAdjusted = (() => { try { return results.totalPayout; } catch { return totalPayout; } })();

  return {
    totalPayout,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Benchmarks","Detailed Report with Legal References"],
  };
}
