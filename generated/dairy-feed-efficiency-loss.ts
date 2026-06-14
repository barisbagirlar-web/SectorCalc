// Auto-generated from dairy-feed-efficiency-loss-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface DairyFeedEfficiencyLossInput {
  milkYieldPerCow: number;
  feedIntakePerCow: number;
  feedCostPerKg: number;
  milkPricePerKg: number;
  herdSize: number;
  daysInMilk: number;
  targetFeedEfficiency: number;
}

export const DairyFeedEfficiencyLossInputSchema = z.object({
  milkYieldPerCow: z.number().min(0).max(100).default(30),
  feedIntakePerCow: z.number().min(0).max(50).default(20),
  feedCostPerKg: z.number().min(0).max(1).default(0.3),
  milkPricePerKg: z.number().min(0).max(1).default(0.4),
  herdSize: z.number().min(1).max(10000).default(100),
  daysInMilk: z.number().min(0).max(365).default(305),
  targetFeedEfficiency: z.number().min(0.5).max(3).default(1.5),
});

export interface DairyFeedEfficiencyLossOutput {
  totalAnnualLoss: number;
  breakdown: {
    actualFeedEfficiency: number;
    efficiencyLossRatio: number;
    lossPerCowPerDay: number;
    incomeOverFeedCostPerCowPerDay: number;
    potentialIncomeOverFeedCostPerCowPerDay: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: DairyFeedEfficiencyLossInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.actualFeedEfficiency = ((): number => { try { const __v = input.milkYieldPerCow / input.feedIntakePerCow; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.efficiencyLossRatio = ((): number => { try { const __v = Math.max(0, (input.targetFeedEfficiency - results.actualFeedEfficiency) / input.targetFeedEfficiency); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.milkRevenuePerCowPerDay = ((): number => { try { const __v = input.milkYieldPerCow * input.milkPricePerKg; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.feedCostPerCowPerDay = ((): number => { try { const __v = input.feedIntakePerCow * input.feedCostPerKg; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.incomeOverFeedCostPerCowPerDay = ((): number => { try { const __v = results.milkRevenuePerCowPerDay - results.feedCostPerCowPerDay; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.potentialIncomeOverFeedCostPerCowPerDay = ((): number => { try { const __v = (input.targetFeedEfficiency * input.feedIntakePerCow * input.milkPricePerKg) - results.feedCostPerCowPerDay; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.lossPerCowPerDay = ((): number => { try { const __v = Math.max(0, results.potentialIncomeOverFeedCostPerCowPerDay - results.incomeOverFeedCostPerCowPerDay); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalAnnualLoss = ((): number => { try { const __v = results.lossPerCowPerDay * input.herdSize * input.daysInMilk; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateDairyFeedEfficiencyLoss(input: DairyFeedEfficiencyLossInput): DairyFeedEfficiencyLossOutput {
  const results = evaluateFormulas(input);
  const totalAnnualLoss = results.totalAnnualLoss ?? 0;
  const breakdown = {
    actualFeedEfficiency: results.actualFeedEfficiency,
    efficiencyLossRatio: results.efficiencyLossRatio,
    lossPerCowPerDay: results.lossPerCowPerDay,
    incomeOverFeedCostPerCowPerDay: results.incomeOverFeedCostPerCowPerDay,
    potentialIncomeOverFeedCostPerCowPerDay: results.potentialIncomeOverFeedCostPerCowPerDay,
  };

  // rule: milkYieldPerCow > 0
  // rule: feedIntakePerCow > 0
  // rule: feedCostPerKg > 0
  // rule: milkPricePerKg > 0
  // rule: herdSize > 0
  // rule: daysInMilk >= 0
  // rule: targetFeedEfficiency > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-string): feedEfficiency

  const dataConfidenceAdjusted = (() => { try { return results.totalAnnualLoss * (1 - dataConfidenceAdjustment); } catch { return totalAnnualLoss; } })();

  return {
    totalAnnualLoss,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report with Breakdown"],
  };
}
