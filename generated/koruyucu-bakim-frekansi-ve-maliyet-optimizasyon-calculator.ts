// Auto-generated from koruyucu-bakim-frekansi-ve-maliyet-optimizasyon-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface KoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculatorInput {
  annualOperatingHours: number;
  equipmentCriticality: 'dusuk' | 'orta' | 'yuksek';
  meanTimeBetweenFailure: number;
  meanTimeToRepair: number;
  preventiveMaintenanceDuration: number;
  hourlyProductionLossCost: number;
  hourlyMaintenanceCost: number;
  failureCostPerEvent: number;
  currentPMFrequency: number;
  dataConfidence: 'dusuk' | 'orta' | 'yuksek';
}

export const KoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculatorInputSchema = z.object({
  annualOperatingHours: z.number().min(0).max(8760).default(8760),
  equipmentCriticality: z.enum(['dusuk', 'orta', 'yuksek']).default('orta'),
  meanTimeBetweenFailure: z.number().min(1).max(100000).default(1000),
  meanTimeToRepair: z.number().min(0.1).max(168).default(4),
  preventiveMaintenanceDuration: z.number().min(0.1).max(168).default(2),
  hourlyProductionLossCost: z.number().min(0).max(100000).default(500),
  hourlyMaintenanceCost: z.number().min(0).max(10000).default(200),
  failureCostPerEvent: z.number().min(0).max(1000000).default(10000),
  currentPMFrequency: z.number().min(1).max(8760).default(500),
  dataConfidence: z.enum(['dusuk', 'orta', 'yuksek']).default('orta'),
});

export interface KoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculatorOutput {
  optimalPMFrequencyAdjusted: number;
  breakdown: {
    annualFailureCost: number;
    annualPMCost: number;
    annualDowntimeCost: number;
    totalAnnualCost: number;
    costSavings: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: KoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.failureRate = ((): number => { try { const __v = 1 / input.meanTimeBetweenFailure; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualFailureCount = ((): number => { try { const __v = input.annualOperatingHours * results.failureRate; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualFailureCost = ((): number => { try { const __v = results.annualFailureCount * input.failureCostPerEvent; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualPMCount = ((): number => { try { const __v = input.annualOperatingHours / input.currentPMFrequency; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualPMCost = ((): number => { try { const __v = results.annualPMCount * (input.preventiveMaintenanceDuration * input.hourlyMaintenanceCost); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualDowntimeHours = ((): number => { try { const __v = results.annualFailureCount * input.meanTimeToRepair + results.annualPMCount * input.preventiveMaintenanceDuration; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualDowntimeCost = ((): number => { try { const __v = results.annualDowntimeHours * input.hourlyProductionLossCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalAnnualCost = ((): number => { try { const __v = results.annualFailureCost + results.annualPMCost + results.annualDowntimeCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.optimalPMFrequency = ((): number => { try { const __v = Math.sqrt((2 * input.failureCostPerEvent * input.annualOperatingHours) / (input.hourlyMaintenanceCost * input.preventiveMaintenanceDuration)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.optimalPMFrequencyAdjusted = ((): number => { try { const __v = results.optimalPMFrequency * (input.dataConfidence == 'dusuk' ? 0.8 : (input.dataConfidence == 'yuksek' ? 1.1 : 1.0)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costSavings = ((): number => { try { const __v = results.totalAnnualCost - (input.annualOperatingHours / results.optimalPMFrequencyAdjusted * (input.preventiveMaintenanceDuration * input.hourlyMaintenanceCost) + input.annualOperatingHours * results.failureRate * input.failureCostPerEvent + (input.annualOperatingHours * results.failureRate * input.meanTimeToRepair + (input.annualOperatingHours / results.optimalPMFrequencyAdjusted) * input.preventiveMaintenanceDuration) * input.hourlyProductionLossCost); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateKoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculator(input: KoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculatorInput): KoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculatorOutput {
  const results = evaluateFormulas(input);
  const optimalPMFrequencyAdjusted = results.optimalPMFrequencyAdjusted ?? 0;
  const breakdown = {
    annualFailureCost: results.annualFailureCost,
    annualPMCost: results.annualPMCost,
    annualDowntimeCost: results.annualDowntimeCost,
    totalAnnualCost: results.totalAnnualCost,
    costSavings: results.costSavings,
  };

  // rule: meanTimeBetweenFailure > 0
  // rule: meanTimeToRepair > 0
  // rule: preventiveMaintenanceDuration > 0
  // rule: hourlyProductionLossCost >= 0
  // rule: hourlyMaintenanceCost >= 0
  // rule: failureCostPerEvent >= 0
  // rule: currentPMFrequency > 0
  // rule: annualOperatingHours > 0
  // rule: if equipmentCriticality == 'yuksek' then meanTimeBetweenFailure > 100
  // rule: if dataConfidence == 'dusuk' then apply safety factor 1.2
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Dusuk MTBF: Sik ariza riski, bakim sikligi artirilmali.
  // threshold skipped (non-JS): Yuksek ariza maliyeti: Koruyucu bakim yatirimi oncelikli.
  // threshold skipped (non-JS): Mevcut bakim sikligi MTBF'den buyuk: Bakim yetersiz, ariza riski yuksek.

  const dataConfidenceAdjusted = (() => { try { return results.optimalPMFrequencyAdjusted; } catch { return optimalPMFrequencyAdjusted; } })();

  return {
    optimalPMFrequencyAdjusted,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi (gecmis verilerle karsilastirma)","Detayli maliyet kirilimi raporu"],
  };
}
