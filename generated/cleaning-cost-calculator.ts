// Auto-generated from cleaning-cost-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface CleaningCostCalculatorInput {
  areaSize: number;
  cleaningFrequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  laborRate: number;
  laborProductivity: number;
  suppliesCostPerSqm: number;
  equipmentCostPerSqm: number;
  wasteDisposalCostPerSqm: number;
  overheadPercentage: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const CleaningCostCalculatorInputSchema = z.object({
  areaSize: z.number().min(1).max(100000).default(100),
  cleaningFrequency: z.enum(['daily', 'weekly', 'biweekly', 'monthly']).default('weekly'),
  laborRate: z.number().min(7.25).max(100).default(15),
  laborProductivity: z.number().min(10).max(200).default(50),
  suppliesCostPerSqm: z.number().min(0.01).max(1).default(0.05),
  equipmentCostPerSqm: z.number().min(0).max(0.5).default(0.02),
  wasteDisposalCostPerSqm: z.number().min(0).max(0.2).default(0.01),
  overheadPercentage: z.number().min(0).max(100).default(20),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface CleaningCostCalculatorOutput {
  totalCostPerMonth: number;
  breakdown: {
    laborCostPerMonth: number;
    suppliesCostPerMonth: number;
    equipmentCostPerMonth: number;
    wasteDisposalCostPerMonth: number;
    overheadCostPerMonth: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: CleaningCostCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.monthlyCleaningTimes = (() => { try { return input.cleaningFrequency === 'daily' ? 30 : input.cleaningFrequency === 'weekly' ? 4 : input.cleaningFrequency === 'biweekly' ? 2 : 1; } catch { return 0; } })();
  results.laborHoursPerMonth = (() => { try { return input.areaSize * results.monthlyCleaningTimes / input.laborProductivity; } catch { return 0; } })();
  results.laborCostPerMonth = (() => { try { return results.laborHoursPerMonth * input.laborRate; } catch { return 0; } })();
  results.suppliesCostPerMonth = (() => { try { return input.areaSize * results.monthlyCleaningTimes * input.suppliesCostPerSqm; } catch { return 0; } })();
  results.equipmentCostPerMonth = (() => { try { return input.areaSize * results.monthlyCleaningTimes * input.equipmentCostPerSqm; } catch { return 0; } })();
  results.wasteDisposalCostPerMonth = (() => { try { return input.areaSize * results.monthlyCleaningTimes * input.wasteDisposalCostPerSqm; } catch { return 0; } })();
  results.directCostPerMonth = (() => { try { return results.laborCostPerMonth + results.suppliesCostPerMonth + results.equipmentCostPerMonth + results.wasteDisposalCostPerMonth; } catch { return 0; } })();
  results.overheadCostPerMonth = (() => { try { return results.directCostPerMonth * (input.overheadPercentage / 100); } catch { return 0; } })();
  results.totalCostPerMonth = (() => { try { return results.directCostPerMonth + results.overheadCostPerMonth; } catch { return 0; } })();
  results.costPerSqm = (() => { try { return results.totalCostPerMonth / (input.areaSize * results.monthlyCleaningTimes); } catch { return 0; } })();
  results.dataConfidenceFactor = (() => { try { return input.dataConfidence === 'low' ? 1.2 : input.dataConfidence === 'medium' ? 1.0 : 0.9; } catch { return 0; } })();
  results.adjustedCostPerMonth = (() => { try { return results.totalCostPerMonth * results.dataConfidenceFactor; } catch { return 0; } })();
  return results;
}

export function calculateCleaningCostCalculator(input: CleaningCostCalculatorInput): CleaningCostCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCostPerMonth = results.totalCostPerMonth ?? 0;
  const breakdown = {
    laborCostPerMonth: results.laborCostPerMonth,
    suppliesCostPerMonth: results.suppliesCostPerMonth,
    equipmentCostPerMonth: results.equipmentCostPerMonth,
    wasteDisposalCostPerMonth: results.wasteDisposalCostPerMonth,
    overheadCostPerMonth: results.overheadCostPerMonth,
  };

  // rule: laborRate >= 7.25
  // rule: laborProductivity > 0
  // rule: suppliesCostPerSqm >= 0
  // rule: equipmentCostPerSqm >= 0
  // rule: wasteDisposalCostPerSqm >= 0
  // rule: overheadPercentage >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Low productivity may indicate inefficiency or need for training.
  // threshold skipped (non-JS): Supplies cost is high; consider bulk purchasing or alternative products.
  // threshold skipped (non-JS): Overhead is high; review indirect costs for potential savings.

  const dataConfidenceAdjusted = (() => { try { return results.adjustedCostPerMonth; } catch { return totalCostPerMonth; } })();

  return {
    totalCostPerMonth,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report with Charts"],
  };
}
