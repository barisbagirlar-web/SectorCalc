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
  results.monthlyOvertimeCost = ((): number => { try { const __v = input.currentOvertimeHoursPerMonth * input.overtimeHourlyRate * input.overtimePremiumMultiplier; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.monthlyOvertimeCostWithOverhead = ((): number => { try { const __v = results.monthlyOvertimeCost * (1 + input.overheadRate); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.effectiveProductiveHoursNewHire = ((): number => { try { const __v = input.monthlyProductiveHoursPerEmployee * input.newHireProductivityFactor; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.newHireMonthlyCost = ((): number => { try { const __v = input.newHireMonthlySalary * (1 + input.overheadRate); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.newHireMonthlyCostPerProductiveHour = ((): number => { try { const __v = results.newHireMonthlyCost / results.effectiveProductiveHoursNewHire; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.overtimeCostPerHour = ((): number => { try { const __v = input.overtimeHourlyRate * input.overtimePremiumMultiplier * (1 + input.overheadRate); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.breakEvenHours = ((): number => { try { const __v = results.newHireMonthlyCost / results.overtimeCostPerHour; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualRecurringCostOvertime = ((): number => { try { const __v = results.monthlyOvertimeCostWithOverhead * 12; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualRecurringCostNewHire = ((): number => { try { const __v = results.newHireMonthlyCost * 12; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.oneTimeHiringCost = ((): number => { try { const __v = input.recruitingCost + input.trainingCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualizedOneTimeCost = ((): number => { try { const __v = results.oneTimeHiringCost * (1 + input.employeeTurnoverRate); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalAnnualCostOvertime = ((): number => { try { const __v = results.annualRecurringCostOvertime; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalAnnualCostNewHire = ((): number => { try { const __v = results.annualRecurringCostNewHire + results.annualizedOneTimeCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualSavingsByHiring = ((): number => { try { const __v = results.totalAnnualCostOvertime - results.totalAnnualCostNewHire; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.breakEvenMonths = ((): number => { try { const __v = results.oneTimeHiringCost / (results.monthlyOvertimeCostWithOverhead - results.newHireMonthlyCost); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
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
