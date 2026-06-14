// Auto-generated from fazla-mesai-vs-yeni-ise-alim-basabas-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface FazlaMesaiVsYeniIseAlimBasabasCalculatorInput {
  currentOvertimeHoursPerMonth: number;
  overtimeHourlyRate: number;
  newHireMonthlySalary: number;
  newHireProductivityFactor: number;
  recruitingCost: number;
  trainingCost: number;
  monthlyProductiveHoursPerEmployee: number;
  overtimePremiumMultiplier: number;
  employeeTurnoverRate: number;
  overheadRate: number;
}

export const FazlaMesaiVsYeniIseAlimBasabasCalculatorInputSchema = z.object({
  currentOvertimeHoursPerMonth: z.number().min(0).max(720).default(100),
  overtimeHourlyRate: z.number().min(0).default(25),
  newHireMonthlySalary: z.number().min(0).default(3000),
  newHireProductivityFactor: z.number().min(0).max(1).default(0.7),
  recruitingCost: z.number().min(0).default(2000),
  trainingCost: z.number().min(0).default(1500),
  monthlyProductiveHoursPerEmployee: z.number().min(0).max(720).default(160),
  overtimePremiumMultiplier: z.number().min(1).max(3).default(1.5),
  employeeTurnoverRate: z.number().min(0).max(1).default(0.15),
  overheadRate: z.number().min(0).max(1).default(0.3),
});

export interface FazlaMesaiVsYeniIseAlimBasabasCalculatorOutput {
  annualSavingsByHiring: number;
  breakdown: {
    monthlyOvertimeCost: number;
    monthlyNewHireCost: number;
    oneTimeHiringCost: number;
    annualizedOneTimeCost: number;
    breakEvenHours: number;
    breakEvenMonths: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: FazlaMesaiVsYeniIseAlimBasabasCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.monthlyOvertimeCost = (() => { try { return input.currentOvertimeHoursPerMonth * input.overtimeHourlyRate * input.overtimePremiumMultiplier; } catch { return 0; } })();
  results.monthlyOvertimeCostWithOverhead = (() => { try { return results.monthlyOvertimeCost * (1 + input.overheadRate); } catch { return 0; } })();
  results.effectiveProductiveHoursNewHire = (() => { try { return input.monthlyProductiveHoursPerEmployee * input.newHireProductivityFactor; } catch { return 0; } })();
  results.newHireMonthlyCost = (() => { try { return input.newHireMonthlySalary * (1 + input.overheadRate); } catch { return 0; } })();
  results.newHireMonthlyCostPerProductiveHour = (() => { try { return results.newHireMonthlyCost / results.effectiveProductiveHoursNewHire; } catch { return 0; } })();
  results.overtimeCostPerHour = (() => { try { return input.overtimeHourlyRate * input.overtimePremiumMultiplier * (1 + input.overheadRate); } catch { return 0; } })();
  results.breakEvenHours = (() => { try { return results.newHireMonthlyCost / results.overtimeCostPerHour; } catch { return 0; } })();
  results.annualRecurringCostOvertime = (() => { try { return results.monthlyOvertimeCostWithOverhead * 12; } catch { return 0; } })();
  results.annualRecurringCostNewHire = (() => { try { return results.newHireMonthlyCost * 12; } catch { return 0; } })();
  results.oneTimeHiringCost = (() => { try { return input.recruitingCost + input.trainingCost; } catch { return 0; } })();
  results.annualizedOneTimeCost = (() => { try { return results.oneTimeHiringCost * (1 + input.employeeTurnoverRate); } catch { return 0; } })();
  results.totalAnnualCostOvertime = (() => { try { return results.annualRecurringCostOvertime; } catch { return 0; } })();
  results.totalAnnualCostNewHire = (() => { try { return results.annualRecurringCostNewHire + results.annualizedOneTimeCost; } catch { return 0; } })();
  results.annualSavingsByHiring = (() => { try { return results.totalAnnualCostOvertime - results.totalAnnualCostNewHire; } catch { return 0; } })();
  results.breakEvenMonths = (() => { try { return results.oneTimeHiringCost / (results.monthlyOvertimeCostWithOverhead - results.newHireMonthlyCost); } catch { return 0; } })();
  return results;
}

export function calculateFazlaMesaiVsYeniIseAlimBasabasCalculator(input: FazlaMesaiVsYeniIseAlimBasabasCalculatorInput): FazlaMesaiVsYeniIseAlimBasabasCalculatorOutput {
  const results = evaluateFormulas(input);
  const annualSavingsByHiring = results.annualSavingsByHiring ?? 0;
  const breakdown = {
    monthlyOvertimeCost: results.monthlyOvertimeCost,
    monthlyNewHireCost: results.monthlyNewHireCost,
    oneTimeHiringCost: results.oneTimeHiringCost,
    annualizedOneTimeCost: results.annualizedOneTimeCost,
    breakEvenHours: results.breakEvenHours,
    breakEvenMonths: results.breakEvenMonths,
  };

  // rule: currentOvertimeHoursPerMonth >= 0
  // rule: overtimeHourlyRate >= 0
  // rule: newHireMonthlySalary >= 0
  // rule: newHireProductivityFactor between 0 and 1
  // rule: recruitingCost >= 0
  // rule: trainingCost >= 0
  // rule: monthlyProductiveHoursPerEmployee > 0
  // rule: overtimePremiumMultiplier >= 1
  // rule: employeeTurnoverRate between 0 and 1
  // rule: overheadRate between 0 and 1
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): currentOvertimeHoursPerMonth > 23 -> 'Monthly overtime exceeds typical legal limit of 23 hours (270/year)'
  // threshold skipped (non-JS): employeeTurnoverRate > 0.2 -> 'High turnover rate increases hidden costs'

  const dataConfidenceAdjusted = (() => { try { return results.annualSavingsByHiring * (1 - 0.1 * (1 - input.newHireProductivityFactor)); } catch { return annualSavingsByHiring; } })();

  return {
    annualSavingsByHiring,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis (historical data)","Scenario Comparison (multiple parameter sets)","Detailed Report with charts"],
  };
}
