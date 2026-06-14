// Auto-generated from annual-leave-severance-notice-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AnnualLeaveSeveranceNoticeCalculatorInput {
  annualSalary: number;
  workingDaysPerYear: number;
  accruedLeaveDays: number;
  yearsOfService: number;
  severanceMultiplier: number;
  noticePeriodDays: number;
  isTerminatedWithCause: boolean;
  jurisdiction: 'default' | 'US-Federal' | 'EU-Directive' | 'UK-Statutory' | 'UAE-LaborLaw';
}

export const AnnualLeaveSeveranceNoticeCalculatorInputSchema = z.object({
  annualSalary: z.number().min(0).default(50000),
  workingDaysPerYear: z.number().min(1).max(365).default(260),
  accruedLeaveDays: z.number().min(0).default(0),
  yearsOfService: z.number().min(0).default(5),
  severanceMultiplier: z.number().min(0).default(2),
  noticePeriodDays: z.number().min(0).default(30),
  isTerminatedWithCause: z.boolean().default(false),
  jurisdiction: z.enum(['default', 'US-Federal', 'EU-Directive', 'UK-Statutory', 'UAE-LaborLaw']).default('default'),
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
  results.dailyWage = input.annualSalary / input.workingDaysPerYear;
  results.leavePayout = input.accruedLeaveDays * results.dailyWage;
  results.severancePay = input.isTerminatedWithCause ? 0 : (input.yearsOfService * input.severanceMultiplier * 5 * results.dailyWage);
  results.noticePay = input.noticePeriodDays * results.dailyWage;
  results.totalPayout = results.leavePayout + results.severancePay + results.noticePay;
  return results;
}

export function calculateAnnualLeaveSeveranceNoticeCalculator(input: AnnualLeaveSeveranceNoticeCalculatorInput): AnnualLeaveSeveranceNoticeCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalPayout = results.totalPayout;
  const breakdown = {
    leavePayout: results.leavePayout,
    severancePay: results.severancePay,
    noticePay: results.noticePay,
  };

  // rule: annualSalary must be >= 0
  // rule: workingDaysPerYear must be between 1 and 365
  // rule: accruedLeaveDays must be >= 0
  // rule: yearsOfService must be >= 0
  // rule: severanceMultiplier must be >= 0
  // rule: noticePeriodDays must be >= 0
  // rule: If isTerminatedWithCause is true, severanceMultiplier should be 0 (check jurisdiction)
  // threshold accruedLeaveDays > 30: High accrued leave balance may indicate poor leave management
  // threshold yearsOfService > 20: Long service may trigger additional statutory benefits
  // threshold noticePeriodDays > 90: Extended notice period may be unusual; verify contract
  const hiddenLossDrivers: string[] = ["accruedLeaveDays > 30 ? 'High leave balance' : ''","yearsOfService > 20 ? 'Long service' : ''"];
  const suggestedActions: string[] = ["Review leave policy to reduce accruals","Consider phased retirement for long-service employees","Verify notice period compliance with local law"];
  const dataConfidenceAdjusted = results.totalPayout * (1 - 0.05);

  return {
    totalPayout,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export of detailed report","CSV export of breakdown","Multi-jurisdiction comparison","Trend analysis over time","Scenario modeling (what-if)"],
  };
}
