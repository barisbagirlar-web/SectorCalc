// Auto-generated from cnc-oee-loss-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface CncOeeLossInput {
  plannedProductionTime: number;
  operatingTime: number;
  idealCycleTime: number;
  totalPartsProduced: number;
  goodPartsProduced: number;
  downtimeLoss: number;
  speedLossFactor: number;
  defectRate: number;
  costPerPart: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const CncOeeLossInputSchema = z.object({
  plannedProductionTime: z.number().min(0).max(1440).default(480),
  operatingTime: z.number().min(0).max(1440).default(450),
  idealCycleTime: z.number().min(0.001).max(100).default(0.5),
  totalPartsProduced: z.number().min(0).max(100000).default(800),
  goodPartsProduced: z.number().min(0).max(100000).default(760),
  downtimeLoss: z.number().min(0).max(1440).default(30),
  speedLossFactor: z.number().min(0).max(1).default(0.9),
  defectRate: z.number().min(0).max(1).default(0.05),
  costPerPart: z.number().min(0).max(10000).default(10),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface CncOeeLossOutput {
  oee: number;
  breakdown: {
    availability: number;
    performance: number;
    quality: number;
    totalLossCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: CncOeeLossInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.availability = (() => { try { return input.operatingTime / input.plannedProductionTime; } catch { return 0; } })();
  results.performance = (() => { try { return (input.idealCycleTime * input.totalPartsProduced) / input.operatingTime; } catch { return 0; } })();
  results.quality = (() => { try { return input.goodPartsProduced / input.totalPartsProduced; } catch { return 0; } })();
  results.oee = (() => { try { return results.availability * results.performance * results.quality; } catch { return 0; } })();
  results.totalLossCost = (() => { try { return (input.plannedProductionTime - input.operatingTime) * (input.costPerPart / input.idealCycleTime) + (input.totalPartsProduced - input.goodPartsProduced) * input.costPerPart; } catch { return 0; } })();
  results.dataConfidenceAdjusted = (() => { try { return results.oee * (input.dataConfidence == 'high' ? 1 : input.dataConfidence == 'medium' ? 0.95 : 0.9); } catch { return 0; } })();
  return results;
}

export function calculateCncOeeLoss(input: CncOeeLossInput): CncOeeLossOutput {
  const results = evaluateFormulas(input);
  const oee = results.oee ?? 0;
  const breakdown = {
    availability: results.availability,
    performance: results.performance,
    quality: results.quality,
    totalLossCost: results.totalLossCost,
  };

  // rule: operatingTime <= plannedProductionTime
  // rule: totalPartsProduced >= goodPartsProduced
  // rule: idealCycleTime > 0
  // rule: defectRate >= 0 and defectRate <= 1
  // rule: speedLossFactor >= 0 and speedLossFactor <= 1
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Critical: Defect rate exceeds 5% threshold.
  // threshold skipped (non-JS): Warning: Availability below 90%.
  // threshold skipped (non-JS): Warning: Performance below 90%.
  // threshold skipped (non-JS): Warning: Quality below 95%.
  // threshold skipped (non-JS): Critical: OEE below world-class 85%.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return oee; } })();

  return {
    oee,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Loss Breakdown Report"],
  };
}
