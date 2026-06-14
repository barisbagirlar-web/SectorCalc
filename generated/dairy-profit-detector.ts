// Auto-generated from dairy-profit-detector-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface DairyProfitDetectorInput {
  milkPricePerLiter: number;
  milkVolumeLitersPerDay: number;
  fatContentPercent: number;
  proteinContentPercent: number;
  somaticCellCount: number;
  totalBacterialCount: number;
  feedCostPerCowPerDay: number;
  numberOfCows: number;
  laborCostPerHour: number;
  laborHoursPerDay: number;
  energyCostPerKwh: number;
  energyKwhPerDay: number;
  waterCostPerLiter: number;
  waterLitersPerDay: number;
  veterinaryCostPerCowPerYear: number;
  mortalityRatePercent: number;
  replacementCostPerCow: number;
  milkPricePremiumPerLiter: number;
  dataConfidence: number;
}

export const DairyProfitDetectorInputSchema = z.object({
  milkPricePerLiter: z.number().min(0).default(0.5),
  milkVolumeLitersPerDay: z.number().min(0).default(10000),
  fatContentPercent: z.number().min(0).max(10).default(3.5),
  proteinContentPercent: z.number().min(0).max(6).default(3.2),
  somaticCellCount: z.number().min(0).max(1000000).default(200000),
  totalBacterialCount: z.number().min(0).max(100000).default(10000),
  feedCostPerCowPerDay: z.number().min(0).default(5),
  numberOfCows: z.number().min(0).default(500),
  laborCostPerHour: z.number().min(0).default(15),
  laborHoursPerDay: z.number().min(0).default(40),
  energyCostPerKwh: z.number().min(0).default(0.12),
  energyKwhPerDay: z.number().min(0).default(500),
  waterCostPerLiter: z.number().min(0).default(0.001),
  waterLitersPerDay: z.number().min(0).default(20000),
  veterinaryCostPerCowPerYear: z.number().min(0).default(100),
  mortalityRatePercent: z.number().min(0).max(100).default(2),
  replacementCostPerCow: z.number().min(0).default(1500),
  milkPricePremiumPerLiter: z.number().min(0).default(0),
  dataConfidence: z.number().min(0).max(100).default(90),
});

export interface DairyProfitDetectorOutput {
  dailyProfit: number;
  breakdown: {
    dailyMilkRevenue: number;
    dailyFeedCost: number;
    dailyLaborCost: number;
    dailyEnergyCost: number;
    dailyWaterCost: number;
    dailyVetCost: number;
    dailyReplacementCost: number;
    dailyTotalCost: number;
    profitMargin: number;
    costPerLiter: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: DairyProfitDetectorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.dailyMilkRevenue = ((): number => { try { const __v = input.milkVolumeLitersPerDay * (input.milkPricePerLiter + input.milkPricePremiumPerLiter); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dailyFeedCost = ((): number => { try { const __v = input.feedCostPerCowPerDay * input.numberOfCows; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dailyLaborCost = ((): number => { try { const __v = input.laborCostPerHour * input.laborHoursPerDay; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dailyEnergyCost = ((): number => { try { const __v = input.energyCostPerKwh * input.energyKwhPerDay; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dailyWaterCost = ((): number => { try { const __v = input.waterCostPerLiter * input.waterLitersPerDay; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dailyVetCost = ((): number => { try { const __v = input.veterinaryCostPerCowPerYear * input.numberOfCows / 365; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dailyReplacementCost = ((): number => { try { const __v = input.replacementCostPerCow * input.numberOfCows * (input.mortalityRatePercent / 100) / 365; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dailyTotalCost = ((): number => { try { const __v = results.dailyFeedCost + results.dailyLaborCost + results.dailyEnergyCost + results.dailyWaterCost + results.dailyVetCost + results.dailyReplacementCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dailyProfit = ((): number => { try { const __v = results.dailyMilkRevenue - results.dailyTotalCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.profitMargin = ((): number => { try { const __v = results.dailyProfit / results.dailyMilkRevenue * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerLiter = ((): number => { try { const __v = results.dailyTotalCost / input.milkVolumeLitersPerDay; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedProfit = ((): number => { try { const __v = results.dailyProfit * (input.dataConfidence / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateDairyProfitDetector(input: DairyProfitDetectorInput): DairyProfitDetectorOutput {
  const results = evaluateFormulas(input);
  const dailyProfit = results.dailyProfit ?? 0;
  const breakdown = {
    dailyMilkRevenue: results.dailyMilkRevenue,
    dailyFeedCost: results.dailyFeedCost,
    dailyLaborCost: results.dailyLaborCost,
    dailyEnergyCost: results.dailyEnergyCost,
    dailyWaterCost: results.dailyWaterCost,
    dailyVetCost: results.dailyVetCost,
    dailyReplacementCost: results.dailyReplacementCost,
    dailyTotalCost: results.dailyTotalCost,
    profitMargin: results.profitMargin,
    costPerLiter: results.costPerLiter,
  };

  // rule: milkVolumeLitersPerDay > 0
  // rule: numberOfCows > 0
  // rule: feedCostPerCowPerDay >= 0
  // rule: laborCostPerHour >= 0
  // rule: energyCostPerKwh >= 0
  // rule: waterCostPerLiter >= 0
  // rule: veterinaryCostPerCowPerYear >= 0
  // rule: mortalityRatePercent >= 0 and mortalityRatePercent <= 100
  // rule: somaticCellCount >= 0
  // rule: totalBacterialCount >= 0
  // rule: fatContentPercent >= 0 and fatContentPercent <= 10
  // rule: proteinContentPercent >= 0 and proteinContentPercent <= 6
  // rule: dataConfidence >= 0 and dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if somaticCellCount > 400000 then 'High SCC: milk quality penalty likely'
  // threshold skipped (non-JS): if totalBacterialCount > 100000 then 'High TBC: hygiene issue, shelf life reduced'
  // threshold skipped (non-JS): if mortalityRatePercent > 5 then 'High mortality: investigate health management'
  // threshold skipped (non-JS): if fatContentPercent < 3.0 then 'Low fat: may affect product yield'
  // threshold skipped (non-JS): if proteinContentPercent < 3.0 then 'Low protein: cheese yield impacted'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedProfit; } catch { return dailyProfit; } })();

  return {
    dailyProfit,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report with Charts"],
  };
}
